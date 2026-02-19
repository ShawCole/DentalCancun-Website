import Link from 'next/link';
import { OptimizedStories } from '@/components/marketing/optimized-stories';
import { VIPConcierge } from '@/components/marketing/vip-concierge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { StickyMobileCTA } from "@/components/marketing/sticky-mobile-cta";

export default function SmileDesignPage() {
    return (
        <main className="min-h-screen bg-white font-sans text-neutral-900 selection:bg-amber-100 selection:text-amber-900">

            {/* 1. HERO SECTION: Full-screen natural smile - SMART EFFICIENCY (Light/Clean) */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden bg-neutral-50">
                <div className="absolute inset-0 z-0">
                    {/* High-key, bright, professional imagery */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                </div>

                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-1000">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight text-neutral-900 leading-[1.1]">
                        Non-Invasive Veneers in Cancun <br />
                        <span className="text-amber-600">Natural Smile Without Tooth Reduction</span>
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto font-light leading-relaxed">
                        Transform your smile without grinding down your teeth, painlessly, and preserving as much of your natural tooth structure as possible.
                    </p>

                    <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center items-center">
                        <Link
                            href="#consultation"
                            className="bg-neutral-900 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-neutral-800 transition-all hover:scale-105 shadow-xl"
                        >
                            Schedule a consultation
                        </Link>
                        <div className="flex gap-4">
                            <Link
                                href="https://wa.me/1234567890"
                                className="bg-green-600 text-white px-6 py-4 rounded-full text-lg font-medium hover:bg-green-500 transition-all shadow-lg flex items-center gap-2"
                            >
                                <span>Direct WhatsApp</span>
                            </Link>
                            <Link
                                href="tel:+1234567890"
                                className="bg-transparent border border-neutral-300 text-neutral-600 px-6 py-4 rounded-full text-lg font-medium hover:bg-neutral-100 transition-all"
                            >
                                Call now
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. HOOK: Definition */}
            <section className="py-24 bg-neutral-50 border-b border-neutral-100">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-sm font-bold tracking-[0.2em] text-amber-600 uppercase mb-6">The Definition</h2>
                    <p className="text-2xl md:text-3xl font-serif leading-relaxed text-neutral-800">
                        &quot;Non-invasive veneers are ultra-thin, highly aesthetic porcelain or ceramic shells that are bonded to the surface of the teeth with <span className="text-amber-600 font-bold bg-amber-50 px-2 italic">minimal or no tooth reduction</span>. The goal is to improve the shape, size, color, and proportion of your teeth while preserving their natural structure.&quot;
                    </p>
                </div>
            </section>

            {/* 3. EASE: VIP Concierge */}
            <VIPConcierge />

            {/* 4. PROOF: Optimized Stories */}
            <OptimizedStories />

            {/* 5. LOGIC: Our Approach & Ideal Candidates */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16">
                        {/* Our Approach */}
                        <div>
                            <h3 className="text-3xl font-serif mb-8 border-b-2 border-amber-500 inline-block pb-2">Our Approach</h3>
                            <ul className="space-y-4">
                                {[
                                    "Digital Smile Design prior to treatment",
                                    "Mock-up to visualize the result before bonding",
                                    "Facial analysis and personalized proportions",
                                    "Highly translucent ceramic materials",
                                    "Conservative Adhesive Protocols",
                                    "Minimally Invasive Dentistry"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-lg text-neutral-700">
                                        <span className="text-amber-500 text-xl">✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Ideal Candidates - Clean Checklist Style */}
                        <div className="bg-white p-10 rounded-3xl border border-neutral-200 shadow-sm relative overflow-hidden">
                            <h3 className="text-3xl font-serif mb-8 text-neutral-900 relative z-10">Ideal Candidates</h3>
                            <ul className="space-y-4 relative z-10">
                                {[
                                    "Small teeth",
                                    "Gaps between teeth",
                                    "Minor wear",
                                    "Pigmentation or stains",
                                    "Small fractures",
                                    "Patients who want to improve their smile without tooth reduction"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-lg text-neutral-600">
                                        <span className="text-green-600 font-bold mt-1 text-xl">✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. PROCESS: 5-Step Breakdown */}
            <section className="py-24 bg-neutral-50">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-serif mb-4">The Process</h2>
                        <div className="h-1 w-20 bg-amber-500 mx-auto" />
                    </div>

                    <div className="space-y-8">
                        {[
                            { step: "01", title: "Clinical evaluation and digital analysis." },
                            { step: "02", title: "Personalized digital smile design." },
                            { step: "03", title: "Aesthetic trial (model)." },
                            { step: "04", title: "Veneer fabrication in a specialized laboratory." },
                            { step: "05", title: "Final adhesive bonding." }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-6 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-4xl font-serif font-bold text-amber-200">{item.step}</span>
                                <span className="text-xl font-medium text-neutral-800">{item.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. SAFETY: FAQ & Philosophy */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-4xl font-serif text-center mb-12">Frequently Asked Questions</h2>

                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {[
                            { q: "Is there really no tooth reduction?", a: "In most cases, there is no reduction. In specific situations, a minimal adjustment may be required to achieve harmony and a perfect fit." },
                            { q: "Do they look natural?", a: "Yes. We use high-aesthetic ceramics that mimic the translucency and texture of natural enamel." },
                            { q: "Do they require anesthesia?", a: "Generally, no. Since there is no deep tooth preparation, the procedure is usually comfortable and minimally invasive." },
                            { q: "How long do they last?", a: "With proper care, they can last for many years. Longevity depends on habits, bite, and maintenance." },
                            { q: "Can they be removed in the future?", a: "By preserving the tooth structure, the treatment is more conservative and offers greater flexibility compared to traditional techniques." },
                            { q: "Can they fall out?", a: "They are bonded using advanced adhesive protocols. The risk is low when the case is properly indicated." }
                        ].map((item, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="border rounded-lg px-4 bg-neutral-50">
                                <AccordionTrigger className="text-lg font-medium text-left hover:text-amber-600 hover:no-underline py-6">
                                    {item.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-neutral-600 text-lg leading-relaxed pb-6">
                                    {item.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    {/* Philosophy */}
                    <div className="mt-20 bg-amber-50 p-10 rounded-2xl border border-amber-100 text-center">
                        <h3 className="text-amber-600 font-bold uppercase tracking-widest mb-4 text-sm">Our Philosophy</h3>
                        <p className="text-2xl font-serif italic text-neutral-800 leading-relaxed">
                            &quot;We believe in conservative cosmetic dentistry. Our goal is to enhance your smile while respecting the natural tooth structure as much as possible and prioritizing health, function, and naturalness.&quot;
                        </p>
                    </div>
                </div>
            </section>

            {/* 8. CTA SECTION */}
            <section id="consultation" className="py-32 bg-neutral-900 text-white text-center px-4 relative overflow-hidden mb-[60px] md:mb-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="relative z-10 max-w-4xl mx-auto space-y-10">
                    <h2 className="text-4xl md:text-6xl font-serif leading-tight">
                        Schedule your personalized assessment and receive a treatment plan designed specifically for you.
                    </h2>
                    <p className="text-neutral-400 text-lg uppercase tracking-widest font-medium">
                        Payment options | Financing plans available
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
                        <button className="bg-white text-neutral-900 px-10 py-5 rounded-full text-xl font-bold hover:bg-amber-400 hover:text-white transition-all shadow-2xl scale-100 hover:scale-105 duration-300">
                            Schedule assessment
                        </button>
                        <button className="bg-transparent border-2 border-white/20 text-white px-10 py-5 rounded-full text-xl font-medium hover:bg-white/10 transition-colors">
                            Direct WhatsApp
                        </button>
                        <button className="text-white underline hover:text-amber-400 transition-colors text-lg">
                            Call now
                        </button>
                    </div>
                </div>
            </section>

            <StickyMobileCTA />

        </main >
    );
}
