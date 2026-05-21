import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, subDays, startOfDay, isSameDay, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy");
}

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "EEEE, MMMM d");
}

/**
 * Calculates the current streak from an array of entry dates.
 * A streak is the number of consecutive days (ending today or yesterday)
 * that have at least one entry.
 */
export function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const today = startOfDay(new Date());
  const uniqueDays = [
    ...new Map(dates.map((d) => [startOfDay(d).getTime(), startOfDay(d)])).values(),
  ].sort((a, b) => b.getTime() - a.getTime());

  if (uniqueDays.length === 0) return 0;

  // Streak must include today or yesterday to be active
  const mostRecent = uniqueDays[0];
  const hasToday = isSameDay(mostRecent, today);
  const hasYesterday = isSameDay(mostRecent, subDays(today, 1));

  if (!hasToday && !hasYesterday) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const expected = subDays(uniqueDays[i - 1], 1);
    if (isSameDay(uniqueDays[i], expected)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Returns the last N days as date strings (YYYY-MM-DD) for the streak calendar.
 */
export function getLast365Days(): string[] {
  return Array.from({ length: 365 }, (_, i) =>
    format(subDays(new Date(), 364 - i), "yyyy-MM-dd"),
  );
}
