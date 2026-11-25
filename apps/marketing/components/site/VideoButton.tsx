"use client";

import { useEffect, useRef, useState } from "react";

/** "See the experience" chip that opens a video in a dialog. */
export function VideoButton({ src, label, closeLabel }: { src: string; label: string; closeLabel: string }) {
    const [open, setOpen] = useState(false);
    const dialog = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const d = dialog.current;
        if (!d) return;
        if (open && !d.open) d.showModal();
        if (!open && d.open) d.close();
    }, [open]);

    return (
        <>
            <button type="button" onClick={() => setOpen(true)} className="glass inline-flex min-h-12 items-center gap-3 rounded-full py-2 pl-2 pr-5 text-sm font-bold text-verde">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-verde text-marfil">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M7 4l13 8-13 8z" />
                    </svg>
                </span>
                {label}
            </button>
            <dialog ref={dialog} onClose={() => setOpen(false)} aria-label={label} className="m-auto w-[min(900px,calc(100vw-24px))] rounded-3xl bg-black p-0 backdrop:bg-black/70">
                {open && <video src={src} controls autoPlay playsInline className="block max-h-[80vh] w-full" />}
                <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-3 min-h-11 rounded-full bg-white/90 px-4 text-sm font-bold text-grafito">
                    {closeLabel}
                </button>
            </dialog>
        </>
    );
}
