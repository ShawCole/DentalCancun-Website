"use client";

import { Fragment, useEffect, useState } from "react";
import { collection, doc, getDocs, limit, orderBy, query, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Lead {
    id: string;
    nombre: string;
    whatsapp: string;
    correo?: string;
    pais?: string;
    idioma?: string;
    tratamiento: string;
    alternativa?: string;
    prioridad: string;
    viaje?: string;
    agenda?: string;
    notas?: string;
    regla?: string;
    ruta?: string;
    estado: string;
    createdAt?: Timestamp;
}

const ESTADOS = ["nuevo", "contactado", "valoración agendada", "cerrado"];
const badge: Record<string, string> = { Alta: "bg-[#E3EFE6] text-[#1F5A36]", Media: "bg-[#FBEFD5] text-[#6B4500]", Nutrir: "bg-[#EEEBE5] text-[#4A453D]" };

export default function AdminLeads() {
    const [leads, setLeads] = useState<Lead[] | null>(null);
    const [open, setOpen] = useState<string | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const d = db();
        if (!d) return;
        getDocs(query(collection(d, "leads"), orderBy("createdAt", "desc"), limit(200)))
            .then((s) => setLeads(s.docs.map((x) => ({ id: x.id, ...(x.data() as Omit<Lead, "id">) }))))
            .catch((e) => setError(e.message));
    }, []);

    async function setEstado(l: Lead, estado: string) {
        const d = db();
        if (!d) return;
        await updateDoc(doc(d, "leads", l.id), { estado });
        setLeads((all) => all?.map((x) => (x.id === l.id ? { ...x, estado } : x)) || null);
    }

    return (
        <div className="flex max-w-6xl flex-col gap-6">
            <header>
                <p className="text-xs text-[#5C564D]">Operación</p>
                <h1 className="font-serif text-4xl font-semibold text-[#153D32]">Diagnósticos del quiz</h1>
            </header>
            <p className="rounded-xl bg-[#FFF7E6] px-4 py-3 text-sm text-[#5A3D00]">
                Datos de pacientes: no los compartas fuera del equipo ni los copies a otros archivos.
            </p>
            {error && <p role="alert" className="rounded-xl bg-[#FDECEC] px-4 py-3 text-sm text-[#8A1F1F]">{error}</p>}
            {!leads ? (
                <p className="text-sm text-[#5C564D]">Cargando…</p>
            ) : leads.length === 0 ? (
                <p className="text-sm text-[#5C564D]">Aún no hay diagnósticos.</p>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-[#E5DDD0] bg-white">
                    <table className="w-full min-w-[760px] border-collapse text-sm">
                        <thead>
                            <tr className="text-left text-xs text-[#5C564D]">
                                <th className="px-5 py-3 font-semibold">Paciente</th>
                                <th className="px-3 py-3 font-semibold">Ruta sugerida</th>
                                <th className="px-3 py-3 font-semibold">Prioridad</th>
                                <th className="px-3 py-3 font-semibold">Estado</th>
                                <th className="px-5 py-3"><span className="sr-only">Acciones</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((l) => (
                                <Fragment key={l.id}>
                                    <tr className="border-t border-[#F0EAE0] align-top">
                                        <td className="px-5 py-3 font-semibold">
                                            {l.nombre}
                                            <span className="block text-xs font-normal text-[#5C564D]">
                                                {l.createdAt?.toDate().toLocaleString("es-MX")} · {l.idioma} · {l.pais}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3">{l.tratamiento}</td>
                                        <td className="px-3 py-3">
                                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${badge[l.prioridad] || ""}`}>{l.prioridad}</span>
                                        </td>
                                        <td className="px-3 py-3">
                                            <label className="sr-only" htmlFor={`e-${l.id}`}>Estado</label>
                                            <select id={`e-${l.id}`} value={l.estado} onChange={(e) => setEstado(l, e.target.value)} className="min-h-11 rounded-lg border border-[#CFC5B3] px-2">
                                                {ESTADOS.map((s) => (
                                                    <option key={s}>{s}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3 text-right">
                                            <button onClick={() => setOpen(open === l.id ? null : l.id)} aria-expanded={open === l.id} className="mr-3 font-semibold text-[#153D32] underline">
                                                Detalle
                                            </button>
                                            <a href={`https://wa.me/${l.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="font-semibold text-[#153D32] underline">
                                                WhatsApp
                                            </a>
                                        </td>
                                    </tr>
                                    {open === l.id && (
                                        <tr className="bg-[#FBF9F5]">
                                            <td colSpan={5} className="px-5 py-4 text-sm">
                                                <p><strong>WhatsApp:</strong> {l.whatsapp} {l.correo && <>· <strong>Correo:</strong> {l.correo}</>}</p>
                                                <p className="mt-1"><strong>Viaje:</strong> {l.viaje} · <strong>Agenda:</strong> {l.agenda}</p>
                                                {l.alternativa && <p className="mt-1"><strong>Alternativa:</strong> {l.alternativa}</p>}
                                                {l.regla && <p className="mt-1"><strong>Regla:</strong> {l.regla}</p>}
                                                {l.notas && <p className="mt-1"><strong>Notas clínicas:</strong> {l.notas}</p>}
                                                {l.ruta && <pre className="mt-3 whitespace-pre-wrap font-sans text-xs text-[#5C564D]">{l.ruta}</pre>}
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
