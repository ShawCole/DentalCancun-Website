/**
 * Brand guard used by the page builder and the blog: phrases the clinic
 * never promises, and placeholders that must not reach the public.
 */
const BANNED: { re: RegExp; label: string }[] = [
    { re: /sonrisa perfecta|perfect smile/i, label: "«sonrisa perfecta / perfect smile»" },
    { re: /resultados? garantizad|guaranteed results?|results? guaranteed/i, label: "«resultados garantizados»" },
    { re: /sin dolor|painless|pain[- ]free/i, label: "«sin dolor / painless»" },
    { re: /para toda la vida|lasts? (a )?lifetime|for life\b/i, label: "«para toda la vida»" },
    { re: /la mejor cl[ií]nica|best (dental )?clinic/i, label: "«la mejor clínica»" },
    { re: /n[uú]mero uno|number one|#1\b/i, label: "«número uno»" },
    { re: /sin riesgos?|risk[- ]free|no risks?\b/i, label: "«sin riesgos»" },
    { re: /cambio inmediato garantizado/i, label: "«cambio inmediato garantizado»" },
];

export interface BrandIssue { kind: "prohibida" | "pendiente"; text: string }

export function brandIssues(text: string): BrandIssue[] {
    const out: BrandIssue[] = [];
    for (const b of BANNED) if (b.re.test(text)) out.push({ kind: "prohibida", text: `Frase que la marca no usa: ${b.label}` });
    const pend = text.match(/\[(VALIDAR|PENDIENTE)[^\]]*\]/gi);
    if (pend) out.push({ kind: "pendiente", text: `Hay ${pend.length} dato(s) por validar: ${[...new Set(pend)].slice(0, 3).join(", ")}` });
    return out;
}

/** Collects every string inside a JSON value (page builder data, blog post). */
export function allText(v: unknown): string {
    if (typeof v === "string") return v;
    if (Array.isArray(v)) return v.map(allText).join("\n");
    if (v && typeof v === "object") return Object.values(v).map(allText).join("\n");
    return "";
}
