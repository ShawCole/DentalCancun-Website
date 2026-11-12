"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Turnstile } from "./Turnstile";
import type { Lang, SectionValues } from "@/lib/cms/schema";

type View = "menu" | "type" | "slots" | "form" | "done";
type Tipo = "virtual" | "clinica";
interface Day { date: string; slots: { h: string; ts: number; free: boolean }[] }

const L = {
    es: {
        close: "Cerrar",
        back: "← Volver",
        pickType: "¿Qué tipo de cita prefieres?",
        pickDay: "Elige el día",
        pickTime: "Elige la hora (hora de Cancún)",
        loading: "Buscando horarios disponibles…",
        none: "No hay horarios disponibles en los próximos días. Escríbenos por WhatsApp y te ayudamos.",
        calError: "No pudimos consultar la agenda en este momento. Escríbenos por WhatsApp y te agendamos.",
        yourData: "Tus datos",
        name: "Nombre",
        email: "Correo",
        whatsapp: "WhatsApp con código de país",
        country: "País",
        notes: "¿Qué te gustaría revisar? (opcional)",
        privacyPre: "Acepto el ",
        privacy: "aviso de privacidad",
        privacyUrl: "/es/aviso-de-privacidad",
        send: "Solicitar cita",
        sending: "Reservando…",
        taken: "Ese horario se acaba de ocupar. Elige otro, por favor.",
        error: "No pudimos reservar. Inténtalo de nuevo o escríbenos por WhatsApp.",
        check: "Revisa tu nombre, correo, WhatsApp y el aviso de privacidad.",
        done: "Solicitud enviada",
        confirm: "Confirmar por WhatsApp",
        virtual: "videollamada",
        clinica: "valoración en clínica",
        locale: "es-MX",
    },
    en: {
        close: "Close",
        back: "← Back",
        pickType: "What kind of appointment works for you?",
        pickDay: "Pick a day",
        pickTime: "Pick a time (Cancun time)",
        loading: "Finding open times…",
        none: "There are no open times in the next few days. Text us on WhatsApp and we’ll help you out.",
        calError: "We couldn’t load the schedule right now. Text us on WhatsApp and we’ll book you in.",
        yourData: "Your info",
        name: "Name",
        email: "Email",
        whatsapp: "WhatsApp with country code",
        country: "Country",
        notes: "Anything you’d like us to look at? (optional)",
        privacyPre: "I accept the ",
        privacy: "privacy notice",
        privacyUrl: "/en/privacy-notice",
        send: "Request appointment",
        sending: "Booking…",
        taken: "Someone just grabbed that time. Please pick another one.",
        error: "We couldn’t complete the booking. Please try again or text us on WhatsApp.",
        check: "Please check your name, email, WhatsApp and the privacy notice.",
        done: "Request sent",
        confirm: "Confirm on WhatsApp",
        virtual: "video call",
        clinica: "consultation at the clinic",
        locale: "en-US",
    },
};

