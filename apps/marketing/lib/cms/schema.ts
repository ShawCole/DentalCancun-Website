/**
 * CMS schema: describes every editable page, its sections and fields.
 * The admin panel builds its forms from this file, and the site reads
 * content with the same ids. To make something editable, add it here.
 */

import { LANDINGS } from "./landings";

export type Lang = "es" | "en";
export const LANGS: Lang[] = ["es", "en"];
export const LANG_LABEL: Record<Lang, string> = { es: "Español", en: "English" };

export type FieldType = "text" | "textarea" | "image" | "url";

export interface FieldDef {
    id: string;
    label: string;
    type: FieldType;
    help?: string;
    /** Same value for both languages (for example an image or a phone). */
    shared?: boolean;
    max?: number;
}

export interface SectionDef {
    id: string;
    label: string;
    fields: FieldDef[];
}

export interface PageDef {
    id: string;
    label: string;
    /** Public path in Spanish and English. */
    path: Record<Lang, string>;
    sections: SectionDef[];
}

const EM = "Escribe entre *asteriscos* la palabra que va en cursiva.";

const t = (id: string, label: string, extra: Partial<FieldDef> = {}): FieldDef => ({ id, label, type: "text", ...extra });
const ta = (id: string, label: string, extra: Partial<FieldDef> = {}): FieldDef => ({ id, label, type: "textarea", ...extra });
const img = (id: string, label: string): FieldDef => ({ id, label, type: "image", shared: true });
const url = (id: string, label: string, shared = false): FieldDef => ({ id, label, type: "url", shared });

/** Repeats a group of fields: item 1, item 2… (ids like c1_title). */
function repeat(n: number, prefix: string, name: string, fields: FieldDef[]): FieldDef[] {
    const out: FieldDef[] = [];
    for (let i = 1; i <= n; i++) {
        for (const f of fields) out.push({ ...f, id: `${prefix}${i}_${f.id}`, label: `${name} ${i} · ${f.label}` });
    }
    return out;
}

const seo: SectionDef = {
    id: "seo",
    label: "SEO (Google)",
    fields: [t("title", "Título para Google", { max: 60 }), ta("description", "Descripción para Google", { max: 160 })],
};

