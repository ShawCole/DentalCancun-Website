import type { Lang } from "@/lib/cms/schema";

/** Inner pages of the new site: one entry per page, with its slug in each language. */
export const ROUTES = [{ id: "diagnostico", slug: { es: "diagnostico-digital", en: "digital-assessment" } }] as const;

export type RouteId = (typeof ROUTES)[number]["id"];

export function findRoute(lang: Lang, slug: string) {
    return ROUTES.find((r) => r.slug[lang] === slug);
}

export function routePath(id: RouteId, lang: Lang) {
    const r = ROUTES.find((x) => x.id === id);
    return r ? `/${lang}/${r.slug[lang]}` : `/${lang}`;
}
