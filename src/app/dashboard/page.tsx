import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { EntryCard } from "@/components/EntryCard";
import Link from "next/link";
import { FiPlusSquare, FiBarChart2 } from "react-icons/fi";
import { calculateStreak } from "@/lib/utils";
import type { Metadata } from "next";
import type { EntryWithTags } from "@/types";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [entries, user] = await Promise.all([
    db.entry.findMany({
      where: { userId: session.user.id },
      include: { tags: { include: { tag: true } }, user: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    db.user.findUnique({
      where: { id: session.user.id },
      select: { username: true, name: true, _count: { select: { entries: true } } },
    }),
  ]);

  type EntryRow = (typeof entries)[number];
  const streak = calculateStreak(entries.map((e: EntryRow) => new Date(e.date)));
  const today = new Date().toDateString();
  const hasEntryToday = (entries as EntryRow[]).some(
    (e) => new Date(e.date).toDateString() === today,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Hey, {user?.name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {user?._count.entries ?? 0} total entries · {streak} day streak
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/analytics"
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <FiBarChart2 className="h-4 w-4" />
            Analytics
          </Link>
          <Link
            href="/write"
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <FiPlusSquare className="h-4 w-4" />
            {hasEntryToday ? "Add another" : "Log today"}
          </Link>
        </div>
      </div>

      {!hasEntryToday && (
        <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/40">
          <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
            📝 You haven&apos;t logged anything today yet.
          </p>
          <p className="mt-0.5 text-xs text-indigo-500 dark:text-indigo-400">
            Keep your streak going — write about what you built or learned.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
            <p className="text-zinc-500 dark:text-zinc-400">No entries yet.</p>
            <Link
              href="/write"
              className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Write your first entry →
            </Link>
          </div>
        ) : (
          (entries as EntryRow[]).map((entry) => (
            <EntryCard key={entry.id} entry={entry as EntryWithTags} isOwner />
          ))
        )}
      </div>

      {entries.length >= 10 && (
        <div className="mt-6 text-center">
          <Link
            href="/analytics"
            className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            View all entries in analytics →
          </Link>
        </div>
      )}
    </div>
  );
}
