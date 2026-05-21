import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 50);
  const cursor = searchParams.get("cursor");

  const entries = await db.entry.findMany({
    where: { userId: session.user.id },
    include: { tags: { include: { tag: true } }, user: true },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = entries.length > limit;
  const items = hasMore ? entries.slice(0, -1) : entries;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return NextResponse.json({ items, nextCursor });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { content, mood, isPublic, tags: tagNames, date } = body as {
    content: string;
    mood?: number;
    isPublic?: boolean;
    tags?: string[];
    date?: string;
  };

  if (!content?.trim()) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  if (mood !== undefined && (mood < 1 || mood > 5)) {
    return NextResponse.json({ error: "Mood must be between 1 and 5" }, { status: 400 });
  }

  const tagConnections = tagNames?.length
    ? await Promise.all(
        tagNames.map((name) =>
          db.tag.upsert({
            where: { name: name.toLowerCase().trim() },
            create: { name: name.toLowerCase().trim() },
            update: {},
          }),
        ),
      )
    : [];

  const entry = await db.entry.create({
    data: {
      userId: session.user.id,
      content: content.trim(),
      mood: mood ?? null,
      isPublic: isPublic ?? false,
      date: date ? new Date(date) : new Date(),
      tags: {
        create: tagConnections.map((tag: { id: string }) => ({ tagId: tag.id })),
      },
    },
    include: { tags: { include: { tag: true } }, user: true },
  });

  return NextResponse.json(entry, { status: 201 });
}