export const PAGES: PageDef[] = [
    {
        id: "site",
        label: "Datos generales, menú y pie de página",
        path: { es: "/es", en: "/en" },
        sections: [
            {
                id: "contact",
                label: "Contacto",
                fields: [
                    t("whatsapp", "WhatsApp (solo números, con lada de país)", { shared: true, help: "Ejemplo: 529841145997" }),
                    t("whatsappLabel", "WhatsApp como se muestra", { shared: true }),
                    t("phone", "Teléfono como se muestra", { shared: true }),
                    t("email", "Correo", { shared: true }),
                    ta("address", "Dirección"),
                    t("hours", "Horario"),
                ],
            },
            {
                id: "brand",
                label: "Marca",
                fields: [img("logo", "Logo"), t("concept", "Frase de marca")],
            },
            {
                id: "header",
                label: "Menú superior",
                fields: [
                    t("nav1", "Menú · Tratamientos"),
                    t("nav2", "Menú · Concierge"),
                    t("nav3", "Menú · Valoración virtual"),
                    t("nav4", "Menú · Equipo médico"),
                    t("nav5", "Menú · Testimonios"),
                    t("nav6", "Menú · Garantía"),
                    t("cta", "Botón del menú"),
                ],
            },
            {
                id: "footer",
                label: "Pie de página",
                fields: [
                    t("addressTitle", "Título de la dirección"),
                    t("contactTitle", "Título de contacto"),
                    t("legalTitle", "Título legal"),
                    t("privacy", "Enlace · Aviso de privacidad"),
                    t("guarantee", "Enlace · Garantía"),
                    t("deposits", "Enlace · Anticipos y cancelaciones"),
                    ta("sanitary", "Leyenda sanitaria", { help: "Validar con el abogado de la clínica." }),
                ],
            },
            {
                id: "social",
                label: "Redes sociales",
                fields: [url("instagram", "Instagram", true), url("facebook", "Facebook", true), url("tiktok", "TikTok", true)],
            },
        ],
    },
    {
        id: "home",
        label: "Inicio",
        path: { es: "/es", en: "/en" },
        sections: [
            {
                id: "hero",
                label: "01 · Portada",
                fields: [
                    t("kicker", "Antetítulo"),
                    t("headline", "Frase grande (ej. «Sonríele a la vida.»)"),
                    t("title", "Título", { help: EM }),
                    ta("subtitle", "Bajada"),
                    t("cta1", "Botón principal"),
                    t("cta2", "Botón secundario"),
                    t("concept", "Frase de marca"),
                    img("image", "Imagen de fondo"),
                    img("photo", "Foto vertical del paciente"),
                    url("video", "Video «Ver la experiencia» (.mp4, opcional)", true),
                    t("videoLabel", "Texto del botón de video"),
                    img("caseImage", "Caso real · foto circular"),
                    t("caseLabel", "Caso real · etiqueta"),
                    t("caseTitle", "Caso real · título"),
                    t("caseText", "Caso real · tratamiento"),
                ],
            },
            {
                id: "trust",
                label: "02 · Barra de confianza",
                fields: repeat(4, "t", "Dato", [t("value", "Dato"), t("detail", "Detalle")]),
            },
            {
                id: "treatments",
                label: "03 · Tratamientos",
                fields: [
                    t("kicker", "Antetítulo"),
                    t("title", "Título", { help: EM }),
                    ta("note", "Nota"),
                    t("more", "Texto de los enlaces"),
                    ...repeat(6, "c", "Tarjeta", [t("group", "Grupo"), t("title", "Título"), ta("text", "Texto"), url("link", "Enlace")]),
                ],
            },
            {
                id: "quiz",
                label: "04 · Quiz",
                fields: [t("kicker", "Antetítulo"), t("title", "Título", { help: EM }), ta("text", "Bajada"), t("cta", "Botón"), url("ctaUrl", "Enlace del botón")],
            },
            {
                id: "case",
                label: "05 · Caso real",
                fields: [
                    t("kicker", "Antetítulo"),
                    t("title", "Título", { help: EM }),
                    ta("story", "Historia"),
                    img("after", "Foto después"),
                    img("before", "Foto antes (circular)"),
                    ...repeat(3, "d", "Dato", [t("label", "Etiqueta"), t("value", "Valor")]),
                ],
            },
            {
                id: "testimonials",
                label: "06 · Testimonios",
                fields: [
                    t("kicker", "Antetítulo"),
                    t("title", "Título", { help: EM }),
                    ta("note", "Nota"),
                    ...repeat(15, "q", "Testimonio", [
                        url("video", "Video vertical (.mp4)", true),
                        img("poster", "Póster o foto 9:16"),
                        t("quote", "Cita"),
                        t("author", "Autor · país · tratamiento"),
                    ]),
                    ta("legal", "Aviso legal"),
                ],
            },
            {
                id: "team",
                label: "07 · Equipo médico",
                fields: [
                    t("kicker", "Antetítulo"),
                    t("title", "Título", { help: EM }),
                    ta("text", "Filosofía"),
                    t("profile", "Perfil del equipo"),
                    ta("credentials", "Formación y respaldo (una línea por renglón)"),
                    img("image", "Foto"),
                    t("badgeNumber", "Sello · número"),
                    t("badgeText", "Sello · texto"),
                ],
            },
            {
                id: "members",
                label: "08 · Integrantes del equipo",
                fields: [
                    t("kicker", "Antetítulo"),
                    t("title", "Título", { help: EM }),
                    ...repeat(4, "m", "Integrante", [
                        t("role", "Cargo o especialidad"),
                        t("name", "Nombre (opcional)"),
                        ta("text", "Descripción"),
                        img("photo", "Foto (opcional)"),
                    ]),
                ],
            },
            {
                id: "concierge",
                label: "09 · Concierge",
                fields: [
                    t("kicker", "Antetítulo"),
                    t("title", "Título", { help: EM }),
                    ta("text", "Bajada"),
                    ...repeat(6, "s", "Paso", [t("title", "Título"), t("text", "Texto")]),
                    t("cta", "Botón"),
                    url("ctaUrl", "Enlace del botón"),
                ],
            },
            {
                id: "assessment",
                label: "10 · Valoración virtual",
                fields: [
                    t("kicker", "Antetítulo"),
                    t("title", "Título", { help: EM }),
                    t("uploadLabel", "Fotos · etiqueta"),
                    t("uploadTitle", "Fotos · título"),
                    ta("uploadText", "Fotos · texto"),
                    t("uploadCta", "Fotos · botón de WhatsApp"),
                    t("uploadMsg", "Fotos · mensaje prellenado de WhatsApp"),
                    t("callLabel", "Videollamada · etiqueta"),
                    t("callBadge", "Videollamada · distintivo"),
                    t("callTitle", "Videollamada · título"),
                    ta("callText", "Videollamada · texto"),
                    t("callCta", "Videollamada · botón"),
                    t("callMsg", "Videollamada · mensaje prellenado de WhatsApp"),
                    ta("deposit", "Nota sobre el anticipo"),
                ],
            },
            {
                id: "guarantee",
                label: "11 · Garantía",
                fields: [
                    t("kicker", "Antetítulo"),
                    t("title", "Título", { help: EM }),
                    ta("terms", "Condiciones"),
                    t("cta", "Botón"),
                    url("ctaUrl", "Enlace del botón"),
                    ...repeat(3, "g", "Dato", [t("value", "Valor"), t("detail", "Detalle")]),
                ],
            },
            {
                id: "closing",
                label: "12 · Cierre",
                fields: [t("title", "Título", { help: EM }), t("cta1", "Botón principal"), t("cta2", "Botón quiz")],
            },
            seo,
        ],
    },
];

