"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Lang } from "@/lib/cms/schema";
import { Answers, explain, getQuiz, prioridadLead, ready, recommend, Recommendation, tipoNecesidad, treatmentUrl } from "@/lib/quiz/logic";

type Stage = "questions" | "lead" | "result";

const T = {
    es: {
        eyebrow: "Diseña tu sonrisa",
        question: (n: number, t: number) => `Pregunta ${n} de ${t}`,
        back: "← Volver",
        fine: "Resultado orientativo; no sustituye una valoración clínica.",
        lastStep: "Último paso",
        ready: "Tu resultado está listo",
        leadTitle: "¿A dónde te enviamos tu ruta personalizada?",
        leadHelp: "Nuestro equipo médico revisa cada caso. Te escribimos por WhatsApp para resolver tus dudas y, si quieres, revisar tus fotos.",
        name: "Nombre",
        whatsapp: "WhatsApp con código de país",
        email: "Correo (opcional)",
        country: "País",
        privacyPre: "Acepto el ",
        privacy: "aviso de privacidad",
        privacyPost: " y autorizo el uso de mis datos para evaluar mi caso.",
        privacyUrl: "/es/aviso-de-privacidad",
        see: "Ver mi resultado",
        preparing: "Preparando tu resultado…",
        errName: "Escribe tu nombre.",
        errWa: "Escribe tu WhatsApp con código de país.",
        errPrivacy: "Para continuar, acepta el aviso de privacidad.",
        route: (n: string) => `${n}, tu ruta recomendada`,
        visits: "Citas",
        stay: "Estancia en Cancún",
        alsoPre: "También podríamos valorar: ",
        alsoPost: ", según tus estudios y tu expectativa.",
        book: "Agendar mi valoración",
        bookUrl: "/es#valoracion",
        wa: "Hablar por WhatsApp",
        learn: "Conoce el tratamiento →",
        restart: "Volver a empezar",
        waMsg: (n: string, t: string) => `Hola, soy ${n}. Hice el diagnóstico digital «Diseña tu sonrisa» y mi ruta orientativa es: ${t}. Me gustaría agendar mi valoración.`,
    },
    en: {
        eyebrow: "Design your smile",
        question: (n: number, t: number) => `Question ${n} of ${t}`,
        back: "← Back",
        fine: "Just a starting point. It doesn’t replace an exam.",
        lastStep: "Last step",
        ready: "Your result is ready",
        leadTitle: "Where should we send your results?",
        leadHelp: "Our dental team reviews every case. We’ll text you on WhatsApp to answer your questions and, if you’d like, look at your photos.",
        name: "Name",
        whatsapp: "WhatsApp with country code",
        email: "Email (optional)",
        country: "Country",
        privacyPre: "I accept the ",
        privacy: "privacy notice",
        privacyPost: " and agree to let you use my info to review my case.",
        privacyUrl: "/en/privacy-notice",
        see: "See my result",
        preparing: "Preparing your result…",
        errName: "Please enter your name.",
        errWa: "Please enter your WhatsApp number with country code.",
        errPrivacy: "To continue, please accept the privacy notice.",
        route: (n: string) => `${n}, here’s your suggested path`,
        visits: "Visits",
        stay: "Time in Cancun",
        alsoPre: "We could also look at: ",
        alsoPost: ", depending on your X-rays and what you’re hoping for.",
        book: "Book my evaluation",
        bookUrl: "/en#valoracion",
        wa: "Text us on WhatsApp",
        learn: "Learn about the treatment →",
        restart: "Start over",
        waMsg: (n: string, t: string) => `Hi, I'm ${n}. I just took the “Design your smile” quiz and my suggested treatment is: ${t}. I'd like to book an evaluation.`,
    },
};

function track(event: string, data: Record<string, string> = {}) {
    try {
        const w = window as unknown as { dataLayer?: unknown[]; fbq?: (...a: unknown[]) => void };
        (w.dataLayer = w.dataLayer || []).push({ event, ...data });
        if (event === "dsc_quiz_lead" && typeof w.fbq === "function") w.fbq("track", "Lead", { content_name: data.tratamiento });
    } catch {
        /* analytics are optional */
    }
}

