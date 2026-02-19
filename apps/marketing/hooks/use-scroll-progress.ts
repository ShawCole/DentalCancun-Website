"use client"

import { useEffect, useState, RefObject } from "react"

export function useScrollProgress(ref: RefObject<HTMLElement | null>, offsetPercentage: number = 0.75) {
    const [drawHeight, setDrawHeight] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return

            const rect = ref.current.getBoundingClientRect()
            const targetY = window.innerHeight * offsetPercentage
            const containerTop = rect.top
            const containerHeight = rect.height

            // Calculate how far the target line is into the container
            // If containerTop is at targetY, we are at 0.
            // As container moves up (containerTop decreases), the draw height increases.
            // drawHeight = targetY - containerTop
            let height = targetY - containerTop

            // Clamp between 0 and full height
            height = Math.max(0, Math.min(height, containerHeight))

            setDrawHeight(height)
        }

        window.addEventListener("scroll", handleScroll)
        window.addEventListener("resize", handleScroll)

        // Initial calculation
        handleScroll()

        return () => {
            window.removeEventListener("scroll", handleScroll)
            window.removeEventListener("resize", handleScroll)
        }
    }, [ref, offsetPercentage])

    return drawHeight
}
