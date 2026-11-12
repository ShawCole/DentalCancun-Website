"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, ReactNode, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";

type Item = { href: string; label: string; icon: string; admin?: boolean };
const GROUPS: { label: string; items: Item[] }[] = [
    { label: "", items: [{ href: "/admin", label: "Escritorio", icon: "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z" }] },
    {
        label: "Operación",
        items: [
            { href: "/admin/pacientes", label: "Pacientes", icon: "M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6M22 19v-1a4 4 0 0 0-3-3.9M16 4.1a3 3 0 0 1 0 5.8" },
            { href: "/admin/agenda", label: "Agenda", icon: "M4 5h16v15H4zM4 10h16M9 3v4M15 3v4" },
            { href: "/admin/diagnosticos", label: "Diagnósticos (quiz)", icon: "M4 5h16v11H8l-4 4z" },
        ],
    },
    {
        label: "Contenido",
        items: [
            { href: "/admin/paginas", label: "Páginas y textos", icon: "M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h7", admin: true },
            { href: "/admin/constructor", label: "Constructor de páginas", icon: "M3 3h18v6H3zM3 13h8v8H3zM15 13h6v8h-6z", admin: true },
            { href: "/admin/blog", label: "Blog", icon: "M4 4h16v16H4zM8 8h8M8 12h8M8 16h5", admin: true },
            { href: "/admin/promociones", label: "Promociones", icon: "M20 12l-8 8-9-9V3h8zM7 7h.01", admin: true },
            { href: "/admin/medios", label: "Imágenes", icon: "M3 4h18v16H3zM21 16l-5-5-9 9M9 10a2 2 0 1 0 0-.01", admin: true },
        ],
    },
    {
        label: "Sitio",
        items: [
            { href: "/admin/redirecciones", label: "Redirecciones", icon: "M4 7h13l-3-3M20 17H7l3 3", admin: true },
            { href: "/admin/estado", label: "Estado y respaldos", icon: "M3 12h4l3-8 4 16 3-8h4", admin: true },
        ],
    },
];
const ALL = GROUPS.flatMap((g) => g.items);

export function AdminShell({ children }: { children: ReactNode }) {
    const { user, loading, isAdmin, isStaff, isConfigured, signOut, profile } = useAuth();
    const pathname = usePathname();

    if (!isConfigured) {
        return (
            <Centered>
                <h1 className="font-serif text-2xl text-[#153D32]">Falta conectar Firebase</h1>
                <p className="mt-3 text-sm text-[#5C564D]">
                    Agrega las variables <code>NEXT_PUBLIC_FIREBASE_*</code> en Netlify (o en <code>.env.local</code>) y vuelve a publicar.
                </p>
            </Centered>
        );
    }
    if (loading) return <Centered><p className="text-[#5C564D]">Cargando…</p></Centered>;
    if (!user) return <Login />;
    const current = ALL.filter((i) => i.href !== "/admin" && pathname?.startsWith(i.href))[0];
    if (!isStaff || (!isAdmin && current?.admin)) {
        return (
            <Centered>
                <h1 className="font-serif text-2xl text-[#153D32]">Sin permisos</h1>
                <p className="mt-3 text-sm text-[#5C564D]">
                    {isStaff ? "Esta sección es solo para administradores. " : ""}Tu cuenta ({user.email}) necesita el rol <code>&quot;admin&quot;</code> (todo el panel) o <code>&quot;staff&quot;</code> (recepción: pacientes, agenda y diagnósticos) en Firestore → users.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                    {isStaff && <Link href="/admin" className="rounded-lg border border-[#CFC5B3] px-4 py-2 text-sm font-semibold">Ir al escritorio</Link>}
                    <button onClick={signOut} className="rounded-lg border border-[#CFC5B3] px-4 py-2 text-sm font-semibold">
                        Cerrar sesión
                    </button>
                </div>
            </Centered>
        );
    }

    const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href));

    return (
        <div className="flex min-h-screen flex-wrap bg-[#F6F3ED] text-[#252525]">
            <nav aria-label="Menú del administrador" className="flex w-full flex-col gap-5 bg-[#153D32] px-4 py-6 text-[#F6F3ED] md:w-64 md:min-h-screen">
                <div className="px-2">
                    <p className="font-serif text-2xl font-semibold leading-tight">Dental Solutions</p>
                    <p className="text-xs tracking-[0.08em] text-[#D9C28F]">PANEL · PUERTO CANCÚN</p>
                </div>
                <div className="flex flex-col gap-4">
                    {GROUPS.map((g) => {
                        const items = g.items.filter((i) => isAdmin || !i.admin);
                        if (!items.length) return null;
                        return (
                            <div key={g.label || "inicio"}>
                                {g.label && <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#D9C28F]">{g.label}</p>}
                                <ul className="flex flex-col gap-0.5">
                                    {items.map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                aria-current={active(item.href) ? "page" : undefined}
                                                className={`flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm ${active(item.href) ? "bg-[#F6F3ED] font-bold text-[#153D32]" : "hover:bg-white/10"}`}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <path d={item.icon} />
                                                </svg>
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-auto border-t border-white/20 px-2 pt-4 text-sm">
                    <p className="font-semibold">{profile?.displayName || user.email}</p>
                    <div className="mt-2 flex gap-4">
                        <a href="/es" target="_blank" rel="noreferrer" className="text-[#D9C28F] underline">Ver sitio</a>
                        <button onClick={signOut} className="text-[#D9C28F] underline">Salir</button>
                    </div>
                </div>
            </nav>
            <main className="min-w-0 flex-1 px-5 py-6 md:px-8">{children}</main>
        </div>
    );
}

function Centered({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F6F3ED] px-4">
            <div className="w-full max-w-md rounded-2xl border border-[#E5DDD0] bg-white p-8 text-center">{children}</div>
        </div>
    );
}

function Login() {
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    async function submit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setBusy(true);
        try {
            await signIn(email, password);
        } catch {
            setError("Correo o contraseña incorrectos.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <Centered>
            <p className="font-serif text-3xl font-semibold text-[#153D32]">Dental Solutions</p>
            <p className="mt-1 text-sm text-[#5C564D]">Panel de administración</p>
            <form onSubmit={submit} className="mt-6 flex flex-col gap-4 text-left">
                <label className="flex flex-col gap-1 text-sm font-semibold">
                    Correo
                    <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg border border-[#CFC5B3] px-3 py-3 font-normal" />
                </label>
                <label className="flex flex-col gap-1 text-sm font-semibold">
                    Contraseña
                    <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-lg border border-[#CFC5B3] px-3 py-3 font-normal" />
                </label>
                {error && <p role="alert" className="text-sm text-[#9B2C2C]">{error}</p>}
                <button type="submit" disabled={busy} className="min-h-11 rounded-lg bg-[#153D32] px-4 py-3 font-bold text-[#F6F3ED] disabled:opacity-60">
                    {busy ? "Entrando…" : "Entrar"}
                </button>
            </form>
        </Centered>
    );
}
