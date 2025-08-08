import botsService from "@/services/api/bots";
import { botQueryKeys } from "../queries/queryKeys";
import type {
  IBot,
  ICreateBotRequest,
  IUpdateBotRequest,
  IBotListResponse,
} from "@/types/entities/bots";
import {
  useCreateEntityMutation,
  useUpdateEntityMutation,
  useDeleteEntityMutation,
} from "@/hooks/api/useEntityMutations";
import Bots from "@/models/Bots";

/**
 * Hook for creating a new bot with optimistic updates
 */
export const useCreateBotMutation = () => {
  return useCreateEntityMutation<ICreateBotRequest, IBot, IBotListResponse>({
    createFn: (data) => botsService.create(data),
    keys: {
      lists: () => botQueryKeys.lists(),
      detail: (id: string) => botQueryKeys.detail(id),
      stats: () => botQueryKeys.stats(),
    },
    makeOptimisticEntity: (newEntity) => Bots(newEntity),
    applyOptimisticToList: (old, optimistic) => {
      if (!old?.payload) return old;
      return {
        ...old,
        payload: [optimistic, ...old.payload],
        totalDocs: (old.totalDocs || 0) + 1,
      };
    },
    successMessage: "bots.created",
    errorMessage: "errors.genericError",
  });
};

/**
 * Hook for updating a bot with optimistic updates
 */
export const useUpdateBotMutation = () => {
  return useUpdateEntityMutation<
    IUpdateBotRequest,
    IBot,
    IBotListResponse,
    IBot
  >({
    updateFn: ({ id, data }) => botsService.update(id, data),
    keys: {
      lists: () => botQueryKeys.lists(),
      detail: (id: string) => botQueryKeys.detail(id),
      stats: () => botQueryKeys.stats(),
    },
    applyOptimisticToDetail: (old, update) => {
      if (!old) return old;
      return { ...old, ...update, updatedAt: new Date().toISOString() } as IBot;
    },
    applyOptimisticToList: (old, id, update) => {
      if (!old?.payload) return old;
      return {
        ...old,
        payload: old.payload.map((bot) =>
          bot._id === id
            ? { ...bot, ...update, updatedAt: new Date().toISOString() }
            : bot
        ),
      };
    },
    successMessage: "bots.updated",
    errorMessage: "errors.genericError",
  });
};

/**
 * Hook for deleting a bot with optimistic updates
 */
export const useDeleteBotMutation = () => {
  return useDeleteEntityMutation<IBotListResponse>({
    deleteFn: (id: string) => botsService.delete(id),
    keys: {
      lists: () => botQueryKeys.lists(),
      detail: (id: string) => botQueryKeys.detail(id),
      stats: () => botQueryKeys.stats(),
    },
    applyOptimisticToList: (old, id) => {
      if (!old?.payload) return old;
      return {
        ...old,
        payload: old.payload.filter((bot) => bot._id !== id),
        totalDocs: Math.max((old.totalDocs || 1) - 1, 0),
      };
    },
    successMessage: "bots.deleted",
    errorMessage: "errors.genericError",
  });
};
