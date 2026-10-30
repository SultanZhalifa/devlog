import { describe, expect, it } from "vitest";
import { validateEntryFields, validateProfileFields } from "@/lib/api";
import { CONTENT } from "@/lib/constants";

const status = (r: Response | null) => r?.status ?? 200;

describe("validateEntryFields", () => {
  it("accepts a normal entry", () => {
    expect(
      status(
        validateEntryFields(
          { content: "Learned Prisma", mood: 4, isPublic: true },
          { requireContent: true },
        ),
      ),
    ).toBe(200);
  });

  it.each([
    [{ content: 123 }],
    [{ content: "   " }],
    [{ content: "x".repeat(CONTENT.ENTRY_MAX_LENGTH + 1) }],
    [{ content: "ok", mood: 2.5 }],
    [{ content: "ok", mood: "5" }],
    [{ content: "ok", isPublic: "yes" }],
    [{ content: "ok", date: "not a date" }],
  ])("rejects %j", (body) => {
    expect(status(validateEntryFields(body, { requireContent: true }))).toBe(400);
  });

  it("lets an update leave content out", () => {
    expect(status(validateEntryFields({ mood: 3 }, { requireContent: false }))).toBe(200);
  });
});

describe("validateProfileFields", () => {
  it("rejects a non-string or oversized bio", () => {
    expect(status(validateProfileFields({ bio: { $set: 1 } }))).toBe(400);
    expect(
      status(validateProfileFields({ bio: "x".repeat(CONTENT.BIO_MAX_LENGTH + 1) })),
    ).toBe(400);
  });

  it("rejects a non-boolean isPublic", () => {
    expect(status(validateProfileFields({ isPublic: "false" }))).toBe(400);
  });
});
