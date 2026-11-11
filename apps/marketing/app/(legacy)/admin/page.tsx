import Link from "next/link";
import { PAGES } from "@/lib/cms/schema";

export default function AdminHome() {
    return (
        <div className="flex max-w-5xl flex-col gap-6">
            <header>
                <p className="text-xs text-[#5C564D]">Panel</p>
                <h1 className="font-serif text-4xl font-semibold text-[#153D32]">Escritorio</h1>
            </header>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card href="/admin/paginas" title="Páginas y textos" text={`${PAGES.length} páginas editables en español e inglés.`} />
                <Card href="/admin/medios" title="Imágenes" text="Sube, reutiliza y borra las imágenes del sitio." />
                <Card href="/admin/paginas/site" title="Datos de contacto" text="WhatsApp, teléfono, correo, horario, logo y redes." />
            </section>
            <p className="text-sm text-[#5C564D]">
                Al guardar, el cambio aparece en el sitio en unos segundos. Los cambios de diseño y las secciones nuevas se programan y se revisan antes de publicarse.
            </p>
        </div>
    );
}

function Card({ href, title, text }: { href: string; title: string; text: string }) {
    return (
        <Link href={href} className="flex flex-col gap-2 rounded-2xl border border-[#E5DDD0] bg-white p-5 hover:border-[#153D32]">
            <span className="font-bold text-[#153D32]">{title}</span>
            <span className="text-sm text-[#5C564D]">{text}</span>
        </Link>
    );
}
