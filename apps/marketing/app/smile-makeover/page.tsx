"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Image from "next/image";

export default function SmileMakeoverPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-primary">
            <Header forceSolid={true} />

            <main className="pt-32">
                <section className="px-6 py-20 text-center bg-zinc-50">
                    <div className="mx-auto max-w-4xl">
                        <h1 className="mb-6 text-5xl font-serif font-bold md:text-6xl">
                            Holistic <span className="text-gold italic">Smile Makeovers</span>
                        </h1>
                        <p className="text-xl font-light text-zinc-500 leading-relaxed">
                            A comprehensive approach to aesthetic perfection, balancing facial harmony and dental health.
                        </p>
                    </div>
                </section>

                <section className="px-6 py-24">
                    <div className="mx-auto max-w-7xl grid gap-16 md:grid-cols-2 items-center">
                        <div className="space-y-8 order-2 md:order-1">
                            <h2 className="text-3xl font-serif font-bold">Engineered for Your Face</h2>
                            <p className="text-lg text-zinc-600 font-light leading-relaxed">
                                A smile makeover is more than just white teeth. We evaluate gum lines, lip symmetry, and facial proportions to design a smile that is uniquely yours.
                            </p>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                                    <h4 className="font-bold text-gold mb-2">Artistry</h4>
                                    <p className="text-sm text-zinc-500">Hand-finished details for a natural, non-artificial look.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                                    <h4 className="font-bold text-gold mb-2">Precision</h4>
                                    <p className="text-sm text-zinc-500">CAD/CAM technology for a perfect fit and long-term durability.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-3xl shadow-2xl order-1 md:order-2">
                            <Image
                                src="/redesign/PHOTO-2025-12-17-21-07-18 2.jpg"
                                alt="Smile Makeover Results"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </section>

                <section className="px-6 py-24 bg-primary text-white text-center">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="mb-8 text-4xl font-serif font-bold">Start Your Transformation</h2>
                        <p className="mb-12 text-white/70 font-light leading-relaxed">
                            Your journey begins with a professional evaluation. We don't just fix teeth; we engineer confidence.
                        </p>
                        <a href="/schedule" className="inline-block rounded-full bg-gold px-12 py-5 text-xl font-bold text-white shadow-xl hover:bg-white hover:text-gold transition-all duration-300">
                            Book a Consultation
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
