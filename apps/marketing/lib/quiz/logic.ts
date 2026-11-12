/* Diagnóstico digital «Diseña tu sonrisa» · lógica clínica v2 (revisión del 19 oct 2026).
   Recommendation rules work on option ids, so they are the same in both languages.
   Internal notes (rule/notes) stay in Spanish: they are for the clinic, not the patient. */
import ES from "./quiz-es.json";
import EN from "./quiz-en.json";
import type { Lang } from "@/lib/cms/schema";

export interface Option { id: string; label: string; next: string | null; g?: string }
export interface Question { text: string; help?: string; affects: boolean; options: Option[] }
export interface Treatment { name: string; short: string; tipo: string; url: string; desc: string; citas: string; estancia: string; garantia: string; inversion: string }
export interface Quiz { start: string; questions: Record<string, Question>; treatments: Record<string, Treatment>; cta: string }
export type Answers = Record<string, string>;
export interface Recommendation { id: string; alt: string | null; rule: string; notes: string[] }

const BASE = ES as unknown as Quiz;

const SLUG_EN: Record<string, string> = {
    "carillas-directas": "direct-veneers",
    "carillas-ceramicas": "porcelain-veneers",
    alineadores: "clear-aligners",
    coronas: "crowns",
    "implantes-dentales": "dental-implants",
    protesis: "dentures",
    "all-on-4": "all-on-4",
};

export function treatmentUrl(slug: string, lang: Lang): string {
    if (!slug) return "";
    return lang === "es" ? `/es/tratamientos/${slug}` : `/en/treatments/${SLUG_EN[slug] || slug}`;
}

/** The quiz in one language (Spanish data with the English overlay on top). */
export function getQuiz(lang: Lang): Quiz {
    if (lang === "es") return BASE;
    const en = EN as unknown as {
        questions: Record<string, { text: string; help?: string; options: Record<string, string> }>;
        treatments: Record<string, Partial<Treatment>>;
        cta: string;
    };
    const questions: Record<string, Question> = {};
    for (const [id, q] of Object.entries(BASE.questions)) {
        const t = en.questions[id];
        questions[id] = {
            ...q,
            text: t?.text || q.text,
            help: q.help ? t?.help || q.help : undefined,
            options: q.options.map((o) => ({ ...o, label: t?.options?.[o.id] || o.label })),
        };
    }
    const treatments: Record<string, Treatment> = {};
    for (const [id, tr] of Object.entries(BASE.treatments)) treatments[id] = { ...tr, ...(en.treatments[id] || {}) };
    return { start: BASE.start, questions, treatments, cta: en.cta };
}

