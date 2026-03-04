'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface VideoTestimonialData {
    url: string;
    name: string;
    poster?: string;
    startTime?: number;
    muteDuration?: number;
    /** Surgical mute window [startSec, endSec] — mutes only during this range */
    muteWindow?: [number, number];
    /** CSS scale to reframe the video within its card (e.g. 1.15 to zoom in 15%) */
    scale?: number;
}

interface VideoCarouselProps {
    videos: VideoTestimonialData[];
    interval?: number;
}

function CarouselVideoItem({
    video,
    isActive,
    loadTier,
    onPlayingChange,
}: {
    video: VideoTestimonialData;
    isActive: boolean;
    /** 0 = active (load now), 1 = neighbor (load after 500ms), 2 = distant (load after 1.5s) */
    loadTier: number;
    onPlayingChange?: (playing: boolean) => void;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [canLoad, setCanLoad] = useState(false);
    const start = video.startTime ?? 0.1;

    // Stagger metadata loading based on distance from active card
    useEffect(() => {
        if (loadTier === 0) {
            setCanLoad(true);
            return;
        }
        const delay = loadTier === 1 ? 500 : 1500;
        const timer = setTimeout(() => setCanLoad(true), delay);
        return () => clearTimeout(timer);
    }, []); // Only on mount — once loaded, stays loaded

    // Autoplay muted when card becomes active; pause + reset when inactive
    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;
        if (isActive) {
            el.muted = true;
            el.currentTime = start;
            el.play().catch(() => {});
        } else {
            el.pause();
            el.currentTime = start;
            el.muted = true;
            setIsHovering(false);
            onPlayingChange?.(false);
        }
    }, [isActive, start]);

    // Surgical mute: mute only during a specific time window (e.g. a chirp)
    useEffect(() => {
        const el = videoRef.current;
        if (!el || !video.muteWindow) return;
        const [muteStart, muteEnd] = video.muteWindow;
        const onTimeUpdate = () => {
            const t = el.currentTime;
            const inWindow = t >= muteStart && t <= muteEnd;
            if (inWindow && !el.muted) el.muted = true;
            else if (!inWindow && el.muted && isHovering) el.muted = false;
        };
        el.addEventListener('timeupdate', onTimeUpdate);
        return () => el.removeEventListener('timeupdate', onTimeUpdate);
    }, [video.muteWindow, isHovering]);

    // Hover: restart from beginning with sound on
    const handleMouseEnter = () => {
        if (!isActive || !videoRef.current) return;
        setIsHovering(true);
        onPlayingChange?.(true);

        // Restart from beginning
        videoRef.current.currentTime = start;

        if (video.muteDuration) {
            videoRef.current.muted = true;
            setTimeout(() => {
                if (videoRef.current) videoRef.current.muted = false;
            }, video.muteDuration * 1000);
        } else if (!video.muteWindow) {
            videoRef.current.muted = false;
        } else {
            videoRef.current.muted = false;
        }

        videoRef.current.play().catch(() => {});
    };

    // Mouse leave: keep playing but mute
    const handleMouseLeave = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = true;
        setIsHovering(false);
        onPlayingChange?.(false);
    };

    return (
        <div
            className="relative w-full h-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Videos start with preload="none", then stagger to "metadata" based on loadTier.
                This avoids 15 simultaneous GCS requests on page load. */}
            <video
                ref={videoRef}
                loop
                muted
                playsInline
                preload={canLoad ? "auto" : "none"}
                poster={video.poster}
                className="absolute inset-0 h-full w-full object-cover z-10 transition-transform duration-700"
                style={{
                    transform: `scale(${isHovering ? (video.scale ?? 1) * 1.05 : (video.scale ?? 1)})`,
                }}
            >
                <source src={video.url} type="video/mp4" />
            </video>

            {/* Scrim overlay — fades out on hover/play */}
            <div className={cn(
                "absolute inset-0 z-20 bg-gradient-to-b from-black/20 via-transparent to-black/60 transition-opacity duration-500",
                isHovering ? "opacity-0" : "opacity-100"
            )} />

            {/* Badge */}
            <div className="absolute bottom-16 left-4 z-30">
                <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                    <span className={cn(
                        "flex h-1.5 w-1.5 rounded-full bg-gold",
                        isHovering && "animate-pulse"
                    )} />
                    <span className="text-[10px] text-white font-bold uppercase tracking-widest">
                        {isHovering ? "Now Playing" : "Watch Story"}
                    </span>
                </div>
            </div>

            {/* Footer bar */}
            <div className="absolute bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="font-serif font-bold text-white text-sm truncate">{video.name}</p>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-black italic">Verified Result</p>
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className="text-[10px] text-gold">★</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function VideoCarousel({
    videos,
    interval = 4000
}: VideoCarouselProps) {
    const itemCount = videos.length;
    const originalItems = videos;

    // Triple items for seamless infinite scroll [Set A, Set B, Set C]
    const allItems = [...originalItems, ...originalItems, ...originalItems];

    const [currentIndex, setCurrentIndex] = useState(0); // Index within Set B (0 to itemCount-1)
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    // Drag state
    const [dragStart, setDragStart] = useState<number | null>(null);
    const [dragOffset, setDragOffset] = useState(0);
    const isDragging = useRef(false);
    const hasDragged = useRef(false);

    const nextSlide = useCallback(() => {
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
    }, []);

    const prevSlide = useCallback(() => {
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev - 1);
    }, []);

    useEffect(() => {
        if (isPaused || isDragging.current) return;
        const timer = setInterval(nextSlide, interval);
        return () => clearInterval(timer);
    }, [nextSlide, interval, isPaused]);

    // Infinite loop handles
    useEffect(() => {
        if (currentIndex >= itemCount) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(0);
            }, 700);
            return () => clearTimeout(timer);
        }
        if (currentIndex < 0) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(itemCount - 1);
            }, 700);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, itemCount]);

    // Drag Handlers
    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        setDragStart(clientX);
        isDragging.current = true;
        hasDragged.current = false;
        setDragOffset(0);
        setIsTransitioning(false); // Disable transition for real-time tracking
    };

    const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (dragStart === null) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const offset = clientX - dragStart;
        if (Math.abs(offset) > 5) hasDragged.current = true;
        setDragOffset(offset);
    };

    const handleDragEnd = () => {
        if (dragStart === null) return;

        const threshold = 50; // pixels to trigger swipe
        if (dragOffset > threshold) {
            prevSlide();
        } else if (dragOffset < -threshold) {
            nextSlide();
        } else {
            setIsTransitioning(true); // Snap back if threshold not met
        }

        setDragStart(null);
        setDragOffset(0);
        isDragging.current = false;
    };

    return (
        <div
            className="w-full overflow-hidden relative cursor-grab active:cursor-grabbing select-none"
            onMouseLeave={() => {
                if (isDragging.current) handleDragEnd();
            }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
        >
            <div
                className={cn(
                    "flex py-12 carousel-track",
                    isTransitioning ? "transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)" : "transition-none"
                )}
                style={{
                    // Apply real-time drag offset to the transform
                    transform: dragStart !== null
                        ? `translateX(calc(50% - (var(--item-width) / 2) - (${itemCount + currentIndex} * (var(--item-width) + var(--gap))) + ${dragOffset}px))`
                        : undefined
                }}
            >
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .carousel-track {
                        --gap: 3rem;
                        --item-width: 20rem; /* Fixed width for predictable snapping */

                        display: flex;
                        gap: var(--gap);

                        /*
                           CENTERING MATH:
                           We want to center the item at index (itemCount + currentIndex).
                           1. Move track so the very first item is at 50% of the screen: translateX(50%)
                           2. Shift back by half an item width to center that first item: - var(--item-width)/2
                           3. Shift back by (itemCount + currentIndex) items and their gaps: - (itemCount + currentIndex) * (width + gap)
                        */
                        transform: translateX(calc(50% - (var(--item-width) / 2) - (${itemCount + currentIndex} * (var(--item-width) + var(--gap)))));
                    }

                    @media (max-width: 1023px) {
                        .carousel-track {
                            --item-width: 16rem;
                            --gap: 2rem;
                        }
                    }

                    @media (max-width: 767px) {
                        .carousel-track {
                            --item-width: 14rem;
                            --gap: 1.5rem;
                        }
                    }
                `}} />

                {allItems.map((video, index) => {
                    const isActive = index === itemCount + currentIndex;
                    const distance = Math.abs(index - (itemCount + currentIndex));
                    const loadTier = distance === 0 ? 0 : distance <= 2 ? 1 : 2;

                    return (
                        <div
                            key={`${video.name}-${index}`}
                            className={cn(
                                "flex-shrink-0 aspect-[9/16] rounded-2xl border border-white/10 backdrop-blur-md relative overflow-hidden",
                                isTransitioning ? "transition-all duration-700" : "transition-none",
                                "w-[var(--item-width)]",
                                isActive
                                    ? "scale-105 z-20 shadow-[0_0_50px_rgba(197,160,89,0.3)] border-gold/40 opacity-100"
                                    : "scale-95 z-10 opacity-40 cursor-pointer"
                            )}
                            onClick={() => {
                                // Only navigate if it wasn't a drag and the card isn't already active
                                if (isActive || hasDragged.current) return;
                                const offset = index - (itemCount + currentIndex);
                                setIsTransitioning(true);
                                setCurrentIndex(prev => prev + offset);
                            }}
                        >
                            <CarouselVideoItem
                                video={video}
                                isActive={isActive}
                                loadTier={loadTier}
                                onPlayingChange={(playing) => setIsPaused(playing)}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-4 mt-8">
                {originalItems.map((_, i) => (
                    <button
                        key={i}
                        aria-label={`Go to slide ${i + 1}`}
                        className={cn(
                            "h-1.5 transition-all duration-500 rounded-full",
                            ((currentIndex % itemCount) + itemCount) % itemCount === i ? "w-12 bg-gold" : "w-4 bg-neutral-800 hover:bg-neutral-700"
                        )}
                        onClick={() => {
                            setIsTransitioning(true);
                            setCurrentIndex(i);
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
