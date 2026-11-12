/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LANGS, type Lang } from "@/lib/cms/schema";
import { getJsonDoc } from "@/lib/settings/server";
import { BLOG_COLLECTION, blogId, blogTag, type Post } from "@/lib/blog/types";
import { headings, markdownToHtml, plainText } from "@/lib/blog/markdown";
import { Button, Kicker } from "@/components/site/ui";

type P = { params: Promise<{ lang: string; slug: string }> };

async function getPost(params: P["params"]) {
    const { lang, slug } = await params;
    if (!LANGS.includes(lang as Lang) || !/^[a-z0-9-]{1,90}$/.test(slug)) notFound();
    const id = blogId(lang as Lang, slug);
    const post = await getJsonDoc<Post>(BLOG_COLLECTION, id, blogTag(id));
    if (!post || post.status !== "published") notFound();
    return { lang: lang as Lang, post };
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
    const { lang, post } = await getPost(params);
    const other = lang === "es" ? "en" : "es";
    return {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        alternates: { canonical: `/${lang}/blog/${post.slug}`, languages: post.pair ? { [lang]: `/${lang}/blog/${post.slug}`, [other]: `/${other}/blog/${post.pair}` } : undefined },
        openGraph: { type: "article", title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt, images: post.cover ? [post.cover] : undefined, publishedTime: post.publishedAt, modifiedTime: post.updatedAt },
    };
}

export default async function BlogPost({ params }: P) {
    const { lang, post } = await getPost(params);
    const es = lang === "es";
    const toc = headings(post.body);
    const minutes = Math.max(1, Math.round(plainText(post.body).split(/\s+/).length / 220));
    const date = new Intl.DateTimeFormat(es ? "es-MX" : "en-US", { day: "numeric", month: "long", year: "numeric" }).format(new Date(post.publishedAt));
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.seoDescription || post.excerpt,
        image: post.cover || undefined,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        inLanguage: es ? "es-MX" : "en-US",
        author: { "@type": "Organization", name: es ? "Equipo médico de Dental Solutions Puerto Cancún" : "Dental Solutions Puerto Cancún dental team" },
        publisher: { "@type": "Organization", name: "Dental Solutions Puerto Cancún" },
    };
    return (
        <article>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
            <header className="-mt-[76px] bg-champana/40 pb-10 pt-32 md:pt-40">
                <div className="mx-auto max-w-3xl px-5">
                    <nav aria-label={es ? "Migas de pan" : "Breadcrumb"} className="mb-6 text-sm text-gris">
                        <a href={`/${lang}`} className="underline-offset-4 hover:underline">{es ? "Inicio" : "Home"}</a> · <a href={`/${lang}/blog`} className="underline-offset-4 hover:underline">Blog</a>
                    </nav>
                    <Kicker>{post.category}</Kicker>
                    <h1 className="font-serif text-[2.4rem] font-medium leading-[1.06] md:text-[3.4rem]">{post.title}</h1>
                    <p className="mt-5 text-lg text-gris">{post.excerpt}</p>
                    <p className="mt-5 text-sm text-gris">
                        {es ? "Equipo médico" : "Our dental team"} · {date} · {minutes} {es ? "min de lectura" : "min read"}
                    </p>
                </div>
            </header>
            {post.cover && (
                <div className="mx-auto -mb-2 mt-8 max-w-5xl px-5">
                    <img src={post.cover} alt={post.coverAlt || ""} className="aspect-[16/8] w-full rounded-[32px] object-cover" />
                </div>
            )}
            <div className="mx-auto max-w-3xl px-5 py-12">
                {toc.length >= 3 && (
                    <nav aria-label={es ? "En este artículo" : "In this article"} className="mb-10 rounded-[22px] border border-dorado/30 bg-white p-5">
                        <p className="mb-2 text-sm font-bold">{es ? "En este artículo" : "In this article"}</p>
                        <ol className="list-decimal space-y-1 pl-5 text-sm">
                            {toc.map((h) => <li key={h.id}><a href={`#${h.id}`} className="text-verde underline-offset-4 hover:underline">{h.text}</a></li>)}
                        </ol>
                    </nav>
                )}
                <div className="prose-dsc" dangerouslySetInnerHTML={{ __html: markdownToHtml(post.body) }} />
                <p className="mt-10 rounded-[22px] bg-champana/50 p-5 text-sm text-gris">
                    {es
                        ? "Este artículo es informativo y no sustituye una valoración clínica. Cada caso es distinto: la indicación, los tiempos y la inversión se confirman en consulta."
                        : "This article is for general information and isn't a substitute for a dental exam. Every case is different, so your treatment, timing and cost are confirmed at your consultation."}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                    <Button href={es ? "/es/diagnostico-digital" : "/en/digital-assessment"}>{es ? "Diseña tu sonrisa" : "Design your smile"}</Button>
                    <Button href="#agendar" variant="ghost">{es ? "Agendar valoración" : "Book a consultation"}</Button>
                </div>
            </div>
        </article>
    );
}
