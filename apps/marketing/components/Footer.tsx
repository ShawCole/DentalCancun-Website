import React from "react";
import Image from "next/image";

export const Footer = () => {
    return (
        <footer className="bg-primary py-20 text-white px-6">
            <div className="mx-auto max-w-7xl grid gap-12 md:grid-cols-4">
                <div className="col-span-2">
                    <div className="mb-6 relative h-20 w-48">
                        <Image
                            src="/redesign/DentalSolutions_Logo_Stacked.png"
                            alt="Dental Solutions"
                            fill
                            className="object-contain object-left invert brightness-0"
                        />
                    </div>
                    <p className="max-w-md text-white/60 mb-8 font-light leading-relaxed">
                        Leading the way in cosmetic dental tourism. We combine unparalleled medical expertise with a premium vacation experience in the heart of Cancun.
                    </p>
                    <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors cursor-pointer">f</div>
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors cursor-pointer">i</div>
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors cursor-pointer">y</div>
                    </div>
                </div>
                <div>
                    <h4 className="mb-6 font-bold text-gold uppercase tracking-widest text-sm">Quick Links</h4>
                    <ul className="space-y-4 text-white/70">
                        <li><a href="#" className="hover:text-gold transition-colors">Veneers</a></li>
                        <li><a href="#" className="hover:text-gold transition-colors">Dental Implants</a></li>
                        <li><a href="#" className="hover:text-gold transition-colors">Smile Makeover</a></li>
                        <li><a href="/vip" className="hover:text-gold transition-colors">VIP Program</a></li>
                        <li><a href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="mb-6 font-bold text-gold uppercase tracking-widest text-sm">Contact Us</h4>
                    <p className="text-white/70 mb-4 font-light">
                        Blvd. Kukulcan Km 12.5, <br />
                        Cancun Hotel Zone, Mexico
                    </p>
                    <p className="text-xl font-bold">+52 984 114 5997</p>
                </div>
            </div>
            <div className="mx-auto mt-20 max-w-7xl border-t border-white/10 pt-8 text-center text-sm text-white/40">
                © {new Date().getFullYear()} Dental Solutions. All rights reserved. Professional treatments conducted by licensed specialists.
            </div>
        </footer>
    );
};
