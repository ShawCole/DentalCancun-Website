import { DEFAULTS } from "./defaults";
import type { Lang, PageContent, PageDoc, PageValues } from "./schema";
import { docsUrl } from "@/lib/firestoreRest";

/** Firestore collection where the admin panel saves each page. */
export const CMS_COLLECTION = "cms_pages";
export const cmsTag = (pageId: string) => `cms:${pageId}`;

const empty = (): PageDoc => ({ shared: {}, es: {}, en: {} });

function mergeValues(base: PageValues = {}, over: PageValues = {}): PageValues {
    const out: PageValues = { ...base };
    for (const [section, values] of Object.entries(over)) {
        out[section] = { ...(base[section] || {}), ...values };
    }
    return out;
}

/** Defaults with the saved content on top. */
export function mergeDoc(base: PageDoc, saved?: Partial<PageDoc> | null): PageDoc {
    if (!saved) return base;
    return {
        shared: mergeValues(base.shared, saved.shared),
        es: mergeValues(base.es, saved.es),
        en: mergeValues(base.en, saved.en),
        updatedAt: saved.updatedAt,
        updatedBy: saved.updatedBy,
    };
}

/** One language, with shared values (images, links) included. */
export function flatten(doc: PageDoc, lang: Lang): PageContent {
    return mergeValues(doc.shared, doc[lang]);
}

export function defaultDoc(pageId: string): PageDoc {
    return DEFAULTS[pageId] || empty();
}

/**
 * Reads a page from Firestore through its public REST endpoint
 * (read-only, allowed by firestore.rules) and caches it. The admin
 * panel refreshes the cache after every save. Falls back to defaults.
 */
export async function getPageDoc(pageId: string): Promise<PageDoc> {
    const base = defaultDoc(pageId);
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) return base;

    const url = `${docsUrl(projectId)}/${CMS_COLLECTION}/${encodeURIComponent(pageId)}`;
    try {
        const res = await fetch(url, { next: { tags: [cmsTag(pageId)], revalidate: 600 } });
        if (!res.ok) return base; // 404 = never edited yet
        const json = await res.json();
        const raw = json?.fields?.data?.stringValue;
        return raw ? mergeDoc(base, JSON.parse(raw)) : base;
    } catch (err) {
        console.error(`[cms] Could not read "${pageId}":`, err);
        return base;
    }
}

export async function getPageContent(pageId: string, lang: Lang): Promise<PageContent> {
    return flatten(await getPageDoc(pageId), lang);
}

/** Safe getter for templates: content.get("hero", "title"). */
export function reader(content: PageContent) {
    return (section: string, field: string, fallback = ""): string => content[section]?.[field] ?? fallback;
}
