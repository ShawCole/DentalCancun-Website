"use client";

import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { SETTING_DEFAULTS, SETTINGS_COLLECTION, settingsTag, type SettingId, type Settings } from "./index";

export function requireDb() {
    const d = db();
    if (!d) throw new Error("Firebase no está configurado.");
    return d;
}

export function currentEmail() {
    const u = auth()?.currentUser;
    if (!u) throw new Error("Tu sesión expiró. Vuelve a iniciar sesión.");
    return u.email || u.uid;
}

/** Asks the public site to refresh the given cache tags. */
export async function refreshSite(tags: string[]) {
    const u = auth()?.currentUser;
    if (!u) return;
    const res = await fetch("/api/cms/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${await u.getIdToken()}` },
        body: JSON.stringify({ tags }),
    });
    if (!res.ok) throw new Error("Se guardó, pero el sitio tardará unos minutos en mostrar el cambio.");
}

export async function loadSetting<K extends SettingId>(id: K): Promise<Settings[K]> {
    const snap = await getDoc(doc(requireDb(), SETTINGS_COLLECTION, id));
    const raw = snap.exists() ? (snap.data().data as string | undefined) : undefined;
    return raw ? { ...SETTING_DEFAULTS[id], ...JSON.parse(raw) } : SETTING_DEFAULTS[id];
}

export async function saveSetting<K extends SettingId>(id: K, value: Settings[K], refresh = true) {
    const by = currentEmail();
    const data = JSON.stringify(value);
    await setDoc(doc(requireDb(), SETTINGS_COLLECTION, id), { data, updatedAt: serverTimestamp(), updatedBy: by });
    await addDoc(collection(requireDb(), "cms_history"), { kind: "setting", ref: id, data, updatedBy: by, createdAt: serverTimestamp() }).catch(() => undefined);
    if (refresh) await refreshSite([settingsTag(id)]);
}
