'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

// Types
interface Story {
    id: string;
    thumbnail: string;
    videoUrl: string; // Embed URL
    title: string;
    patientName: string;
}

const SAMPLE_STORIES: Story[] = [
    {
        id: '1',
        thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop', // Sarah - Professional Headshot look
        videoUrl: 'https://storage.googleapis.com/msgsndr/f0ZNnBBOAnxnYbXCHsB5/media/691b6793379d2316b471e21a.mp4',
        title: 'Full Mouth Restoration',
        patientName: 'Sarah Jenkins',
    },
    {
        id: '2',
        thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop', // Michael - Suit/Corporate look
        videoUrl: 'https://storage.googleapis.com/msgsndr/f0ZNnBBOAnxnYbXCHsB5/media/691b660c14eb6a868a001d8f.mp4',
        title: 'Executive Implants',
        patientName: 'Michael Chen',
    },
    {
        id: '3',
        thumbnail: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop', // Anna - Polished look
        videoUrl: 'https://storage.googleapis.com/msgsndr/dq3ylOAKb1QTcAeFKnwl/media/6974750759a77b9387a9f4c8.mp4',
        title: 'Hollywood Smile',
        patientName: 'Anna Rodriguez',
    },
    {
        id: '4',
        thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop', // David - Casual yet premium
        videoUrl: 'https://storage.googleapis.com/msgsndr/f0ZNnBBOAnxnYbXCHsB5/media/691b73b1013f312fd4892a65.mp4',
        title: 'Confidence Reclaimed',
        patientName: 'David S.',
    },
];

export function StoriesCarousel() {
    return (
        <section className="py-20 bg-neutral-900 text-white">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">
                        Real Stories, <span className="text-amber-400 italic">Real Emotion</span>
                    </h2>
                    <p className="text-neutral-400 max-w-2xl mx-auto">
                        Hear directly from our patients about their journey to a perfect smile.
                    </p>
                </div>

                {/* Desktop Grid / Mobile Scroll Snap */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible no-scrollbar">
                    {SAMPLE_STORIES.map((story) => (
                        <div key={story.id} className="snap-center shrink-0 w-[85vw] md:w-auto">
                            <VideoCard story={story} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function VideoCard({ story }: { story: Story }) {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <Card className="bg-neutral-800 border-neutral-700 overflow-hidden h-full">
            <div className="relative aspect-video w-full bg-black group">
                {!isPlaying ? (
                    <button
                        onClick={() => setIsPlaying(true)}
                        className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer group-hover:bg-black/20 transition-all z-10"
                        aria-label={`Play video for ${story.patientName}`}
                    >
                        <Image
                            src={story.thumbnail}
                            alt={story.title}
                            fill
                            className="object-cover opacity-90 transition-opacity"
                        />
                        {/* Play Button Icon */}
                        <div className="absolute w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-xl group-hover:scale-110 transition-transform">
                            <svg
                                className="w-8 h-8 text-white fill-current translate-x-1"
                                viewBox="0 0 24 24"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <div className="absolute bottom-4 left-4 z-20">
                            <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-xs uppercase tracking-wider text-white rounded-full border border-white/10">
                                Watch Story
                            </span>
                        </div>
                    </button>
                ) : (
                    <video
                        src={story.videoUrl}
                        className="absolute inset-0 w-full h-full object-cover"
                        controls
                        autoPlay
                        playsInline
                    />
                )}
            </div>
            <CardContent className="p-6">
                <h3 className="text-xl font-medium text-white mb-1 group-hover:text-amber-400 transition-colors">
                    {story.patientName}
                </h3>
                <p className="text-neutral-400 text-sm">{story.title}</p>
            </CardContent>
        </Card>
    );
}
