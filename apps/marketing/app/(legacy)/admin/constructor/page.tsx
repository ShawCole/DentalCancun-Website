"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { loadSetting } from "@/lib/settings/client";
import type { BuilderSummary } from "@/lib/settings";
import { createPage, deletePage, duplicatePage, loadDraft, unpublishPage } from "@/lib/builder/client";
import { TEMPLATES } from "@/lib/builder/templates";
import { slugify, SLUG_RE, TAKEN } from "@/lib/builder/store";
import { Badge, btnDanger, btnGhost, btnPrimary, card, input, Notice, PageHeader } from "@/components/admin/ui";

export default function Constructor() {
    const router = useRouter();
    const [pages, setPages] = useState<BuilderSummary[] | null>(null);
    const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
    const [creating, setCreating] = useState<null | { from?: BuilderSummary }>(null);
    const [form, setForm] = useState({ lang: "es" as "es" | "en", title: "", slug: "", template: "landing" });
    const [busy, setBusy] = useState(false);

    const reload = () => loadSetting("builder").then((s) => setPages(s.pages)).catch((e) => setMsg({ kind: "error", text: e.message }));
    useEffect(() => {
        reload();
    }, []);

    async function submit(e: FormEvent) {
        e.preventDefault();
        const slug = slugify(form.slug || form.title);
        if (!form.title.trim()) return setMsg({ kind: "error", text: "Escribe un título." });
        if (!SLUG_RE.test(slug) || TAKEN.includes(slug)) return setMsg({ kind: "error", text: "Esa dirección no está disponible. Usa letras, números y guiones." });
        setBusy(true);
        try {
            let id: string;
            if (creating?.from) {
                const src = await loadDraft(creating.from.id);
                if (!src) throw new Error("No se encontró la página original.");
                id = await duplicatePage(src, form.lang, slug, form.title.trim());
            } else id = await createPage(form.lang, slug, form.title.trim(), form.template);
            router.push(`/admin/constructor/${encodeURIComponent(id)}`);
        } catch (e: unknown) {
            setMsg({ kind: "error", text: e instanceof Error ? e.message : "No se pudo crear." });
            setBusy(false);
        }
    }

    async function act(p: BuilderSummary, action: "unpublish" | "delete") {
        if (action === "delete" && !window.confirm(`¿Borrar «${p.title}»? Esta acción no se puede deshacer.`)) return;
        try {
            if (action === "unpublish") await unpublishPage(p.id);
            else await deletePage(p.id);
            setMsg({ kind: "ok", text: action === "unpublish" ? "La página ya no se ve en el sitio (el borrador se conserva)." : "Página borrada." });
            reload();
        } catch (e: unknown) {
            setMsg({ kind: "error", text: e instanceof Error ? e.message : "No se pudo completar." });
        }
    }

    return (
        <div className="flex max-w-5xl flex-col gap-6">
            <PageHeader kicker="Sitio" title="Constructor de páginas">
                <button type="button" onClick={() => { setCreating({}); setForm({ lang: "es", title: "", slug: "", template: "landing" }); }} className={btnPrimary}>Nueva página</button>
            </PageHeader>
            <p className="max-w-3xl text-sm text-[#5C564D]">
                Arma páginas nuevas arrastrando bloques aprobados (portada, tarjetas, precios, testimonios, preguntas…). Todas conservan el diseño del sitio. Úsalo para landings de anuncios, promociones y páginas informativas. Las páginas principales se editan en «Páginas y textos».
            </p>
            {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}

            {creating && (
                <form onSubmit={submit} className={`${card} flex flex-col gap-4`}>
                    <h2 className="font-bold text-[#153D32]">{creating.from ? `Duplicar «${creating.from.title}»` : "Nueva página"}</h2>
                    <div className="grid gap-3 md:grid-cols-[120px_1fr_1fr]">
                        <label className="flex flex-col gap-1 text-sm font-semibold">Idioma
                            <select className={input} value={form.lang} onChange={(e) => setForm({ ...form, lang: e.target.value as "es" | "en" })}>
                                <option value="es">Español</option>
                                <option value="en">Inglés</option>
                            </select>
                        </label>
                        <label className="flex flex-col gap-1 text-sm font-semibold">Título<input className={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || "" })} /></label>
                        <label className="flex flex-col gap-1 text-sm font-semibold">Dirección
                            <span className="flex items-center gap-1 font-normal"><span className="text-[#5C564D]">/{form.lang}/</span><input className={input} value={form.slug || slugify(form.title)} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} /></span>
                        </label>
                    </div>
                    {!creating.from && (
                        <fieldset className="grid gap-3 md:grid-cols-2">
                            <legend className="mb-2 text-sm font-semibold">Plantilla</legend>
                            {TEMPLATES.map((t) => (
                                <label key={t.id} className={`flex cursor-pointer gap-3 rounded-xl border p-3 text-sm ${form.template === t.id ? "border-[#153D32] bg-[#F6F3ED]" : "border-[#E5DDD0]"}`}>
                                    <input type="radio" name="tpl" value={t.id} checked={form.template === t.id} onChange={() => setForm({ ...form, template: t.id })} className="mt-1 accent-[#153D32]" />
                                    <span><strong>{t.label}</strong><span className="block text-[#5C564D]">{t.text}</span></span>
                                </label>
                            ))}
                        </fieldset>
                    )}
                    <div className="flex gap-2">
                        <button type="submit" disabled={busy} className={btnPrimary}>{busy ? "Creando…" : "Crear y abrir el editor"}</button>
                        <button type="button" onClick={() => setCreating(null)} className={btnGhost}>Cancelar</button>
                    </div>
                </form>
            )}

            <section className={card}>
                {!pages ? (
                    <p className="text-sm text-[#5C564D]">Cargando…</p>
                ) : pages.length === 0 ? (
                    <p className="text-sm text-[#5C564D]">Aún no hay páginas creadas con el constructor.</p>
                ) : (
                    <ul className="flex flex-col divide-y divide-[#F0EAE0]">
                        {pages.map((p) => (
                            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                                <span className="min-w-0">
                                    <strong>{p.title}</strong> <Badge tone={p.published ? "green" : "amber"}>{p.published ? "Publicada" : "Borrador"}</Badge>
                                    <span className="block text-xs text-[#5C564D]">/{p.lang}/{p.slug}</span>
                                </span>
                                <span className="flex flex-wrap gap-2">
                                    <Link href={`/admin/constructor/${encodeURIComponent(p.id)}`} className={btnPrimary}>Editar</Link>
                                    {p.published && <a href={`/${p.lang}/${p.slug}`} target="_blank" rel="noreferrer" className={btnGhost}>Ver</a>}
                                    <button type="button" onClick={() => { setCreating({ from: p }); setForm({ lang: p.lang === "es" ? "en" : "es", title: p.title, slug: p.slug, template: "blank" }); }} className={btnGhost}>Duplicar / traducir</button>
                                    {p.published && <button type="button" onClick={() => act(p, "unpublish")} className={btnGhost}>Despublicar</button>}
                                    <button type="button" onClick={() => act(p, "delete")} className={btnDanger}>Borrar</button>
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
