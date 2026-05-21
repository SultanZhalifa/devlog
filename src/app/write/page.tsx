"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TagBadge } from "@/components/TagBadge";
import { FiSend, FiX } from "react-icons/fi";

const SUGGESTED_TAGS = [
  "typescript",
  "react",
  "nextjs",
  "python",
  "css",
  "sql",
  "algorithms",
  "system-design",
  "devops",
  "open-source",
];

const MOOD_OPTIONS = [
  { value: 1, emoji: "😔", label: "Rough" },
  { value: 2, emoji: "😐", label: "Okay" },
  { value: 3, emoji: "😊", label: "Good" },
  { value: 4, emoji: "😄", label: "Great" },
  { value: 5, emoji: "🔥", label: "On fire" },
];

export default function WritePage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [mood, setMood] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function addCustomTag() {
    const tag = customTag.toLowerCase().trim().replace(/\s+/g, "-");
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
    setCustomTag("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) {
      setError("Write something before saving.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, mood, isPublic, tags: selectedTags }),
      });
      if (!res.ok) throw new Error("Failed to save");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">What did you learn today?</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="I learned how React Server Components work by building... I fixed a bug where... I built a feature that..."
            rows={10}
            className="w-full rounded-xl border border-zinc-200 bg-white p-4 text-sm leading-relaxed placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          />
          <p className="mt-1 text-right text-xs text-zinc-400">{content.length} chars</p>
        </div>

        {/* Tags */}
        <div>
          <p className="mb-2 text-sm font-medium">Tags</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {SUGGESTED_TAGS.map((tag) => (
              <TagBadge
                key={tag}
                name={tag}
                active={selectedTags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
          {selectedTags.filter((t) => !SUGGESTED_TAGS.includes(t)).map((tag) => (
            <span
              key={tag}
              className="mr-2 mb-2 inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
            >
              #{tag}
              <button type="button" onClick={() => toggleTag(tag)}>
                <FiX className="h-3 w-3" />
              </button>
            </span>
          ))}
          <div className="flex gap-2">
            <input
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTag())}
              placeholder="Add custom tag…"
              className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button
              type="button"
              onClick={addCustomTag}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Add
            </button>
          </div>
        </div>

        {/* Mood */}
        <div>
          <p className="mb-2 text-sm font-medium">How did it feel?</p>
          <div className="flex gap-2">
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(mood === m.value ? null : m.value)}
                className={`flex flex-col items-center rounded-xl border px-3 py-2 text-xs transition-colors ${
                  mood === m.value
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700"
                }`}
              >
                <span className="text-xl">{m.emoji}</span>
                <span className="mt-0.5 text-zinc-500">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Visibility */}
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
            <span className="text-sm font-medium">Make this entry public</span>
            <p className="text-xs text-zinc-400">Visible on your public profile</p>
          </div>
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          <FiSend className="h-4 w-4" />
          {saving ? "Saving…" : "Save entry"}
        </button>
      </form>
    </div>
  );
}