const wa = (n: string, msg: string) => `https://wa.me/${(n || "").replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;

interface Props {
    lang: Lang;
    whatsapp: string;
    phone: string;
    panel: SectionValues;
    booking: SectionValues;
}

export function Concierge({ lang, whatsapp, phone, panel, booking }: Props) {
    const t = L[lang];
    const [open, setOpen] = useState(false);
    const [view, setView] = useState<View>("menu");
    const [tipo, setTipo] = useState<Tipo>("virtual");
    const [days, setDays] = useState<Day[] | null>(null);
    const [loadError, setLoadError] = useState(false);
    const [day, setDay] = useState(0);
    const [slot, setSlot] = useState<number | null>(null);
    const [msg, setMsg] = useState("");
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState<{ when: string; name: string; payUrl?: string; depositUsd?: number; manage?: string } | null>(null);
    const heading = useRef<HTMLHeadingElement>(null);
    const opener = useRef<HTMLElement | null>(null);

    const load = useCallback(async (k: Tipo) => {
        setDays(null);
        setLoadError(false);
        setSlot(null);
        setDay(0);
        try {
            const r = await fetch(`/api/agenda/slots?tipo=${k}`, { cache: "no-store" });
            const j = await r.json();
            if (!j.ok) setLoadError(true);
            setDays(j.days || []);
        } catch {
            setLoadError(true);
            setDays([]);
        }
    }, []);

    const start = useCallback(
        (v: View, k?: Tipo) => {
            opener.current = document.activeElement as HTMLElement;
            setOpen(true);
            setView(v);
            setMsg("");
            if (k) {
                setTipo(k);
                load(k);
            }
        },
        [load]
    );

    // #agendar, #agendar-virtual and #agendar-clinica open the panel from any link.
    useEffect(() => {
        const route = () => {
            const h = window.location.hash;
            if (h === "#agendar") start("type");
            else if (h === "#agendar-virtual") start("slots", "virtual");
            else if (h === "#agendar-clinica") start("slots", "clinica");
            else return;
            history.replaceState(null, "", window.location.pathname + window.location.search);
        };
        route();
        window.addEventListener("hashchange", route);
        return () => window.removeEventListener("hashchange", route);
    }, [start]);

    useEffect(() => {
        if (!open) return;
        requestAnimationFrame(() => heading.current?.focus());
        const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
        window.addEventListener("keydown", esc);
        return () => window.removeEventListener("keydown", esc);
    }, [open, view]);

    function close() {
        setOpen(false);
        setView("menu");
        opener.current?.focus?.();
    }

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const v = (k: string) => String(f.get(k) || "").trim();
        if (!v("nombre") || !/^\S+@\S+\.\S+$/.test(v("correo")) || v("whatsapp").replace(/\D/g, "").length < 8 || !f.get("privacidad")) return setMsg(t.check);
        setBusy(true);
        setMsg("");
        try {
            const r = await fetch("/api/agenda/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tipo, ts: slot, nombre: v("nombre"), correo: v("correo"), whatsapp: v("whatsapp"), pais: v("pais"), notas: v("notas"), empresa: v("empresa"), privacidad: true, idioma: lang, turnstile: v("cf-turnstile-response") }),
            });
            const j = await r.json();
            if (r.status === 409) {
                setMsg(t.taken);
                setView("slots");
                load(tipo);
            } else if (!j.ok) setMsg(t.error);
            else {
                setDone({ when: j.when, name: v("nombre").split(" ")[0], payUrl: j.payUrl, depositUsd: j.depositUsd, manage: j.manage });
                setView("done");
                try {
                    (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: "dsc_cita", tipo });
                } catch {}
            }
        } catch {
            setMsg(t.error);
        } finally {
            setBusy(false);
        }
    }

    const card = "flex w-full items-center gap-4 rounded-3xl bg-white/80 p-4 text-left hover:bg-white";
    const icon = "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-champana text-verde";
    const fmtDay = (d: string) => new Intl.DateTimeFormat(t.locale, { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`));
    const current = days?.[day];

    return (
        <>
            <button
                type="button"
                onClick={() => start("menu")}
                aria-label={panel.button}
                aria-haspopup="dialog"
                className="fixed bottom-5 right-5 z-[60] flex h-16 w-16 items-center justify-center rounded-full bg-verde text-marfil shadow-[0_18px_40px_-12px_rgba(21,61,50,.6)] hover:bg-verde-osc"
                style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
            >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M4 5h16v11H8l-4 4z" />
                    <path d="M8 10h8M8 13h5" />
                </svg>
                <span className="absolute right-3 top-3 h-3 w-3 rounded-full border-2 border-verde bg-[#4ADE80]" aria-hidden="true" />
            </button>

            {open && (
                <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/30 p-0 sm:items-center sm:p-6" onClick={(e) => e.target === e.currentTarget && close()}>
                    <div role="dialog" aria-modal="true" aria-labelledby="cc-title" className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[32px] border border-white/80 bg-marfil shadow-2xl sm:rounded-[32px]">
                        <div className="flex items-start justify-between gap-4 border-b border-dorado/30 px-6 pb-4 pt-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-verde">{panel.kicker}</p>
                                <h2 id="cc-title" ref={heading} tabIndex={-1} className="font-serif text-3xl font-medium outline-none">
                                    {view === "menu" ? panel.title : view === "type" ? t.pickType : view === "slots" ? (tipo === "virtual" ? booking.virtualTitle : booking.clinicTitle) : view === "form" ? t.yourData : t.done}
                                </h2>
                            </div>
                            <button type="button" onClick={close} aria-label={t.close} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-grafito/5 hover:bg-grafito/10">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path d="M6 6l12 12M18 6L6 18" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col gap-4 overflow-y-auto px-6 py-5">
                            {view === "menu" && (
                                <>
                                    <p className="inline-flex items-center gap-2 self-start rounded-full bg-[#E3EFE6] px-4 py-2 text-sm text-[#1F5A36]">
                                        <span className="h-2 w-2 rounded-full bg-[#2E7D4F]" aria-hidden="true" />
                                        {panel.status}
                                    </p>
                                    <a href={wa(whatsapp, panel.waMsg)} target="_blank" rel="noopener noreferrer" className={card}>
                                        <span className={icon} aria-hidden="true">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" /><path d="M9 9.5c.3 1.8 1.7 3.8 4 4.8l1.2-1.2 1.8.8-.3 1.7c-3.6.1-7.3-3.4-7.4-7.2L10 8l.8 1.8z" /></svg>
                                        </span>
                                        <span>
                                            <span className="block text-lg font-semibold">{panel.waTitle}</span>
                                            <span className="text-sm text-gris">{panel.waText}</span>
                                        </span>
                                    </a>
                                    <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className={card}>
                                        <span className={icon} aria-hidden="true">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
                                        </span>
                                        <span>
                                            <span className="block text-lg font-semibold">{panel.callTitle}</span>
                                            <span className="text-sm text-gris">
                                                {phone} · {panel.callHours}
                                            </span>
                                        </span>
                                    </a>
                                    <button type="button" onClick={() => setView("type")} className="flex w-full items-center gap-4 rounded-3xl bg-verde p-4 text-left text-marfil hover:bg-verde-osc">
                                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10" aria-hidden="true">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4M9 15l2 2 4-4" /></svg>
                                        </span>
                                        <span>
                                            <span className="block text-lg font-semibold">{panel.bookTitle}</span>
                                            <span className="text-sm text-dorado-claro">{panel.bookText}</span>
                                        </span>
                                    </button>
                                    <p className="text-sm text-gris">{panel.note}</p>
                                </>
                            )}

                            {view === "type" && (
                                <>
                                    {(["virtual", "clinica"] as Tipo[]).map((k) => (
                                        <button key={k} type="button" onClick={() => { setTipo(k); setView("slots"); load(k); }} className={card}>
                                            <span>
                                                <span className="block text-lg font-semibold">{k === "virtual" ? booking.virtualTitle : booking.clinicTitle}</span>
                                                <span className="text-sm text-gris">{k === "virtual" ? booking.virtualText : booking.clinicText}</span>
                                            </span>
                                        </button>
                                    ))}
                                    <button type="button" onClick={() => setView("menu")} className="self-start text-sm font-semibold text-verde">{t.back}</button>
                                </>
                            )}

                            {view === "slots" && (
                                <>
                                    {msg && <p role="alert" className="rounded-xl bg-[#FBEFD5] px-4 py-3 text-sm text-[#6B4500]">{msg}</p>}
                                    {!days ? (
                                        <p className="text-sm text-gris" aria-live="polite">{t.loading}</p>
                                    ) : !days.length ? (
                                        <div className="flex flex-col gap-3">
                                            <p className="text-sm text-gris">{loadError ? t.calError : t.none}</p>
                                            <a href={wa(whatsapp, panel.waMsg)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full bg-verde px-6 font-bold text-marfil">WhatsApp</a>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-sm font-semibold">{t.pickDay}</p>
                                            <div role="group" aria-label={t.pickDay} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                                                {days.map((d, i) => (
                                                    <button key={d.date} type="button" aria-pressed={i === day} onClick={() => { setDay(i); setSlot(null); }} className={`min-h-12 shrink-0 rounded-2xl px-4 text-sm font-semibold first-letter:uppercase ${i === day ? "bg-verde text-marfil" : "bg-white/80 text-grafito hover:bg-white"}`}>
                                                        {fmtDay(d.date)}
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-sm font-semibold">{t.pickTime}</p>
                                            <div role="group" aria-label={t.pickTime} className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                                                {current?.slots.filter((s) => s.free).map((s) => (
                                                    <button key={s.ts} type="button" aria-pressed={slot === s.ts} onClick={() => setSlot(s.ts)} className={`min-h-11 rounded-xl text-sm font-semibold tabular-nums ${slot === s.ts ? "bg-verde text-marfil" : "bg-white/80 hover:bg-white"}`}>
                                                        {new Intl.DateTimeFormat(t.locale, { timeZone: "America/Cancun", hour: "numeric", minute: "2-digit" }).format(new Date(s.ts))}
                                                    </button>
                                                ))}
                                            </div>
                                            <button type="button" disabled={!slot} onClick={() => { setMsg(""); setView("form"); }} className="min-h-12 rounded-full bg-verde px-6 font-bold text-marfil disabled:opacity-40">
                                                {lang === "es" ? "Continuar" : "Continue"}
                                            </button>
                                        </>
                                    )}
                                    <button type="button" onClick={() => setView("type")} className="self-start text-sm font-semibold text-verde">{t.back}</button>
                                </>
                            )}

                            {view === "form" && slot && (
                                <form onSubmit={submit} noValidate className="flex flex-col gap-3">
                                    <p className="rounded-2xl bg-white/80 px-4 py-3 text-sm">
                                        <strong>{tipo === "virtual" ? booking.virtualTitle : booking.clinicTitle}</strong>
                                        <br />
                                        <span className="block first-letter:uppercase">{new Intl.DateTimeFormat(t.locale, { timeZone: "America/Cancun", weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" }).format(new Date(slot))}</span>
                                    </p>
                                    {[
                                        ["nombre", t.name, "name", "text"],
                                        ["correo", t.email, "email", "email"],
                                        ["whatsapp", t.whatsapp, "tel", "tel"],
                                        ["pais", t.country, "country-name", "text"],
                                    ].map(([n, label, ac, type]) => (
                                        <label key={n} className="flex flex-col gap-1 text-sm font-semibold">
                                            {label}
                                            <input name={n} type={type} autoComplete={ac} required={n !== "pais"} className="rounded-xl border border-grafito/15 bg-white px-4 py-3 font-normal" />
                                        </label>
                                    ))}
                                    <label className="flex flex-col gap-1 text-sm font-semibold">
                                        {t.notes}
                                        <textarea name="notas" rows={2} className="rounded-xl border border-grafito/15 bg-white px-4 py-3 font-normal" />
                                    </label>
                                    <label className="absolute -left-[9999px]" aria-hidden="true">
                                        Empresa
                                        <input name="empresa" tabIndex={-1} autoComplete="off" />
                                    </label>
                                    <label className="flex items-start gap-3 text-sm">
                                        <input type="checkbox" name="privacidad" className="mt-1 h-5 w-5 accent-[#153D32]" />
                                        <span>
                                            {t.privacyPre}
                                            <a href={t.privacyUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-verde underline">{t.privacy}</a>.
                                        </span>
                                    </label>
                                    <Turnstile lang={lang} />
                                    {msg && <p role="alert" className="text-sm font-semibold text-[#8A1F1F]">{msg}</p>}
                                    <button type="submit" disabled={busy} className="min-h-12 rounded-full bg-verde px-6 font-bold text-marfil disabled:opacity-60">{busy ? t.sending : t.send}</button>
                                    <button type="button" onClick={() => setView("slots")} className="self-start text-sm font-semibold text-verde">{t.back}</button>
                                </form>
                            )}

                            {view === "done" && done && (
                                <div className="flex flex-col gap-4" aria-live="polite">
                                    <p className="font-serif text-2xl first-letter:uppercase">{done.when}</p>
                                    <p className="text-gris">{booking.confirmText}</p>
                                    <a
                                        href={wa(whatsapp, (booking.confirmWa || "").replace("{nombre}", done.name).replace("{tipo}", t[tipo]).replace("{fecha}", done.when))}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex min-h-12 items-center justify-center rounded-full bg-verde px-6 font-bold text-marfil"
                                    >
                                        {t.confirm}
                                    </a>
                                    {done.payUrl && (
                                        <a href={done.payUrl} className="inline-flex min-h-12 items-center justify-center rounded-full border border-verde px-6 font-bold text-verde">
                                            {lang === "es" ? `Pagar anticipo · USD ${done.depositUsd}` : `Pay the deposit · USD ${done.depositUsd}`}
                                        </a>
                                    )}
                                    {done.manage && (
                                        <a href={done.manage} className="text-sm font-semibold text-verde underline">
                                            {lang === "es" ? "Cambiar o cancelar mi cita" : "Reschedule or cancel"}
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
