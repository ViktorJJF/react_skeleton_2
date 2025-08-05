import { useEffect, useCallback } from "react";
import { useBotsStore } from "@/store/botsStore";
import type {
  IBotListQuery,
  ICreateBotRequest,
  IUpdateBotRequest,
} from "@/types/entities/bots";

/**
 * Hook for fetching and managing bots list
 */
export const useBotsQuery = (initialQuery?: IBotListQuery) => {
  const {
    bots,
    pagination,
    isLoading,
    error,
    query,
    fetchBots,
    setQuery,
    clearError,
  } = useBotsStore();

  const refetch = useCallback(
    (newQuery?: IBotListQuery) => {
      return fetchBots(newQuery);
    },
    [fetchBots]
  );

  const updateQuery = useCallback(
    (newQuery: Partial<IBotListQuery>) => {
      setQuery(newQuery);
      return fetchBots({ ...query, ...newQuery });
    },
    [setQuery, fetchBots, query]
  );

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      fetchBots(initialQuery);
    } else {
      fetchBots();
    }
  }, []); // Only run on mount

  return {
    bots,
    pagination,
    isLoading,
    error,
    query,
    refetch,
    updateQuery,
    clearError,
  };
};

/**
 * Hook for fetching a single bot
 */
export const useBotQuery = (id?: string) => {
  const {
    selectedBot,
    isLoading,
    error,
    fetchBot,
    setSelectedBot,
    clearError,
  } = useBotsStore();

  const refetch = useCallback(() => {
    if (id) {
      return fetchBot(id);
    }
    return Promise.resolve();
  }, [fetchBot, id]);

  useEffect(() => {
    if (id) {
      fetchBot(id);
    } else {
      setSelectedBot(null);
    }
  }, [id, fetchBot, setSelectedBot]);

  return {
    bot: selectedBot,
    isLoading,
    error,
    refetch,
    clearError,
  };
};

/**
 * Hook for bot mutations (create, update, delete)
 */
export const useBotMutations = () => {
  const {
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createBot,
    updateBot,
    deleteBot,
    clearError,
  } = useBotsStore();

  const create = useCallback(
    async (data: ICreateBotRequest) => {
      const result = await createBot(data);
      return result;
    },
    [createBot]
  );

  const update = useCallback(
    async (id: string, data: IUpdateBotRequest) => {
      const result = await updateBot(id, data);
      return result;
    },
    [updateBot]
  );

  const remove = useCallback(
    async (id: string) => {
      const result = await deleteBot(id);
      return result;
    },
    [deleteBot]
  );

  return {
    create,
    update,
    remove,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    clearError,
  };
};

/**
 * Hook for bot form management
 */
export const useBotForm = () => {
  const { selectedBot, setSelectedBot } = useBotsStore();

  const setEditingBot = useCallback(
    (bot: any) => {
      setSelectedBot(bot);
    },
    [setSelectedBot]
  );

  const clearEditingBot = useCallback(() => {
    setSelectedBot(null);
  }, [setSelectedBot]);

  return {
    editingBot: selectedBot,
    setEditingBot,
    clearEditingBot,
  };
};
