/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import { Button, Kicker, Rich } from "@/components/site/ui";
import { ready } from "@/lib/quiz/logic";

/*
 * Blocks of the page builder. Each one reuses the look of the site
 * (palette, fonts, glass cards), so the clinic can build pages that stay
 * on brand. Fields for the editor live in components/admin/builder.
 */

export type Bg = "marfil" | "champana" | "blanco" | "verde";
type Puck = { puck?: { isEditing?: boolean } };
type Item<T> = T[] | undefined;

const container = "mx-auto w-full max-w-[1320px] px-5 md:px-8";
const h2 = "font-serif text-[2.2rem] font-medium leading-[1.06] md:text-[3.2rem]";
const bgClass: Record<Bg, string> = {
    marfil: "bg-marfil text-grafito",
    champana: "bg-champana/60 text-grafito",
    blanco: "bg-white text-grafito",
    verde: "on-dark bg-verde-osc text-marfil",
};

function Section({ bg = "marfil", children, className = "" }: { bg?: Bg; children: ReactNode; className?: string }) {
    return <section className={`py-14 md:py-20 ${bgClass[bg] || bgClass.marfil} ${className}`}><div className={container}>{children}</div></section>;
}

function Heading({ kicker, title, dark, center }: { kicker?: string; title?: string; dark?: boolean; center?: boolean }) {
    if (!kicker && !title) return null;
    return (
        <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
            {kicker && <Kicker dark={dark}>{kicker}</Kicker>}
            {title && <Rich as="h2" text={title} className={h2} />}
        </div>
    );
}

/** Editor-only hint (never shown to visitors). */
function Hint({ puck, children }: Puck & { children: ReactNode }) {
    return puck?.isEditing ? <p className="mx-auto my-3 max-w-3xl rounded-xl bg-[#FBEFD5] px-4 py-3 text-sm text-[#6B4500]">{children}</p> : null;
}

