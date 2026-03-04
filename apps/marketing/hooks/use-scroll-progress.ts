"use client"

import { useEffect, useRef, useCallback, RefObject } from "react"

/**
 * Scroll-driven progress that writes directly to the DOM via refs,
 * bypassing React re-renders for butter-smooth 60fps animation.
 *
 * Returns a ref whose `.current` is always the latest drawHeight (number).
 * Calls `onUpdate(height)` on every animation frame for imperative DOM updates.
 */
export function useScrollProgress(
    containerRef: RefObject<HTMLElement | null>,
    offsetPercentage: number = 0.75,
    onUpdate?: (height: number) => void,
) {
    const drawHeightRef = useRef(0)
    const rafId = useRef(0)

    const tick = useCallback(() => {
        if (!containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const targetY = window.innerHeight * offsetPercentage
        const height = Math.max(0, Math.min(targetY - rect.top, rect.height))

        // Only update DOM if value actually changed (avoid layout thrashing)
        if (height !== drawHeightRef.current) {
            drawHeightRef.current = height
            onUpdate?.(height)
        }
    }, [containerRef, offsetPercentage, onUpdate])

    useEffect(() => {
        const handleScroll = () => {
            cancelAnimationFrame(rafId.current)
            rafId.current = requestAnimationFrame(tick)
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        window.addEventListener("resize", handleScroll, { passive: true })

        // Initial calculation
        tick()

        return () => {
            cancelAnimationFrame(rafId.current)
            window.removeEventListener("scroll", handleScroll)
            window.removeEventListener("resize", handleScroll)
        }
    }, [tick])

    return drawHeightRef
}
