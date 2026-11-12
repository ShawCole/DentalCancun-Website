/** Site settings that are not page text: redirects, promotions, builder and blog indexes. */
export const SETTINGS_COLLECTION = "cms_settings";
export const settingsTag = (id: string) => `settings:${id}`;

export interface Redirect { from: string; to: string; code: 301 | 302; note?: string }
export interface Promotion {
    id: string;
    active: boolean;
    start: string; // YYYY-MM-DD, Cancún
    end: string;
    placement: "barra" | "ventana";
    href: string;
    image?: string;
    es: { title: string; text: string; cta: string };
    en: { title: string; text: string; cta: string };
}
export interface BlogSummary { slug: string; title: string; excerpt: string; cover?: string; coverAlt?: string; category?: string; publishedAt: string }
export interface BuilderSummary { id: string; lang: "es" | "en"; slug: string; title: string; published: boolean }

export interface Settings {
    redirects: { items: Redirect[] };
    promotions: { items: Promotion[] };
    "blog-es": { posts: BlogSummary[] };
    "blog-en": { posts: BlogSummary[] };
    builder: { pages: BuilderSummary[] };
}
export type SettingId = keyof Settings;

export const SETTING_DEFAULTS: Settings = {
    redirects: { items: [] },
    promotions: { items: [] },
    "blog-es": { posts: [] },
    "blog-en": { posts: [] },
    builder: { pages: [] },
};

/** Paths of the new site that a redirect or a builder page must never take over. */
export const RESERVED = ["/admin", "/api", "/_next", "/es", "/en", "/dsc"];

/** Cancún date (UTC-5, no daylight saving) as YYYY-MM-DD. */
export function cancunToday(now = Date.now()) {
    return new Date(now - 5 * 3600_000).toISOString().slice(0, 10);
}

export function promoState(p: Promotion, today = cancunToday()): "activa" | "programada" | "terminada" | "pausada" {
    if (!p.active) return "pausada";
    if (p.start && today < p.start) return "programada";
    if (p.end && today > p.end) return "terminada";
    return "activa";
}

export const normPath = (p: string) => {
    let s = (p || "").trim();
    try {
        if (/^https?:\/\//i.test(s)) s = new URL(s).pathname;
    } catch {}
    s = "/" + s.replace(/^\/+/, "");
    return s.length > 1 ? s.replace(/\/+$/, "").toLowerCase() : s;
};
