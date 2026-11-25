/**
 * Small, safe Markdown for blog posts: headings (## ###), paragraphs,
 * lists, quotes, **bold**, *italic*, links and images. Raw HTML is escaped.
 */
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const safeUrl = (u: string) => (/^(https?:\/\/|\/|#|mailto:|tel:)/i.test(u) ? u : "#");

function inline(s: string) {
    return esc(s)
        .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, src) => `<img src="${safeUrl(src)}" alt="${alt}" loading="lazy" />`)
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, href) => {
            const url = safeUrl(href);
            const ext = /^https?:/i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : "";
            return `<a href="${url}"${ext}>${t}</a>`;
        })
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
}

export const slugHeading = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export function markdownToHtml(md: string): string {
    const blocks = (md || "").replace(/\r/g, "").split(/\n{2,}/);
    return blocks
        .map((b) => b.trim())
        .filter(Boolean)
        .map((b) => {
            const h = b.match(/^(#{2,4})\s+(.+)$/);
            if (h && !b.includes("\n")) {
                const lvl = h[1].length;
                return `<h${lvl} id="${slugHeading(h[2])}">${inline(h[2])}</h${lvl}>`;
            }
            const lines = b.split("\n");
            if (lines.every((l) => /^[-*]\s+/.test(l))) return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>`;
            if (lines.every((l) => /^\d+[.)]\s+/.test(l))) return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\d+[.)]\s+/, ""))}</li>`).join("")}</ol>`;
            if (lines.every((l) => /^>\s?/.test(l))) return `<blockquote>${inline(lines.map((l) => l.replace(/^>\s?/, "")).join(" "))}</blockquote>`;
            if (/^!\[[^\]]*\]\([^)]+\)$/.test(b)) return `<figure>${inline(b)}</figure>`;
            return `<p>${lines.map(inline).join("<br/>")}</p>`;
        })
        .join("\n");
}

/** Headings for the table of contents. */
export function headings(md: string) {
    return [...(md || "").matchAll(/^##\s+(.+)$/gm)].map((m) => ({ text: m[1].replace(/[*_]/g, ""), id: slugHeading(m[1]) }));
}

export function plainText(md: string) {
    return (md || "").replace(/!\[[^\]]*\]\([^)]+\)/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[#>*_`-]/g, " ").replace(/\s+/g, " ").trim();
}
