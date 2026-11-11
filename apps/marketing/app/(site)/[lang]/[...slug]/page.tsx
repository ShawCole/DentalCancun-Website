import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/cms/content";
import { LANGS, type Lang } from "@/lib/cms/schema";
import { findRoute, ROUTES } from "@/lib/site/routes";
import { Diagnostico } from "@/components/site/pages/Diagnostico";

type Params = { params: Promise<{ lang: string; slug: string[] }> };

export const dynamicParams = false;
export function generateStaticParams() {
    return LANGS.flatMap((lang) => ROUTES.map((r) => ({ lang, slug: [r.slug[lang]] })));
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
    };
}

export default async function InnerPage({ params }: Params) {
    const { lang, route } = await resolve(params);
    const [content, site] = await Promise.all([getPageContent(route.id, lang), getPageContent("site", lang)]);
    switch (route.id) {
        case "diagnostico":
            return <Diagnostico lang={lang} c={content} site={site} />;
        default:
            notFound();
    }
}
