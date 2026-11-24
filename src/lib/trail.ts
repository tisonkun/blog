import { getCollection, type CollectionEntry } from "astro:content";

export type TrailEntry = CollectionEntry<"trails">;

export async function getAllTrails(): Promise<TrailEntry[]> {
    const entries = await getCollection("trails");
    return entries.filter((entry) => !entry.data.draft);
}

export function sortTrailsByDateDesc(entries: TrailEntry[]): TrailEntry[] {
    return [...entries].sort(
        (a, b) =>
            b.data.date.getTime() - a.data.date.getTime() ||
            a.data.title.localeCompare(b.data.title, "zh-CN"),
    );
}

export function hasTrailBody(entry: TrailEntry): boolean {
    return (entry.body ?? "").trim().length > 0;
}

export function formatTrailDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function getTrailSummary(entry: TrailEntry, maxLength = 140): string {
    const parts: string[] = [];
    if (entry.data.work) {
        parts.push(`《${entry.data.work}》`);
    }
    if (entry.data.credit) {
        parts.push(entry.data.credit);
    }
    const rawBody = (entry.body ?? "")
        .replace(/```[\s\S]*?```/g, "")
        .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/^>\s?/gm, "")
        .replace(/[`*_~#]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    if (rawBody) {
        parts.push(rawBody);
    }
    const summary = parts.join(" · ").trim() || entry.data.title;
    if (summary.length <= maxLength) {
        return summary;
    }
    return `${summary.slice(0, maxLength - 1).trimEnd()}…`;
}
