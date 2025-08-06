/**
 * Centralized query keys for bot-related queries
 * Following TanStack Query best practices for cache management
 */

export const botQueryKeys = {
  // Base keys
  all: ["bots"] as const,

  // List queries
  lists: () => [...botQueryKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...botQueryKeys.lists(), params] as const,

  // Detail queries
  details: () => [...botQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...botQueryKeys.details(), id] as const,

  // Stats queries
  stats: () => [...botQueryKeys.all, "stats"] as const,

  // Search queries
  search: (query: string) => [...botQueryKeys.all, "search", query] as const,

  // Suggestions
  suggestions: () => [...botQueryKeys.all, "suggestions"] as const,
} as const;
