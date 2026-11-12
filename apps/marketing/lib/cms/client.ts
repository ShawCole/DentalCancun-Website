"use client";

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import getFirebaseApp, { auth, db } from "@/lib/firebase";
import { CMS_COLLECTION, defaultDoc, mergeDoc } from "./content";
import type { PageDoc } from "./schema";

export const MEDIA_COLLECTION = "cms_media";
export const HISTORY_COLLECTION = "cms_history";

export interface Version { id: string; data: string; updatedBy: string; createdAt?: { toDate(): Date } }

/** Last saved versions of a page, a setting or a builder page (newest first). */
export async function listVersions(kind: "page" | "setting" | "builder" | "blog", refId: string, max = 20): Promise<Version[]> {
    const q = query(collection(requireDb(), HISTORY_COLLECTION), where("kind", "==", kind), where("ref", "==", refId), orderBy("createdAt", "desc"), limit(max));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Version, "id">) }));
}

export interface MediaItem {
    id: string;
    url: string;
    path: string;
    name: string;
    alt: string;
    size: number;
    createdAt?: number;
}

function requireDb() {
    const d = db();
    if (!d) throw new Error("Firebase no está configurado.");
    return d;
}

export async function loadPage(pageId: string): Promise<PageDoc> {
    const snap = await getDoc(doc(requireDb(), CMS_COLLECTION, pageId));
    const raw = snap.exists() ? (snap.data().data as string | undefined) : undefined;
    return mergeDoc(defaultDoc(pageId), raw ? JSON.parse(raw) : null);
}

/** Saves the page and asks the site to refresh its cache. */
export async function savePage(pageId: string, value: PageDoc): Promise<void> {
    const user = auth()?.currentUser;
    if (!user) throw new Error("Tu sesión expiró. Vuelve a iniciar sesión.");
    const payload: PageDoc = {
        shared: value.shared,
        es: value.es,
        en: value.en,
        updatedAt: new Date().toISOString(),
        updatedBy: user.email || user.uid,
    };
    await setDoc(doc(requireDb(), CMS_COLLECTION, pageId), {
        data: JSON.stringify(payload),
        updatedAt: serverTimestamp(),
        updatedBy: payload.updatedBy,
    });
    // Version history: every save can be restored from the editor.
    await addDoc(collection(requireDb(), HISTORY_COLLECTION), {
        kind: "page",
        ref: pageId,
        data: JSON.stringify(payload),
        updatedBy: payload.updatedBy,
        createdAt: serverTimestamp(),
    }).catch((e) => console.warn("[cms] history not saved", e));
    const token = await user.getIdToken();
    const res = await fetch("/api/cms/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ pageId }),
    });
    if (!res.ok) throw new Error("Se guardó, pero el sitio tardará unos minutos en mostrar el cambio.");
}

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

export async function uploadImage(file: File, alt = ""): Promise<MediaItem> {
    if (!ALLOWED.includes(file.type)) throw new Error("Formato no permitido. Usa JPG, PNG, WebP, GIF o SVG.");
    if (file.size > MAX_BYTES) throw new Error("La imagen pesa más de 8 MB. Redúcela antes de subirla.");
    const app = getFirebaseApp();
    if (!app) throw new Error("Firebase no está configurado.");
    const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
    const path = `cms/${Date.now()}-${safe}`;
    const storageRef = ref(getStorage(app), path);
    await uploadBytes(storageRef, file, { contentType: file.type, cacheControl: "public, max-age=31536000" });
    const url = await getDownloadURL(storageRef);
    const item = { url, path, name: file.name, alt, size: file.size, createdAt: Date.now() };
    const created = await addDoc(collection(requireDb(), MEDIA_COLLECTION), item);
    return { id: created.id, ...item };
}

export async function listMedia(max = 200): Promise<MediaItem[]> {
    const q = query(collection(requireDb(), MEDIA_COLLECTION), orderBy("createdAt", "desc"), limit(max));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MediaItem, "id">) }));
}

export async function deleteMedia(item: MediaItem): Promise<void> {
    const app = getFirebaseApp();
    if (!app) throw new Error("Firebase no está configurado.");
    await deleteObject(ref(getStorage(app), item.path)).catch(() => undefined);
    await deleteDoc(doc(requireDb(), MEDIA_COLLECTION, item.id));
}
