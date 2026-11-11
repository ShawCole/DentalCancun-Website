"use client";
import Image from "next/image";

export default function PorcelainVeneersLP() {
    return (
        <div className="min-h-screen bg-white font-sans text-primary selection:bg-gold selection:text-white">
            {/* Minimal Header - Logo Only */}
            <nav className="py-8 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="relative h-12 w-64">
                        <Image
                            src="/redesign/DentalSolutions_Logo_Flat.png"
                            alt="Dental Solutions"
                            fill
                            className="object-contain object-left"
                        />
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 px-6">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="mb-6 animate-fade-up text-5xl font-serif font-bold leading-tight md:text-7xl">
                        High-End Porcelain Veneers, <br />
                        <span className="text-gold italic">Designed for Natural Results</span>
                    </h1>
                    <p className="mb-12 animate-fade-up text-xl font-light text-zinc-500 leading-relaxed delay-100">
                        Each smile is custom-designed using premium materials and advanced aesthetic protocols.
                    </p>
                    <div className="animate-fade-up delay-200">
                        <a
                            href="https://wa.me/529841145997"
                            className="inline-block rounded-full bg-primary px-12 py-5 text-xl font-bold text-white shadow-2xl hover:bg-gold transition-all duration-300 transform hover:scale-[1.05]"
                        >
                            Schedule a Smile Design Consultation
                        </a>
                    </div>
                </div>
            </section>

            {/* Natural Results Section */}
            <section className="bg-zinc-50 py-24 px-6">
                <div className="mx-auto max-w-7xl grid gap-16 md:grid-cols-2 lg:grid-cols-3 items-center">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl md:col-span-2 lg:col-span-2">
                        <Image
                            src="/redesign/PHOTO-2025-12-17-21-07-18 2.jpg"
                            alt="Natural Porcelain Results"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="space-y-12">
                        <div className="p-8 rounded-3xl bg-white shadow-lg border border-zinc-100">
                            <h3 className="mb-4 text-sm font-bold text-gold uppercase tracking-widest">Investment Note</h3>
                            <p className="text-lg text-primary font-medium leading-relaxed">
                                Porcelain veneers are a personalized medical treatment. Investment varies depending on case complexity and materials used.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <span className="text-gold text-2xl">✨</span>
                                <div>
                                    <h4 className="font-bold">Premium Materials</h4>
                                    <p className="text-sm text-zinc-500">We use only the highest grade of Zirconia and E-max porcelain.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-gold text-2xl">🔬</span>
                                <div>
                                    <h4 className="font-bold">Advanced Protocols</h4>
                                    <p className="text-sm text-zinc-500">Precision engineering combined with artistic hand-finishing.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-6 text-center">
                <div className="mx-auto max-w-2xl">
                    <h2 className="mb-8 text-3xl font-serif font-bold text-primary">Begin your custom smile journey</h2>
                    <a
                        href="https://wa.me/529841145997"
                        className="inline-block rounded-full bg-gold px-12 py-5 text-xl font-bold text-white shadow-xl hover:bg-primary transition-all duration-300 transform hover:scale-[1.05]"
                    >
                        Schedule a Smile Design Consultation
                    </a>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="bg-zinc-50 py-12 px-6 border-t border-zinc-100 uppercase tracking-[0.2em] text-[10px] text-zinc-400 font-bold text-center">
                © {new Date().getFullYear()} Dental Solutions Cancun • Professional Aesthetic Protocols
            </footer>
        </div>
    );
}
