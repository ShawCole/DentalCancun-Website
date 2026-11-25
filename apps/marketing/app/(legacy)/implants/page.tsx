"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Image from "next/image";

export default function ImplantsPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-primary">
            <Header forceSolid={true} />

            <main className="pt-32">
                <section className="px-6 py-20 text-center bg-zinc-50">
                    <div className="mx-auto max-w-4xl">
                        <h1 className="mb-6 text-5xl font-serif font-bold md:text-6xl">
                            Precision <span className="text-gold italic">Dental Implants</span>
                        </h1>
                        <p className="text-xl font-light text-zinc-500 leading-relaxed">
                            Restoring function and aesthetics with world-class surgical expertise and premium materials.
                        </p>
                    </div>
                </section>

                <section className="px-6 py-24">
                    <div className="mx-auto max-w-7xl grid gap-16 md:grid-cols-2 items-center">
                        <div className="relative aspect-video overflow-hidden rounded-3xl shadow-2xl">
                            <Image
                                src="/redesign/PHOTO-2025-12-17-21-07-18 4.jpg"
                                alt="Dental Implants Technology"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-8">
                            <h2 className="text-3xl font-serif font-bold">The Gold Standard of Restoration</h2>
                            <p className="text-lg text-zinc-600 font-light leading-relaxed">
                                Our implant procedures are guided by advanced 3D imaging and executed by internationally trained oral surgeons. We prioritize long-term stability and natural appearance.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-primary font-medium">
                                    <span className="text-gold">✓</span> 3D Digital Surgical Guides
                                </li>
                                <li className="flex items-center gap-3 text-primary font-medium">
                                    <span className="text-gold">✓</span> Premium Grade Titanium & Zirconia
                                </li>
                                <li className="flex items-center gap-3 text-primary font-medium">
                                    <span className="text-gold">✓</span> Advanced Bone Grafting Protocols
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="px-6 py-24 bg-primary text-white text-center">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="mb-8 text-4xl font-serif font-bold">Is an implant right for you?</h2>
                        <p className="mb-12 text-white/70 font-light leading-relaxed">
                            Every case requires a detailed professional evaluation. We assess bone density, sinus health, and bite alignment before recommending a treatment plan.
                        </p>
                        <a href="/schedule" className="inline-block rounded-full bg-gold px-12 py-5 text-xl font-bold text-white shadow-xl hover:bg-white hover:text-gold transition-all duration-300">
                            Book an Evaluation
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
