import type { Lang, PageContent, SectionValues } from "@/lib/cms/schema";
import { Button, filled, Kicker, Rich, waLink } from "../ui";

const L = {
    es: {
        home: "Inicio",
        treatments: "Tratamientos",
        cta1: "Agendar valoración privada →",
        cta2: "Enviar mis fotos",
        concept: "Sonríele a la vida con confianza y seguridad.",
        essentials: "Lo esencial",
        fit: "¿Es para ti?",
        process: "Tu proceso",
        concierge: "Ver la experiencia concierge",
        expertKicker: "Precisión médica · sensibilidad estética",
        priceKicker: "Inversión",
        priceTitle: "Claridad desde el *primer contacto*.",
        priceText: "Te presentamos tu plan y su inversión por escrito, antes de que reserves un vuelo. Sin sorpresas, con la tranquilidad de saber exactamente qué incluye.",
        priceCta: "Solicitar mi plan personalizado",
        stories: "Sonrisas que inspiran",
        storiesNote: "Testimonios publicados con autorización de cada paciente [VALIDAR]. Los resultados dependen de cada caso.",
        faq: "Preguntas frecuentes",
        book: "Agendar valoración",
        wa: "Escribir por WhatsApp",
    },
    en: {
        home: "Home",
        treatments: "Treatments",
        cta1: "Book a private consultation →",
        cta2: "Send my photos",
        concept: "Smile with joy and confidence again.",
        essentials: "At a glance",
        fit: "Is it right for you?",
        process: "Your process",
        concierge: "See the concierge experience",
        expertKicker: "Medical precision · an eye for beauty",
        priceKicker: "Cost",
        priceTitle: "Clear answers *from day one*.",
        priceText: "You’ll get your plan and its cost in writing before you book a flight. No surprises — you’ll know exactly what’s included.",
        priceCta: "Get my custom plan",
        stories: "Smiles that inspire",
        storiesNote: "Testimonials shared with each patient’s permission [VALIDAR]. Results vary from case to case.",
        faq: "FAQ",
        book: "Book a consultation",
        wa: "Text us on WhatsApp",
    },
};

const container = "mx-auto w-full max-w-[1320px] px-5 md:px-8";
const h2 = "font-serif text-[2.2rem] font-medium leading-[1.06] text-grafito md:text-[3.2rem]";
const n = (k: number) => Array.from({ length: k }, (_, i) => i + 1);

