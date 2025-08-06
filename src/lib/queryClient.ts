import { QueryClient } from "@tanstack/react-query";

/**
 * World-class TanStack Query configuration
 * Optimized for performance, UX, and developer experience
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Performance optimizations
      staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 min
      gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache for 10 min (was cacheTime)

      // UX optimizations
      refetchOnWindowFocus: true, // Refetch when user returns to tab
      refetchOnReconnect: true, // Refetch when internet reconnects
      retry: (failureCount, error: any) => {
        // Smart retry logic
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false; // Don't retry client errors (4xx)
        }
        return failureCount < 2; // Retry network errors max 2 times
      },

      // Error handling
      throwOnError: false, // Handle errors gracefully in components
    },
    mutations: {
      // Mutation defaults
      retry: (failureCount, error: any) => {
        // Don't retry mutations by default (they usually modify data)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 1; // Only retry once for network errors
      },

      // Error handling
      throwOnError: false,
    },
  },
});

/**
 * Query client utilities for advanced usage
 */
export const queryUtils = {
  /**
   * Clear all cached data (useful for logout)
   */
  clearAll: () => queryClient.clear(),

  /**
   * Get cached data without triggering a fetch
   */
  getCachedData: <T>(queryKey: unknown[]) =>
    queryClient.getQueryData<T>(queryKey),

  /**
   * Set cached data manually
   */
  setCachedData: <T>(queryKey: unknown[], data: T) =>
    queryClient.setQueryData(queryKey, data),

  /**
   * Invalidate specific queries
   */
  invalidate: (queryKey: unknown[]) =>
    queryClient.invalidateQueries({ queryKey }),

  /**
   * Remove specific queries from cache
   */
  remove: (queryKey: unknown[]) => queryClient.removeQueries({ queryKey }),

  /**
   * Prefetch data for better UX
   */
  prefetch: async <T>(queryKey: unknown[], queryFn: () => Promise<T>) =>
    queryClient.prefetchQuery({ queryKey, queryFn }),
};

export default queryClient;
