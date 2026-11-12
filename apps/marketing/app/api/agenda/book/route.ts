import { NextRequest, NextResponse } from "next/server";
import { formatWhen, getRules, getSlots, Tipo } from "@/lib/agenda/slots";
import { calendarConfigured, createEvent } from "@/lib/server/google";
import { clinicEmail, rateLimited, sendMail } from "@/lib/server/mail";

export const dynamic = "force-dynamic";

const clean = (v: unknown, max = 200) => String(v ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);

export async function POST(req: NextRequest) {
    const ip = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
    if (rateLimited(`book:${ip}`)) return NextResponse.json({ ok: false, error: "limit" }, { status: 429 });

    const p = await req.json().catch(() => ({}));
    if (p.empresa) return NextResponse.json({ ok: false, error: "data" }, { status: 400 }); // honeypot
    const tipo: Tipo = p.tipo === "clinica" ? "clinica" : "virtual";
    const lang = p.idioma === "en" ? "en" : "es";
    const ts = Number(p.ts);
    const nombre = clean(p.nombre, 120);
    const correo = clean(p.correo, 160);
    const whatsapp = clean(p.whatsapp, 40);
    if (!nombre || !/^\S+@\S+\.\S+$/.test(correo) || whatsapp.replace(/\D/g, "").length < 8 || !p.privacidad || !Number.isFinite(ts)) {
        return NextResponse.json({ ok: false, error: "missing" }, { status: 422 });
    }

    // Check again that the slot is still free right before booking it.
    const { days, error } = await getSlots(tipo);
    if (error) return NextResponse.json({ ok: false, error: "calendar" }, { status: 503 });
    const free = days.some((d) => d.slots.some((s) => s.ts === ts && s.free));
    if (!free) return NextResponse.json({ ok: false, error: "taken" }, { status: 409 });

    const rules = await getRules();
    const start = new Date(ts);
    const end = new Date(ts + rules.minutes[tipo] * 60_000);
    const tipoEs = tipo === "virtual" ? "Videollamada" : "Valoración en clínica";
    const details = [
        `Tipo: ${tipoEs}`,
        `Nombre: ${nombre}`,
        `WhatsApp: ${whatsapp}`,
        `Correo: ${correo}`,
        `País: ${clean(p.pais, 80)}`,
        `Idioma: ${lang.toUpperCase()}`,
        `Notas: ${clean(p.notas, 1000)}`,
        `Estado: solicitada (confirmar por WhatsApp)`,
    ].join("\n");

    if (calendarConfigured()) {
        try {
            await createEvent({ summary: `[${tipoEs} · por confirmar] ${nombre}`, description: details, start, end, colorId: tipo === "virtual" ? "7" : "6" });
        } catch (e) {
            console.error("[agenda] event not created", e);
            return NextResponse.json({ ok: false, error: "calendar" }, { status: 503 });
        }
    }

    const whenEs = formatWhen(ts, "es");
    const when = formatWhen(ts, lang);
    try {
        if (clinicEmail()) await sendMail({ to: clinicEmail(), replyTo: correo, subject: `[Agenda] ${tipoEs} · ${nombre} · ${whenEs}`, text: `${details}\n\nFecha: ${whenEs} (hora de Cancún)` });
        await sendMail({
            to: correo,
            subject: lang === "es" ? "Recibimos tu solicitud de cita · Dental Solutions" : "We got your appointment request · Dental Solutions",
            text:
                lang === "es"
                    ? `Hola ${nombre}:\n\nRecibimos tu solicitud de ${tipoEs.toLowerCase()} para el ${when} (hora de Cancún).\nNuestro concierge te escribirá por WhatsApp para confirmarla.\n\nDental Solutions Puerto Cancún`
                    : `Hi ${nombre},\n\nWe got your request for a ${tipo === "virtual" ? "video call" : "consultation at our clinic"} on ${when} (Cancun time).\nOur concierge will text you on WhatsApp to confirm.\n\nDental Solutions Puerto Cancún`,
        });
    } catch (e) {
        console.error("[agenda] mail failed", e);
    }

    return NextResponse.json({ ok: true, when, calendar: calendarConfigured() });
}
