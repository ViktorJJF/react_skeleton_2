import { useCallback, useState } from "react";
import { useToast } from "@/hooks/ui/use-toast";
import { useTranslation } from "react-i18next";
import authApi from "@/services/api/auth";
import { useAuthStore } from "@/store/authStore";
import type {
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "@/types/api/auth";

export const useProfile = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setUser);

  const updateProfile = useCallback(
    async (data: UpdateProfileRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedUser = await authApi.updateProfile(data);

        // Normalize the updated user data
        const normalizedUser = {
          _id: updatedUser._id,
          email: updatedUser.email,
          firstName: updatedUser.first_name || "",
          lastName: updatedUser.last_name || "",
          role: updatedUser.role,
          isEmailVerified: updatedUser.verified,
          isActive: true,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        };

        // Update the auth store with new user data
        setAuthUser(normalizedUser);

        toast({
          title: t("profile.updateSuccess"),
          description: t("profile.profileUpdated"),
        });

        return normalizedUser;
      } catch (err: any) {
        const message =
          err?.response?.data?.errors?.msg ||
          err?.message ||
          t("profile.updateFailed");
        setError(message);
        toast({
          title: t("profile.updateFailed"),
          description: message,
          variant: "destructive",
        });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [toast, t, setAuthUser]
  );

  const changePassword = useCallback(
    async (data: ChangePasswordRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await authApi.changePassword(data);

        toast({
          title: t("profile.passwordChanged"),
          description: t("profile.passwordChangeSuccess"),
        });

        return result;
      } catch (err: any) {
        const message =
          err?.response?.data?.errors?.msg ||
          err?.message ||
          t("profile.passwordChangeFailed");
        setError(message);
        toast({
          title: t("profile.passwordChangeFailed"),
          description: message,
          variant: "destructive",
        });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [toast, t]
  );

  return {
    user,
    updateProfile,
    changePassword,
    isLoading,
    error,
  };
};
