import Link from "next/link";
import { PAGES } from "@/lib/cms/schema";
import { Dashboard } from "@/components/admin/Dashboard";

export default function AdminHome() {
    return (
        <div className="flex max-w-6xl flex-col gap-6">
            <header>
                <p className="text-xs text-[#5C564D]">Panel</p>
                <h1 className="font-serif text-4xl font-semibold text-[#153D32]">Escritorio</h1>
            </header>
            <Dashboard />
            <h2 className="mt-4 text-lg font-bold text-[#153D32]">Accesos rápidos</h2>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card href="/admin/pacientes" title="Pacientes" text="Diagnósticos, fotos y citas de cada persona, con etapa y seguimiento." />
                <Card href="/admin/agenda" title="Agenda" text="Citas pedidas desde el sitio, recordatorios y anticipos." />
                <Card href="/admin/paginas" title="Páginas y textos" text={`${PAGES.length} páginas editables en español e inglés.`} />
                <Card href="/admin/constructor" title="Constructor de páginas" text="Landings, promociones y páginas informativas con bloques." />
                <Card href="/admin/blog" title="Blog" text="Artículos con revisión de SEO y versión en inglés." />
                <Card href="/admin/promociones" title="Promociones" text="Ofertas de temporada que aparecen y terminan solas." />
            </section>
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
