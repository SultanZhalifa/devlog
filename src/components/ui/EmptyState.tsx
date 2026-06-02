import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({
  message,
  actionLabel,
  actionHref,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-stone-300 p-12 text-center dark:border-stone-700",
        className,
      )}
    >
      {icon && (
        <div className="mb-3 flex justify-center text-stone-300 dark:text-stone-600">
          {icon}
        </div>
      )}
      <p className="text-stone-500 dark:text-stone-400">{message}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-3 inline-block text-sm font-medium text-amber-600 hover:text-amber-700 hover:underline dark:text-amber-400 dark:hover:text-amber-300"
        >
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}
