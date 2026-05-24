"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSave, FiCheck } from "react-icons/fi";

interface SettingsFormProps {
  initialBio: string;
  initialIsPublic: boolean;
  username: string;
}

export function SettingsForm({ initialBio, initialIsPublic, username }: SettingsFormProps) {
  const router = useRouter();
  const [bio, setBio] = useState(initialBio);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, isPublic }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Bio */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell the community what you're working on or learning…"
          rows={3}
          maxLength={300}
          className="w-full rounded-xl border border-zinc-200 bg-white p-4 text-sm leading-relaxed placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
        />
        <p className="mt-1 text-right text-xs text-zinc-400">{bio.length}/300</p>
      </div>

      {/* Public profile */}
      <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
        <label className="flex cursor-pointer items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Public profile</p>
            <p className="mt-0.5 text-xs text-zinc-400">
              Let others discover you and your entries on Explore
            </p>
          </div>
          <div className="relative shrink-0">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="peer sr-only"
            />
            <div className="h-5 w-9 rounded-full bg-zinc-200 peer-checked:bg-indigo-600 dark:bg-zinc-700" />
            <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
          </div>
        </label>
      </div>

      {/* Profile link */}
      <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
        <p className="text-sm font-medium">Your profile URL</p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          devlog.vercel.app/{username}
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {saved ? (
          <>
            <FiCheck className="h-4 w-4" />
            Saved!
          </>
        ) : (
          <>
            <FiSave className="h-4 w-4" />
            {saving ? "Saving…" : "Save changes"}
          </>
        )}
      </button>
    </form>
  );
}
