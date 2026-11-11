import Link from "next/link";
import { PAGES } from "@/lib/cms/schema";

export default function AdminPages() {
    return (
        <div className="flex max-w-5xl flex-col gap-6">
            <header>
                <p className="text-xs text-[#5C564D]">Sitio web</p>
                <h1 className="font-serif text-4xl font-semibold text-[#153D32]">Páginas y textos</h1>
            </header>
            <div className="overflow-x-auto rounded-2xl border border-[#E5DDD0] bg-white">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                    <thead>
                        <tr className="text-left text-xs text-[#5C564D]">
                            <th className="px-5 py-3 font-semibold">Página</th>
                            <th className="px-3 py-3 font-semibold">Español</th>
                            <th className="px-3 py-3 font-semibold">English</th>
                            <th className="px-5 py-3"><span className="sr-only">Acciones</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {PAGES.map((p) => (
                            <tr key={p.id} className="border-t border-[#F0EAE0]">
                                <td className="px-5 py-3 font-semibold">
                                    {p.label}
                                    <span className="block text-xs font-normal text-[#5C564D]">{p.sections.length} secciones</span>
                                </td>
                                <td className="px-3 py-3 text-[#5C564D]">{p.path.es}</td>
                                <td className="px-3 py-3 text-[#5C564D]">{p.path.en}</td>
                                <td className="px-5 py-3 text-right">
                                    <Link href={`/admin/paginas/${p.id}`} className="inline-flex min-h-11 items-center rounded-lg border border-[#153D32] px-4 font-semibold text-[#153D32]">
                                        Editar
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
