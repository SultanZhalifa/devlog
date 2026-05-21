import type { User, Entry, Tag, Follow } from "@/generated/prisma/client";

export type EntryWithTags = Entry & {
  tags: { tag: Tag }[];
  user: Pick<User, "id" | "username" | "name" | "avatar">;
};

export type UserWithStats = User & {
  _count: {
    entries: number;
    followers: number;
    following: number;
  };
};

export type TagWithCount = Tag & {
  _count: { entries: number };
};

export type AnalyticsData = {
  streak: number;
  totalEntries: number;
  topTags: { name: string; count: number }[];
  entriesPerWeek: { week: string; count: number }[];
  activityMap: Record<string, number>;
};

// Re-export Prisma types for convenience
export type { User, Entry, Tag, Follow };
