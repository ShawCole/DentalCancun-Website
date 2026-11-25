"use client";

import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { currentEmail, refreshSite, requireDb, saveSetting } from "@/lib/settings/client";
import { settingsTag, type BlogSummary } from "@/lib/settings";
import { BLOG_COLLECTION, blogId, blogTag, type Post } from "./types";

export interface PostRow extends Post { id: string }

export async function listPosts(): Promise<PostRow[]> {
    const snap = await getDocs(collection(requireDb(), BLOG_COLLECTION));
    return snap.docs.map((d) => ({ id: d.id, ...(JSON.parse(d.data().data) as Post) })).sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
}

export async function loadPost(id: string): Promise<Post | null> {
    const snap = await getDoc(doc(requireDb(), BLOG_COLLECTION, id));
    return snap.exists() ? (JSON.parse(snap.data().data) as Post) : null;
}

/** Rebuilds the public list of posts for one language. */
async function rebuildIndex(lang: "es" | "en") {
    const snap = await getDocs(query(collection(requireDb(), BLOG_COLLECTION), where("lang", "==", lang), where("status", "==", "published")));
    const posts: BlogSummary[] = snap.docs
        .map((d) => JSON.parse(d.data().data) as Post)
        .map((p) => ({ slug: p.slug, title: p.title, excerpt: p.excerpt, cover: p.cover, coverAlt: p.coverAlt, category: p.category, publishedAt: p.publishedAt }))
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    await saveSetting(lang === "es" ? "blog-es" : "blog-en", { posts }, false);
}

export async function savePost(p: Post, previousId?: string): Promise<string> {
    const by = currentEmail();
    const id = blogId(p.lang, p.slug);
    if (previousId && previousId !== id) {
        const taken = await getDoc(doc(requireDb(), BLOG_COLLECTION, id));
        if (taken.exists()) throw new Error("Ya hay un artículo con esa dirección.");
    }
    const post: Post = { ...p, updatedAt: new Date().toISOString(), publishedAt: p.status === "published" ? p.publishedAt || new Date().toISOString() : p.publishedAt };
    const data = JSON.stringify(post);
    await setDoc(doc(requireDb(), BLOG_COLLECTION, id), { data, lang: post.lang, slug: post.slug, status: post.status, updatedAt: serverTimestamp(), updatedBy: by });
    if (previousId && previousId !== id) await deleteDoc(doc(requireDb(), BLOG_COLLECTION, previousId)).catch(() => undefined);
    await addDoc(collection(requireDb(), "cms_history"), { kind: "blog", ref: id, data, updatedBy: by, createdAt: serverTimestamp() }).catch(() => undefined);
    await rebuildIndex(post.lang);
    await refreshSite([blogTag(id), ...(previousId ? [blogTag(previousId)] : []), settingsTag(post.lang === "es" ? "blog-es" : "blog-en")]);
    return id;
}

export async function deletePost(id: string, lang: "es" | "en") {
    await deleteDoc(doc(requireDb(), BLOG_COLLECTION, id));
    await rebuildIndex(lang);
    await refreshSite([blogTag(id), settingsTag(lang === "es" ? "blog-es" : "blog-en")]);
}
