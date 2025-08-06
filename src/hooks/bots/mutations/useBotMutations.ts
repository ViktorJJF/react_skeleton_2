import { useMutation, useQueryClient } from "@tanstack/react-query";
import botsService from "@/services/api/bots";
import { botQueryKeys } from "../queries/queryKeys";
import { useToast } from "@/hooks/ui/use-toast";
import type {
  IBot,
  ICreateBotRequest,
  IUpdateBotRequest,
} from "@/types/entities/bots";

/**
 * Hook for creating a new bot with optimistic updates
 */
export const useCreateBotMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: ICreateBotRequest) => botsService.create(data),
    onMutate: async (newBot) => {
      // Cancel outgoing refetches
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

          const optimisticBot: IBot = {
            _id: `temp-${Date.now()}`,
            name: newBot.name,
            description: newBot.description || "",
            isActive: newBot.isActive ?? true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          return {
            ...old,
            data: {
              ...old.data,
              docs: [optimisticBot, ...old.data.docs],
              pagination: {
                ...old.data.pagination,
                totalDocs: (old.data.pagination?.totalDocs || 0) + 1,
              },
            },
          };
        }
      );

      return { previousBots };
    },
    onError: (_, __, context) => {
      // Rollback optimistic update
      if (context?.previousBots) {
        context.previousBots.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast({
        title: "Error",
        description: "Failed to create bot. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: botQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: botQueryKeys.stats() });

      toast({
        title: "Success",
        description: "Bot created successfully.",
      });
    },
  });
};

/**
 * Hook for updating a bot with optimistic updates
 */
export const useUpdateBotMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateBotRequest }) =>
      botsService.update(id, data),
    onMutate: async ({ id, data: updateData }) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: botQueryKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: botQueryKeys.lists() });

      // Snapshot previous values
      const previousBot = queryClient.getQueryData(botQueryKeys.detail(id));
      const previousBots = queryClient.getQueriesData({
        queryKey: botQueryKeys.lists(),
      });

      // Optimistically update detail
      queryClient.setQueryData(botQueryKeys.detail(id), (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              ...updateData,
              updatedAt: new Date().toISOString(),
            },
          },
        };
      });

      // Optimistically update lists
      queryClient.setQueriesData(
        { queryKey: botQueryKeys.lists() },
        (old: any) => {
          if (!old?.data?.docs) return old;

          return {
            ...old,
            data: {
              ...old.data,
              docs: old.data.docs.map((bot: IBot) =>
                bot._id === id
                  ? {
                      ...bot,
                      ...updateData,
                      updatedAt: new Date().toISOString(),
                    }
                  : bot
              ),
            },
          };
        }
      );

      return { previousBot, previousBots };
    },
    onError: (_, variables, context) => {
      // Rollback optimistic updates
      if (context?.previousBot) {
        queryClient.setQueryData(
          botQueryKeys.detail(variables.id),
          context.previousBot
        );
      }
      if (context?.previousBots) {
        context.previousBots.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast({
        title: "Error",
        description: "Failed to update bot. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: (_, { id }) => {
      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: botQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: botQueryKeys.lists() });

      toast({
        title: "Success",
        description: "Bot updated successfully.",
      });
    },
  });
};

/**
 * Hook for deleting a bot with optimistic updates
 */
export const useDeleteBotMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => botsService.delete(id),
    onMutate: async (id) => {
      // Cancel queries
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

          return {
            ...old,
            data: {
              ...old.data,
              docs: old.data.docs.filter((bot: IBot) => bot._id !== id),
              pagination: {
                ...old.data.pagination,
                totalDocs: Math.max(
                  (old.data.pagination?.totalDocs || 1) - 1,
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
      // Rollback optimistic update
      if (context?.previousBots) {
        context.previousBots.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast({
        title: "Error",
        description: "Failed to delete bot. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: (_, id) => {
      // Remove from cache and invalidate
      queryClient.removeQueries({ queryKey: botQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: botQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: botQueryKeys.stats() });

      toast({
        title: "Success",
        description: "Bot deleted successfully.",
      });
    },
  });
};
