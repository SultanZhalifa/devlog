import { cn } from "@/lib/utils/cn";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

const baseStyles =
  "w-full rounded-xl border border-stone-200 bg-white text-sm leading-relaxed text-stone-800 placeholder-stone-400 transition-all duration-200 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200/50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:placeholder-stone-500 dark:focus:border-amber-500 dark:focus:ring-amber-800/30";

export function Input({ label, className, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">
          {label}
        </label>
      )}
      <input className={cn(baseStyles, "px-3.5 py-2.5", className)} {...props} />
    </div>
  );
}

export function TextArea({ label, className, ...props }: TextAreaProps) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">
          {label}
        </label>
      )}
      <textarea className={cn(baseStyles, "p-4", className)} {...props} />
    </div>
  );
}
