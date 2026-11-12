import type { Lang, PageContent, SectionValues } from "@/lib/cms/schema";
import { Button, filled, Kicker, Lines, Rich, waLink } from "./ui";
import { VideoButton } from "./VideoButton";
import { Quiz } from "./Quiz";

interface Props {
    lang: Lang;
    c: PageContent;
    site: PageContent;
}

const items = (s: SectionValues = {}, prefix: string, n: number, key: string) =>
    Array.from({ length: n }, (_, i) => i + 1).filter((i) => filled(s[`${prefix}${i}_${key}`]));

const container = "mx-auto w-full max-w-[1320px] px-5 md:px-8";
const h2 = "font-serif text-[2.4rem] font-medium leading-[1.05] text-grafito md:text-[3.6rem]";

export function Home({ lang, c, site }: Props) {
    const wa = site.contact?.whatsapp || "";
    const es = lang === "es";
    const { hero = {}, trust = {}, treatments = {}, quiz = {}, case: kase = {}, testimonials = {}, team = {}, members = {}, concierge = {}, assessment = {}, guarantee = {}, closing = {} } = c;

    return (
        <>
            {/* 01 · Portada */}
            <section className="-mt-[76px] px-3 pb-12 pt-[88px] md:px-6 md:pb-16">
                <div
                    className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[36px] bg-champana"
                    style={hero.image ? { backgroundImage: `url(${hero.image})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                >
                    <div className="grid items-center gap-8 px-4 py-10 md:px-10 md:py-14 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="glass rounded-[30px] p-7 md:p-11">
                            <Kicker>{hero.kicker}</Kicker>
                            <h1>
                                <span className="block font-display text-[3.4rem] leading-[0.98] text-grafito md:text-[5.6rem]">{hero.headline}</span>
                                <Rich text={hero.title} className="mt-4 block font-narrow text-[1.65rem] leading-[1.15] text-grafito md:text-[2.3rem]" />
                            </h1>
                            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-gris md:text-base">{hero.subtitle}</p>
                            <div className="mt-7 flex flex-wrap gap-3">
                                <Button href="#valoracion">{hero.cta1} →</Button>
                                <Button href="#valoracion" variant="ghost">{hero.cta2}</Button>
                            </div>
                        </div>
                        <div className="relative mx-auto w-full max-w-[340px] lg:mr-6">
                            {filled(hero.photo) && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={hero.photo} alt={hero.caseTitle || ""} className="aspect-[4/5] w-full rounded-[28px] border-4 border-white/70 object-cover shadow-2xl" />
                            )}
                            {filled(hero.video) && (
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <VideoButton src={hero.video} label={hero.videoLabel} closeLabel={es ? "Cerrar" : "Close"} />
                                </div>
                            )}
                            {filled(hero.caseTitle) && (
                                <div className="glass relative -mt-12 mx-3 flex items-center gap-3 rounded-[22px] p-3">
                                    {filled(hero.caseImage) && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={hero.caseImage} alt="" className="h-14 w-14 shrink-0 rounded-full border-2 border-white object-cover" />
                                    )}
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-dorado-texto">{hero.caseLabel}</p>
                                        <p className="font-serif text-lg font-semibold leading-snug">{hero.caseTitle}</p>
                                        {filled(hero.caseText) && <p className="text-xs text-gris">{hero.caseText}</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* 02 · Confianza */}
            <section aria-label={es ? "Por qué confiar" : "Why trust us"} className="border-y border-dorado/25 bg-white/60">
                <ul className={`${container} grid grid-cols-2 gap-6 py-8 lg:grid-cols-4`}>
                    {items(trust, "t", 4, "value").map((i) => (
                        <li key={i} className="flex flex-col gap-1">
                            <span className="font-serif text-2xl font-semibold text-verde">{trust[`t${i}_value`]}</span>
                            <span className="text-sm text-gris">{trust[`t${i}_detail`]}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* 03 · Tratamientos */}
            <section id="tratamientos" className="bg-champana/60 py-20 md:py-28" style={{ backgroundImage: "linear-gradient(rgba(246,243,237,.6), rgba(246,243,237,.6)), url(/dsc/fondo-cristal-clinica.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className={container}>
                    <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <Kicker>{treatments.kicker}</Kicker>
                            <Rich as="h2" text={treatments.title} className={h2} />
                        </div>
                        <p className="max-w-sm text-sm leading-relaxed text-gris">{treatments.note}</p>
                    </div>
                    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {items(treatments, "c", 6, "title").map((i) => (
                            <li key={i} className="glass lift flex flex-col gap-3 rounded-[28px] p-7">
                                <span className="text-xs font-bold uppercase tracking-[0.16em] text-dorado-texto">{treatments[`c${i}_group`]}</span>
                                <h3 className="font-serif text-2xl font-semibold leading-tight">{treatments[`c${i}_title`]}</h3>
                                <p className="flex-1 text-sm leading-relaxed text-gris">{treatments[`c${i}_text`]}</p>
                                {filled(treatments[`c${i}_link`]) && (
                                    <a href={treatments[`c${i}_link`]} className="mt-2 inline-flex min-h-11 items-center text-sm font-bold text-verde underline-offset-4 hover:underline">
                                        {treatments.more}
                                        <span className="sr-only">: {treatments[`c${i}_title`]}</span>
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* 04 · Quiz */}
            <section id="quiz" className="py-20 md:py-28" style={{ backgroundImage: "url(/dsc/fondo-cristal-marfil.jpg)", backgroundSize: "cover" }}>
                <div className={`${container} grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]`}>
                    <div className="lg:sticky lg:top-28">
                        <Kicker>{quiz.kicker}</Kicker>
                        <Rich as="h2" text={quiz.title} className={h2} />
                        <p className="mt-5 max-w-lg leading-relaxed text-gris">{quiz.text}</p>
                        {filled(quiz.cta) && (
                            <a href={quiz.ctaUrl} className="mt-6 inline-flex min-h-11 items-center text-sm font-bold text-verde underline-offset-4 hover:underline">
                                {quiz.cta} →
                            </a>
                        )}
                    </div>
                    <div data-quiz-root={lang} data-wa={wa} className="min-w-0"><Quiz lang={lang} whatsapp={wa} /></div>
                </div>
            </section>

            {/* 05 · Caso real */}
            <section className="py-20 md:py-28">
                <div className={`${container} grid items-center gap-12 lg:grid-cols-2`}>
                    <div className="relative">
                        {filled(kase.after) && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={kase.after} alt={es ? "Resultado del caso" : "Case result"} className="aspect-[4/3] w-full rounded-[32px] object-cover" />
                        )}
                        {filled(kase.before) && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={kase.before} alt={es ? "Antes del tratamiento" : "Before treatment"} className="absolute -bottom-6 left-6 h-28 w-28 rounded-full border-4 border-marfil object-cover shadow-xl md:h-36 md:w-36" />
                        )}
                    </div>
                    <div>
                        <Kicker>{kase.kicker}</Kicker>
                        <Rich as="h2" text={kase.title} className={h2} />
                        <p className="mt-5 leading-relaxed text-gris">{kase.story}</p>
                        <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-dorado/30 pt-6">
                            {items(kase, "d", 3, "label").map((i) => (
                                <div key={i}>
                                    <dt className="text-xs text-gris">{kase[`d${i}_label`]}</dt>
                                    <dd className="font-serif text-lg font-semibold">{kase[`d${i}_value`]}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </section>

            {/* 06 · Testimonios */}
            <section id="testimonios" className="bg-champana/50 py-20 md:py-28" style={{ backgroundImage: "linear-gradient(rgba(246,243,237,.6), rgba(246,243,237,.6)), url(/dsc/fondo-cristal-clinica.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className={container}>
                    <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <Kicker>{testimonials.kicker}</Kicker>
                            <Rich as="h2" text={testimonials.title} className={h2} />
                        </div>
                        <p className="max-w-sm text-sm leading-relaxed text-gris">{testimonials.note}</p>
                    </div>
                    <ul className="grid gap-6 md:grid-cols-3">
                        {[1, 2, 3].filter((i) => filled(testimonials[`q${i}_video`]) || filled(testimonials[`q${i}_poster`])).map((i) => (
                            <li key={i} className="glass flex flex-col gap-4 rounded-[28px] p-4">
                                {filled(testimonials[`q${i}_video`]) ? (
                                    <video src={testimonials[`q${i}_video`]} poster={testimonials[`q${i}_poster`] || undefined} controls playsInline preload="none" className="aspect-[9/16] w-full rounded-[22px] bg-black object-cover" />
                                ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={testimonials[`q${i}_poster`]} alt={testimonials[`q${i}_author`] || ""} className="aspect-[9/16] w-full rounded-[22px] object-cover" />
                                )}
                                <figure className="px-2 pb-2">
                                    <blockquote className="font-serif text-xl font-semibold leading-snug">{testimonials[`q${i}_quote`]}</blockquote>
                                    <figcaption className="mt-2 text-sm text-gris">{testimonials[`q${i}_author`]}</figcaption>
                                </figure>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-8 text-xs leading-relaxed text-gris">{testimonials.legal}</p>
                </div>
            </section>

            {/* 07 · Equipo médico */}
            <section id="equipo" className="py-20 md:py-28">
                <div className={`${container} grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]`}>
                    <div className="relative">
                        {filled(team.image) && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={team.image} alt="" className="aspect-[4/5] w-full rounded-[32px] object-cover" />
                        )}
                        {filled(team.badgeNumber) && (
                            <div className="glass absolute -bottom-6 right-6 flex items-center gap-3 rounded-[24px] px-5 py-4">
                                <span className="font-serif text-5xl font-semibold text-verde">{team.badgeNumber}</span>
                                <span className="max-w-[9rem] text-sm leading-tight text-gris">{team.badgeText}</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <Kicker>{team.kicker}</Kicker>
                        <Rich as="h2" text={team.title} className={h2} />
                        <p className="mt-5 text-lg leading-relaxed text-gris">{team.text}</p>
                        {filled(team.profile) && <p className="mt-6 font-serif text-2xl font-semibold leading-snug">{team.profile}</p>}
                        {filled(team.credentials) && <Lines text={team.credentials} className="mt-4 flex flex-col gap-2 border-l-2 border-dorado pl-4 text-sm text-gris" />}
                    </div>
                </div>
            </section>

            {/* 08 · Integrantes */}
            {items(members, "m", 4, "role").length > 0 && (
                <section className="pb-20 md:pb-28">
                    <div className={container}>
                        <Kicker>{members.kicker}</Kicker>
                        <Rich as="h2" text={members.title} className={`${h2} mb-10 block`} />
                        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {items(members, "m", 4, "role").map((i) => (
                                <li key={i} className="glass flex flex-col gap-3 rounded-[28px] p-6">
                                    {filled(members[`m${i}_photo`]) && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={members[`m${i}_photo`]} alt={members[`m${i}_name`] || ""} className="h-20 w-20 rounded-full object-cover" />
                                    )}
                                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-dorado-texto">{members[`m${i}_role`]}</p>
                                    {filled(members[`m${i}_name`]) && <h3 className="font-serif text-2xl font-semibold">{members[`m${i}_name`]}</h3>}
                                    <p className="text-sm leading-relaxed text-gris">{members[`m${i}_text`]}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {/* 09 · Concierge */}
            <section id="concierge" className="on-dark bg-verde py-20 text-marfil md:py-28">
                <div className={container}>
                    <div className="max-w-3xl">
                        <Kicker dark>{concierge.kicker}</Kicker>
                        <Rich as="h2" text={concierge.title} className="font-serif text-4xl font-semibold leading-[1.08] text-marfil md:text-5xl" />
                        <p className="mt-5 max-w-2xl leading-relaxed text-marfil/80">{concierge.text}</p>
                    </div>
                    <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items(concierge, "s", 6, "title").map((i) => (
                            <li key={i} className="glass-dark flex gap-4 rounded-[24px] p-6">
                                <span className="font-serif text-3xl font-semibold text-dorado-claro">{String(i).padStart(2, "0")}</span>
                                <div>
                                    <h3 className="font-bold">{concierge[`s${i}_title`]}</h3>
                                    <p className="mt-1 text-sm leading-relaxed text-marfil/75">{concierge[`s${i}_text`]}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                    {filled(concierge.cta) && (
                        <div className="mt-10">
                            <Button href={concierge.ctaUrl || "#valoracion"} variant="light">{concierge.cta} →</Button>
                        </div>
                    )}
                </div>
            </section>

            {/* 10 · Valoración virtual */}
            <section id="valoracion" className="py-20 md:py-28">
                <div className={container}>
                    <div className="mb-12 max-w-3xl">
                        <Kicker>{assessment.kicker}</Kicker>
                        <Rich as="h2" text={assessment.title} className={h2} />
                    </div>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="flex flex-col gap-4 rounded-[32px] border border-dorado/30 bg-white p-8">
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-dorado-texto">{assessment.uploadLabel}</p>
                            <h3 className="font-serif text-3xl font-semibold leading-tight">{assessment.uploadTitle}</h3>
                            <p className="text-sm leading-relaxed text-gris">{assessment.uploadText}</p>
                            <div className="mt-auto pt-2">
                                <Button href={waLink(wa, assessment.uploadMsg)} external>
                                    {assessment.uploadCta}
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 rounded-[32px] bg-champana p-8">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-dorado-texto">{assessment.callLabel}</p>
                                {filled(assessment.callBadge) && <span className="rounded-full bg-verde px-3 py-1 text-xs font-bold text-marfil">{assessment.callBadge}</span>}
                            </div>
                            <h3 className="font-serif text-3xl font-semibold leading-tight">{assessment.callTitle}</h3>
                            <p className="text-sm leading-relaxed text-gris">{assessment.callText}</p>
                            <div className="mt-auto pt-2">
                                <Button href={waLink(wa, assessment.callMsg)} external>
                                    {assessment.callCta}
                                </Button>
                            </div>
                            <p className="text-xs leading-relaxed text-gris">{assessment.deposit}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 11 · Garantía */}
            <section id="garantia" className="bg-champana py-20 md:py-28">
                <div className={`${container} grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]`}>
                    <div>
                        <Kicker>{guarantee.kicker}</Kicker>
                        <Rich as="h2" text={guarantee.title} className={h2} />
                        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-gris">{guarantee.terms}</p>
                        {filled(guarantee.cta) && (
                            <div className="mt-8">
                                <Button href={guarantee.ctaUrl || "#"} variant="ghost">{guarantee.cta}</Button>
                            </div>
                        )}
                    </div>
                    <ul className="grid gap-4">
                        {items(guarantee, "g", 3, "value").map((i) => (
                            <li key={i} className="glass flex items-baseline justify-between gap-4 rounded-[24px] px-6 py-5">
                                <span className="font-serif text-4xl font-semibold text-verde">{guarantee[`g${i}_value`]}</span>
                                <span className="text-right text-sm text-gris">{guarantee[`g${i}_detail`]}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* 12 · Cierre */}
            <section className="on-dark bg-verde-osc py-20 text-center text-marfil md:py-28">
                <div className={`${container} flex max-w-4xl flex-col items-center gap-8`}>
                    <Rich as="h2" text={closing.title} className="font-serif text-4xl font-semibold leading-[1.1] md:text-5xl" />
                    <div className="flex flex-wrap justify-center gap-3">
                        <Button href="#valoracion" variant="light">{closing.cta1}</Button>
                        <Button href={quiz.ctaUrl || "#quiz"} variant="outlineLight">{closing.cta2}</Button>
                    </div>
                </div>
            </section>
        </>
    );
}
