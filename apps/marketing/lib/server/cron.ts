import "server-only";
import { NextRequest } from "next/server";

/** Scheduled jobs (Netlify scheduled functions) send: Authorization: Bearer CRON_SECRET. */
export function cronAllowed(req: NextRequest) {
    const s = process.env.CRON_SECRET;
    return Boolean(s) && req.headers.get("authorization") === `Bearer ${s}`;
}