export function recommend(a: Answers): Recommendation {
    const out: Recommendation = { id: "valoracion", alt: null, rule: "", notes: [] };
    const set = (id: string, alt: string | null, rule: string) => {
        out.id = id;
        out.alt = alt;
        out.rule = rule;
    };
    const porPrioridad = (base: string) => {
        if (a.prioridad === "materiales") set("ceramicas", "directas", `${base} + materiales de alta resistencia → carillas cerámicas`);
        else set("directas", "ceramicas", `${base} + cualquier otra preferencia → carillas directas`);
    };
    const arcada = ["mayoria_sup", "mayoria_inf", "todos"].includes(a.falt_cuantos);

    if (a.q1 === "faltantes" || a.esp_zona === "falta") {
        const base = a.q1 === "faltantes" ? "Dientes faltantes" : "Espacio por diente faltante";
        const cu = ({ uno: "falta uno", dos_tres: "faltan 2 o 3", cuatro: "faltan 4 o más" } as Record<string, string>)[a.falt_cuantos] || "falta la mayoría o todos";
        if (a.falt_pref === "removible") set("protesis", arcada ? "allon4" : "implantes", `${base} · ${cu} + prefiere removible → prótesis`);
        else if (arcada) set("allon4", "protesis", `${base} · ${cu} + solución fija u orientación → rehabilitación oral completa`);
        else if (a.falt_cuantos === "cuatro" && a.falt_pref === "rehab_fija") set("allon4", "implantes", `${base} · ${cu} + quiere recuperar todos con rehabilitación fija → rehabilitación oral completa`);
        else set("implantes", "protesis", `${base} · ${cu} + solución fija u orientación → implantes`);
        if (out.id === "allon4" || out.alt === "allon4") out.notes.push("All-on-4 y All-on-6 solo como posibilidad, sujeta a valoración clínica y radiográfica.");
        if (a.falt_actual === "removible") out.notes.push("Usa prótesis removible" + (a.falt_pref === "reemplazar" ? " y busca una alternativa más cómoda." : "."));
        if (a.falt_actual === "puente") out.notes.push("Tiene un puente fijo: revisar su estado.");
        if (a.falt_actual === "implantes" || a.falt_actual === "combinacion") out.notes.push("Ya tiene implantes: revisar la rehabilitación existente.");
    } else if (a.q1 === "varias") {
        set("valoracion", null, "Varias necesidades → valoración integral de estética y rehabilitación");
    } else if (a.q1 === "posicion") {
        const g = a.pos_grado;
        const grado = ({ leve: "ligera", moderada: "moderada", girados: "con dientes girados", apinados: "con apiñamiento" } as Record<string, string>)[g];
        if (g === "mordida") set("valoracion", "alineadores", "La mordida no encaja → valoración integral (oclusión)");
        else if (a.pos_meta === "alineadores") set("alineadores", "directas", "Quiere corregir la posición con alineadores → alineadores");
        else if (a.pos_meta === "sin_brackets") {
            porPrioridad(`Desalineación ${grado} + sin brackets`);
            out.notes.push("Corrección visual con diseño de sonrisa; confirmar espacio y oclusión.");
        } else if (a.pos_meta === "mejorar") {
            if (g === "leve" || g === "moderada") set("directas", "alineadores", "Desalineación ligera o moderada + mejorar alineación y estética → diseño de sonrisa directo");
            else set("alineadores", "directas", "Dientes girados o apiñados + mejorar alineación y estética → alineadores");
        } else if (g === "leve" || g === "moderada") set("directas", "alineadores", "Desalineación ligera o moderada + prefiere que el equipo evalúe → diseño de sonrisa directo");
        else set("valoracion", "alineadores", "Dientes girados o apiñados + prefiere que el equipo evalúe → valoración integral");
    } else if (a.q1 === "desgaste") {
        const t = a.desg_tipo;
        const p = ({ forma: "est", apariencia: "est", resistencia: "fun", masticar: "fun", evitar: "fun", completa: "int" } as Record<string, string>)[a.desg_preocupa];
        if (t === "general" || p === "int") set("valoracion", "rehabilitacion", `${t === "general" ? "Desgaste generalizado" : "Pide rehabilitación completa"} → valoración integral`);
        else if (t === "bordes")
            set(p === "est" ? "directas" : "rehabilitacion", p === "est" ? "ceramicas" : "directas", `Bordes desgastados + ${p === "est" ? "preocupación estética → restauración directa en composite" : "preocupación funcional → rehabilitación personalizada"}`);
        else set("rehabilitacion", t === "pocos" ? "ceramicas" : "valoracion", `${t === "pocos" ? "Uno o dos dientes rotos" : "Varios dientes debilitados"} → rehabilitación personalizada`);
        if (out.id === "rehabilitacion") out.notes.push("Opciones: composite, incrustaciones o coronas según estructura remanente, estado pulpar y oclusión.");
        if (a.desg_sintomas === "dolor" || a.desg_sintomas === "fracturas") out.notes.push(`Refiere ${a.desg_sintomas === "dolor" ? "dolor al masticar" : "fracturas frecuentes"}: valoración prioritaria.`);
        if (a.desg_sintomas === "sensibilidad") out.notes.push("Refiere sensibilidad.");
    } else if (a.q1 === "color" && a.color_tipo === "oscuro") {
        porPrioridad("Un diente más oscuro");
        if (out.id === "directas") out.alt = "ceramicas";
        out.notes.push("Identificar la causa del color y la vitalidad pulpar; corona como alternativa según la estructura conservada.");
    } else if (a.q1 === "espacios" && a.esp_tam === "amplios") {
        porPrioridad("Espacios amplios");
        out.alt = "alineadores";
        out.notes.push("Según el tamaño del espacio, valorar alineadores antes o junto con el diseño de sonrisa.");
    } else {
        porPrioridad(({ color: "Color", espacios: "Espacios pequeños o visibles", forma: "Forma o tamaño" } as Record<string, string>)[a.q1] || "Estética");
        if (a.q1 === "color" && a.color_meta === "natural" && a.color_forma === "no") {
            out.alt = "blanqueamiento";
            out.notes.push("Solo busca un tono más claro y natural: el blanqueamiento puede valorarse si está indicado.");
        }
    }
    return out;
}

