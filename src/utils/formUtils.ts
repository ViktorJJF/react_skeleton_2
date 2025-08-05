import { useCallback, useState } from "react";

/**
 * Generic form state interface
 */
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isValid: boolean;
  isDirty: boolean;
}

/**
 * Validation function type
 */
export type ValidationFunction<T> = (
  field: keyof T,
  value: any
) => string | undefined;

/**
 * Form validation rules
 */
export type ValidationRules<T> = {
  [K in keyof T]?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: T[K]) => string | undefined;
  };
};

/**
 * Hook for managing form state with validation
 * @param initialData - Initial form data
 * @param validationRules - Validation rules for form fields
 * @returns Form state and handlers
 */
export const useFormState = <T extends Record<string, any>>(
  initialData: T,
  validationRules?: ValidationRules<T>
) => {
  const [formState, setFormState] = useState<FormState<T>>({
    data: { ...initialData },
    errors: {},
    isValid: true,
    isDirty: false,
  });

  const validateField = useCallback(
    (field: keyof T, value: any): string | undefined => {
      const rules = validationRules?.[field];
      if (!rules) return undefined;

      // Required validation
      if (
        rules.required &&
        (value === undefined || value === null || value === "")
      ) {
        return `${String(field)} is required`;
      }

      // Skip other validations if field is empty and not required
      if (
        !rules.required &&
        (value === undefined || value === null || value === "")
      ) {
        return undefined;
      }

      // String validations
      if (typeof value === "string") {
        if (rules.minLength && value.length < rules.minLength) {
          return `${String(field)} must be at least ${
            rules.minLength
          } characters`;
        }

        if (rules.maxLength && value.length > rules.maxLength) {
          return `${String(field)} must be less than ${
            rules.maxLength
          } characters`;
        }

        if (rules.pattern && !rules.pattern.test(value)) {
          return `${String(field)} format is invalid`;
        }
      }

      // Custom validation
      if (rules.custom) {
        return rules.custom(value);
      }

      return undefined;
    },
    [validationRules]
  );

  const validateForm = useCallback(
    (data: T): boolean => {
      const errors: Partial<Record<keyof T, string>> = {};
      let isValid = true;

      Object.keys(data).forEach((key) => {
        const field = key as keyof T;
        const error = validateField(field, data[field]);
        if (error) {
          errors[field] = error;
          isValid = false;
        }
      });

      setFormState((prev) => ({
        ...prev,
        errors,
        isValid,
      }));

      return isValid;
    },
    [validateField]
  );

  const updateField = useCallback(
    (field: keyof T, value: any) => {
      setFormState((prev) => {
        const newData = { ...prev.data, [field]: value };
        const fieldError = validateField(field, value);
        const newErrors = { ...prev.errors };

        if (fieldError) {
          newErrors[field] = fieldError;
        } else {
          delete newErrors[field];
        }

        const isValid = Object.keys(newErrors).length === 0;

        return {
          data: newData,
          errors: newErrors,
          isValid,
          isDirty: true,
        };
      });
    },
    [validateField]
  );

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setFormState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
      isValid: false,
    }));
  }, []);

  const clearFieldError = useCallback((field: keyof T) => {
    setFormState((prev) => {
      const newErrors = { ...prev.errors };
      delete newErrors[field];

      return {
        ...prev,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0,
      };
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      errors: {},
      isValid: true,
    }));
  }, []);

  const resetForm = useCallback(
    (newData?: T) => {
      setFormState({
        data: newData ? { ...newData } : { ...initialData },
        errors: {},
        isValid: true,
        isDirty: false,
      });
    },
    [initialData]
  );

  const setFormData = useCallback((data: T) => {
    setFormState((prev) => ({
      ...prev,
      data: { ...data },
      isDirty: true,
    }));
  }, []);

  return {
    ...formState,
    validateField,
    validateForm,
    updateField,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    resetForm,
    setFormData,
  };
};

/**
 * Common validation rules
 */
export const commonValidations = {
  required: (fieldName: string) => ({
    required: true,
    custom: (value: any) => {
      if (value === undefined || value === null || value === "") {
        return `${fieldName} is required`;
      }
      return undefined;
    },
  }),

  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Please enter a valid email address";
      }
      return undefined;
    },
  },

  minLength: (min: number, fieldName: string = "Field") => ({
    minLength: min,
    custom: (value: string) => {
      if (value && value.length < min) {
        return `${fieldName} must be at least ${min} characters`;
      }
      return undefined;
    },
  }),

  maxLength: (max: number, fieldName: string = "Field") => ({
    maxLength: max,
    custom: (value: string) => {
      if (value && value.length > max) {
        return `${fieldName} must be less than ${max} characters`;
      }
      return undefined;
    },
  }),

  url: {
    pattern: /^https?:\/\/.+/,
    custom: (value: string) => {
      if (value && !/^https?:\/\/.+/.test(value)) {
        return "Please enter a valid URL";
      }
      return undefined;
    },
  },
};
