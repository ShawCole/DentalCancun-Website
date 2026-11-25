import { NextRequest, NextResponse } from "next/server";
import { formatWhen, getRules, getSlots } from "@/lib/agenda/slots";
import { changeMail } from "@/lib/agenda/mailtext";
import { calendarConfigured, deleteEvent, patchEvent } from "@/lib/server/google";
import { clinicEmail, rateLimited, sendMail } from "@/lib/server/mail";
import { getAppointment, updateAppointment, validToken } from "@/lib/server/records";

export const dynamic = "force-dynamic";

/** The patient's own link to see, move or cancel an appointment. */
async function load(id: string, t: string) {
    if (!validToken(id, t)) return null;
    return getAppointment(id);
}

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id") || "";
    const a = await load(id, req.nextUrl.searchParams.get("t") || "");
    if (!a) return NextResponse.json({ ok: false }, { status: 404 });
    const rules = await getRules();
    const open = a.estado !== "cancelada" && a.start - Date.now() > rules.noticeMin * 60_000;
    return NextResponse.json({
        ok: true,
        tipo: a.tipo,
        nombre: a.nombre.split(" ")[0],
        start: a.start,
        estado: a.estado,
        deposit: a.deposit ? { usd: a.deposit.usd, status: a.deposit.status } : null,
        canChange: open,
    });
}

export async function POST(req: NextRequest) {
    const ip = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
    if (rateLimited(`manage:${ip}`, 10)) return NextResponse.json({ ok: false, error: "limit" }, { status: 429 });
    const p = await req.json().catch(() => ({}));
    const a = await load(String(p.id || ""), String(p.t || ""));
    if (!a) return NextResponse.json({ ok: false }, { status: 404 });
    const rules = await getRules();
    if (a.estado === "cancelada" || a.start - Date.now() <= rules.noticeMin * 60_000) return NextResponse.json({ ok: false, error: "late" }, { status: 409 });
    const lang = a.idioma;
    const oldWhen = formatWhen(a.start, "es");

    if (p.action === "cancel") {
        if (a.eventId && calendarConfigured()) await deleteEvent(a.eventId).catch((e) => console.error("[manage] delete", e));
        await updateAppointment(a.id, { estado: "cancelada" });
        await sendMail({ to: a.correo, ...changeMail({ lang, nombre: a.nombre, action: "cancel", when: formatWhen(a.start, lang) }) }).catch(() => undefined);
        if (clinicEmail()) await sendMail({ to: clinicEmail(), subject: `[Agenda] Cancelada por el paciente · ${a.nombre} · ${oldWhen}`, text: `${a.nombre} canceló su cita del ${oldWhen}.\nWhatsApp: ${a.whatsapp}${a.deposit?.status === "pagado" ? "\nTenía anticipo pagado: revisar política de cancelación." : ""}` }).catch(() => undefined);
        return NextResponse.json({ ok: true });
    }

    if (p.action === "reschedule") {
        const ts = Number(p.ts);
        const { days, error } = await getSlots(a.tipo);
        if (error) return NextResponse.json({ ok: false, error: "calendar" }, { status: 503 });
        if (!days.some((d) => d.slots.some((s) => s.ts === ts && s.free))) return NextResponse.json({ ok: false, error: "taken" }, { status: 409 });
        const end = ts + rules.minutes[a.tipo] * 60_000;
        if (a.eventId && calendarConfigured()) {
            try {
                await patchEvent(a.eventId, { start: new Date(ts), end: new Date(end), summary: `[${a.tipo === "virtual" ? "Videollamada" : "Valoración en clínica"} · reprogramada] ${a.nombre}` });
            } catch (e) {
                console.error("[manage] patch", e);
                return NextResponse.json({ ok: false, error: "calendar" }, { status: 503 });
            }
        }
        await updateAppointment(a.id, { start: ts, end, estado: "reprogramada", reminderSent: false });
        const when = formatWhen(ts, lang);
        await sendMail({ to: a.correo, ...changeMail({ lang, nombre: a.nombre, action: "reschedule", when }) }).catch(() => undefined);
        if (clinicEmail()) await sendMail({ to: clinicEmail(), subject: `[Agenda] Reprogramada · ${a.nombre}`, text: `${a.nombre} movió su cita del ${oldWhen} al ${formatWhen(ts, "es")}.\nWhatsApp: ${a.whatsapp}` }).catch(() => undefined);
        return NextResponse.json({ ok: true, when });
    }
    return NextResponse.json({ ok: false, error: "action" }, { status: 400 });
}
