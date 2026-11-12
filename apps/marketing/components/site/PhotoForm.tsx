"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Turnstile } from "./Turnstile";
import type { Lang, SectionValues } from "@/lib/cms/schema";

const L = {
    es: {
        name: "Nombre",
        email: "Correo",
        whatsapp: "WhatsApp con código de país",
        country: "País",
        need: "¿Qué te gustaría mejorar?",
        choose: "Elige una opción",
        needs: ["Color", "Forma o tamaño", "Espacios", "Dientes desalineados", "Desgaste o fracturas", "Dientes faltantes", "Varias cosas"],
        example: "Ejemplo",
        add: "Agregar foto",
        change: "Cambiar foto",
        privacyPre: "Acepto el ",
        privacy: "aviso de privacidad",
        privacyPost: " y autorizo que el equipo clínico revise mis fotos.",
        privacyUrl: "/es/aviso-de-privacidad",
        privacyNote: "Tus fotos se guardan en privado y solo las ve nuestro equipo clínico.",
        sending: "Enviando tus fotos…",
        check: "Revisa tu nombre, correo, WhatsApp y el aviso de privacidad.",
        min: "Agrega al menos una foto.",
        error: "No pudimos enviar tus fotos. Inténtalo de nuevo o mándalas por WhatsApp.",
        wa: "Prefiero mandarlas por WhatsApp",
        waMsg: "Hola, quiero enviar mis fotos para una valoración.",
    },
    en: {
        name: "Name",
        email: "Email",
        whatsapp: "WhatsApp with country code",
        country: "Country",
        need: "What would you like to improve?",
        choose: "Choose an option",
        needs: ["Color", "Shape or size", "Gaps", "Crooked teeth", "Wear or chips", "Missing teeth", "A few things"],
        example: "Example",
        add: "Add photo",
        change: "Change photo",
        privacyPre: "I accept the ",
        privacy: "privacy notice",
        privacyPost: " and allow the dental team to review my photos.",
        privacyUrl: "/en/privacy-notice",
        privacyNote: "Your photos are stored privately and only our dental team can see them.",
        sending: "Sending your photos…",
        check: "Please check your name, email, WhatsApp and the privacy notice.",
        min: "Please add at least one photo.",
        error: "We couldn’t send your photos. Please try again or send them on WhatsApp.",
        wa: "I’d rather send them on WhatsApp",
        waMsg: "Hi, I’d like to send my photos for a free evaluation.",
    },
};

/** Shrinks a photo in the browser (max 1600 px, JPEG) so it uploads fast on mobile data. */
async function shrink(file: File): Promise<Blob> {
    const bmp = await createImageBitmap(file).catch(() => null);
    if (!bmp) return file;
    const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale);
    c.height = Math.round(bmp.height * scale);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    for (const q of [0.82, 0.7, 0.6]) {
        const b: Blob | null = await new Promise((r) => c.toBlob(r, "image/jpeg", q));
        if (b && b.size < 1_100_000) return b;
    }
    return new Promise((r) => c.toBlob((b) => r(b || file), "image/jpeg", 0.5));
}

