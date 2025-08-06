import { useBotQuery } from "./queries/useBotQuery";
import {
  useUpdateBotMutation,
  useDeleteBotMutation,
} from "./mutations/useBotMutations";
import type { IUpdateBotRequest } from "@/types/entities/bots";

interface UseBotOptions {
  enabled?: boolean;
}

/**
 * Hook for managing a single bot
 */
export const useBot = (id: string | undefined, options: UseBotOptions = {}) => {
  const { enabled = true } = options;

  // Query
  const botQuery = useBotQuery(id, { enabled });

  // Mutations
  const updateMutation = useUpdateBotMutation();
  const deleteMutation = useDeleteBotMutation();

  // Bot data
  const bot = botQuery.data || null;

  // Actions
  const updateBot = (data: IUpdateBotRequest) => {
    if (!id) return;
    updateMutation.mutate({ id, data });
  };

  const updateBotAsync = (data: IUpdateBotRequest) => {
    if (!id) return Promise.reject(new Error("No bot ID provided"));
    return updateMutation.mutateAsync({ id, data });
  };

  const deleteBot = () => {
    if (!id) return;
    deleteMutation.mutate(id);
  };

  const deleteBotAsync = () => {
    if (!id) return Promise.reject(new Error("No bot ID provided"));
    return deleteMutation.mutateAsync(id);
  };

  return {
    // Data
    bot,

    // Query state
    isLoading: botQuery.isLoading,
    isFetching: botQuery.isFetching,
    isError: botQuery.isError,
    error: botQuery.error,

    // Mutation state
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isMutating: updateMutation.isPending || deleteMutation.isPending,

    // Actions
    refetch: botQuery.refetch,
    updateBot,
    updateBotAsync,
    deleteBot,
    deleteBotAsync,
  };
};
