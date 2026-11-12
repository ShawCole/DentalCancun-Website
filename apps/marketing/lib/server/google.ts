import "server-only";
import { createSign } from "crypto";

/**
 * Google Calendar with a service account (no extra libraries).
 * Env: GOOGLE_SERVICE_ACCOUNT_JSON (the key file content, raw or base64) and GCAL_ID.
 * Share the clinic calendar with the service account e-mail: "Make changes to events".
 */
interface ServiceAccount { client_email: string; private_key: string }

function account(): ServiceAccount | null {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!raw) return null;
    try {
        const text = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
        const sa = JSON.parse(text) as ServiceAccount;
        // Keys pasted into some dashboards lose their real line breaks.
        sa.private_key = sa.private_key.replace(/\\n/g, "\n");
        return sa.client_email && sa.private_key ? sa : null;
    } catch {
        console.error("[gcal] GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON");
        return null;
    }
}

export const calendarConfigured = () => Boolean(account() && process.env.GCAL_ID);

const b64url = (b: Buffer | string) => Buffer.from(b).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

let cached: { token: string; exp: number } | null = null;

async function token(): Promise<string> {
    if (cached && cached.exp > Date.now() + 60_000) return cached.token;
    const sa = account();
    if (!sa) throw new Error("Google Calendar is not configured");
    const now = Math.floor(Date.now() / 1000);
    const head = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const claim = b64url(JSON.stringify({ iss: sa.client_email, scope: "https://www.googleapis.com/auth/calendar", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }));
    const signer = createSign("RSA-SHA256");
    signer.update(`${head}.${claim}`);
    const jwt = `${head}.${claim}.${b64url(signer.sign(sa.private_key))}`;
    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
        cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok) throw new Error(`Google token error: ${json.error_description || json.error}`);
    cached = { token: json.access_token, exp: Date.now() + json.expires_in * 1000 };
    return cached.token;
}

async function gcal(method: string, path: string, body?: unknown) {
    const res = await fetch(`https://www.googleapis.com/calendar/v3${path}`, {
        method,
        headers: { Authorization: `Bearer ${await token()}`, "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
    });
    const json = res.status === 204 ? {} : await res.json();
    if (!res.ok) throw new Error(`Google Calendar ${res.status}: ${json?.error?.message || "error"}`);
    return json;
}

/** Busy blocks [startMs, endMs] in the clinic calendar. */
export async function busyBlocks(from: Date, to: Date): Promise<[number, number][]> {
    const id = process.env.GCAL_ID!;
    const json = await gcal("POST", "/freeBusy", { timeMin: from.toISOString(), timeMax: to.toISOString(), items: [{ id }] });
    const cal = json.calendars?.[id];
    if (cal?.errors?.length) throw new Error(`Google Calendar: ${cal.errors[0].reason}`);
    return (cal?.busy || []).map((b: { start: string; end: string }) => [Date.parse(b.start), Date.parse(b.end)]);
}

export async function createEvent(e: { summary: string; description: string; start: Date; end: Date; colorId?: string }) {
    const id = encodeURIComponent(process.env.GCAL_ID!);
    return gcal("POST", `/calendars/${id}/events`, {
        summary: e.summary,
        description: e.description,
        start: { dateTime: e.start.toISOString(), timeZone: "America/Cancun" },
        end: { dateTime: e.end.toISOString(), timeZone: "America/Cancun" },
        colorId: e.colorId,
        visibility: "private",
    });
}

export async function deleteEvent(eventId: string) {
    const id = encodeURIComponent(process.env.GCAL_ID!);
    return gcal("DELETE", `/calendars/${id}/events/${encodeURIComponent(eventId)}`);
}

export async function patchEvent(eventId: string, e: { summary?: string; description?: string; start?: Date; end?: Date; colorId?: string }) {
    const id = encodeURIComponent(process.env.GCAL_ID!);
    const body: Record<string, unknown> = {};
    if (e.summary) body.summary = e.summary;
    if (e.description) body.description = e.description;
    if (e.colorId) body.colorId = e.colorId;
    if (e.start) body.start = { dateTime: e.start.toISOString(), timeZone: "America/Cancun" };
    if (e.end) body.end = { dateTime: e.end.toISOString(), timeZone: "America/Cancun" };
    return gcal("PATCH", `/calendars/${id}/events/${encodeURIComponent(eventId)}`, body);
}
