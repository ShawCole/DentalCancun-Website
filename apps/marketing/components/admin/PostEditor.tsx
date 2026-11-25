"use client";

import "@/app/(site)/site.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { deletePost, loadPost, savePost } from "@/lib/blog/client";
import { seoChecks } from "@/lib/blog/seo";
import { markdownToHtml } from "@/lib/blog/markdown";
import { blogId, CATEGORIES, emptyPost, type Post } from "@/lib/blog/types";
import { slugify } from "@/lib/builder/store";
import { translateDraft } from "@/lib/ai/client";
import { ImageField } from "./ImageField";
import { MediaLibrary } from "./MediaLibrary";
import { Badge, btnDanger, btnGhost, btnPrimary, card, input, Notice, PageHeader } from "./ui";

export function PostEditor({ id, newLang }: { id: string; newLang: "es" | "en" }) {
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(id ? null : emptyPost(newLang));
    const [saved, setSaved] = useState(id ? "" : JSON.stringify(emptyPost(newLang)));
    const [msg, setMsg] = useState<{ kind: "ok" | "error" | "warn"; text: string } | null>(null);
    const [busy, setBusy] = useState(false);
    const [tab, setTab] = useState<"editar" | "vista">("editar");
    const [picking, setPicking] = useState(false);
    const area = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!id) return;
        loadPost(id)
            .then((p) => {
                if (!p) return setMsg({ kind: "error", text: "No se encontró el artículo." });
                setPost(p);
                setSaved(JSON.stringify(p));
            })
            .catch((e) => setMsg({ kind: "error", text: e.message }));
    }, [id]);

    const seo = useMemo(() => (post ? seoChecks(post) : null), [post]);
    const dirty = post !== null && JSON.stringify(post) !== saved;
    if (!post) return <p className="text-sm text-[#5C564D]">{msg?.text || "Cargando…"}</p>;

    const set = (k: keyof Post, v: string) => setPost({ ...post, [k]: v });

    function insert(before: string, after = "", placeholder = "") {
        const el = area.current;
        if (!el || !post) return;
        const { selectionStart: a, selectionEnd: b, value } = el;
        const sel = value.slice(a, b) || placeholder;
        const next = value.slice(0, a) + before + sel + after + value.slice(b);
        setPost({ ...post, body: next });
        requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(a + before.length, a + before.length + sel.length);
        });
    }

    async function save(status: Post["status"]) {
        if (!post) return;
        const slug = slugify(post.slug || post.title);
        if (!post.title.trim() || !slug) return setMsg({ kind: "error", text: "Escribe al menos el título." });
        const next = { ...post, slug, status };
        if (status === "published" && seo && seo.checks.some((c) => c.ok === "fail" && /marca no usa|por validar/.test(c.text))) {
            return setMsg({ kind: "error", text: "Antes de publicar, corrige las frases que la marca no usa y los datos por validar (ver revisión)." });
        }
        setBusy(true);
        try {
            const newId = await savePost(next, id || undefined);
            setPost(next);
            setSaved(JSON.stringify(next));
            setMsg({ kind: "ok", text: status === "published" ? "Publicado. Ya se ve en el blog." : "Borrador guardado." });
            if (newId !== id) router.replace(`/admin/blog/${encodeURIComponent(newId)}`);
        } catch (e: unknown) {
            setMsg({ kind: "error", text: e instanceof Error ? e.message : "No se pudo guardar." });
        } finally {
            setBusy(false);
        }
    }

    async function makeEnglish() {
        if (!post || post.lang !== "es" || !id) return;
        setBusy(true);
        setMsg({ kind: "warn", text: "Generando la versión en inglés…" });
        try {
            const t = await translateDraft(
                { title: post.title, excerpt: post.excerpt, body: post.body, seoTitle: post.seoTitle, seoDescription: post.seoDescription, keyword: post.keyword, coverAlt: post.coverAlt },
                "Artículo del blog de una clínica dental en Cancún para pacientes de Estados Unidos. Conserva el Markdown y los enlaces; cambia los enlaces /es/ por su equivalente en /en/ si es obvio.",
            );
            const slug = slugify(t.title || post.title);
            const en: Post = { ...emptyPost("en"), ...t, cover: post.cover, category: CATEGORIES.en[Math.max(0, CATEGORIES.es.indexOf(post.category))] || CATEGORIES.en[0], slug, pair: post.slug, status: "draft" } as Post;
            const enId = await savePost(en);
            await savePost({ ...post, pair: slug }, id);
            router.push(`/admin/blog/${encodeURIComponent(enId)}`);
        } catch (e: unknown) {
            setMsg({ kind: "error", text: e instanceof Error ? e.message : "No se pudo traducir." });
            setBusy(false);
        }
    }

    async function remove() {
        if (!id || !post || !window.confirm("¿Borrar este artículo? No se puede deshacer.")) return;
        await deletePost(id, post.lang);
        router.push("/admin/blog");
    }

    const tb = "min-h-10 rounded-lg border border-[#CFC5B3] bg-white px-3 text-sm font-semibold";

    return (
        <div className="flex max-w-6xl flex-col gap-6">
            <PageHeader kicker={`Blog · ${post.lang === "es" ? "Español" : "Inglés"}`} title={post.title || "Nuevo artículo"}>
                <Link href="/admin/blog" className={btnGhost}>← Artículos</Link>
                {post.status === "published" && id && <a href={`/${post.lang}/blog/${post.slug}`} target="_blank" rel="noreferrer" className={btnGhost}>Ver</a>}
                <button type="button" onClick={() => save("draft")} disabled={busy} className={btnGhost}>{post.status === "published" ? "Pasar a borrador" : "Guardar borrador"}</button>
                <button type="button" onClick={() => save("published")} disabled={busy || (!dirty && post.status === "published")} className={btnPrimary}>{post.status === "published" ? "Actualizar publicado" : "Publicar"}</button>
            </PageHeader>
            {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}

            <div className="flex flex-wrap items-start gap-5">
                <div className="flex min-w-0 flex-1 flex-col gap-4" style={{ flexBasis: 520 }}>
                    <div className={`${card} flex flex-col gap-4`}>
                        <label className="flex flex-col gap-1 text-sm font-semibold">Título<input className={`${input} text-lg`} value={post.title} onChange={(e) => set("title", e.target.value)} /></label>
                        <div className="grid gap-3 md:grid-cols-2">
                            <label className="flex flex-col gap-1 text-sm font-semibold">Dirección
                                <span className="flex items-center gap-1 font-normal"><span className="text-[#5C564D]">/{post.lang}/blog/</span><input className={input} value={post.slug} placeholder={slugify(post.title)} onChange={(e) => set("slug", slugify(e.target.value))} /></span>
                            </label>
                            <label className="flex flex-col gap-1 text-sm font-semibold">Categoría
                                <select className={input} value={post.category} onChange={(e) => set("category", e.target.value)}>{CATEGORIES[post.lang].map((c) => <option key={c}>{c}</option>)}</select>
                            </label>
                        </div>
                        <label className="flex flex-col gap-1 text-sm font-semibold">Resumen (aparece en el listado)<textarea rows={2} className={input} value={post.excerpt} onChange={(e) => set("excerpt", e.target.value)} /></label>
                        <div className="flex flex-col gap-2 text-sm font-semibold">Imagen de portada<ImageField value={post.cover} onChange={(v) => set("cover", v)} /></div>
                        <label className="flex flex-col gap-1 text-sm font-semibold">Descripción de la portada (accesibilidad)<input className={input} value={post.coverAlt} onChange={(e) => set("coverAlt", e.target.value)} /></label>
                    </div>

                    <div className={`${card} flex flex-col gap-3`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div role="group" aria-label="Modo" className="inline-flex overflow-hidden rounded-lg border border-[#CFC5B3]">
                                {(["editar", "vista"] as const).map((k) => (
                                    <button key={k} type="button" onClick={() => setTab(k)} aria-pressed={tab === k} className={`min-h-10 px-4 text-sm font-semibold ${tab === k ? "bg-[#153D32] text-[#F6F3ED]" : "bg-white"}`}>{k === "editar" ? "Escribir" : "Vista previa"}</button>
                                ))}
                            </div>
                            {tab === "editar" && (
                                <div className="flex flex-wrap gap-1">
                                    <button type="button" className={tb} onClick={() => insert("\n\n## ", "\n\n", "Subtítulo")}>Subtítulo</button>
                                    <button type="button" className={tb} onClick={() => insert("**", "**", "texto")}><strong>N</strong></button>
                                    <button type="button" className={tb} onClick={() => insert("*", "*", "texto")}><em>K</em></button>
                                    <button type="button" className={tb} onClick={() => insert("\n\n- ", "\n", "elemento")}>Lista</button>
                                    <button type="button" className={tb} onClick={() => insert("[", "](/es/tratamientos)", "texto del enlace")}>Enlace</button>
                                    <button type="button" className={tb} onClick={() => setPicking(true)}>Imagen</button>
                                </div>
                            )}
                        </div>
                        {tab === "editar" ? (
                            <textarea ref={area} rows={24} className={`${input} font-mono text-sm leading-relaxed`} value={post.body} onChange={(e) => set("body", e.target.value)} placeholder={"Escribe el artículo.\n\n## Subtítulo\n\nUn párrafo con **negritas** y un [enlace](/es/diagnostico-digital)."} />
                        ) : (
                            <div className="prose-dsc rounded-xl bg-[#F6F3ED] p-6 font-sans" dangerouslySetInnerHTML={{ __html: markdownToHtml(post.body) }} />
                        )}
                    </div>
                </div>

                <aside className="flex w-full flex-col gap-4 lg:w-[340px]">
                    <div className={`${card} flex flex-col gap-3`}>
                        <h2 className="font-bold text-[#153D32]">SEO</h2>
                        <label className="flex flex-col gap-1 text-sm font-semibold">Palabra clave principal<input className={input} value={post.keyword} onChange={(e) => set("keyword", e.target.value)} placeholder={post.lang === "es" ? "carillas en Cancún" : "veneers in Cancun"} /></label>
                        <label className="flex flex-col gap-1 text-sm font-semibold">Título para Google<input className={input} value={post.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} placeholder={post.title} /></label>
                        <label className="flex flex-col gap-1 text-sm font-semibold">Descripción para Google<textarea rows={3} className={input} value={post.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} placeholder={post.excerpt} /></label>
                        <div className="rounded-xl border border-[#E5DDD0] p-3 text-sm">
                            <p className="truncate text-[#1a0dab]">{post.seoTitle || post.title || "Título"}</p>
                            <p className="truncate text-xs text-[#1e6b34]">dentalcancun.com/{post.lang}/blog/{post.slug || slugify(post.title)}</p>
                            <p className="line-clamp-2 text-xs text-[#4d5156]">{post.seoDescription || post.excerpt || "Descripción"}</p>
                        </div>
                    </div>
                    {seo && (
                        <div className={card}>
                            <h2 className="mb-2 flex items-center justify-between font-bold text-[#153D32]">Revisión <Badge tone={seo.score >= 80 ? "green" : seo.score >= 60 ? "amber" : "red"}>{seo.score}/100</Badge></h2>
                            <ul className="flex flex-col gap-2 text-sm">
                                {seo.checks.map((c, i) => (
                                    <li key={i} className="flex gap-2">
                                        <span aria-hidden="true" className={c.ok === "pass" ? "text-[#1F5A36]" : c.ok === "warn" ? "text-[#9A6A00]" : "text-[#8A1F1F]"}>{c.ok === "pass" ? "●" : c.ok === "warn" ? "▲" : "■"}</span>
                                        <span><span className="sr-only">{c.ok === "pass" ? "Bien: " : c.ok === "warn" ? "Mejorable: " : "Corregir: "}</span>{c.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className={`${card} flex flex-col gap-2 text-sm`}>
                        <h2 className="font-bold text-[#153D32]">Idiomas</h2>
                        {post.pair ? (
                            <p>Versión en {post.lang === "es" ? "inglés" : "español"}: <Link className="underline" href={`/admin/blog/${encodeURIComponent(blogId(post.lang === "es" ? "en" : "es", post.pair))}`}>/{post.lang === "es" ? "en" : "es"}/blog/{post.pair}</Link></p>
                        ) : post.lang === "es" ? (
                            <>
                                <p className="text-[#5C564D]">Crea un borrador en inglés natural de EE. UU. para revisarlo antes de publicar.</p>
                                <button type="button" onClick={makeEnglish} disabled={busy || !id || dirty} className={btnGhost}>Crear versión en inglés con IA</button>
                                {(!id || dirty) && <p className="text-xs text-[#5C564D]">Guarda primero el artículo en español.</p>}
                            </>
                        ) : (
                            <p className="text-[#5C564D]">Sin versión en español enlazada.</p>
                        )}
                    </div>
                    {id && <button type="button" onClick={remove} className={btnDanger}>Borrar artículo</button>}
                </aside>
            </div>

            {picking && (
                <div role="dialog" aria-modal="true" aria-label="Insertar imagen" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && setPicking(false)}>
                    <div className="flex max-h-[85vh] w-[min(960px,calc(100vw-32px))] flex-col gap-4 overflow-y-auto rounded-2xl bg-[#F6F3ED] p-5">
                        <div className="flex items-center justify-between">
                            <h2 className="font-serif text-2xl font-semibold text-[#153D32]">Insertar imagen</h2>
                            <button type="button" onClick={() => setPicking(false)} className={btnGhost}>Cerrar</button>
                        </div>
                        <MediaLibrary onSelect={(item) => { insert(`\n\n![${item.alt || "Describe la imagen"}](${item.url})\n\n`); setPicking(false); }} />
                    </div>
                </div>
            )}
        </div>
    );
}
