"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { requireDb } from "@/lib/settings/client";
import { card, Notice } from "./ui";

type Stat = { day: string; view?: Record<string, number>; quiz_start?: Record<string, number>; quiz_done?: Record<string, number>; book?: Record<string, number>; photos?: Record<string, number>; whatsapp?: Record<string, number>; pages?: Record<string, number> };
type Row = Record<string, unknown>;
const sum = (o?: Record<string, number>) => (o ? Object.values(o).reduce((a, b) => a + (b || 0), 0) : 0);
const dayOf = (ms: number) => new Date(ms - 5 * 3600_000).toISOString().slice(0, 10);

export function Dashboard() {
    const [days, setDays] = useState(30);
    const [data, setData] = useState<{ stats: Stat[]; leads: Row[]; citas: Row[]; fotos: Row[] } | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        setData(null);
        const from = Date.now() - days * 86_400_000;
        const db = requireDb();
        const since = Timestamp.fromMillis(from);
        const get = (name: string) => getDocs(query(collection(db, name), where("createdAt", ">=", since))).then((s) => s.docs.map((d) => d.data())).catch(() => [] as Row[]);
        Promise.all([
            getDocs(query(collection(db, "stats"), where("day", ">=", dayOf(from)))).then((s) => s.docs.map((d) => d.data() as Stat)).catch(() => [] as Stat[]),
            get("leads"),
            get("appointments"),
            get("photo_submissions"),
        ])
            .then(([stats, leads, citas, fotos]) => setData({ stats, leads, citas, fotos }))
            .catch((e) => setError(e.message));
    }, [days]);

    const m = useMemo(() => {
        if (!data) return null;
        const { stats, leads, citas, fotos } = data;
        const t = (k: keyof Stat) => stats.reduce((a, s) => a + sum(s[k] as Record<string, number>), 0);
        const lang = (k: keyof Stat, l: string) => stats.reduce((a, s) => a + ((s[k] as Record<string, number>)?.[l] || 0), 0);
        const paid = citas.filter((c) => (c.deposit as { status?: string })?.status === "pagado").length;
        const series: { dia: string; visitas: number; diagnosticos: number; citas: number }[] = [];
        for (let i = days - 1; i >= 0; i--) {
            const d = dayOf(Date.now() - i * 86_400_000);
            const s = stats.find((x) => x.day === d);
            const cnt = (rows: Row[]) => rows.filter((r) => dayOf((r.createdAt as Timestamp)?.toMillis?.() || 0) === d).length;
            series.push({ dia: d.slice(5), visitas: sum(s?.view), diagnosticos: cnt(leads), citas: cnt(citas) });
        }
        const byTreatment = Object.entries(leads.reduce<Record<string, number>>((a, l) => ((a[String(l.tratamiento || "—")] = (a[String(l.tratamiento || "—")] || 0) + 1), a), {})).sort((a, b) => b[1] - a[1]);
        const pages = Object.entries(stats.reduce<Record<string, number>>((a, s) => { for (const [k, v] of Object.entries(s.pages || {})) a[k] = (a[k] || 0) + v; return a; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 8);
        const leadLang = (l: string) => leads.filter((x) => String(x.idioma || "").toLowerCase() === l).length;
        return {
            funnel: [
                { label: "Visitas", value: t("view") },
                { label: "Iniciaron el diagnóstico", value: t("quiz_start") },
                { label: "Diagnósticos completos", value: leads.length },
                { label: "Citas solicitadas", value: citas.length },
                { label: "Anticipos pagados", value: paid },
            ],
            extra: [
                { label: "Fotos para valoración", value: fotos.length },
                { label: "Clics a WhatsApp", value: t("whatsapp") },
            ],
            langs: [
                { l: "Español", v: lang("view", "es"), d: leadLang("es"), c: citas.filter((c) => c.idioma === "es").length },
                { l: "Inglés", v: lang("view", "en"), d: leadLang("en"), c: citas.filter((c) => c.idioma === "en").length },
            ],
            series,
            byTreatment,
            pages,
            hasStats: stats.length > 0,
        };
    }, [data, days]);

    const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)} %` : "—");

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-[#153D32]">Conversiones</h2>
                <div role="group" aria-label="Periodo" className="inline-flex overflow-hidden rounded-lg border border-[#CFC5B3]">
                    {[7, 30, 90].map((d) => (
                        <button key={d} type="button" onClick={() => setDays(d)} aria-pressed={days === d} className={`min-h-11 px-4 text-sm font-semibold ${days === d ? "bg-[#153D32] text-[#F6F3ED]" : "bg-white text-[#153D32]"}`}>{d} días</button>
                    ))}
                </div>
            </div>
            {error && <Notice kind="error">{error}</Notice>}
            {!m ? (
                <p className="text-sm text-[#5C564D]">Cargando…</p>
            ) : (
                <>
                    {!m.hasStats && <Notice kind="info">Las visitas se cuentan solo cuando el visitante acepta las cookies de medición, y requieren Firebase en el servidor. Los diagnósticos, fotos y citas sí se cuentan siempre.</Notice>}
                    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        {m.funnel.map((f, i) => (
                            <li key={f.label} className={`${card} flex flex-col gap-1 py-4`}>
                                <span className="text-xs text-[#5C564D]">{f.label}</span>
                                <span className="font-serif text-4xl text-[#153D32]">{f.value.toLocaleString("es-MX")}</span>
                                {i > 0 && <span className="text-xs text-[#5C564D]">{pct(f.value, m.funnel[i - 1].value)} del paso anterior</span>}
                            </li>
                        ))}
                    </ol>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {m.extra.map((f) => (
                            <div key={f.label} className={`${card} flex items-center justify-between py-4`}>
                                <span className="text-sm text-[#5C564D]">{f.label}</span>
                                <span className="font-serif text-3xl text-[#153D32]">{f.value}</span>
                            </div>
                        ))}
                    </div>
                    <section className={card}>
                        <h3 className="mb-3 font-bold text-[#153D32]">Día a día</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer>
                                <LineChart data={m.series} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                                    <CartesianGrid stroke="#EEE7DA" vertical={false} />
                                    <XAxis dataKey="dia" tick={{ fontSize: 11, fill: "#5C564D" }} interval="preserveStartEnd" />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#5C564D" }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="visitas" name="Visitas" stroke="#B69A62" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="diagnosticos" name="Diagnósticos" stroke="#153D32" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="citas" name="Citas" stroke="#1E4567" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="mt-2 flex flex-wrap gap-4 text-xs text-[#5C564D]">
                            <span><span aria-hidden="true" style={{ color: "#B69A62" }}>■</span> Visitas</span>
                            <span><span aria-hidden="true" style={{ color: "#153D32" }}>■</span> Diagnósticos</span>
                            <span><span aria-hidden="true" style={{ color: "#1E4567" }}>■</span> Citas</span>
                        </p>
                    </section>
                    <div className="grid gap-4 lg:grid-cols-3">
                        <section className={card}>
                            <h3 className="mb-3 font-bold text-[#153D32]">Por idioma</h3>
                            <table className="w-full text-sm">
                                <thead><tr className="text-left text-xs text-[#5C564D]"><th className="py-1 font-semibold">Idioma</th><th className="font-semibold">Visitas</th><th className="font-semibold">Diagn.</th><th className="font-semibold">Citas</th></tr></thead>
                                <tbody>{m.langs.map((r) => <tr key={r.l} className="border-t border-[#F0EAE0]"><td className="py-2">{r.l}</td><td>{r.v}</td><td>{r.d}</td><td>{r.c}</td></tr>)}</tbody>
                            </table>
                        </section>
                        <section className={card}>
                            <h3 className="mb-3 font-bold text-[#153D32]">Ruta sugerida en el diagnóstico</h3>
                            {m.byTreatment.length ? (
                                <ul className="flex flex-col gap-2 text-sm">
                                    {m.byTreatment.slice(0, 7).map(([k, v]) => (
                                        <li key={k}>
                                            <span className="flex justify-between"><span>{k}</span><strong>{v}</strong></span>
                                            <span className="mt-1 block h-1.5 rounded-full bg-[#153D32]" style={{ width: `${(v / m.byTreatment[0][1]) * 100}%` }} />
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-sm text-[#5C564D]">Sin diagnósticos en el periodo.</p>}
                        </section>
                        <section className={card}>
                            <h3 className="mb-3 font-bold text-[#153D32]">Páginas más vistas</h3>
                            {m.pages.length ? (
                                <ul className="flex flex-col gap-1 text-sm">{m.pages.map(([k, v]) => <li key={k} className="flex justify-between"><span>{k.replace("tratamiento_", "Tratamiento · ")}</span><strong>{v}</strong></li>)}</ul>
                            ) : <p className="text-sm text-[#5C564D]">Sin datos aún.</p>}
                        </section>
                    </div>
                    <p className="text-xs text-[#5C564D]">Detalle de cada paciente en <Link href="/admin/pacientes" className="underline">Pacientes</Link>. Las cifras de anuncios (Meta) se consultan en su propio administrador.</p>
                </>
            )}
        </div>
    );
}
