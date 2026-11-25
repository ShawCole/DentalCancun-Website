"use client";

import { useEffect, useMemo, useState } from "react";
import { loadSetting, saveSetting } from "@/lib/settings/client";
import { normPath, type Redirect } from "@/lib/settings";
import { Badge, btnDanger, btnGhost, btnPrimary, card, input, Notice, PageHeader } from "@/components/admin/ui";

/** Addresses of the current site (Shaw's pages) with a proposed new home. Review before launch. */
const SUGGESTED: Redirect[] = [
    { from: "/veneers", to: "/en/treatments/emax-zirconia-veneers", code: 301, note: "Página actual de carillas" },
    { from: "/lp/porcelain-veneers", to: "/en/treatments/emax-zirconia-veneers", code: 301, note: "Landing de anuncios" },
    { from: "/lp/no-prep-veneers", to: "/en/treatments/direct-composite-veneers", code: 301, note: "Landing de anuncios" },
    { from: "/implants", to: "/en/treatments/dental-implants", code: 301, note: "Página actual de implantes" },
    { from: "/smile-makeover", to: "/en/treatments", code: 301, note: "Página actual de diseño de sonrisa" },
    { from: "/lp/smile-design", to: "/en/treatments", code: 301, note: "Landing de anuncios" },
    { from: "/schedule", to: "/en#agendar", code: 301, note: "Agenda actual" },
    { from: "/stories", to: "/en#testimonios", code: 301, note: "Testimonios actuales" },
    { from: "/vip", to: "/en#concierge", code: 301, note: "Experiencia VIP" },
    { from: "/lp/vip-experience", to: "/en#concierge", code: 301, note: "Landing VIP" },
    { from: "/privacy", to: "/en/privacy-notice", code: 301, note: "Aviso de privacidad" },
];

