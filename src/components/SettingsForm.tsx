"use client";

import { useState } from "react";
import Link from "next/link";
import { FiSave } from "react-icons/fi";

interface SettingsFormProps {
  initialBio: string | null;
  initialIsPublic: boolean;
  username: string;
}

export function SettingsForm({ initialBio, initialIsPublic, username }: SettingsFormProps) {
  const [bio, setBio] = useState(initialBio ?? "");
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, isPublic }),
      });
      if (res.ok) {
        setSaved(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile URL */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <p className="mb-1 text-sm font-medium">Your profile URL</p>
        <Link
          href={`/${username}`}
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          devlog.app/{username}
        </Link>
      </div>

      {/* Bio */}
      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="bio">
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          maxLength={160}
          placeholder="Tell others a bit about yourself…"
          className="w-full rounded-xl border border-zinc-200 bg-white p-4 text-sm leading-relaxed placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
        />
        <p className="mt-1 text-right text-xs text-zinc-400">{bio.length}/160</p>
      </div>

      {/* Public profile toggle */}
      <label className="flex cursor-pointer items-center gap-3">
        <div className="relative">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="peer sr-only"
          />
          <div className="h-5 w-9 rounded-full bg-zinc-200 peer-checked:bg-indigo-600 dark:bg-zinc-700" />
          <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4 shadow" />
        </div>
        <div>
          <span className="text-sm font-medium">Public profile</span>
          <p className="text-xs text-zinc-400">Anyone can view your profile and public entries</p>
        </div>
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {saved && <p className="text-sm text-green-600">Settings saved!</p>}

      <button
        type="submit"
        disabled={saving}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        <FiSave className="h-4 w-4" />
        {saving ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
