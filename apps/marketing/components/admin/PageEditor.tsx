"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { listVersions, loadPage, savePage, type Version } from "@/lib/cms/client";
import { defaultDoc, mergeDoc } from "@/lib/cms/content";
import { translateDraft } from "@/lib/ai/client";
import { FieldDef, getPageDef, Lang, LANG_LABEL, LANGS, PageDoc } from "@/lib/cms/schema";
import { ImageField } from "./ImageField";

export function PageEditor({ pageId }: { pageId: string }) {
    const def = getPageDef(pageId)!;
    const [doc, setDoc] = useState<PageDoc | null>(null);
    const [saved, setSaved] = useState<string>("");
    const [section, setSection] = useState(def.sections[0].id);
    const [lang, setLang] = useState<Lang>("es");
    const [status, setStatus] = useState<{ kind: "idle" | "saving" | "ok" | "error" | "warn"; msg?: string }>({ kind: "idle" });
    const [versions, setVersions] = useState<Version[] | null>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [translating, setTranslating] = useState(false);

    useEffect(() => {
        loadPage(pageId)
            .then((d) => {
                setDoc(d);
                setSaved(JSON.stringify(d));
            })
            .catch((e) => setStatus({ kind: "error", msg: e.message }));
    }, [pageId]);

    const dirty = useMemo(() => doc !== null && JSON.stringify(doc) !== saved, [doc, saved]);

    useEffect(() => {
        const warn = (e: BeforeUnloadEvent) => {
            if (dirty) e.preventDefault();
        };
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [dirty]);

    const sec = def.sections.find((s) => s.id === section)!;
    const hasTranslatable = sec.fields.some((f) => !f.shared);

    function value(f: FieldDef): string {
        if (!doc) return "";
        const block = f.shared ? doc.shared : doc[lang];
        return block[section]?.[f.id] ?? "";
    }

    function update(f: FieldDef, v: string) {
        setDoc((d) => {
            if (!d) return d;
            const key = f.shared ? "shared" : lang;
            const block = { ...d[key], [section]: { ...(d[key][section] || {}), [f.id]: v } };
            return { ...d, [key]: block };
        });
        setStatus({ kind: "idle" });
    }

    async function save() {
        if (!doc) return;
        setStatus({ kind: "saving" });
        try {
            await savePage(pageId, doc);
            setSaved(JSON.stringify(doc));
            setStatus({ kind: "ok", msg: "Guardado. El sitio ya muestra el cambio." });
        } catch (e: unknown) {
            setStatus({ kind: "error", msg: e instanceof Error ? e.message : "No se pudo guardar." });
        }
    }

    async function openHistory() {
        setShowHistory(true);
        setVersions(null);
        try {
            setVersions(await listVersions("page", pageId));
        } catch (e: unknown) {
            setVersions([]);
            setStatus({ kind: "error", msg: e instanceof Error ? e.message : "No se pudo cargar el historial." });
        }
    }

    function restore(v: Version) {
        setDoc(mergeDoc(defaultDoc(pageId), JSON.parse(v.data)));
        setShowHistory(false);
        setStatus({ kind: "warn", msg: "Versión cargada en el editor. Revísala y pulsa «Guardar y publicar» para que aparezca en el sitio." });
    }

    /** Fills the English fields of this section with an AI draft from the Spanish text. */
    async function suggestEnglish() {
        if (!doc) return;
        setTranslating(true);
        try {
            const src: Record<string, string> = {};
            for (const f of sec.fields) if (!f.shared && f.type !== "image" && f.type !== "url") src[f.id] = doc.es[section]?.[f.id] || "";
            const out = await translateDraft(src, `Página «${def.label}», sección «${sec.label}» del sitio de una clínica dental en Cancún`);
            setDoc((d) => (d ? { ...d, en: { ...d.en, [section]: { ...(d.en[section] || {}), ...out } } } : d));
            setLang("en");
            setStatus({ kind: "warn", msg: "Borrador de IA cargado en inglés. Revisa cada texto (tono, datos, promesas) antes de guardar." });
        } catch (e: unknown) {
            setStatus({ kind: "error", msg: e instanceof Error ? e.message : "No se pudo traducir." });
        } finally {
            setTranslating(false);
        }
    }

    const missingEn = doc
        ? def.sections.some((s) => s.fields.some((f) => !f.shared && (doc.es[s.id]?.[f.id] || "") && !(doc.en[s.id]?.[f.id] || "")))
        : false;

    return (
        <div className="flex flex-col gap-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-xs text-[#5C564D]">
                        <Link href="/admin/paginas" className="underline">Páginas</Link> › {def.label}
                    </p>
                    <h1 className="font-serif text-4xl font-semibold text-[#153D32]">Editar: {def.label}</h1>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {doc?.updatedAt && (
                        <span className="text-xs text-[#5C564D]">
                            Última edición: {new Date(doc.updatedAt).toLocaleString("es-MX")}
                            {doc.updatedBy ? ` · ${doc.updatedBy}` : ""}
                        </span>
                    )}
                    <button type="button" onClick={openHistory} className="inline-flex min-h-11 items-center rounded-lg border border-[#CFC5B3] bg-white px-4 text-sm font-semibold">
                        Historial
                    </button>
                    <a href={lang === "es" ? def.path.es : def.path.en} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-lg border border-[#CFC5B3] bg-white px-4 text-sm font-semibold">
                        Ver página
                    </a>
                    <button
                        onClick={save}
                        disabled={!dirty || status.kind === "saving"}
                        className="min-h-11 rounded-lg bg-[#153D32] px-5 text-sm font-bold text-[#F6F3ED] disabled:opacity-50"
                    >
                        {status.kind === "saving" ? "Guardando…" : dirty ? "Guardar y publicar" : "Sin cambios"}
                    </button>
                </div>
            </header>

            {status.msg && (
                <p role="status" className={`rounded-xl px-4 py-3 text-sm ${status.kind === "error" ? "bg-[#FDECEC] text-[#8A1F1F]" : status.kind === "warn" ? "bg-[#FBEFD5] text-[#6B4500]" : "bg-[#E3EFE6] text-[#1F5A36]"}`}>
                    {status.msg}
                </p>
            )}
            {missingEn && (
                <p className="rounded-xl bg-[#FBEFD5] px-4 py-3 text-sm text-[#6B4500]">
                    Hay textos en español sin su versión en inglés. La página en inglés mostrará el texto anterior.
                </p>
            )}

            {!doc ? (
                <p className="text-[#5C564D]">Cargando contenido…</p>
            ) : (
                <div className="flex flex-wrap items-start gap-4">
                    <div className="flex w-full flex-col gap-1 rounded-2xl border border-[#E5DDD0] bg-white p-3 md:w-56">
                        <p className="px-2 py-1 text-xs text-[#5C564D]">Secciones</p>
                        {def.sections.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setSection(s.id)}
                                aria-pressed={s.id === section}
                                className={`min-h-11 rounded-lg px-3 text-left text-sm ${s.id === section ? "bg-[#153D32] font-bold text-[#F6F3ED]" : "hover:bg-[#F6F3ED]"}`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-5 rounded-2xl border border-[#E5DDD0] bg-white p-5" style={{ flexBasis: 420 }}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-lg font-bold text-[#153D32]">{sec.label}</h2>
                            {hasTranslatable && (
                                <div role="group" aria-label="Idioma" className="inline-flex overflow-hidden rounded-lg border border-[#CFC5B3]">
                                    {LANGS.map((l) => (
                                        <button
                                            key={l}
                                            onClick={() => setLang(l)}
                                            aria-pressed={lang === l}
                                            className={`min-h-11 px-4 text-sm font-semibold ${lang === l ? "bg-[#153D32] text-[#F6F3ED]" : "bg-white text-[#153D32]"}`}
                                        >
                                            {LANG_LABEL[l]}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {hasTranslatable && (
                            <button type="button" onClick={suggestEnglish} disabled={translating} className="self-start text-sm font-semibold text-[#153D32] underline disabled:opacity-50">
                                {translating ? "Generando borrador en inglés…" : "Sugerir inglés de esta sección con IA (borrador)"}
                            </button>
                        )}

                        {sec.fields.map((f) => (
                            <Field key={`${section}-${f.id}-${f.shared ? "s" : lang}`} def={f} value={value(f)} onChange={(v) => update(f, v)} lang={lang} />
                        ))}
                    </div>
                </div>
            )}

            {showHistory && (
                <div role="dialog" aria-modal="true" aria-labelledby="hist-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && setShowHistory(false)}>
                    <div className="flex max-h-[85vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-2xl bg-[#F6F3ED] p-5">
                        <div className="flex items-center justify-between">
                            <h2 id="hist-title" className="font-serif text-2xl font-semibold text-[#153D32]">Historial de cambios</h2>
                            <button type="button" onClick={() => setShowHistory(false)} className="min-h-11 rounded-lg border border-[#CFC5B3] bg-white px-4 text-sm font-semibold">Cerrar</button>
                        </div>
                        {!versions ? (
                            <p className="text-sm text-[#5C564D]">Cargando…</p>
                        ) : versions.length === 0 ? (
                            <p className="text-sm text-[#5C564D]">Aún no hay versiones guardadas de esta página.</p>
                        ) : (
                            <ul className="flex flex-col gap-2">
                                {versions.map((v) => (
                                    <li key={v.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-3 text-sm">
                                        <span>
                                            <strong>{v.createdAt?.toDate().toLocaleString("es-MX") || "—"}</strong>
                                            <span className="block text-xs text-[#5C564D]">{v.updatedBy}</span>
                                        </span>
                                        <button type="button" onClick={() => restore(v)} className="min-h-11 rounded-lg border border-[#153D32] px-3 font-semibold text-[#153D32]">Restaurar</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function Field({ def, value, onChange, lang }: { def: FieldDef; value: string; onChange: (v: string) => void; lang: Lang }) {
    const id = `f-${def.id}`;
    const label = (
        <span className="flex flex-wrap items-baseline justify-between gap-2">
            <span>
                {def.label}
                {!def.shared && <span className="ml-2 text-xs font-normal text-[#5C564D]">({LANG_LABEL[lang]})</span>}
                {def.shared && <span className="ml-2 text-xs font-normal text-[#5C564D]">(igual en ambos idiomas)</span>}
            </span>
            {def.max && (
                <span className={`text-xs font-normal ${value.length > def.max ? "text-[#8A1F1F]" : "text-[#5C564D]"}`}>
                    {value.length}/{def.max}
                </span>
            )}
        </span>
    );

    if (def.type === "image") {
        return (
            <div className="flex flex-col gap-2 text-sm font-semibold">
                {label}
                <ImageField value={value} onChange={onChange} />
            </div>
        );
    }

    const common = "rounded-lg border border-[#CFC5B3] px-3 py-3 font-normal";
    return (
        <label htmlFor={id} className="flex flex-col gap-2 text-sm font-semibold">
            {label}
            {def.type === "textarea" ? (
                <textarea id={id} rows={4} value={value} onChange={(e) => onChange(e.target.value)} className={`${common} resize-y`} />
            ) : (
                <input id={id} type="text" inputMode={def.type === "url" ? "url" : undefined} value={value} onChange={(e) => onChange(e.target.value)} className={common} />
            )}
            {def.help && <span className="text-xs font-normal text-[#5C564D]">{def.help}</span>}
        </label>
    );
}
