"use client";
import Image from "next/image";
import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import clsx from "clsx";

const stories = [
    {
        name: "Sarah Jenkins",
        location: "Los Angeles, CA",
        treatment: "Full Set Porcelain Veneers",
        quote: "I never thought I could afford a smile this perfect. The experience in Cancun was better than any dental visit I've had in the US. It truly was a vacation for my smile.",
        image: "/redesign/result1.png",
    },
    {
        name: "Michael Chen",
        location: "Toronto, Canada",
        treatment: "All-on-4 Dental Implants",
        quote: "The professionalism and technology at Dental Solutions are top-notch. I saved over 60% compared to my local quotes, and the result is flawless.",
        image: "/redesign/result1.png",
    },
    {
        name: "Anna Rodriguez",
        location: "Miami, FL",
        treatment: "Hollywood Smile Makeover",
        quote: "From the concierge picking me up at the airport to the final reveal, everything was seamless. I feel like a new person with my designer smile.",
        image: "/redesign/result1.png",
    }
];

const videos = [
    { url: "https://storage.googleapis.com/msgsndr/f0ZNnBBOAnxnYbXCHsB5/media/691b6793379d2316b471e21a.mp4", name: "Sarah's Transformation" },
    { url: "https://storage.googleapis.com/msgsndr/f0ZNnBBOAnxnYbXCHsB5/media/691b660c14eb6a868a001d8f.mp4", name: "Michael's New Smile" },
    { url: "https://storage.googleapis.com/msgsndr/dq3ylOAKb1QTcAeFKnwl/media/6974750759a77b9387a9f4c8.mp4", name: "Anna's Confidence", muteDuration: 0.5 },
    { url: "https://storage.googleapis.com/msgsndr/f0ZNnBBOAnxnYbXCHsB5/media/691b73b1013f312fd4892a65.mp4", name: "David's Experience" },
    { url: "https://storage.googleapis.com/msgsndr/dq3ylOAKb1QTcAeFKnwl/media/6974756ea87beb425d7caaae.mp4", name: "Matteo's Journey", startTime: 0.8 },
];

