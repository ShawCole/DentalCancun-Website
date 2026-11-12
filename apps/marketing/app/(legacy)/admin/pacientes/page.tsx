"use client";

import { useEffect, useMemo, useState } from "react";
import { arrayUnion, collection, doc, getDocs, limit, orderBy, query, setDoc, Timestamp } from "firebase/firestore";
import { currentEmail, requireDb } from "@/lib/settings/client";
import { personKey, STAGES, type Stage } from "@/lib/crm";
import { Badge, btnGhost, btnPrimary, card, download, input, Notice, PageHeader, toCsv } from "@/components/admin/ui";

/*
 * Mini CRM: one card per person, joining the quiz, the photo form and
 * the bookings (matched by WhatsApp, or e-mail when there is no WhatsApp).
 */
interface Ev { at: number; kind: "Quiz" | "Fotos" | "Cita"; text: string }
interface Crm { stage?: Stage; owner?: string; next?: string; notes?: { text: string; by: string; at: number }[] }
interface Person {
    key: string;
    nombre: string;
    whatsapp: string;
    correo: string;
    pais: string;
    idioma: string;
    tratamiento: string;
    prioridad: string;
    events: Ev[];
    last: number;
    crm: Crm;
    stage: Stage;
}

type Raw = Record<string, unknown> & { createdAt?: Timestamp };
const ms = (r: Raw) => r.createdAt?.toMillis?.() || 0;
const str = (v: unknown) => (typeof v === "string" ? v : "");
const today = () => new Date(Date.now() - 5 * 3600_000).toISOString().slice(0, 10);
const tone: Record<string, "neutral" | "green" | "amber" | "red" | "blue"> = { nuevo: "blue", contactado: "neutral", "valoración agendada": "green", "presupuesto enviado": "amber", "en tratamiento": "green", seguimiento: "neutral", cerrado: "green", perdido: "red" };

async function all(name: string, max: number) {
    const snap = await getDocs(query(collection(requireDb(), name), orderBy("createdAt", "desc"), limit(max))).catch(() => null);
    return snap ? snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Raw) : ([] as Raw[]);
}

