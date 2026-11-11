/**
 * CMS schema: describes every editable page, its sections and fields.
 * The admin panel builds its forms from this file, and the site reads
 * content with the same ids. To make something editable, add it here.
 */

export type Lang = "es" | "en";
export const LANGS: Lang[] = ["es", "en"];
export const LANG_LABEL: Record<Lang, string> = { es: "Español", en: "English" };

export type FieldType = "text" | "textarea" | "image" | "url";

export interface FieldDef {
    id: string;
    label: string;
    type: FieldType;
    help?: string;
    /** Same value for both languages (for example an image or a link). */
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

const seo: SectionDef = {
    id: "seo",
    label: "SEO (Google)",
    fields: [
        { id: "title", label: "Título para Google", type: "text", max: 60 },
        { id: "description", label: "Descripción para Google", type: "textarea", max: 160 },
    ],
};

export const PAGES: PageDef[] = [
    {
        id: "site",
        label: "Datos generales del sitio",
        path: { es: "/es", en: "/" },
        sections: [
            {
                id: "contact",
                label: "Contacto",
                fields: [
                    { id: "whatsapp", label: "WhatsApp (solo números, con lada)", type: "text", shared: true },
                    { id: "phone", label: "Teléfono visible", type: "text", shared: true },
                    { id: "email", label: "Correo de contacto", type: "text", shared: true },
                    { id: "address", label: "Dirección", type: "textarea" },
                    { id: "hours", label: "Horario", type: "text" },
                ],
            },
            {
                id: "brand",
                label: "Marca",
                fields: [
                    { id: "logo", label: "Logo", type: "image", shared: true },
                    { id: "tagline", label: "Frase de marca", type: "text" },
                ],
            },
            {
                id: "social",
                label: "Redes sociales",
                fields: [
                    { id: "instagram", label: "Instagram (enlace)", type: "url", shared: true },
                    { id: "facebook", label: "Facebook (enlace)", type: "url", shared: true },
                    { id: "tiktok", label: "TikTok (enlace)", type: "url", shared: true },
                ],
            },
        ],
    },
    {
        id: "home",
        label: "Inicio",
        path: { es: "/es", en: "/" },
        sections: [
            {
                id: "hero",
                label: "Portada",
                fields: [
                    { id: "title", label: "Título", type: "text" },
                    { id: "highlight", label: "Título (parte destacada)", type: "text" },
                    { id: "subtitle", label: "Subtítulo", type: "textarea" },
                    { id: "cta", label: "Texto del botón", type: "text" },
                    { id: "ctaUrl", label: "Enlace del botón", type: "url" },
                    { id: "poster", label: "Imagen de fondo", type: "image", shared: true },
                    { id: "video", label: "Video de fondo (enlace .mp4, opcional)", type: "url", shared: true },
                ],
            },
            seo,
        ],
    },
];

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
