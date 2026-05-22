import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { TagBadge } from "@/components/TagBadge";
import { formatDate } from "@/lib/utils";
import { FiCalendar, FiEdit2, FiGlobe, FiLock } from "react-icons/fi";
import type { Metadata } from "next";
import type { Tag } from "@/types";

type Props = { params: Promise<{ id: string }> };

const MOOD_EMOJI: Record<number, string> = {
  1: "😔",
  2: "😐",
  3: "😊",
  4: "😄",
  5: "🔥",
};

const MOOD_LABEL: Record<number, string> = {
  1: "Rough",
  2: "Okay",
  3: "Good",
  4: "Great",
  5: "On fire",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const entry = await db.entry.findUnique({ where: { id }, select: { content: true } });
  if (!entry) return { title: "Not found" };
  return { title: entry.content.slice(0, 60) };
}

export default async function EntryDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  const entry = await db.entry.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
      user: true,
    },
  });

  if (!entry) notFound();
  if (!entry.isPublic && entry.userId !== session?.user?.id) notFound();

  const isOwner = session?.user?.id === entry.userId;
  const backHref = isOwner ? "/dashboard" : `/${entry.user.username}`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={backHref}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← Back
        </Link>
        {isOwner && (
          <Link
            href={`/entries/${id}/edit`}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <FiEdit2 className="h-3.5 w-3.5" />
            Edit
          </Link>
        )}
      </div>

      {/* Author info (only when viewing someone else's entry) */}
      {!isOwner && (
        <div className="mb-6 flex items-center gap-3">
          <Image
            src={entry.user.avatar}
            alt={entry.user.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="text-sm font-semibold">{entry.user.name}</p>
            <p className="text-xs text-zinc-500">@{entry.user.username}</p>
          </div>
        </div>
      )}

      {/* Meta row */}
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <FiCalendar className="h-3.5 w-3.5" />
          {formatDate(entry.date)}
        </span>
        <span className="flex items-center gap-1">
          {entry.isPublic ? (
            <>
              <FiGlobe className="h-3.5 w-3.5" />
              Public
            </>
          ) : (
            <>
              <FiLock className="h-3.5 w-3.5" />
              Private
            </>
          )}
        </span>
        {entry.mood !== null && (
          <span className="flex items-center gap-1">
            {MOOD_EMOJI[entry.mood]}{" "}
            {MOOD_LABEL[entry.mood]}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
          {entry.content}
        </p>
      </div>

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {entry.tags.map(({ tag }: { tag: Tag }) => (
            <TagBadge key={tag.id} name={tag.name} />
          ))}
        </div>
      )}
    </div>
  );
}
