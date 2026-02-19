"use client"

import { useEffect, useState, useRef } from "react"

export function useInView(options = { threshold: 0.1, triggerOnce: true }) {
    const ref = useRef<HTMLDivElement>(null)
    const [isInView, setIsInView] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true)
                if (options.triggerOnce && ref.current) {
                    observer.unobserve(ref.current)
                }
            } else if (!options.triggerOnce) {
                setIsInView(false)
            }
        }, options)

        const currentRef = ref.current
        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            }
        }
    }, [options.threshold, options.triggerOnce])

    return { ref, isInView }
}
