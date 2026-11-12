/** Firestore REST base. FIRESTORE_REST_URL lets local tests or the Firebase emulator stand in for Google. */
export function docsUrl(projectId: string) {
    const host = (process.env.FIRESTORE_REST_URL || "https://firestore.googleapis.com").replace(/\/+$/, "");
    return `${host}/v1/projects/${projectId}/databases/(default)/documents`;
}
