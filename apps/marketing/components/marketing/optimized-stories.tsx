'use client';

import { VideoCarousel, type VideoTestimonialData } from './video-carousel';

const VIDEO_TESTIMONIALS: VideoTestimonialData[] = [
    { url: "https://storage.googleapis.com/msgsndr/f0ZNnBBOAnxnYbXCHsB5/media/691b6793379d2316b471e21a.mp4", name: "Micaela's Transformation" },
    { url: "https://storage.googleapis.com/msgsndr/f0ZNnBBOAnxnYbXCHsB5/media/691b660c14eb6a868a001d8f.mp4", name: "Moshi's New Smile", muteWindow: [10.82, 10.98] },
    { url: "https://storage.googleapis.com/msgsndr/dq3ylOAKb1QTcAeFKnwl/media/6974750759a77b9387a9f4c8.mp4", name: "Moë's Confidence", muteDuration: 0.5, scale: 1.08 },
    { url: "https://storage.googleapis.com/msgsndr/f0ZNnBBOAnxnYbXCHsB5/media/691b73b1013f312fd4892a65.mp4", name: "Nara's Experience" },
    { url: "https://storage.googleapis.com/msgsndr/dq3ylOAKb1QTcAeFKnwl/media/6974756ea87beb425d7caaae.mp4", name: "Gonzalo's Journey", startTime: 0.8 },
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
