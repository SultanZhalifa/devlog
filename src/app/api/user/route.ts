import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { bio, isPublic } = body as { bio?: string; isPublic?: boolean };

  const updated = await db.user.update({
    where: { id: session.user.id },
    data: {
      ...(bio !== undefined ? { bio: bio.trim() || null } : {}),
      ...(isPublic !== undefined ? { isPublic } : {}),
    },
    select: { id: true, bio: true, isPublic: true, username: true, name: true, avatar: true },
  });

  return NextResponse.json(updated);
}
