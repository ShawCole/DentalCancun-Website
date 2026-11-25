import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, FieldValue, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

/**
 * Server access to Firebase (bookings, reminders, backups, statistics).
 * Env: FIREBASE_SERVICE_ACCOUNT_JSON (key file content, raw or base64).
 * Falls back to GOOGLE_SERVICE_ACCOUNT_JSON when the calendar account
 * belongs to the same Firebase project. Without it these features switch off quietly.
 */
function credentials() {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!raw) return null;
    try {
        const text = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
        const sa = JSON.parse(text);
        sa.private_key = String(sa.private_key || "").replace(/\\n/g, "\n");
        if (!sa.client_email || !sa.private_key) return null;
        if (sa.project_id && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && sa.project_id !== process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return null;
        return sa;
    } catch {
        return null;
    }
}

let app: App | null | undefined;
function adminApp(): App | null {
    if (app !== undefined) return app;
    const sa = credentials();
    if (!sa) return (app = null);
    const name = "dsc-server";
    app =
        getApps().find((a) => a.name === name) ||
        initializeApp(
            {
                credential: cert({ projectId: sa.project_id, clientEmail: sa.client_email, privateKey: sa.private_key }),
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || sa.project_id,
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            },
            name,
        );
    return app;
}

export const adminConfigured = () => Boolean(adminApp());
export function adminDb(): Firestore | null {
    const a = adminApp();
    return a ? getFirestore(a) : null;
}
export function adminBucket() {
    const a = adminApp();
    return a && process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? getStorage(a).bucket() : null;
}
export { FieldValue };
