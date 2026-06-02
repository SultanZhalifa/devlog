import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { calculateStreak, calculateTopTags, calculateWeeklyActivity } from "@/lib/utils";
import { format } from "date-fns";

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

  const dates = entries.map((e) => new Date(e.date));
  const streak = calculateStreak(dates);

  const activityMap: Record<string, number> = {};
  for (const e of entries) {
    const key = format(new Date(e.date), "yyyy-MM-dd");
    activityMap[key] = (activityMap[key] ?? 0) + 1;
  }

  const topTags = calculateTopTags(entries);
  const entriesPerWeek = calculateWeeklyActivity(entries);

  return NextResponse.json({
    streak,
    totalEntries: entries.length,
    topTags,
    entriesPerWeek,
    activityMap,
  });
}
