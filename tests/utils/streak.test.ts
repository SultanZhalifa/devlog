import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { calculateStreak } from "@/lib/utils";
import { subDays } from "date-fns";

describe("calculateStreak", () => {
  const NOW = new Date("2025-05-21T12:00:00Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 0 for empty array", () => {
    expect(calculateStreak([])).toBe(0);
  });

  it("returns 1 for a single entry today", () => {
    expect(calculateStreak([NOW])).toBe(1);
  });

  it("returns 1 for a single entry yesterday", () => {
    expect(calculateStreak([subDays(NOW, 1)])).toBe(1);
  });

  it("returns 0 when most recent entry is 2 days ago", () => {
    expect(calculateStreak([subDays(NOW, 2)])).toBe(0);
  });

  it("counts consecutive days correctly", () => {
    const dates = [NOW, subDays(NOW, 1), subDays(NOW, 2), subDays(NOW, 3)];
    expect(calculateStreak(dates)).toBe(4);
  });

  it("stops counting at a gap", () => {
    // today, yesterday — gap — 3 days ago, 4 days ago
    const dates = [NOW, subDays(NOW, 1), subDays(NOW, 3), subDays(NOW, 4)];
    expect(calculateStreak(dates)).toBe(2);
  });

  it("deduplicates multiple entries on the same day", () => {
    const dates = [
      NOW,
      new Date(NOW.getTime() + 3600_000), // also today
      subDays(NOW, 1),
    ];
    expect(calculateStreak(dates)).toBe(2);
  });

  it("returns 0 when there are entries but none are recent", () => {
    const dates = [subDays(NOW, 10), subDays(NOW, 11)];
    expect(calculateStreak(dates)).toBe(0);
  });
});
