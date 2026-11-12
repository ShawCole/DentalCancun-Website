/** Where builder pages live (shared by the admin and the public site). */
export const BUILDER_PUBLIC = "builder_pages"; // published version, public read
export const BUILDER_DRAFTS = "builder_drafts"; // working copy, panel only
export const builderTag = (id: string) => `builder:${id}`;
export const builderId = (lang: "es" | "en", slug: string) => `${lang}--${slug}`;
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** First segments the new site already uses; a builder page can't take them. */
export const TAKEN = ["tratamientos", "treatments", "diagnostico-digital", "digital-assessment", "blog", "cita", "p", "admin", "api"];

export function slugify(s: string) {
    return s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);
}
