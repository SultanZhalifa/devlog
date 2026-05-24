import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { WriteForm } from "./WriteForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Write" };

type Props = { searchParams: Promise<{ edit?: string }> };

export default async function WritePage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { edit } = await searchParams;

  let initialData = null;
  if (edit) {
    const entry = await db.entry.findUnique({
      where: { id: edit },
      include: { tags: { include: { tag: true } } },
    });

    if (entry && entry.userId === session.user.id) {
      initialData = {
        id: entry.id,
        content: entry.content,
        mood: entry.mood,
        isPublic: entry.isPublic,
        tags: entry.tags.map((et) => et.tag.name),
      };
    }
  }

  return <WriteForm initialData={initialData} />;
}
