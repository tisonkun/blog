import { getCollection, type CollectionEntry } from "astro:content";

export type PostEntry = CollectionEntry<"posts">;

export async function getListedPosts(): Promise<PostEntry[]> {
    const posts = await getAllPosts();
    return posts.filter((entry) => !entry.data.hidden);
}

export async function getAllPosts(): Promise<PostEntry[]> {
    const posts = await getCollection("posts");
    return posts.filter((entry) => !entry.data.draft);
}

export function sortPostsByDateDesc(posts: PostEntry[]): PostEntry[] {
    return [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function countTerms(values: string[]): Array<{ name: string; count: number }> {
    const counts = new Map<string, number>();
    for (const v of values) {
        counts.set(v, (counts.get(v) ?? 0) + 1);
    }
    return [...counts.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh-CN"));
}

export function getPostExcerpt(entry: PostEntry, maxLength = 140): string {
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
