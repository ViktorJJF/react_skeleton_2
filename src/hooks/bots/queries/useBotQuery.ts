import { useQuery, useQueryClient } from "@tanstack/react-query";
import botsService from "@/services/api/bots";
import { botQueryKeys } from "./queryKeys";

interface UseBotQueryOptions {
  enabled?: boolean;
  staleTime?: number;
  retry?: boolean | number;
}

/**
 * Hook for fetching a single bot by ID
 */
export const useBotQuery = (
  id: string | undefined,
  options: UseBotQueryOptions = {}
) => {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    retry = 1,
  } = options;

  return useQuery({
    queryKey: botQueryKeys.detail(id!),
    queryFn: () => botsService.listOne(id!),
    enabled: enabled && !!id,
    staleTime,
    retry,
    select: (response) => response.data,
  });
};

/**
 * Hook for prefetching a bot (useful for hover states)
 */
export const usePrefetchBot = () => {
  const queryClient = useQueryClient();

  const prefetchBot = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: botQueryKeys.detail(id),
      queryFn: () => botsService.listOne(id),
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetchBot };
};
