'use client';

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { cn } from '@/lib/utils';

export interface VideoTestimonialData {
    url: string;
    name: string;
    poster?: string;
    startTime?: number;
    muteDuration?: number;
    muteWindow?: [number, number];
    scale?: number;
}

interface VideoCarouselProps {
    videos: VideoTestimonialData[];
    interval?: number;
}

function useIsTouchDevice() {
    const [isTouch, setIsTouch] = useState(false);
    useEffect(() => {
        setIsTouch(window.matchMedia('(pointer: coarse)').matches);
    }, []);
    return isTouch;
}

let hasUserInteracted = false;
if (typeof window !== 'undefined') {
    const markInteracted = () => { hasUserInteracted = true; };
    window.addEventListener('click', markInteracted, { once: true, capture: true });
    window.addEventListener('touchstart', markInteracted, { once: true, capture: true });
}

// Full video card with play/unlock/mute logic — only used for Set B items
function CarouselVideoItem({
    video,
    isActive,
    isUnlocked,
    isMutedByUser,
    onUnlock,
    onMuteToggle,
    onVideoEnded,
    onPlayingChange,
}: {
    video: VideoTestimonialData;
    isActive: boolean;
    isUnlocked: boolean;
    isMutedByUser: boolean;
    onUnlock: () => void;
    onMuteToggle: (muted: boolean) => void;
    onVideoEnded: () => void;
    onPlayingChange?: (playing: boolean) => void;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isEngaged, setIsEngaged] = useState(false);
    const isTouch = useIsTouchDevice();
    const start = video.startTime ?? 0.1;

    // Skip hover handlers briefly after activation to prevent interference with swipe playback
    const justActivated = useRef(false);

    // Track previous values to detect what changed
    const prevActive = useRef(isActive);
    const prevMutedByUser = useRef(isMutedByUser);

    // useLayoutEffect runs synchronously in the commit phase.
    // When paired with flushSync in swipe handlers, this keeps el.play()
    // in the user gesture call stack so the browser allows unmuted playback.
    useLayoutEffect(() => {
        const el = videoRef.current;
        if (!el) return;

        const activeChanged = prevActive.current !== isActive;
        const muteChanged = prevMutedByUser.current !== isMutedByUser;
        prevActive.current = isActive;
        prevMutedByUser.current = isMutedByUser;

        // Only short-circuit for mute toggle if the card was ALREADY active (not newly activated)
        if (!activeChanged && isActive && isUnlocked && muteChanged) {
            el.muted = isMutedByUser;
            setIsEngaged(!isMutedByUser);
            onPlayingChange?.(!isMutedByUser);
            return;
        }

        if (isActive) {
            // Guard against hover handlers interfering right after activation
            justActivated.current = true;
            setTimeout(() => { justActivated.current = false; }, 800);

            el.currentTime = start;
            if (isUnlocked) {
                el.loop = false;
                // Always start muted — guaranteed by autoplay policy.
                // Unmute in .then() after play succeeds. Setting el.muted
                // on an already-playing video is just a property change,
                // not gated by autoplay restrictions.
                el.muted = true;
                el.play().then(() => {
                    el.muted = isMutedByUser;
                    setIsEngaged(!isMutedByUser);
                    onPlayingChange?.(!isMutedByUser);
                }).catch(() => {
                    el.addEventListener('canplay', () => {
                        el.muted = true;
                        el.play().catch(() => {});
                    }, { once: true });
                });
            } else {
                // Not unlocked: autoplay muted with loop
                el.loop = true;
                el.muted = true;
                el.play().catch(() => {
                    el.addEventListener('canplay', () => { el.play().catch(() => {}); }, { once: true });
                });
            }
        } else {
            el.pause();
            el.currentTime = start;
            el.muted = true;
            el.loop = true;
            setIsEngaged(false);
            onPlayingChange?.(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive, isUnlocked, isMutedByUser]);

    useEffect(() => {
        const el = videoRef.current;
        if (!el || !isActive || !isUnlocked) return;
        const handleEnded = () => { onVideoEnded(); };
        el.addEventListener('ended', handleEnded);
        return () => el.removeEventListener('ended', handleEnded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive, isUnlocked]);

    const engage = () => {
        const el = videoRef.current;
        if (!el || !isActive) return;
        hasUserInteracted = true;
        onUnlock();
        el.currentTime = start;
        el.loop = false;
        el.muted = false;
        el.play().then(() => {
            setIsEngaged(true);
            onPlayingChange?.(true);
        }).catch(() => {
            el.muted = true;
            el.loop = true;
            el.play().catch(() => {});
        });
    };

    const handleMouseEnter = () => {
        if (isTouch || !isActive || isUnlocked || justActivated.current) return;
        if (hasUserInteracted) engage();
    };

    const handleMouseLeave = () => {
        if (isTouch || !isActive || isUnlocked || justActivated.current) return;
        const el = videoRef.current;
        if (!el) return;
        el.muted = true;
        el.loop = true;
        setIsEngaged(false);
        onPlayingChange?.(false);
    };

    const handleClick = () => {
        if (!isActive) return;
        if (isUnlocked && !isMutedByUser) {
            // Playing unmuted → mute (keeps playing, persists across auto-advance)
            onMuteToggle(true);
        } else {
            // Either not unlocked (muted autoplay) or unlocked but user-muted → play from start unmuted
            engage();
        }
    };

    return (
        <div
            className="relative w-full h-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            <video
                ref={videoRef}
                loop
                muted
                playsInline
                preload="auto"
                poster={video.poster}
                className="absolute inset-0 h-full w-full object-cover z-10 transition-transform duration-700"
                style={{
                    transform: `scale(${isEngaged ? (video.scale ?? 1) * 1.05 : (video.scale ?? 1)})`,
                }}
            >
                <source src={video.url} type="video/mp4" />
            </video>

            <div className={cn(
                "absolute inset-0 z-20 bg-gradient-to-b from-black/20 via-transparent to-black/60 transition-opacity duration-500",
                isEngaged ? "opacity-0" : "opacity-100"
            )} />

            <div className="absolute bottom-16 left-4 z-30">
                <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                    <span className={cn(
                        "flex h-1.5 w-1.5 rounded-full bg-gold",
                        isEngaged && "animate-pulse"
                    )} />
                    <span className="text-[10px] text-white font-bold uppercase tracking-widest">
                        {isEngaged ? "Now Playing" : "Watch Story"}
                    </span>
                </div>
            </div>

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

// Static echo card — shows first frame only, no playback
// Used for Set A and Set C copies to fill the carousel visually
function EchoVideoCard({ video }: { video: VideoTestimonialData }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Seek to the start frame but don't play
    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;
        el.currentTime = video.startTime ?? 0.1;
    }, [video.startTime]);

    return (
        <div className="relative w-full h-full">
            <video
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full object-cover z-10"
                style={{ transform: `scale(${video.scale ?? 1})` }}
            >
                <source src={video.url} type="video/mp4" />
            </video>

            <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

            <div className="absolute bottom-16 left-4 z-30">
                <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-gold" />
                    <span className="text-[10px] text-white font-bold uppercase tracking-widest">Watch Story</span>
                </div>
            </div>

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

    // Triple items: [Set A, Set B, Set C]
    // Set B (indices itemCount..2*itemCount-1) = real video cards with play logic
    // Set A (0..itemCount-1) and Set C (2*itemCount..3*itemCount-1) = echo cards
    const allItems = [...originalItems, ...originalItems, ...originalItems];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isMutedByUser, setIsMutedByUser] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isUnlocked || !carouselRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    setIsUnlocked(false);
                    setIsMutedByUser(false);
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(carouselRef.current);
        return () => observer.disconnect();
    }, [isUnlocked]);

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
        if (isPaused || isDragging.current || isUnlocked) return;
        const timer = setInterval(nextSlide, interval);
        return () => clearInterval(timer);
    }, [nextSlide, interval, isPaused, isUnlocked]);

    // Infinite loop: snap back to Set B when index leaves range
    useEffect(() => {
        if (currentIndex >= itemCount) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(currentIndex - itemCount);
            }, 700);
            return () => clearTimeout(timer);
        }
        if (currentIndex < 0) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(currentIndex + itemCount);
            }, 700);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, itemCount]);

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        setDragStart(clientX);
        isDragging.current = true;
        hasDragged.current = false;
        setDragOffset(0);
        setIsTransitioning(false);
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
        if (dragOffset > 50 || dragOffset < -50) {
            hasUserInteracted = true;
            flushSync(() => {
                setIsUnlocked(true);
                setIsMutedByUser(false);
                if (dragOffset > 50) prevSlide();
                else nextSlide();
            });
        } else {
            setIsTransitioning(true);
        }
        setDragStart(null);
        setDragOffset(0);
        isDragging.current = false;
    };

    return (
        <div
            ref={carouselRef}
            className="w-full overflow-hidden relative cursor-grab active:cursor-grabbing select-none"
            onMouseLeave={() => { if (isDragging.current) handleDragEnd(); }}
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
                    transform: dragStart !== null
                        ? `translateX(calc(50% - (var(--item-width) / 2) - (${itemCount + currentIndex} * (var(--item-width) + var(--gap))) + ${dragOffset}px))`
                        : undefined
                }}
            >
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .carousel-track {
                        --gap: 3rem;
                        --item-width: 20rem;
                        display: flex;
                        gap: var(--gap);
                        transform: translateX(calc(50% - (var(--item-width) / 2) - (${itemCount + currentIndex} * (var(--item-width) + var(--gap)))));
                    }
                    @media (max-width: 1023px) {
                        .carousel-track { --item-width: 16rem; --gap: 2rem; }
                    }
                    @media (max-width: 767px) {
                        .carousel-track { --item-width: 14rem; --gap: 1.5rem; }
                    }
                `}} />

                {allItems.map((video, index) => {
                    const isSetB = index >= itemCount && index < itemCount * 2;
                    // Only Set B items can be truly "active" (with play logic)
                    const isActive = isSetB && index === itemCount + currentIndex;
                    // Visual highlight: also highlight Set A/C copies when they're at the active position
                    const isHighlighted = index === itemCount + currentIndex;

                    return (
                        <div
                            key={`${video.name}-${index}`}
                            className={cn(
                                "flex-shrink-0 aspect-[9/16] rounded-2xl border border-white/10 backdrop-blur-md relative overflow-hidden",
                                isTransitioning ? "transition-all duration-700" : "transition-none",
                                "w-[var(--item-width)]",
                                isHighlighted
                                    ? "scale-105 z-20 shadow-[0_0_50px_rgba(197,160,89,0.3)] border-gold/40 opacity-100"
                                    : "scale-95 z-10 opacity-40 cursor-pointer"
                            )}
                            onClick={() => {
                                if (isHighlighted || hasDragged.current) return;
                                const offset = index - (itemCount + currentIndex);
                                setIsTransitioning(true);
                                hasUserInteracted = true;
                                setIsUnlocked(true);
                                setIsMutedByUser(false);
                                setCurrentIndex(prev => prev + offset);
                            }}
                        >
                            {isSetB ? (
                                <CarouselVideoItem
                                    video={video}
                                    isActive={isActive}
                                    isUnlocked={isUnlocked}
                                    isMutedByUser={isMutedByUser}
                                    onUnlock={() => { setIsUnlocked(true); setIsMutedByUser(false); }}
                                    onMuteToggle={(muted) => setIsMutedByUser(muted)}
                                    onVideoEnded={nextSlide}
                                    onPlayingChange={(playing) => setIsPaused(playing)}
                                />
                            ) : (
                                <EchoVideoCard video={video} />
                            )}
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
