"use client";

import { useState } from "react";
import { FiUserPlus, FiUserMinus } from "react-icons/fi";
import { cn } from "@/lib/utils/cn";

interface FollowButtonProps {
  username: string;
  initialFollowing: boolean;
}

export function FollowButton({ username, initialFollowing }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const method = following ? "DELETE" : "POST";
      const res = await fetch(`/api/follow/${username}`, { method });
      if (res.ok) setFollowing(!following);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={cn(
        "flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-sm font-semibold transition-all duration-200 disabled:opacity-50",
        following
          ? "border border-stone-300 text-stone-600 hover:border-red-300 hover:text-red-600 dark:border-stone-700 dark:text-stone-400 dark:hover:border-red-700 dark:hover:text-red-400"
          : "bg-amber-500 text-white shadow-sm hover:bg-amber-600 hover:shadow-md hover:shadow-amber-200/40 dark:hover:shadow-amber-900/20",
      )}
    >
      {following ? (
        <>
          <FiUserMinus className="h-3.5 w-3.5" />
          Following
        </>
      ) : (
        <>
          <FiUserPlus className="h-3.5 w-3.5" />
          Follow
        </>
      )}
    </button>
  );
}
