"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TagBadge } from "@/components/tags/TagBadge";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { PageHeader } from "@/components/ui/PageHeader";
import { SUGGESTED_TAGS, MOOD_OPTIONS, CONTENT } from "@/lib/constants";
import { FiSend, FiX } from "react-icons/fi";

interface InitialData {
  id: string;
  content: string;
  mood: number | null;
  isPublic: boolean;
  tags: string[];
}

interface WriteFormProps {
  initialData?: InitialData | null;
}

export function WriteForm({ initialData }: WriteFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [content, setContent] = useState(initialData?.content ?? "");
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags ?? []);
  const [customTag, setCustomTag] = useState("");
  const [mood, setMood] = useState<number | null>(initialData?.mood ?? null);
  const [isPublic, setIsPublic] = useState(initialData?.isPublic ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function addCustomTag() {
    const tag = customTag
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, CONTENT.TAG_MAX_LENGTH);
    if (tag && !selectedTags.includes(tag) && selectedTags.length < CONTENT.TAG_MAX_COUNT) {
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
      const url = isEditing ? `/api/entries/${initialData.id}` : "/api/entries";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
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
      <PageHeader title={isEditing ? "Edit entry" : "What did you learn today?"} />

      <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
        <div>
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="I learned how React Server Components work by building... I fixed a bug where... I built a feature that..."
            rows={10}
          />
          <p className="mt-1 text-right text-xs text-stone-400">{content.length} chars</p>
        </div>

        {/* Tags */}
        <div>
          <p className="mb-2 text-sm font-medium text-stone-700 dark:text-stone-300">Tags</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTED_TAGS.map((tag) => (
              <TagBadge
                key={tag}
                name={tag}
                active={selectedTags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
          {selectedTags.filter((t) => !(SUGGESTED_TAGS as readonly string[]).includes(t)).map((tag) => (
            <span
              key={tag}
              className="mr-2 mb-2 inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
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
              maxLength={CONTENT.TAG_MAX_LENGTH}
              className="flex-1 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-sm transition-all duration-200 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200/50 dark:border-stone-700 dark:bg-stone-900 dark:focus:border-amber-500 dark:focus:ring-amber-800/30"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addCustomTag}
              disabled={selectedTags.length >= CONTENT.TAG_MAX_COUNT}
            >
              Add
            </Button>
          </div>
          {selectedTags.length >= CONTENT.TAG_MAX_COUNT && (
            <p className="mt-1 text-xs text-stone-400">Maximum {CONTENT.TAG_MAX_COUNT} tags</p>
          )}
        </div>

        {/* Mood */}
        <div>
          <p className="mb-2 text-sm font-medium text-stone-700 dark:text-stone-300">How did it feel?</p>
          <div className="flex gap-2">
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(mood === m.value ? null : m.value)}
                className={`flex flex-col items-center rounded-xl border px-3.5 py-2.5 text-xs transition-all duration-200 ${
                  mood === m.value
                    ? "border-amber-400 bg-amber-50 shadow-sm shadow-amber-100/50 dark:border-amber-600 dark:bg-amber-950/40 dark:shadow-amber-900/10"
                    : "border-stone-200 hover:border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:hover:border-stone-600 dark:hover:bg-stone-800"
                }`}
              >
                <span className="text-xl">{m.emoji}</span>
                <span className="mt-0.5 text-stone-500 dark:text-stone-400">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Visibility */}
        <Toggle
          checked={isPublic}
          onChange={setIsPublic}
          label="Make this entry public"
          description="Visible on your public profile"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button
          type="submit"
          disabled={saving}
          className="w-full"
          size="lg"
          icon={<FiSend className="h-4 w-4" />}
        >
          {saving ? "Saving…" : isEditing ? "Save changes" : "Save entry"}
        </Button>
      </form>
    </div>
  );
}
