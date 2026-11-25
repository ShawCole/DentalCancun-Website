"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { BLOCKS, type BlockName } from "@/lib/builder/blocks";
import { ImageField } from "../ImageField";
import { fontVars } from "@/lib/site/fonts";

/* Fields shown in the builder's side panel for each block. */
const text = (label: string) => ({ type: "text", label });
const area = (label: string) => ({ type: "textarea", label });
const image = (label: string) => ({
    type: "custom",
    label,
    render: ({ value, onChange, field }: any) => (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">{field.label}</span>
            <ImageField value={value || ""} onChange={onChange} />
        </div>
    ),
});
const select = (label: string, options: [string, string][]) => ({ type: "select", label, options: options.map(([value, l]) => ({ value, label: l })) });
const radio = (label: string, options: [string, string][]) => ({ type: "radio", label, options: options.map(([value, l]) => ({ value, label: l })) });
const bg = select("Fondo", [["marfil", "Marfil"], ["champana", "Champaña"], ["blanco", "Blanco"], ["verde", "Verde (oscuro)"]]);
const EM = "Usa *palabra* para la cursiva del titular.";
const titleField = { ...text("Título"), metadata: { help: EM } };
const list = (label: string, arrayFields: Record<string, any>, summary: (i: any) => string, defaultItemProps: Record<string, string>) => ({ type: "array", label, arrayFields, getItemSummary: (i: any, k: number) => summary(i) || `Elemento ${k + 1}`, defaultItemProps });

const FIELDS: Record<BlockName, Record<string, any>> = {
    Hero: {
        kicker: text("Antetítulo"),
        title: titleField,
        subtitle: area("Bajada"),
        image: image("Imagen de fondo"),
        imageAlt: text("Descripción de la imagen (accesibilidad)"),
        cta1Label: text("Botón principal · texto"),
        cta1Href: text("Botón principal · enlace (#agendar abre la agenda)"),
        cta2Label: text("Botón secundario · texto"),
        cta2Href: text("Botón secundario · enlace"),
        theme: radio("Estilo", [["claro", "Claro"], ["oscuro", "Oscuro"]]),
    },
    Facts: { bg, items: list("Datos", { value: text("Valor"), label: text("Etiqueta") }, (i) => `${i.value} · ${i.label}`, { value: "", label: "" }) },
    Cards: {
        kicker: text("Antetítulo"),
        title: titleField,
        columns: radio("Columnas", [["2", "2"], ["3", "3"], ["4", "4"]]),
        bg,
        items: list("Tarjetas", { title: text("Título"), text: area("Texto"), image: image("Imagen (opcional)"), linkLabel: text("Enlace · texto"), href: text("Enlace · dirección") }, (i) => i.title, { title: "Tarjeta", text: "" }),
    },
    ImageText: {
        kicker: text("Antetítulo"),
        title: titleField,
        text: area("Texto (línea en blanco = párrafo, **negritas**, - viñetas)"),
        image: image("Imagen"),
        imageAlt: text("Descripción de la imagen"),
        side: radio("Imagen a la", [["derecha", "Derecha"], ["izquierda", "Izquierda"]]),
        ctaLabel: text("Botón · texto"),
        ctaHref: text("Botón · enlace"),
        bg,
    },
    Steps: { kicker: text("Antetítulo"), title: titleField, bg, items: list("Pasos", { title: text("Título"), text: area("Texto") }, (i) => i.title, { title: "Paso", text: "" }) },
    Price: {
        kicker: text("Antetítulo"),
        title: titleField,
        amount: text("Precio (si tiene [VALIDAR] no se muestra)"),
        fallback: text("Texto si el precio aún no está aprobado"),
        note: area("Nota"),
        ctaLabel: text("Botón · texto"),
        ctaHref: text("Botón · enlace"),
    },
    Videos: {
        kicker: text("Antetítulo"),
        title: titleField,
        items: list("Videos", { video: text("Video (dirección .mp4, p. ej. /dsc/testimonios/testimonio-01.mp4)"), poster: image("Portada del video"), quote: area("Frase (con autorización)"), author: text("Nombre o iniciales (con autorización)") }, (i) => i.author || i.video, { video: "", poster: "", quote: "", author: "" }),
    },
    BeforeAfter: {
        title: titleField,
        before: image("Antes"),
        after: image("Después"),
        caption: text("Pie (tratamiento, tiempo)"),
        source: radio("Origen", [["ilustrativa", "Imagen ilustrativa"], ["real", "Caso real"]]),
        consent: radio("¿Hay autorización firmada del paciente?", [["no", "No"], ["si", "Sí"]]),
    },
    Faq: { title: titleField, bg, items: list("Preguntas", { q: text("Pregunta"), a: area("Respuesta") }, (i) => i.q, { q: "", a: "" }) },
    Text: { kicker: text("Antetítulo"), title: titleField, text: area("Texto (línea en blanco = párrafo, **negritas**, - viñetas, [texto](enlace))"), align: radio("Alineación", [["izquierda", "Izquierda"], ["centro", "Centro"]]), bg },
    QuizCta: { title: titleField, text: area("Texto"), label: text("Botón · texto"), href: text("Botón · enlace") },
    Closing: { kicker: text("Frase superior"), title: titleField, label: text("Botón · texto"), href: text("Botón · enlace"), label2: text("Segundo botón · texto"), href2: text("Segundo botón · enlace") },
    Spacer: { size: radio("Tamaño", [["s", "Chico"], ["m", "Mediano"], ["l", "Grande"]]), bg },
};

export const editorConfig: any = {
    categories: {
        portada: { title: "Portada y textos", components: ["Hero", "Text", "ImageText", "Facts"] },
        contenido: { title: "Contenido", components: ["Cards", "Steps", "Price", "Faq"] },
        confianza: { title: "Confianza", components: ["Videos", "BeforeAfter"] },
        conversion: { title: "Conversión", components: ["QuizCta", "Closing", "Spacer"] },
    },
    root: {
        fields: {
            title: text("Título de la página (SEO, máx. 60 caracteres)"),
            description: area("Descripción para Google (120–160 caracteres)"),
            noindex: radio("¿Ocultar de Google?", [["no", "No"], ["si", "Sí (páginas de anuncios o pruebas)"]]),
        },
        // Runs inside the preview frame: site fonts and colors.
        render: ({ children }: any) => <div className={`${fontVars} min-h-screen bg-marfil pt-[76px] font-sans text-grafito antialiased`}>{children}</div>,
    },
    components: Object.fromEntries(
        (Object.keys(BLOCKS) as BlockName[]).map((k) => [k, { label: BLOCKS[k].label, fields: FIELDS[k], defaultProps: BLOCKS[k].defaultProps, render: BLOCKS[k].render }]),
    ),
};
