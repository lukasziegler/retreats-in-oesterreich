import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { site } from "../data/settings";
import { allRetreats } from "../utils/retreats";

export async function GET(context: APIContext) {
  const retreats = (await allRetreats())
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .slice(0, 10);

  return rss({
    title: site.title,
    description: site.description,
    site: context.site!,
    items: retreats.map((retreat) => ({
      title: retreat.data.title,
      description: retreat.data.description,
      pubDate: retreat.data.date,
      link: `/${retreat.id}/`,
      categories: retreat.data.tags,
    })),
  });
}
