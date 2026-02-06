"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export const Header = ({ forceSolid = false }: { forceSolid?: boolean }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        handleScroll(); // Check initial scroll position
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const solid = forceSolid || isScrolled;

    return (
        <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${solid ? "bg-white/95 py-4 shadow-lg backdrop-blur-md" : "bg-transparent py-6"}`}>
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
                <a href="/" className={`relative transition-opacity hover:opacity-90`}>
                    {/* Desktop: Flat Logo */}
                    <div className="hidden lg:block relative h-12 w-64">
                        <Image
                            src="/redesign/DentalSolutions_Logo_Flat.png"
                            alt="Dental Solutions"
                            fill
                            className="object-contain object-left"
                        />
                    </div>
                    {/* Tablet/Mobile: Stacked Logo */}
                    <div className="hidden sm:block lg:hidden relative h-16 w-40">
                        <Image
                            src="/redesign/DentalSolutions_Logo_Stacked.png"
                            alt="Dental Solutions"
                            fill
                            className="object-contain object-left"
                        />
                    </div>
                    {/* Tiny: Favicon */}
                    <div className="block sm:hidden relative h-10 w-10">
                        <Image
                            src="/redesign/DentalSolutions_Favicon.png"
                            alt="Dental Solutions"
                            fill
                            className="object-contain"
                        />
                    </div>
                </a>
                <div className={`hidden space-x-8 md:flex ${solid ? "text-charcoal" : "text-white"}`}>
                    <a href="/" className="text-sm font-medium hover:text-gold transition-colors">Home</a>
                    <a href="/stories" className="text-sm font-medium hover:text-gold transition-colors">Success Stories</a>
                    <a href="/vip" className="text-sm font-medium hover:text-gold transition-colors">VIP Program</a>
                    <a href="/schedule" className="text-sm font-medium hover:text-gold transition-colors">Prices</a>
                </div>
                <a href="/vip" className="rounded-full bg-gold px-6 py-2 text-sm font-semibold text-white hover:bg-primary transition-all duration-300">
                    Book Consultation
                </a>
            </div>
        </nav>
    );
};
