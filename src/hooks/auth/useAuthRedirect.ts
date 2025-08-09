import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/ui/use-toast";
import { useTranslation } from "react-i18next";

export interface AuthRedirectOptions {
  reason?: "unauthorized" | "session_expired" | "token_expired";
  redirectTo?: string;
  showToast?: boolean;
}

/**
 * Hook for handling authentication redirects
 */
export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { toast } = useToast();
  const { t } = useTranslation();

  const redirectToLogin = useCallback(
    (options: AuthRedirectOptions = {}) => {
      const { reason = "unauthorized", redirectTo, showToast = true } = options;

      // Clear auth state
      logout();

      // Show appropriate toast message
      if (showToast) {
        switch (reason) {
          case "session_expired":
            toast({
              title: t("auth.sessionExpired"),
              description: t("auth.sessionExpiredMessage"),
              variant: "destructive",
            });
            break;
          case "token_expired":
            toast({
              title: t("auth.tokenExpired"),
              description: t("auth.tokenExpiredMessage"),
              variant: "destructive",
            });
            break;
          case "unauthorized":
            toast({
              title: t("auth.accessDenied"),
              description: t("auth.loginRequired"),
              variant: "destructive",
            });
            break;
        }
      }

      // Navigate to login with appropriate query params
      const currentPath =
        redirectTo || `${window.location.pathname}${window.location.search}`;
      const loginUrl = `/login?reason=${reason}&redirect=${encodeURIComponent(
        currentPath
      )}`;

      navigate(loginUrl, { replace: true });
    },
    [navigate, logout, toast, t]
  );

  return { redirectToLogin };
};
