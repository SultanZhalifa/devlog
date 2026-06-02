"use client";

import { cn } from "@/lib/utils/cn";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  className?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  className,
}: ToggleProps) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-3", className)}>
      <div className="relative shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className="h-5 w-9 rounded-full bg-stone-200 transition-colors duration-200 peer-checked:bg-amber-500 dark:bg-stone-700 peer-checked:dark:bg-amber-500" />
        <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-4" />
      </div>
      <div>
        <span className="text-sm font-medium text-stone-800 dark:text-stone-200">
          {label}
        </span>
        {description && (
          <p className="text-xs text-stone-400 dark:text-stone-500">
            {description}
          </p>
        )}
      </div>
    </label>
  );
}
