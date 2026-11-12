import "server-only";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { docsUrl } from "@/lib/firestoreRest";

/** Verifies a Firebase ID token (only needs the project id) and reads the user's role. */
function verifier() {
    const name = "cms-verify";
    const app = getApps().find((a) => a.name === name) || initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID }, name);
    return getAuth(app);
}

export type Role = "admin" | "staff";
export interface PanelUser { uid: string; email: string; role: string }

export async function panelUser(authHeader: string | null, roles: Role[] = ["admin"]): Promise<PanelUser | null> {
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!token || !projectId) return null;
    try {
        const decoded = await verifier().verifyIdToken(token);
        // Read users/{uid} with the user's own token (Firestore rules apply).
        const res = await fetch(`${docsUrl(projectId)}/users/${decoded.uid}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
        const role = res.ok ? (await res.json())?.fields?.role?.stringValue || "" : "";
        if (!roles.includes(role as Role)) return null;
        return { uid: decoded.uid, email: decoded.email || decoded.uid, role };
    } catch {
        return null;
    }
}
