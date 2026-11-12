import "server-only";
import nodemailer from "nodemailer";

/**
 * E-mail through SMTP (for Gmail: smtp.gmail.com, port 465 and an app password).
 * Env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CLINIC_EMAIL (where notices arrive).
 */
export const mailConfigured = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CLINIC_EMAIL);

export interface Mail {
    to: string;
    subject: string;
    text: string;
    replyTo?: string;
    attachments?: { filename: string; content: Buffer; contentType: string }[];
}

export async function sendMail(m: Mail): Promise<boolean> {
    if (!mailConfigured()) {
        console.warn("[mail] SMTP not configured; skipped:", m.subject);
        return false;
    }
    const port = Number(process.env.SMTP_PORT || 465);
    const t = nodemailer.createTransport({ host: process.env.SMTP_HOST, port, secure: port === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
    await t.sendMail({ from: `Dental Solutions Puerto Cancún <${process.env.SMTP_USER}>`, ...m });
    return true;
}

export const clinicEmail = () => process.env.CLINIC_EMAIL || "";

/** Very small per-instance rate limit: max N requests per IP per hour. */
const hits = new Map<string, number[]>();
export function rateLimited(ip: string, max = 6): boolean {
    const now = Date.now();
    const list = (hits.get(ip) || []).filter((t) => now - t < 3_600_000);
    list.push(now);
    hits.set(ip, list);
    return list.length > max;
}
