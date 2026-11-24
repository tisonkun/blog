import { getCollection, type CollectionEntry } from "astro:content";

export type TrailEntry = CollectionEntry<"trails">;
export type TrailKind = TrailEntry["data"]["kind"];

export interface TrailLink {
    label: string;
    url: string;
}

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

export function hasTrailNote(entry: TrailEntry): boolean {
    return (entry.body ?? "").trim().length > 0;
}

export function formatTrailDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function inferLinkLabel(urlString: string): string {
    try {
        const hostname = new URL(urlString).hostname.replace(/^www\./, "").toLowerCase();
        if (hostname === "music.youtube.com") return "YouTube Music";
        if (hostname === "youtube.com" || hostname === "youtu.be" || hostname === "m.youtube.com") {
            return "YouTube";
        }
        if (hostname === "bilibili.com" || hostname === "b23.tv" || hostname === "m.bilibili.com") {
            return "Bilibili";
        }
        if (hostname === "music.163.com") return "网易云音乐";
        if (hostname === "open.spotify.com" || hostname === "spotify.com") return "Spotify";
        if (hostname === "music.apple.com") return "Apple Music";
        if (hostname === "bgm.tv" || hostname === "bangumi.tv" || hostname === "chii.in") {
            return "Bangumi";
        }
        if (hostname === "vgmdb.net") return "VGMdb";
        if (hostname === "github.com") return "GitHub";
        if (hostname === "x.com" || hostname === "twitter.com") return "X";
        if (hostname.endsWith(".wikipedia.org") || hostname === "wikipedia.org") {
            return "Wikipedia";
        }
        if (hostname.endsWith("moegirl.org.cn")) return "萌娘百科";
        return hostname;
    } catch {
        return "链接";
    }
}

export function getTrailLinks(entry: TrailEntry): TrailLink[] {
    const result: TrailLink[] = [];
    const seen = new Set<string>();
    if (entry.data.url) {
        seen.add(entry.data.url);
        result.push({
            label: inferLinkLabel(entry.data.url),
            url: entry.data.url,
        });
    }
    for (const link of entry.data.links) {
        if (!seen.has(link.url)) {
            seen.add(link.url);
            result.push(link);
        }
    }
    return result;
}

export function getTrailSummary(entry: TrailEntry, maxLength = 140): string {
    const parts: string[] = [];
    if (entry.data.credit || entry.data.source) {
        parts.push([entry.data.credit, entry.data.source].filter(Boolean).join(" · "));
    }
    if (entry.data.quote) {
        parts.push(entry.data.quote.replace(/\s+/g, " ").trim());
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
