"use client";

import { ReactNode } from "react";

/* Shared look for the admin panel pages. */
export const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold disabled:opacity-50";
export const btnPrimary = `${btn} bg-[#153D32] text-[#F6F3ED] font-bold`;
export const btnGhost = `${btn} border border-[#CFC5B3] bg-white text-[#252525]`;
export const btnDanger = `${btn} border border-[#E7C4C4] bg-white text-[#8A1F1F]`;
export const input = "min-h-11 w-full rounded-lg border border-[#CFC5B3] bg-white px-3 py-2 font-normal";
export const card = "rounded-2xl border border-[#E5DDD0] bg-white p-5";
export const fieldLabel = "flex flex-col gap-1 text-sm font-semibold";

export function PageHeader({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
    return (
        <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
                <p className="text-xs text-[#5C564D]">{kicker}</p>
                <h1 className="font-serif text-4xl font-semibold text-[#153D32]">{title}</h1>
            </div>
            {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
        </header>
    );
}

export function Notice({ kind = "info", children }: { kind?: "info" | "ok" | "warn" | "error"; children: ReactNode }) {
    const c = { info: "bg-[#EEF2EF] text-[#24433A]", ok: "bg-[#E3EFE6] text-[#1F5A36]", warn: "bg-[#FBEFD5] text-[#6B4500]", error: "bg-[#FDECEC] text-[#8A1F1F]" }[kind];
    return <div role={kind === "error" ? "alert" : "status"} className={`rounded-xl px-4 py-3 text-sm ${c}`}>{children}</div>;
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "green" | "amber" | "red" | "blue"; children: ReactNode }) {
    const c = { neutral: "bg-[#EEEBE5] text-[#4A453D]", green: "bg-[#E3EFE6] text-[#1F5A36]", amber: "bg-[#FBEFD5] text-[#6B4500]", red: "bg-[#FDECEC] text-[#8A1F1F]", blue: "bg-[#E6EEF6] text-[#1E4567]" }[tone];
    return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${c}`}>{children}</span>;
}

export function download(name: string, content: string, type = "application/json") {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** CSV that Excel opens with accents intact. */
export function toCsv(rows: (string | number)[][]) {
    const esc = (v: string | number) => {
        const s = String(v ?? "");
        return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    return "﻿" + rows.map((r) => r.map(esc).join(",")).join("\r\n");
}
