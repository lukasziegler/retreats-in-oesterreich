import { getCollection, type CollectionEntry } from "astro:content";
import { blog } from "../data/settings";

export type Retreat = CollectionEntry<"retreats">;

/** All retreats, newest (by start date) first. */
export async function allRetreats(): Promise<Retreat[]> {
  const retreats = await getCollection("retreats");
  return retreats.sort(
    (a, b) => b.data.start_date.valueOf() - a.data.start_date.valueOf(),
  );
}

export function isUpcoming(retreat: Retreat, now = new Date()): boolean {
  return retreat.data.end_date.valueOf() >= now.valueOf();
}

/** Upcoming retreats, soonest first. */
export function upcoming(retreats: Retreat[], now = new Date()): Retreat[] {
  return retreats
    .filter((r) => isUpcoming(r, now))
    .sort((a, b) => a.data.start_date.valueOf() - b.data.start_date.valueOf());
}

/** Past retreats, most recent first. */
export function past(retreats: Retreat[], now = new Date()): Retreat[] {
  return retreats.filter((r) => !isUpcoming(r, now));
}

/**
 * Featured and upcoming – for the hero on the home page.
 * Limited to the `limit` soonest retreats.
 */
export function featured(
  retreats: Retreat[],
  now = new Date(),
  limit: number = blog.featuredLimit,
): Retreat[] {
  return upcoming(retreats, now)
    .filter((r) => r.data.featured)
    .slice(0, limit);
}

/** All tags with their retreats, sorted alphabetically. */
export function allTags(
  retreats: Retreat[],
): { tag: string; retreats: Retreat[] }[] {
  const map = new Map<string, Retreat[]>();
  for (const retreat of retreats) {
    for (const tag of retreat.data.tags) {
      const list = map.get(tag) ?? [];
      list.push(retreat);
      map.set(tag, list);
    }
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "de"))
    .map(([tag, retreats]) => ({ tag, retreats }));
}
