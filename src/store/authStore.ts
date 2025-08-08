import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import authApi from "@/services/api/auth";
import type { AuthUser, ApiUser, ApiLoginUser } from "@/types/entities/user";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  user: (AuthUser & { name?: string; avatar?: string }) | null;
  isLoading: boolean;
  error: string | null;
  // actions
  setToken: (token: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  login: (credentials: { email: string; password: string }) => Promise<{
    name: string;
    email: string;
    avatar?: string;
    token: string;
  } | null>;
  logout: () => void;
  autoLogin: () => Promise<void>;
  refreshTokenAction: () => Promise<string | null>;
}

// Helper functions to normalize API responses to our internal format
const normalizeApiUser = (apiUser: ApiUser): AuthUser => ({
  _id: apiUser._id,
  email: apiUser.email,
  firstName: apiUser.first_name || "",
  lastName: apiUser.last_name || "",
  role: apiUser.role,
  isEmailVerified: apiUser.verified,
  isActive: true, // API doesn't provide this field, assume true
  createdAt: apiUser.createdAt,
  updatedAt: apiUser.updatedAt,
});

const normalizeLoginUser = (loginUser: ApiLoginUser): Partial<AuthUser> => ({
  _id: loginUser._id,
  email: loginUser.email,
  role: loginUser.role,
  isEmailVerified: loginUser.verified,
  isActive: true,
  // firstName/lastName not provided in login response
  firstName: "",
  lastName: "",
  createdAt: "",
  updatedAt: "",
});

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
      refreshToken: null,
      user: null,
      isLoading: false,
      error: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      login: async ({ email, password }) => {
        try {
          set({ isLoading: true, error: null });
          const res = await authApi.login({ email, password });
          // Normalize the user from login response
          const normalizedUser = normalizeLoginUser(res.user);
          const name =
            normalizedUser.firstName && normalizedUser.lastName
              ? `${normalizedUser.firstName} ${normalizedUser.lastName}`.trim()
              : res.user.email.split("@")[0]; // fallback to email prefix

          set({
            isAuthenticated: true,
            token: res.token,
            refreshToken: null, // API doesn't provide refresh token in login
            user: { ...normalizedUser, name } as AuthUser & { name: string },
            isLoading: false,
          });

          return { name, email: res.user.email, token: res.token };
        } catch (e) {
          const message = e instanceof Error ? e.message : "Login failed";
          set({ isLoading: false, error: message });
          throw e;
        }
      },
      logout: () => {
        set({
          isAuthenticated: false,
          token: null,
          refreshToken: null,
          user: null,
        });
      },
      autoLogin: async () => {
        const token = get().token;
        if (!token) {
          return;
        }
        try {
          set({ isLoading: true, error: null });
          const me = await authApi.me();
          const normalizedUser = normalizeApiUser(me);
          const name =
            `${normalizedUser.firstName} ${normalizedUser.lastName}`.trim();
          set({
            user: { ...normalizedUser, name },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          // try refresh token flow
          try {
            const refreshed = await get().refreshTokenAction();
            if (refreshed) {
              const me = await authApi.me();
              const normalizedUser = normalizeApiUser(me);
              const name =
                `${normalizedUser.firstName} ${normalizedUser.lastName}`.trim();
              set({
                user: { ...normalizedUser, name },
                isAuthenticated: true,
                isLoading: false,
              });
              return;
            }
          } catch {
            // Silently fail refresh attempt
          }
          set({
            isAuthenticated: false,
            token: null,
            refreshToken: null,
            user: null,
            isLoading: false,
          });
        }
      },
      refreshTokenAction: async () => {
        try {
          const res = await authApi.refreshToken();
          if (res.token) {
            set({ token: res.token });
            return res.token;
          }
          return null;
        } catch {
          set({
            isAuthenticated: false,
            token: null,
            refreshToken: null,
            user: null,
          });
          return null;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
