"use client";
import Image from "next/image";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function SchedulePage() {
    return (
        <div className="min-h-screen bg-white font-sans text-primary">
            <Header forceSolid={true} />

            {/* Hero Section */}
            <section className="bg-zinc-50 pt-32 pb-20 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <h1 className="mb-4 text-5xl font-serif font-bold md:text-6xl text-primary">Your Smile Design Gallery</h1>
                        <p className="mx-auto max-w-2xl text-lg text-zinc-500 font-light">
                            Experience the "gold standard" of dental tourism. Our approach is conservative, ethical, and based on long-term results.
                        </p>
                    </div>

                    <div className="rounded-3xl bg-primary p-12 text-white shadow-2xl">
                        <div className="grid gap-12 md:grid-cols-2 items-center">
                            <div>
                                <h3 className="mb-6 text-3xl font-serif font-bold">Request a Professional Evaluation</h3>
                                <p className="mb-8 text-white/80 font-light leading-relaxed">
                                    Veneers and smile makeovers are highly customized medical treatments. We do not provide fixed price lists because every case is unique.
                                    <br /><br />
                                    Your investment is determined only after a professional evaluation of your bite, enamel, and facial harmony.
                                </p>
                                <ul className="mb-10 space-y-4">
                                    <li className="flex items-center gap-3 text-sm opacity-90">
                                        <span className="text-gold">✓</span> Comprehensive Digital Assessment
                                    </li>
                                    <li className="flex items-center gap-3 text-sm opacity-90">
                                        <span className="text-gold">✓</span> Personalized Treatment Roadmap
                                    </li>
                                    <li className="flex items-center gap-3 text-sm opacity-90">
                                        <span className="text-gold">✓</span> Transparent Investment Discussion
                                    </li>
                                </ul>
                                <a
                                    href="https://wa.me/529841145997"
                                    className="inline-block rounded-xl bg-gold px-10 py-5 text-lg font-bold text-white shadow-xl hover:bg-white hover:text-gold transition-all duration-300 transform hover:scale-[1.02]"
                                >
                                    GET EVALUATED
                                </a>
                            </div>
                            <div className="relative aspect-video overflow-hidden rounded-2xl shadow-lg border border-white/10">
                                <Image
                                    src="/redesign/PHOTO-2025-12-17-21-07-18 6.jpg"
                                    alt="Professional Evaluation"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Specialists Section */}
            <section className="py-24 px-6 bg-white overflow-hidden">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-16 md:grid-cols-2 items-center">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-2xl">
                            <Image
                                src="/redesign/PHOTO-2025-12-17-21-07-18 4.jpg"
                                alt="Modern Treatment Room"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                            <div className="absolute bottom-10 left-10 text-white">
                                <h3 className="text-3xl font-serif font-bold">World-Class Facility</h3>
                                <p className="text-white/80 font-light">Equipped with the latest in 3D digital dentistry.</p>
                            </div>
                        </div>

                        <div className="space-y-12">
                            <div>
                                <h2 className="mb-6 text-4xl font-serif font-bold text-primary">Your Smile, <br /><span className="text-gold italic">Engineered with a View</span></h2>
                                <p className="text-lg text-zinc-500 font-light leading-relaxed">
                                    Every treatment is conducted in our state-of-the-art facility overlooking the beautiful Cancun horizon. We combine advanced engineering with aesthetic artistry to create your perfect smile.
                                </p>
                            </div>

                            <div className="grid gap-6">
                                {[
                                    { title: "No Hidden Costs", desc: "Our quotes are all-inclusive. What you see is exactly what you pay." },
                                    { title: "Pain-Free Technology", desc: "Experience the latest in minimally invasive sedation and laser dentistry." },
                                    { title: "Fast Turnaround", desc: "Complete restorations in as little as 5-7 days thanks to our in-house lab." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6 group cursor-default">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-50 text-gold group-hover:bg-gold group-hover:text-white transition-colors">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="mb-1 font-bold text-primary uppercase text-sm tracking-widest">{item.title}</h4>
                                            <p className="text-zinc-500 text-sm font-light leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* High-Impact Visual Trust Section */}
            <section className="bg-primary py-24 px-6 text-center text-white">
                <div className="mx-auto max-w-4xl">
                    <h2 className="mb-8 text-4xl font-serif font-bold">Why Patients Choose <span className="text-gold">Cancun</span></h2>
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="rounded-2xl bg-white/5 p-8 backdrop-blur-md border border-white/10">
                            <div className="text-4xl font-bold text-gold mb-2">500+</div>
                            <div className="text-sm font-medium text-white/60 uppercase tracking-widest">Successful Procedures</div>
                        </div>
                        <div className="rounded-2xl bg-white/5 p-8 backdrop-blur-md border border-white/10">
                            <div className="text-4xl font-bold text-gold mb-2">Over 10+ Years</div>
                            <div className="text-sm font-medium text-white/60 uppercase tracking-widest">In Cancun</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Floating WhatsApp CTA */}
            <a
                href="https://wa.me/529841145997"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-8 left-8 z-40 flex items-center gap-3 rounded-full bg-[#25D366] p-4 text-white shadow-2xl hover:scale-105 transition-all duration-300 group md:pr-6"
            >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-[#25D366] transition-colors">
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                </div>
                <div className="hidden md:flex md:flex-col">
                    <span className="text-[10px] uppercase font-bold opacity-70 leading-none">VIP Access</span>
                    <span className="font-bold">Chat with Concierge</span>
                </div>
            </a>

            {/* Footer */}
            <Footer />
        </div>
    );
}
