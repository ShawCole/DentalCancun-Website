"use client";
import Image from "next/image";

export default function VIPExperienceLP() {
    return (
        <div className="min-h-screen bg-primary font-sans text-white selection:bg-gold selection:text-primary">
            {/* Minimal Header - Logo (Inverted) */}
            <nav className="py-8 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="relative h-12 w-64">
                        <Image
                            src="/redesign/DentalSolutions_Logo_Flat.png"
                            alt="Dental Solutions"
                            fill
                            className="object-contain object-left invert brightness-0"
                        />
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative py-32 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-30">
                    <Image
                        src="/redesign/PHOTO-2025-12-17-21-07-18 5.jpg"
                        alt="Cancun Luxury"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="absolute inset-0 z-1 bg-gradient-to-b from-primary via-primary/80 to-primary"></div>

                <div className="relative z-10 mx-auto max-w-4xl text-center">
                    <div className="mb-8 inline-block rounded-full border border-gold/30 bg-gold/10 px-6 py-2 text-sm font-bold tracking-[0.2em] text-gold uppercase backdrop-blur-md">
                        The Ultimate Privilege
                    </div>
                    <h1 className="mb-6 animate-fade-up text-5xl font-serif font-bold leading-tight md:text-7xl">
                        VIP Smile <br />
                        <span className="text-gold italic">Transformation Experience</span>
                    </h1>
                    <p className="mb-12 animate-fade-up text-xl font-light text-white/70 leading-relaxed delay-100 italic">
                        World-class cosmetic dentistry combined with luxury concierge care for international patients.
                    </p>
                    <div className="animate-fade-up delay-200">
                        <a
                            href="https://wa.me/529841145997"
                            className="inline-block rounded-full bg-gold px-12 py-5 text-xl font-bold text-white shadow-2xl hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-[1.05]"
                        >
                            Apply for a VIP Smile Transformation
                        </a>
                    </div>
                </div>
            </section>

            {/* VIP Pillars Section */}
            <section className="py-24 px-6">
                <div className="mx-auto max-w-5xl">
                    <div className="grid gap-12 md:grid-cols-2">
                        {[
                            { title: "Comprehensive Evaluation", desc: "A clinical deep-dive into functional and aesthetic harmony." },
                            { title: "Advanced Aesthetic Planning", desc: "Digital design protocols ensuring your result is a masterpiece." },
                            { title: "Premium Materials", desc: "Uncompromising quality with world-leading ceramic technology." },
                            { title: "Concierge Support & Privacy", desc: "End-to-end logistics with absolute discretion and luxury." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all">
                                <div className="text-gold text-2xl">0{i + 1}</div>
                                <div>
                                    <h4 className="mb-2 text-xl font-serif font-bold text-gold">{item.title}</h4>
                                    <p className="text-white/60 font-light leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final Call */}
            <section className="py-24 px-6 text-center border-t border-white/10">
                <div className="mx-auto max-w-2xl">
                    <h2 className="mb-8 text-3xl font-serif font-bold">Experience dentistry without compromise.</h2>
                    <a
                        href="https://wa.me/529841145997"
                        className="inline-block rounded-full bg-white px-12 py-5 text-xl font-bold text-primary shadow-xl hover:bg-gold hover:text-white transition-all duration-300 transform hover:scale-[1.05]"
                    >
                        Apply for a VIP Smile Transformation
                    </a>
                </div>
            </section>

            {/* Luxury Footer */}
            <footer className="py-12 px-6 text-center opacity-40">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold">
                    Cancun Hotel Zone • Exclusive International Care
                </p>
            </footer>
        </div>
    );
}
