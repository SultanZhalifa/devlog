import { format, subWeeks, startOfWeek, parseISO } from "date-fns";
import { LIMITS } from "@/lib/constants";

/**
 * Counts entries per tag and returns sorted top N tags.
 */
export function calculateTopTags(
  entries: Array<{ tags: Array<{ tag: { name: string } }> }>,
  limit: number = LIMITS.TOP_TAGS,
): { name: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const e of entries)
    for (const et of e.tags) counts[et.tag.name] = (counts[et.tag.name] ?? 0) + 1;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

/**
 * Groups entries into weekly buckets for the last N weeks.
 */
export function calculateWeeklyActivity(
  entries: Array<{ date: Date | string }>,
  weeks = 12,
): { week: string; count: number }[] {
  const map: Record<string, number> = {};
  for (let i = weeks - 1; i >= 0; i--)
    map[format(startOfWeek(subWeeks(new Date(), i)), "yyyy-MM-dd")] = 0;
  for (const e of entries) {
    const key = format(startOfWeek(new Date(e.date)), "yyyy-MM-dd");
    if (key in map) map[key]++;
  }
  return Object.entries(map).map(([week, count]) => ({
    week: format(parseISO(week), "MMM d"),
    count,
  }));
}
