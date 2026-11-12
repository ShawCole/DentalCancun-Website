"use client";

import "@puckeditor/core/puck.css";
import "@/app/(site)/site.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Puck } from "@puckeditor/core";
import { editorConfig } from "./editorConfig";
import { loadDraft, publishPage, saveDraft, type DraftDoc, type PuckData } from "@/lib/builder/client";
import { allText, brandIssues, type BrandIssue } from "@/lib/brand";
import { listVersions, type Version } from "@/lib/cms/client";

/** Brand check before publishing (the price amount is skipped: it hides itself until approved). */
function check(data: PuckData): BrandIssue[] {
    const copy = JSON.parse(JSON.stringify(data || {}));
    for (const b of copy.content || []) if (b.type === "Price") delete b.props.amount;
    return brandIssues(allText(copy));
}

export function BuilderEditor({ id }: { id: string }) {
    const [page, setPage] = useState<DraftDoc | null | false>(null);
    const latest = useRef<PuckData>(null);
    const [msg, setMsg] = useState<{ kind: "ok" | "error" | "warn"; text: string } | null>(null);
    const [busy, setBusy] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [issues, setIssues] = useState<BrandIssue[] | null>(null);
    const [versions, setVersions] = useState<Version[] | null>(null);
    const [key, setKey] = useState(0);

    useEffect(() => {
        loadDraft(id)
            .then((d) => {
                setPage(d || false);
                latest.current = d?.data;
            })
            .catch((e) => setMsg({ kind: "error", text: e.message }));
    }, [id]);

    useEffect(() => {
        const warn = (e: BeforeUnloadEvent) => dirty && e.preventDefault();
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [dirty]);

    if (page === null) return <p className="p-8 text-sm text-[#5C564D]">Cargando página…</p>;
    if (page === false) return <p className="p-8 text-sm">No existe esta página. <Link href="/admin/constructor" className="underline">Volver</Link></p>;

    const current = (): DraftDoc => ({ ...page, title: latest.current?.root?.props?.title || page.title, data: latest.current });

    async function save() {
        setBusy(true);
        try {
            await saveDraft(current());
            setDirty(false);
            setMsg({ kind: "ok", text: "Borrador guardado. Aún no se ve en el sitio: pulsa «Publicar» cuando esté listo." });
        } catch (e: unknown) {
            setMsg({ kind: "error", text: e instanceof Error ? e.message : "No se pudo guardar." });
        } finally {
            setBusy(false);
        }
    }

    async function publish() {
        const found = check(latest.current);
        if (found.length) return setIssues(found);
        setBusy(true);
        try {
            const at = await publishPage(current());
            setPage({ ...current(), publishedAt: at });
            setDirty(false);
            setMsg({ kind: "ok", text: "Publicada. Ya se ve en el sitio." });
        } catch (e: unknown) {
            setMsg({ kind: "error", text: e instanceof Error ? e.message : "No se pudo publicar." });
        } finally {
            setBusy(false);
        }
    }

    async function history() {
        setVersions([]);
        try {
            const v = await listVersions("builder", id);
            setVersions(v.length ? v : null);
            if (!v.length) setMsg({ kind: "warn", text: "Esta página aún no tiene versiones publicadas." });
        } catch (e: unknown) {
            setVersions(null);
            setMsg({ kind: "error", text: e instanceof Error ? e.message : "No se pudo cargar el historial." });
        }
    }

    function restore(v: Version) {
        const data = JSON.parse(v.data);
        latest.current = data;
        setPage((p) => (p ? { ...p, data } : p));
        setKey((k) => k + 1);
        setDirty(true);
        setVersions(null);
        setMsg({ kind: "warn", text: "Versión cargada. Revísala y publica para que se vea en el sitio." });
    }

    const url = `/${page.lang}/${page.slug}`;
    const btn = "inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-semibold disabled:opacity-50";

    return (
        <div className="fixed inset-0 z-40 flex flex-col bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5DDD0] bg-[#153D32] px-4 py-2 text-[#F6F3ED]">
                <div className="flex min-w-0 items-center gap-3">
                    <Link href="/admin/constructor" className="text-sm text-[#D9C28F] underline">← Páginas</Link>
                    <span className="truncate text-sm font-bold">{page.title}</span>
                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">{page.lang.toUpperCase()} · {url}</span>
                    {page.publishedAt ? <span className="text-xs text-[#C9D6CF]">Publicada {new Date(page.publishedAt).toLocaleString("es-MX")}</span> : <span className="text-xs text-[#D9C28F]">Sin publicar</span>}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button type="button" onClick={history} className={`${btn} border border-white/30`}>Historial</button>
                    {page.publishedAt && <a href={url} target="_blank" rel="noreferrer" className={`${btn} border border-white/30`}>Ver en el sitio</a>}
                    <button type="button" onClick={save} disabled={busy} className={`${btn} border border-white/30`}>Guardar borrador</button>
                    <button type="button" onClick={publish} disabled={busy} className={`${btn} bg-[#F6F3ED] font-bold text-[#153D32]`}>{busy ? "…" : "Publicar"}</button>
                </div>
            </div>
            {msg && (
                <div role="status" className={`flex items-center justify-between gap-3 px-4 py-2 text-sm ${msg.kind === "error" ? "bg-[#FDECEC] text-[#8A1F1F]" : msg.kind === "warn" ? "bg-[#FBEFD5] text-[#6B4500]" : "bg-[#E3EFE6] text-[#1F5A36]"}`}>
                    {msg.text}
                    <button type="button" onClick={() => setMsg(null)} aria-label="Cerrar aviso" className="px-2">×</button>
                </div>
            )}
            <div className="min-h-0 flex-1">
                <Puck
                    key={key}
                    config={editorConfig}
                    data={page.data}
                    headerTitle={page.title}
                    onChange={(d: PuckData) => {
                        latest.current = d;
                        setDirty(true);
                    }}
                    onPublish={publish}
                    overrides={{ headerActions: () => <></> }}
                />
            </div>

            {issues && (
                <div role="dialog" aria-modal="true" aria-labelledby="brand-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-[#F6F3ED] p-6">
                        <h2 id="brand-title" className="font-serif text-2xl font-semibold text-[#153D32]">Antes de publicar</h2>
                        <p className="mt-2 text-sm text-[#5C564D]">Corrige estos puntos para cuidar la marca y no publicar datos sin aprobar:</p>
                        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{issues.map((i, k) => <li key={k}>{i.text}</li>)}</ul>
                        <button type="button" onClick={() => setIssues(null)} className="mt-5 min-h-11 rounded-lg bg-[#153D32] px-4 text-sm font-bold text-[#F6F3ED]">Entendido, voy a corregir</button>
                    </div>
                </div>
            )}

            {versions && versions.length > 0 && (
                <div role="dialog" aria-modal="true" aria-labelledby="ver-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && setVersions(null)}>
                    <div className="flex max-h-[85vh] w-full max-w-lg flex-col gap-3 overflow-y-auto rounded-2xl bg-[#F6F3ED] p-5">
                        <h2 id="ver-title" className="font-serif text-2xl font-semibold text-[#153D32]">Versiones publicadas</h2>
                        {versions.map((v) => (
                            <div key={v.id} className="flex items-center justify-between gap-3 rounded-xl bg-white p-3 text-sm">
                                <span><strong>{v.createdAt?.toDate().toLocaleString("es-MX")}</strong><span className="block text-xs text-[#5C564D]">{v.updatedBy}</span></span>
                                <button type="button" onClick={() => restore(v)} className="min-h-11 rounded-lg border border-[#153D32] px-3 font-semibold text-[#153D32]">Restaurar</button>
                            </div>
                        ))}
                        <button type="button" onClick={() => setVersions(null)} className="min-h-11 self-start rounded-lg border border-[#CFC5B3] bg-white px-4 text-sm font-semibold">Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}
