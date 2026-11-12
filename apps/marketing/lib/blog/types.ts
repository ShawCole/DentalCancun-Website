export const BLOG_COLLECTION = "blog_posts";
export const blogTag = (id: string) => `blog:${id}`;
export const blogId = (lang: "es" | "en", slug: string) => `${lang}--${slug}`;

export interface Post {
    lang: "es" | "en";
    slug: string;
    title: string;
    excerpt: string;
    cover: string;
    coverAlt: string;
    body: string;
    keyword: string;
    seoTitle: string;
    seoDescription: string;
    category: string;
    status: "draft" | "published";
    publishedAt: string;
    updatedAt: string;
    pair: string; // slug of the version in the other language
}

export const CATEGORIES = {
    es: ["Turismo dental", "Tratamientos", "Pregúntale a la especialista", "Tecnología dental", "Experiencia concierge", "Volver a brillar"],
    en: ["Dental travel", "Treatments", "Ask our dentists", "Dental technology", "Concierge experience", "Smile stories"],
};

export const emptyPost = (lang: "es" | "en"): Post => ({
    lang, slug: "", title: "", excerpt: "", cover: "", coverAlt: "", body: "", keyword: "", seoTitle: "", seoDescription: "", category: CATEGORIES[lang][0], status: "draft", publishedAt: "", updatedAt: "", pair: "",
});
