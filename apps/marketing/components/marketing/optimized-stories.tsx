'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

// Types
interface Story {
    id: string;
    thumbnail: string;
    videoUrl: string;
    title: string;
    patientName: string;
    category: string;
}

const OPTIMIZED_STORIES: Story[] = [
    {
        id: 'michael',
        category: 'The Safety (Anchor)',
        thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
        videoUrl: 'https://storage.googleapis.com/msgsndr/f0ZNnBBOAnxnYbXCHsB5/media/691b660c14eb6a868a001d8f.mp4',
        title: 'Executive Implants',
        patientName: 'Michael Nicholson',
    },
    {
        id: 'sarah',
        category: 'The Makeover',
        thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
        videoUrl: 'https://storage.googleapis.com/msgsndr/f0ZNnBBOAnxnYbXCHsB5/media/691b6793379d2316b471e21a.mp4',
        title: 'Full Porcelain Veneers',
        patientName: 'Sarah Jenkins',
    },
    {
        id: 'anna',
        category: 'The Logistics (Ease)',
        thumbnail: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
        videoUrl: 'https://storage.googleapis.com/msgsndr/dq3ylOAKb1QTcAeFKnwl/media/6974750759a77b9387a9f4c8.mp4',
        title: 'Hollywood Smile',
        patientName: 'Jane Porterfield',
    },
];

export function OptimizedStories() {
    return (
        <section className="py-24 bg-neutral-900 text-white">
            <div className="container mx-auto px-4">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">
                        Results That <span className="text-amber-400 italic">Speak</span>
                    </h2>
                    <p className="text-neutral-400 max-w-2xl mx-auto text-lg font-light">
                        Three unique journeys. One consistent standard of excellence.
                    </p>
                </div>

                {/* Mobile: Horizontal Snap Scroll | Desktop: 3-Column Grid */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible no-scrollbar">
                    {OPTIMIZED_STORIES.map((story) => (
                        <div key={story.id} className="snap-center shrink-0 w-[85vw] md:w-auto h-full">
                            <StoryCard story={story} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function StoryCard({ story }: { story: Story }) {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <Card className="bg-neutral-800 border-neutral-700 overflow-hidden h-full flex flex-col group hover:border-amber-500/30 transition-colors duration-300">
            <div className="relative aspect-[9/16] w-full bg-black">
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
                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                <svg
                                    className="w-8 h-8 text-white fill-current ml-1"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>

                        <div className="absolute top-4 left-4 z-20">
                            <span className="px-3 py-1 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-sm">
                                {story.category}
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
            <CardContent className="p-8 flex flex-col flex-grow justify-end bg-gradient-to-t from-black/80 to-transparent -mt-24 z-10 relative">
                <h3 className="text-2xl font-serif text-white mb-2">
                    {story.patientName}
                </h3>
                <p className="text-amber-400 text-sm font-medium uppercase tracking-wider">{story.title}</p>
            </CardContent>
        </Card>
    );
}
