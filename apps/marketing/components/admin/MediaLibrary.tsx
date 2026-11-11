"use client";

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { deleteMedia, listMedia, MediaItem, uploadImage } from "@/lib/cms/client";

interface Props {
    /** When set, clicking an image selects it instead of showing its actions. */
    onSelect?: (item: MediaItem) => void;
}

export function MediaLibrary({ onSelect }: Props) {
    const [items, setItems] = useState<MediaItem[] | null>(null);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const input = useRef<HTMLInputElement>(null);

    const refresh = useCallback(() => {
        listMedia()
            .then(setItems)
            .catch((e) => setError(e.message));
    }, []);

    useEffect(refresh, [refresh]);

    async function onFiles(e: ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setBusy(true);
        setError("");
        try {
            let last: MediaItem | null = null;
            for (const f of files) last = await uploadImage(f);
            refresh();
            if (onSelect && last && files.length === 1) onSelect(last);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "No se pudo subir.");
        } finally {
            setBusy(false);
            if (input.current) input.current.value = "";
        }
    }

    async function remove(item: MediaItem) {
        if (!window.confirm(`¿Borrar «${item.name}»? Si alguna página la usa, dejará de verse.`)) return;
        try {
            await deleteMedia(item);
            refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "No se pudo borrar.");
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-[#CFC5B3] bg-[#FBF9F5] p-5">
                <div>
                    <p className="font-bold text-[#153D32]">Subir imágenes</p>
                    <p className="text-sm text-[#5C564D]">JPG, PNG o WebP de hasta 8 MB. Recomendado: menos de 500 KB.</p>
                </div>
                <label className="inline-flex min-h-11 cursor-pointer items-center rounded-lg bg-[#153D32] px-4 font-bold text-[#F6F3ED]">
                    {busy ? "Subiendo…" : "Elegir archivos"}
                    <input ref={input} type="file" accept="image/*" multiple={!onSelect} onChange={onFiles} disabled={busy} className="sr-only" />
                </label>
            </div>
            {error && <p role="alert" className="rounded-xl bg-[#FDECEC] px-4 py-3 text-sm text-[#8A1F1F]">{error}</p>}
            {!items ? (
                <p className="text-sm text-[#5C564D]">Cargando imágenes…</p>
            ) : items.length === 0 ? (
                <p className="text-sm text-[#5C564D]">Aún no hay imágenes. Sube la primera.</p>
            ) : (
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
                    {items.map((item) => (
                        <li key={item.id} className="overflow-hidden rounded-xl border border-[#E5DDD0] bg-white">
                            {onSelect ? (
                                <button onClick={() => onSelect(item)} className="block w-full text-left">
                                    <Thumb item={item} />
                                    <span className="block truncate px-3 py-2 text-xs">{item.name}</span>
                                </button>
                            ) : (
                                <>
                                    <Thumb item={item} />
                                    <div className="flex items-center justify-between gap-2 px-3 py-2">
                                        <span className="truncate text-xs" title={item.name}>{item.name}</span>
                                        <span className="flex gap-3">
                                            <button onClick={() => navigator.clipboard?.writeText(item.url)} className="text-xs font-semibold text-[#153D32] underline">Copiar enlace</button>
                                            <button onClick={() => remove(item)} className="text-xs font-semibold text-[#8A1F1F] underline">Borrar</button>
                                        </span>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function Thumb({ item }: { item: MediaItem }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={item.url} alt={item.alt || item.name} loading="lazy" className="aspect-[4/3] w-full bg-[#EEEBE5] object-cover" />;
}
