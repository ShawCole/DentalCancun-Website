import "server-only";
import { SETTING_DEFAULTS, SETTINGS_COLLECTION, settingsTag, type SettingId, type Settings } from "./index";
import { docsUrl } from "@/lib/firestoreRest";

const base = (pid: string) => docsUrl(pid);

/** Reads a settings document through the public REST endpoint, cached by tag. */
export async function getSetting<K extends SettingId>(id: K): Promise<Settings[K]> {
    const pid = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!pid) return SETTING_DEFAULTS[id];
    try {
        const res = await fetch(`${base(pid)}/${SETTINGS_COLLECTION}/${id}`, { next: { tags: [settingsTag(id)], revalidate: 600 } });
        if (!res.ok) return SETTING_DEFAULTS[id];
        const raw = (await res.json())?.fields?.data?.stringValue;
        return raw ? { ...SETTING_DEFAULTS[id], ...JSON.parse(raw) } : SETTING_DEFAULTS[id];
    } catch {
        return SETTING_DEFAULTS[id];
    }
}

/** Reads any public document stored as a JSON string in the `data` field. */
export async function getJsonDoc<T>(collection: string, id: string, tag: string): Promise<T | null> {
    const pid = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!pid) return null;
    try {
        const res = await fetch(`${base(pid)}/${collection}/${encodeURIComponent(id)}`, { next: { tags: [tag], revalidate: 600 } });
        if (!res.ok) return null;
        const raw = (await res.json())?.fields?.data?.stringValue;
        return raw ? (JSON.parse(raw) as T) : null;
    } catch {
        return null;
    }
}
