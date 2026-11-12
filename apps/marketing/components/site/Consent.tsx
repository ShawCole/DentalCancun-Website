"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/cms/schema";
import { CONSENT_EVENT, OPEN_CONSENT_EVENT, readConsent, writeConsent, type Consent as C } from "@/lib/site/consent";

const T = {
    es: {
        title: "Tu privacidad",
        text: "Usamos cookies necesarias para que el sitio funcione. Con tu permiso, también usamos cookies para medir visitas y mostrar anuncios relevantes.",
        accept: "Aceptar todas",
        reject: "Solo necesarias",
        settings: "Elegir",
        save: "Guardar preferencias",
        necessary: "Necesarias",
        necessaryText: "Siempre activas: idioma, seguridad de formularios y tu elección de cookies.",
        analytics: "Medición",
        analyticsText: "Contamos visitas y pasos del diagnóstico, sin identificarte.",
        marketing: "Publicidad",
        marketingText: "Píxeles de Meta y de anuncios para medir campañas.",
        more: "Aviso de privacidad",
        moreUrl: "/es/aviso-de-privacidad",
    },
    en: {
        title: "Your privacy",
        text: "We use essential cookies to make the site work. With your OK, we also use cookies to count visits and show you relevant ads.",
        accept: "Accept all",
        reject: "Essential only",
        settings: "Choose",
        save: "Save my choices",
        necessary: "Essential",
        necessaryText: "Always on: language, form security and your cookie choice.",
        analytics: "Analytics",
        analyticsText: "We count visits and quiz steps without identifying you.",
        marketing: "Advertising",
        marketingText: "Meta and ad pixels that measure our campaigns.",
        more: "Privacy notice",
        moreUrl: "/en/privacy-notice",
    },
};

const META_PIXEL = "2168883350543599";
const IDPIXEL = "https://cdn.idpixel.app/v1/idp-analytics-69dd28d658b55f8c5c273805.min.js";

type W = Window & { fbq?: ((...a: unknown[]) => void) & { queue?: unknown[]; callMethod?: (...a: unknown[]) => void; loaded?: boolean; version?: string; push?: unknown }; _fbq?: unknown; dataLayer?: unknown[] };

function addScript(src: string, id: string) {
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = src;
    s.id = id;
    document.head.appendChild(s);
}

/** Loads the ad pixels only after the visitor accepts advertising cookies. */
function loadMarketing() {
    const w = window as W;
    if (!w.fbq) {
        const n = function (...args: unknown[]) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const f = n as any;
            f.callMethod ? f.callMethod(...args) : f.queue.push(args);
        } as W["fbq"] & object;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const f = n as any;
        f.push = n;
        f.loaded = true;
        f.version = "2.0";
        f.queue = [];
        w.fbq = n;
        w._fbq = n;
        addScript("https://connect.facebook.net/en_US/fbevents.js", "meta-pixel");
        w.fbq!("init", META_PIXEL);
    }
    addScript(IDPIXEL, "idpixel");
}

/** Sends our own anonymous counters (visits, quiz, bookings) when analytics are allowed. */
function send(e: string, lang: string, path = location.pathname) {
    try {
        const body = JSON.stringify({ e, l: lang, p: path });
        if (!navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) {
            fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => undefined);
        }
    } catch {}
}

const EVENTS: Record<string, string> = { dsc_quiz_start: "quiz_start", dsc_quiz_lead: "quiz_done", dsc_cita: "book", dsc_fotos: "photos" };

