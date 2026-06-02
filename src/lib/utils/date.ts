import { format, subDays, parseISO } from "date-fns";

/**
 * Formats a date into a short human-readable string (e.g. "Jun 2, 2026").
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy");
}

/**
 * Formats a date into a relative day string (e.g. "Monday, June 2").
 */
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "EEEE, MMMM d");
}

/**
 * Returns the last 365 days as date strings (YYYY-MM-DD) for the streak calendar.
 */
export function getLast365Days(): string[] {
  return Array.from({ length: 365 }, (_, i) =>
    format(subDays(new Date(), 364 - i), "yyyy-MM-dd"),
  );
}
