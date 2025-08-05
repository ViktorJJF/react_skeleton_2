import { createContext } from "react";
import type { Theme } from "../types/common/theme";

export interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeProviderContext = createContext<
  ThemeProviderState | undefined
>(undefined);
