import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SettingsForm } from "./SettingsForm";
import { PageHeader } from "@/components/ui/PageHeader";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { bio: true, isPublic: true, username: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <PageHeader title="Settings" subtitle="Manage your profile and preferences." />
      <SettingsForm
        initialBio={user.bio ?? ""}
        initialIsPublic={user.isPublic}
        username={user.username}
      />
    </div>
  );
}
