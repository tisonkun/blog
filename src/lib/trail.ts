import { getCollection, type CollectionEntry } from "astro:content";

export type TrailEntry = CollectionEntry<"trails">;

export interface TrailEmbed {
    src: string;
    platform: string;
    aspect: "video" | "compact";
    height?: number;
}

export interface TrailListenLink {
    url: string;
    label: string;
    embed?: TrailEmbed;
}

export async function getAllTrails(): Promise<TrailEntry[]> {
    const entries = await getCollection("trails");
    return entries.filter((entry) => !entry.data.draft);
}

export function sortTrailsByDateDesc(entries: TrailEntry[]): TrailEntry[] {
    return [...entries].sort(
        (a, b) =>
            b.data.date.getTime() - a.data.date.getTime() ||
            a.id.localeCompare(b.id),
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

export function getPlainBodyText(entry: TrailEntry): string {
    return (entry.body ?? "")
        .replace(/```[\s\S]*?```/g, "")
        .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/^>\s?/gm, "")
        .replace(/[`*_~#]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

export function getTrailPageTitle(entry: TrailEntry): string {
    if (entry.data.title?.trim()) {
        return entry.data.title.trim();
    }
    const lead = getPlainBodyText(entry);
    if (lead) {
        return lead.length <= 36 ? lead : `${lead.slice(0, 35).trimEnd()}…`;
    }
    if (entry.data.work?.trim()) {
        return entry.data.work.trim();
    }
    return formatTrailDate(entry.data.date);
}

export function getTrailSummary(entry: TrailEntry, maxLength = 140): string {
    const parts: string[] = [];
    if (entry.data.title?.trim()) {
        parts.push(entry.data.title.trim());
    }
    if (entry.data.work?.trim()) {
        parts.push(`《${entry.data.work.trim()}》`);
    }
    if (entry.data.credit?.trim()) {
        parts.push(entry.data.credit.trim());
    }
    const bodyText = getPlainBodyText(entry);
    if (bodyText) {
        parts.push(bodyText);
    }
    const summary = parts.join(" · ").trim() || formatTrailDate(entry.data.date);
    if (summary.length <= maxLength) {
        return summary;
    }
    return `${summary.slice(0, maxLength - 1).trimEnd()}…`;
}

export function inferPlatformLabel(urlString: string): string {
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
        if (hostname === "y.qq.com") return "QQ音乐";
        if (hostname === "open.spotify.com" || hostname === "spotify.com") return "Spotify";
        if (hostname === "music.apple.com") return "Apple Music";
        if (hostname === "soundcloud.com") return "SoundCloud";
        if (hostname === "bgm.tv" || hostname === "bangumi.tv" || hostname === "chii.in") {
            return "Bangumi";
        }
        if (hostname.endsWith(".wikipedia.org") || hostname === "wikipedia.org") {
            return "Wiki";
        }
        if (hostname.endsWith("moegirl.org.cn")) return "萌娘百科";
        return hostname;
    } catch {
        return "链接";
    }
}

export function parseTrailEmbed(urlString: string): TrailEmbed | undefined {
    try {
        const url = new URL(urlString);
        const hostname = url.hostname.replace(/^www\./, "").toLowerCase();

        // YouTube / YouTube Music
        if (
            hostname === "youtube.com" ||
            hostname === "m.youtube.com" ||
            hostname === "music.youtube.com"
        ) {
            const videoId = url.searchParams.get("v");
            if (videoId && /^[\w-]{11}$/.test(videoId)) {
                return {
                    src: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`,
                    platform: "YouTube",
                    aspect: "video",
                };
            }
        }
        if (hostname === "youtu.be") {
            const videoId = url.pathname.replace(/^\/+/, "").split("/")[0];
            if (videoId && /^[\w-]{11}$/.test(videoId)) {
                return {
                    src: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`,
                    platform: "YouTube",
                    aspect: "video",
                };
            }
        }

        // Bilibili
        if (hostname === "bilibili.com" || hostname === "m.bilibili.com") {
            const match = url.pathname.match(/\/video\/(BV[\w]+)/i);
            if (match?.[1]) {
                return {
                    src: `https://player.bilibili.com/player.html?bvid=${match[1]}&autoplay=1`,
                    platform: "Bilibili",
                    aspect: "video",
                };
            }
        }

        // Spotify
        if (hostname === "open.spotify.com") {
            const match = url.pathname.match(/\/(track|album|playlist)\/([A-Za-z0-9]+)/);
            if (match?.[1] && match?.[2]) {
                return {
                    src: `https://open.spotify.com/embed/${match[1]}/${match[2]}`,
                    platform: "Spotify",
                    aspect: "compact",
                    height: 152,
                };
            }
        }

        // Apple Music
        if (hostname === "music.apple.com") {
            return {
                src: `https://embed.music.apple.com${url.pathname}${url.search}`,
                platform: "Apple Music",
                aspect: "compact",
                height: 175,
            };
        }

        // NetEase Cloud Music
        if (hostname === "music.163.com") {
            const songId =
                url.searchParams.get("id") ||
                url.hash.match(/[?&]id=(\d+)/)?.[1];
            if (songId && /^\d+$/.test(songId)) {
                return {
                    src: `https://music.163.com/outchain/player?type=2&id=${songId}&auto=1&height=66`,
                    platform: "网易云音乐",
                    aspect: "compact",
                    height: 86,
                };
            }
        }
    } catch {
        return undefined;
    }
    return undefined;
}

export function getTrailListenLinks(entry: TrailEntry): TrailListenLink[] {
    const raw = entry.data.listen;
    if (!raw) return [];
    const items = Array.isArray(raw) ? raw : [raw];
    return items.map((item) => {
        const url = typeof item === "string" ? item : item.url;
        const label = typeof item === "string" ? inferPlatformLabel(url) : item.label;
        return {
            url,
            label,
            embed: parseTrailEmbed(url),
        };
    });
}
