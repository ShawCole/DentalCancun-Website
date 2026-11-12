import { NextRequest, NextResponse } from "next/server";
import { clinicEmail, mailConfigured, rateLimited, sendMail } from "@/lib/server/mail";
import { savePhotoSubmission } from "@/lib/server/records";
import { verifyTurnstile } from "@/lib/server/turnstile";

export const dynamic = "force-dynamic";

const SLOTS = ["sonrisa", "lado-derecho", "lado-izquierdo", "arriba", "abajo"];
const MAX = 2.5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];
const clean = (v: FormDataEntryValue | null, max = 200) => String(v ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);

export async function POST(req: NextRequest) {
    const ip = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
    if (rateLimited(`fotos:${ip}`, 4)) return NextResponse.json({ ok: false, error: "limit" }, { status: 429 });
    const f = await req.formData().catch(() => null);
    if (!f) return NextResponse.json({ ok: false, error: "data" }, { status: 400 });
    if (clean(f.get("empresa"))) return NextResponse.json({ ok: false, error: "data" }, { status: 400 });
    if (!(await verifyTurnstile(clean(f.get("cf-turnstile-response"), 4000), ip))) return NextResponse.json({ ok: false, error: "robot" }, { status: 403 });

    const nombre = clean(f.get("nombre"), 120);
    const correo = clean(f.get("correo"), 160);
    const whatsapp = clean(f.get("whatsapp"), 40);
    const lang = clean(f.get("idioma")) === "en" ? "en" : "es";
    if (!nombre || !/^\S+@\S+\.\S+$/.test(correo) || whatsapp.replace(/\D/g, "").length < 8 || !f.get("privacidad")) {
        return NextResponse.json({ ok: false, error: "missing" }, { status: 422 });
    }

    const attachments: { filename: string; content: Buffer; contentType: string }[] = [];
    for (const [i, slot] of SLOTS.entries()) {
        const file = f.get(`foto_${i + 1}`);
        if (!(file instanceof File) || !file.size) continue;
        if (!TYPES.includes(file.type) || file.size > MAX) return NextResponse.json({ ok: false, error: "file" }, { status: 413 });
        attachments.push({ filename: `${i + 1}-${slot}.${file.type.split("/")[1].replace("jpeg", "jpg")}`, content: Buffer.from(await file.arrayBuffer()), contentType: file.type });
    }
    if (!attachments.length) return NextResponse.json({ ok: false, error: "nophotos" }, { status: 422 });
    if (!mailConfigured()) return NextResponse.json({ ok: false, error: "mail" }, { status: 503 });

    const lines = [
        `Nombre: ${nombre}`,
        `WhatsApp: ${whatsapp}`,
        `Correo: ${correo}`,
        `País: ${clean(f.get("pais"), 80)}`,
        `Quiere mejorar: ${clean(f.get("necesidad"), 120)}`,
        `Idioma: ${lang.toUpperCase()}`,
        `Fotos: ${attachments.length} de 5`,
    ];
    try {
        await sendMail({ to: clinicEmail(), replyTo: correo, subject: `[Fotos · valoración] ${nombre} · ${attachments.length}/5`, text: lines.join("\n"), attachments });
        await sendMail({
            to: correo,
            subject: lang === "es" ? "Recibimos tus fotos · Dental Solutions" : "We got your photos · Dental Solutions",
            text:
                lang === "es"
                    ? `Hola ${nombre}:\n\nRecibimos tus fotos. Nuestro equipo las revisa y te escribe por WhatsApp en máximo 24 horas.\n\nDental Solutions Puerto Cancún`
                    : `Hi ${nombre},\n\nWe got your photos. Our team will review them and text you on WhatsApp within 24 hours.\n\nDental Solutions Puerto Cancún`,
        });
    } catch (e) {
        console.error("[fotos] mail failed", e);
        return NextResponse.json({ ok: false, error: "mail" }, { status: 502 });
    }
    // Only the contact data goes to the CRM; the photos stay in the clinic's inbox.
    await savePhotoSubmission({ nombre, correo, whatsapp, pais: clean(f.get("pais"), 80), necesidad: clean(f.get("necesidad"), 120), idioma: lang, fotos: attachments.length }).catch((e) => console.error("[fotos] not recorded", e));
    return NextResponse.json({ ok: true, count: attachments.length });
}
