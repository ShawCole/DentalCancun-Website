import { brandIssues } from "@/lib/brand";
import { plainText } from "./markdown";
import type { Post } from "./types";

/**
 * On-page SEO review for a post, in the spirit of Rank Math / Yoast,
 * plus the brand rules. Each check is pass, warn or fail.
 */
export interface Check { ok: "pass" | "warn" | "fail"; text: string }

const norm = (s: string) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function seoChecks(p: Post): { score: number; checks: Check[] } {
    const kw = norm(p.keyword.trim());
    const title = p.seoTitle || p.title;
    const desc = p.seoDescription || p.excerpt;
    const text = plainText(p.body);
    const words = text ? text.split(/\s+/).length : 0;
    const first = norm(plainText(p.body.split(/\n{2,}/).find((b) => b.trim() && !b.trim().startsWith("#")) || ""));
    const h2 = (p.body.match(/^##\s+/gm) || []).length;
    const internal = (p.body.match(/\]\(\/(es|en)\//g) || []).length;
    const external = (p.body.match(/\]\(https?:\/\//g) || []).length;
    const imgs = [...p.body.matchAll(/!\[([^\]]*)\]/g)];
    const kwCount = kw ? (norm(text).match(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length : 0;
    const density = words ? (kwCount / words) * 100 : 0;
    const es = p.lang === "es";

    const c: Check[] = [];
    const add = (ok: Check["ok"], text: string) => c.push({ ok, text });
    if (!kw) add("fail", es ? "Define la palabra clave principal (lo que la gente busca en Google)." : "Define la palabra clave principal.");
    else {
        add(norm(title).includes(kw) ? "pass" : "fail", "La palabra clave aparece en el título SEO.");
        add(norm(desc).includes(kw) ? "pass" : "warn", "La palabra clave aparece en la descripción.");
        add(first.includes(kw) ? "pass" : "warn", "La palabra clave aparece en el primer párrafo.");
        add(norm(p.slug).includes(kw.replace(/\s+/g, "-")) || kw.split(/\s+/).every((w) => norm(p.slug).includes(w)) ? "pass" : "warn", "La dirección (slug) contiene la palabra clave.");
        add(density >= 0.5 && density <= 2.5 ? "pass" : "warn", `Densidad de la palabra clave: ${density.toFixed(1)} % (ideal 0.5 %–2.5 %).`);
    }
    add(title.length >= 35 && title.length <= 60 ? "pass" : "warn", `Título SEO de ${title.length} caracteres (ideal 35–60).`);
    add(desc.length >= 120 && desc.length <= 160 ? "pass" : desc.length ? "warn" : "fail", `Descripción de ${desc.length} caracteres (ideal 120–160).`);
    add(words >= 800 ? "pass" : words >= 500 ? "warn" : "fail", `${words} palabras (recomendado 800 o más para temas médicos).`);
    add(h2 >= 2 ? "pass" : "warn", `${h2} subtítulos (##). Usa al menos 2 para ordenar el texto.`);
    add(internal >= 2 ? "pass" : internal === 1 ? "warn" : "fail", `${internal} enlaces internos a páginas del sitio (recomendado 2 o más: tratamiento y diagnóstico).`);
    add(external >= 1 ? "pass" : "warn", `${external} enlaces a fuentes externas confiables (ADA, FDI, artículos científicos).`);
    add(p.cover ? (p.coverAlt ? "pass" : "warn") : "warn", p.cover ? "Imagen de portada con texto alternativo." : "Agrega una imagen de portada.");
    if (imgs.length) add(imgs.every((m) => m[1].trim()) ? "pass" : "warn", "Todas las imágenes del texto tienen descripción.");
    add(p.excerpt.length >= 60 ? "pass" : "warn", "Resumen para el listado del blog (60 caracteres o más).");
    for (const b of brandIssues(`${p.title}\n${p.excerpt}\n${p.body}\n${p.seoTitle}\n${p.seoDescription}`)) add("fail", b.text);

    const pts = c.reduce((s, x) => s + (x.ok === "pass" ? 1 : x.ok === "warn" ? 0.5 : 0), 0);
    return { score: Math.round((pts / c.length) * 100), checks: c };
}
