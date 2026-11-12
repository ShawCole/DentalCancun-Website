/** Cookie consent shared by the banner, the pixels and our own statistics. */
export interface Consent { analytics: boolean; marketing: boolean; at: string }
export const CONSENT_COOKIE = "dsc_consent";
export const CONSENT_EVENT = "dsc-consent";
export const OPEN_CONSENT_EVENT = "dsc-open-consent";

export function readConsent(): Consent | null {
    if (typeof document === "undefined") return null;
    const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
    if (!m) return null;
    try {
        const c = JSON.parse(decodeURIComponent(m[1]));
        return { analytics: Boolean(c.analytics), marketing: Boolean(c.marketing), at: String(c.at || "") };
    } catch {
        return null;
    }
}

export function writeConsent(c: Omit<Consent, "at">) {
    const value: Consent = { ...c, at: new Date().toISOString() };
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=${60 * 60 * 24 * 180}; Path=/; SameSite=Lax${secure}`;
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
    return value;
}
