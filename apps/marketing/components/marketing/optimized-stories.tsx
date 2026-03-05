'use client';

import { VideoCarousel, type VideoTestimonialData } from './video-carousel';

const VIDEO_TESTIMONIALS: VideoTestimonialData[] = [
    { url: "https://assets.cdn.filesafe.space/dq3ylOAKb1QTcAeFKnwl/media/69a9de407bdf3846d57b29d0.mp4", name: "Micaela's Transformation" },
    { url: "https://assets.cdn.filesafe.space/dq3ylOAKb1QTcAeFKnwl/media/69a9de407bdf380d017b29cf.mp4", name: "Moshi's New Smile" },
    { url: "https://assets.cdn.filesafe.space/dq3ylOAKb1QTcAeFKnwl/media/69a9de40c1e328bcdcc4f902.mp4", name: "Moë's Confidence", scale: 1.08 },
    { url: "https://assets.cdn.filesafe.space/dq3ylOAKb1QTcAeFKnwl/media/69a9de40bffadffa05b6ff91.mp4", name: "Nara's Experience" },
    { url: "https://assets.cdn.filesafe.space/dq3ylOAKb1QTcAeFKnwl/media/69a9de40b003fac523c58ecc.mp4", name: "Gonzalo's Journey", startTime: 0.8 },
];

export function OptimizedStories() {
    return (
        <section className="py-24 bg-neutral-900 text-white overflow-hidden">
            <div className="container mx-auto px-4 mb-12">
                <div className="text-center">
                    <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">
                        Results That <span className="text-gold italic">Speak</span>
                    </h2>
                    <p className="text-neutral-400 max-w-2xl mx-auto text-lg font-light">
                        Experience the transformation through the eyes of our patients.
                        A collection of journeys defined by excellence and natural beauty.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <div className="h-1 w-24 bg-gold/50 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Infinite Video Carousel */}
            <div className="relative">
                <VideoCarousel videos={VIDEO_TESTIMONIALS} />

                {/* Decorative elements to enhance the premium feel */}
                <div className="absolute top-1/2 -left-20 -translate-y-1/2 w-64 h-64 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-64 h-64 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
            </div>

            <div className="container mx-auto px-4 mt-16 text-center">
                <p className="text-neutral-500 text-sm uppercase tracking-[0.3em] font-medium">
                    Hover to play &bull; Authentic patient results
                </p>
            </div>
        </section>
    );
}