export function PhotoForm({ lang, c, whatsapp }: { lang: Lang; c: SectionValues; whatsapp: string }) {
    const t = L[lang];
    const [files, setFiles] = useState<(File | null)[]>([null, null, null, null, null]);
    const [previews, setPreviews] = useState<string[]>(["", "", "", "", ""]);
    const [msg, setMsg] = useState("");
    const [busy, setBusy] = useState(false);
    const [sent, setSent] = useState(false);

    function pick(i: number, e: ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0] || null;
        setFiles((x) => x.map((v, k) => (k === i ? f : v)));
        setPreviews((x) => x.map((v, k) => (k === i ? (f ? URL.createObjectURL(f) : "") : v)));
    }

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const v = (k: string) => String(f.get(k) || "").trim();
        if (!v("nombre") || !/^\S+@\S+\.\S+$/.test(v("correo")) || v("whatsapp").replace(/\D/g, "").length < 8 || !f.get("privacidad")) return setMsg(t.check);
        if (!files.some(Boolean)) return setMsg(t.min);
        setBusy(true);
        setMsg("");
        try {
            const body = new FormData();
            for (const k of ["nombre", "correo", "whatsapp", "pais", "necesidad", "empresa", "cf-turnstile-response"]) body.set(k, v(k));
            body.set("privacidad", "1");
            body.set("idioma", lang);
            for (const [i, file] of files.entries()) if (file) body.set(`foto_${i + 1}`, await shrink(file), `foto-${i + 1}.jpg`);
            const r = await fetch("/api/fotos", { method: "POST", body });
            const j = await r.json().catch(() => ({ ok: false }));
            if (!j.ok) throw new Error();
            setSent(true);
            try {
                (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: "dsc_fotos", fotos: files.filter(Boolean).length });
            } catch {}
        } catch {
            setMsg(t.error);
        } finally {
            setBusy(false);
        }
    }

    const waHref = `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(t.waMsg)}`;

    if (sent) {
        return (
            <div role="status" className="rounded-3xl bg-[#E3EFE6] p-6 text-[#1F5A36]">
                <p className="font-serif text-2xl">{c.success}</p>
            </div>
        );
    }

    const field = "rounded-2xl border border-dorado/40 bg-white px-4 py-3 font-normal";
    const label = "flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.14em] text-gris";
    return (
        <form onSubmit={submit} noValidate className="flex flex-col gap-4">
            <label className={label}>{t.name}<input name="nombre" autoComplete="name" required className={field} /></label>
            <label className={label}>{t.email}<input name="correo" type="email" autoComplete="email" required className={field} /></label>
            <label className={label}>{t.whatsapp}<input name="whatsapp" type="tel" autoComplete="tel" placeholder="+1 512 555 0142" required className={field} /></label>
            <label className={label}>{t.country}<input name="pais" autoComplete="country-name" className={field} /></label>
            <label className={label}>
                {t.need}
                <select name="necesidad" defaultValue="" className={field}>
                    <option value="" disabled>{t.choose}</option>
                    {t.needs.map((n) => <option key={n}>{n}</option>)}
                </select>
            </label>
            <label className="absolute -left-[9999px]" aria-hidden="true">Empresa<input name="empresa" tabIndex={-1} autoComplete="off" /></label>

            <div className="mt-2">
                <h4 className="font-serif text-3xl">{c.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-gris">{c.text}</p>
            </div>
            <ul className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4, 5].map((n, i) => (
                    <li key={n} className="overflow-hidden rounded-3xl border border-dorado/30 bg-white">
                        <div className="relative aspect-[4/3] bg-champana">
                            {previews[i] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={previews[i]} alt="" className="h-full w-full object-cover" />
                            ) : (
                                <>
                                    <span className="absolute inset-0 flex items-center justify-center font-serif text-5xl text-dorado-texto" aria-hidden="true">{n}</span>
                                    {c[`f${n}_example`] && <span className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${c[`f${n}_example`]})` }} aria-hidden="true" />}
                                </>
                            )}
                            {!previews[i] && <span className="absolute left-2 top-2 rounded-full bg-marfil/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-verde">{t.example}</span>}
                        </div>
                        <div className="flex flex-col gap-1 p-3">
                            <p className="font-serif text-xl leading-tight"><span className="mr-2 text-sm text-dorado-texto">{n}</span>{c[`f${n}_label`]}</p>
                            <p className="text-xs leading-snug text-gris">{c[`f${n}_tip`]}</p>
                            <label className="mt-1 inline-flex min-h-11 cursor-pointer items-center gap-1 text-sm font-bold text-verde">
                                + {files[i] ? t.change : t.add}
                                <input type="file" accept="image/*" capture="environment" onChange={(e) => pick(i, e)} className="sr-only" aria-label={`${c[`f${n}_label`]}: ${t.add}`} />
                            </label>
                        </div>
                    </li>
                ))}
            </ul>
            <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" name="privacidad" className="mt-1 h-5 w-5 accent-[#153D32]" />
                <span>{t.privacyPre}<a href={t.privacyUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-verde underline">{t.privacy}</a>{t.privacyPost}</span>
            </label>
            <Turnstile lang={lang} />
            {msg && <p role="alert" className="text-sm font-semibold text-[#8A1F1F]">{msg}</p>}
            <button type="submit" disabled={busy} className="min-h-12 rounded-full bg-verde px-6 font-bold text-marfil disabled:opacity-60">{busy ? t.sending : c.submit}</button>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="text-center text-sm font-semibold text-verde underline">{t.wa}</a>
            <p className="text-xs text-gris">{t.privacyNote}</p>
        </form>
    );
}
