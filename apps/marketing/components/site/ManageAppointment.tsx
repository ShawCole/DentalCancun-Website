"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Lang } from "@/lib/cms/schema";

const T = {
    es: {
        title: "Tu cita",
        loading: "Cargando tu cita…",
        notFound: "No encontramos esta cita. Revisa el enlace de tu correo o escríbenos por WhatsApp.",
        virtual: "Videollamada",
        clinica: "Valoración en clínica",
        status: { "por confirmar": "Por confirmar", confirmada: "Confirmada", reprogramada: "Reprogramada", cancelada: "Cancelada", "asistió": "Completada", "no asistió": "No asististe" } as Record<string, string>,
        paid: "Anticipo pagado",
        pending: "Anticipo pendiente",
        paidOk: "¡Gracias! Recibimos tu anticipo. Te escribiremos por WhatsApp para confirmar.",
        payCanceled: "El pago no se completó. Puedes intentarlo de nuevo desde el enlace de tu correo o escribirnos por WhatsApp.",
        reschedule: "Cambiar fecha u hora",
        cancel: "Cancelar cita",
        confirmCancel: "¿Seguro que quieres cancelar? Si pagaste un anticipo, aplican las condiciones de anticipos y cancelaciones.",
        yesCancel: "Sí, cancelar",
        keep: "No, conservarla",
        canceled: "Tu cita quedó cancelada. Te enviamos la confirmación por correo.",
        late: "Ya no es posible cambiarla en línea. Escríbenos por WhatsApp y con gusto te ayudamos.",
        pick: "Elige un nuevo horario (hora de Cancún)",
        save: "Confirmar nuevo horario",
        moved: "Listo. Tu nueva cita es:",
        taken: "Ese horario se acaba de ocupar. Elige otro.",
        error: "No pudimos hacer el cambio. Inténtalo de nuevo o escríbenos por WhatsApp.",
        back: "Volver",
        locale: "es-MX",
        terms: "Anticipos y cancelaciones",
        termsUrl: "/es/anticipos-y-cancelaciones",
    },
    en: {
        title: "Your appointment",
        loading: "Loading your appointment…",
        notFound: "We couldn't find this appointment. Check the link in your email or text us on WhatsApp.",
        virtual: "Video call",
        clinica: "In-clinic consultation",
        status: { "por confirmar": "Waiting for confirmation", confirmada: "Confirmed", reprogramada: "Rescheduled", cancelada: "Canceled", "asistió": "Completed", "no asistió": "Missed" } as Record<string, string>,
        paid: "Deposit paid",
        pending: "Deposit pending",
        paidOk: "Thank you! We got your deposit. We'll text you on WhatsApp to confirm.",
        payCanceled: "The payment didn't go through. You can try again from the link in your email or text us on WhatsApp.",
        reschedule: "Change the date or time",
        cancel: "Cancel appointment",
        confirmCancel: "Are you sure you want to cancel? If you paid a deposit, our deposit and cancellation terms apply.",
        yesCancel: "Yes, cancel it",
        keep: "No, keep it",
        canceled: "Your appointment is canceled. We emailed you a confirmation.",
        late: "It's too close to your appointment to change it online. Text us on WhatsApp and we'll help.",
        pick: "Pick a new time (Cancun time)",
        save: "Confirm new time",
        moved: "All set. Your new appointment is:",
        taken: "That time was just taken. Please pick another one.",
        error: "We couldn't make the change. Try again or text us on WhatsApp.",
        back: "Back",
        locale: "en-US",
        terms: "Deposits and cancellations",
        termsUrl: "/en/deposits-and-cancellations",
    },
};

interface Info { tipo: "virtual" | "clinica"; nombre: string; start: number; estado: string; deposit: { usd: number; status: string } | null; canChange: boolean }
interface Day { date: string; slots: { h: string; ts: number; free: boolean }[] }

