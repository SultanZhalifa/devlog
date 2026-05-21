import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const tags = await db.tag.findMany({
    include: { _count: { select: { entries: true } } },
    orderBy: { entries: { _count: "desc" } },
    take: 30,
  });

  return NextResponse.json(
    tags.map((t: (typeof tags)[number]) => ({
      id: t.id,
      name: t.name,
      count: t._count.entries,
    })),
  );
}