export default function Pacientes() {
    const [people, setPeople] = useState<Person[] | null>(null);
    const [error, setError] = useState("");
    const [q, setQ] = useState("");
    const [stage, setStage] = useState("");
    const [onlyDue, setOnlyDue] = useState(false);
    const [open, setOpen] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const [leads, citas, fotos] = await Promise.all([all("leads", 500), all("appointments", 500), all("photo_submissions", 500)]);
                const crmSnap = await getDocs(collection(requireDb(), "crm")).catch(() => null);
                const crm = new Map(crmSnap?.docs.map((d) => [d.id, d.data() as Crm]) || []);
                const map = new Map<string, Person>();
                const touch = (r: Raw, ev: Ev) => {
                    const key = str(r.key) || personKey(str(r.whatsapp), str(r.correo));
                    const p = map.get(key) || { key, nombre: "", whatsapp: "", correo: "", pais: "", idioma: "", tratamiento: "", prioridad: "", events: [], last: 0, crm: crm.get(key) || {}, stage: "nuevo" as Stage };
                    if (ev.at >= p.last) {
                        p.nombre = str(r.nombre) || p.nombre;
                        p.whatsapp = str(r.whatsapp) || p.whatsapp;
                        p.correo = str(r.correo) || p.correo;
                        p.pais = str(r.pais) || p.pais;
                        p.idioma = (str(r.idioma) || p.idioma).toUpperCase();
                        p.last = ev.at;
                    }
                    p.events.push(ev);
                    map.set(key, p);
                    return p;
                };
                for (const l of leads) {
                    const p = touch(l, { at: ms(l), kind: "Quiz", text: `Ruta sugerida: ${str(l.tratamiento)}${l.alternativa ? ` (alternativa: ${str(l.alternativa)})` : ""} · prioridad ${str(l.prioridad)} · viaje: ${str(l.viaje)}` });
                    p.tratamiento ||= str(l.tratamiento);
                    p.prioridad ||= str(l.prioridad);
                }
                for (const f of fotos) touch(f, { at: ms(f), kind: "Fotos", text: `Envió ${f.fotos} fotos · quiere mejorar: ${str(f.necesidad) || "—"}` });
                for (const c of citas) {
                    const when = new Date(Number(c.start)).toLocaleString("es-MX", { timeZone: "America/Cancun", dateStyle: "medium", timeStyle: "short" });
                    const dep = c.deposit as { usd?: number; status?: string } | undefined;
                    touch(c, { at: ms(c), kind: "Cita", text: `${c.tipo === "virtual" ? "Videollamada" : "Valoración en clínica"} · ${when} · ${str(c.estado)}${dep ? ` · anticipo USD ${dep.usd} ${dep.status}` : ""}` });
                }
                const list = [...map.values()].map((p) => {
                    p.events.sort((a, b) => b.at - a.at);
                    p.stage = p.crm.stage || (p.events.some((e) => e.kind === "Cita") ? "valoración agendada" : "nuevo");
                    return p;
                });
                list.sort((a, b) => b.last - a.last);
                setPeople(list);
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : "No se pudo cargar.");
            }
        })();
    }, []);

    const shown = useMemo(() => {
        const s = q.trim().toLowerCase();
        return (people || []).filter(
            (p) =>
                (!stage || p.stage === stage) &&
                (!onlyDue || (p.crm.next && p.crm.next <= today() && !["cerrado", "perdido"].includes(p.stage))) &&
                (!s || [p.nombre, p.whatsapp, p.correo, p.tratamiento, p.pais].join(" ").toLowerCase().includes(s)),
        );
    }, [people, q, stage, onlyDue]);

    async function update(p: Person, data: Partial<Crm>, note?: string) {
        try {
            const by = currentEmail();
            const payload: Record<string, unknown> = { ...data, updatedAt: Date.now(), updatedBy: by };
            const n = note ? { text: note, by, at: Date.now() } : null;
            if (n) payload.notes = arrayUnion(n);
            await setDoc(doc(requireDb(), "crm", p.key), payload, { merge: true });
            setPeople((all) =>
                all?.map((x) => (x.key === p.key ? { ...x, stage: data.stage || x.stage, crm: { ...x.crm, ...data, notes: n ? [...(x.crm.notes || []), n] : x.crm.notes } } : x)) || null,
            );
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "No se pudo guardar.");
        }
    }

    function exportCsv() {
        const rows = [["Nombre", "WhatsApp", "Correo", "País", "Idioma", "Etapa", "Responsable", "Próximo seguimiento", "Tratamiento sugerido", "Prioridad", "Última actividad"]];
        for (const p of shown) rows.push([p.nombre, p.whatsapp, p.correo, p.pais, p.idioma, p.stage, p.crm.owner || "", p.crm.next || "", p.tratamiento, p.prioridad, p.last ? new Date(p.last).toLocaleString("es-MX") : ""]);
        download(`pacientes-${today()}.csv`, toCsv(rows), "text/csv;charset=utf-8");
    }

    const due = (people || []).filter((p) => p.crm.next && p.crm.next <= today() && !["cerrado", "perdido"].includes(p.stage)).length;

    return (
        <div className="flex max-w-6xl flex-col gap-6">
            <PageHeader kicker="Operación" title="Pacientes">
                <button type="button" onClick={exportCsv} disabled={!shown.length} className={btnGhost}>Exportar a Excel (CSV)</button>
            </PageHeader>
            <Notice kind="warn">Datos de pacientes: no los compartas fuera del equipo ni los copies a otros archivos. El archivo exportado es confidencial.</Notice>
            {error && <Notice kind="error">{error}</Notice>}

            <div className="flex flex-wrap items-end gap-3">
                <label className="flex min-w-[220px] flex-1 flex-col gap-1 text-sm font-semibold">Buscar<input className={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nombre, WhatsApp, correo, tratamiento…" /></label>
                <label className="flex flex-col gap-1 text-sm font-semibold">Etapa
                    <select className={input} value={stage} onChange={(e) => setStage(e.target.value)}>
                        <option value="">Todas</option>
                        {STAGES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                </label>
                <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
                    <input type="checkbox" checked={onlyDue} onChange={(e) => setOnlyDue(e.target.checked)} className="h-5 w-5 accent-[#153D32]" />
                    Seguimiento para hoy o vencido {due ? `(${due})` : ""}
                </label>
            </div>

            {!people ? (
                <p className="text-sm text-[#5C564D]">Cargando…</p>
            ) : shown.length === 0 ? (
                <p className="text-sm text-[#5C564D]">{people.length ? "Nadie coincide con el filtro." : "Aún no hay pacientes. Aparecerán al llegar diagnósticos, fotos o citas."}</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {shown.map((p) => (
                        <li key={p.key} className={card}>
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="font-bold">{p.nombre || "(sin nombre)"} <span className="font-normal text-[#5C564D]">· {p.pais || "—"} · {p.idioma || "—"}</span></p>
                                    <p className="mt-1 flex flex-wrap gap-2">
                                        <Badge tone={tone[p.stage]}>{p.stage}</Badge>
                                        {[...new Set(p.events.map((e) => e.kind))].map((k) => <Badge key={k}>{k}</Badge>)}
                                        {p.prioridad && <Badge tone={p.prioridad === "Alta" ? "green" : p.prioridad === "Media" ? "amber" : "neutral"}>Prioridad {p.prioridad}</Badge>}
                                        {p.crm.next && <Badge tone={p.crm.next <= today() ? "red" : "neutral"}>Seguimiento {p.crm.next}</Badge>}
                                    </p>
                                    {p.tratamiento && <p className="mt-2 text-sm text-[#5C564D]">Ruta sugerida: {p.tratamiento}</p>}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {p.whatsapp && <a href={`https://wa.me/${p.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className={btnGhost}>WhatsApp</a>}
                                    <button type="button" onClick={() => setOpen(open === p.key ? null : p.key)} aria-expanded={open === p.key} className={btnPrimary}>{open === p.key ? "Cerrar ficha" : "Abrir ficha"}</button>
                                </div>
                            </div>
                            {open === p.key && <Ficha p={p} onSave={update} />}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function Ficha({ p, onSave }: { p: Person; onSave: (p: Person, d: Partial<Crm>, note?: string) => Promise<void> }) {
    const [stage, setStage] = useState<Stage>(p.stage);
    const [owner, setOwner] = useState(p.crm.owner || "");
    const [next, setNext] = useState(p.crm.next || "");
    const [note, setNote] = useState("");
    const [busy, setBusy] = useState(false);
    const timeline = [
        ...p.events.map((e) => ({ at: e.at, label: e.kind, text: e.text })),
        ...(p.crm.notes || []).map((n) => ({ at: n.at, label: "Nota", text: `${n.text} — ${n.by}` })),
    ].sort((a, b) => b.at - a.at);

    async function save() {
        setBusy(true);
        await onSave(p, { stage, owner: owner.trim(), next }, note.trim() || undefined);
        setNote("");
        setBusy(false);
    }

    return (
        <div className="mt-4 grid gap-5 border-t border-[#F0EAE0] pt-4 lg:grid-cols-2">
            <div className="flex flex-col gap-3">
                <p className="text-sm"><strong>WhatsApp:</strong> {p.whatsapp || "—"} · <strong>Correo:</strong> {p.correo || "—"}</p>
                <div className="grid gap-3 sm:grid-cols-3">
                    <label className="flex flex-col gap-1 text-sm font-semibold">Etapa
                        <select className={input} value={stage} onChange={(e) => setStage(e.target.value as Stage)}>{STAGES.map((s) => <option key={s}>{s}</option>)}</select>
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-semibold">Responsable<input className={input} value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Recepción" /></label>
                    <label className="flex flex-col gap-1 text-sm font-semibold">Próximo seguimiento<input type="date" className={input} value={next} onChange={(e) => setNext(e.target.value)} /></label>
                </div>
                <label className="flex flex-col gap-1 text-sm font-semibold">Nueva nota
                    <textarea rows={3} className={input} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Qué se habló, qué sigue. Sin datos clínicos sensibles." />
                </label>
                <button type="button" onClick={save} disabled={busy} className={`${btnPrimary} self-start`}>{busy ? "Guardando…" : "Guardar ficha"}</button>
            </div>
            <div>
                <h3 className="mb-2 text-sm font-bold text-[#153D32]">Historial</h3>
                <ol className="flex flex-col gap-2 text-sm">
                    {timeline.map((t, i) => (
                        <li key={i} className="rounded-xl bg-[#FBF9F5] p-3">
                            <span className="text-xs text-[#5C564D]">{t.at ? new Date(t.at).toLocaleString("es-MX") : "—"} · <strong>{t.label}</strong></span>
                            <p>{t.text}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}
