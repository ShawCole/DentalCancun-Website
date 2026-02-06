"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function RedesignHome() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen font-sans selection:bg-gold selection:text-white">
            <Header />

            {/* Hero Section */}
            <section className="relative h-screen w-full overflow-hidden">
                <div className="absolute inset-0 z-0 scale-105">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover brightness-[0.6]"
                        poster="/redesign/PHOTO-2025-12-17-21-07-18.jpg"
                    >
                        <source src="https://storage.googleapis.com/msgsndr/f0ZNnBBOAnxnYbXCHsB5/media/69209581ec01c107be9e5f7a.mp4" type="video/mp4" />
                    </video>
                </div>
                <div className="relative z-10 flex h-full items-center justify-center px-6">
                    <div className="max-w-4xl text-center">
                        <h1 className="mb-6 animate-fade-up text-5xl font-serif font-extrabold text-white md:text-7xl">
                            Designer Smiles <br />
                            <span className="text-gold italic">Engineered in Golden Hour</span>
                        </h1>
                        <p className="mb-10 animate-fade-up text-lg text-white/90 md:text-xl font-light tracking-wide delay-100">
                            Experience the pinnacle of dental tourism. Award-winning specialists, <br className="hidden md:block" />
                            luxury suites, and a world-class smile transformation with a view.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 animate-fade-up sm:flex-row delay-200">
                            <a href="/vip" className="rounded-full bg-gold px-10 py-4 text-lg font-bold text-white shadow-xl hover:bg-white hover:text-gold transition-all duration-300 transform hover:scale-105">
                                GET FREE QUOTE
                            </a>
                            <a href="/schedule" className="rounded-full border-2 border-white/50 bg-white/10 px-10 py-4 text-lg font-bold text-white backdrop-blur-sm hover:bg-white hover:text-primary transition-all duration-300 text-center">
                                VIEW TREATMENTS
                            </a>
                        </div>
                    </div>
                </div>
                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="h-10 w-6 rounded-full border-2 border-white/30 flex justify-center p-1">
                        <div className="h-2 w-1 bg-white rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* Trust & Results Section */}
            <section className="bg-white py-24 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-20 text-center">
                        <h2 className="mb-4 text-4xl font-serif font-bold text-primary">Experience the Difference</h2>
                        <div className="mx-auto h-1 w-24 bg-gold"></div>
                    </div>

                    <div className="grid gap-16 md:grid-cols-2 items-center">
                        <div className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl">
                            <Image
                                src="/redesign/PHOTO-2025-12-17-21-07-18 6.jpg"
                                alt="Happy Patient"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-white/90 p-6 shadow-xl backdrop-blur-md">
                                <p className="text-lg font-serif italic text-charcoal">
                                    "Choosing Dental Solutions was the best decision I've ever made. The facility is world-class and the results are life-changing."
                                </p>
                                <p className="mt-4 font-bold text-primary">— Sarah J., California</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="group border-l-4 border-gold bg-zinc-50 p-8 transition-all hover:bg-primary hover:text-white">
                                <h3 className="mb-2 text-xl font-bold group-hover:text-gold">World-Class Specialists</h3>
                                <p className="opacity-80">Our team consists of internationally trained experts dedicated to aesthetic perfection.</p>
                            </div>
                            <div className="group border-l-4 border-gold bg-zinc-50 p-8 transition-all hover:bg-primary hover:text-white">
                                <h3 className="mb-2 text-xl font-bold group-hover:text-gold">In-House Digital Lab</h3>
                                <p className="opacity-80">Precision and speed thanks to our cutting-edge CAD/CAM technology located on-site.</p>
                            </div>
                            <div className="group border-l-4 border-gold bg-zinc-50 p-8 transition-all hover:bg-primary hover:text-white">
                                <h3 className="mb-2 text-xl font-bold group-hover:text-gold">Luxury Concierge</h3>
                                <p className="opacity-80">From airport pickup to luxury accommodations, we handle every detail of your dental vacation.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vacation Destination Section */}
            <section className="relative h-[500px] overflow-hidden">
                <Image
                    src="/redesign/PHOTO-2025-12-17-21-07-18 5.jpg"
                    alt="Cancun View"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]"></div>
                <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
                    <div className="max-w-2xl text-white">
                        <h2 className="mb-6 text-4xl font-serif font-bold">The Ultimate <span className="text-gold">Dental Vacation</span></h2>
                        <p className="text-lg font-light leading-relaxed">
                            Recover in paradise. Our facility is located in the heart of Cancun's hotel zone, surrounded by turquoise waters and luxury amenities. We handle everything so you can focus on your new smile.
                        </p>
                    </div>
                </div>
            </section>
            <div className={`fixed bottom-8 right-8 z-40 transition-all duration-500 scale-0 ${isScrolled ? "scale-100" : ""}`}>
                <a href="/vip" className="flex items-center gap-3 rounded-full bg-primary p-4 pl-6 text-white shadow-2xl hover:bg-gold group transition-all duration-300">
                    <span className="font-bold">DESIGN YOUR SMILE</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-gold">
                        →
                    </div>
                </a>
            </div>

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

            {/* Footer */}
            <Footer />

        </div>
    );
}
