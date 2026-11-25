"use client";

import { use } from "react";
import { BuilderEditor } from "@/components/admin/builder/BuilderEditor";

export default function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <BuilderEditor id={decodeURIComponent(id)} />;
}
