"use client";

import { auth } from "@/lib/firebase";

/**
 * Asks the server for an English draft of Spanish texts (natural US English,
 * brand rules applied). Always a draft: the person reviews it before saving.
 */
export async function translateDraft(texts: Record<string, string>, context: string): Promise<Record<string, string>> {
    const u = auth()?.currentUser;
    if (!u) throw new Error("Tu sesión expiró. Vuelve a iniciar sesión.");
    const entries = Object.entries(texts).filter(([, v]) => v && v.trim());
    if (!entries.length) return {};
    const res = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${await u.getIdToken()}` },
        body: JSON.stringify({ texts: Object.fromEntries(entries), context }),
    });
    const j = await res.json().catch(() => ({}));
    if (res.status === 503) throw new Error("La traducción con IA aún no está activada (falta ANTHROPIC_API_KEY en Netlify).");
    if (!res.ok || !j.ok) throw new Error(j.error || "No se pudo generar la traducción.");
    return j.texts as Record<string, string>;
}
