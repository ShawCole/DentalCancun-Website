import "server-only";
import { getPageDoc } from "@/lib/cms/content";
import { busyBlocks, calendarConfigured } from "@/lib/server/google";

/** Cancún is UTC-5 all year (no daylight saving). */
const OFFSET = "-05:00";
export type Tipo = "virtual" | "clinica";

export interface Rules {
    days: number[];
    start: string;
    end: string;
    minutes: Record<Tipo, number>;
    noticeMin: number;
    windowDays: number;
    blocked: string[];
    /** Online deposit in USD; 0 means no online payment. */
    depositUsd: number;
    depositFor: Tipo[];
}

export async function getRules(): Promise<Rules> {
    const r = (await getPageDoc("concierge")).shared.rules || {};
    const num = (v: string | undefined, d: number) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : d);
    return {
        days: (r.days || "1,2,3,4,5").split(/[,\s]+/).map(Number).filter((n) => n >= 1 && n <= 7),
        start: /^\d{1,2}:\d{2}$/.test(r.start || "") ? r.start : "10:00",
        end: /^\d{1,2}:\d{2}$/.test(r.end || "") ? r.end : "19:00",
        minutes: { virtual: num(r.virtualMin, 30), clinica: num(r.clinicMin, 60) },
        noticeMin: num(r.noticeMin, 120),
        windowDays: Math.min(num(r.windowDays, 30), 60),
        blocked: (r.blocked || "").split(/\s+/).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)),
        depositUsd: Math.max(0, Math.min(Number(r.depositUsd) || 0, 5000)),
        depositFor: (r.depositFor || "").trim().toLowerCase() === "ambas" ? ["virtual", "clinica"] : ["clinica"],
    };
}

const pad = (n: number) => String(n).padStart(2, "0");
/** Today's date in Cancún as YYYY-MM-DD. */
function cancunDate(ms: number) {
    const d = new Date(ms - 5 * 3600_000);
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}
const at = (iso: string, hhmm: string) => Date.parse(`${iso}T${hhmm.padStart(5, "0")}:00${OFFSET}`);

export interface Day { date: string; slots: { h: string; ts: number; free: boolean }[] }

export async function getSlots(tipo: Tipo): Promise<{ days: Day[]; calendar: boolean; error?: string }> {
    const rules = await getRules();
    const now = Date.now();
    const first = cancunDate(now);
    const from = at(first, "00:00");
    const to = from + rules.windowDays * 86_400_000;
    let busy: [number, number][] = [];
    let error: string | undefined;
    const calendar = calendarConfigured();
    if (calendar) {
        try {
            busy = await busyBlocks(new Date(from), new Date(to));
        } catch (e) {
            // Without the calendar we cannot promise availability: show no free slots.
            error = e instanceof Error ? e.message : "calendar error";
            console.error("[agenda]", error);
        }
    }
    const dur = rules.minutes[tipo] * 60_000;
    const days: Day[] = [];
    for (let t = from; t < to; t += 86_400_000) {
        const date = cancunDate(t + 12 * 3600_000);
        const weekday = ((new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7) + 1; // 1 = Monday
        if (!rules.days.includes(weekday) || rules.blocked.includes(date)) continue;
        const slots: Day["slots"] = [];
        for (let s = at(date, rules.start), close = at(date, rules.end); s + dur <= close; s += dur) {
            const free = !error && s >= now + rules.noticeMin * 60_000 && !busy.some(([b0, b1]) => s < b1 && s + dur > b0);
            const d = new Date(s - 5 * 3600_000);
            slots.push({ h: `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`, ts: s, free });
        }
        if (slots.some((x) => x.free)) days.push({ date, slots });
    }
    return { days, calendar, error };
}

export function formatWhen(ts: number, lang: "es" | "en") {
    return new Intl.DateTimeFormat(lang === "es" ? "es-MX" : "en-US", {
        timeZone: "America/Cancun",
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(ts));
}
