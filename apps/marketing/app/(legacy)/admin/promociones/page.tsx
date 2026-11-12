"use client";

import { useEffect, useState } from "react";
import { loadSetting, saveSetting } from "@/lib/settings/client";
import { promoState, type Promotion } from "@/lib/settings";
import { brandIssues } from "@/lib/brand";
import { ImageField } from "@/components/admin/ImageField";
import { Badge, btnDanger, btnGhost, btnPrimary, card, input, Notice, PageHeader } from "@/components/admin/ui";

const blank = (): Promotion => ({
    id: Math.random().toString(36).slice(2, 10),
    active: false,
    start: "",
    end: "",
    placement: "barra",
    href: "/es#agendar",
    image: "",
    es: { title: "", text: "", cta: "Agendar valoración" },
    en: { title: "", text: "", cta: "Book a consultation" },
});
const tone = { activa: "green", programada: "blue", terminada: "neutral", pausada: "amber" } as const;

export default function Promociones() {
    const [items, setItems] = useState<Promotion[] | null>(null);
    const [saved, setSaved] = useState("");
    const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        loadSetting("promotions").then((p) => { setItems(p.items); setSaved(JSON.stringify(p.items)); }).catch((e) => setMsg({ kind: "error", text: e.message }));
    }, []);

    const dirty = items !== null && JSON.stringify(items) !== saved;
    const upd = (i: number, p: Partial<Promotion>) => setItems((all) => all!.map((x, k) => (k === i ? { ...x, ...p } : x)));

    async function save() {
        if (!items) return;
        for (const p of items) {
            if (!p.active) continue;
            if (!p.es.title || !p.en.title) return setMsg({ kind: "error", text: "Cada promoción activa necesita título en español e inglés." });
            if (p.start && p.end && p.end < p.start) return setMsg({ kind: "error", text: `«${p.es.title}»: la fecha de fin es anterior al inicio.` });
            const issues = brandIssues(`${p.es.title} ${p.es.text} ${p.en.title} ${p.en.text}`);
            if (issues.length) return setMsg({ kind: "error", text: `«${p.es.title}»: ${issues.map((x) => x.text).join(" · ")}` });
        }
        setBusy(true);
        try {
            await saveSetting("promotions", { items });
            setSaved(JSON.stringify(items));
            setMsg({ kind: "ok", text: "Guardado. Las promociones aparecen y terminan solas según sus fechas." });
        } catch (e: unknown) {
            setMsg({ kind: "error", text: e instanceof Error ? e.message : "No se pudo guardar." });
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="flex max-w-5xl flex-col gap-6">
            <PageHeader kicker="Contenido" title="Promociones">
                <button type="button" onClick={() => setItems([...(items || []), blank()])} className={btnGhost}>Nueva promoción</button>
                <button type="button" onClick={save} disabled={!dirty || busy} className={btnPrimary}>{busy ? "Guardando…" : dirty ? "Guardar cambios" : "Sin cambios"}</button>
            </PageHeader>
            <p className="max-w-3xl text-sm text-[#5C564D]">
                Ofertas de temporada con fecha de inicio y fin (hora de Cancún). Se muestran como barra superior o como ventana al entrar al sitio. Condiciones y montos siempre aprobados por la clínica; nada de descuentos sin comprobar.
            </p>
            {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}
            {!items ? (
                <p className="text-sm text-[#5C564D]">Cargando…</p>
            ) : items.length === 0 ? (
                <p className="text-sm text-[#5C564D]">No hay promociones.</p>
            ) : (
                items.map((p, i) => {
                    const st = promoState(p);
                    return (
                        <section key={p.id} className={`${card} flex flex-col gap-4`}>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h2 className="font-bold text-[#153D32]">{p.es.title || "Promoción sin título"} <Badge tone={tone[st]}>{st}</Badge></h2>
                                <div className="flex gap-2">
                                    <label className="flex min-h-11 items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={p.active} onChange={(e) => upd(i, { active: e.target.checked })} className="h-5 w-5 accent-[#153D32]" />Activa</label>
                                    <button type="button" onClick={() => setItems(items.filter((_, k) => k !== i))} className={btnDanger}>Quitar</button>
                                </div>
                            </div>
                            <div className="grid gap-3 md:grid-cols-4">
                                <label className="flex flex-col gap-1 text-sm font-semibold">Inicio<input type="date" className={input} value={p.start} onChange={(e) => upd(i, { start: e.target.value })} /></label>
                                <label className="flex flex-col gap-1 text-sm font-semibold">Fin<input type="date" className={input} value={p.end} onChange={(e) => upd(i, { end: e.target.value })} /></label>
                                <label className="flex flex-col gap-1 text-sm font-semibold">Formato
                                    <select className={input} value={p.placement} onChange={(e) => upd(i, { placement: e.target.value as Promotion["placement"] })}>
                                        <option value="barra">Barra superior</option>
                                        <option value="ventana">Ventana al entrar</option>
                                    </select>
                                </label>
                                <label className="flex flex-col gap-1 text-sm font-semibold">Enlace del botón<input className={input} value={p.href} onChange={(e) => upd(i, { href: e.target.value })} /></label>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                {(["es", "en"] as const).map((l) => (
                                    <fieldset key={l} className="flex flex-col gap-2 rounded-xl border border-[#F0EAE0] p-3">
                                        <legend className="px-1 text-sm font-bold">{l === "es" ? "Español" : "Inglés"}</legend>
                                        <label className="flex flex-col gap-1 text-sm font-semibold">Título<input className={input} value={p[l].title} onChange={(e) => upd(i, { [l]: { ...p[l], title: e.target.value } })} /></label>
                                        <label className="flex flex-col gap-1 text-sm font-semibold">Texto<textarea rows={2} className={input} value={p[l].text} onChange={(e) => upd(i, { [l]: { ...p[l], text: e.target.value } })} /></label>
                                        <label className="flex flex-col gap-1 text-sm font-semibold">Botón<input className={input} value={p[l].cta} onChange={(e) => upd(i, { [l]: { ...p[l], cta: e.target.value } })} /></label>
                                    </fieldset>
                                ))}
                            </div>
                            {p.placement === "ventana" && <div className="flex flex-col gap-2 text-sm font-semibold">Imagen de la ventana (opcional)<ImageField value={p.image || ""} onChange={(v) => upd(i, { image: v })} /></div>}
                            <p className="text-xs text-[#5C564D]">El enlace es el mismo en ambos idiomas; si apunta a una página en español, el visitante en inglés llegará a ella. Usa un ancla como #agendar para abrir la agenda en el idioma de cada visitante.</p>
                        </section>
                    );
                })
            )}
        </div>
    );
}