PAGES.push({
    id: "diagnostico",
    label: "Diagnóstico digital (quiz)",
    path: { es: "/es/diagnostico-digital", en: "/en/digital-assessment" },
    sections: [
        {
            id: "intro",
            label: "Introducción",
            fields: [
                t("kicker", "Antetítulo"),
                t("title", "Título", { help: EM }),
                ta("text", "Bajada"),
                ...repeat(3, "p", "Punto", [t("title", "Título"), t("text", "Detalle")]),
                ta("notice", "Aviso"),
            ],
        },
        {
            id: "closing",
            label: "Cierre",
            fields: [t("concept", "Frase de marca"), t("title", "Título", { help: EM }), t("cta", "Botón principal"), t("wa", "Botón de WhatsApp"), t("waMsg", "Mensaje prellenado de WhatsApp")],
        },
        seo,
    ],
});

PAGES.push({
    id: "concierge",
    label: "Concierge, agenda y fotos",
    path: { es: "/es#agendar", en: "/en#agendar" },
    sections: [
        {
            id: "panel",
            label: "Panel del concierge",
            fields: [
                t("button", "Texto del botón flotante (para lectores de pantalla)"),
                t("kicker", "Antetítulo"),
                t("title", "Título"),
                t("status", "Estado (ej. Disponible ahora)"),
                t("waTitle", "WhatsApp · título"),
                t("waText", "WhatsApp · texto"),
                t("waMsg", "WhatsApp · mensaje prellenado"),
                t("callTitle", "Llamar · título"),
                t("callHours", "Llamar · horario"),
                t("bookTitle", "Agendar · título"),
                t("bookText", "Agendar · texto"),
                t("note", "Nota al pie"),
            ],
        },
        {
            id: "booking",
            label: "Textos de la agenda",
            fields: [
                t("virtualTitle", "Videollamada · título"),
                t("virtualText", "Videollamada · texto"),
                t("clinicTitle", "Valoración en clínica · título"),
                t("clinicText", "Valoración en clínica · texto"),
                ta("confirmText", "Mensaje al reservar"),
                t("confirmWa", "Mensaje de WhatsApp para confirmar (usa {nombre}, {tipo}, {fecha})"),
            ],
        },
        {
            id: "rules",
            label: "Reglas de la agenda (igual en ambos idiomas)",
            fields: [
                t("days", "Días de atención (1=lunes … 7=domingo, separados por coma)", { shared: true }),
                t("start", "Hora de inicio (HH:MM, hora de Cancún)", { shared: true }),
                t("end", "Hora de cierre (HH:MM)", { shared: true }),
                t("virtualMin", "Duración videollamada (minutos)", { shared: true }),
                t("clinicMin", "Duración valoración en clínica (minutos)", { shared: true }),
                t("noticeMin", "Anticipación mínima (minutos)", { shared: true }),
                t("windowDays", "Días visibles hacia adelante", { shared: true }),
                ta("blocked", "Fechas bloqueadas (AAAA-MM-DD, una por renglón)", { shared: true }),
                t("depositUsd", "Anticipo en línea (USD). Vacío o 0 = sin cobro en línea", { shared: true }),
                t("depositFor", "¿A qué citas se cobra? (clinica o ambas)", { shared: true }),
            ],
        },
        {
            id: "photos",
            label: "Formulario de fotos",
            fields: [
                t("title", "Título de las fotos"),
                ta("text", "Instrucciones"),
                ...repeat(5, "f", "Foto", [t("label", "Nombre"), t("tip", "Indicación"), img("example", "Ejemplo")]),
                t("submit", "Botón de enviar"),
                ta("success", "Mensaje al enviar"),
            ],
        },
    ],
});

