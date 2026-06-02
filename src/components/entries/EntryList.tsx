import { EntryCard } from "./EntryCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { EntryWithTags } from "@/types";

interface EntryListProps {
  entries: EntryWithTags[];
  showUser?: boolean;
  compact?: boolean;
  showActions?: boolean;
  emptyMessage?: string;
  emptyActionLabel?: string;
  emptyActionHref?: string;
}

export function EntryList({
  entries,
  showUser = false,
  compact = false,
  showActions = false,
  emptyMessage = "No entries yet.",
  emptyActionLabel,
  emptyActionHref,
}: EntryListProps) {
  if (entries.length === 0) {
    return (
      <EmptyState
        message={emptyMessage}
        actionLabel={emptyActionLabel}
        actionHref={emptyActionHref}
      />
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <EntryCard
          key={entry.id}
          entry={entry}
          showUser={showUser}
          compact={compact}
          showActions={showActions}
        />
      ))}
    </div>
  );
}
