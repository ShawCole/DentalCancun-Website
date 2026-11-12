"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { requireDb } from "@/lib/settings/client";
import { Badge, btnGhost, btnPrimary, card, download, Notice, PageHeader } from "@/components/admin/ui";

const LABELS: Record<string, [string, string]> = {
    contenido: ["Contenido del sitio (Firestore)", "Textos, imágenes y ajustes se leen correctamente."],
    firebaseServidor: ["Firebase en el servidor", "Guarda citas, recordatorios, estadísticas y respaldos. Variable FIREBASE_SERVICE_ACCOUNT_JSON."],
    calendario: ["Google Calendar", "Horarios libres y citas en el calendario de la clínica."],
    correo: ["Correo (SMTP)", "Avisos a la clínica, confirmaciones y recordatorios."],
    antispam: ["Antispam (Cloudflare Turnstile)", "Protege los formularios de citas y fotos."],
    pagos: ["Pagos con Stripe", "Anticipos en línea. Se activan además con el monto en Concierge → Reglas."],
    tareasProgramadas: ["Tareas programadas", "Recordatorios cada hora y respaldo diario. Variable CRON_SECRET."],
    traduccionIA: ["Traducción con IA", "Borradores en inglés desde el panel. Variable ANTHROPIC_API_KEY."],
};

const CONTENT = ["cms_pages", "cms_settings", "cms_media", "builder_pages", "builder_drafts", "blog_posts"];
const PATIENTS = ["leads", "appointments", "photo_submissions", "crm"];

export default function Estado() {
    const [health, setHealth] = useState<{ ok: boolean; time: string; checks: Record<string, boolean> } | null>(null);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const [withPatients, setWithPatients] = useState(false);

    useEffect(() => {
        fetch("/api/health", { cache: "no-store" })
            .then((r) => r.json())
            .then(setHealth)
            .catch(() => setError("No se pudo consultar el estado del sitio."));
    }, []);

    async function backup() {
        setBusy(true);
        setError("");
        try {
            const out: Record<string, Record<string, unknown>> = {};
            for (const c of withPatients ? [...CONTENT, ...PATIENTS] : CONTENT) {
                const snap = await getDocs(collection(requireDb(), c)).catch(() => null);
                if (snap) out[c] = Object.fromEntries(snap.docs.map((d) => [d.id, d.data()]));
            }
            const day = new Date().toISOString().slice(0, 10);
            download(`respaldo-${withPatients ? "completo-CONFIDENCIAL" : "contenido"}-${day}.json`, JSON.stringify({ createdAt: new Date().toISOString(), collections: out }, null, 1));
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "No se pudo crear el respaldo.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="flex max-w-5xl flex-col gap-6">
            <PageHeader kicker="Mantenimiento" title="Estado del sitio" />
            {error && <Notice kind="error">{error}</Notice>}

            <section className={card}>
                <h2 className="mb-3 font-bold text-[#153D32]">Servicios</h2>
                {!health ? (
                    <p className="text-sm text-[#5C564D]">Revisando…</p>
                ) : (
                    <ul className="flex flex-col divide-y divide-[#F0EAE0]">
                        {Object.entries(health.checks).map(([k, on]) => (
                            <li key={k} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                                <span>
                                    <strong>{LABELS[k]?.[0] || k}</strong>
                                    <span className="block text-xs text-[#5C564D]">{LABELS[k]?.[1]}</span>
                                </span>
                                <Badge tone={on ? "green" : "amber"}>{on ? "Activo" : "Pendiente de configurar"}</Badge>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className={`${card} flex flex-col gap-3`}>
                <h2 className="font-bold text-[#153D32]">Respaldos</h2>
                <p className="text-sm text-[#5C564D]">
                    Cada día a las 6:00 a.m. se guarda una copia automática del contenido en Firebase Storage (carpeta <code>backups/</code>, 30 días). También puedes descargar una copia ahora. Cada página guarda además su historial de cambios, que se restaura desde el editor.
                </p>
                <label className="flex items-start gap-3 text-sm">
                    <input type="checkbox" checked={withPatients} onChange={(e) => setWithPatients(e.target.checked)} className="mt-1 h-5 w-5 accent-[#153D32]" />
                    <span>Incluir datos de pacientes (diagnósticos, citas y CRM). El archivo es confidencial: guárdalo cifrado y nunca lo subas a GitHub ni lo compartas por chat.</span>
                </label>
                <button type="button" onClick={backup} disabled={busy} className={`${btnPrimary} self-start`}>{busy ? "Preparando…" : "Descargar respaldo"}</button>
            </section>

            <section className={`${card} flex flex-col gap-2 text-sm`}>
                <h2 className="font-bold text-[#153D32]">Monitoreo</h2>
                <p className="text-[#5C564D]">
                    Da de alta un monitor gratuito en UptimeRobot o Better Stack que revise cada 5 minutos esta dirección y avise por correo o WhatsApp si deja de responder:
                </p>
                <code className="break-all rounded-lg bg-[#F6F3ED] px-3 py-2">{typeof window !== "undefined" ? `${window.location.origin}/api/health` : "/api/health"}</code>
                <p className="text-[#5C564D]">Responde 200 cuando el sitio y su contenido funcionan, y 503 cuando algo falla.</p>
                <a href="/api/health" target="_blank" rel="noreferrer" className={`${btnGhost} self-start`}>Abrir</a>
            </section>
        </div>
    );
}
