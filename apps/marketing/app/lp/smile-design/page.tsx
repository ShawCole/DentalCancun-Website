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
                    <p className="text-xl md:text-2xl text-white/90 font-bold tracking-wide uppercase">
                        No-Prep Veneers. No Drilling. No Pain.
                    </p>
                    <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
                        Boutique cosmetic dentistry by Dr.&nbsp;Carolina Aguirre,&nbsp;M.S. &mdash; 25&nbsp;years of precision, 15&nbsp;minutes from Cancun&nbsp;Airport.
                    </p>

                    {/* CTAs */}
                    <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="https://wa.me/529841145997?text=Hi%2C%20I%27d%20like%20a%20free%20smile%20assessment.%20No%20obligation."
                            className="bg-[#D4AF37] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#c5a030] transition-all hover:scale-105 shadow-xl shadow-[#D4AF37]/20 flex items-center gap-2"
                        >
                            See What&apos;s Possible &rarr; Free Assessment
                        </Link>
                        <Link
                            href="https://wa.me/529841145997"
                            className="bg-[#25D366] text-white px-6 py-4 rounded-full text-lg font-medium hover:bg-[#20bd5a] transition-all shadow-lg flex items-center gap-2"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            WhatsApp Us
                        </Link>
                    </div>
                    <p className="pt-3 text-white/40 text-sm tracking-wide">Free consultation &middot; No obligation &middot; Response within 24h</p>
                </div>

                {/* Trust bar */}
                <div className="relative z-20 mt-12 w-full max-w-3xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: "500+ Happy Smiles", icon: "😁" },
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

            {/* 2. SAVINGS BANNER */}
            <div className="py-14 bg-white border-b border-neutral-100">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <p className="text-sm font-bold tracking-[0.2em] text-amber-600 uppercase mb-3">Smart Investment</p>
                    <p className="text-3xl md:text-4xl font-serif text-neutral-900">
                        Save <span className="text-[#D4AF37] font-bold">60&ndash;70%</span> compared to the U.S.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-8">
                        <div className="bg-neutral-100 rounded-xl px-8 py-5 text-center">
                            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">U.S. Price</p>
                            <p className="text-2xl font-serif text-neutral-400 line-through">$20,000 &ndash; $40,000</p>
                        </div>
                        <span className="text-2xl text-[#D4AF37] font-bold hidden sm:block">&rarr;</span>
                        <div className="bg-amber-50 border-2 border-[#D4AF37]/30 rounded-xl px-8 py-5 text-center">
                            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">Cancun Price</p>
                            <p className="text-2xl font-serif font-bold text-neutral-900">$3,500 &ndash; $8,000</p>
                        </div>
                    </div>
                    <p className="text-neutral-500 mt-6 text-lg">
                        Same premium materials. Same world-class results. A fraction of the price.
                    </p>
                </div>
            </div>

            {/* 3. SCROLL TIMELINE: VIP Concierge */}
            <VIPConcierge />

            {/* 3. MEET DR. CAROLINA */}
            <section className="py-24 bg-neutral-50">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-sm font-bold tracking-[0.2em] text-amber-600 uppercase mb-3">Your Smile Designer</h2>
                        <h3 className="text-3xl md:text-5xl font-serif">Meet Dr.&nbsp;Carolina</h3>
                    </div>

                    <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
                        <div className="w-full md:w-2/5 flex-shrink-0">
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://assets.cdn.filesafe.space/dq3ylOAKb1QTcAeFKnwl/media/69b9dc5dad02768b3f5ce10f.jpeg"
                                    alt="Dr. Carolina Aguirre — Cosmetic Dentist"
                                    width={400}
                                    height={533}
                                    loading="eager"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-3/5 space-y-6">
                            <p className="text-lg md:text-xl text-neutral-700 leading-relaxed">
                                With over 25 years of specialization in aesthetic and cosmetic dentistry, Dr. Carolina has transformed thousands of smiles using the latest techniques in non-invasive and minimally invasive veneer treatments.
                            </p>
                            <p className="text-lg md:text-xl text-neutral-700 leading-relaxed">
                                Her passion for creating natural, beautiful smiles combined with her meticulous attention to detail has made her one of the most sought-after smile designers in Quintana Roo, Mexico.
                            </p>
                            <p className="text-lg md:text-xl text-neutral-700 leading-relaxed">
                                Dr. Carolina&apos;s expertise in working with premium German composites and her artistic approach to smile design ensures that every patient receives personalized, stunning results that enhance their natural beauty and boost their confidence.
                            </p>
                            <div className="flex flex-wrap gap-3 pt-2">
                                {["25+ Years Experience", "Aesthetic Specialist", "Thousands of Smiles"].map((tag) => (
                                    <span key={tag} className="bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. BEFORE & AFTER */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold tracking-[0.2em] text-amber-600 uppercase mb-3">Real Results</h2>
                        <h3 className="text-3xl md:text-5xl font-serif">Before &amp; After</h3>
                    </div>

                    <div className="space-y-12">
                        {[
                            {
                                name: "Benjamin",
                                before: "https://assets.cdn.filesafe.space/dq3ylOAKb1QTcAeFKnwl/media/6974756ec1fa0c89a53ba47f.jpg",
                                after: "https://assets.cdn.filesafe.space/dq3ylOAKb1QTcAeFKnwl/media/6974756ed4fb907676826e1b.jpg",
                            },
                            {
                                name: "Jessica",
                                before: "https://assets.cdn.filesafe.space/dq3ylOAKb1QTcAeFKnwl/media/6974756e59a77b0352a9ff38.jpg",
                                after: "https://assets.cdn.filesafe.space/dq3ylOAKb1QTcAeFKnwl/media/6974756ed4fb900460826e1d.jpg",
                            },
                        ].map((patient) => (
                            <div key={patient.name} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={patient.before}
                                            alt={`${patient.name} before treatment`}
                                            loading="lazy"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                        <span className="absolute top-3 left-3 bg-neutral-900/70 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">Before</span>
                                    </div>
                                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={patient.after}
                                            alt={`${patient.name} after treatment`}
                                            loading="lazy"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                        <span className="absolute top-3 left-3 bg-[#D4AF37] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">After</span>
                                    </div>
                                </div>
                                <p className="text-center font-serif font-bold text-neutral-700 text-sm">{patient.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MID-PAGE CTA */}
            <div className="py-16 bg-neutral-900 text-center px-4">
                <p className="text-white/60 text-2xl md:text-3xl font-serif mb-4">Ready to see what&apos;s possible?</p>
                <p className="text-[#D4AF37]/80 text-sm font-bold uppercase tracking-widest mb-6">Limited openings each month &middot; Spots filling fast</p>
                <Link
                    href="https://wa.me/529841145997?text=Hi%2C%20I%27d%20like%20a%20free%20smile%20assessment.%20No%20obligation."
                    className="inline-flex items-center gap-2 bg-[#D4AF37] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#c5a030] transition-all hover:scale-105 shadow-xl shadow-[#D4AF37]/20"
                >
                    Get Your Free Assessment
                </Link>
                <p className="mt-3 text-white/30 text-sm">No obligation &middot; Takes 2 minutes</p>
            </div>

            {/* 5. DEFINITION */}
            <section className="py-24 bg-neutral-50 border-b border-neutral-100">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-sm font-bold tracking-[0.2em] text-amber-600 uppercase mb-6">The Definition</h2>
                    <p className="text-2xl md:text-3xl font-serif leading-relaxed text-neutral-800">
                        &quot;Non-invasive veneers are ultra-thin, highly aesthetic porcelain or ceramic shells that are bonded to the surface of the teeth with <span className="text-amber-600 font-bold bg-amber-50 px-2 italic">minimal or no tooth reduction</span>. The goal is to improve the shape, size, color, and proportion of your teeth while preserving their natural structure.&quot;
                    </p>
                </div>
            </section>

            {/* 6. PROOF: Video Testimonials */}
            <OptimizedStories />

            {/* 7. LOGIC: Why Us & Is This For You */}
            <section className="py-24 bg-neutral-950 text-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-3">Boutique Precision</h2>
                        <h3 className="text-3xl md:text-5xl font-serif">Why Patients Choose Dr.&nbsp;Carolina</h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-20">
                        {[
                            { icon: "💎", title: "Same Materials, Fraction of the Price", desc: "Gold-diamond, carbon diamonds, and zirconia — the same premium materials used in the US. $15k here vs $40–50k stateside." },
                            { icon: "✈️", title: "Weekend Turnaround", desc: "Fly in Friday, get your dream smile, fly home Sunday. Non-invasive veneers done in a single trip." },
                            { icon: "🎓", title: "25 Years of Expertise", desc: "Dr. Carolina Aguirre holds a Master's degree and has 25 years of precision cosmetic dentistry experience." },
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
                        <p className="text-center text-white/40 text-sm mt-6">If any of these sound like you, find out what&apos;s possible &mdash; completely free.</p>

                        <div className="mt-10 text-center">
                            <Link
                                href="https://wa.me/529841145997?text=Hi%2C%20I%20think%20I%20may%20be%20a%20candidate.%20Can%20I%20get%20a%20free%20assessment%3F"
                                className="inline-flex items-center gap-2 bg-[#D4AF37] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#c5a030] transition-all hover:scale-105 shadow-xl shadow-[#D4AF37]/20"
                            >
                                Am I a Candidate? Find Out Free
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. TRUST & SAFETY */}
            <section className="py-24 bg-neutral-50">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-6">
                        <h2 className="text-sm font-bold tracking-[0.2em] text-amber-600 uppercase mb-3">Peace of Mind</h2>
                        <h3 className="text-3xl md:text-5xl font-serif text-neutral-900">Your Safety Is Our Priority &mdash;<br className="hidden md:block" /> From Start to Finish</h3>
                    </div>
                    <p className="text-center text-neutral-500 text-lg max-w-2xl mx-auto mb-16">
                        We know the biggest question isn&apos;t cost &mdash; it&apos;s trust. Here&apos;s how we protect every patient who travels to us.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { icon: "🛡️", title: "FDA-Approved Materials", desc: "We use the same FDA-approved brands and certifications required in top U.S. clinics. No substitutes, no compromises — identical materials to what your dentist at home would use." },
                            { icon: "🧪", title: "International Sterilization Standards", desc: "Our clinic follows strict international sterilization protocols for every instrument, every procedure, every patient. Your safety is never negotiable." },
                            { icon: "📝", title: "Written Guarantee on Every Treatment", desc: "Every patient receives a written guarantee on their veneers. Your investment is protected — we stand behind our work with full accountability." },
                            { icon: "📞", title: "Continuous Follow-Up After You Return Home", desc: "Your care doesn't end when you board your flight. We provide ongoing follow-up support so you're never alone after treatment — even from thousands of miles away." },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-5 bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                                <div>
                                    <h4 className="text-lg font-bold text-neutral-900 mb-1">{item.title}</h4>
                                    <p className="text-neutral-600 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 9. FAQ & Philosophy */}
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

            {/* 10. ARE YOU A CANDIDATE? */}
            <section className="py-24 bg-neutral-950 text-white">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <h2 className="text-sm font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-3">The Right Fit</h2>
                    <h3 className="text-3xl md:text-5xl font-serif mb-12">Are You a Candidate?</h3>

                    <div className="space-y-6 text-left max-w-xl mx-auto">
                        {[
                            "You want a natural, aesthetic smile — not an obvious cosmetic look",
                            "You\u2019re looking for high-quality treatment, not low-cost dentistry",
                            "You\u2019re open to traveling for better results at a fraction of the price",
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <span className="text-[#D4AF37] text-xl mt-0.5">&#10003;</span>
                                <p className="text-lg text-white/80 leading-relaxed">{item}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 space-y-3">
                        <Link
                            href="https://wa.me/529841145997?text=Hi%2C%20I%27d%20like%20to%20check%20availability%20for%20a%20smile%20consultation."
                            className="inline-flex items-center gap-2 bg-[#D4AF37] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#c5a030] transition-all hover:scale-105 shadow-xl shadow-[#D4AF37]/20"
                        >
                            Check Availability
                        </Link>
                        <p className="text-white/30 text-sm">Free assessment &middot; No commitment required</p>
                    </div>
                </div>
            </section>

            {/* 11. CTA SECTION */}
            <section id="consultation" className="py-32 bg-neutral-900 text-white text-center px-4 relative overflow-hidden mb-[60px] md:mb-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="relative z-10 max-w-4xl mx-auto space-y-10">
                    <h2 className="text-4xl md:text-6xl font-serif leading-tight">
                        Your dream smile is one conversation away.
                    </h2>
                    <p className="text-[#D4AF37]/80 text-sm font-bold uppercase tracking-widest">
                        Limited openings each month &middot; Free assessment &middot; No obligation
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
                        <Link
                            href="https://wa.me/529841145997?text=Hi%2C%20I%27d%20like%20to%20schedule%20a%20free%20assessment%20for%20veneers."
                            className="bg-white text-neutral-900 px-10 py-5 rounded-full text-xl font-bold hover:bg-amber-400 hover:text-white transition-all shadow-2xl scale-100 hover:scale-105 duration-300"
                        >
                            Schedule Free Assessment
                        </Link>
                        <Link
                            href="https://wa.me/529841145997"
                            className="bg-transparent border-2 border-white/20 text-white px-10 py-5 rounded-full text-xl font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            WhatsApp Us Directly
                        </Link>
                    </div>
                </div>
            </section>

            <StickyMobileCTA />

        </main >
    );
}
