import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define the shape of the user object
interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (userData: {
    name: string;
    email: string;
    avatar?: string;
    token: string;
  }) => void;
  logout: () => void;
  autoLogin: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      login: (userData) => {
        set({
          isAuthenticated: true,
          token: userData.token,
          user: {
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar,
          },
        });
      },
      logout: () => {
        set({
          isAuthenticated: false,
          token: null,
          user: null,
        });
      },
      autoLogin: () => {
        // The `persist` middleware automatically rehydrates the state from storage.
        // This function can be used for any explicit re-login logic if needed.
        // For example, you might want to verify the token with your backend here.
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
        if (state) {
          // If a token exists on rehydration, assume the user is still logged in.
          // You might want to add token validation logic here.
          if (state.token) {
            state.autoLogin();
          }
        }
      },
    }
  )
);
