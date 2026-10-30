import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { readJson, validateProfileFields } from "@/lib/api";

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await readJson(request);
  if (!raw) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  const fieldError = validateProfileFields(raw);
  if (fieldError) return fieldError;
  const { bio, isPublic } = raw as { bio?: string; isPublic?: boolean };

  const updated = await db.user.update({
    where: { id: session.user.id },
    data: {
      ...(bio !== undefined ? { bio: bio.trim() || null } : {}),
      ...(isPublic !== undefined ? { isPublic } : {}),
    },
    select: { id: true, bio: true, isPublic: true, username: true },
  });

  return NextResponse.json(updated);
}
