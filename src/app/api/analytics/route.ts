import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { calculateStreak } from "@/lib/utils";
import { format, parseISO, startOfWeek, subWeeks } from "date-fns";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await db.entry.findMany({
    where: { userId: session.user.id },
    include: { tags: { include: { tag: true } } },
    orderBy: { date: "desc" },
  });

  type EntryRow = (typeof entries)[number];

  const dates = entries.map((e: EntryRow) => new Date(e.date));
  const streak = calculateStreak(dates);

  const activityMap: Record<string, number> = {};
  for (const e of entries as EntryRow[]) {
    const key = format(new Date(e.date), "yyyy-MM-dd");
    activityMap[key] = (activityMap[key] ?? 0) + 1;
  }

  const tagCounts: Record<string, number> = {};
  for (const e of entries as EntryRow[]) {
    for (const et of e.tags) {
      const name = (et as { tag: { name: string } }).tag.name;
      tagCounts[name] = (tagCounts[name] ?? 0) + 1;
    }
  }
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  const weekMap: Record<string, number> = {};
  for (let i = 11; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(new Date(), i));
    weekMap[format(weekStart, "yyyy-MM-dd")] = 0;
  }
  for (const e of entries as EntryRow[]) {
    const weekStart = format(startOfWeek(new Date(e.date)), "yyyy-MM-dd");
    if (weekStart in weekMap) {
      weekMap[weekStart] = (weekMap[weekStart] ?? 0) + 1;
    }
  }
  const entriesPerWeek = Object.entries(weekMap).map(([week, count]) => ({
    week: format(parseISO(week), "MMM d"),
    count,
  }));

  return NextResponse.json({
    streak,
    totalEntries: entries.length,
    topTags,
    entriesPerWeek,
    activityMap,
  });
}
