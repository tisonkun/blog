import { buildRssResponse } from "@/lib/feed";

export async function GET() {
    return buildRssResponse();
}
