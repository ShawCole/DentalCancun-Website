import { NextResponse } from "next/server";
import { calendarConfigured } from "@/lib/server/google";
import { adminConfigured } from "@/lib/server/firebaseAdmin";
import { mailConfigured } from "@/lib/server/mail";
import { stripeConfigured } from "@/lib/server/stripe";
import { turnstileConfigured } from "@/lib/server/turnstile";
import { docsUrl } from "@/lib/firestoreRest";

export const dynamic = "force-dynamic";

/**
 * Health check for uptime monitors (UptimeRobot, Better Stack): returns 200
 * when the site and its content database answer. Shows only on/off flags, never secrets.
 */
export async function GET() {
    const pid = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    let cms = false;
    if (pid) {
        try {
            const r = await fetch(`${docsUrl(pid)}/cms_pages/site`, { cache: "no-store", signal: AbortSignal.timeout(5000) });
            cms = r.ok || r.status === 404;
        } catch {}
    }
    const checks = {
        contenido: cms,
        firebaseServidor: adminConfigured(),
        calendario: calendarConfigured(),
        correo: mailConfigured(),
        antispam: turnstileConfigured(),
        pagos: stripeConfigured(),
        tareasProgramadas: Boolean(process.env.CRON_SECRET),
        traduccionIA: Boolean(process.env.ANTHROPIC_API_KEY),
    };
    return NextResponse.json({ ok: cms, time: new Date().toISOString(), checks }, { status: cms ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
