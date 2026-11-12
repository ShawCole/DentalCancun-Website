"use client";

import { useEffect, useRef, useState } from "react";
import { MediaLibrary } from "./MediaLibrary";

export function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const [open, setOpen] = useState(false);
    const dialog = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const d = dialog.current;
        if (!d) return;
        if (open && !d.open) d.showModal();
        if (!open && d.open) d.close();
    }, [open]);

    return (
        <div className="flex flex-wrap items-center gap-4 font-normal">
            <div className="h-28 w-40 overflow-hidden rounded-lg border border-[#E5DDD0] bg-[#EEEBE5]">
                {value ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={value} alt="" className="h-full w-full object-cover" />
                ) : (
                    <span className="flex h-full items-center justify-center text-xs text-[#5C564D]">Sin imagen</span>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <button type="button" onClick={() => setOpen(true)} className="min-h-11 rounded-lg border border-[#153D32] px-4 text-sm font-semibold text-[#153D32]">
                    {value ? "Cambiar imagen" : "Elegir imagen"}
                </button>
                {value && (
                    <button type="button" onClick={() => onChange("")} className="text-left text-xs text-[#8A1F1F] underline">
                        Quitar
                    </button>
                )}
            </div>
            <dialog
                ref={dialog}
                onClose={() => setOpen(false)}
                className="m-auto w-[min(960px,calc(100vw-32px))] rounded-2xl p-0 backdrop:bg-black/50"
                aria-label="Biblioteca de imágenes"
            >
                <div className="flex max-h-[85vh] flex-col gap-4 overflow-y-auto bg-[#F6F3ED] p-5">
                    <div className="flex items-center justify-between">
                        <h2 className="font-serif text-2xl font-semibold text-[#153D32]">Elegir imagen</h2>
                        <button type="button" onClick={() => setOpen(false)} className="min-h-11 rounded-lg border border-[#CFC5B3] bg-white px-4 text-sm font-semibold">
                            Cerrar
                        </button>
                    </div>
                    {open && (
                        <MediaLibrary
                            onSelect={(item) => {
                                onChange(item.url);
                                setOpen(false);
                            }}
                        />
                    )}
                </div>
            </dialog>
        </div>
    );
}
