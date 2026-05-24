import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Params = Promise<{ username: string }>;

export async function POST(_req: NextRequest, { params }: { params: Params }) {
  const { username } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const target = await db.user.findUnique({ where: { username } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (target.id === session.user.id) {
    return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
  }

  await db.follow.upsert({
    where: {
      followerId_followingId: {
        followerId: session.user.id,
        followingId: target.id,
      },
    },
    create: { followerId: session.user.id, followingId: target.id },
    update: {},
  });

  return NextResponse.json({ following: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const { username } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const target = await db.user.findUnique({ where: { username } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

  await db.follow.deleteMany({
    where: { followerId: session.user.id, followingId: target.id },
  });

  return NextResponse.json({ following: false });
}
