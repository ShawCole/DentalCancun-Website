import { NextRequest, NextResponse } from "next/server";
import { formatWhen } from "@/lib/agenda/slots";
import { calendarConfigured, patchEvent } from "@/lib/server/google";
import { clinicEmail, sendMail } from "@/lib/server/mail";
import { getAppointment, updateAppointment } from "@/lib/server/records";
import { stripe } from "@/lib/server/stripe";

export const dynamic = "force-dynamic";

/** Stripe tells us when a deposit is paid. Add this URL in Stripe → Webhooks (checkout.session.completed). */
export async function POST(req: NextRequest) {
    const s = stripe();
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    const sig = req.headers.get("stripe-signature");
    if (!s || !secret || !sig) return NextResponse.json({ ok: false }, { status: 400 });
    let event;
    try {
        event = s.webhooks.constructEvent(await req.text(), sig, secret);
    } catch {
        return NextResponse.json({ ok: false, error: "signature" }, { status: 400 });
    }
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const id = session.metadata?.appointmentId;
        const a = id ? await getAppointment(id) : null;
        if (a && session.payment_status === "paid") {
            await updateAppointment(a.id, { "deposit.status": "pagado", "deposit.paidAt": Date.now(), "deposit.sessionId": session.id });
            if (a.eventId && calendarConfigured()) {
                await patchEvent(a.eventId, { summary: `[${a.tipo === "virtual" ? "Videollamada" : "Valoración en clínica"} · anticipo pagado] ${a.nombre}`, colorId: "10" }).catch(() => undefined);
            }
            if (clinicEmail()) {
                await sendMail({
                    to: clinicEmail(),
                    subject: `[Agenda] Anticipo pagado · ${a.nombre} · USD ${(session.amount_total || 0) / 100}`,
                    text: `${a.nombre} pagó el anticipo de su cita del ${formatWhen(a.start, "es")}.\nWhatsApp: ${a.whatsapp}\nStripe: ${session.id}`,
                }).catch(() => undefined);
            }
        }
    }
    return NextResponse.json({ received: true });
}
