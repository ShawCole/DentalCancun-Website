import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Serif_Display, Manrope, PT_Sans_Narrow } from "next/font/google";
import Script from "next/script";
import { notFound } from "next/navigation";
import "../site.css";
import { getPageContent } from "@/lib/cms/content";
import { LANGS, type Lang } from "@/lib/cms/schema";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"] });
const dmSerif = DM_Serif_Display({ variable: "--font-dmserif", subsets: ["latin"], weight: "400" });
const ptNarrow = PT_Sans_Narrow({ variable: "--font-ptnarrow", subsets: ["latin"], weight: ["400", "700"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], weight: ["400", "600", "700"] });

export const dynamicParams = false;
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
    const site = await getPageContent("site", lang);
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
            <head>
                <Script id="meta-pixel" strategy="afterInteractive">
                    {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','2168883350543599');fbq('track','PageView');`}
                </Script>
                <Script src="https://cdn.idpixel.app/v1/idp-analytics-69dd28d658b55f8c5c273805.min.js" strategy="afterInteractive" />
            </head>
            <body className={`${cormorant.variable} ${dmSerif.variable} ${ptNarrow.variable} ${manrope.variable} bg-marfil font-sans text-grafito antialiased`}>
                <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-verde focus:px-4 focus:py-2 focus:text-marfil">
                    {lang === "es" ? "Saltar al contenido" : "Skip to content"}
                </a>
                <Header lang={lang} logo={site.brand?.logo || "/dsc/logo-dsc.png"} nav={nav} cta={h.cta} altHref={lang === "es" ? "/en" : "/es"} />
                <main id="contenido">{children}</main>
                <Footer lang={lang} site={site} />
            </body>
        </html>
    );
}
