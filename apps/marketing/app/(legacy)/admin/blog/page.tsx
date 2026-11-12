"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listPosts, type PostRow } from "@/lib/blog/client";
import { seoChecks } from "@/lib/blog/seo";
import { Badge, btnGhost, btnPrimary, card, Notice, PageHeader } from "@/components/admin/ui";

export default function BlogAdmin() {
    const [posts, setPosts] = useState<PostRow[] | null>(null);
    const [error, setError] = useState("");
    useEffect(() => {
        listPosts().then(setPosts).catch((e) => setError(e.message));
    }, []);
    return (
        <div className="flex max-w-5xl flex-col gap-6">
            <PageHeader kicker="Contenido" title="Blog">
                <Link href="/admin/blog/nuevo?lang=es" className={btnPrimary}>Nuevo artículo</Link>
                <Link href="/admin/blog/nuevo?lang=en" className={btnGhost}>Nuevo en inglés</Link>
            </PageHeader>
            <p className="max-w-3xl text-sm text-[#5C564D]">
                Artículos que responden lo que los pacientes buscan en Google («Are dentists in Mexico safe?», «All-on-4 Mexico vs USA»…). Cada artículo trae un revisor de SEO y de marca.
            </p>
            {error && <Notice kind="error">{error}</Notice>}
            <section className={card}>
                {!posts ? (
                    <p className="text-sm text-[#5C564D]">Cargando…</p>
                ) : posts.length === 0 ? (
                    <p className="text-sm text-[#5C564D]">Aún no hay artículos.</p>
                ) : (
                    <ul className="flex flex-col divide-y divide-[#F0EAE0]">
                        {posts.map((p) => {
                            const { score } = seoChecks(p);
                            return (
                                <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                                    <span className="min-w-0">
                                        <strong>{p.title || "(sin título)"}</strong>{" "}
                                        <Badge tone={p.status === "published" ? "green" : "amber"}>{p.status === "published" ? "Publicado" : "Borrador"}</Badge> <Badge>{p.lang.toUpperCase()}</Badge>{" "}
                                        <Badge tone={score >= 80 ? "green" : score >= 60 ? "amber" : "red"}>SEO {score}</Badge>
                                        <span className="block text-xs text-[#5C564D]">/{p.lang}/blog/{p.slug} · {p.keyword || "sin palabra clave"}</span>
                                    </span>
                                    <span className="flex gap-2">
                                        <Link href={`/admin/blog/${encodeURIComponent(p.id)}`} className={btnPrimary}>Editar</Link>
                                        {p.status === "published" && <a href={`/${p.lang}/blog/${p.slug}`} target="_blank" rel="noreferrer" className={btnGhost}>Ver</a>}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>
        </div>
    );
}
