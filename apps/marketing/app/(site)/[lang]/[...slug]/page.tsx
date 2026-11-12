import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/cms/content";
import { LANGS, type Lang } from "@/lib/cms/schema";
import { findRoute, ROUTES, type Route } from "@/lib/site/routes";
import { getJsonDoc, getSetting } from "@/lib/settings/server";
import { BUILDER_PUBLIC, builderTag } from "@/lib/builder/store";
import { BLOCKS, type BlockName, type RootProps } from "@/lib/builder/blocks";
import { Diagnostico } from "@/components/site/pages/Diagnostico";
import { Tratamientos } from "@/components/site/pages/Tratamientos";
import { Landing } from "@/components/site/pages/Landing";

type Params = { params: Promise<{ lang: string; slug: string[] }> };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BuilderData = { root?: { props?: RootProps }; content: any[]; zones?: any };

// Pages made with the builder are not known at build time.
export const dynamicParams = true;
export function generateStaticParams() {
    return LANGS.flatMap((lang) => ROUTES.map((r) => ({ lang, slug: r.slug[lang].split("/") })));
}

type Resolved = { lang: Lang; route: Route; builder?: undefined } | { lang: Lang; route?: undefined; builder: { id: string; data: BuilderData } };

async function resolve(params: Params["params"]): Promise<Resolved> {
    const { lang: raw, slug } = await params;
    if (!LANGS.includes(raw as Lang)) notFound();
    const lang = raw as Lang;
    const route = findRoute(lang, slug.join("/"));
    if (route) return { lang, route };
    // A page made with the builder: /es/<slug> or /en/<slug>
    if (slug.length === 1) {
        const idx = await getSetting("builder");
        const hit = idx.pages.find((p) => p.lang === lang && p.slug === slug[0] && p.published);
        if (hit) {
            const data = await getJsonDoc<BuilderData>(BUILDER_PUBLIC, hit.id, builderTag(hit.id));
            if (data) return { lang, builder: { id: hit.id, data } };
        }
    }
    notFound();
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const r = await resolve(params);
    if (r.builder) {
        const root = r.builder.data.root?.props || {};
        return {
            title: root.title,
            description: root.description,
            robots: root.noindex === "si" ? { index: false, follow: true } : undefined,
            openGraph: { title: root.title, description: root.description, locale: r.lang === "es" ? "es_MX" : "en_US" },
        };
    }
    const { lang, route } = r;
    const seo = (await getPageContent(route.id, lang)).seo || {};
    return {
        title: seo.title,
        description: seo.description,
        alternates: { canonical: `/${lang}/${route.slug[lang]}`, languages: { es: `/es/${route.slug.es}`, en: `/en/${route.slug.en}` } },
        openGraph: { title: seo.title, description: seo.description, locale: lang === "es" ? "es_MX" : "en_US" },
    };
}

export default async function InnerPage({ params }: Params) {
    const r = await resolve(params);
    if (r.builder) {
        // Builder pages are a flat list of blocks: render them directly (no editor code in the public site).
        return (
            <>
                {(r.builder.data.content || []).map((b, i) => {
                    const block = BLOCKS[b.type as BlockName];
                    if (!block) return null;
                    const Block = block.render as (p: Record<string, unknown>) => ReactNode;
                    return <Block key={b.props?.id || i} {...b.props} />;
                })}
            </>
        );
    }
    const { lang, route } = r;
    const [content, site] = await Promise.all([getPageContent(route.id, lang), getPageContent("site", lang)]);
    if (route.kind === "diagnostico") return <Diagnostico lang={lang} c={content} site={site} />;
    if (route.kind === "tratamientos") return <Tratamientos lang={lang} c={content} />;
    const home = await getPageContent("home", lang);
    return <Landing lang={lang} c={content} site={site} testimonials={home.testimonials || {}} />;
}
