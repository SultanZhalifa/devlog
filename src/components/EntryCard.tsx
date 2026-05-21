"use client";

import Link from "next/link";
import Image from "next/image";
import { FiLock, FiGlobe, FiCalendar } from "react-icons/fi";
import { TagBadge } from "@/components/TagBadge";
import { formatDate } from "@/lib/utils";
import type { EntryWithTags, Tag } from "@/types";

interface EntryCardProps {
  entry: EntryWithTags;
  showUser?: boolean;
  compact?: boolean;
}

const MOOD_EMOJI: Record<number, string> = {
  1: "😔",
  2: "😐",
  3: "😊",
  4: "😄",
  5: "🔥",
};

export function EntryCard({ entry, showUser = false, compact = false }: EntryCardProps) {
  const preview = compact
    ? entry.content.slice(0, 120) + (entry.content.length > 120 ? "…" : "")
    : entry.content.slice(0, 300) + (entry.content.length > 300 ? "…" : "");

  return (
    <article className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {showUser && (
            <Link
              href={`/${entry.user.username}`}
              className="mb-3 flex items-center gap-2 hover:opacity-80"
            >
              <Image
                src={entry.user.avatar}
                alt={entry.user.name}
                width={28}
                height={28}
                className="rounded-full"
              />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {entry.user.name}
              </span>
              <span className="text-sm text-zinc-400">@{entry.user.username}</span>
            </Link>
          )}

          <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
            {preview}
          </p>

          {entry.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {entry.tags.map(({ tag }: { tag: Tag }) => (
                <TagBadge key={tag.id} name={tag.name} />
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-zinc-400">
          <div className="flex items-center gap-1">
            <FiCalendar className="h-3 w-3" />
            <span>{formatDate(entry.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            {entry.isPublic ? (
              <FiGlobe className="h-3 w-3" />
            ) : (
              <FiLock className="h-3 w-3" />
            )}
          </div>
          {entry.mood !== null && entry.mood !== undefined && (
            <span className="text-base">{MOOD_EMOJI[entry.mood]}</span>
          )}
        </div>
      </div>
    </article>
  );
}