/* Treatment landing pages: one schema, seven pages (content in landings.ts). */
for (const l of LANDINGS) {
    PAGES.push({
        id: `tratamiento-${l.id}`,
        label: `Tratamiento · ${l.label}`,
        path: { es: `/es/tratamientos/${l.slug.es}`, en: `/en/treatments/${l.slug.en}` },
        sections: [
            { id: "hero", label: "Portada", fields: [t("kicker", "Antetítulo"), t("title", "Título", { help: EM }), ta("subtitle", "Bajada")] },
            { id: "facts", label: "Lo esencial", fields: repeat(4, "k", "Dato", [t("label", "Etiqueta"), t("value", "Valor")]) },
            { id: "media", label: "Imágenes", fields: [img("img1", "Imagen principal"), img("img2", "Imagen secundaria (opcional)")] },
            { id: "intro", label: "Descripción", fields: [t("title", "Título", { help: EM }), ta("text", "Texto")] },
            { id: "fit", label: "¿Es para ti?", fields: [t("title", "Título", { help: EM }), ...repeat(4, "f", "Tarjeta", [t("title", "Título"), t("text", "Texto")]), ta("note", "Nota")] },
            { id: "process", label: "Tu proceso", fields: [t("title", "Título", { help: EM }), ...repeat(5, "s", "Paso", [t("title", "Título"), t("text", "Texto")])] },
            { id: "expert", label: "Materiales y equipo", fields: [t("title", "Título", { help: EM }), ta("text", "Texto")] },
            { id: "price", label: "Inversión", fields: [t("amount", "Monto o «Plan personalizado»"), ta("note", "Nota")] },
            { id: "stories", label: "Testimonios", fields: [t("videos", "Videos a mostrar (números de los testimonios del Inicio, ej. 2,5,10)", { shared: true })] },
            { id: "faq", label: "Preguntas frecuentes", fields: [t("title", "Título", { help: EM }), ...repeat(5, "q", "Pregunta", [t("q", "Pregunta"), ta("a", "Respuesta")])] },
            { id: "closing", label: "Cierre", fields: [t("title", "Título", { help: EM }), t("waMsg", "Mensaje prellenado de WhatsApp")] },
            seo,
        ],
    });
}

PAGES.push({
    id: "tratamientos",
    label: "Tratamientos (página general)",
    path: { es: "/es/tratamientos", en: "/en/treatments" },
    sections: [
        { id: "hero", label: "Portada", fields: [t("kicker", "Antetítulo"), t("title", "Título", { help: EM }), ta("subtitle", "Bajada")] },
        { id: "groups", label: "Grupos", fields: [t("g1_kicker", "Grupo 1 · antetítulo"), t("g1_title", "Grupo 1 · título", { help: EM }), t("g2_kicker", "Grupo 2 · antetítulo"), t("g2_title", "Grupo 2 · título", { help: EM })] },
        { id: "cards", label: "Tarjetas", fields: repeat(7, "c", "Tratamiento", [t("meta", "Dato corto (ej. 1 cita · Conservadora)"), t("text", "Texto")]) },
        { id: "steps", label: "Cómo decidimos contigo", fields: [t("kicker", "Antetítulo"), t("title", "Título", { help: EM }), ...repeat(3, "s", "Paso", [t("title", "Título"), t("text", "Texto")])] },
        seo,
    ],
});

export function getPageDef(id: string): PageDef | undefined {
    return PAGES.find((p) => p.id === id);
}

/** Content as stored: shared values plus one block per language. */
export type SectionValues = Record<string, string>;
export type PageValues = Record<string, SectionValues>;
export interface PageDoc {
    shared: PageValues;
    es: PageValues;
    en: PageValues;
    updatedAt?: string;
    updatedBy?: string;
}

/** Flattened content for one language, ready to render. */
export type PageContent = Record<string, SectionValues>;
