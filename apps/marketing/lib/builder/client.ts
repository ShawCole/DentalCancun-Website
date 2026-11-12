"use client";

import { addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { currentEmail, loadSetting, refreshSite, requireDb, saveSetting } from "@/lib/settings/client";
import { settingsTag } from "@/lib/settings";
import { BUILDER_DRAFTS, BUILDER_PUBLIC, builderId, builderTag } from "./store";
import { templateData } from "./templates";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PuckData = any;
export interface DraftDoc { id: string; lang: "es" | "en"; slug: string; title: string; data: PuckData; updatedAt?: string; updatedBy?: string; publishedAt?: string }

export async function loadDraft(id: string): Promise<DraftDoc | null> {
    const snap = await getDoc(doc(requireDb(), BUILDER_DRAFTS, id));
    if (!snap.exists()) return null;
    const d = snap.data();
    return { id, lang: d.lang, slug: d.slug, title: d.title, data: JSON.parse(d.data || "{}"), updatedAt: d.updatedAtIso, updatedBy: d.updatedBy, publishedAt: d.publishedAt };
}

export async function createPage(lang: "es" | "en", slug: string, title: string, template: string) {
    const id = builderId(lang, slug);
    const exists = await getDoc(doc(requireDb(), BUILDER_DRAFTS, id));
    if (exists.exists()) throw new Error("Ya existe una página con esa dirección en ese idioma.");
    await saveDraft({ id, lang, slug, title, data: templateData(template, lang, title) });
    const idx = await loadSetting("builder");
    await saveSetting("builder", { pages: [...idx.pages.filter((p) => p.id !== id), { id, lang, slug, title, published: false }] }, false);
    return id;
}

export async function saveDraft(d: DraftDoc) {
    const by = currentEmail();
    await setDoc(doc(requireDb(), BUILDER_DRAFTS, d.id), {
        lang: d.lang,
        slug: d.slug,
        title: d.title,
        data: JSON.stringify(d.data),
        updatedAt: serverTimestamp(),
        updatedAtIso: new Date().toISOString(),
        updatedBy: by,
        ...(d.publishedAt ? { publishedAt: d.publishedAt } : {}),
    });
}

export async function publishPage(d: DraftDoc) {
    const by = currentEmail();
    const publishedAt = new Date().toISOString();
    const data = JSON.stringify(d.data);
    await saveDraft({ ...d, publishedAt });
    await setDoc(doc(requireDb(), BUILDER_PUBLIC, d.id), { data, lang: d.lang, slug: d.slug, title: d.title, publishedAt, publishedBy: by });
    await addDoc(collection(requireDb(), "cms_history"), { kind: "builder", ref: d.id, data, updatedBy: by, createdAt: serverTimestamp() }).catch(() => undefined);
    const idx = await loadSetting("builder");
    await saveSetting("builder", { pages: [...idx.pages.filter((p) => p.id !== d.id), { id: d.id, lang: d.lang, slug: d.slug, title: d.title, published: true }] }, false);
    await refreshSite([builderTag(d.id), settingsTag("builder")]);
    return publishedAt;
}

export async function unpublishPage(id: string) {
    await deleteDoc(doc(requireDb(), BUILDER_PUBLIC, id));
    const idx = await loadSetting("builder");
    await saveSetting("builder", { pages: idx.pages.map((p) => (p.id === id ? { ...p, published: false } : p)) }, false);
    await refreshSite([builderTag(id), settingsTag("builder")]);
}

export async function deletePage(id: string) {
    await deleteDoc(doc(requireDb(), BUILDER_PUBLIC, id)).catch(() => undefined);
    await deleteDoc(doc(requireDb(), BUILDER_DRAFTS, id));
    const idx = await loadSetting("builder");
    await saveSetting("builder", { pages: idx.pages.filter((p) => p.id !== id) }, false);
    await refreshSite([builderTag(id), settingsTag("builder")]);
}

export async function duplicatePage(src: DraftDoc, lang: "es" | "en", slug: string, title: string) {
    const id = builderId(lang, slug);
    const exists = await getDoc(doc(requireDb(), BUILDER_DRAFTS, id));
    if (exists.exists()) throw new Error("Ya existe una página con esa dirección en ese idioma.");
    const data = JSON.parse(JSON.stringify(src.data));
    if (data?.root?.props) data.root.props.title = title;
    await saveDraft({ id, lang, slug, title, data });
    const idx = await loadSetting("builder");
    await saveSetting("builder", { pages: [...idx.pages, { id, lang, slug, title, published: false }] }, false);
    return id;
}
