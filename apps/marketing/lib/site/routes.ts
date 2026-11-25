import type { Lang } from "@/lib/cms/schema";
import { LANDINGS } from "@/lib/cms/landings";

/** Inner pages of the new site: one entry per page, with its path in each language. */
export interface Route { id: string; slug: Record<Lang, string>; kind: "diagnostico" | "tratamientos" | "landing" }

export const ROUTES: Route[] = [
    { id: "diagnostico", slug: { es: "diagnostico-digital", en: "digital-assessment" }, kind: "diagnostico" },
    { id: "tratamientos", slug: { es: "tratamientos", en: "treatments" }, kind: "tratamientos" },
    ...LANDINGS.map((l) => ({ id: `tratamiento-${l.id}`, slug: { es: `tratamientos/${l.slug.es}`, en: `treatments/${l.slug.en}` }, kind: "landing" as const })),
];

export function findRoute(lang: Lang, slug: string) {
    return ROUTES.find((r) => r.slug[lang] === slug);
}

export function routePath(id: string, lang: Lang) {
    const r = ROUTES.find((x) => x.id === id);
    return r ? `/${lang}/${r.slug[lang]}` : `/${lang}`;
}