/** Follow-up priority: travel date plus willingness to book. */
export function prioridadLead(a: Answers): "Alta" | "Media" | "Nutrir" {
    const v = ({ mes: 2, trimestre: 1, explorando: 0 } as Record<string, number>)[a.viaje] || 0;
    const d = ({ pronto: 2, dudas: 1, despues: 0 } as Record<string, number>)[a.agenda] || 0;
    const s = v + d;
    return s >= 3 ? "Alta" : s >= 2 ? "Media" : "Nutrir";
}

export function tipoNecesidad(a: Answers, r: Recommendation): string {
    if (a.q1 === "varias") return ({ estetica: "Estética", funcion: "Funcional", ambas: "Estética y funcional" } as Record<string, string>)[a.varias_enfoque] || "Estética y funcional";
    return BASE.treatments[r.id].tipo;
}

const lowerFirst = (s: string) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);

/** Result text in three parts: understanding, solution and invitation. */
export function explain(a: Answers, r: Recommendation, lang: Lang) {
    const quiz = getQuiz(lang);
    const lab = (q: string) => {
        const o = a[q] ? quiz.questions[q]?.options.find((x) => x.id === a[q]) : undefined;
        return o ? lowerFirst(o.label) : "";
    };
    const needs = lang === "es"
        ? { color: "mejorar el color de tus dientes", espacios: "cerrar los espacios entre tus dientes", forma: "mejorar la forma o el tamaño de tus dientes", posicion: "mejorar la posición de tus dientes", desgaste: "recuperar tus dientes desgastados o fracturados", faltantes: "recuperar los dientes que te faltan", varias: "mejorar varios aspectos de tu sonrisa" }
        : { color: "improve the color of your teeth", espacios: "close the gaps between your teeth", forma: "improve the shape or size of your teeth", posicion: "improve the position of your teeth", desgaste: "restore your worn or fractured teeth", faltantes: "replace your missing teeth", varias: "improve several aspects of your smile" };
    let need = (needs as Record<string, string>)[a.q1] || "";
    let detailQ = ({ color: "color_meta", espacios: "esp_zona", forma: "forma_tipo", posicion: "pos_meta", desgaste: "desg_preocupa", faltantes: "falt_pref", varias: "varias_enfoque" } as Record<string, string>)[a.q1];
    if (a.esp_zona === "falta") {
        need = needs.faltantes;
        detailQ = "falt_pref";
    }
    const detail = lab(detailQ);
    const pr = lab("prioridad");
    const comprension = lang === "es"
        ? `Nos contaste que te gustaría ${need}${detail ? ` y que buscas «${detail}»` : ""}${pr ? `. Para ti, lo más importante es «${pr}»` : ""}.`
        : `You told us you’d like to ${need}${detail ? `, and you’re looking for “${detail}”` : ""}${pr ? `. What matters most to you: “${pr}”` : ""}.`;
    return {
        comprension,
        solucion: quiz.treatments[r.id].desc,
        invitacion: quiz.cta,
        nota: lang === "es"
            ? "Resultado orientativo basado en tus respuestas. La indicación final, los tiempos y la inversión se confirman en tu valoración clínica."
            : "This is based on your answers. Your dentist confirms the treatment, timing and cost at your exam.",
    };
}

/** Values marked [VALIDAR] or [PENDIENTE] are never shown to patients. */
export const ready = (v?: string) => Boolean(v && !/\[(VALIDAR|PENDIENTE)/i.test(v) && v !== "—");
