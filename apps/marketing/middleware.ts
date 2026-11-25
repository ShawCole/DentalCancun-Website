import { NextRequest, NextResponse } from "next/server";
import type { Redirect } from "@/lib/settings";
import { docsUrl } from "@/lib/firestoreRest";

/**
 * Redirects managed from the admin panel (Redirecciones). The list is read
 * from Firestore and kept in memory for a minute, so a change shows up
 * within about a minute without a new deploy.
 */
let cache: { at: number; map: Map<string, Redirect> } | null = null;

async function redirects(): Promise<Map<string, Redirect>> {
    if (cache && Date.now() - cache.at < 60_000) return cache.map;
    const map = new Map<string, Redirect>();
    const pid = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (pid) {
        try {
            const res = await fetch(`${docsUrl(pid)}/cms_settings/redirects`, { cache: "no-store" });
            if (res.ok) {
                const raw = (await res.json())?.fields?.data?.stringValue;
                for (const r of (raw ? JSON.parse(raw).items : []) as Redirect[]) if (r?.from && r?.to) map.set(r.from.toLowerCase(), r);
            }
        } catch {
            /* keep serving the site if Firestore is unreachable */
        }
    }
    cache = { at: Date.now(), map };
    return map;
}

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname.replace(/\/+$/, "").toLowerCase() || "/";
    const hit = (await redirects()).get(path);
    if (!hit) return NextResponse.next();
    const target = /^https?:\/\//i.test(hit.to) ? new URL(hit.to) : new URL(hit.to, req.url);
    if (!/^https?:\/\//i.test(hit.to)) for (const [k, v] of req.nextUrl.searchParams) if (!target.searchParams.has(k)) target.searchParams.set(k, v);
    if (target.pathname.toLowerCase().replace(/\/+$/, "") === path && target.host === req.nextUrl.host) return NextResponse.next();
    return NextResponse.redirect(target, hit.code === 302 ? 302 : 301);
}

export const config = {
    // Never touch the admin, the API, Next.js assets or files with an extension.
    matcher: ["/((?!api|admin|_next|.*\\.[a-zA-Z0-9]{2,5}$).*)"],
};
