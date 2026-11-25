import "server-only";

export const turnstileConfigured = () => Boolean(process.env.TURNSTILE_SECRET_KEY);

/** True when the token is valid, or when Turnstile is not set up yet. */
export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) return true;
    if (!token) return false;
    try {
        const body = new URLSearchParams({ secret, response: token });
        if (ip && ip !== "local") body.set("remoteip", ip);
        const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body, cache: "no-store" });
        return Boolean((await res.json())?.success);
    } catch {
        return false;
    }
}
