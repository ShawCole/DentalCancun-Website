"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { requireDb } from "@/lib/settings/client";
import { CITA_ESTADOS } from "@/lib/crm";
import { Badge, card, input, Notice, PageHeader } from "@/components/admin/ui";

interface Cita { id: string; tipo: "virtual" | "clinica"; nombre: string; whatsapp: string; correo: string; pais: string; idioma: string; notas: string; start: number; estado: string; reminderSent?: boolean; deposit?: { usd: number; status: string } }

const fmt = (ts: number) => new Intl.DateTimeFormat("es-MX", { timeZone: "America/Cancun", weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(ts));
const day = (ts: number) => new Intl.DateTimeFormat("es-MX", { timeZone: "America/Cancun", weekday: "long", day: "numeric", month: "long" }).format(new Date(ts));

export default function Agenda() {
    const [citas, setCitas] = useState<Cita[] | null>(null);
    const [view, setView] = useState<"proximas" | "pasadas">("proximas");
    const [error, setError] = useState("");

    useEffect(() => {
        setCitas(null);
        const now = Date.now() - 2 * 3600_000;
        const q = view === "proximas"
            ? query(collection(requireDb(), "appointments"), where("start", ">=", now), orderBy("start", "asc"))
            : query(collection(requireDb(), "appointments"), where("start", "<", now), orderBy("start", "desc"));
        getDocs(q)
            .then((s) => setCitas(s.docs.slice(0, 300).map((d) => ({ id: d.id, ...(d.data() as Omit<Cita, "id">) }))))
            .catch((e) => setError(e.message));
    }, [view]);

    const groups = useMemo(() => {
        const m = new Map<string, Cita[]>();
        for (const c of citas || []) m.set(day(c.start), [...(m.get(day(c.start)) || []), c]);
        return [...m.entries()];
    }, [citas]);

    async function setEstado(c: Cita, estado: string) {
        try {
            await updateDoc(doc(requireDb(), "appointments", c.id), { estado });
            setCitas((all) => all?.map((x) => (x.id === c.id ? { ...x, estado } : x)) || null);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "No se pudo guardar.");
        }
    }

    return (
        <div className="flex max-w-5xl flex-col gap-6">
            <PageHeader kicker="Operación" title="Agenda">
                <div role="group" aria-label="Periodo" className="inline-flex overflow-hidden rounded-lg border border-[#CFC5B3]">
                    {(["proximas", "pasadas"] as const).map((v) => (
                        <button key={v} type="button" onClick={() => setView(v)} aria-pressed={view === v} className={`min-h-11 px-4 text-sm font-semibold ${view === v ? "bg-[#153D32] text-[#F6F3ED]" : "bg-white text-[#153D32]"}`}>
                            {v === "proximas" ? "Próximas" : "Pasadas"}
                        </button>
                    ))}
                </div>
            </PageHeader>
            <p className="text-sm text-[#5C564D]">
                Citas pedidas desde el sitio. El horario real vive en Google Calendar: si cambias o cancelas una cita aquí, ajusta también el evento del calendario. Los pacientes pueden cambiar o cancelar su cita desde el enlace de su correo, y eso sí actualiza el calendario.
            </p>
            {error && <Notice kind="error">{error}</Notice>}
            {!citas ? (
                <p className="text-sm text-[#5C564D]">Cargando…</p>
            ) : citas.length === 0 ? (
                <p className="text-sm text-[#5C564D]">No hay citas {view === "proximas" ? "próximas" : "pasadas"}.</p>
            ) : (
                groups.map(([d, list]) => (
                    <section key={d}>
                        <h2 className="mb-2 font-bold capitalize text-[#153D32]">{d}</h2>
                        <ul className="flex flex-col gap-2">
                            {list.map((c) => (
                                <li key={c.id} className={`${card} flex flex-wrap items-center justify-between gap-3 py-4`}>
                                    <div className="min-w-0">
                                        <p className="font-bold">{fmt(c.start)} · {c.nombre}</p>
                                        <p className="mt-1 flex flex-wrap gap-2 text-sm">
                                            <Badge tone={c.tipo === "virtual" ? "blue" : "green"}>{c.tipo === "virtual" ? "Videollamada" : "En clínica"}</Badge>
                                            <Badge>{(c.idioma || "").toUpperCase()} · {c.pais || "—"}</Badge>
                                            {c.deposit && <Badge tone={c.deposit.status === "pagado" ? "green" : "amber"}>Anticipo USD {c.deposit.usd} · {c.deposit.status}</Badge>}
                                            {c.reminderSent && <Badge>Recordatorio enviado</Badge>}
                                        </p>
                                        {c.notas && <p className="mt-2 text-sm text-[#5C564D]">{c.notas}</p>}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <label className="sr-only" htmlFor={`c-${c.id}`}>Estado</label>
                                        <select id={`c-${c.id}`} value={c.estado} onChange={(e) => setEstado(c, e.target.value)} className={`${input} w-auto`}>
                                            {CITA_ESTADOS.map((s) => <option key={s}>{s}</option>)}
                                        </select>
                                        <a href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="min-h-11 content-center font-semibold text-[#153D32] underline">WhatsApp</a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))
            )}
        </div>
    );
}
