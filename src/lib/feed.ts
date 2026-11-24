import _ from "lodash";
import rss from "@astrojs/rss";
import { Site } from "@/config";
import { getListedPosts, getPostExcerpt } from "@/lib/post";

export async function buildRssResponse() {
    const posts = await getListedPosts();
    const sortedPosts = _.orderBy(posts, (post) => post.data.date, "desc");
    const baseUrl = Site.url.toString().replace(/\/+$/g, "");

    const items = sortedPosts.map((entry) => ({
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
