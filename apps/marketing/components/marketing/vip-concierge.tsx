"use client"

import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useScrollProgress } from '@/hooks/use-scroll-progress';

interface Step {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
}

const VIP_STEPS: Step[] = [
    {
        id: 'consult',
        title: 'Virtual Consult',
        description: 'Send photos via WhatsApp. Receive Quote in 24h.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
    },
    {
        id: 'plan',
        title: 'The Plan',
        description: 'Review your Digital Smile Design.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
            </svg>
        ),
    },
    {
        id: 'arrival',
        title: 'Arrival',
        description: 'VIP Airport Pickup. Direct to Hotel.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.2c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.7.5-1.2z" />
            </svg>
        ),
    },
    {
        id: 'procedure',
        title: 'Procedure',
        description: '1-Day Treatment. Back to work Monday.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
        ),
    }
];

export function VIPConcierge() {
    const containerRef = useRef<HTMLDivElement>(null);
    const drawHeight = useScrollProgress(containerRef, 0.65);
    const [stepOffsets, setStepOffsets] = useState<number[]>([]);
    const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;
        const updateOffsets = () => {
            const offsets = stepsRef.current.map(el => {
                if (!el || !containerRef.current) return 0;
                return el.offsetTop;
            });
            setStepOffsets(offsets);
        };
        const timer = setTimeout(updateOffsets, 100);
        window.addEventListener('resize', updateOffsets);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateOffsets);
        };
    }, []);

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-3">
                        Your Itinerary
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-serif text-neutral-900">
                        Business Class Service
                    </h3>
                </div>

                <div ref={containerRef} className="relative max-w-3xl mx-auto flex gap-12 md:gap-20 pl-4 md:pl-0">
                    {/* TIMELINE TRACK */}
                    <div className="relative w-1 bg-neutral-100 rounded-full flex-shrink-0">
                        {/* THE GOLD LINE */}
                        <div
                            className="absolute top-0 left-0 w-full bg-[#D4AF37] rounded-full transition-all duration-75 ease-linear"
                            style={{ height: `${drawHeight}px` }}
                        >
                            {/* THE GLOWING DOT */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#D4AF37] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.6)] z-0">
                                <div className="absolute inset-0 bg-white rounded-full scale-50 animate-pulse" />
                            </div>
                        </div>

                        {/* STEP ICONS */}
                        <div className="absolute inset-0 pointer-events-none">
                            {VIP_STEPS.map((step, index) => {
                                const stepTop = stepOffsets[index] || 0;
                                const distance = drawHeight - stepTop;
                                const buffer = 60;

                                const isAtDot = Math.abs(distance) < buffer;
                                const isPassed = distance >= buffer;

                                return (
                                    <div
                                        key={step.id + '-icon'}
                                        className={cn(
                                            "absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 flex items-center justify-center bg-white transition-all duration-500 z-10",
                                            isAtDot
                                                ? "border-[#D4AF37] text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-110"
                                                : isPassed
                                                    ? "border-[#D4AF37] text-[#D4AF37]/70 scale-100"
                                                    : "border-neutral-200 text-neutral-300 scale-90"
                                        )}
                                        style={{ top: `${stepTop}px`, marginTop: '0.75rem' }}
                                    >
                                        <div className="scale-110 md:scale-125">
                                            {step.icon}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* STEPS CONTENT */}
                    <div className="flex-1 space-y-24 py-10">
                        {VIP_STEPS.map((step, index) => {
                            const stepTop = stepOffsets[index] || 0;
                            const distance = drawHeight - stepTop;
                            const isHighlight = distance >= -40;

                            return (
                                <div
                                    key={step.id}
                                    ref={el => { stepsRef.current[index] = el }}
                                    className={cn(
                                        "relative transition-all duration-500 pl-4 md:pl-8",
                                        isHighlight ? "opacity-100 translate-x-0" : "opacity-30 translate-x-4"
                                    )}
                                >
                                    <h4 className={cn(
                                        "text-2xl md:text-3xl font-serif font-bold mb-2 transition-colors",
                                        isHighlight ? "text-neutral-900" : "text-neutral-400"
                                    )}>
                                        {step.title}
                                    </h4>
                                    <p className="text-lg text-neutral-600 font-medium">
                                        {step.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-neutral-50 rounded-full border border-neutral-100">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-sm font-medium text-neutral-600">Concierge Desk: <span className="text-neutral-900 font-bold">Online</span></span>
                    </div>
                </div>
            </div>
        </section>
    );
}