const VideoTestimonial = ({ video }: { video: { url: string; name: string; startTime?: number; muteDuration?: number } }) => {
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const start = video.startTime ?? 0.1;

    const handleInteraction = (active: boolean) => {
        setIsHovered(active);
        if (videoRef.current) {
            if (active) {
                // Programmatic mute for specific duration if requested
                if (video.muteDuration) {
                    videoRef.current.muted = true;
                    setTimeout(() => {
                        if (videoRef.current) videoRef.current.muted = false;
                    }, video.muteDuration * 1000);
                } else {
                    videoRef.current.muted = false;
                }

                videoRef.current.play().catch(() => { });
            } else {
                videoRef.current.pause();
                videoRef.current.currentTime = start;
                videoRef.current.muted = false;
            }
        }
    };

    return (
        <div
            className="flex-shrink-0 w-[280px] md:w-[320px] group overflow-hidden rounded-2xl bg-zinc-100 shadow-xl transition-all hover:shadow-2xl mx-3 md:mx-6 cursor-pointer relative"
            onMouseEnter={() => handleInteraction(true)}
            onMouseLeave={() => handleInteraction(false)}
        >
            <div className="relative aspect-[9/16] bg-zinc-900 overflow-hidden">
                <video
                    ref={videoRef}
                    loop
                    playsInline
                    preload="metadata"
                    className={clsx(
                        "absolute inset-0 h-full w-full object-cover z-10 transition-transform duration-700",
                        isHovered ? "scale-105" : "scale-100"
                    )}
                >
                    <source src={`${video.url}#t=${start}`} type="video/mp4" />
                </video>

                {/* Scrim Overlay when not hovered */}
                <div className={clsx(
                    "absolute inset-0 z-20 bg-gradient-to-b from-black/20 via-transparent to-black/60 transition-opacity duration-500",
                    isHovered ? "opacity-0" : "opacity-100"
                )} />

                {/* Badge Overlay */}
                <div className="absolute bottom-4 left-4 z-30">
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                        <span className={clsx(
                            "flex h-1.5 w-1.5 rounded-full bg-gold",
                            isHovered && "animate-pulse"
                        )} />
                        <span className="text-[10px] text-white font-bold uppercase tracking-widest">{isHovered ? "Now Playing" : "Watch Story"}</span>
                    </div>
                </div>

                <div className={clsx(
                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-500",
                    isHovered ? "opacity-0 scale-150" : "opacity-0 scale-100"
                )}>
                    <div className="bg-white/20 backdrop-blur-xl p-6 rounded-full border border-white/30 shadow-2xl">
                        <svg className="w-10 h-10 text-white fill-current" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="p-6 bg-white border-t border-zinc-100 relative z-30">
                <p className="font-serif font-bold text-primary text-lg truncate group-hover:text-gold transition-colors">{video.name}</p>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-black italic">Verified Result</p>
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className="text-[10px] text-gold">★</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function StoriesPage() {
    const [activeStory, setActiveStory] = useState(0);

    return (
        <div className="min-h-screen bg-zinc-50 font-sans overflow-x-hidden">
            <style jsx global>{`
                @keyframes scroll {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(calc(-320px * 5 - 3rem * 5), 0, 0); }
                }
                .animate-scroll {
                    animation: scroll 60s linear infinite;
                    display: flex;
                    width: max-content;
                    will-change: transform;
                    backface-visibility: hidden;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            {/* Navigation Header */}
            <Header forceSolid={true} />

            {/* Hero Section */}
            <section className="bg-primary pt-32 pb-20 text-white px-6">
                <div className="mx-auto max-w-7xl text-center">
                    <h1 className="mb-4 text-5xl font-serif font-bold md:text-6xl">Success Stories</h1>
                    <p className="mx-auto max-w-2xl text-lg text-white/70 font-light">
                        Behind every smile is a journey. Explore how we&#39;ve helped patients from around the world regain their confidence and oral health.
                    </p>
                </div>
            </section>

            {/* Featured Before/After Slider */}
            <section className="py-24 px-6">
                <div className="mx-auto max-w-6xl">
                    <div className="grid gap-12 md:grid-cols-2 items-center">
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white p-2">
                            <Image
                                src={stories[activeStory].image}
                                alt="Before and After Results"
                                width={800}
                                height={600}
                                className="w-full h-auto rounded-xl"
                            />
                            <div className="absolute top-6 left-6 rounded-full bg-black/50 px-4 py-1 text-xs font-bold text-white backdrop-blur-sm">
                                BEFORE &amp; AFTER
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h2 className="mb-2 text-gold font-serif text-2xl italic">{stories[activeStory].treatment}</h2>
                                <h3 className="text-4xl font-serif font-bold text-primary">{stories[activeStory].name}</h3>
                                <p className="text-zinc-400 font-medium">{stories[activeStory].location}</p>
                            </div>

                            <blockquote className="border-l-4 border-gold pl-8 py-4">
                                <p className="text-xl font-serif italic text-charcoal leading-relaxed">
                                    &quot;{stories[activeStory].quote}&quot;
                                </p>
                            </blockquote>

                            <div className="flex gap-4">
                                {stories.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveStory(idx)}
                                        className={`h-3 w-3 rounded-full transition-all duration-300 ${activeStory === idx ? "bg-gold w-8" : "bg-zinc-300"}`}
                                    />
                                ))}
                            </div>

                            <a href="/vip" className="rounded-full bg-primary px-8 py-3 font-bold text-white hover:bg-gold transition-all duration-300 inline-block text-center">
                                START YOUR JOURNEY
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Infinite Video Testimonials Carousel */}
            <section className="bg-white py-24 overflow-hidden">
                <div className="mb-16 px-6 max-w-7xl mx-auto">
                    <h2 className="text-3xl font-serif font-bold text-primary">Patient Video Diaries</h2>
                    <div className="h-1 w-20 bg-gold mt-4"></div>
                </div>

                <div className="relative">
                    <div className="animate-scroll">
                        {/* First set of videos */}
                        {videos.map((video, i) => (
                            <VideoTestimonial key={`v1-${i}`} video={video} />
                        ))}
                        {/* Second set for seamless loop */}
                        {videos.map((video, i) => (
                            <VideoTestimonial key={`v2-${i}`} video={video} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gold py-20 px-6 text-center text-white">
                <h2 className="mb-8 text-4xl font-serif font-bold">Ready for Your Own Transformation?</h2>
                <a href="/vip" className="rounded-full bg-primary px-12 py-4 text-lg font-bold hover:bg-white hover:text-primary transition-all duration-300 shadow-xl inline-block">
                    FREE VIRTUAL CONSULTATION
                </a>
            </section>

            <Footer />
        </div>
    );
}
