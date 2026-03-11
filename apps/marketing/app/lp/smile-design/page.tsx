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

            {/* 1. HERO SECTION */}
            <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-neutral-900">
                {/* Background — real clinic photo, swap when Franklin provides new assets */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('/redesign/PHOTO-2025-12-17-21-07-18%205.jpg')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                </div>

                {/* Trust badge */}
                <div className="relative z-20 flex items-center gap-2 mb-6 animate-in fade-in duration-700">
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => (
                            <span key={i} className="text-[#D4AF37] text-sm">&#9733;</span>
                        ))}
                    </div>
                    <span className="text-white/60 text-sm font-medium tracking-wide">25 Years &middot; Master&apos;s Degree</span>
                </div>

                {/* Headline */}
                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white leading-[1.1]">
                        Fly In Friday.<br />
                        Get Your Dream Smile.<br />
                        <span className="text-[#D4AF37] italic">Fly Home Sunday.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
                        Boutique cosmetic dentistry by Dr.&nbsp;Carolina Aguirre,&nbsp;M.S. &mdash; 25&nbsp;years of precision, steps from the Grand&nbsp;Hyatt, 15&nbsp;minutes from Cancun&nbsp;Airport.
                    </p>

                    {/* CTAs */}
                    <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="https://wa.me/529841145997?text=Hi%2C%20I%27d%20like%20to%20get%20a%20smile%20consultation.%20Here%20are%20my%20photos%3A"
                            className="bg-[#D4AF37] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#c5a030] transition-all hover:scale-105 shadow-xl shadow-[#D4AF37]/20 flex items-center gap-2"
                        >
                            Send Your Photos &rarr; Get Your Plan
                        </Link>
                        <div className="flex gap-3">
                            <Link
                                href="https://wa.me/529841145997"
                                className="bg-[#25D366] text-white px-6 py-4 rounded-full text-lg font-medium hover:bg-[#20bd5a] transition-all shadow-lg flex items-center gap-2"
                            >
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                WhatsApp
                            </Link>
                            <Link
                                href="tel:+529841145997"
                                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-4 rounded-full text-lg font-medium hover:bg-white/20 transition-all"
                            >
                                Call Now
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Trust bar */}
                <div className="relative z-20 mt-12 w-full max-w-3xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: "Grand Hyatt Building", icon: "🏨" },
                            { label: "15 Min from Airport", icon: "✈️" },
                            { label: "25 Years Experience", icon: "🎓" },
                            { label: "Smile in a Weekend", icon: "✨" },
                        ].map((item) => (
                            <div key={item.label} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-center">
                                <span className="text-lg">{item.icon}</span>
                                <p className="text-white/80 text-xs font-medium mt-1 tracking-wide">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
                    <div className="h-10 w-6 rounded-full border-2 border-white/30 flex justify-center p-1">
                        <div className="h-2 w-1 bg-white rounded-full"></div>
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

            {/* 5. LOGIC: Why Us & Is This For You */}
            <section className="py-24 bg-neutral-950 text-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-3">Boutique Precision</h2>
                        <h3 className="text-3xl md:text-5xl font-serif">Why Patients Choose Dr.&nbsp;Carolina</h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-20">
                        {[
                            { icon: "🔬", title: "Premium Materials", desc: "Gold-diamond, carbon diamonds, and zirconia — certified authentic. No compromises on what goes in your mouth." },
                            { icon: "🤲", title: "Minimally Invasive", desc: "We preserve your natural tooth structure. Conservative adhesive protocols mean less drilling, faster recovery." },
                            { icon: "👁️", title: "Facial Analysis", desc: "Proportions tailored to your face — not a one-size-fits-all template. Your smile, designed for you." },
                            { icon: "🏗️", title: "In-House Fabrication", desc: "Veneers crafted in our specialized lab. No outsourcing, no waiting weeks for a third party." },
                            { icon: "✨", title: "Try Before You Commit", desc: "A physical mock-up lets you see and feel the result before final bonding. Full confidence, zero surprises." },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group">
                                <span className="text-3xl block mb-4">{item.icon}</span>
                                <h4 className="text-lg font-bold mb-2 group-hover:text-[#D4AF37] transition-colors">{item.title}</h4>
                                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Is This For You */}
                    <div className="max-w-2xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-serif text-center mb-10">Is This For You?</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                "Small or uneven teeth",
                                "Gaps between teeth",
                                "Surface wear or chips",
                                "Stains or discoloration",
                                "Small fractures",
                                "Want a better smile?",
                            ].map((item, i) => (
                                <div key={i} className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl px-4 py-3 text-center">
                                    <p className="text-white/90 text-sm font-medium">{item}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-white/40 text-sm mt-6">If any of these sound like you, send us your photos and we&apos;ll tell you exactly what&apos;s possible.</p>
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
