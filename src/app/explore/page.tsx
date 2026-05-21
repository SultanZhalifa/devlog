import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { EntryCard } from "@/components/EntryCard";
import { TagBadge } from "@/components/TagBadge";
import type { Metadata } from "next";
import type { EntryWithTags } from "@/types";

export const metadata: Metadata = { title: "Explore" };

export default async function ExplorePage() {
  const [recentPublicEntries, trendingTags, featuredUsers] = await Promise.all([
    db.entry.findMany({
      where: { isPublic: true },
      include: { tags: { include: { tag: true } }, user: true },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    db.tag.findMany({
      include: { _count: { select: { entries: true } } },
      orderBy: { entries: { _count: "desc" } },
      take: 15,
    }),
    db.user.findMany({
      where: { isPublic: true },
      include: { _count: { select: { entries: true } } },
      orderBy: { entries: { _count: "desc" } },
      take: 6,
    }),
  ]);

  type TagRow = (typeof trendingTags)[number];
  type UserRow = (typeof featuredUsers)[number];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold">Explore</h1>
      <p className="mb-8 text-zinc-500 dark:text-zinc-400">
        Discover what developers around the world are learning.
      </p>

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          {recentPublicEntries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
              <p className="text-zinc-400">No public entries yet. Be the first!</p>
            </div>
          ) : (
            recentPublicEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry as EntryWithTags}
                showUser
                compact
              />
            ))
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Trending tags
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {(trendingTags as TagRow[]).map((tag) => (
                <TagBadge key={tag.id} name={tag.name} />
              ))}
            </div>
          </div>

          {featuredUsers.length > 0 && (
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Active loggers
              </h2>
              <div className="space-y-3">
                {(featuredUsers as UserRow[]).map((user) => (
                  <Link
                    key={user.id}
                    href={`/${user.username}`}
                    className="flex items-center gap-3 hover:opacity-80"
                  >
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-zinc-400">
                        {user._count.entries} entries
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