export default function Redirecciones() {
    const [items, setItems] = useState<Redirect[] | null>(null);
    const [saved, setSaved] = useState("");
    const [draft, setDraft] = useState<Redirect>({ from: "", to: "", code: 301, note: "" });
    const [msg, setMsg] = useState<{ kind: "ok" | "error" | "warn"; text: string } | null>(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        loadSetting("redirects")
            .then((r) => {
                setItems(r.items);
                setSaved(JSON.stringify(r.items));
            })
            .catch((e) => setMsg({ kind: "error", text: e.message }));
    }, []);

    const dirty = items !== null && JSON.stringify(items) !== saved;

    function problem(r: Redirect, list: Redirect[]): string {
        const from = normPath(r.from);
        if (from === "/") return "No se puede redirigir la página principal desde aquí.";
        if (from === "/es" || from === "/en" || ["/admin", "/api", "/_next"].some((p) => from === p || from.startsWith(`${p}/`))) return "Esa dirección está reservada por el sitio.";
        if (!r.to.trim()) return "Falta la dirección de destino.";
        if (normPath(r.to) === from && !/^https?:/i.test(r.to)) return "El origen y el destino son iguales.";
        if (list.some((x) => normPath(x.from) === from)) return "Ya existe una redirección desde esa dirección.";
        if (list.some((x) => normPath(x.to) === from)) return "Otra redirección apunta a esta dirección: se formaría una cadena.";
        return "";
    }

    function add(r: Redirect) {
        if (!items) return;
        const clean = { ...r, from: normPath(r.from), to: r.to.trim().startsWith("http") ? r.to.trim() : normPath(r.to.split("#")[0]) + (r.to.includes("#") ? "#" + r.to.split("#")[1] : "") };
        const err = problem(clean, items);
        if (err) return setMsg({ kind: "error", text: err });
        setItems([...items, clean]);
        setDraft({ from: "", to: "", code: 301, note: "" });
        setMsg(null);
    }

    async function save() {
        if (!items) return;
        setBusy(true);
        try {
            await saveSetting("redirects", { items });
            setSaved(JSON.stringify(items));
            setMsg({ kind: "ok", text: "Guardado. Las redirecciones se aplican en el sitio en un minuto." });
        } catch (e: unknown) {
            setMsg({ kind: "error", text: e instanceof Error ? e.message : "No se pudo guardar." });
        } finally {
            setBusy(false);
        }
    }

    const pending = useMemo(() => SUGGESTED.filter((s) => !items?.some((i) => normPath(i.from) === s.from)), [items]);

    return (
        <div className="flex max-w-5xl flex-col gap-6">
            <PageHeader kicker="Sitio" title="Redirecciones">
                <button type="button" onClick={save} disabled={!dirty || busy} className={btnPrimary}>{busy ? "Guardando…" : dirty ? "Guardar cambios" : "Sin cambios"}</button>
            </PageHeader>
            <p className="max-w-3xl text-sm text-[#5C564D]">
                Cuando una página cambia de dirección, una redirección 301 manda a los visitantes (y a Google) a la nueva, sin perder el posicionamiento ni los anuncios activos. Úsala también para enlaces cortos de campañas.
            </p>
            {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}

            <section className={`${card} flex flex-col gap-4`}>
                <h2 className="font-bold text-[#153D32]">Nueva redirección</h2>
                <div className="grid gap-3 md:grid-cols-[1fr_1fr_120px]">
                    <label className="flex flex-col gap-1 text-sm font-semibold">Desde (dirección vieja)<input className={input} placeholder="/veneers" value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} /></label>
                    <label className="flex flex-col gap-1 text-sm font-semibold">Hacia (dirección nueva)<input className={input} placeholder="/en/treatments/dental-implants" value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} /></label>
                    <label className="flex flex-col gap-1 text-sm font-semibold">Tipo
                        <select className={input} value={draft.code} onChange={(e) => setDraft({ ...draft, code: Number(e.target.value) as 301 | 302 })}>
                            <option value={301}>301 · permanente</option>
                            <option value={302}>302 · temporal</option>
                        </select>
                    </label>
                </div>
                <label className="flex flex-col gap-1 text-sm font-semibold">Nota (opcional)<input className={input} value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} /></label>
                <button type="button" onClick={() => add(draft)} className={`${btnGhost} self-start`}>Agregar a la lista</button>
            </section>

            <section className={card}>
                <h2 className="mb-3 font-bold text-[#153D32]">Activas {items ? `(${items.length})` : ""}</h2>
                {!items ? (
                    <p className="text-sm text-[#5C564D]">Cargando…</p>
                ) : items.length === 0 ? (
                    <p className="text-sm text-[#5C564D]">Todavía no hay redirecciones.</p>
                ) : (
                    <ul className="flex flex-col divide-y divide-[#F0EAE0]">
                        {items.map((r, i) => (
                            <li key={r.from} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                                <span className="min-w-0 break-all">
                                    <code className="font-semibold">{r.from}</code> → <code>{r.to}</code> <Badge tone={r.code === 301 ? "green" : "amber"}>{r.code}</Badge>
                                    {r.note && <span className="block text-xs text-[#5C564D]">{r.note}</span>}
                                </span>
                                <span className="flex gap-2">
                                    <a href={r.from} target="_blank" rel="noreferrer" className={btnGhost}>Probar</a>
                                    <button type="button" onClick={() => setItems(items.filter((_, k) => k !== i))} className={btnDanger}>Quitar</button>
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {pending.length > 0 && (
                <section className={card}>
                    <h2 className="font-bold text-[#153D32]">Sugeridas para el lanzamiento</h2>
                    <p className="mb-3 mt-1 text-sm text-[#5C564D]">
                        Direcciones del sitio actual de dentalcancun.com. Actívalas solo el día del cambio de sitio y revísalas con Shaw: al agregarlas, la página vieja deja de mostrarse.
                    </p>
                    <ul className="flex flex-col divide-y divide-[#F0EAE0]">
                        {pending.map((r) => (
                            <li key={r.from} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                                <span className="break-all"><code className="font-semibold">{r.from}</code> → <code>{r.to}</code><span className="block text-xs text-[#5C564D]">{r.note}</span></span>
                                <button type="button" onClick={() => add(r)} className={btnGhost}>Agregar</button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
