import { NextRequest, NextResponse } from "next/server";
import { adminDb, FieldValue } from "@/lib/server/firebaseAdmin";
import { rateLimited } from "@/lib/server/mail";

export const dynamic = "force-dynamic";

/**
 * Anonymous daily counters for the dashboard (only sent after the visitor
 * accepts analytics cookies). No IP, cookie id or personal data is stored.
 */
const EVENTS = ["view", "quiz_start", "quiz_done", "book", "photos", "whatsapp"];

function group(path: string) {
    const p = path.toLowerCase();
    if (/^\/(es|en)\/?$/.test(p)) return "inicio";
    if (p.includes("diagnostico") || p.includes("assessment")) return "diagnostico";
    if (/\/(tratamientos|treatments)\/[^/]+/.test(p)) return "tratamiento_" + p.split("/").pop()!.replace(/[^a-z0-9-]/g, "").slice(0, 40);
    if (p.includes("/blog")) return "blog";
    return "otras";
}

export async function POST(req: NextRequest) {
    const ip = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
    if (rateLimited(`track:${ip}`, 300)) return new NextResponse(null, { status: 204 });
    const db = adminDb();
    const b = await req.json().catch(() => ({}));
    if (!db || !EVENTS.includes(b.e)) return new NextResponse(null, { status: 204 });
    const lang = b.l === "en" ? "en" : "es";
    const day = new Date(Date.now() - 5 * 3600_000).toISOString().slice(0, 10);
    const data: Record<string, unknown> = { day, [`${b.e}.${lang}`]: FieldValue.increment(1) };
    if (b.e === "view") data[`pages.${group(String(b.p || ""))}`] = FieldValue.increment(1);
    await db.collection("stats").doc(day).set(data, { merge: true }).catch(() => undefined);
    return new NextResponse(null, { status: 204 });
}
