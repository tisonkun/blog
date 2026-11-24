import rss from "@astrojs/rss";
import { Site } from "@/config";
import { getListedPosts, getPostExcerpt, sortPostsByDateDesc } from "@/lib/post";

export async function buildRssResponse() {
    const posts = sortPostsByDateDesc(await getListedPosts());
    const baseUrl = Site.url.toString().replace(/\/+$/g, "");

    const items = posts.map((entry) => ({
        title: entry.data.title,
        pubDate: entry.data.date,
        description: getPostExcerpt(entry, 200),
        link: `${baseUrl}/posts/${entry.id}`,
    }));

    return rss({
        title: Site.title,
        description: Site.description,
        site: baseUrl,
        items,
        customData: `<language>zh-CN</language>`,
    });
}
