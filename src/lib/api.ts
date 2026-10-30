import { NextResponse } from "next/server";
import { CONTENT } from "@/lib/constants";

export function validateTags(tagNames: unknown): NextResponse | null {
  if (tagNames === undefined) return null;
  if (!Array.isArray(tagNames) || tagNames.length > CONTENT.TAG_MAX_COUNT) {
    return NextResponse.json({ error: "Maximum 10 tags allowed" }, { status: 400 });
  }
  if (
    tagNames.some(
      (t) =>
        typeof t !== "string" || !t.trim() || t.trim().length > CONTENT.TAG_MAX_LENGTH,
    )
  ) {
    return NextResponse.json({ error: "Invalid tag" }, { status: 400 });
  }
  return null;
}

const bad = (error: string) => NextResponse.json({ error }, { status: 400 });

/** Parse a JSON body; malformed JSON or a non-object becomes null instead of a 500. */
export async function readJson(
  request: Request,
): Promise<Record<string, unknown> | null> {
  const body: unknown = await request.json().catch(() => null);
  return body && typeof body === "object" && !Array.isArray(body)
    ? (body as Record<string, unknown>)
    : null;
}

/** Type and size checks for entry fields. `requireContent` is true when creating. */
export function validateEntryFields(
  body: Record<string, unknown>,
  { requireContent }: { requireContent: boolean },
): NextResponse | null {
  const { content, mood, isPublic, date } = body;
  if (content !== undefined || requireContent) {
    if (typeof content !== "string" || !content.trim()) return bad("Content is required");
    if (content.length > CONTENT.ENTRY_MAX_LENGTH) {
      return bad(`Content must be ${CONTENT.ENTRY_MAX_LENGTH} characters or fewer`);
    }
  }
  if (
    mood !== undefined &&
    mood !== null &&
    !(Number.isInteger(mood) && (mood as number) >= 1 && (mood as number) <= 5)
  ) {
    return bad("Mood must be between 1 and 5");
  }
  if (isPublic !== undefined && typeof isPublic !== "boolean")
    return bad("isPublic must be true or false");
  if (
    date !== undefined &&
    (typeof date !== "string" || Number.isNaN(new Date(date).getTime()))
  ) {
    return bad("Invalid date");
  }
  return null;
}

/** Type and size checks for profile fields. */
export function validateProfileFields(
  body: Record<string, unknown>,
): NextResponse | null {
  const { bio, isPublic } = body;
  if (
    bio !== undefined &&
    (typeof bio !== "string" || bio.length > CONTENT.BIO_MAX_LENGTH)
  ) {
    return bad(`Bio must be text of ${CONTENT.BIO_MAX_LENGTH} characters or fewer`);
  }
  if (isPublic !== undefined && typeof isPublic !== "boolean")
    return bad("isPublic must be true or false");
  return null;
}
