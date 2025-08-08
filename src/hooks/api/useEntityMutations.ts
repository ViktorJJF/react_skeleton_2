import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { useToast } from "@/hooks/ui/use-toast";
import { useTranslation } from "react-i18next";
import { handleServiceError } from "@/services/errorHandler";

export interface EntityQueryKeys {
  lists: () => QueryKey;
  detail: (id: string) => QueryKey;
  stats?: () => QueryKey;
}

// CREATE
export interface CreateEntityOptions<TCreate, TEntity, TListShape> {
  createFn: (payload: TCreate) => Promise<unknown>;
  keys: EntityQueryKeys;
  makeOptimisticEntity?: (payload: TCreate) => TEntity;
  applyOptimisticToList?: (
    prev: TListShape | undefined,
    optimistic: TEntity
  ) => TListShape | undefined;
  successMessage?: string;
  errorMessage?: string;
}

export function useCreateEntityMutation<TCreate, TEntity, TListShape>(
  options: CreateEntityOptions<TCreate, TEntity, TListShape>
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const {
    createFn,
    keys,
    makeOptimisticEntity,
    applyOptimisticToList,
    successMessage = "common.success",
    errorMessage = "errors.genericError",
  } = options;

  return useMutation({
    mutationFn: createFn,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: keys.lists() });

      const previousLists = queryClient.getQueriesData<TListShape>({
        queryKey: keys.lists(),
      });

      if (makeOptimisticEntity && applyOptimisticToList) {
        const optimistic = makeOptimisticEntity(payload as TCreate);
        queryClient.setQueriesData<TListShape>(
          { queryKey: keys.lists() },
          (old) => applyOptimisticToList(old, optimistic)
        );
      }

      return { previousLists } as const;
    },
    onError: (_err, _vars, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      handleServiceError(_err, {
        operation: t("common.create"),
        fallbackMessage: t(errorMessage),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.lists() });
      if (keys.stats) queryClient.invalidateQueries({ queryKey: keys.stats() });
      toast({ title: t("common.success"), description: t(successMessage) });
    },
  });
}

// UPDATE
export interface UpdateEntityOptions<
  TUpdate,
  _TEntity,
  TListShape,
  TDetailShape
> {
  updateFn: (args: { id: string; data: TUpdate }) => Promise<unknown>;
  keys: EntityQueryKeys;
  applyOptimisticToDetail?: (
    prev: TDetailShape | undefined,
    update: TUpdate
  ) => TDetailShape | undefined;
  applyOptimisticToList?: (
    prev: TListShape | undefined,
    id: string,
    update: TUpdate
  ) => TListShape | undefined;
  successMessage?: string;
  errorMessage?: string;
}

export function useUpdateEntityMutation<
  TUpdate,
  _TEntity,
  TListShape,
  TDetailShape
>(options: UpdateEntityOptions<TUpdate, _TEntity, TListShape, TDetailShape>) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const {
    updateFn,
    keys,
    applyOptimisticToDetail,
    applyOptimisticToList,
    successMessage = t("common.success"),
    errorMessage = t("errors.genericError"),
  } = options;

  return useMutation({
    mutationFn: updateFn,
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: keys.detail(id) });
      await queryClient.cancelQueries({ queryKey: keys.lists() });

      const previousDetail = queryClient.getQueryData<TDetailShape>(
        keys.detail(id)
      );
      const previousLists = queryClient.getQueriesData<TListShape>({
        queryKey: keys.lists(),
      });

      if (applyOptimisticToDetail) {
        queryClient.setQueryData<TDetailShape>(keys.detail(id), (old) =>
          applyOptimisticToDetail(old, data as TUpdate)
        );
      }
      if (applyOptimisticToList) {
        queryClient.setQueriesData<TListShape>(
          { queryKey: keys.lists() },
          (old) => applyOptimisticToList(old, id, data as TUpdate)
        );
      }

      return { previousDetail, previousLists, id } as const;
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(
          keys.detail(context.id),
          context.previousDetail
        );
      }
      if (context?.previousLists) {
        context.previousLists.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      handleServiceError(_err, {
        operation: t("common.update"),
        fallbackMessage: errorMessage,
      });
    },
    onSuccess: (_res, { id }) => {
      queryClient.invalidateQueries({ queryKey: keys.detail(id) });
      queryClient.invalidateQueries({ queryKey: keys.lists() });
      toast({ title: t("common.success"), description: t(successMessage) });
    },
  });
}

// DELETE
export interface DeleteEntityOptions<TListShape> {
  deleteFn: (id: string) => Promise<unknown>;
  keys: EntityQueryKeys;
  applyOptimisticToList?: (
    prev: TListShape | undefined,
    id: string
  ) => TListShape | undefined;
  successMessage?: string;
  errorMessage?: string;
}

export function useDeleteEntityMutation<TListShape>(
  options: DeleteEntityOptions<TListShape>
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const {
    deleteFn,
    keys,
    applyOptimisticToList,
    successMessage = t("common.success"),
    errorMessage = t("errors.genericError"),
  } = options;

  return useMutation({
    mutationFn: deleteFn,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: keys.lists() });

      const previousLists = queryClient.getQueriesData<TListShape>({
        queryKey: keys.lists(),
      });

      if (applyOptimisticToList) {
        queryClient.setQueriesData<TListShape>(
          { queryKey: keys.lists() },
          (old) => applyOptimisticToList(old, id)
        );
      }

      return { previousLists, id } as const;
    },
    onError: (_err, _id, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      handleServiceError(_err, {
        operation: t("common.delete"),
        fallbackMessage: errorMessage,
      });
    },
    onSuccess: (_res, id) => {
      queryClient.removeQueries({ queryKey: keys.detail(id) });
      queryClient.invalidateQueries({ queryKey: keys.lists() });
      if (keys.stats) queryClient.invalidateQueries({ queryKey: keys.stats() });
      toast({ title: t("common.success"), description: t(successMessage) });
    },
  });
}
