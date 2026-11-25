import type { Metadata } from "next";
import { fontVars } from "@/lib/site/fonts";
import { notFound } from "next/navigation";
import "../site.css";
import { getPageContent } from "@/lib/cms/content";
import { LANGS, type Lang } from "@/lib/cms/schema";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Concierge } from "@/components/site/Concierge";
import { Consent } from "@/components/site/Consent";
import { Promotions } from "@/components/site/Promotions";
import { getSetting } from "@/lib/settings/server";
import { promoState } from "@/lib/settings";


export function generateStaticParams() {
    return LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
    icons: { icon: "/redesign/DentalSolutions_Favicon.png" },
};

export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
    const { lang: raw } = await params;
    if (!LANGS.includes(raw as Lang)) notFound();
    const lang = raw as Lang;
    const [site, concierge, promos] = await Promise.all([getPageContent("site", lang), getPageContent("concierge", lang), getSetting("promotions")]);
    // Ended promotions never reach the page; dates are checked again in the browser.
    const promotions = promos.items.filter((p) => promoState(p) !== "terminada" && promoState(p) !== "pausada");
    const h = site.header || {};
    const base = `/${lang}`;
    const nav = [
        { label: h.nav1, href: `${base}#tratamientos` },
        { label: h.nav2, href: `${base}#concierge` },
        { label: h.nav3, href: `${base}#valoracion` },
        { label: h.nav4, href: `${base}#equipo` },
        { label: h.nav5, href: `${base}#testimonios` },
        { label: h.nav6, href: `${base}#garantia` },
    ].filter((n) => n.label);

    return (
        <html lang={lang}>
            <body className={`${fontVars} bg-marfil font-sans text-grafito antialiased`}>
                <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-verde focus:px-4 focus:py-2 focus:text-marfil">
                    {lang === "es" ? "Saltar al contenido" : "Skip to content"}
                </a>
                <Promotions lang={lang} items={promotions} />
                <Header lang={lang} logo={site.brand?.logo || "/dsc/logo-dsc.png"} nav={nav} cta={h.cta} altHref={lang === "es" ? "/en" : "/es"} />
                <main id="contenido">{children}</main>
                <Footer lang={lang} site={site} />
                <Concierge lang={lang} whatsapp={site.contact?.whatsapp || ""} phone={site.contact?.phone || ""} panel={concierge.panel || {}} booking={concierge.booking || {}} />
                <Consent lang={lang} />
            </body>
        </html>
    );
}
