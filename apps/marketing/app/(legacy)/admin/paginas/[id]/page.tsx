import { notFound } from "next/navigation";
import { getPageDef } from "@/lib/cms/schema";
import { PageEditor } from "@/components/admin/PageEditor";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!getPageDef(id)) notFound();
    return <PageEditor pageId={id} />;
}
