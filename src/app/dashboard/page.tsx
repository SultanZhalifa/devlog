import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { EntryList } from "@/components/entries/EntryList";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { FiPlusSquare, FiBarChart2 } from "react-icons/fi";
import { calculateStreak } from "@/lib/utils/streak";
import { LIMITS } from "@/lib/constants";
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
      take: LIMITS.DASHBOARD_ENTRIES,
    }),
    db.user.findUnique({
      where: { id: session.user.id },
      select: { username: true, name: true, _count: { select: { entries: true } } },
    }),
  ]);

  const streak = calculateStreak(entries.map((e) => new Date(e.date)));
  const today = new Date().toDateString();
  const hasEntryToday = entries.some((e) => new Date(e.date).toDateString() === today);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader
        title={`Hey, ${user?.name?.split(" ")[0] ?? "there"} 👋`}
        subtitle={`${user?._count.entries ?? 0} total entries · ${streak} day streak`}
        actions={
          <>
            <Link href="/analytics">
              <Button
                variant="secondary"
                size="sm"
                icon={<FiBarChart2 className="h-4 w-4" />}
              >
                Analytics
              </Button>
            </Link>
            <Link href="/write">
              <Button
                variant="primary"
                size="sm"
                icon={<FiPlusSquare className="h-4 w-4" />}
              >
                {hasEntryToday ? "Add another" : "Log today"}
              </Button>
            </Link>
          </>
        }
      />

      {!hasEntryToday && (
        <div className="animate-fade-in mb-6 rounded-2xl border border-amber-200/60 bg-amber-50/60 p-4 backdrop-blur-sm dark:border-amber-900/40 dark:bg-amber-950/30">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
            📝 You haven&apos;t logged anything today yet.
          </p>
          <p className="mt-0.5 text-xs text-amber-600/70 dark:text-amber-400/70">
            Keep your streak going — write about what you built or learned.
          </p>
        </div>
      )}

      <div className="animate-fade-in">
        <EntryList
          entries={entries as EntryWithTags[]}
          showActions
          emptyMessage="No entries yet."
          emptyActionLabel="Write your first entry"
          emptyActionHref="/write"
        />
      </div>

      {entries.length >= LIMITS.DASHBOARD_ENTRIES && (
        <div className="mt-6 text-center">
          <Link
            href="/analytics"
            className="text-sm font-medium text-amber-600 transition-colors hover:text-amber-700 hover:underline dark:text-amber-400 dark:hover:text-amber-300"
          >
            View your analytics →
          </Link>
        </div>
      )}
    </div>
  );
}
