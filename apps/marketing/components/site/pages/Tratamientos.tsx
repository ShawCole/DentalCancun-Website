import type { Lang, PageContent } from "@/lib/cms/schema";
import { LANDINGS } from "@/lib/cms/landings";
import { Button, Kicker, Rich } from "../ui";

const container = "mx-auto w-full max-w-[1320px] px-5 md:px-8";
const h2 = "font-serif text-[2.2rem] font-medium leading-[1.06] text-grafito md:text-[3.2rem]";

/* Card order on the page and the group each one belongs to. */
const ORDER = [
    { id: "carillas-directas", card: 1, group: 1 },
    { id: "carillas-ceramicas", card: 2, group: 1 },
    { id: "alineadores", card: 3, group: 1 },
    { id: "implantes", card: 4, group: 2 },
    { id: "all-on-4", card: 5, group: 2 },
    { id: "coronas", card: 6, group: 2 },
    { id: "protesis", card: 7, group: 2 },
];

export function Tratamientos({ lang, c }: { lang: Lang; c: PageContent }) {
    const { hero = {}, groups = {}, cards = {}, steps = {} } = c;
    const es = lang === "es";
    const more = es ? "Conocer el tratamiento →" : "Learn more →";
    const card = (g: number) =>
        ORDER.filter((o) => o.group === g).map((o) => {
            const l = LANDINGS.find((x) => x.id === o.id)!;
            const href = es ? `/es/tratamientos/${l.slug.es}` : `/en/treatments/${l.slug.en}`;
            return (
                <li key={o.id} className="glass lift flex flex-col gap-3 rounded-[28px] p-7">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-dorado-texto">{cards[`c${o.card}_meta`]}</span>
                    <h3 className="font-serif text-2xl leading-tight">{l[lang].kicker}</h3>
                    <p className="flex-1 text-sm leading-relaxed text-gris">{cards[`c${o.card}_text`]}</p>
                    <a href={href} className="inline-flex min-h-11 items-center text-sm font-bold text-verde underline-offset-4 hover:underline">
                        {more}
                        <span className="sr-only">: {l[lang].kicker}</span>
                    </a>
                </li>
            );
        });

    return (
        <>
            <section className="-mt-[76px] pb-12 pt-32 md:pt-40" style={{ backgroundImage: "url(/dsc/fondo-cristal-marfil.jpg)", backgroundSize: "cover" }}>
                <div className={container}>
                    <nav aria-label={es ? "Migas de pan" : "Breadcrumb"} className="mb-6 text-sm text-gris">
                        <a href={`/${lang}`} className="underline-offset-4 hover:underline">{es ? "Inicio" : "Home"}</a> · <span aria-current="page">{hero.kicker}</span>
                    </nav>
                    <Kicker>{hero.kicker}</Kicker>
                    <Rich as="h1" text={hero.title} className="block max-w-4xl font-serif text-[2.5rem] font-medium leading-[1.04] md:text-[4rem]" />
                    <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gris">{hero.subtitle}</p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Button href={es ? "/es/diagnostico-digital" : "/en/digital-assessment"}>{es ? "Diseña tu sonrisa" : "Design your smile"}</Button>
                        <Button href="#agendar" variant="ghost">{es ? "Agendar valoración" : "Book a consultation"}</Button>
                    </div>
                </div>
            </section>

            {[1, 2].map((g) => (
                <section key={g} className={g === 1 ? "py-14 md:py-20" : "bg-champana/60 py-14 md:py-20"}>
                    <div className={container}>
                        <Kicker>{groups[`g${g}_kicker`]}</Kicker>
                        <Rich as="h2" text={groups[`g${g}_title`]} className={`${h2} max-w-3xl`} />
                        <ul className={`mt-10 grid gap-5 sm:grid-cols-2 ${g === 1 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>{card(g)}</ul>
                    </div>
                </section>
            ))}

            <section className="py-14 md:py-20">
                <div className={container}>
                    <Kicker>{steps.kicker}</Kicker>
                    <Rich as="h2" text={steps.title} className={`${h2} max-w-3xl`} />
                    <ol className="mt-10 grid gap-5 md:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <li key={i} className="rounded-[26px] border border-dorado/30 bg-white p-6">
                                <span className="font-serif text-3xl text-dorado-texto">{String(i).padStart(2, "0")}</span>
                                <h3 className="mt-2 font-bold">{steps[`s${i}_title`]}</h3>
                                <p className="mt-1 text-sm leading-relaxed text-gris">{steps[`s${i}_text`]}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="on-dark bg-verde-osc py-16 text-center text-marfil md:py-24">
                <div className={`${container} flex max-w-4xl flex-col items-center gap-6`}>
                    <p className="font-narrow text-xl italic text-dorado-claro">{es ? "Sonríele a la vida con alegría y confianza." : "Smile with joy and confidence again."}</p>
                    <Rich as="h2" text={es ? "Tu transformación comienza con una *valoración*." : "Your smile makeover starts with a *consultation*."} className="font-serif text-4xl font-medium leading-tight md:text-5xl" />
                    <Button href="#agendar" variant="light">{es ? "Agendar valoración" : "Book a consultation"}</Button>
                </div>
            </section>
        </>
    );
}
