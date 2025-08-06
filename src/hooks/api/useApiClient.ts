import { useCallback } from "react";
import { useToast } from "@/hooks/ui/use-toast";
import { useTranslation } from "react-i18next";

/**
 * Generic API client hook for handling common API operations
 */
export const useApiClient = () => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleApiError = useCallback(
    (error: any, operation?: string) => {
      const errorMessage =
        error.response?.data?.message || error.message || t("common.apiError");

      toast({
        title: t("common.error"),
        description: operation
          ? t("common.operationFailed", { operation })
          : errorMessage,
        variant: "destructive",
      });

      console.error("API Error:", error);
      return errorMessage;
    },
    [toast, t]
  );

  const handleApiSuccess = useCallback(
    (message: string, details?: string) => {
      toast({
        title: t("common.success"),
        description: details || message,
      });
    },
    [toast, t]
  );

  return {
    handleApiError,
    handleApiSuccess,
  };
};