export function Landing({ lang, c, site, testimonials }: { lang: Lang; c: PageContent; site: PageContent; testimonials: SectionValues }) {
    const t = L[lang];
    const { hero = {}, facts = {}, media = {}, intro = {}, fit = {}, process = {}, expert = {}, price = {}, stories = {}, faq = {}, closing = {} } = c;
    const wa = site.contact?.whatsapp || "";
    const videos = (stories.videos || "")
        .split(/[,\s]+/)
        .map(Number)
        .filter((i) => i > 0 && filled(testimonials[`q${i}_video`]));
    const questions = n(5).filter((i) => filled(faq[`q${i}_q`]));
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: questions.map((i) => ({ "@type": "Question", name: faq[`q${i}_q`], acceptedAnswer: { "@type": "Answer", text: faq[`q${i}_a`] } })),
    };

    return (
        <>
            {questions.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

            {/* Portada */}
            <section className="-mt-[76px] pb-14 pt-32 md:pt-40" style={{ backgroundImage: "url(/dsc/fondo-cristal-marfil.jpg)", backgroundSize: "cover" }}>
                <div className={`${container} grid items-start gap-10 lg:grid-cols-[1.25fr_0.75fr]`}>
                    <div>
                        <nav aria-label={lang === "es" ? "Migas de pan" : "Breadcrumb"} className="mb-6 text-sm text-gris">
                            <a href={`/${lang}`} className="underline-offset-4 hover:underline">{t.home}</a> ·{" "}
                            <a href={`/${lang}/${lang === "es" ? "tratamientos" : "treatments"}`} className="underline-offset-4 hover:underline">{t.treatments}</a> · <span aria-current="page">{hero.kicker}</span>
                        </nav>
                        <Kicker>{hero.kicker}</Kicker>
                        <Rich as="h1" text={hero.title} className="block font-serif text-[2.5rem] font-medium leading-[1.04] md:text-[4rem]" />
                        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gris">{hero.subtitle}</p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button href="#agendar">{t.cta1}</Button>
                            <Button href={`/${lang}#valoracion`} variant="ghost">{t.cta2}</Button>
                        </div>
                        <p className="mt-8 font-narrow text-xl italic text-verde">{t.concept}</p>
                    </div>
                    <div className="glass rounded-[30px] p-6 md:p-8">
                        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-verde">{t.essentials}</p>
                        <dl className="flex flex-col divide-y divide-dorado/25">
                            {n(4).filter((i) => filled(facts[`k${i}_label`])).map((i) => (
                                <div key={i} className="flex flex-col gap-1 py-3">
                                    <dt className="text-xs uppercase tracking-[0.14em] text-gris">{facts[`k${i}_label`]}</dt>
                                    <dd className="font-serif text-2xl leading-snug">{facts[`k${i}_value`]}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </section>

            {/* Imágenes y descripción */}
            <section className="py-16 md:py-24">
                <div className={`${container} grid items-center gap-12 lg:grid-cols-2`}>
                    <div className={`grid gap-4 ${filled(media.img2) ? "grid-cols-2" : "grid-cols-1"}`}>
                        {[media.img1, media.img2].filter(filled).map((src, i) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img key={src} src={src} alt="" loading="lazy" className={`w-full rounded-[28px] object-cover ${filled(media.img2) ? "aspect-[9/16]" : "aspect-[4/3]"} ${i === 1 ? "mt-10" : ""}`} />
                        ))}
                    </div>
                    <div>
                        <Rich as="h2" text={intro.title} className={h2} />
                        <p className="mt-6 text-lg leading-relaxed text-gris">{intro.text}</p>
                    </div>
                </div>
            </section>

            {/* ¿Es para ti? */}
            <section className="bg-champana/60 py-16 md:py-24">
                <div className={container}>
                    <Kicker>{t.fit}</Kicker>
                    <Rich as="h2" text={fit.title} className={`${h2} max-w-3xl`} />
                    <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {n(4).filter((i) => filled(fit[`f${i}_title`])).map((i) => (
                            <li key={i} className="glass rounded-[24px] p-6">
                                <h3 className="font-serif text-2xl leading-tight">{fit[`f${i}_title`]}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-gris">{fit[`f${i}_text`]}</p>
                            </li>
                        ))}
                    </ul>
                    {filled(fit.note) && <p className="mt-8 max-w-3xl border-l-2 border-dorado pl-4 text-sm leading-relaxed text-gris">{fit.note}</p>}
                </div>
            </section>

            {/* Proceso */}
            <section className="on-dark bg-verde py-16 text-marfil md:py-24">
                <div className={container}>
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <Kicker dark>{t.process}</Kicker>
                            <Rich as="h2" text={process.title} className="font-serif text-[2.2rem] font-medium leading-[1.06] md:text-[3.2rem]" />
                        </div>
                        <Button href="#agendar" variant="outlineLight">{t.concierge}</Button>
                    </div>
                    <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {n(5).filter((i) => filled(process[`s${i}_title`])).map((i) => (
                            <li key={i} className="glass-dark flex flex-col gap-2 rounded-[24px] p-5">
                                <span className="font-serif text-3xl text-dorado-claro">{String(i).padStart(2, "0")}</span>
                                <h3 className="font-bold">{process[`s${i}_title`]}</h3>
                                <p className="text-sm leading-relaxed text-marfil/75">{process[`s${i}_text`]}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* Materiales y equipo */}
            <section className="py-16 md:py-24">
                <div className={`${container} grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/dsc/consultorio.jpg" alt={lang === "es" ? "Consultorio de Dental Solutions en Puerto Cancún" : "Dental Solutions office in Puerto Cancún"} loading="lazy" className="aspect-[4/3] w-full rounded-[28px] object-cover" />
                    <div>
                        <Kicker>{t.expertKicker}</Kicker>
                        <Rich as="h2" text={expert.title} className={h2} />
                        <p className="mt-6 text-lg leading-relaxed text-gris">{expert.text}</p>
                    </div>
                </div>
            </section>

            {/* Inversión */}
            <section className="pb-16 md:pb-24">
                <div className={container}>
                    <div className="grid items-center gap-8 rounded-[32px] bg-champana p-8 md:grid-cols-[1.2fr_0.8fr] md:p-12">
                        <div>
                            <Kicker>{t.priceKicker}</Kicker>
                            <Rich as="h2" text={t.priceTitle} className={h2} />
                            <p className="mt-5 leading-relaxed text-gris">{t.priceText}</p>
                        </div>
                        <div className="glass rounded-[26px] p-6">
                            <p className="font-serif text-3xl leading-tight">{price.amount}</p>
                            <p className="mt-3 text-sm leading-relaxed text-gris">{price.note}</p>
                            <div className="mt-5">
                                <Button href="#agendar">{t.priceCta}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonios */}
            {videos.length > 0 && (
                <section className="pb-16 md:pb-24">
                    <div className={container}>
                        <Kicker>{t.stories}</Kicker>
                        <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                            {videos.map((i) => (
                                <li key={i} className={`glass rounded-[24px] p-2 ${i === videos[2] ? "hidden md:block" : ""}`}>
                                    <video src={testimonials[`q${i}_video`]} poster={testimonials[`q${i}_poster`] || undefined} controls playsInline preload="none" className="aspect-[9/16] w-full rounded-[20px] bg-black object-cover" />
                                </li>
                            ))}
                        </ul>
                        <p className="mt-4 text-xs text-gris">{t.storiesNote}</p>
                    </div>
                </section>
            )}

            {/* Preguntas frecuentes */}
            {questions.length > 0 && (
                <section className="bg-white/60 py-16 md:py-24">
                    <div className={`${container} grid gap-10 lg:grid-cols-[0.8fr_1.2fr]`}>
                        <div>
                            <Kicker>{t.faq}</Kicker>
                            <Rich as="h2" text={faq.title} className={h2} />
                        </div>
                        <div className="flex flex-col gap-3">
                            {questions.map((i) => (
                                <details key={i} className="group rounded-[22px] border border-dorado/30 bg-marfil px-6 py-4 open:bg-white">
                                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                                        {faq[`q${i}_q`]}
                                        <span className="text-xl text-dorado-texto transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                                    </summary>
                                    <p className="mt-3 leading-relaxed text-gris">{faq[`q${i}_a`]}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Cierre */}
            <section className="on-dark bg-verde-osc py-16 text-center text-marfil md:py-24">
                <div className={`${container} flex max-w-4xl flex-col items-center gap-8`}>
                    <Rich as="h2" text={closing.title} className="font-serif text-4xl font-medium leading-tight md:text-5xl" />
                    <div className="flex flex-wrap justify-center gap-3">
                        <Button href="#agendar" variant="light">{t.book}</Button>
                        <Button href={waLink(wa, closing.waMsg)} variant="outlineLight" external>{t.wa}</Button>
                    </div>
                </div>
            </section>
        </>
    );
}
