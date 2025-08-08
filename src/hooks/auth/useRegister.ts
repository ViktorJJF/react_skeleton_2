import { useCallback } from "react";
import { useToast } from "@/hooks/ui/use-toast";
import { useTranslation } from "react-i18next";
import authApi from "@/services/api/auth";
import type { RegisterRequest } from "@/types/api/auth";

/**
 * Hook for user registration
 */
export const useRegister = () => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const register = useCallback(
    async (credentials: RegisterRequest) => {
      try {
        const result = await authApi.register(credentials);
        if (result) {
          toast({
            title: t("auth.registrationSuccess"),
            description: t("auth.accountCreated"),
          });
        }
        return result;
      } catch (error: any) {
        const message =
          error?.response?.data?.errors?.msg ||
          error?.message ||
          t("auth.registrationFailed");
        toast({
          title: t("auth.registrationError"),
          description: message,
          variant: "destructive",
        });
        throw error;
      }
    },
    [toast, t]
  );

  return { register };
};
