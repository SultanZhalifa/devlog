import { NextResponse } from "next/server";
import { CONTENT } from "@/lib/constants";

export function validateTags(tagNames: unknown): NextResponse | null {
  if (tagNames === undefined) return null;
  if (!Array.isArray(tagNames) || tagNames.length > CONTENT.TAG_MAX_COUNT) {
    return NextResponse.json({ error: "Maximum 10 tags allowed" }, { status: 400 });
  }
  if (
    tagNames.some(
      (t) => typeof t !== "string" || !t.trim() || t.trim().length > CONTENT.TAG_MAX_LENGTH,
    )
  ) {
    return NextResponse.json({ error: "Invalid tag" }, { status: 400 });
  }
  return null;
}
