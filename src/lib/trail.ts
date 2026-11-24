import { getCollection, type CollectionEntry } from "astro:content";

export type TrailEntry = CollectionEntry<"trails">;
export type TrailKind = TrailEntry["data"]["kind"];

export const TRAIL_KIND_META: Record<
    TrailKind,
    { label: string; badgeClass: string }
> = {
    song: {
        label: "曲目",
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200/80",
    },
    quote: {
        label: "台词",
        badgeClass: "bg-amber-50 text-amber-800 border-amber-200/80",
    },
    reference: {
        label: "拾遗",
        badgeClass: "bg-gray-100 text-gray-700 border-gray-200/90",
    },
};

export const TRAIL_KIND_ORDER: TrailKind[] = ["song", "quote", "reference"];

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
    if (entry.data.credit || entry.data.source) {
        parts.push([entry.data.credit, entry.data.source].filter(Boolean).join(" · "));
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
    const summary = parts.join(" — ").trim() || entry.data.title;
    if (summary.length <= maxLength) {
        return summary;
    }
    return `${summary.slice(0, maxLength - 1).trimEnd()}…`;
}
