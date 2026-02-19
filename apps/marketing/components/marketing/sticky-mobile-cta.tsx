"use client"

import Link from 'next/link';
import { cn } from '@/lib/utils';

export function StickyMobileCTA() {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 p-4 flex gap-4 items-center animate-in slide-in-from-bottom duration-500">
            <Link
                href="https://wa.me/1234567890"
                className="flex-1 bg-green-600 text-white py-4 rounded-full text-center font-bold text-lg active:scale-95 transition-transform"
            >
                Direct WhatsApp
            </Link>
            <Link
                href="#consultation"
                className="flex-1 bg-[#D4AF37] text-white py-4 rounded-full text-center font-bold text-lg active:scale-95 transition-transform shadow-lg shadow-[#D4AF37]/20"
            >
                Check Availability
            </Link>
        </div>
    );
}
