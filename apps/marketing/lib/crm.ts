/** Shared by the server and the admin CRM. */
export function personKey(whatsapp = "", correo = "") {
    const d = whatsapp.replace(/\D/g, "");
    return d.length >= 8 ? `wa:${d.slice(-10)}` : `mail:${correo.trim().toLowerCase()}`;
}

export const STAGES = ["nuevo", "contactado", "valoración agendada", "presupuesto enviado", "en tratamiento", "seguimiento", "cerrado", "perdido"] as const;
export type Stage = (typeof STAGES)[number];

export const CITA_ESTADOS = ["por confirmar", "confirmada", "reprogramada", "cancelada", "asistió", "no asistió"] as const;
