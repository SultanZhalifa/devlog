import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Image from "next/image";
import { EntryCard } from "@/components/EntryCard";
import { TagBadge } from "@/components/TagBadge";
import { FollowButton } from "@/components/FollowButton";
import { calculateStreak } from "@/lib/utils";
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
  const session = await auth();

  const user = await db.user.findUnique({
    where: { username },
    include: {
      _count: { select: { entries: true, followers: true, following: true } },
    },
  });

  if (!user || !user.isPublic) notFound();

  const isOwnProfile = session?.user?.id === user.id;
  const isLoggedIn = !!session?.user?.id;

  let isFollowing = false;
  if (isLoggedIn && !isOwnProfile) {
    const follow = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session!.user!.id!,
          followingId: user.id,
        },
      },
    });
    isFollowing = !!follow;
  }

  const entries = await db.entry.findMany({
    where: { userId: user.id, isPublic: true },
    include: { tags: { include: { tag: true } }, user: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  type EntryRow = (typeof entries)[number];
  const streak = calculateStreak(entries.map((e: EntryRow) => new Date(e.date)));

  const tagCounts: Record<string, number> = {};
  for (const e of entries as EntryRow[]) {
    for (const et of e.tags) {
      const name = (et as { tag: { name: string } }).tag.name;
      tagCounts[name] = (tagCounts[name] ?? 0) + 1;
    }
  }
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Profile header */}
      <div className="mb-8 flex items-start gap-4">
        <Image
          src={user.avatar}
          alt={user.name}
          width={72}
          height={72}
          className="rounded-full"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-sm text-zinc-500">@{user.username}</p>
            </div>
            {isLoggedIn && !isOwnProfile && (
              <FollowButton followingId={user.id} initialIsFollowing={isFollowing} />
            )}
          </div>
          {user.bio && (
            <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">{user.bio}</p>
          )}
          <div className="mt-3 flex gap-4 text-sm">
            <span>
              <strong>{user._count.entries}</strong>{" "}
              <span className="text-zinc-500">entries</span>
            </span>
            <span>
              <strong>{user._count.followers}</strong>{" "}
              <span className="text-zinc-500">followers</span>
            </span>
            <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
              <FiZap className="h-3.5 w-3.5" />
              <strong>{streak}</strong>{" "}
              <span className="text-zinc-500">day streak</span>
            </span>
          </div>
        </div>
      </div>

      {/* Top tags */}
      {topTags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-1.5">
          {topTags.map(([name]) => (
            <TagBadge key={name} name={name} />
          ))}
        </div>
      )}

      {/* Entries */}
      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
            <p className="text-zinc-400">No public entries yet.</p>
          </div>
        ) : (
          (entries as EntryRow[]).map((entry) => (
            <EntryCard key={entry.id} entry={entry as EntryWithTags} isOwner={isOwnProfile} />
          ))
        )}
      </div>
    </div>
  );
}
