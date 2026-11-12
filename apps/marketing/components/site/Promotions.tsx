"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/cms/schema";
import { promoState, type Promotion } from "@/lib/settings";

/**
 * Seasonal promotions set in the admin panel. Dates are checked in the
 * browser (Cancún time), so a promotion appears and ends on its own.
 */
export function Promotions({ lang, items }: { lang: Lang; items: Promotion[] }) {
    const [today, setToday] = useState("");
    const [closed, setClosed] = useState<string[]>([]);
    useEffect(() => {
        setToday(new Date(Date.now() - 5 * 3600_000).toISOString().slice(0, 10));
        try {
            setClosed(JSON.parse(sessionStorage.getItem("dsc_promo_closed") || "[]"));
        } catch {}
    }, []);
    if (!today) return null;
    const live = items.filter((p) => promoState(p, today) === "activa" && p[lang]?.title && !closed.includes(p.id));
    const close = (id: string) => {
        const next = [...closed, id];
        setClosed(next);
        try {
            sessionStorage.setItem("dsc_promo_closed", JSON.stringify(next));
        } catch {}
    };
    const bar = live.find((p) => p.placement === "barra");
    const pop = live.find((p) => p.placement === "ventana");
    const x = lang === "es" ? "Cerrar" : "Close";

    return (
        <>
            {bar && (
                <div className="relative z-[60] bg-verde-osc px-12 py-2.5 text-center text-sm text-marfil">
                    <strong className="font-semibold text-dorado-claro">{bar[lang].title}</strong> <span className="text-marfil/90">{bar[lang].text}</span>{" "}
                    {bar.href && bar[lang].cta && (
                        <a href={bar.href} className="font-bold underline underline-offset-4">
                            {bar[lang].cta}
                        </a>
                    )}
                    <button type="button" onClick={() => close(bar.id)} aria-label={x} className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full hover:bg-white/10">
                        ×
                    </button>
                </div>
            )}
            {pop && (
                <div role="dialog" aria-modal="true" aria-labelledby={`promo-${pop.id}`} className="fixed inset-0 z-[95] flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && close(pop.id)}>
                    <div className="w-full max-w-md overflow-hidden rounded-[28px] bg-marfil shadow-2xl">
                        {pop.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={pop.image} alt="" className="h-48 w-full object-cover" />
                        )}
                        <div className="flex flex-col gap-3 p-6">
                            <h2 id={`promo-${pop.id}`} className="font-serif text-2xl leading-tight">{pop[lang].title}</h2>
                            <p className="text-gris">{pop[lang].text}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {pop.href && pop[lang].cta && (
                                    <a href={pop.href} onClick={() => close(pop.id)} className="inline-flex min-h-11 items-center rounded-full bg-verde px-5 font-bold text-marfil">
                                        {pop[lang].cta}
                                    </a>
                                )}
                                <button type="button" onClick={() => close(pop.id)} className="min-h-11 rounded-full border border-verde px-5 font-bold text-verde">{x}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
