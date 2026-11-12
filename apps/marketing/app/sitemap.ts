import type { MetadataRoute } from "next";
import { ROUTES } from "@/lib/site/routes";
import { getJsonDoc, getSetting } from "@/lib/settings/server";
import { BUILDER_PUBLIC, builderTag } from "@/lib/builder/store";

export const revalidate = 3600;

/** Sitemap of the new bilingual site (pages, treatments, blog and builder pages). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const base = (process.env.SITE_URL || process.env.URL || "https://dentalcancun.com").replace(/\/+$/, "");
    const alt = (es: string, en: string) => ({ languages: { "es-MX": `${base}${es}`, "en-US": `${base}${en}` } });
    const out: MetadataRoute.Sitemap = [];
    out.push({ url: `${base}/es`, alternates: alt("/es", "/en"), priority: 1 }, { url: `${base}/en`, alternates: alt("/es", "/en"), priority: 1 });
    for (const r of ROUTES) {
        const es = `/es/${r.slug.es}`;
        const en = `/en/${r.slug.en}`;
        out.push({ url: `${base}${es}`, alternates: alt(es, en), priority: 0.8 }, { url: `${base}${en}`, alternates: alt(es, en), priority: 0.8 });
    }
    out.push({ url: `${base}/es/blog`, alternates: alt("/es/blog", "/en/blog") }, { url: `${base}/en/blog`, alternates: alt("/es/blog", "/en/blog") });
    for (const lang of ["es", "en"] as const) {
        const { posts } = await getSetting(lang === "es" ? "blog-es" : "blog-en");
        for (const p of posts) out.push({ url: `${base}/${lang}/blog/${p.slug}`, lastModified: p.publishedAt, priority: 0.6 });
    }
    const { pages } = await getSetting("builder");
    for (const p of pages.filter((x) => x.published)) {
        const data = await getJsonDoc<{ root?: { props?: { noindex?: string } } }>(BUILDER_PUBLIC, p.id, builderTag(p.id));
        if (data && data.root?.props?.noindex !== "si") out.push({ url: `${base}/${p.lang}/${p.slug}`, priority: 0.5 });
    }
    return out;
}
