import { useCallback } from 'react';
import { useToast } from '@/hooks/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { GlobalErrorHandler } from '@/services/errorHandler';
import type { IErrorHandlerOptions } from '@/types/api/errors';

/**
 * Generic API client hook for handling common API operations
 */
export const useApiClient = () => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleApiError = useCallback(
    (error: unknown, operation?: string) => {
      const options: IErrorHandlerOptions = {
        showToast: true,
        operation,
        fallbackMessage: t('common.apiError'),
      };

      return GlobalErrorHandler.handleError(error, options);
    },
    [t],
  );

  const handleApiSuccess = useCallback(
    (message: string, details?: string) => {
      toast({
        title: t('common.success'),
        description: details || message,
      });
    },
    [toast, t],
  );

  return {
    handleApiError,
    handleApiSuccess,
    // Expose additional error handling utilities
    extractErrorMessage: GlobalErrorHandler.extractErrorMessage,
    extractErrorCode: GlobalErrorHandler.extractErrorCode,
    isValidationError: GlobalErrorHandler.isValidationError,
    getValidationErrors: GlobalErrorHandler.getValidationErrors,
  };
};