export function Quiz({ lang, whatsapp }: { lang: Lang; whatsapp: string }) {
    const quiz = useMemo(() => getQuiz(lang), [lang]);
    const es = quiz; // localized
    const base = useMemo(() => getQuiz("es"), []);
    const t = T[lang];
    const [stage, setStage] = useState<Stage>("questions");
    const [cur, setCur] = useState(quiz.start);
    const [answers, setAnswers] = useState<Answers>({});
    const [history, setHistory] = useState<string[]>([]);
    const [name, setName] = useState("");
    const [result, setResult] = useState<Recommendation | null>(null);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const title = useRef<HTMLHeadingElement>(null);
    const root = useRef<HTMLDivElement>(null);

    const focusTop = () =>
        requestAnimationFrame(() => {
            title.current?.focus({ preventScroll: true });
            const r = root.current?.getBoundingClientRect();
            if (r && r.top < 0) root.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });

    const q = es.questions[cur];
    let remaining = 0;
    for (let x: string | null = cur, g = 0; x && g < 15; g++) {
        remaining++;
        x = es.questions[x].options[0].next;
    }
    const step = history.length + 1;
    const total = step + remaining - 1;

    function choose(i: number) {
        const o = q.options[i];
        if (!history.length) track("dsc_quiz_start", { necesidad: base.questions[cur].options[i].label });
        setAnswers((a) => ({ ...a, [cur]: o.id }));
        setHistory((h) => [...h, cur]);
        if (o.next) setCur(o.next);
        else setStage("lead");
        focusTop();
    }

    function back() {
        if (stage === "lead") {
            setStage("questions");
            const prev = history[history.length - 1];
            setHistory((h) => h.slice(0, -1));
            setAnswers((a) => {
                const n = { ...a };
                delete n[prev];
                return n;
            });
            setCur(prev);
            return;
        }
        const prev = history[history.length - 1];
        if (!prev) return;
        setHistory((h) => h.slice(0, -1));
        setAnswers((a) => {
            const n = { ...a };
            delete n[prev];
            return n;
        });
        setCur(prev);
        focusTop();
    }

    function restart() {
        setStage("questions");
        setCur(quiz.start);
        setAnswers({});
        setHistory([]);
        setResult(null);
        focusTop();
    }

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const v = (k: string) => String(f.get(k) || "").trim();
        if (!v("nombre")) return setError(t.errName);
        if (v("whatsapp").replace(/\D/g, "").length < 8) return setError(t.errWa);
        if (!f.get("privacidad")) return setError(t.errPrivacy);
        if (v("empresa")) return; // honeypot
        setError("");
        setBusy(true);

        const r = recommend(answers);
        const label = (qid: string) => base.questions[qid]?.options.find((o) => o.id === answers[qid])?.label || "";
        const lead = {
            nombre: v("nombre"),
            whatsapp: v("whatsapp"),
            correo: v("correo"),
            pais: v("pais"),
            idioma: lang.toUpperCase(),
            necesidad: label("q1"),
            tratamiento: base.treatments[r.id].name,
            alternativa: r.alt ? base.treatments[r.alt].name : "",
            tipo: tipoNecesidad(answers, r),
            viaje: label("viaje"),
            agenda: label("agenda"),
            prioridad: prioridadLead(answers),
            regla: r.rule,
            notas: r.notes.join(" "),
            ruta: history.map((qid) => `${base.questions[qid].text} → ${label(qid)}`).join("\n"),
            pagina: window.location.href,
            estado: "nuevo",
            privacidad: true,
            createdAt: serverTimestamp(),
        };
        try {
            const d = db();
            if (d) await addDoc(collection(d, "leads"), lead);
        } catch (err) {
            console.error("[quiz] lead not saved", err);
        }
        track("dsc_quiz_lead", { tratamiento: base.treatments[r.id].short, prioridad: lead.prioridad });
        setName(lead.nombre.split(" ")[0]);
        setResult(r);
        setStage("result");
        setBusy(false);
        focusTop();
    }

    const card = "glass rounded-[32px] p-6 md:p-10";
    const opt = "flex min-h-14 w-full items-center justify-between gap-4 rounded-2xl border border-grafito/10 bg-white/70 px-5 py-3 text-left text-[15px] font-semibold hover:border-verde hover:bg-white";

    if (stage === "result" && result) {
        const tr = es.treatments[result.id];
        const x = explain(answers, result, lang);
        const learn = treatmentUrl(tr.url, lang);
        return (
            <div ref={root} className={card} aria-live="polite">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-dorado-texto">{t.route(name)}</p>
                <p className="mt-3 text-sm leading-relaxed text-gris">{x.comprension}</p>
                <h3 ref={title} tabIndex={-1} className="mt-4 font-serif text-3xl font-semibold leading-tight outline-none md:text-4xl">{tr.name}</h3>
                <p className="mt-3 leading-relaxed">{x.solucion}</p>
                {(ready(tr.citas) || ready(tr.estancia)) && (
                    <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                        {ready(tr.citas) && (
                            <div className="rounded-2xl bg-white/70 p-4">
                                <dt className="text-xs text-gris">{t.visits}</dt>
                                <dd className="font-bold">{tr.citas}</dd>
                            </div>
                        )}
                        {ready(tr.estancia) && (
                            <div className="rounded-2xl bg-white/70 p-4">
                                <dt className="text-xs text-gris">{t.stay}</dt>
                                <dd className="font-bold">{tr.estancia}</dd>
                            </div>
                        )}
                    </dl>
                )}
                {result.alt && (
                    <p className="mt-5 text-sm text-gris">
                        {t.alsoPre}
                        <strong className="text-grafito">{es.treatments[result.alt].name}</strong>
                        {t.alsoPost}
                    </p>
                )}
                <p className="mt-5 font-serif text-xl italic text-verde">{x.invitacion}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                    <a href={t.bookUrl} onClick={() => track("dsc_quiz_cta", { cta: "agenda" })} className="inline-flex min-h-12 items-center rounded-full bg-verde px-6 font-bold text-marfil hover:bg-verde-osc">
                        {t.book}
                    </a>
                    <a
                        href={`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(t.waMsg(name, tr.name))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track("dsc_quiz_cta", { cta: "whatsapp" })}
                        className="inline-flex min-h-12 items-center rounded-full border border-verde/30 bg-white/60 px-6 font-bold text-verde hover:bg-white"
                    >
                        {t.wa}
                    </a>
                    {learn && (
                        <a href={learn} className="inline-flex min-h-12 items-center px-2 text-sm font-bold text-verde underline-offset-4 hover:underline">
                            {t.learn}
                        </a>
                    )}
                </div>
                <p className="mt-6 text-xs text-gris">{x.nota}</p>
                <button type="button" onClick={restart} className="mt-3 min-h-11 text-sm font-semibold text-verde underline">
                    {t.restart}
                </button>
            </div>
        );
    }

    if (stage === "lead") {
        const field = "rounded-xl border border-grafito/15 bg-white px-4 py-3 font-normal";
        return (
            <div ref={root} className={card}>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em]">
                    <span className="text-verde">{t.lastStep}</span>
                    <span className="text-gris">{t.ready}</span>
                </div>
                <div className="mt-3 h-1 rounded-full bg-grafito/10" aria-hidden="true">
                    <div className="h-1 w-[96%] rounded-full bg-verde" />
                </div>
                <h3 ref={title} tabIndex={-1} className="mt-6 font-serif text-3xl font-semibold leading-tight outline-none">{t.leadTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gris">{t.leadHelp}</p>
                <form onSubmit={submit} noValidate className="mt-6 grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1 text-sm font-semibold">
                        {t.name}
                        <input name="nombre" autoComplete="name" required className={field} />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-semibold">
                        {t.whatsapp}
                        <input name="whatsapp" inputMode="tel" autoComplete="tel" placeholder="+1 512 555 0142" required className={field} />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-semibold">
                        {t.email}
                        <input name="correo" type="email" autoComplete="email" className={field} />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-semibold">
                        {t.country}
                        <input name="pais" autoComplete="country-name" className={field} />
                    </label>
                    <label className="absolute -left-[9999px]" aria-hidden="true">
                        Empresa
                        <input name="empresa" tabIndex={-1} autoComplete="off" />
                    </label>
                    <label className="flex items-start gap-3 text-sm sm:col-span-2">
                        <input type="checkbox" name="privacidad" required className="mt-1 h-5 w-5 accent-[#153D32]" />
                        <span>
                            {t.privacyPre}
                            <a href={t.privacyUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-verde underline">
                                {t.privacy}
                            </a>
                            {t.privacyPost}
                        </span>
                    </label>
                    {error && (
                        <p role="alert" className="text-sm font-semibold text-[#8A1F1F] sm:col-span-2">
                            {error}
                        </p>
                    )}
                    <div className="flex items-center justify-between gap-3 sm:col-span-2">
                        <button type="button" onClick={back} className="min-h-11 text-sm font-semibold text-verde">
                            {t.back}
                        </button>
                        <button type="submit" disabled={busy} className="inline-flex min-h-12 items-center rounded-full bg-verde px-6 font-bold text-marfil hover:bg-verde-osc disabled:opacity-60">
                            {busy ? t.preparing : t.see}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div ref={root} className={card}>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em]">
                <span className="text-verde">{t.eyebrow}</span>
                <span className="text-gris">{t.question(step, total)}</span>
            </div>
            <div className="mt-3 h-1 rounded-full bg-grafito/10" aria-hidden="true">
                <div className="h-1 rounded-full bg-verde transition-all" style={{ width: `${Math.round((step / (total + 1)) * 100)}%` }} />
            </div>
            <h3 ref={title} tabIndex={-1} id={`q-${cur}`} className="mt-6 font-serif text-3xl font-semibold leading-tight outline-none">
                {q.text}
            </h3>
            {q.help && <p className="mt-2 text-sm text-gris">{q.help}</p>}
            <div role="group" aria-labelledby={`q-${cur}`} className="mt-6 flex flex-col gap-3">
                {q.options.map((o, i) => (
                    <button key={o.id} type="button" onClick={() => choose(i)} className={opt}>
                        <span>{o.label}</span>
                        <span className="h-4 w-4 shrink-0 rounded-full border-2 border-dorado" aria-hidden="true" />
                    </button>
                ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                {history.length ? (
                    <button type="button" onClick={back} className="min-h-11 text-sm font-semibold text-verde">
                        {t.back}
                    </button>
                ) : (
                    <span />
                )}
                <span className="text-xs text-gris">{t.fine}</span>
            </div>
        </div>
    );
}
