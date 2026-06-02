import { db } from "@/lib/db";
import Link from "next/link";
import { EntryList } from "@/components/entries/EntryList";
import { TagBadge } from "@/components/tags/TagBadge";
import { UserAvatar } from "@/components/social/UserAvatar";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { LIMITS } from "@/lib/constants";
import type { Metadata } from "next";
import type { EntryWithTags } from "@/types";

export const metadata: Metadata = { title: "Explore" };

export default async function ExplorePage() {
  const [recentPublicEntries, trendingTags, featuredUsers] = await Promise.all([
    db.entry.findMany({
      where: { isPublic: true },
      include: { tags: { include: { tag: true } }, user: true },
      orderBy: { createdAt: "desc" },
      take: LIMITS.EXPLORE_ENTRIES,
    }),
    db.tag.findMany({
      include: { _count: { select: { entries: true } } },
      orderBy: { entries: { _count: "desc" } },
      take: LIMITS.TRENDING_TAGS,
    }),
    db.user
      .findMany({
        where: { isPublic: true },
        include: {
          _count: { select: { entries: { where: { isPublic: true } } } },
        },
        orderBy: { entries: { _count: "desc" } },
        take: LIMITS.FEATURED_USERS_FETCH,
      })
      .then((users) =>
        users
          .sort((a, b) => b._count.entries - a._count.entries)
          .slice(0, LIMITS.FEATURED_USERS_DISPLAY),
      ),
  ]);

  type TagRow = (typeof trendingTags)[number];
  type UserRow = (typeof featuredUsers)[number];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <PageHeader
        title="Explore"
        subtitle="Discover what developers around the world are learning."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="animate-fade-in">
          <EntryList
            entries={recentPublicEntries as EntryWithTags[]}
            showUser
            compact
            emptyMessage="No public entries yet. Be the first!"
          />
        </div>

        <aside className="space-y-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Card padding="md">
            <h2 className="mb-3 text-sm font-semibold text-stone-700 dark:text-stone-300">
              Trending tags
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {(trendingTags as TagRow[]).map((tag) => (
                <TagBadge key={tag.id} name={tag.name} />
              ))}
            </div>
          </Card>

          {featuredUsers.length > 0 && (
            <Card padding="md">
              <h2 className="mb-3 text-sm font-semibold text-stone-700 dark:text-stone-300">
                Active loggers
              </h2>
              <div className="space-y-3">
                {(featuredUsers as UserRow[]).map((user) => (
                  <Link
                    key={user.id}
                    href={`/${user.username}`}
                    className="flex items-center gap-3 transition-opacity hover:opacity-80"
                  >
                    <UserAvatar
                      src={user.avatar}
                      name={user.name}
                      size="md"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-stone-800 dark:text-stone-200">
                        {user.name}
                      </p>
                      <p className="text-xs text-stone-400 dark:text-stone-500">
                        {user._count.entries} entries
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
