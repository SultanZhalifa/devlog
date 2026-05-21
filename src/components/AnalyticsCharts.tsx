"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { format, startOfWeek, subWeeks, parseISO } from "date-fns";
import type { Entry } from "@/types";

interface Props {
  topTags: { name: string; count: number }[];
  entries: Pick<Entry, "date">[];
}

export function AnalyticsCharts({ topTags, entries }: Props) {
  // Entries per week (last 12 weeks)
  const weekMap: Record<string, number> = {};
  for (let i = 11; i >= 0; i--) {
    const weekStart = format(startOfWeek(subWeeks(new Date(), i)), "yyyy-MM-dd");
    weekMap[weekStart] = 0;
  }
  for (const e of entries) {
    const weekStart = format(startOfWeek(new Date(e.date)), "yyyy-MM-dd");
    if (weekStart in weekMap) weekMap[weekStart]++;
  }
  const weeklyData = Object.entries(weekMap).map(([week, count]) => ({
    week: format(parseISO(week), "MMM d"),
    count,
  }));

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Entries per week
        </h2>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis dataKey="week" tick={{ fontSize: 10 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Top tags
        </h2>
        {topTags.length === 0 ? (
          <p className="text-sm text-zinc-400">No tags yet. Add tags when writing entries.</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={topTags} layout="vertical">
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
