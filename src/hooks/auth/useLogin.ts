import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { useApi } from "@/hooks/api/useApi";

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

/**
 * Hook for login form management and validation
 */
export const useLogin = () => {
  const { login } = useAuth();
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const { loading: isLoggingIn, execute: executeLogin } = useApi({
    showErrorToast: false, // We handle errors manually
  });

  const validateField = useCallback(
    (field: keyof LoginCredentials, value: any): string | null => {
      switch (field) {
        case "email":
          if (!value) return "Email is required";
          if (!/\S+@\S+\.\S+/.test(value)) return "Please enter a valid email";
          return null;
        case "password":
          if (!value) return "Password is required";
          if (value.length < 6) return "Password must be at least 6 characters";
          return null;
        default:
          return null;
      }
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: LoginFormErrors = {};

    const emailError = validateField("email", formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validateField("password", formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  const updateField = useCallback(
    (field: keyof LoginCredentials, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear field error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const handleLogin = useCallback(async () => {
    if (!validateForm()) {
      return false;
    }

    try {
      const result = await executeLogin(() =>
        login({
          email: formData.email,
          password: formData.password,
        })
      );

      return !!result;
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        general: error.message || "Login failed. Please try again.",
      }));
      return false;
    }
  }, [validateForm, executeLogin, login, formData]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearForm = useCallback(() => {
    setFormData({
      email: "",
      password: "",
      rememberMe: false,
    });
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isLoggingIn,
    updateField,
    handleLogin,
    clearErrors,
    clearForm,
    validateField,
  };
};
