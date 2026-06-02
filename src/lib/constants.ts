export const LIMITS = {
  DASHBOARD_ENTRIES: 10,
  PROFILE_ENTRIES: 20,
  EXPLORE_ENTRIES: 12,
  TRENDING_TAGS: 15,
  FEATURED_USERS_FETCH: 20,
  FEATURED_USERS_DISPLAY: 6,
  TOP_TAGS: 10,
} as const;

export const CONTENT = {
  ENTRY_PREVIEW_COMPACT: 120,
  ENTRY_PREVIEW_FULL: 300,
  TAG_MAX_LENGTH: 30,
  TAG_MAX_COUNT: 10,
  BIO_MAX_LENGTH: 300,
} as const;

export const SUGGESTED_TAGS = [
  "typescript",
  "react",
  "nextjs",
  "python",
  "css",
  "sql",
  "algorithms",
  "system-design",
  "devops",
  "open-source",
] as const;

export const MOOD_OPTIONS = [
  { value: 1, emoji: "😔", label: "Rough" },
  { value: 2, emoji: "😐", label: "Okay" },
  { value: 3, emoji: "😊", label: "Good" },
  { value: 4, emoji: "😄", label: "Great" },
  { value: 5, emoji: "🔥", label: "On fire" },
] as const;
