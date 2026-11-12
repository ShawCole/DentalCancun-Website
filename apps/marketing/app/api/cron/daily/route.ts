import { NextRequest, NextResponse } from "next/server";
import { cronAllowed } from "@/lib/server/cron";
import { adminBucket, adminDb } from "@/lib/server/firebaseAdmin";

export const dynamic = "force-dynamic";

/** Site content collections included in the daily backup (patient data is excluded). */
const CONTENT = ["cms_pages", "cms_settings", "cms_media", "builder_pages", "builder_drafts", "blog_posts"];
const KEEP_DAYS = 30;

/** Every day: copy the site content to Firebase Storage (backups/), keeping 30 days. */
export async function POST(req: NextRequest) {
    if (!cronAllowed(req)) return NextResponse.json({ ok: false }, { status: 401 });
    const db = adminDb();
    const bucket = adminBucket();
    if (!db || !bucket) return NextResponse.json({ ok: false, error: "firebase-admin not configured" }, { status: 503 });
    const out: Record<string, Record<string, unknown>> = {};
    for (const c of CONTENT) {
        const snap = await db.collection(c).get();
        out[c] = Object.fromEntries(snap.docs.map((d) => [d.id, d.data()]));
    }
    const day = new Date().toISOString().slice(0, 10);
    await bucket.file(`backups/contenido-${day}.json`).save(JSON.stringify({ createdAt: new Date().toISOString(), collections: out }), { contentType: "application/json", resumable: false });
    const [files] = await bucket.getFiles({ prefix: "backups/" });
    const limit = new Date(Date.now() - KEEP_DAYS * 86_400_000).toISOString().slice(0, 10);
    let removed = 0;
    for (const f of files) {
        const m = f.name.match(/(\d{4}-\d{2}-\d{2})\.json$/);
        if (m && m[1] < limit) {
            await f.delete().catch(() => undefined);
            removed++;
        }
    }
    return NextResponse.json({ ok: true, file: `backups/contenido-${day}.json`, removed });
}