export function Consent({ lang }: { lang: Lang }) {
    const t = T[lang];
    const [consent, setConsent] = useState<C | null>(null);
    const [open, setOpen] = useState(false);
    const [details, setDetails] = useState(false);
    const [a, setA] = useState(true);
    const [m, setM] = useState(true);
    const pathname = usePathname();
    const sentFor = useRef("");

    useEffect(() => {
        const c = readConsent();
        setConsent(c);
        if (!c) setOpen(true);
        const reopen = () => {
            const cur = readConsent();
            setA(cur?.analytics ?? true);
            setM(cur?.marketing ?? true);
            setDetails(true);
            setOpen(true);
        };
        const changed = (e: Event) => setConsent((e as CustomEvent<C>).detail);
        window.addEventListener(OPEN_CONSENT_EVENT, reopen);
        window.addEventListener(CONSENT_EVENT, changed);
        return () => {
            window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
            window.removeEventListener(CONSENT_EVENT, changed);
        };
    }, []);

    // Pixels, page views and events, only with permission.
    useEffect(() => {
        if (!consent) return;
        const w = window as W;
        if (consent.marketing) loadMarketing();
        if (consent.marketing && w.fbq && sentFor.current !== pathname) w.fbq("track", "PageView");
        if (consent.analytics && sentFor.current !== pathname) send("view", lang, pathname || "/");
        sentFor.current = pathname || "";
    }, [consent, pathname, lang]);

    // Forward the site's own events (quiz, booking, photos) to our counters.
    useEffect(() => {
        if (!consent?.analytics) return;
        const w = window as W;
        const dl = (w.dataLayer = w.dataLayer || []);
        const original = dl.push.bind(dl);
        dl.push = (...items: unknown[]) => {
            for (const it of items) {
                const ev = (it as { event?: string })?.event;
                if (ev && EVENTS[ev]) send(EVENTS[ev], lang);
            }
            return original(...items);
        };
        const click = (e: MouseEvent) => {
            const a = (e.target as HTMLElement)?.closest?.("a");
            if (a && /wa\.me|whatsapp/i.test(a.getAttribute("href") || "")) send("whatsapp", lang);
        };
        document.addEventListener("click", click, true);
        return () => {
            dl.push = original;
            document.removeEventListener("click", click, true);
        };
    }, [consent, lang]);

    if (!open) return null;

    const choose = (analytics: boolean, marketing: boolean) => {
        setConsent(writeConsent({ analytics, marketing }));
        setOpen(false);
        setDetails(false);
    };

    return (
        <div role="dialog" aria-modal="false" aria-labelledby="consent-title" className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-xl rounded-3xl border border-dorado/40 bg-marfil p-5 text-sm text-grafito shadow-2xl md:inset-x-auto md:left-6">
            <h2 id="consent-title" className="font-serif text-xl">{t.title}</h2>
            <p className="mt-2 leading-relaxed text-gris">
                {t.text}{" "}
                <a href={t.moreUrl} className="font-semibold text-verde underline">{t.more}</a>
            </p>
            {details && (
                <fieldset className="mt-4 flex flex-col gap-3">
                    <legend className="sr-only">{t.settings}</legend>
                    <label className="flex items-start gap-3 opacity-80">
                        <input type="checkbox" checked disabled className="mt-1 h-5 w-5 accent-[#153D32]" />
                        <span><strong>{t.necessary}.</strong> {t.necessaryText}</span>
                    </label>
                    <label className="flex items-start gap-3">
                        <input type="checkbox" checked={a} onChange={(e) => setA(e.target.checked)} className="mt-1 h-5 w-5 accent-[#153D32]" />
                        <span><strong>{t.analytics}.</strong> {t.analyticsText}</span>
                    </label>
                    <label className="flex items-start gap-3">
                        <input type="checkbox" checked={m} onChange={(e) => setM(e.target.checked)} className="mt-1 h-5 w-5 accent-[#153D32]" />
                        <span><strong>{t.marketing}.</strong> {t.marketingText}</span>
                    </label>
                </fieldset>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
                {details ? (
                    <button type="button" onClick={() => choose(a, m)} className="min-h-11 rounded-full bg-verde px-5 font-bold text-marfil">{t.save}</button>
                ) : (
                    <>
                        <button type="button" onClick={() => choose(true, true)} className="min-h-11 rounded-full bg-verde px-5 font-bold text-marfil">{t.accept}</button>
                        <button type="button" onClick={() => choose(false, false)} className="min-h-11 rounded-full border border-verde px-5 font-bold text-verde">{t.reject}</button>
                        <button type="button" onClick={() => setDetails(true)} className="min-h-11 px-3 font-semibold text-verde underline">{t.settings}</button>
                    </>
                )}
            </div>
        </div>
    );
}

export function ConsentLink({ label }: { label: string }) {
    return (
        <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className="text-left text-grafito underline-offset-4 hover:text-verde hover:underline">
            {label}
        </button>
    );
}
