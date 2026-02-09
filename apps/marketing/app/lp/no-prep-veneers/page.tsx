"use client";
import Image from "next/image";

export default function NoPrepVeneersLP() {
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
                        We don’t sell veneers. <br />
                        <span className="text-gold italic">We evaluate smiles first.</span>
                    </h1>
                    <p className="mb-12 animate-fade-up text-xl font-light text-zinc-500 leading-relaxed delay-100">
                        Not everyone is a candidate for veneers. Our approach is conservative, ethical, and based on long-term results.
                    </p>
                    <div className="animate-fade-up delay-200">
                        <a
                            href="https://wa.me/529841145997"
                            className="inline-block rounded-full bg-primary px-12 py-5 text-xl font-bold text-white shadow-2xl hover:bg-gold transition-all duration-300 transform hover:scale-[1.05]"
                        >
                            Request a Professional Evaluation
                        </a>
                    </div>
                </div>
            </section>

            {/* Professional Evaluation Section */}
            <section className="bg-zinc-50 py-24 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-16 md:grid-cols-2 items-center">
                        <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl">
                            <Image
                                src="/redesign/PHOTO-2025-12-17-21-07-18 4.jpg"
                                alt="Professional Dental Evaluation"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-8">
                            <h2 className="text-3xl font-serif font-bold text-primary">Why evaluation matters:</h2>
                            <p className="text-lg text-zinc-600 font-light leading-relaxed">
                                Veneers are not a one-size-fits-all treatment. Bite, enamel, gum health, and facial harmony must be evaluated before any recommendation.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="h-6 w-6 rounded-full bg-gold/20 flex items-center justify-center text-gold mt-1 shrink-0">✓</div>
                                    <p className="text-primary font-medium">Bite & Functional Analysis</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="h-6 w-6 rounded-full bg-gold/20 flex items-center justify-center text-gold mt-1 shrink-0">✓</div>
                                    <p className="text-primary font-medium">Enamel Health Assessment</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="h-6 w-6 rounded-full bg-gold/20 flex items-center justify-center text-gold mt-1 shrink-0">✓</div>
                                    <p className="text-primary font-medium">Facial Aesthetic Mapping</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-6 text-center">
                <div className="mx-auto max-w-2xl">
                    <h2 className="mb-8 text-3xl font-serif font-bold">Ready for an honest assessment?</h2>
                    <a
                        href="https://wa.me/529841145997"
                        className="inline-block rounded-full bg-gold px-12 py-5 text-xl font-bold text-white shadow-xl hover:bg-primary transition-all duration-300 transform hover:scale-[1.05]"
                    >
                        Request a Professional Evaluation
                    </a>
                    <p className="mt-8 text-sm text-zinc-400 font-light uppercase tracking-widest">
                        Conservative • Ethical • Long-Term
                    </p>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="bg-zinc-50 py-12 px-6 border-t border-zinc-100">
                <div className="mx-auto max-w-7xl text-center">
                    <p className="text-xs text-zinc-400 font-light uppercase tracking-widest">
                        © {new Date().getFullYear()} Dental Solutions Cancun. Luxury Cosmetic Dentistry.
                    </p>
                </div>
            </footer>
        </div>
    );
}
