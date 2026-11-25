"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile (free anti-spam check). Shows nothing unless
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY is set. Adds a hidden input named
 * "cf-turnstile-response" to the surrounding form.
 */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
type TS = { render: (el: HTMLElement, o: Record<string, unknown>) => string; remove: (id: string) => void };

function loadScript(): Promise<TS> {
    const w = window as unknown as { turnstile?: TS };
    if (w.turnstile) return Promise.resolve(w.turnstile);
    return new Promise((resolve) => {
        const s = document.createElement("script");
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        s.async = true;
        s.onload = () => resolve(w.turnstile!);
        document.head.appendChild(s);
    });
}

export function Turnstile({ lang }: { lang: "es" | "en" }) {
    const box = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!SITE_KEY || !box.current) return;
        let id = "";
        let alive = true;
        loadScript().then((ts) => {
            if (alive && box.current) id = ts.render(box.current, { sitekey: SITE_KEY, language: lang, theme: "light", size: "flexible" });
        });
        return () => {
            alive = false;
            if (id) (window as unknown as { turnstile?: TS }).turnstile?.remove(id);
        };
    }, [lang]);
    return SITE_KEY ? <div ref={box} className="min-h-[65px]" /> : null;
}

/** Reads the Turnstile token from a form, if the widget is on. */
export const turnstileToken = (f: FormData) => String(f.get("cf-turnstile-response") || "");
