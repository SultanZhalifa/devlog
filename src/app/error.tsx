"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50">Something went wrong</h2>
      <p className="text-sm text-stone-500 dark:text-stone-400">
        An unexpected error occurred. Please try again.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} variant="primary" size="sm">
          Try again
        </Button>
        <Link href="/dashboard">
          <Button variant="secondary" size="sm">
            Go home
          </Button>
        </Link>
      </div>
    </div>
  );
}
