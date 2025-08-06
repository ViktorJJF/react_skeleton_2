import { useMutation, useQueryClient } from "@tanstack/react-query";
import botsService from "@/services/api/bots";
import { botQueryKeys } from "../queries/queryKeys";
import { useToast } from "@/hooks/ui/use-toast";
import type {
  IBot,
  IBulkCreateBotsRequest,
  IBulkUpdateBotsRequest,
  IBulkDeleteBotsRequest,
} from "@/types/entities/bots";

/**
 * Hook for bulk creating bots
 */
export const useBulkCreateBotsMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: IBulkCreateBotsRequest) => botsService.bulkCreate(data),
    onSuccess: () => {
      // Invalidate all bot queries
      queryClient.invalidateQueries({ queryKey: botQueryKeys.all });

      toast({
        title: "Success",
        description: "Bots created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create bots. Please try again.",
        variant: "destructive",
      });
    },
  });
};

/**
 * Hook for bulk updating bots
 */
export const useBulkUpdateBotsMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: IBulkUpdateBotsRequest) => botsService.bulkUpdate(data),
    onMutate: async (updateData) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: botQueryKeys.lists() });

      // Snapshot previous value
      const previousBots = queryClient.getQueriesData({
        queryKey: botQueryKeys.lists(),
      });

      // Optimistically update cache
      queryClient.setQueriesData(
        { queryKey: botQueryKeys.lists() },
        (old: any) => {
          if (!old?.data?.docs) return old;

          const updateMap = new Map(
            updateData.updates.map((update) => [update.id, update.data])
          );

          return {
            ...old,
            data: {
              ...old.data,
              docs: old.data.docs.map((bot: IBot) => {
                const update = updateMap.get(bot._id);
                return update
                  ? { ...bot, ...update, updatedAt: new Date().toISOString() }
                  : bot;
              }),
            },
          };
        }
      );

      return { previousBots };
    },
    onError: (_, __, context) => {
      // Rollback optimistic updates
      if (context?.previousBots) {
        context.previousBots.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast({
        title: "Error",
        description: "Failed to update bots. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      // Invalidate all bot queries
      queryClient.invalidateQueries({ queryKey: botQueryKeys.all });

      toast({
        title: "Success",
        description: "Bots updated successfully.",
      });
    },
  });
};

/**
 * Hook for bulk deleting bots
 */
export const useBulkDeleteBotsMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: IBulkDeleteBotsRequest) => botsService.bulkDelete(data),
    onMutate: async (deleteData) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: botQueryKeys.lists() });

      // Snapshot previous value
      const previousBots = queryClient.getQueriesData({
        queryKey: botQueryKeys.lists(),
      });

      // Optimistically remove from cache
      queryClient.setQueriesData(
        { queryKey: botQueryKeys.lists() },
        (old: any) => {
          if (!old?.data?.docs) return old;

          const deleteIds = new Set(deleteData.ids);

          return {
            ...old,
            data: {
              ...old.data,
              docs: old.data.docs.filter(
                (bot: IBot) => !deleteIds.has(bot._id)
              ),
              pagination: {
                ...old.data.pagination,
                totalDocs: Math.max(
                  (old.data.pagination?.totalDocs || 0) - deleteData.ids.length,
                  0
                ),
              },
            },
          };
        }
      );

      return { previousBots };
    },
    onError: (_, __, context) => {
      // Rollback optimistic updates
      if (context?.previousBots) {
        context.previousBots.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast({
        title: "Error",
        description: "Failed to delete bots. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: (_, deleteData) => {
      // Remove from cache and invalidate
      deleteData.ids.forEach((id) => {
        queryClient.removeQueries({ queryKey: botQueryKeys.detail(id) });
      });
      queryClient.invalidateQueries({ queryKey: botQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: botQueryKeys.stats() });

      toast({
        title: "Success",
        description: "Bots deleted successfully.",
      });
    },
  });
};

/**
 * Convenience hook that combines all bulk operations
 */
export const useBulkBotOperations = () => {
  const bulkCreate = useBulkCreateBotsMutation();
  const bulkUpdate = useBulkUpdateBotsMutation();
  const bulkDelete = useBulkDeleteBotsMutation();

  return {
    // Create operations
    bulkCreate: bulkCreate.mutate,
    bulkCreateAsync: bulkCreate.mutateAsync,
    isCreating: bulkCreate.isPending,

    // Update operations
    bulkUpdate: bulkUpdate.mutate,
    bulkUpdateAsync: bulkUpdate.mutateAsync,
    isUpdating: bulkUpdate.isPending,

    // Delete operations
    bulkDelete: bulkDelete.mutate,
    bulkDeleteAsync: bulkDelete.mutateAsync,
    isDeleting: bulkDelete.isPending,

    // Combined loading state
    isLoading:
      bulkCreate.isPending || bulkUpdate.isPending || bulkDelete.isPending,
  };
};
