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

interface Props {
  topTags: { name: string; count: number }[];
  weeklyData: { week: string; count: number }[];
}

export function AnalyticsCharts({ topTags, weeklyData }: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="rounded-2xl border border-stone-200/80 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
        <h2 className="mb-4 text-sm font-semibold text-stone-700 dark:text-stone-300">
          Entries per week
        </h2>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="#a8a29e" />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke="#a8a29e" />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e7e5e4",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: "#f59e0b" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-2xl border border-stone-200/80 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
        <h2 className="mb-4 text-sm font-semibold text-stone-700 dark:text-stone-300">
          Top tags
        </h2>
        {topTags.length === 0 ? (
          <p className="text-sm text-stone-400">
            No tags yet. Add tags when writing entries.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={topTags} layout="vertical">
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 10 }}
                stroke="#a8a29e"
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10 }}
                width={80}
                stroke="#a8a29e"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e7e5e4",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                }}
              />
              <Bar dataKey="count" fill="#f59e0b" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
