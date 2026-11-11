import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default function AdminMedia() {
    return (
        <div className="flex max-w-6xl flex-col gap-6">
            <header>
                <p className="text-xs text-[#5C564D]">Sitio web</p>
                <h1 className="font-serif text-4xl font-semibold text-[#153D32]">Imágenes</h1>
            </header>
            <p className="text-sm text-[#5C564D]">
                Las fotos de stock nunca se presentan como casos reales, y una foto de paciente solo se sube con su autorización firmada.
            </p>
            <MediaLibrary />
        </div>
    );
}
