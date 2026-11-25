import type { Metadata } from "next";
import { Suspense } from "react";
import type { Lang } from "@/lib/cms/schema";
import { ManageAppointment } from "@/components/site/ManageAppointment";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/* The appointment id and its signed token come in the link (?id=…&t=…) and are read in the browser. */
export default async function CitaPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return (
        <section className="-mt-[76px] min-h-[70vh] bg-champana/50 px-5 pb-20 pt-32 md:pt-40">
            <div className="mx-auto max-w-2xl">
                <Suspense fallback={null}>
                    <ManageAppointment lang={lang as Lang} />
                </Suspense>
            </div>
        </section>
    );
}
