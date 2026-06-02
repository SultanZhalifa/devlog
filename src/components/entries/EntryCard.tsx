"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiLock, FiGlobe, FiCalendar, FiEdit2, FiTrash2 } from "react-icons/fi";
import { TagBadge } from "@/components/tags/TagBadge";
import { UserAvatar } from "@/components/social/UserAvatar";
import { formatDate } from "@/lib/utils/date";
import { CONTENT } from "@/lib/constants";
import type { EntryWithTags, Tag } from "@/types";

interface EntryCardProps {
  entry: EntryWithTags;
  showUser?: boolean;
  compact?: boolean;
  showActions?: boolean;
}

const MOOD_EMOJI: Record<number, string> = {
  1: "😔",
  2: "😐",
  3: "😊",
  4: "😄",
  5: "🔥",
};

export function EntryCard({
  entry,
  showUser = false,
  compact = false,
  showActions = false,
}: EntryCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const limit = compact ? CONTENT.ENTRY_PREVIEW_COMPACT : CONTENT.ENTRY_PREVIEW_FULL;
  const preview = entry.content.slice(0, limit) + (entry.content.length > limit ? "…" : "");

  async function handleDelete() {
    if (!confirm("Delete this entry? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await fetch(`/api/entries/${entry.id}`, { method: "DELETE" });
      router.refresh();
    } catch {
      setDeleting(false);
    }
  }

  return (
    <article className="group rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-amber-100/30 hover:border-stone-300/80 dark:border-stone-800 dark:bg-stone-900 dark:hover:shadow-amber-900/10 dark:hover:border-stone-700">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {showUser && (
            <Link
              href={`/${entry.user.username}`}
              className="mb-3 flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <UserAvatar
                src={entry.user.avatar}
                name={entry.user.name}
                size="sm"
              />
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                {entry.user.name}
              </span>
              <span className="text-sm text-stone-400">@{entry.user.username}</span>
            </Link>
          )}

          <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
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

        <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-stone-400">
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

          {showActions && (
            <div className="mt-2 flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <Link
                href={`/write?edit=${entry.id}`}
                className="rounded-lg p-1 text-stone-400 transition-colors hover:text-amber-600 dark:hover:text-amber-400"
                title="Edit entry"
              >
                <FiEdit2 className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg p-1 text-stone-400 transition-colors hover:text-red-500 disabled:opacity-40"
                title="Delete entry"
              >
                <FiTrash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
