"use client";

import { cn } from "@/lib/utils";

interface TagBadgeProps {
  name: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

const TAG_COLORS: Record<string, string> = {
  typescript: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  javascript: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  react: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  python: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  nextjs: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
  default: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
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
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity",
        getColor(name),
        active ? "ring-2 ring-offset-1 ring-indigo-500" : "opacity-90 hover:opacity-100",
        onClick ? "cursor-pointer" : "cursor-default",
        className,
      )}
    >
      #{name}
    </button>
  );
}
