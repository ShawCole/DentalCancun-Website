import type { Lang, PageContent } from "@/lib/cms/schema";
import { Button, filled, Kicker, Rich, waLink } from "../ui";
import { Quiz } from "../Quiz";

export function Diagnostico({ lang, c, site }: { lang: Lang; c: PageContent; site: PageContent }) {
    const intro = c.intro || {};
    const closing = c.closing || {};
    const wa = site.contact?.whatsapp || "";
    const es = lang === "es";
    return (
        <>
            <section className="-mt-[76px] pb-20 pt-32 md:pt-40" style={{ backgroundImage: "url(/dsc/fondo-cristal-marfil.jpg)", backgroundSize: "cover" }}>
                <div className="mx-auto grid w-full max-w-[1320px] items-start gap-10 px-5 md:px-8 lg:grid-cols-[0.85fr_1.15fr]">
                    <div className="lg:sticky lg:top-28">
                        <nav aria-label={es ? "Migas de pan" : "Breadcrumb"} className="mb-6 text-sm text-gris">
                            <a href={`/${lang}`} className="underline-offset-4 hover:underline">{es ? "Inicio" : "Home"}</a> · <span aria-current="page">{intro.kicker}</span>
                        </nav>
                        <Kicker>{intro.kicker}</Kicker>
                        <Rich as="h1" text={intro.title} className="block font-serif text-[2.4rem] font-semibold leading-[1.05] md:text-[3.4rem]" />
                        <p className="mt-5 leading-relaxed text-gris">{intro.text}</p>
                        <ol className="mt-8 flex flex-col gap-4">
                            {[1, 2, 3].filter((i) => filled(intro[`p${i}_title`])).map((i) => (
                                <li key={i} className="flex gap-4">
                                    <span className="font-serif text-3xl font-semibold text-dorado-texto">{String(i).padStart(2, "0")}</span>
                                    <div>
                                        <p className="font-bold">{intro[`p${i}_title`]}</p>
                                        <p className="text-sm text-gris">{intro[`p${i}_text`]}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                        <p className="mt-8 border-l-2 border-dorado pl-4 text-xs leading-relaxed text-gris">{intro.notice}</p>
                    </div>
                    <Quiz lang={lang} whatsapp={wa} />
                </div>
            </section>
            <section className="on-dark bg-verde-osc py-20 text-center text-marfil">
                <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-5">
                    <p className="font-serif text-xl italic text-dorado-claro">{closing.concept}</p>
                    <Rich as="h2" text={closing.title} className="font-serif text-4xl font-semibold leading-tight md:text-5xl" />
                    <div className="flex flex-wrap justify-center gap-3">
                        <Button href={`/${lang}#valoracion`} variant="light">{closing.cta}</Button>
                        <Button href={waLink(wa, closing.waMsg)} variant="outlineLight" external>{closing.wa}</Button>
                    </div>
                </div>
            </section>
        </>
    );
}
