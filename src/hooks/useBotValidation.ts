import { useState, useCallback, useMemo } from "react";
import type {
  ICreateBotRequest,
  IUpdateBotRequest,
} from "@/types/entities/bots";

type BotFormData = ICreateBotRequest | IUpdateBotRequest;

interface ValidationErrors {
  name?: string;
  isActive?: string;
}

interface UseBotValidationReturn {
  errors: ValidationErrors;
  isValid: boolean;
  validate: (data: BotFormData) => boolean;
  validateField: (field: keyof BotFormData, value: any) => string | undefined;
  clearErrors: () => void;
  clearFieldError: (field: keyof ValidationErrors) => void;
}

export const useBotValidation = (): UseBotValidationReturn => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback(
    (
      field: keyof BotFormData,
      value: string | boolean | undefined
    ): string | undefined => {
      switch (field) {
        case "name":
          if (!value || typeof value !== "string") {
            return "Name is required";
          }
          if (value.trim().length < 2) {
            return "Name must be at least 2 characters long";
          }
          if (value.trim().length > 100) {
            return "Name must be less than 100 characters";
          }
          return undefined;

        case "isActive":
          if (value !== undefined && typeof value !== "boolean") {
            return "Active status must be a boolean value";
          }
          return undefined;

        default:
          return undefined;
      }
    },
    []
  );

  const validate = useCallback(
    (data: BotFormData): boolean => {
      const newErrors: ValidationErrors = {};
      let isValid = true;

      // Validate name
      const nameError = validateField("name", data.name);
      if (nameError) {
        newErrors.name = nameError;
        isValid = false;
      }

      // Validate isActive
      const isActiveError = validateField("isActive", data.isActive);
      if (isActiveError) {
        newErrors.isActive = isActiveError;
        isValid = false;
      }

      setErrors(newErrors);
      return isValid;
    },
    [validateField]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: keyof ValidationErrors) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  return {
    errors,
    isValid,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
  };
};
