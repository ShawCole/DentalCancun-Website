import { HomePage } from "@/components/home/HomePage";
import { getHome } from "@/lib/cms/home";

export async function generateMetadata() {
    return (await getHome("es")).metadata;
}

export default async function InicioES() {
    const { hero } = await getHome("es");
    return <HomePage hero={hero} />;
}
