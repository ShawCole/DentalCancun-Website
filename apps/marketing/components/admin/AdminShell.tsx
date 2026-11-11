"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, ReactNode, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";

const NAV = [
    { href: "/admin", label: "Escritorio", icon: "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z" },
    { href: "/admin/paginas", label: "Páginas y textos", icon: "M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h7" },
    { href: "/admin/medios", label: "Imágenes", icon: "M3 4h18v16H3zM21 16l-5-5-9 9M9 10a2 2 0 1 0 0-.01" },
    { href: "/admin/diagnosticos", label: "Diagnósticos (quiz)", icon: "M4 5h16v11H8l-4 4z" },
];

export function AdminShell({ children }: { children: ReactNode }) {
    const { user, loading, isAdmin, isConfigured, signOut, profile } = useAuth();
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
    if (!isAdmin) {
        return (
            <Centered>
                <h1 className="font-serif text-2xl text-[#153D32]">Sin permisos</h1>
                <p className="mt-3 text-sm text-[#5C564D]">
                    Tu cuenta ({user.email}) no tiene rol de administrador. Pide que se le asigne <code>role: &quot;admin&quot;</code> en Firestore → users.
                </p>
                <button onClick={signOut} className="mt-6 rounded-lg border border-[#CFC5B3] px-4 py-2 text-sm font-semibold">
                    Cerrar sesión
                </button>
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
                <ul className="flex flex-col gap-1">
                    {NAV.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                aria-current={active(item.href) ? "page" : undefined}
                                className={`flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                                    active(item.href) ? "bg-[#F6F3ED] font-bold text-[#153D32]" : "hover:bg-white/10"
                                }`}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                    <path d={item.icon} />
                                </svg>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
                <p className="px-3 text-xs text-[#C9D6CF]">Próximamente: agenda con Google Calendar, testimonios en video y módulos.</p>
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
