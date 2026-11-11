import { HomePage } from "@/components/home/HomePage";
import { getHome } from "@/lib/cms/home";

export async function generateMetadata() {
    return (await getHome("en")).metadata;
}

export default async function Home() {
    const { hero } = await getHome("en");
    return <HomePage hero={hero} />;
}
