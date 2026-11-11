import type { Metadata } from "next";
import { getPageContent } from "@/lib/cms/content";
import type { Lang } from "@/lib/cms/schema";
import { Home } from "@/components/site/Home";

type Params = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const lang = (await params).lang as Lang;
    const seo = (await getPageContent("home", lang)).seo || {};
    return {
        title: seo.title,
        description: seo.description,
        alternates: { canonical: `/${lang}`, languages: { es: "/es", en: "/en" } },
        openGraph: { title: seo.title, description: seo.description, locale: lang === "es" ? "es_MX" : "en_US", type: "website" },
    };
}

export default async function HomePage({ params }: Params) {
    const lang = (await params).lang as Lang;
    const [content, site] = await Promise.all([getPageContent("home", lang), getPageContent("site", lang)]);
    const contact = site.contact || {};
    const schema = {
        "@context": "https://schema.org",
        "@type": "Dentist",
        name: "Dental Solutions Puerto Cancún",
        telephone: contact.phone,
        email: contact.email,
        address: {
            "@type": "PostalAddress",
            streetAddress: "Av. Bay View, Mza. 27, Lote 1-02, UC 54, Local 13, Torre Diomeda",
            addressLocality: "Cancún",
            addressRegion: "Quintana Roo",
            postalCode: "77500",
            addressCountry: "MX",
        },
        openingHours: "Mo-Sa 10:00-19:00",
        availableLanguage: ["es", "en"],
    };
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
            <Home lang={lang} c={content} site={site} />
        </>
    );
}
