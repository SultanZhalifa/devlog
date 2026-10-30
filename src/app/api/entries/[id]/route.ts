import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { readJson, validateEntryFields, validateTags } from "@/lib/api";
import type { UpdateEntryInput } from "@/types";

type Params = Promise<{ id: string }>;

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const session = await auth();

  const entry = await db.entry.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } }, user: true },
  });

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!entry.isPublic && entry.userId !== session?.user?.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(entry);
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entry = await db.entry.findUnique({ where: { id } });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (entry.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const raw = await readJson(request);
  if (!raw) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  const fieldError = validateEntryFields(raw, { requireContent: false });
  if (fieldError) return fieldError;
  const { content, mood, isPublic, tags: tagNames } = raw as unknown as UpdateEntryInput;

  const tagError = validateTags(tagNames);
  if (tagError) return tagError;

  const tagConnections = tagNames
    ? await Promise.all(
        tagNames.map((name) =>
          db.tag.upsert({
            where: { name: name.toLowerCase().trim() },
            create: { name: name.toLowerCase().trim() },
            update: {},
          }),
        ),
      )
    : undefined;

  const updated = await db.entry.update({
    where: { id },
    data: {
      ...(content !== undefined ? { content: content.trim() } : {}),
      ...(mood !== undefined ? { mood } : {}),
      ...(isPublic !== undefined ? { isPublic } : {}),
      ...(tagConnections !== undefined
        ? {
            tags: {
              deleteMany: {},
              create: tagConnections.map((tag: { id: string }) => ({ tagId: tag.id })),
            },
          }
        : {}),
    },
    include: { tags: { include: { tag: true } }, user: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entry = await db.entry.findUnique({ where: { id } });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (entry.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.entry.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