export function ManageAppointment({ lang }: { lang: Lang }) {
    const sp = useSearchParams();
    const id = sp.get("id") || "";
    const token = sp.get("t") || "";
    const pago = sp.get("pago") || "";
    const t = T[lang];
    const [info, setInfo] = useState<Info | null | false>(null);
    const [mode, setMode] = useState<"view" | "cancel" | "move">("view");
    const [days, setDays] = useState<Day[] | null>(null);
    const [slot, setSlot] = useState<number | null>(null);
    const [msg, setMsg] = useState("");
    const [busy, setBusy] = useState(false);
    const fmt = (ts: number) => new Intl.DateTimeFormat(t.locale, { timeZone: "America/Cancun", weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" }).format(new Date(ts));

    const load = useCallback(() => {
        fetch(`/api/agenda/manage?id=${encodeURIComponent(id)}&t=${encodeURIComponent(token)}`, { cache: "no-store" })
            .then((r) => r.json())
            .then((j) => setInfo(j.ok ? j : false))
            .catch(() => setInfo(false));
    }, [id, token]);
    useEffect(load, [load]);

    async function act(body: Record<string, unknown>) {
        setBusy(true);
        setMsg("");
        try {
            const r = await fetch("/api/agenda/manage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, t: token, ...body }) });
            const j = await r.json();
            if (j.ok) {
                setMsg(body.action === "cancel" ? t.canceled : `${t.moved} ${j.when}`);
                setMode("view");
                load();
            } else setMsg(j.error === "taken" ? t.taken : j.error === "late" ? t.late : t.error);
        } catch {
            setMsg(t.error);
        } finally {
            setBusy(false);
        }
    }

    async function openMove() {
        if (!info) return;
        setMode("move");
        setDays(null);
        const r = await fetch(`/api/agenda/slots?tipo=${info.tipo}`, { cache: "no-store" });
        const j = await r.json().catch(() => ({ days: [] }));
        setDays(j.days || []);
    }

    if (info === null) return <p className="text-gris">{t.loading}</p>;
    if (info === false) return <p role="alert" className="rounded-3xl bg-white p-6">{t.notFound}</p>;

    return (
        <div className="flex flex-col gap-5 rounded-[32px] bg-marfil p-6 shadow-sm md:p-8">
            <h1 className="font-serif text-4xl">{t.title}</h1>
            {pago === "ok" && <p role="status" className="rounded-2xl bg-[#E3EFE6] px-4 py-3 text-sm text-[#1F5A36]">{t.paidOk}</p>}
            {pago === "cancelado" && <p role="status" className="rounded-2xl bg-[#FBEFD5] px-4 py-3 text-sm text-[#6B4500]">{t.payCanceled}</p>}
            <dl className="grid gap-2 text-sm">
                <div><dt className="font-bold">{info.tipo === "virtual" ? t.virtual : t.clinica}</dt><dd className="font-serif text-2xl first-letter:uppercase">{fmt(info.start)}</dd></div>
                <div><dt className="sr-only">Status</dt><dd className="font-semibold text-verde">{t.status[info.estado] || info.estado}</dd></div>
                {info.deposit && <div><dd>{info.deposit.status === "pagado" ? t.paid : t.pending} · USD {info.deposit.usd}</dd></div>}
            </dl>
            {msg && <p role="status" className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold">{msg}</p>}

            {info.estado !== "cancelada" && !info.canChange && <p className="text-sm text-gris">{t.late}</p>}

            {info.canChange && mode === "view" && (
                <div className="flex flex-wrap gap-3">
                    <button type="button" onClick={openMove} className="min-h-12 rounded-full bg-verde px-6 font-bold text-marfil">{t.reschedule}</button>
                    <button type="button" onClick={() => setMode("cancel")} className="min-h-12 rounded-full border border-verde px-6 font-bold text-verde">{t.cancel}</button>
                </div>
            )}

            {mode === "cancel" && (
                <div className="flex flex-col gap-3 rounded-2xl bg-white p-4">
                    <p>{t.confirmCancel} <a href={t.termsUrl} className="font-semibold text-verde underline">{t.terms}</a></p>
                    <div className="flex flex-wrap gap-3">
                        <button type="button" disabled={busy} onClick={() => act({ action: "cancel" })} className="min-h-12 rounded-full bg-[#8A1F1F] px-6 font-bold text-white disabled:opacity-60">{t.yesCancel}</button>
                        <button type="button" onClick={() => setMode("view")} className="min-h-12 rounded-full border border-verde px-6 font-bold text-verde">{t.keep}</button>
                    </div>
                </div>
            )}

            {mode === "move" && (
                <div className="flex flex-col gap-4">
                    <h2 className="font-bold">{t.pick}</h2>
                    {!days ? (
                        <p className="text-gris">{t.loading}</p>
                    ) : (
                        <div className="flex max-h-[360px] flex-col gap-4 overflow-y-auto">
                            {days.map((d) => (
                                <fieldset key={d.date}>
                                    <legend className="mb-2 text-sm font-bold first-letter:uppercase">
                                        {new Intl.DateTimeFormat(t.locale, { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" }).format(new Date(`${d.date}T12:00:00Z`))}
                                    </legend>
                                    <div className="flex flex-wrap gap-2">
                                        {d.slots.filter((s) => s.free).map((s) => (
                                            <button key={s.ts} type="button" aria-pressed={slot === s.ts} onClick={() => setSlot(s.ts)} className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${slot === s.ts ? "border-verde bg-verde text-marfil" : "border-grafito/20 bg-white"}`}>
                                                {new Intl.DateTimeFormat(t.locale, { timeZone: "America/Cancun", hour: "numeric", minute: "2-digit" }).format(new Date(s.ts))}
                                            </button>
                                        ))}
                                    </div>
                                </fieldset>
                            ))}
                        </div>
                    )}
                    <div className="flex flex-wrap gap-3">
                        <button type="button" disabled={!slot || busy} onClick={() => act({ action: "reschedule", ts: slot })} className="min-h-12 rounded-full bg-verde px-6 font-bold text-marfil disabled:opacity-40">{t.save}</button>
                        <button type="button" onClick={() => setMode("view")} className="min-h-12 px-3 font-semibold text-verde underline">{t.back}</button>
                    </div>
                </div>
            )}
        </div>
    );
}
