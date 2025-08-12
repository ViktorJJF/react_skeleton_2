import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppConfig } from '@/types/common/config';

interface ConfigState extends AppConfig {
  setItemsPerPage: (value: number) => void;
  setPageSizeOptions: (options: number[]) => void;
  setDebounceDelayMs: (value: number) => void;
  resetDefaults: () => void;
}

const defaultConfig: AppConfig = {
  itemsPerPage: 15,
  pageSizeOptions: [5, 10, 20, 50],
  debounceDelayMs: 500,
};

export const useConfigStore = create(
  persist<ConfigState>(
    (set) => ({
      ...defaultConfig,

      setItemsPerPage: (value) =>
        set({ itemsPerPage: value > 0 ? value : defaultConfig.itemsPerPage }),

      setPageSizeOptions: (options) =>
        set({
          pageSizeOptions: options.filter((n) => Number.isFinite(n) && n > 0),
        }),

      setDebounceDelayMs: (value) =>
        set({
          debounceDelayMs: value >= 0 ? value : defaultConfig.debounceDelayMs,
        }),

      resetDefaults: () => set({ ...defaultConfig }),
    }),
    {
      name: 'app-config',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);

export default useConfigStore;
