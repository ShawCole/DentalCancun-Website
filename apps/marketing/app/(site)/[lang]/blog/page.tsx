/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LANGS, type Lang } from "@/lib/cms/schema";
import { getSetting } from "@/lib/settings/server";
import { Kicker } from "@/components/site/ui";

type P = { params: Promise<{ lang: string }> };
const T = {
    es: { title: "Blog · Dental Solutions Puerto Cancún", h1: "Respuestas claras para *decidir con confianza*", kicker: "Blog", sub: "Guías sobre tratamientos, turismo dental en Cancún y cómo cuidar tu sonrisa, escritas por nuestro equipo médico.", empty: "Muy pronto publicaremos nuestros primeros artículos.", read: "Leer artículo", desc: "Guías sobre diseño de sonrisa, implantes y turismo dental en Cancún, escritas por el equipo médico de Dental Solutions." },
    en: { title: "Blog · Dental Solutions Puerto Cancún", h1: "Straight answers so you can *decide with confidence*", kicker: "Blog", sub: "Guides on treatments, dental travel to Cancun and caring for your smile, written by our dental team.", empty: "Our first articles are coming soon.", read: "Read the article", desc: "Guides on smile makeovers, dental implants and dental travel to Cancun, written by the Dental Solutions dental team." },
};

export async function generateMetadata({ params }: P): Promise<Metadata> {
    const { lang } = await params;
    const t = T[lang as Lang] || T.es;
    return { title: t.title, description: t.desc, alternates: { canonical: `/${lang}/blog`, languages: { es: "/es/blog", en: "/en/blog" } } };
}

export default async function BlogIndex({ params }: P) {
    const { lang: raw } = await params;
    if (!LANGS.includes(raw as Lang)) notFound();
    const lang = raw as Lang;
    const t = T[lang];
    const { posts } = await getSetting(lang === "es" ? "blog-es" : "blog-en");
    const date = (iso: string) => new Intl.DateTimeFormat(lang === "es" ? "es-MX" : "en-US", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
    const [title1, em, title2] = t.h1.split("*");
    return (
        <>
            <section className="-mt-[76px] bg-champana/40 pb-12 pt-32 md:pt-40">
                <div className="mx-auto max-w-[1320px] px-5 md:px-8">
                    <Kicker>{t.kicker}</Kicker>
                    <h1 className="rich max-w-4xl font-serif text-[2.5rem] font-medium leading-[1.04] md:text-[4rem]">{title1}<em>{em}</em>{title2}</h1>
                    <p className="mt-6 max-w-2xl text-lg text-gris">{t.sub}</p>
                </div>
            </section>
            <section className="py-14 md:py-20">
                <div className="mx-auto max-w-[1320px] px-5 md:px-8">
                    {posts.length === 0 ? (
                        <p className="text-gris">{t.empty}</p>
                    ) : (
                        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {posts.map((p) => (
                                <li key={p.slug} className="glass lift flex flex-col overflow-hidden rounded-[28px]">
                                    {p.cover ? <img src={p.cover} alt={p.coverAlt || ""} className="aspect-[16/10] w-full object-cover" loading="lazy" /> : <div className="aspect-[16/10] bg-champana/60" />}
                                    <div className="flex flex-1 flex-col gap-3 p-6">
                                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-dorado-texto">{p.category} · {date(p.publishedAt)}</p>
                                        <h2 className="font-serif text-2xl leading-tight">{p.title}</h2>
                                        <p className="flex-1 text-sm leading-relaxed text-gris">{p.excerpt}</p>
                                        <a href={`/${lang}/blog/${p.slug}`} className="inline-flex min-h-11 items-center text-sm font-bold text-verde underline-offset-4 hover:underline">
                                            {t.read} →<span className="sr-only">: {p.title}</span>
                                        </a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </>
    );
}
