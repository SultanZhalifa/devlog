"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSave, FiCheck } from "react-icons/fi";
import { TextArea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Card } from "@/components/ui/Card";
import { CONTENT } from "@/lib/constants";

interface SettingsFormProps {
  initialBio: string;
  initialIsPublic: boolean;
  username: string;
}

export function SettingsForm({
  initialBio,
  initialIsPublic,
  username,
}: SettingsFormProps) {
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
    <form onSubmit={handleSubmit} className="animate-fade-in space-y-6">
      {/* Bio */}
      <div>
        <TextArea
          label="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell the community what you're working on or learning…"
          rows={3}
          maxLength={CONTENT.BIO_MAX_LENGTH}
        />
        <p className="mt-1 text-right text-xs text-stone-400">
          {bio.length}/{CONTENT.BIO_MAX_LENGTH}
        </p>
      </div>

      {/* Public profile */}
      <Card padding="md">
        <Toggle
          checked={isPublic}
          onChange={setIsPublic}
          label="Public profile"
          description="Let others discover you and your entries on Explore"
        />
      </Card>

      {/* Profile link */}
      <Card padding="md">
        <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
          Your profile URL
        </p>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          {typeof window !== "undefined" ? window.location.host : ""}/{username}
        </p>
      </Card>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="submit"
        disabled={saving}
        icon={saved ? <FiCheck className="h-4 w-4" /> : <FiSave className="h-4 w-4" />}
      >
        {saved ? "Saved!" : saving ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
