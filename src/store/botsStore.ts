import { create } from "zustand";
import { devtools } from "zustand/middleware";
import botsService from "@/services/api/bots";
import type {
  IBot,
  IBotListQuery,
  ICreateBotRequest,
  IUpdateBotRequest,
  IListBotsResponse,
  IListOneBotResponse,
  ICreateBotResponse,
  IUpdateBotResponse,
  IDeleteBotResponse,
} from "@/types/entities/bots";
import type { IPaginationMeta } from "@/types/api/pagination";

interface BotsState {
  // Data
  bots: IBot[];
  selectedBot: IBot | null;
  pagination: IPaginationMeta | null;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Error states
  error: string | null;

  // Query parameters
  query: IBotListQuery;

  // Actions
  fetchBots: (query?: IBotListQuery) => Promise<void>;
  fetchBot: (id: string) => Promise<void>;
  createBot: (data: ICreateBotRequest) => Promise<IBot | null>;
  updateBot: (id: string, data: IUpdateBotRequest) => Promise<IBot | null>;
  deleteBot: (id: string) => Promise<boolean>;

  // UI Actions
  setSelectedBot: (bot: IBot | null) => void;
  setQuery: (query: Partial<IBotListQuery>) => void;
  clearError: () => void;
  reset: () => void;
}

const initialQuery: IBotListQuery = {
  page: 1,
  limit: 10,
  sort: "createdAt",
  order: "desc",
};

const initialState = {
  bots: [],
  selectedBot: null,
  pagination: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  query: initialQuery,
};

export const useBotsStore = create<BotsState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchBots: async (query?: IBotListQuery) => {
        const finalQuery = query || get().query;
        set({ isLoading: true, error: null });

        try {
          const response = await botsService.list(finalQuery);

          if (response.status === 200) {
            const data = response.data as IListBotsResponse;
            set({
              bots: data.payload,
              pagination: {
                totalDocs: data.totalDocs,
                limit: data.limit,
                totalPages: data.totalPages,
                page: data.page,
                pagingCounter: data.pagingCounter,
                hasPrevPage: data.hasPrevPage,
                hasNextPage: data.hasNextPage,
                prevPage: data.prevPage,
                nextPage: data.nextPage,
              },
              query: finalQuery,
              isLoading: false,
            });
          } else {
            throw new Error("Failed to fetch bots");
          }
        } catch (error) {
          console.error("Error fetching bots:", error);
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch bots",
            isLoading: false,
          });
        }
      },

      fetchBot: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await botsService.listOne(id);

          if (response.status === 200) {
            const data = response.data as IListOneBotResponse;
            if ("ok" in data && data.ok) {
              set({
                selectedBot: data.payload,
                isLoading: false,
              });
            } else {
              throw new Error("Bot not found");
            }
          } else {
            throw new Error("Failed to fetch bot");
          }
        } catch (error) {
          console.error("Error fetching bot:", error);
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch bot",
            isLoading: false,
          });
        }
      },

      createBot: async (data: ICreateBotRequest) => {
        set({ isCreating: true, error: null });

        try {
          const response = await botsService.create(data);

          if (response.status === 200) {
            const responseData = response.data as ICreateBotResponse;
            if ("ok" in responseData && responseData.ok) {
              const newBot = responseData.payload;
              set((state) => ({
                bots: [newBot, ...state.bots],
                isCreating: false,
              }));

              // Refresh the list to get updated pagination
              await get().fetchBots();

              return newBot;
            } else if ("success" in responseData && !responseData.success) {
              const errorMsg = responseData.errors
                .map((e) => e.message)
                .join(", ");
              throw new Error(errorMsg);
            }
          }
          throw new Error("Failed to create bot");
        } catch (error) {
          console.error("Error creating bot:", error);
          set({
            error:
              error instanceof Error ? error.message : "Failed to create bot",
            isCreating: false,
          });
          return null;
        }
      },

      updateBot: async (id: string, data: IUpdateBotRequest) => {
        set({ isUpdating: true, error: null });

        try {
          const response = await botsService.update(id, data);

          if (response.status === 200) {
            const responseData = response.data as IUpdateBotResponse;
            if ("ok" in responseData && responseData.ok) {
              const updatedBot = responseData.payload;
              set((state) => ({
                bots: state.bots.map((bot) =>
                  bot._id === id ? updatedBot : bot
                ),
                selectedBot:
                  state.selectedBot?._id === id
                    ? updatedBot
                    : state.selectedBot,
                isUpdating: false,
              }));
              return updatedBot;
            } else if ("success" in responseData && !responseData.success) {
              const errorMsg = responseData.errors
                .map((e) => e.message)
                .join(", ");
              throw new Error(errorMsg);
            }
          }
          throw new Error("Failed to update bot");
        } catch (error) {
          console.error("Error updating bot:", error);
          set({
            error:
              error instanceof Error ? error.message : "Failed to update bot",
            isUpdating: false,
          });
          return null;
        }
      },

      deleteBot: async (id: string) => {
        set({ isDeleting: true, error: null });

        try {
          const response = await botsService.delete(id);

          if (response.status === 200) {
            const responseData = response.data as IDeleteBotResponse;
            if ("ok" in responseData && responseData.ok) {
              set((state) => ({
                bots: state.bots.filter((bot) => bot._id !== id),
                selectedBot:
                  state.selectedBot?._id === id ? null : state.selectedBot,
                isDeleting: false,
              }));

              // Refresh the list to get updated pagination
              await get().fetchBots();

              return true;
            } else if ("success" in responseData && !responseData.success) {
              const errorMsg = responseData.errors
                .map((e) => e.message)
                .join(", ");
              throw new Error(errorMsg);
            }
          }
          throw new Error("Failed to delete bot");
        } catch (error) {
          console.error("Error deleting bot:", error);
          set({
            error:
              error instanceof Error ? error.message : "Failed to delete bot",
            isDeleting: false,
          });
          return false;
        }
      },

      setSelectedBot: (bot: IBot | null) => {
        set({ selectedBot: bot });
      },

      setQuery: (query: Partial<IBotListQuery>) => {
        set((state) => ({
          query: { ...state.query, ...query },
        }));
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "bots-store",
    }
  )
);
