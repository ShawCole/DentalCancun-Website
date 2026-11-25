import type { Lang } from "@/lib/cms/schema";

/* Starting points for new pages. Everything marked [PENDIENTE] or [VALIDAR] must be completed before publishing. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = { root: { props: Record<string, any> }; content: { type: string; props: Record<string, any> }[]; zones: Record<string, unknown> };

let n = 0;
const block = (type: string, props: Record<string, unknown>) => ({ type, props: { id: `${type}-${Date.now().toString(36)}-${n++}`, ...props } });

export const TEMPLATES: { id: string; label: string; text: string }[] = [
    { id: "landing", label: "Landing de tratamiento", text: "Portada, datos clave, descripción, proceso, precio de referencia, testimonios, preguntas y llamado final." },
    { id: "promo", label: "Promoción de temporada", text: "Portada con la oferta, condiciones, beneficios y llamado a agendar." },
    { id: "legal", label: "Página informativa / legal", text: "Título y texto libre, para avisos, políticas y garantías." },
    { id: "blank", label: "En blanco", text: "Empieza desde cero con los bloques que quieras." },
];

export function templateData(id: string, lang: Lang, title: string): Data {
    const es = lang === "es";
    const book = es ? "Agendar valoración" : "Book a consultation";
    const quizHref = es ? "/es/diagnostico-digital" : "/en/digital-assessment";
    const root = { props: { title, description: "", noindex: "no" } };
    if (id === "landing") {
        return {
            root,
            zones: {},
            content: [
                block("Hero", { kicker: es ? "Tratamiento" : "Treatment", title: es ? `${title} con *precisión* y naturalidad` : `${title}, *natural* and precise`, subtitle: "[PENDIENTE]", cta1Label: book, cta1Href: "#agendar", cta2Label: es ? "Diseña tu sonrisa" : "Design your smile", cta2Href: quizHref, theme: "claro" }),
                block("Facts", { bg: "blanco", items: [{ value: "[VALIDAR]", label: es ? "Días en Cancún" : "Days in Cancun" }, { value: "[VALIDAR]", label: es ? "Citas" : "Visits" }, { value: "[VALIDAR]", label: es ? "Garantía" : "Warranty" }] }),
                block("ImageText", { kicker: es ? "Qué es" : "What it is", title: es ? "Una solución diseñada *para ti*" : "A plan designed *for you*", text: "[PENDIENTE]", side: "derecha", bg: "marfil" }),
                block("Steps", { kicker: es ? "Proceso" : "How it works", title: es ? "Tu tratamiento, *paso a paso*" : "Your treatment, *step by step*", bg: "champana", items: es ? [{ title: "Valoración", text: "[PENDIENTE]" }, { title: "Diseño", text: "[PENDIENTE]" }, { title: "Tratamiento", text: "[PENDIENTE]" }, { title: "Seguimiento", text: "[PENDIENTE]" }] : [{ title: "Consultation", text: "[PENDIENTE]" }, { title: "Design", text: "[PENDIENTE]" }, { title: "Treatment", text: "[PENDIENTE]" }, { title: "Follow-up", text: "[PENDIENTE]" }] }),
                block("Price", { kicker: es ? "Inversión" : "Investment", title: es ? "Precio de referencia" : "Starting price", amount: es ? "Desde USD [VALIDAR]" : "From USD [VALIDAR]", note: es ? "El plan y la inversión final se confirman en tu valoración." : "Your final plan and cost are confirmed at your consultation.", fallback: es ? "Se confirma en tu valoración" : "Confirmed at your consultation", ctaLabel: book, ctaHref: "#agendar" }),
                block("Videos", { kicker: es ? "Pacientes" : "Patients", title: es ? "Historias que *inspiran*" : "Stories that *inspire*", items: [] }),
                block("Faq", { title: es ? "Preguntas *frecuentes*" : "Frequently asked *questions*", bg: "marfil", items: [{ q: "[PENDIENTE]", a: "[PENDIENTE]" }] }),
                block("Closing", { kicker: es ? "Sonríele a la vida con alegría y confianza." : "Smile with joy and confidence again.", title: es ? "Tu transformación comienza con una *valoración*." : "Your smile makeover starts with a *consultation*.", label: book, href: "#agendar" }),
            ],
        };
    }
    if (id === "promo") {
        return {
            root,
            zones: {},
            content: [
                block("Hero", { kicker: es ? "Temporada [PENDIENTE]" : "Season [PENDIENTE]", title: title, subtitle: es ? "Condiciones y vigencia: [PENDIENTE: aprobación de la clínica]." : "Terms and dates: [PENDIENTE: clinic approval].", cta1Label: book, cta1Href: "#agendar", theme: "oscuro" }),
                block("Cards", { kicker: es ? "Incluye" : "What's included", title: es ? "Lo que incluye esta *promoción*" : "What this *offer* includes", columns: "3", bg: "marfil", items: [{ title: "[PENDIENTE]", text: "[PENDIENTE]" }, { title: "[PENDIENTE]", text: "[PENDIENTE]" }, { title: "[PENDIENTE]", text: "[PENDIENTE]" }] }),
                block("Text", { title: es ? "Condiciones" : "Terms", text: es ? "- Vigencia: [PENDIENTE]\n- Aplica a: [PENDIENTE]\n- Sujeto a valoración clínica." : "- Valid: [PENDIENTE]\n- Applies to: [PENDIENTE]\n- Subject to a clinical exam.", bg: "blanco" }),
                block("Closing", { kicker: es ? "Cupo limitado [VALIDAR]" : "Limited spots [VALIDAR]", title: es ? "Aparta tu *valoración*." : "Save your *consultation*.", label: book, href: "#agendar" }),
            ],
        };
    }
    if (id === "legal") {
        return {
            root,
            zones: {},
            content: [
                block("Text", { kicker: "Dental Solutions Puerto Cancún", title, text: "[PENDIENTE: texto revisado por el área jurídica de la clínica]", bg: "marfil" }),
            ],
        };
    }
    return { root, zones: {}, content: [] };
}
