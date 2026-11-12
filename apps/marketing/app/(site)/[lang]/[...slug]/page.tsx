import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/cms/content";
import { LANGS, type Lang } from "@/lib/cms/schema";
import { findRoute, ROUTES } from "@/lib/site/routes";
import { Diagnostico } from "@/components/site/pages/Diagnostico";
import { Tratamientos } from "@/components/site/pages/Tratamientos";
import { Landing } from "@/components/site/pages/Landing";

type Params = { params: Promise<{ lang: string; slug: string[] }> };

export const dynamicParams = false;
export function generateStaticParams() {
    return LANGS.flatMap((lang) => ROUTES.map((r) => ({ lang, slug: r.slug[lang].split("/") })));
}

async function resolve(params: Params["params"]) {
    const { lang, slug } = await params;
    const route = findRoute(lang as Lang, slug.join("/"));
    if (!route) notFound();
    return { lang: lang as Lang, route };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { lang, route } = await resolve(params);
    const seo = (await getPageContent(route.id, lang)).seo || {};
    return {
        title: seo.title,
        description: seo.description,
        alternates: { canonical: `/${lang}/${route.slug[lang]}`, languages: { es: `/es/${route.slug.es}`, en: `/en/${route.slug.en}` } },
        openGraph: { title: seo.title, description: seo.description, locale: lang === "es" ? "es_MX" : "en_US" },
    };
}

export default async function InnerPage({ params }: Params) {
    const { lang, route } = await resolve(params);
    const [content, site] = await Promise.all([getPageContent(route.id, lang), getPageContent("site", lang)]);
    if (route.kind === "diagnostico") return <Diagnostico lang={lang} c={content} site={site} />;
    if (route.kind === "tratamientos") return <Tratamientos lang={lang} c={content} />;
    const home = await getPageContent("home", lang);
    return <Landing lang={lang} c={content} site={site} testimonials={home.testimonials || {}} />;
}
