import { useState, useMemo } from "react";
import { useBotsQuery, useBotsStatsQuery } from "./queries/useBotsQuery";
import {
  useCreateBotMutation,
  useUpdateBotMutation,
  useDeleteBotMutation,
} from "./mutations/useBotMutations";
import { useBulkBotOperations } from "./mutations/useBulkBotMutations";
import type { IBotListQuery } from "@/types/entities/bots";

interface UseBotsOptions {
  initialParams?: IBotListQuery;
  enableStats?: boolean;
}

/**
 * Main hook for bot management - combines queries, mutations, and state
 */
export const useBots = (options: UseBotsOptions = {}) => {
  const { initialParams = {}, enableStats = true } = options;

  // Query parameters state
  const [queryParams, setQueryParams] = useState<IBotListQuery>({
    page: 1,
    limit: 10,
    ...initialParams,
  });

  // Queries
  const botsQuery = useBotsQuery(queryParams);
  const statsQuery = useBotsStatsQuery(enableStats);

  // Mutations
  const createMutation = useCreateBotMutation();
  const updateMutation = useUpdateBotMutation();
  const deleteMutation = useDeleteBotMutation();
  const bulkDeleteMutation = useBulkBotOperations();

  // Computed values
  const bots = useMemo(() => botsQuery.data?.payload || [], [botsQuery.data]);
  const pagination = useMemo(() => botsQuery.data || null, [botsQuery.data]);
  const stats = useMemo(
    () => statsQuery.data || { total: 0, active: 0, inactive: 0 },
    [statsQuery.data]
  );

  // Query parameter helpers
  const updateParams = (newParams: Partial<IBotListQuery>) => {
    setQueryParams((prev) => ({ ...prev, ...newParams }));
  };

  const setPage = (page: number) => {
    updateParams({ page });
  };

  const setLimit = (limit: number) => {
    updateParams({ limit, page: 1 }); // Reset to first page when changing limit
  };

  const setSearch = (search: string) => {
    updateParams({ search: search || undefined, page: 1 }); // Reset to first page when searching
  };

  // Loading states
  const isLoading = botsQuery.isLoading || botsQuery.isFetching;
  const isStatsLoading = statsQuery.isLoading;
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    bulkDeleteMutation.isDeleting;
  const isBulkOperating = bulkDeleteMutation.isLoading;

  // Error states
  const error = botsQuery.error || statsQuery.error;
  const hasError = !!error;

  return {
    bots,
    pagination,
    stats,
    queryParams,
    isLoading,
    isStatsLoading,
    isMutating,
    isBulkOperating,
    hasError,
    error,
    refetch: botsQuery.refetch,
    refetchStats: statsQuery.refetch,
    updateParams,
    setPage,
    setLimit,
    setSearch,
    createMutation,
    updateMutation,
    deleteMutation,
    bulkDelete: bulkDeleteMutation.bulkDelete,
  };
};
