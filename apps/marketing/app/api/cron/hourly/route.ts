import { NextRequest, NextResponse } from "next/server";
import { formatWhen } from "@/lib/agenda/slots";
import { reminderMail } from "@/lib/agenda/mailtext";
import { getPageContent } from "@/lib/cms/content";
import { cronAllowed } from "@/lib/server/cron";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { sendMail } from "@/lib/server/mail";
import { manageConfigured, manageLink, type Appointment } from "@/lib/server/records";

export const dynamic = "force-dynamic";

/** Every hour: e-mail a reminder to patients whose appointment starts in about 24 hours. */
export async function POST(req: NextRequest) {
    if (!cronAllowed(req)) return NextResponse.json({ ok: false }, { status: 401 });
    const db = adminDb();
    if (!db) return NextResponse.json({ ok: false, error: "firebase-admin not configured" }, { status: 503 });
    const now = Date.now();
    const snap = await db.collection("appointments").where("start", ">=", now + 20 * 3600_000).where("start", "<=", now + 26 * 3600_000).get();
    const site = { es: await getPageContent("site", "es"), en: await getPageContent("site", "en") };
    let sent = 0;
    for (const d of snap.docs) {
        const a = { id: d.id, ...(d.data() as Omit<Appointment, "id">) };
        if (a.reminderSent || ["cancelada", "asistió", "no asistió"].includes(a.estado)) continue;
        try {
            await sendMail({
                to: a.correo,
                ...reminderMail({ lang: a.idioma, nombre: a.nombre, tipo: a.tipo, when: formatWhen(a.start, a.idioma), manage: manageConfigured() ? manageLink(a.id, a.idioma) : undefined, address: site[a.idioma].contact?.address }),
            });
            await d.ref.update({ reminderSent: true });
            sent++;
        } catch (e) {
            console.error("[cron] reminder failed", a.id, e);
        }
    }
    return NextResponse.json({ ok: true, sent });
}
