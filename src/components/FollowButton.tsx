"use client";

import { useState } from "react";
import { FiUserPlus, FiUserMinus } from "react-icons/fi";

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
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 ${
        following
          ? "border border-zinc-300 text-zinc-600 hover:border-red-300 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-red-700 dark:hover:text-red-400"
          : "bg-indigo-600 text-white hover:bg-indigo-700"
      }`}
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
