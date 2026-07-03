import { getCollection, type CollectionEntry } from "astro:content";

export type Retreat = CollectionEntry<"retreats">;

/** Alle Retreats, neueste (nach Startdatum) zuerst. */
export async function allRetreats(): Promise<Retreat[]> {
  const retreats = await getCollection("retreats");
  return retreats.sort(
    (a, b) => b.data.start_date.valueOf() - a.data.start_date.valueOf(),
  );
}

export function isUpcoming(retreat: Retreat, now = new Date()): boolean {
  return retreat.data.end_date.valueOf() >= now.valueOf();
}

/** Bevorstehende Retreats, das nächste zuerst. */
export function upcoming(retreats: Retreat[], now = new Date()): Retreat[] {
  return retreats
    .filter((r) => isUpcoming(r, now))
    .sort((a, b) => a.data.start_date.valueOf() - b.data.start_date.valueOf());
}

/** Vergangene Retreats, das jüngste zuerst. */
export function past(retreats: Retreat[], now = new Date()): Retreat[] {
  return retreats.filter((r) => !isUpcoming(r, now));
}

/** Featured und bevorstehend – für den Slider auf der Startseite. */
export function featured(retreats: Retreat[], now = new Date()): Retreat[] {
  return upcoming(retreats, now).filter((r) => r.data.featured);
}

/** Alle Tags mit Anzahl, alphabetisch sortiert. */
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
