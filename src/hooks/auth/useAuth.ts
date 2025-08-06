import { useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/ui/use-toast";
import { useTranslation } from "react-i18next";

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
    refreshToken,
    clearError,
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
      return await refreshToken();
    } catch (error: any) {
      toast({
        title: t("auth.sessionExpired"),
        description: t("auth.pleaseLoginAgain"),
        variant: "destructive",
      });
      throw error;
    }
  }, [refreshToken, toast, t]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refresh,
    clearError,
  };
};
