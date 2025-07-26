import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  autoLogin: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      isAuthenticated: false,
      token: null,
      login: (token: string) => {
        set({ isAuthenticated: true, token });
      },
      logout: () => {
        set({ isAuthenticated: false, token: null });
      },
      autoLogin: () => {
        // The `persist` middleware automatically rehydrates the state from storage.
        // We can check the rehydrated state to confirm authentication.
        // This function can be used for any explicit re-login logic if needed.
      },
    }),
    {
      name: "auth-storage", // name of the item in storage (must be unique)
      storage: createJSONStorage(() => localStorage), // use localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.autoLogin();
        }
      },
    }
  )
);
