"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/cms/schema";

interface Props {
    lang: Lang;
    logo: string;
    nav: { label: string; href: string }[];
    cta: string;
    altHref: string;
}

export function Header({ lang, logo, nav, cta, altHref }: Props) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const close = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", close);
        return () => window.removeEventListener("keydown", close);
    }, []);

    const home = `/${lang}`;
    const menuLabel = lang === "es" ? (open ? "Cerrar menú" : "Abrir menú") : open ? "Close menu" : "Open menu";

    return (
        <header className="sticky top-0 z-50 px-3 pt-3 md:px-6">
            <div className="glass mx-auto flex max-w-[1320px] items-center justify-between gap-4 rounded-full py-2 pl-5 pr-2">
                <a href={home} className="shrink-0" aria-label="Dental Solutions Cancún">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo} alt="Dental Solutions Cancún" className="h-9 w-auto md:h-10" />
                </a>
                <nav aria-label={lang === "es" ? "Principal" : "Main"} className="hidden lg:block">
                    <ul className="flex items-center gap-6 text-sm font-semibold">
                        {nav.map((n) => (
                            <li key={n.href}>
                                <a href={n.href} className="py-2 text-grafito hover:text-verde">
                                    {n.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="flex items-center gap-2">
                    <a
                        href={altHref}
                        hrefLang={lang === "es" ? "en" : "es"}
                        lang={lang === "es" ? "en" : "es"}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-grafito/5 px-3 text-xs font-bold text-grafito hover:bg-grafito/10"
                    >
                        {lang === "es" ? "EN" : "ES"}
                    </a>
                    <a href="#agendar" className="hidden min-h-11 items-center rounded-full bg-verde px-5 text-sm font-bold text-marfil hover:bg-verde-osc sm:inline-flex">
                        {cta}
                    </a>
                    <button
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                        aria-expanded={open}
                        aria-controls="menu-movil"
                        aria-label={menuLabel}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-verde hover:bg-grafito/5 lg:hidden"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                        </svg>
                    </button>
                </div>
            </div>
            {open && (
                <nav id="menu-movil" aria-label={lang === "es" ? "Menú móvil" : "Mobile menu"} className="glass mx-auto mt-2 max-w-[1320px] rounded-3xl p-4 lg:hidden">
                    <ul className="flex flex-col">
                        {nav.map((n) => (
                            <li key={n.href}>
                                <a href={n.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-xl px-3 font-semibold text-grafito hover:bg-white/60">
                                    {n.label}
                                </a>
                            </li>
                        ))}
                        <li className="mt-2">
                            <a href="#agendar" onClick={() => setOpen(false)} className="flex min-h-12 items-center justify-center rounded-full bg-verde font-bold text-marfil">
                                {cta}
                            </a>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    );
}
