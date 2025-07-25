import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  autoLogin: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => {
    localStorage.removeItem("auth_token");
    set({ isAuthenticated: false });
  },
  autoLogin: async () => {
    // In a real app, you'd verify the token with a backend
    const token = localStorage.getItem("auth_token");
    if (token) {
      set({ isAuthenticated: true });
    }
  },
}));
