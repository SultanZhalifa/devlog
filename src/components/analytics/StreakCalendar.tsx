"use client";

import { getLast365Days } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import { format, parseISO, getDay } from "date-fns";

interface StreakCalendarProps {
  activityMap: Record<string, number>;
}

function getIntensity(count: number): string {
  if (count === 0) return "bg-stone-100 dark:bg-stone-800";
  if (count === 1) return "bg-amber-200 dark:bg-amber-900/60";
  if (count === 2) return "bg-amber-400 dark:bg-amber-700";
  return "bg-amber-500 dark:bg-amber-500";
}

export function StreakCalendar({ activityMap }: StreakCalendarProps) {
  const days = getLast365Days();

  // Group by week (Sunday = 0)
  const weeks: string[][] = [];
  let currentWeek: string[] = [];

  const firstDay = parseISO(days[0]);
  const startPad = getDay(firstDay);
  for (let i = 0; i < startPad; i++) currentWeek.push("");

  for (const day of days) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length) {
    while (currentWeek.length < 7) currentWeek.push("");
    weeks.push(currentWeek);
  }

  const months = weeks
    .map((week, i) => {
      const firstDay = week.find((d) => d !== "");
      return firstDay ? { label: format(parseISO(firstDay), "MMM"), weekIndex: i } : null;
    })
    .filter(Boolean)
    .filter((m, i, arr) => i === 0 || m!.label !== arr[i - 1]!.label);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 pt-5 pr-1">
          {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
            <div
              key={i}
              className="h-3 w-6 text-[9px] leading-3 text-stone-400 dark:text-stone-500"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          {/* Month labels */}
          <div className="flex gap-1">
            {weeks.map((_, i) => {
              const month = months.find((m) => m!.weekIndex === i);
              return (
                <div
                  key={i}
                  className="h-4 w-3 text-[9px] text-stone-400 dark:text-stone-500"
                >
                  {month?.label ?? ""}
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div className="flex gap-1">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={day ? `${day}: ${activityMap[day] ?? 0} entries` : ""}
                    className={cn(
                      "h-3 w-3 rounded-sm transition-colors duration-200",
                      day ? getIntensity(activityMap[day] ?? 0) : "invisible",
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1 text-[10px] text-stone-400 dark:text-stone-500">
        <span>Less</span>
        {[0, 1, 2, 3].map((level) => (
          <div key={level} className={cn("h-3 w-3 rounded-sm", getIntensity(level))} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
