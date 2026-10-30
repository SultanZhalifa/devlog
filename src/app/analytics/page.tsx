import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { StreakCalendar } from "@/components/analytics/StreakCalendar";
import { AnalyticsCharts } from "@/components/analytics/AnalyticsCharts";
import { StatCard } from "@/components/analytics/StatCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { calculateStreak } from "@/lib/utils/streak";
import { calculateTopTags, calculateWeeklyActivity } from "@/lib/utils/analytics";
import { format } from "date-fns";
import { LIMITS } from "@/lib/constants";
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

  const streak = calculateStreak(entries.map((e) => new Date(e.date)));

  const activityMap: Record<string, number> = {};
  for (const e of entries) {
    const key = format(new Date(e.date), "yyyy-MM-dd");
    activityMap[key] = (activityMap[key] ?? 0) + 1;
  }

  const topTags = calculateTopTags(entries, LIMITS.TOP_TAGS);
  const weeklyData = calculateWeeklyActivity(entries);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader title="Analytics" />

      <div className="animate-fade-in mb-8 grid grid-cols-3 gap-4">
        <StatCard label="Total entries" value={entries.length} />
        <StatCard label="Current streak" value={`${streak} days`} />
        <StatCard label="Public entries" value={entries.filter((e) => e.isPublic).length} />
      </div>

      <div className="animate-fade-in mb-8" style={{ animationDelay: "100ms" }}>
        <Card padding="lg">
          <h2 className="mb-4 text-sm font-semibold text-stone-700 dark:text-stone-300">
            Activity
          </h2>
          <StreakCalendar activityMap={activityMap} />
        </Card>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
        <AnalyticsCharts topTags={topTags} weeklyData={weeklyData} />
      </div>
    </div>
  );
}
