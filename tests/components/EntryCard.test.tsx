import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EntryCard } from "@/components/EntryCard";
import type { EntryWithTags } from "@/types";

const mockEntry: EntryWithTags = {
  id: "entry-1",
  userId: "user-1",
  content: "Learned how TypeScript generics work today. Really useful stuff.",
  date: new Date("2025-05-21"),
  mood: 4,
  isPublic: true,
  createdAt: new Date("2025-05-21T10:00:00Z"),
  updatedAt: new Date("2025-05-21T10:00:00Z"),
  tags: [
    { tag: { id: "tag-1", name: "typescript" } },
  ],
  user: {
    id: "user-1",
    username: "sultan",
    name: "Sultan Zhalifa",
    avatar: "https://avatars.githubusercontent.com/u/1",
  },
};

describe("EntryCard", () => {
  it("renders entry content", () => {
    render(<EntryCard entry={mockEntry} />);
    expect(screen.getByText(/Learned how TypeScript/i)).toBeInTheDocument();
  });

  it("renders tag badges", () => {
    render(<EntryCard entry={mockEntry} />);
    expect(screen.getByText(/#typescript/i)).toBeInTheDocument();
  });

  it("shows user info when showUser is true", () => {
    render(<EntryCard entry={mockEntry} showUser />);
    expect(screen.getByText("Sultan Zhalifa")).toBeInTheDocument();
    expect(screen.getByText("@sultan")).toBeInTheDocument();
  });

  it("does not show user info by default", () => {
    render(<EntryCard entry={mockEntry} />);
    expect(screen.queryByText("@sultan")).not.toBeInTheDocument();
  });
});
