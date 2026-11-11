import type { PageDoc } from "./schema";

/**
 * Default content. The site shows these values until someone edits
 * them in the admin panel (or when Firebase is not configured).
 * [PENDIENTE] marks data the clinic still has to confirm.
 */
export const DEFAULTS: Record<string, PageDoc> = {
    site: {
        shared: {
            contact: {
                whatsapp: "529841145997",
                phone: "[PENDIENTE]",
                email: "[PENDIENTE]",
            },
            brand: { logo: "/redesign/DentalSolutions_Logo_Flat.png" },
            social: { instagram: "", facebook: "", tiktok: "" },
        },
        es: {
            contact: { address: "Puerto Cancún, Quintana Roo, México", hours: "[PENDIENTE]" },
            brand: { tagline: "Sonríele a la vida con alegría y confianza" },
        },
        en: {
            contact: { address: "Puerto Cancún, Quintana Roo, Mexico", hours: "[PENDIENTE]" },
            brand: { tagline: "Smile at life with joy and confidence" },
        },
    },
    home: {
        shared: {
            hero: {
                poster: "/redesign/PHOTO-2025-12-17-21-07-18.jpg",
                video: "https://storage.googleapis.com/msgsndr/f0ZNnBBOAnxnYbXCHsB5/media/69209581ec01c107be9e5f7a.mp4",
            },
        },
        es: {
            hero: {
                title: "Odontología estética de lujo",
                highlight: "en Cancún",
                subtitle: "Pacientes internacionales nos confían su sonrisa por nuestra precisión, ética y resultados estéticos naturales.",
                cta: "Agendar valoración",
                ctaUrl: "/schedule",
            },
            seo: {
                title: "Diseño de sonrisa en Cancún | Dental Solutions",
                description: "Carillas, implantes y rehabilitación oral con acompañamiento concierge en Puerto Cancún.",
            },
        },
        en: {
            hero: {
                title: "Luxury Cosmetic",
                highlight: "Dentistry in Cancun",
                subtitle: "Trusted by international patients seeking precision, ethics, and long-term aesthetic results.",
                cta: "Book a Consultation",
                ctaUrl: "/schedule",
            },
            seo: {
                title: "DentalSolutions Cancun | Premium Dental Tourism",
                description: "Smile design, veneers and implants with concierge support in Puerto Cancun.",
            },
        },
    },
};
