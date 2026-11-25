import { Fragment, ReactNode } from "react";
import type { Lang } from "@/lib/cms/schema";

/** Renders "*word*" as italic emphasis. */
export function Rich({ text, as: Tag = "span", className = "" }: { text: string; as?: "h1" | "h2" | "h3" | "p" | "span"; className?: string }) {
    const parts = (text || "").split(/(\*[^*]+\*)/g);
    return (
        <Tag className={`rich ${className}`}>
            {parts.map((p, i) =>
                p.startsWith("*") && p.endsWith("*") && p.length > 2 ? <em key={i}>{p.slice(1, -1)}</em> : <Fragment key={i}>{p}</Fragment>
            )}
        </Tag>
    );
}

export function Kicker({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
    return (
        <p className={`mb-3 text-xs font-bold uppercase tracking-[0.18em] ${dark ? "text-dorado-claro" : "text-verde"}`}>{children}</p>
    );
}

export function Button({
    href,
    children,
    variant = "primary",
    className = "",
    external = false,
}: {
    href: string;
    children: ReactNode;
    variant?: "primary" | "ghost" | "light" | "outlineLight";
    className?: string;
    external?: boolean;
}) {
    const styles = {
        primary: "bg-verde text-marfil hover:bg-verde-osc",
        ghost: "border border-verde/30 bg-white/40 text-verde hover:bg-white",
        light: "bg-marfil text-verde hover:bg-white",
        outlineLight: "border border-dorado-claro/60 text-marfil hover:bg-white/10",
    }[variant];
    return (
        <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={`inline-flex min-h-12 items-center justify-center rounded-full px-7 py-3 text-sm font-bold transition-colors ${styles} ${className}`}
        >
            {children}
        </a>
    );
}

export function waLink(number: string, message = ""): string {
    const n = (number || "").replace(/\D/g, "");
    return `https://wa.me/${n}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

/** Hides fields that are still empty or only a placeholder for the public. */
export const filled = (v?: string) => Boolean(v && v.trim());

export const otherLang = (lang: Lang): Lang => (lang === "es" ? "en" : "es");

export function Lines({ text, className = "" }: { text: string; className?: string }) {
    const lines = (text || "").split(/\n+/).filter((l) => l.trim());
    return (
        <ul className={className}>
            {lines.map((l, i) => (
                <li key={i}>{l}</li>
            ))}
        </ul>
    );
}
