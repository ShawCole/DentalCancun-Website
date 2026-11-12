import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { cmsTag } from "@/lib/cms/content";
import { getPageDef } from "@/lib/cms/schema";
import { panelUser } from "@/lib/server/auth";

/**
 * Called by the admin panel after saving, so the public site shows the
 * change right away. Only panel users (admin or staff) can call it.
 */
const ALLOWED = /^(cms|settings|builder|blog):[a-z0-9_~\-]{1,120}$/i;

export async function POST(req: NextRequest) {
    const user = await panelUser(req.headers.get("authorization"), ["admin", "staff"]);
    if (!user) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const tags: string[] = [];
    if (typeof body.pageId === "string") {
        const def = getPageDef(body.pageId);
        if (!def) return NextResponse.json({ ok: false, error: "unknown page" }, { status: 400 });
        tags.push(cmsTag(def.id));
        // Site-wide data (contact, logo) appears on every page.
        if (def.id === "site") {
            revalidatePath("/es", "layout");
            revalidatePath("/en", "layout");
        }
    }
    if (Array.isArray(body.tags)) for (const t of body.tags) if (typeof t === "string" && ALLOWED.test(t)) tags.push(t);
    if (!tags.length) return NextResponse.json({ ok: false, error: "nothing to refresh" }, { status: 400 });
    for (const t of tags) revalidateTag(t);
    return NextResponse.json({ ok: true, tags });
}
