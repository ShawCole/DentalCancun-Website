import { NextRequest, NextResponse } from "next/server";
import { panelUser } from "@/lib/server/auth";
import { rateLimited } from "@/lib/server/mail";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Translation assistant for the panel: returns an ENGLISH DRAFT of Spanish
 * texts, written in natural US English and following the brand rules.
 * Env: ANTHROPIC_API_KEY (optional ANTHROPIC_MODEL). Panel users only.
 */
const SYSTEM = `You translate website copy for Dental Solutions Puerto Cancún, a high-end cosmetic and restorative dental clinic in Cancun, Mexico, for American patients.
Write natural, conversational US English, the way a warm, expert American dental practice would write. Never translate word for word: rewrite idioms, sentence order and tone so it reads as if it were written in English first.
Brand voice: clear, confident, warm, elegant, precise, calm. Not salesy, not alarmist, not overly technical.
Never use or introduce: "perfect smile", "guaranteed results", "painless" or "pain-free", "lifetime", "best clinic", "number one", "risk-free". Never add prices, guarantees, statistics, credentials or names that are not in the source.
Keep placeholders such as [VALIDAR ...] or [PENDIENTE ...] exactly as they are. Keep Markdown, line breaks, *emphasis* markers and links; change /es/ links to /en/ only when the English path is obvious.
Use US spelling and formats (USD amounts as "USD 250" if the source does). Keep "Dental Solutions Puerto Cancún" as is.
Return ONLY a JSON object with the same keys as the input and the English text as values.`;

export async function POST(req: NextRequest) {
    const user = await panelUser(req.headers.get("authorization"), ["admin", "staff"]);
    if (!user) return NextResponse.json({ ok: false, error: "Sin permiso." }, { status: 401 });
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) return NextResponse.json({ ok: false, error: "La traducción con IA no está configurada." }, { status: 503 });
    if (rateLimited(`ai:${user.uid}`, 60)) return NextResponse.json({ ok: false, error: "Demasiadas traducciones en una hora. Intenta más tarde." }, { status: 429 });

    const body = await req.json().catch(() => ({}));
    const texts = body?.texts;
    if (!texts || typeof texts !== "object") return NextResponse.json({ ok: false, error: "Nada que traducir." }, { status: 400 });
    const clean: Record<string, string> = {};
    let size = 0;
    for (const [k, v] of Object.entries(texts)) {
        if (typeof v !== "string" || !/^[\w-]{1,60}$/.test(k)) continue;
        clean[k] = v.slice(0, 30000);
        size += clean[k].length;
    }
    if (!Object.keys(clean).length || size > 60000) return NextResponse.json({ ok: false, error: "El texto es demasiado largo para traducirlo de una vez." }, { status: 400 });

    try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
            body: JSON.stringify({
                model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
                max_tokens: 16000,
                system: SYSTEM,
                messages: [{ role: "user", content: `Context: ${String(body.context || "").slice(0, 400)}\n\nSpanish source (JSON):\n${JSON.stringify(clean)}` }],
            }),
        });
        const j = await res.json();
        if (!res.ok) {
            console.error("[ai] translate failed", j?.error);
            return NextResponse.json({ ok: false, error: "El servicio de IA no respondió. Intenta de nuevo." }, { status: 502 });
        }
        const text: string = (j.content || []).map((c: { type: string; text?: string }) => (c.type === "text" ? c.text : "")).join("");
        const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
        const out: Record<string, string> = {};
        for (const k of Object.keys(clean)) if (typeof json[k] === "string") out[k] = json[k];
        return NextResponse.json({ ok: true, texts: out });
    } catch (e) {
        console.error("[ai] translate error", e);
        return NextResponse.json({ ok: false, error: "No se pudo leer la traducción. Intenta de nuevo." }, { status: 502 });
    }
}
