import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Params = Promise<{ userId: string }>;

export async function POST(_req: NextRequest, { params }: { params: Params }) {
  const { userId: followingId } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const followerId = session.user.id;

  if (followerId === followingId) {
    return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 });
  }

  const targetUser = await db.user.findUnique({ where: { id: followingId } });
  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await db.follow.upsert({
    where: { followerId_followingId: { followerId, followingId } },
    create: { followerId, followingId },
    update: {},
  });

  return NextResponse.json({ following: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const { userId: followingId } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const followerId = session.user.id;

  await db.follow.deleteMany({ where: { followerId, followingId } });

  return NextResponse.json({ following: false });
}
