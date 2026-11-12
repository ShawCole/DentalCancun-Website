import { NextRequest, NextResponse } from "next/server";
import { formatWhen, getRules, getSlots, Tipo } from "@/lib/agenda/slots";
import { requestMail } from "@/lib/agenda/mailtext";
import { calendarConfigured, createEvent } from "@/lib/server/google";
import { clinicEmail, rateLimited, sendMail } from "@/lib/server/mail";
import { manageConfigured, manageLink, manageToken, personKey, saveAppointment, siteUrl, updateAppointment } from "@/lib/server/records";
import { stripe, stripeConfigured } from "@/lib/server/stripe";
import { verifyTurnstile } from "@/lib/server/turnstile";

export const dynamic = "force-dynamic";

const clean = (v: unknown, max = 200) => String(v ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);

export async function POST(req: NextRequest) {
    const ip = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
    if (rateLimited(`book:${ip}`)) return NextResponse.json({ ok: false, error: "limit" }, { status: 429 });

    const p = await req.json().catch(() => ({}));
    if (p.empresa) return NextResponse.json({ ok: false, error: "data" }, { status: 400 }); // honeypot
    if (!(await verifyTurnstile(clean(p.turnstile, 4000), ip))) return NextResponse.json({ ok: false, error: "robot" }, { status: 403 });
    const tipo: Tipo = p.tipo === "clinica" ? "clinica" : "virtual";
    const lang = p.idioma === "en" ? "en" : "es";
    const ts = Number(p.ts);
    const nombre = clean(p.nombre, 120);
    const correo = clean(p.correo, 160);
    const whatsapp = clean(p.whatsapp, 40);
    const pais = clean(p.pais, 80);
    const notas = clean(p.notas, 1000);
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
    const wantsDeposit = rules.depositUsd > 0 && rules.depositFor.includes(tipo) && stripeConfigured() && manageConfigured();
    const details = [
        `Tipo: ${tipoEs}`,
        `Nombre: ${nombre}`,
        `WhatsApp: ${whatsapp}`,
        `Correo: ${correo}`,
        `País: ${pais}`,
        `Idioma: ${lang.toUpperCase()}`,
        `Notas: ${notas}`,
        `Estado: solicitada (confirmar por WhatsApp)`,
        wantsDeposit ? `Anticipo: USD ${rules.depositUsd} (pendiente)` : "",
    ].filter(Boolean).join("\n");

    let eventId: string | undefined;
    if (calendarConfigured()) {
        try {
            eventId = (await createEvent({ summary: `[${tipoEs} · por confirmar] ${nombre}`, description: details, start, end, colorId: tipo === "virtual" ? "7" : "6" }))?.id;
        } catch (e) {
            console.error("[agenda] event not created", e);
            return NextResponse.json({ ok: false, error: "calendar" }, { status: 503 });
        }
    }

    // Record for the CRM, reminders and the patient's manage link.
    let id: string | null = null;
    try {
        id = await saveAppointment({
            tipo, nombre, correo, whatsapp, pais, idioma: lang, notas,
            start: ts, end: end.getTime(), eventId, estado: "por confirmar", reminderSent: false,
            deposit: wantsDeposit ? { usd: rules.depositUsd, status: "pendiente" } : undefined,
            key: personKey(whatsapp, correo),
        });
    } catch (e) {
        console.error("[agenda] appointment not recorded", e);
    }
    const manage = id && manageConfigured() ? manageLink(id, lang) : undefined;

    let payUrl: string | undefined;
    if (wantsDeposit && id) {
        try {
            const back = `${siteUrl()}/${lang}/cita?id=${id}&t=${manageToken(id)}`;
            const session = await stripe()!.checkout.sessions.create({
                mode: "payment",
                customer_email: correo,
                locale: lang,
                line_items: [{
                    quantity: 1,
                    price_data: {
                        currency: "usd",
                        unit_amount: Math.round(rules.depositUsd * 100),
                        product_data: { name: lang === "es" ? `Anticipo · ${tipoEs}` : `Deposit · ${tipo === "virtual" ? "Video call" : "In-clinic consultation"}` },
                    },
                }],
                metadata: { appointmentId: id },
                success_url: `${back}&pago=ok`,
                cancel_url: `${back}&pago=cancelado`,
                expires_at: Math.floor(Date.now() / 1000) + 23 * 3600,
            });
            payUrl = session.url || undefined;
            await updateAppointment(id, { "deposit.sessionId": session.id });
        } catch (e) {
            console.error("[agenda] Stripe session failed", e);
        }
    }

    const whenEs = formatWhen(ts, "es");
    const when = formatWhen(ts, lang);
    try {
        if (clinicEmail()) await sendMail({ to: clinicEmail(), replyTo: correo, subject: `[Agenda] ${tipoEs} · ${nombre} · ${whenEs}`, text: `${details}\n\nFecha: ${whenEs} (hora de Cancún)` });
        await sendMail({ to: correo, ...requestMail({ lang, nombre, tipo, when, manage, payUrl, depositUsd: rules.depositUsd }) });
    } catch (e) {
        console.error("[agenda] mail failed", e);
    }

    return NextResponse.json({ ok: true, when, calendar: calendarConfigured(), payUrl, depositUsd: payUrl ? rules.depositUsd : undefined, manage });
}
