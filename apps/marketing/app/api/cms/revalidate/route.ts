import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { cmsTag } from "@/lib/cms/content";
import { getPageDef } from "@/lib/cms/schema";

/**
 * Called by the admin panel after saving a page, so the public site
 * shows the change right away. Only signed-in panel users can call it.
 * Verifying an ID token only needs the project id (no secret key).
 */
function verifier() {
    const name = "cms-verify";
    const existing = getApps().find((a) => a.name === name);
    const app = existing || initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID }, name);
    return getAuth(app);
}

export async function POST(req: NextRequest) {
    const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
        return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
    try {
        await verifier().verifyIdToken(token);
    } catch {
        return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    const { pageId } = await req.json().catch(() => ({ pageId: "" }));
    const def = typeof pageId === "string" ? getPageDef(pageId) : undefined;
    if (!def) return NextResponse.json({ ok: false, error: "unknown page" }, { status: 400 });

    revalidateTag(cmsTag(def.id));
    // Site-wide data (contact, logo) appears on every page.
    if (def.id === "site") {
        revalidatePath("/es", "layout");
        revalidatePath("/en", "layout");
    }
    return NextResponse.json({ ok: true });
}
