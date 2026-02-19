"use client"

import * as React from "react"
import { ChevronDown } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

const Accordion = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { type?: "single" | "multiple"; collapsible?: boolean }
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-1", className)} {...props} />
))
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("border-b", className)} {...props} />
))
AccordionItem.displayName = "AccordionItem"

const AccordionContext = React.createContext<{
    openItems: string[]
    toggleItem: (value: string) => void
}>({ openItems: [], toggleItem: () => { } })

const AccordionTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
    // This is a simplified version. For a real app without radix, we'd need context to handle open state.
    // For now, let's use a details/summary approach or just simple state if we can't use radix.
    // Actually, let's just make it a simple toggle for this specific use case since we can't install radix.
    return (
        <div className="flex">
            <button
                ref={ref}
                className={cn(
                    "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                    className
                )}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </button>
        </div>
    )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
            className
        )}
        {...props}
    >
        <div className="pb-4 pt-0">{children}</div>
    </div>
))
AccordionContent.displayName = "AccordionContent"

// Re-writing the exported components to actually work with local state for the specific LP usage
const AccordionSimple = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <div className={className}>{children}</div>
}

const AccordionItemSimple = ({ children, className }: { children: React.ReactNode; className?: string; value: string }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className={cn("border-b", className)}>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    // @ts-ignore
                    return React.cloneElement(child, { isOpen, setIsOpen })
                }
                return child
            })}
        </div>
    )
}

const AccordionTriggerSimple = ({ children, className, isOpen, setIsOpen }: any) => {
    return (
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
                "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline w-full text-left",
                className
            )}
        >
            {children}
            <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isOpen && "rotate-180")} />
        </button>
    )
}

const AccordionContentSimple = ({ children, className, isOpen }: any) => {
    if (!isOpen) return null;
    return (
        <div className={cn("overflow-hidden text-sm transition-all animate-in slide-in-from-top-1", className)}>
            <div className="pb-4 pt-0">{children}</div>
        </div>
    )
}

export { AccordionSimple as Accordion, AccordionItemSimple as AccordionItem, AccordionTriggerSimple as AccordionTrigger, AccordionContentSimple as AccordionContent }
