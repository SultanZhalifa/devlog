import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { StreakCalendar } from "@/components/StreakCalendar";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { calculateStreak } from "@/lib/utils";
import { format } from "date-fns";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const entries = await db.entry.findMany({
    where: { userId: session.user.id },
    include: { tags: { include: { tag: true } } },
    orderBy: { date: "desc" },
  });

  type EntryRow = (typeof entries)[number];

  const streak = calculateStreak(entries.map((e: EntryRow) => new Date(e.date)));

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
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold">Analytics</h1>

      <div className="mb-8 grid grid-cols-3 gap-4">
        {[
          { label: "Total entries", value: entries.length },
          { label: "Current streak", value: `${streak} days` },
          {
            label: "Public entries",
            value: (entries as EntryRow[]).filter((e) => e.isPublic).length,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Activity
        </h2>
        <StreakCalendar activityMap={activityMap} />
      </div>

      <AnalyticsCharts topTags={topTags} entries={entries as EntryRow[]} />
    </div>
  );
}
