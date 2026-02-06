"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function VIPLandingPage() {
    const [timeLeft, setTimeLeft] = useState(3600 * 24 * 2 + 1543); // 2 days example

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return { d, h, m, s };
    };

    const { d, h, m, s } = formatTime(timeLeft);

    return (
        <div className="min-h-screen bg-white font-sans text-primary selection:bg-gold selection:text-white">
            {/* Header */}
            <nav className="fixed top-0 z-50 w-full border-b bg-white/90 py-4 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
                    <a href="/" className="text-2xl font-serif font-bold">
                        DENTAL<span className="text-gold">SOLUTIONS</span>
                    </a>
                    <div className="flex items-center gap-6">
                        <a href="https://wa.me/529841145997" className="hidden text-sm font-bold text-primary hover:text-gold md:block">
                            WhatsApp: +52 984 114 5997
                        </a>
                        <button className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-white shadow-xl hover:bg-gold transition-all duration-300">
                            RESERVE NOW
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Luxury First Promise */}
            <section className="relative min-h-[90vh] overflow-hidden bg-primary pt-32 pb-20 px-6 flex items-center">
                <div className="absolute inset-0 z-0 opacity-40">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover"
                        poster="/redesign/PHOTO-2025-12-17-21-07-18 2.jpg"
                    >
                        <source src="https://storage.googleapis.com/msgsndr/f0ZNnBBOAnxnYbXCHsB5/media/69209581ec01c107be9e5f7a.mp4" type="video/mp4" />
                    </video>
                </div>
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>

                <div className="relative z-20 mx-auto max-w-7xl grid gap-16 md:grid-cols-2 items-center">
                    <div className="animate-fade-up">
                        <div className="mb-6 inline-block rounded-full bg-gold/20 px-4 py-1 text-sm font-bold tracking-widest text-gold uppercase border border-gold/30 backdrop-blur-sm">
                            VIP Smile Transformation
                        </div>
                        <h1 className="mb-6 text-5xl font-serif font-bold leading-tight md:text-7xl text-white">
                            A Smile Makeover that feels like a <span className="text-gold italic">Five-Star Vacation</span>.
                        </h1>
                        <p className="mb-10 text-xl font-light text-white/80 leading-relaxed max-w-xl">
                            We have reimagined dental tourism for discerning American patients who want world-class dentistry and a luxury travel experience — in one seamless journey.
                        </p>

                        {/* Countdown */}
                        <div className="mb-8 flex gap-4">
                            {[
                                { label: "Days", val: d },
                                { label: "Hrs", val: h },
                                { label: "Min", val: m },
                                { label: "Sec", val: s },
                            ].map((item, i) => (
                                <div key={i} className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-md border border-white/10 w-20">
                                    <div className="text-2xl font-serif font-bold text-gold">{item.val.toString().padStart(2, "0")}</div>
                                    <div className="text-[10px] uppercase tracking-widest text-white/40">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl bg-white p-10 text-primary shadow-2xl animate-fade-up delay-200">
                        <h3 className="mb-6 text-2xl font-serif font-bold">Secure Your VIP Reservation</h3>
                        <p className="mb-8 text-sm text-zinc-500 font-light">Join the elite program today and credit $397 toward your treatment deposit.</p>
                        <form className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <input type="text" placeholder="First Name" className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-sm focus:border-gold outline-none transition-all" />
                                <input type="text" placeholder="Last Name" className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-sm focus:border-gold outline-none transition-all" />
                            </div>
                            <input type="email" placeholder="Email Address" className="w-full rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-sm focus:border-gold outline-none transition-all" />
                            <input type="tel" placeholder="Phone Number" className="w-full rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-sm focus:border-gold outline-none transition-all" />
                            <button className="w-full rounded-xl bg-primary py-5 text-lg font-bold text-white shadow-xl hover:bg-gold transition-all duration-300 transform hover:scale-[1.02]">
                                JOIN THE VIP PROGRAM
                            </button>
                        </form>
                        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-zinc-400 font-light">
                            <span>🔒 Secure 256-bit Encryption</span>
                            <span className="h-4 w-px bg-zinc-200"></span>
                            <span>⭐️ High-Quality Guarantee</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Inclusions - Scannable Grid */}
            <section className="py-24 px-6 bg-white">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-20 text-center">
                        <h2 className="text-4xl font-serif font-bold text-primary">The Ultimate Smile Vacation <br /><span className="text-gold text-2xl italic font-light tracking-wide">Everything is Included</span></h2>
                        <div className="mx-auto mt-6 h-1 w-24 bg-gold"></div>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { title: "Roundtrip Flights", desc: "Coordinated travel tailored to your schedule.", icon: "✈" },
                            { title: "5-Star Resort", desc: "Luxury accommodations and all-inclusive comfort.", icon: "🏨" },
                            { title: "Private Transfers", desc: "Chauffeur service from airport to resort and clinic.", icon: "🚘" },
                            { title: "Personal Concierge", desc: "Dedicated host for all logistics and local needs.", icon: "🤝" },
                            { title: "Smile Design Appt", desc: "Complete assessment often done in a single visit.", icon: "✨" },
                            { title: "German Materials", desc: "Premium Zirconia and E-Max manufactured in Germany.", icon: "🇩🇪" },
                            { title: "Patient Preferred", desc: "Flexible financing options subject to approval.", icon: "💳" },
                            { title: "Warranty Terms", desc: "Written plan and long-term security for procedures.", icon: "📜" },
                        ].map((item, i) => (
                            <div key={i} className="group rounded-2xl border border-zinc-100 bg-zinc-50/50 p-8 transition-all hover:bg-white hover:shadow-xl">
                                <div className="mb-4 text-3xl opacity-80">{item.icon}</div>
                                <h4 className="mb-2 font-bold text-primary">{item.title}</h4>
                                <p className="text-sm text-zinc-500 font-light leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience & Trust Section */}
            <section className="py-24 px-6 bg-zinc-50 border-t border-zinc-100">
                <div className="mx-auto max-w-7xl grid gap-16 md:grid-cols-2 items-center">
                    <div className="relative aspect-video overflow-hidden rounded-3xl shadow-2xl">
                        <Image
                            src="/redesign/PHOTO-2025-12-17-21-07-18 3.jpg"
                            alt="State of the art technology"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-primary/20"></div>
                    </div>
                    <div className="space-y-8">
                        <div>
                            <h2 className="mb-6 text-3xl font-serif font-bold text-primary">World-Class Care and Trust</h2>
                            <p className="text-lg text-zinc-600 font-light leading-relaxed">
                                Treatment led by internationally experienced specialists using modern technology and premium materials commonly used in U.S. dentistry. We follow strict sterilization and safety protocols and provide written plan and warranty terms for qualifying procedures.
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="p-4 rounded-xl border border-gold/20 bg-gold/5">
                                <h4 className="font-bold text-gold text-sm tracking-widest uppercase">Specialists</h4>
                                <p className="text-sm text-primary">Internationally Trained</p>
                            </div>
                            <div className="p-4 rounded-xl border border-gold/20 bg-gold/5">
                                <h4 className="font-bold text-gold text-sm tracking-widest uppercase">Protocol</h4>
                                <p className="text-sm text-primary">Strict US-Standard Safety</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3-Step Flow */}
            <section className="py-24 px-6 bg-white">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-serif font-bold">What happens after you reserve</h2>
                        <p className="mt-4 text-zinc-500 font-light">Three simple steps to your new smile.</p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            { step: "01", title: "Priority Scheduling", desc: "Your VIP priority status is secured. We begin blocks based on demand and seasonality." },
                            { step: "02", title: "Concierge Coordination", desc: "We confirm your travel window, resort details, transfers, and clinical itinerary." },
                            { step: "03", title: "Candidacy Review", desc: "Our specialists review your case and confirm your appropriate timeline and data." }
                        ].map((item, i) => (
                            <div key={i} className="relative p-8 rounded-2xl bg-zinc-50 text-center">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-gold text-xl font-serif font-bold shadow-lg">
                                    {item.step}
                                </div>
                                <h4 className="mb-3 font-bold text-primary">{item.title}</h4>
                                <p className="text-sm text-zinc-500 font-light leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Payment Section */}
            <section className="py-24 px-6 bg-primary text-white">
                <div className="mx-auto max-w-7xl grid gap-16 md:grid-cols-2">
                    <div>
                        <h2 className="mb-8 text-4xl font-serif font-bold text-white">How Payment Works</h2>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="h-6 w-6 shrink-0 text-gold font-bold">✓</div>
                                <p className="text-white/80 font-light"><span className="font-bold text-white">30% Treatment Deposit</span> is required for all patients to secure clinical time and materials.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-6 w-6 shrink-0 text-gold font-bold">✓</div>
                                <p className="text-white/80 font-light"><span className="font-bold text-white">$397 Reservation Credit</span> is applied directly toward your 30% deposit.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-6 w-6 shrink-0 text-gold font-bold">✓</div>
                                <p className="text-white/80 font-light">Remaining balance is calculated after clinical itinerary confirmation.</p>
                            </div>
                        </div>

                        <div className="mt-12 p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                            <h4 className="mb-4 font-bold text-gold uppercase tracking-widest text-xs">Estimated Package Value</h4>
                            <div className="text-5xl font-serif font-bold text-white">$9,397</div>
                            <p className="mt-2 text-xs text-white/50">*Based on typical retail rates; may vary by season and availability.</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h3 className="text-2xl font-serif font-bold">Choose how to pay the remaining balance</h3>
                        <div className="grid gap-6">
                            <div className="p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
                                <div className="mb-4 text-gold font-bold uppercase tracking-widest text-xs">Option A</div>
                                <h4 className="mb-3 text-xl font-bold">Financing (Patient Preferred)</h4>
                                <p className="text-sm text-white/60 font-light leading-relaxed">Apply for a plan. Approval and APR (including 0% when available) depend on terms.</p>
                            </div>
                            <div className="p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
                                <div className="mb-4 text-gold font-bold uppercase tracking-widest text-xs">Option B</div>
                                <h4 className="mb-3 text-xl font-bold">Pay at the Clinic</h4>
                                <p className="text-sm text-white/60 font-light leading-relaxed">Pay at the time of treatment. Timing and accepted methods confirmed in written plan.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Table - Savings Language */}
            <section className="py-24 px-6 bg-white">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-serif font-bold text-primary">Smart Investment in Your Smile</h2>
                        <p className="mt-4 text-zinc-500 font-light max-w-2xl mx-auto">Exact savings vary by treatment plan, materials, resort seasonality, and travel window.</p>
                    </div>
                    <div className="overflow-hidden rounded-3xl border border-zinc-100 shadow-2xl">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50 border-b border-zinc-100">
                                <tr>
                                    <th className="p-6 font-bold text-primary text-sm uppercase tracking-widest">Treatment Package</th>
                                    <th className="p-6 font-bold text-primary text-sm uppercase tracking-widest">Approx. US Price</th>
                                    <th className="p-6 font-bold text-gold text-sm uppercase tracking-widest">VIP Cancun Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {[
                                    { t: "Non-Invasive Nanotech (20)", u: "$35,000", v: "$5,500" },
                                    { t: "Non-Invasive Porcelain (20)", u: "$45,000", v: "$6,500" },
                                    { t: "Non-Invasive Zirconia (20)", u: "$50,000", v: "$7,500" },
                                    { t: "All-on-4 (per arch)", u: "$35,000", v: "$12,500" },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="p-6">
                                            <div className="font-bold text-primary">{row.t}</div>
                                            <div className="text-[10px] text-zinc-400 uppercase tracking-tighter">Full Mouth Reconstruction</div>
                                        </td>
                                        <td className="p-6 text-zinc-400 font-light">{row.u}</td>
                                        <td className="p-6 font-bold text-primary text-xl">{row.v}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* WhatsApp CTA & QR */}
            <section className="py-24 px-6 bg-zinc-50 border-y border-zinc-100">
                <div className="mx-auto max-w-5xl text-center">
                    <h2 className="mb-12 text-4xl font-serif font-bold text-primary">Ready to elevate your experience?</h2>
                    <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:text-left">
                        <div className="rounded-2xl bg-white p-6 shadow-xl border border-zinc-100">
                            {/* QR Placeholder */}
                            <div className="h-48 w-48 bg-zinc-50 flex items-center justify-center border-2 border-dashed border-gold/30 rounded-lg">
                                <div className="text-center p-4">
                                    <div className="text-2xl mb-2 text-gold">📱</div>
                                    <div className="text-[10px] uppercase font-bold text-zinc-400">Scan for WhatsApp</div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-primary">Book via WhatsApp</h3>
                            <p className="text-zinc-500 font-light">Message our VIP concierge directly for instant support.</p>
                            <a
                                href="https://wa.me/529841145997"
                                className="inline-flex items-center gap-4 rounded-full bg-[#25D366] px-10 py-4 text-white font-bold shadow-lg hover:brightness-110 transition-all"
                            >
                                +52 984 114 5997
                            </a>
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

            {/* Compliance Notes */}
            <section className="py-12 px-6">
                <div className="mx-auto max-w-5xl">
                    <p className="text-[10px] text-zinc-400 font-light leading-relaxed text-center uppercase tracking-widest">
                        Medical and financial information is general and not a guarantee of results. Treatment candidacy is required and
                        varies by case. Travel, resort, and pricing are subject to availability and seasonal changes. Savings comparisons vary
                        by procedure and region. © {new Date().getFullYear()} Dental Solutions Cancun - Puerto Cancun | VIP Smile Transformation Package. <a href="/privacy" className="underline hover:text-gold transition-colors">Privacy Policy</a>
                    </p>
                </div>
            </section>

        </div>
    );
}
