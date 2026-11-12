import type { Lang, PageContent } from "@/lib/cms/schema";
import { filled, waLink } from "./ui";
import { ConsentLink } from "./Consent";

export function Footer({ lang, site }: { lang: Lang; site: PageContent }) {
    const c = site.contact || {};
    const f = site.footer || {};
    const b = site.brand || {};
    const s = site.social || {};
    const base = `/${lang}`;
    const legal = lang === "es"
        ? [
              { label: f.privacy, href: `${base}/aviso-de-privacidad` },
              { label: f.guarantee, href: `${base}/garantia-internacional` },
              { label: f.deposits, href: `${base}/anticipos-y-cancelaciones` },
          ]
        : [
              { label: f.privacy, href: `${base}/privacy-notice` },
              { label: f.guarantee, href: `${base}/international-guarantee` },
              { label: f.deposits, href: `${base}/deposits-and-cancellations` },
          ];
    const socials = [
        { label: "Instagram", href: s.instagram },
        { label: "Facebook", href: s.facebook },
        { label: "TikTok", href: s.tiktok },
    ].filter((x) => filled(x.href));

    return (
        <footer className="border-t border-dorado/30 bg-marfil px-5 pb-10 pt-16 text-sm md:px-8">
            <div className="mx-auto grid max-w-[1320px] gap-10 md:grid-cols-4">
                <div className="flex flex-col gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.logo} alt="Dental Solutions Cancún" className="h-12 w-auto self-start" />
                    <p className="font-serif text-xl italic text-verde">{b.concept}</p>
                </div>
                <div>
                    <h2 className="mb-3 font-bold text-grafito">{f.addressTitle}</h2>
                    <p className="leading-relaxed text-gris">{c.address}</p>
                    <p className="mt-2 text-gris">{c.hours}</p>
                </div>
                <div>
                    <h2 className="mb-3 font-bold text-grafito">{f.contactTitle}</h2>
                    <ul className="flex flex-col gap-2 text-gris">
                        <li>
                            WhatsApp{" "}
                            <a href={waLink(c.whatsapp)} target="_blank" rel="noopener noreferrer" className="text-grafito underline-offset-4 hover:text-verde hover:underline">
                                {c.whatsappLabel}
                            </a>
                        </li>
                        {filled(c.phone) && (
                            <li>
                                {lang === "es" ? "Llamadas" : "Phone"}{" "}
                                <a href={`tel:${c.phone.replace(/[^\d+]/g, "")}`} className="text-grafito underline-offset-4 hover:text-verde hover:underline">
                                    {c.phone}
                                </a>
                            </li>
                        )}
                        {filled(c.email) && (
                            <li>
                                <a href={`mailto:${c.email}`} className="text-grafito underline-offset-4 hover:text-verde hover:underline">
                                    {c.email}
                                </a>
                            </li>
                        )}
                        {socials.map((x) => (
                            <li key={x.label}>
                                <a href={x.href} target="_blank" rel="noopener noreferrer" className="text-grafito underline-offset-4 hover:text-verde hover:underline">
                                    {x.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h2 className="mb-3 font-bold text-grafito">{f.legalTitle}</h2>
                    <ul className="flex flex-col gap-2">
                        {legal.map((l) => (
                            <li key={l.href}>
                                <a href={l.href} className="text-grafito underline-offset-4 hover:text-verde hover:underline">
                                    {l.label}
                                </a>
                            </li>
                        ))}
                        <li>
                            <ConsentLink label={lang === "es" ? "Preferencias de cookies" : "Cookie settings"} />
                        </li>
                    </ul>
                </div>
            </div>
            <p className="mx-auto mt-12 max-w-[1320px] border-t border-grafito/10 pt-6 text-xs leading-relaxed text-gris">{f.sanitary}</p>
        </footer>
    );
}
