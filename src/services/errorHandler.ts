import { AxiosError } from "axios";
import { toast } from "@/hooks/ui/use-toast";
import { IServiceError, IErrorHandlerOptions } from "@/types/api/errors";

/**
 * Global error handler for API services
 * Handles special payload structure from backend errors
 */
export class GlobalErrorHandler {
  /**
   * Extract error message from service error response
   */
  static extractErrorMessage(error: unknown): string {
    if (error instanceof AxiosError) {
      const responseData = error.response?.data as IServiceError;

      if (responseData?.errors) {
        // Handle single error with msg and code
        if ("msg" in responseData.errors) {
          return responseData.errors.msg;
        }

        // Handle validation errors array
        if (Array.isArray(responseData.errors)) {
          return responseData.errors.map((err) => err.message).join(", ");
        }
      }

      // Fallback to axios error message
      return error.response?.data?.message || error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "An unexpected error occurred";
  }

  /**
   * Get error code from service error response
   */
  static extractErrorCode(error: unknown): number | null {
    if (error instanceof AxiosError) {
      const responseData = error.response?.data as IServiceError;

      if (responseData?.errors && "code" in responseData.errors) {
        return responseData.errors.code;
      }

      return error.response?.status || null;
    }

    return null;
  }

  /**
   * Handle API errors with toast notifications
   */
  static handleError(error: unknown, options: IErrorHandlerOptions = {}) {
    const {
      showToast = true,
      operation,
      fallbackMessage = "An error occurred",
    } = options;

    const errorMessage = this.extractErrorMessage(error);
    const errorCode = this.extractErrorCode(error);

    // Log error for debugging
    console.error("Service Error:", {
      error,
      message: errorMessage,
      code: errorCode,
      operation,
    });

    if (showToast) {
      const title = operation ? `${operation} Failed` : "Error";
      const description = errorMessage || fallbackMessage;

      toast({
        title,
        description,
        variant: "destructive",
      });
    }

    return {
      message: errorMessage,
      code: errorCode,
    };
  }

  /**
   * Check if error is a validation error
   */
  static isValidationError(error: unknown): boolean {
    if (error instanceof AxiosError) {
      const responseData = error.response?.data as IServiceError;
      return responseData?.errors && Array.isArray(responseData.errors);
    }
    return false;
  }

  /**
   * Check if error is a specific error code
   */
  static isErrorCode(error: unknown, code: number): boolean {
    return this.extractErrorCode(error) === code;
  }

  /**
   * Get validation errors for form handling
   */
  static getValidationErrors(error: unknown): Record<string, string> {
    if (!this.isValidationError(error)) {
      return {};
    }

    const axiosError = error as AxiosError;
    const responseData = axiosError.response?.data as {
      errors: Array<{ field: string; message: string }>;
    };

    return responseData.errors.reduce((acc, err) => {
      acc[err.field] = err.message;
      return acc;
    }, {} as Record<string, string>);
  }
}

// Convenience functions for common use cases
export const handleServiceError = (
  error: unknown,
  options?: IErrorHandlerOptions
) => {
  return GlobalErrorHandler.handleError(error, options);
};

export const extractErrorMessage = (error: unknown): string => {
  return GlobalErrorHandler.extractErrorMessage(error);
};

export const extractErrorCode = (error: unknown): number | null => {
  return GlobalErrorHandler.extractErrorCode(error);
};

export const isValidationError = (error: unknown): boolean => {
  return GlobalErrorHandler.isValidationError(error);
};

export const getValidationErrors = (error: unknown): Record<string, string> => {
  return GlobalErrorHandler.getValidationErrors(error);
};
