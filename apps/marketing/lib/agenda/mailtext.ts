/** Patient e-mails for appointments, in natural Spanish and US English. */
type L = "es" | "en";
const sign = "\n\nDental Solutions Puerto Cancún";

export function tipoLabel(tipo: "virtual" | "clinica", lang: L) {
    return lang === "es" ? (tipo === "virtual" ? "videollamada" : "valoración en clínica") : tipo === "virtual" ? "video call" : "consultation at our clinic";
}

export function requestMail(o: { lang: L; nombre: string; tipo: "virtual" | "clinica"; when: string; manage?: string; payUrl?: string; depositUsd?: number }) {
    const t = tipoLabel(o.tipo, o.lang);
    if (o.lang === "es") {
        return {
            subject: "Recibimos tu solicitud de cita · Dental Solutions",
            text:
                `Hola ${o.nombre}:\n\nRecibimos tu solicitud de ${t} para el ${o.when} (hora de Cancún).\nNuestro concierge te escribirá por WhatsApp para confirmarla.` +
                (o.payUrl ? `\n\nPara reservar tu lugar, puedes pagar el anticipo de USD ${o.depositUsd} aquí:\n${o.payUrl}` : "") +
                (o.manage ? `\n\n¿Necesitas cambiar o cancelar tu cita? Hazlo aquí:\n${o.manage}` : "") +
                sign,
        };
    }
    return {
        subject: "We got your appointment request · Dental Solutions",
        text:
            `Hi ${o.nombre},\n\nWe got your request for a ${t} on ${o.when} (Cancun time).\nOur concierge will text you on WhatsApp to confirm.` +
            (o.payUrl ? `\n\nTo hold your spot, you can pay the USD ${o.depositUsd} deposit here:\n${o.payUrl}` : "") +
            (o.manage ? `\n\nNeed to reschedule or cancel? You can do it here:\n${o.manage}` : "") +
            sign,
    };
}

export function reminderMail(o: { lang: L; nombre: string; tipo: "virtual" | "clinica"; when: string; manage?: string; address?: string }) {
    const t = tipoLabel(o.tipo, o.lang);
    if (o.lang === "es") {
        return {
            subject: "Recordatorio: tu cita es mañana · Dental Solutions",
            text:
                `Hola ${o.nombre}:\n\nTe recordamos tu ${t} del ${o.when} (hora de Cancún).` +
                (o.tipo === "clinica" && o.address ? `\nDirección: ${o.address}` : o.tipo === "virtual" ? "\nTe enviaremos el enlace de la videollamada por WhatsApp." : "") +
                (o.manage ? `\n\nSi necesitas cambiarla o cancelarla:\n${o.manage}` : "") +
                sign,
        };
    }
    return {
        subject: "Reminder: your appointment is tomorrow · Dental Solutions",
        text:
            `Hi ${o.nombre},\n\nJust a reminder about your ${t} on ${o.when} (Cancun time).` +
            (o.tipo === "clinica" && o.address ? `\nAddress: ${o.address}` : o.tipo === "virtual" ? "\nWe'll text you the video call link on WhatsApp." : "") +
            (o.manage ? `\n\nNeed to reschedule or cancel?\n${o.manage}` : "") +
            sign,
    };
}

export function changeMail(o: { lang: L; nombre: string; action: "cancel" | "reschedule"; when: string }) {
    if (o.lang === "es") {
        return o.action === "cancel"
            ? { subject: "Tu cita fue cancelada · Dental Solutions", text: `Hola ${o.nombre}:\n\nCancelamos tu cita del ${o.when}. Cuando quieras, puedes agendar otra desde nuestro sitio o por WhatsApp.${sign}` }
            : { subject: "Tu cita cambió de horario · Dental Solutions", text: `Hola ${o.nombre}:\n\nTu nueva cita es el ${o.when} (hora de Cancún). Nuestro concierge te escribirá para confirmarla.${sign}` };
    }
    return o.action === "cancel"
        ? { subject: "Your appointment was canceled · Dental Solutions", text: `Hi ${o.nombre},\n\nYour appointment on ${o.when} is canceled. Whenever you're ready, you can book again on our site or on WhatsApp.${sign}` }
        : { subject: "Your appointment was moved · Dental Solutions", text: `Hi ${o.nombre},\n\nYour new appointment is on ${o.when} (Cancun time). Our concierge will text you to confirm.${sign}` };
}
