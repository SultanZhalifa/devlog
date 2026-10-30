import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { EntryList } from "@/components/entries/EntryList";
import { TagBadge } from "@/components/tags/TagBadge";
import { FollowButton } from "@/components/social/FollowButton";
import { UserAvatar } from "@/components/social/UserAvatar";
import { calculateStreak } from "@/lib/utils/streak";
import { calculateTopTags } from "@/lib/utils/analytics";
import { LIMITS } from "@/lib/constants";
import { FiZap } from "react-icons/fi";
import type { Metadata } from "next";
import type { EntryWithTags } from "@/types";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await db.user.findUnique({
    where: { username },
    select: { name: true },
  });
  if (!user) return { title: "Not found" };
  return {
    title: `${user.name} (@${username})`,
    description: `${user.name}'s developer learning log on DevLog.`,
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;

  const [session, user] = await Promise.all([
    auth(),
    db.user.findUnique({
      where: { username },
      include: {
        _count: { select: { entries: true, followers: true, following: true } },
      },
    }),
  ]);

  if (!user || !user.isPublic) notFound();

  const isOwnProfile = session?.user?.id === user.id;
  const isLoggedIn = !!session?.user?.id;

  const [entries, allEntryDates, isFollowing] = await Promise.all([
    db.entry.findMany({
      where: { userId: user.id, isPublic: true },
      include: { tags: { include: { tag: true } }, user: true },
      orderBy: { createdAt: "desc" },
      take: LIMITS.PROFILE_ENTRIES,
    }),
    db.entry.findMany({
      where: { userId: user.id },
      select: { date: true },
    }),
    isLoggedIn && !isOwnProfile
      ? db.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: session!.user!.id!,
              followingId: user.id,
            },
          },
        })
      : Promise.resolve(null),
  ]);

  const streak = calculateStreak(allEntryDates.map((e) => new Date(e.date)));
  const topTags = calculateTopTags(entries, LIMITS.TOP_TAGS).map(({ name }) => name);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Profile header */}
      <div className="animate-fade-in mb-8 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <UserAvatar src={user.avatar} name={user.name} size="lg" />
          <div>
            <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50">
              {user.name}
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400">@{user.username}</p>
            {user.bio && (
              <p className="mt-1.5 text-sm text-stone-600 dark:text-stone-400">
                {user.bio}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <span>
                <strong className="text-stone-800 dark:text-stone-200">
                  {user._count.entries}
                </strong>{" "}
                <span className="text-stone-500 dark:text-stone-400">entries</span>
              </span>
              <span>
                <strong className="text-stone-800 dark:text-stone-200">
                  {user._count.followers}
                </strong>{" "}
                <span className="text-stone-500 dark:text-stone-400">followers</span>
              </span>
              <span>
                <strong className="text-stone-800 dark:text-stone-200">
                  {user._count.following}
                </strong>{" "}
                <span className="text-stone-500 dark:text-stone-400">following</span>
              </span>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <FiZap className="h-3.5 w-3.5" />
                <strong>{streak}</strong>{" "}
                <span className="text-stone-500 dark:text-stone-400">day streak</span>
              </span>
            </div>
          </div>
        </div>

        {isLoggedIn && !isOwnProfile && (
          <FollowButton username={user.username} initialFollowing={!!isFollowing} />
        )}
      </div>

      {/* Top tags */}
      {topTags.length > 0 && (
        <div
          className="animate-fade-in mb-6 flex flex-wrap gap-1.5"
          style={{ animationDelay: "100ms" }}
        >
          {topTags.map((name) => (
            <TagBadge key={name} name={name} />
          ))}
        </div>
      )}

      {/* Entries */}
      <div className="animate-fade-in" style={{ animationDelay: "150ms" }}>
        <EntryList
          entries={entries as EntryWithTags[]}
          emptyMessage="No public entries yet."
        />
      </div>
    </div>
  );
}
