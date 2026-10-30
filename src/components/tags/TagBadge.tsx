"use client";

import { cn } from "@/lib/utils/cn";

interface TagBadgeProps {
  name: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

const TAG_COLORS: Record<string, string> = {
  typescript: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  javascript: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  react: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  python: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  nextjs: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200",
  css: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  sql: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  default: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
};

function getColor(name: string): string {
  const key = name.toLowerCase().replace(/[\s.]/g, "");
  return TAG_COLORS[key] ?? TAG_COLORS.default;
}

export function TagBadge({ name, onClick, active, className }: TagBadgeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200",
        getColor(name),
        active
          ? "ring-2 ring-offset-1 ring-amber-500 dark:ring-offset-stone-900"
          : "opacity-90 hover:opacity-100",
        onClick ? "cursor-pointer" : "cursor-default",
        className,
      )}
    >
      #{name}
    </button>
  );
}
