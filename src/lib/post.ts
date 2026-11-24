import { getCollection, type CollectionEntry } from "astro:content";

export async function getListedPosts() {
    const posts = await getAllPosts();
    return posts.filter((entry) => !entry.data.hidden);
}

export async function getAllPosts() {
    const posts = await getCollection("posts");
    return posts.filter((entry) => !entry.data.draft);
}

export function getPostExcerpt(entry: CollectionEntry<"posts">, maxLength = 140): string {
    if (entry.data.description?.trim()) {
        return entry.data.description.trim();
    }
    const raw = entry.body ?? "";
    const lead = raw.split(/<!--\s*more\s*-->/i)[0] ?? raw;
    const paragraphs = lead
        .replace(/```[\s\S]*?```/g, "")
        .split(/\r?\n\s*\r?\n/)
        .map((block) =>
            block
                .replace(/^#+\s+.*$/gm, "")
                .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
                .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
                .replace(/^>\s?/gm, "")
                .replace(/[`*_~]/g, "")
                .replace(/\s+/g, " ")
                .trim(),
        )
        .filter((text) => text.length > 0);

    const summary = paragraphs.join(" ").trim();
    if (summary.length <= maxLength) {
        return summary;
    }
    return `${summary.slice(0, maxLength - 1).trimEnd()}…`;
}
