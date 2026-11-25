"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import { PostEditor } from "@/components/admin/PostEditor";

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const sp = useSearchParams();
    return <PostEditor id={id === "nuevo" ? "" : decodeURIComponent(id)} newLang={sp.get("lang") === "en" ? "en" : "es"} />;
}
