import type { APIRoute } from "astro";
import { allRetreats } from "../utils/retreats";

/** Suchindex für die Client-Suche (Format wie das Jekyll search.json). */
export const GET: APIRoute = async () => {
  const retreats = await allRetreats();

  const index = retreats.map((retreat) => ({
    title: retreat.data.title,
    tags: retreat.data.tags.join(", "),
    url: `/${retreat.id}/`,
    image: retreat.data.image ?? "",
  }));

  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json" },
  });
};
