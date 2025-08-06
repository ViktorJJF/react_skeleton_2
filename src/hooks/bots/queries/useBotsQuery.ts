import {
  useQuery,
  useInfiniteQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import botsService from "@/services/api/bots";
import { botQueryKeys } from "./queryKeys";
import type { IBotListQuery, IListBotsResponse } from "@/types/entities/bots";

interface UseBotsQueryOptions extends IBotListQuery {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number;
  keepPreviousData?: boolean;
}

/**
 * Hook for fetching paginated list of bots with advanced features
 */
export const useBotsQuery = (options: UseBotsQueryOptions = {}) => {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    refetchInterval,
    keepPreviousData: keepPrevious = true,
    ...queryParams
  } = options;

  return useQuery({
    queryKey: botQueryKeys.list(queryParams),
    queryFn: () => botsService.list(queryParams),
    enabled,
    staleTime,
    refetchInterval,
    placeholderData: keepPrevious ? keepPreviousData : undefined,
    select: (response) => response.data,
  });
};

/**
 * Hook for infinite scrolling bot list
 */
export const useInfiniteBotsQuery = (
  baseParams: Omit<IBotListQuery, "page"> = {}
) => {
  return useInfiniteQuery({
    queryKey: botQueryKeys.list({ ...baseParams, infinite: true }),
    queryFn: ({ pageParam = 1 }) =>
      botsService.list({ ...baseParams, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const data = lastPage.data as IListBotsResponse;
      return data.hasNextPage ? data.page + 1 : undefined;
    },
    select: (data) => ({
      pages: data.pages.map((page) => page.data),
      pageParams: data.pageParams,
    }),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for bot statistics
 */
export const useBotsStatsQuery = (enabled = true) => {
  return useQuery({
    queryKey: botQueryKeys.stats(),
    queryFn: async () => {
      // Fetch basic stats from the list endpoint
      const response = await botsService.list({ page: 1, limit: 1 });
      const data = response.data as IListBotsResponse;

      return {
        total: data.totalDocs || 0,
        active: 0, // Would need separate endpoint for active count
        inactive: 0, // Would need separate endpoint for inactive count
      };
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes for stats
  });
};

/**
 * Hook for bot search suggestions
 */
export const useBotSuggestionsQuery = (query: string, enabled = true) => {
  return useQuery({
    queryKey: botQueryKeys.search(query),
    queryFn: () =>
      botsService.list({
        search: query,
        limit: 5,
        page: 1,
      }),
    enabled: enabled && query.length > 0,
    staleTime: 30 * 1000, // 30 seconds for search
    select: (response) => {
      const data = response.data;
      return data.payload || [];
    },
  });
};
