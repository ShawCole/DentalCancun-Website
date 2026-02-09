"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Image from "next/image";

export default function VeneersPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-primary">
            <Header forceSolid={true} />

            <main className="pt-32">
                <section className="px-6 py-20 text-center bg-zinc-50">
                    <div className="mx-auto max-w-4xl">
                        <h1 className="mb-6 text-5xl font-serif font-bold md:text-6xl">
                            Designer <span className="text-gold italic">Veneers</span>
                        </h1>
                        <p className="text-xl font-light text-zinc-500 leading-relaxed">
                            Crafting perfect smiles with conservative techniques and world-class artistry.
                        </p>
                    </div>
                </section>

                <section className="px-6 py-24">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-16 md:grid-cols-2 items-center mb-24">
                            <div className="relative aspect-video overflow-hidden rounded-3xl shadow-2xl">
                                <Image
                                    src="/redesign/PHOTO-2025-12-17-21-07-18 6.jpg"
                                    alt="Porcelain Veneers"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="space-y-6">
                                <h2 className="text-3xl font-serif font-bold text-primary">High-End Porcelain Veneers</h2>
                                <p className="text-lg text-zinc-600 font-light leading-relaxed">
                                    Our porcelain veneers are hand-crafted using premium materials to mimic the translucency and strength of natural teeth. They are the ultimate choice for high-impact smile transformations.
                                </p>
                                <a href="/lp/porcelain-veneers" className="text-gold font-bold hover:underline">Learn more about Porcelain Veneers →</a>
                            </div>
                        </div>

                        <div className="grid gap-16 md:grid-cols-2 items-center">
                            <div className="space-y-6 order-2 md:order-1">
                                <h2 className="text-3xl font-serif font-bold text-primary">No-Prep / Minimal Prep</h2>
                                <p className="text-lg text-zinc-600 font-light leading-relaxed">
                                    A conservative, non-invasive approach that preserves your natural tooth structure. Ideal for patients seeking a subtle yet significant enhancement without the need for drilling.
                                </p>
                                <a href="/lp/no-prep-veneers" className="text-gold font-bold hover:underline">Learn more about No-Prep Veneers →</a>
                            </div>
                            <div className="relative aspect-video overflow-hidden rounded-3xl shadow-2xl order-1 md:order-2">
                                <Image
                                    src="/redesign/PHOTO-2025-12-17-21-07-18 2.jpg"
                                    alt="No-Prep Veneers"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-6 py-24 bg-primary text-white text-center">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="mb-8 text-4xl font-serif font-bold">The Evaluation is the First Step</h2>
                        <p className="mb-12 text-white/70 font-light leading-relaxed">
                            Veneers are a personalized medical treatment. We evaluate your bite, enamel health, and facial harmony before providing any recommendation.
                        </p>
                        <a href="/schedule" className="inline-block rounded-full bg-gold px-12 py-5 text-xl font-bold text-white shadow-xl hover:bg-white hover:text-gold transition-all duration-300">
                            Book a Professional Evaluation
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