/** Tiny formatting for free text: blank line = paragraph, **bold**, *italic*, [text](link). */
export function SimpleText({ text = "", className = "" }: { text?: string; className?: string }) {
    const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const inline = (s: string) =>
        esc(s)
            .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
            .replace(/\*([^*]+)\*/g, "<em>$1</em>")
            .replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/|#|mailto:|tel:)[^)\s]+)\)/g, '<a href="$2" class="font-semibold underline underline-offset-4">$1</a>');
    const html = text
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => (/^- /m.test(p) ? `<ul class="list-disc pl-5 space-y-1">${p.split("\n").map((l) => `<li>${inline(l.replace(/^- /, ""))}</li>`).join("")}</ul>` : `<p>${inline(p).replace(/\n/g, "<br/>")}</p>`))
        .join("");
    return <div className={`flex flex-col gap-4 leading-relaxed ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ---------- Blocks ---------- */

export interface HeroProps { kicker?: string; title?: string; subtitle?: string; image?: string; imageAlt?: string; cta1Label?: string; cta1Href?: string; cta2Label?: string; cta2Href?: string; theme?: "claro" | "oscuro" }
function Hero({ kicker, title, subtitle, image, imageAlt, cta1Label, cta1Href, cta2Label, cta2Href, theme = "claro" }: HeroProps) {
    const dark = theme === "oscuro";
    return (
        <section className={`relative -mt-[76px] overflow-hidden pb-14 pt-32 md:pb-20 md:pt-40 ${dark ? "on-dark bg-verde-osc text-marfil" : "bg-champana/40"}`}>
            {image && <img src={image} alt="" aria-hidden="true" className={`absolute inset-0 h-full w-full object-cover ${dark ? "opacity-35" : "opacity-25"}`} />}
            <div className={`relative ${container} grid items-center gap-10 ${image && !dark ? "lg:grid-cols-[1.1fr_0.9fr]" : ""}`}>
                <div className={`${dark ? "glass-dark" : "glass"} rounded-[32px] p-7 md:p-10`}>
                    {kicker && <Kicker dark={dark}>{kicker}</Kicker>}
                    {title && <Rich as="h1" text={title} className="block font-display text-[2.6rem] leading-[1.02] md:text-[4.2rem]" />}
                    {subtitle && <p className={`mt-5 max-w-2xl text-lg leading-relaxed ${dark ? "text-marfil/85" : "text-gris"}`}>{subtitle}</p>}
                    {(cta1Label || cta2Label) && (
                        <div className="mt-8 flex flex-wrap gap-3">
                            {cta1Label && <Button href={cta1Href || "#agendar"} variant={dark ? "light" : "primary"}>{cta1Label}</Button>}
                            {cta2Label && <Button href={cta2Href || "#"} variant={dark ? "outlineLight" : "ghost"}>{cta2Label}</Button>}
                        </div>
                    )}
                </div>
                {image && !dark && <img src={image} alt={imageAlt || ""} className="hidden aspect-[4/5] w-full rounded-[32px] object-cover shadow-xl lg:block" />}
            </div>
        </section>
    );
}

export interface FactsProps { items?: Item<{ value: string; label: string }>; bg?: Bg }
function Facts({ items = [], bg = "blanco" }: FactsProps) {
    return (
        <section className={`py-8 ${bgClass[bg]}`}>
            <ul className={`${container} grid gap-4 sm:grid-cols-2 lg:grid-cols-4`}>
                {items.filter((i) => i.value || i.label).map((i, k) => (
                    <li key={k} className="rounded-[22px] border border-dorado/30 px-5 py-4">
                        <span className="block font-serif text-3xl text-dorado-texto">{i.value}</span>
                        <span className="text-sm text-gris">{i.label}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export interface CardsProps { kicker?: string; title?: string; columns?: "2" | "3" | "4"; bg?: Bg; items?: Item<{ title: string; text: string; image?: string; href?: string; linkLabel?: string }> }
function Cards({ kicker, title, columns = "3", bg = "marfil", items = [] }: CardsProps) {
    const cols = { "2": "md:grid-cols-2", "3": "md:grid-cols-2 lg:grid-cols-3", "4": "sm:grid-cols-2 lg:grid-cols-4" }[columns];
    const dark = bg === "verde";
    return (
        <Section bg={bg}>
            <Heading kicker={kicker} title={title} dark={dark} />
            <ul className={`mt-10 grid gap-5 ${cols}`}>
                {items.map((c, k) => (
                    <li key={k} className={`${dark ? "glass-dark" : "glass"} flex flex-col overflow-hidden rounded-[28px]`}>
                        {c.image && <img src={c.image} alt="" className="aspect-[4/3] w-full object-cover" />}
                        <div className="flex flex-1 flex-col gap-3 p-7">
                            <h3 className="font-serif text-2xl leading-tight">{c.title}</h3>
                            <p className={`flex-1 text-sm leading-relaxed ${dark ? "text-marfil/80" : "text-gris"}`}>{c.text}</p>
                            {c.href && c.linkLabel && <a href={c.href} className="inline-flex min-h-11 items-center text-sm font-bold underline-offset-4 hover:underline">{c.linkLabel} →</a>}
                        </div>
                    </li>
                ))}
            </ul>
        </Section>
    );
}

export interface ImageTextProps { kicker?: string; title?: string; text?: string; image?: string; imageAlt?: string; side?: "izquierda" | "derecha"; ctaLabel?: string; ctaHref?: string; bg?: Bg }
function ImageText({ kicker, title, text, image, imageAlt, side = "derecha", ctaLabel, ctaHref, bg = "marfil" }: ImageTextProps) {
    const dark = bg === "verde";
    return (
        <Section bg={bg}>
            <div className="grid items-center gap-10 lg:grid-cols-2">
                <div className={side === "izquierda" ? "lg:order-2" : ""}>
                    <Heading kicker={kicker} title={title} dark={dark} />
                    <SimpleText text={text} className={`mt-6 text-lg ${dark ? "text-marfil/85" : "text-gris"}`} />
                    {ctaLabel && <Button href={ctaHref || "#agendar"} variant={dark ? "light" : "primary"} className="mt-8">{ctaLabel}</Button>}
                </div>
                {image && <img src={image} alt={imageAlt || ""} className="aspect-[4/3] w-full rounded-[32px] object-cover shadow-lg" />}
            </div>
        </Section>
    );
}

export interface StepsProps { kicker?: string; title?: string; bg?: Bg; items?: Item<{ title: string; text: string }> }
function Steps({ kicker, title, bg = "marfil", items = [] }: StepsProps) {
    return (
        <Section bg={bg}>
            <Heading kicker={kicker} title={title} dark={bg === "verde"} />
            <ol className={`mt-10 grid gap-5 md:grid-cols-2 ${items.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
                {items.map((s, i) => (
                    <li key={i} className="rounded-[26px] border border-dorado/30 bg-white p-6 text-grafito">
                        <span className="font-serif text-3xl text-dorado-texto">{String(i + 1).padStart(2, "0")}</span>
                        <h3 className="mt-2 font-bold">{s.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-gris">{s.text}</p>
                    </li>
                ))}
            </ol>
        </Section>
    );
}

export interface PriceProps { kicker?: string; title?: string; amount?: string; note?: string; ctaLabel?: string; ctaHref?: string; fallback?: string }
function Price({ kicker, title, amount, note, ctaLabel, ctaHref, fallback, puck }: PriceProps & Puck) {
    const show = ready(amount);
    return (
        <Section bg="champana">
            <div className="glass mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-[32px] p-8 text-center md:p-12">
                {kicker && <Kicker>{kicker}</Kicker>}
                {title && <Rich as="h2" text={title} className="font-serif text-3xl leading-tight md:text-4xl" />}
                <p className="font-display text-4xl text-verde md:text-5xl">{show ? amount : fallback || "—"}</p>
                {note && <p className="max-w-xl text-sm text-gris">{note}</p>}
                {ctaLabel && <Button href={ctaHref || "#agendar"}>{ctaLabel}</Button>}
            </div>
            {!show && amount && <Hint puck={puck}>El precio tiene [VALIDAR] o [PENDIENTE]: en el sitio se muestra el texto alternativo hasta que la clínica lo apruebe.</Hint>}
        </Section>
    );
}

export interface VideosProps { kicker?: string; title?: string; items?: Item<{ video: string; poster?: string; quote?: string; author?: string }> }
function Videos({ kicker, title, items = [] }: VideosProps) {
    return (
        <Section bg="verde">
            <Heading kicker={kicker} title={title} dark />
            <ul className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
                {items.filter((v) => v.video).map((v, k) => (
                    <li key={k} className="w-[78%] shrink-0 snap-start sm:w-[42%] lg:w-[28%]">
                        <video src={v.video} poster={v.poster} controls preload="none" playsInline className="aspect-[9/16] w-full rounded-[26px] bg-black object-cover" />
                        {v.quote && <p className="mt-3 font-serif text-lg italic">“{v.quote}”</p>}
                        {v.author && <p className="text-sm text-dorado-claro">{v.author}</p>}
                    </li>
                ))}
            </ul>
        </Section>
    );
}

export interface BeforeAfterProps { title?: string; before?: string; after?: string; caption?: string; source?: "real" | "ilustrativa"; consent?: "si" | "no" }
function BeforeAfter({ title, before, after, caption, source = "ilustrativa", consent = "no", puck }: BeforeAfterProps & Puck) {
    // A real case is only published with the patient's signed authorization.
    if (source === "real" && consent !== "si") return <Hint puck={puck}>Este caso real no se muestra en el sitio hasta marcar que hay autorización firmada del paciente.</Hint>;
    return (
        <Section bg="blanco">
            {title && <Rich as="h2" text={title} className={`${h2} mb-8 max-w-3xl`} />}
            <div className="grid gap-4 sm:grid-cols-2">
                {[before, after].map((src, i) => (
                    <figure key={i} className="overflow-hidden rounded-[26px] border border-dorado/30">
                        {src ? <img src={src} alt={i ? "Después" : "Antes"} className="aspect-[4/3] w-full object-cover" /> : <div className="aspect-[4/3] bg-champana/40" />}
                        <figcaption className="px-4 py-2 text-sm font-bold">{i ? "Después / After" : "Antes / Before"}</figcaption>
                    </figure>
                ))}
            </div>
            <p className="mt-4 text-sm text-gris">
                {caption}
                {caption ? " · " : ""}
                {source === "real" ? "Caso real publicado con autorización del paciente. Los resultados varían en cada persona." : "Imagen ilustrativa, no corresponde a un paciente."}
            </p>
        </Section>
    );
}

export interface FaqProps { title?: string; bg?: Bg; items?: Item<{ q: string; a: string }> }
function Faq({ title, bg = "marfil", items = [] }: FaqProps) {
    return (
        <Section bg={bg}>
            {title && <Rich as="h2" text={title} className={`${h2} max-w-3xl`} />}
            <div className="mt-8 flex max-w-4xl flex-col gap-3">
                {items.filter((i) => i.q).map((i, k) => (
                    <details key={k} className="group rounded-[22px] border border-dorado/30 bg-white px-6 py-4 text-grafito">
                        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-bold">
                            {i.q}
                            <span aria-hidden="true" className="text-xl text-dorado-texto transition-transform group-open:rotate-45">+</span>
                        </summary>
                        <SimpleText text={i.a} className="pb-2 pt-2 text-gris" />
                    </details>
                ))}
            </div>
        </Section>
    );
}

export interface TextProps { kicker?: string; title?: string; text?: string; align?: "izquierda" | "centro"; bg?: Bg }
function Text({ kicker, title, text, align = "izquierda", bg = "marfil" }: TextProps) {
    const center = align === "centro";
    return (
        <Section bg={bg}>
            <Heading kicker={kicker} title={title} dark={bg === "verde"} center={center} />
            <SimpleText text={text} className={`mt-6 max-w-3xl text-lg ${center ? "mx-auto text-center" : ""} ${bg === "verde" ? "text-marfil/85" : "text-gris"}`} />
        </Section>
    );
}

export interface QuizCtaProps { title?: string; text?: string; label?: string; href?: string }
function QuizCta({ title, text, label, href }: QuizCtaProps) {
    return (
        <Section bg="champana">
            <div className="glass mx-auto flex max-w-4xl flex-col items-start gap-4 rounded-[32px] p-8 md:flex-row md:items-center md:justify-between md:p-10">
                <div>
                    {title && <Rich as="h2" text={title} className="font-serif text-3xl leading-tight" />}
                    {text && <p className="mt-2 text-gris">{text}</p>}
                </div>
                {label && <Button href={href || "/es/diagnostico-digital"}>{label}</Button>}
            </div>
        </Section>
    );
}

export interface ClosingProps { kicker?: string; title?: string; label?: string; href?: string; label2?: string; href2?: string }
function Closing({ kicker, title, label, href, label2, href2 }: ClosingProps) {
    return (
        <section className="on-dark bg-verde-osc py-16 text-center text-marfil md:py-24">
            <div className={`${container} flex max-w-4xl flex-col items-center gap-6`}>
                {kicker && <p className="font-narrow text-xl italic text-dorado-claro">{kicker}</p>}
                {title && <Rich as="h2" text={title} className="font-serif text-4xl font-medium leading-tight md:text-5xl" />}
                <div className="flex flex-wrap justify-center gap-3">
                    {label && <Button href={href || "#agendar"} variant="light">{label}</Button>}
                    {label2 && <Button href={href2 || "#"} variant="outlineLight">{label2}</Button>}
                </div>
            </div>
        </section>
    );
}

export interface SpacerProps { size?: "s" | "m" | "l"; bg?: Bg }
function Spacer({ size = "m", bg = "marfil" }: SpacerProps) {
    return <div aria-hidden="true" className={`${bgClass[bg]} ${{ s: "h-8", m: "h-16", l: "h-28" }[size]}`} />;
}

/* ---------- Registry ---------- */

export const BLOCKS = {
    Hero: { label: "Portada", render: Hero, defaultProps: { kicker: "Antetítulo", title: "Título con una palabra en *cursiva*", subtitle: "Bajada breve que explica el beneficio.", cta1Label: "Agendar valoración", cta1Href: "#agendar", theme: "claro" } as HeroProps },
    Facts: { label: "Datos clave", render: Facts, defaultProps: { bg: "blanco", items: [{ value: "1 día", label: "Tiempo estimado [VALIDAR]" }, { value: "2 citas", label: "Visitas a la clínica" }] } as FactsProps },
    Cards: { label: "Tarjetas", render: Cards, defaultProps: { title: "Título de la sección", columns: "3", bg: "marfil", items: [{ title: "Tarjeta", text: "Texto breve." }] } as CardsProps },
    ImageText: { label: "Imagen + texto", render: ImageText, defaultProps: { title: "Título", text: "Texto de la sección.", side: "derecha", bg: "marfil" } as ImageTextProps },
    Steps: { label: "Proceso por pasos", render: Steps, defaultProps: { kicker: "Cómo funciona", title: "Tu proceso, paso a paso", bg: "marfil", items: [{ title: "Valoración", text: "Revisamos tu caso." }, { title: "Plan", text: "Diseñamos tu tratamiento." }, { title: "Tratamiento", text: "Te acompañamos en Cancún." }] } as StepsProps },
    Price: { label: "Precio de referencia", render: Price, defaultProps: { kicker: "Inversión", title: "Precio de referencia", amount: "Desde USD [VALIDAR]", note: "El plan y la inversión final se confirman en tu valoración.", fallback: "Se confirma en tu valoración", ctaLabel: "Agendar valoración", ctaHref: "#agendar" } as PriceProps },
    Videos: { label: "Videos de testimonios", render: Videos, defaultProps: { kicker: "Pacientes", title: "Historias que *inspiran*", items: [] } as VideosProps },
    BeforeAfter: { label: "Antes y después", render: BeforeAfter, defaultProps: { title: "Antes y después", source: "ilustrativa", consent: "no" } as BeforeAfterProps },
    Faq: { label: "Preguntas frecuentes", render: Faq, defaultProps: { title: "Preguntas *frecuentes*", bg: "marfil", items: [{ q: "Pregunta", a: "Respuesta." }] } as FaqProps },
    Text: { label: "Texto libre", render: Text, defaultProps: { title: "Título", text: "Escribe aquí. Deja una línea en blanco para un nuevo párrafo.", align: "izquierda", bg: "marfil" } as TextProps },
    QuizCta: { label: "Invitación al diagnóstico", render: QuizCta, defaultProps: { title: "¿No sabes qué tratamiento necesitas?", text: "Responde unas preguntas y recibe una orientación inicial.", label: "Diseña tu sonrisa", href: "/es/diagnostico-digital" } as QuizCtaProps },
    Closing: { label: "Llamado final", render: Closing, defaultProps: { kicker: "Sonríele a la vida con alegría y confianza.", title: "Tu transformación comienza con una *valoración*.", label: "Agendar valoración", href: "#agendar" } as ClosingProps },
    Spacer: { label: "Espacio", render: Spacer, defaultProps: { size: "m", bg: "marfil" } as SpacerProps },
};
export type BlockName = keyof typeof BLOCKS;

export interface RootProps { title?: string; description?: string; noindex?: "si" | "no" }
