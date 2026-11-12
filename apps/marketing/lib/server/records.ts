import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { adminDb, FieldValue } from "./firebaseAdmin";
import { personKey } from "@/lib/crm";

/**
 * Patient records written by the server (bookings and photo submissions).
 * The CRM in the admin panel groups everything by WhatsApp or e-mail.
 * Photos are never stored: they only travel by e-mail to the clinic.
 */
export type Tipo = "virtual" | "clinica";
export type CitaEstado = "por confirmar" | "confirmada" | "reprogramada" | "cancelada" | "asistió" | "no asistió";

export interface Appointment {
    id: string;
    tipo: Tipo;
    nombre: string;
    correo: string;
    whatsapp: string;
    pais: string;
    idioma: "es" | "en";
    notas: string;
    start: number;
    end: number;
    eventId?: string;
    estado: CitaEstado;
    reminderSent?: boolean;
    deposit?: { usd: number; status: "pendiente" | "pagado"; sessionId?: string; paidAt?: number };
    key: string;
}

/** Same person across the quiz, photos and bookings: last 10 digits of WhatsApp, else e-mail. */
export { personKey };

function secret() {
    return process.env.APPOINTMENT_SECRET || process.env.CRON_SECRET || "";
}
export const manageConfigured = () => Boolean(secret()) && Boolean(adminDb());

/** Signed token for the patient's "manage my appointment" link. */
export function manageToken(id: string) {
    return createHmac("sha256", secret()).update(`cita:${id}`).digest("hex").slice(0, 32);
}
export function validToken(id: string, token: string) {
    if (!secret() || !token) return false;
    const a = Buffer.from(manageToken(id));
    const b = Buffer.from(token);
    return a.length === b.length && timingSafeEqual(a, b);
}

export function siteUrl() {
    return (process.env.SITE_URL || process.env.URL || "http://localhost:3005").replace(/\/+$/, "");
}
export function manageLink(id: string, lang: "es" | "en") {
    return `${siteUrl()}/${lang}/cita?id=${id}&t=${manageToken(id)}`;
}

export async function saveAppointment(a: Omit<Appointment, "id">): Promise<string | null> {
    const db = adminDb();
    if (!db) return null;
    const ref = await db.collection("appointments").add({ ...a, createdAt: FieldValue.serverTimestamp() });
    return ref.id;
}

export async function getAppointment(id: string): Promise<Appointment | null> {
    const db = adminDb();
    if (!db || !/^[A-Za-z0-9]{10,40}$/.test(id)) return null;
    const snap = await db.collection("appointments").doc(id).get();
    return snap.exists ? ({ id: snap.id, ...(snap.data() as Omit<Appointment, "id">) } as Appointment) : null;
}

export async function updateAppointment(id: string, data: Record<string, unknown>) {
    const db = adminDb();
    if (!db) return;
    await db.collection("appointments").doc(id).set({ ...data, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}

export async function savePhotoSubmission(p: { nombre: string; correo: string; whatsapp: string; pais: string; necesidad: string; idioma: string; fotos: number }) {
    const db = adminDb();
    if (!db) return;
    await db.collection("photo_submissions").add({ ...p, key: personKey(p.whatsapp, p.correo), createdAt: FieldValue.serverTimestamp() });
}
