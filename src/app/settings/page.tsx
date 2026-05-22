import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SettingsForm } from "@/components/SettingsForm";
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
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold">Settings</h1>
      <SettingsForm
        initialBio={user.bio}
        initialIsPublic={user.isPublic}
        username={user.username}
      />
    </div>
  );
}
