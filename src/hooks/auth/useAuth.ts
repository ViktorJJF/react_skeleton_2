import { useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/ui/use-toast";
import { useTranslation } from "react-i18next";
import authApi from "@/services/api/auth";

/**
 * Main authentication hook
 */
export const useAuth = () => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: authLogin,
    logout: authLogout,
    refreshTokenAction,
  } = useAuthStore();

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      try {
        const result = await authLogin(credentials);
        if (result) {
          toast({
            title: t("auth.loginSuccess"),
            description: t("auth.welcomeBack", { name: result.name }),
          });
        }
        return result;
      } catch (error: any) {
        toast({
          title: t("auth.loginError"),
          description: error.message || t("auth.invalidCredentials"),
          variant: "destructive",
        });
        throw error;
      }
    },
    [authLogin, toast, t]
  );

  const logout = useCallback(async () => {
    try {
      await authLogout();
      toast({
        title: t("auth.logoutSuccess"),
        description: t("auth.seeYouSoon"),
      });
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message || t("auth.logoutError"),
        variant: "destructive",
      });
    }
  }, [authLogout, toast, t]);

  const refresh = useCallback(async () => {
    try {
      return await refreshTokenAction();
    } catch (error: any) {
      toast({
        title: t("auth.sessionExpired"),
        description: t("auth.pleaseLoginAgain"),
        variant: "destructive",
      });
      throw error;
    }
  }, [refreshTokenAction, toast, t]);

  const loginWithGoogle = useCallback(
    async (accessToken: string) => {
      try {
        const res = await authApi.loginWithGoogle({
          accessToken,
          provider: "google",
        });
        // Update store token and fetch user
        useAuthStore.getState().setToken(res.token);
        await useAuthStore.getState().autoLogin();
        toast({
          title: t("auth.loginSuccess"),
          description: t("auth.welcomeBack", {
            name: res.user.email.split("@")[0],
          }),
        });
        return res;
      } catch (error: any) {
        toast({
          title: t("auth.loginFailed"),
          description: error?.message || t("auth.invalidCredentials"),
          variant: "destructive",
        });
        throw error;
      }
    },
    [toast, t]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refresh,
    loginWithGoogle,
  };
};
