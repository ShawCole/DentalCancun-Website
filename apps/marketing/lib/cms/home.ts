import type { Metadata } from "next";
import { getPageContent, reader } from "./content";
import type { Lang } from "./schema";
import type { HomeHero } from "@/components/home/HomePage";

export async function getHome(lang: Lang) {
    const get = reader(await getPageContent("home", lang));
    const hero: HomeHero = {
        title: get("hero", "title"),
        highlight: get("hero", "highlight"),
        subtitle: get("hero", "subtitle"),
        cta: get("hero", "cta"),
        ctaUrl: get("hero", "ctaUrl", "/schedule"),
        poster: get("hero", "poster"),
        video: get("hero", "video"),
    };
    const metadata: Metadata = {
        title: get("seo", "title") || undefined,
        description: get("seo", "description") || undefined,
        alternates: { languages: { en: "/", es: "/es" } },
    };
    return { hero, metadata };
}
