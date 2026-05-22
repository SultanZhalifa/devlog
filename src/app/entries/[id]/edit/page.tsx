import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { EditEntryForm } from "@/components/EditEntryForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Entry" };

type Props = { params: Promise<{ id: string }> };

export default async function EditEntryPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const entry = await db.entry.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  });

  if (!entry || entry.userId !== session.user.id) notFound();

  const initialTags = entry.tags.map(({ tag }: { tag: { name: string } }) => tag.name);

  return (
    <EditEntryForm
      entryId={id}
      initialContent={entry.content}
      initialMood={entry.mood}
      initialIsPublic={entry.isPublic}
      initialTags={initialTags}
    />
  );
}
