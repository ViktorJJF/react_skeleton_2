import { useState, useCallback } from 'react';
import { useApiClient } from '@/hooks/api/useApiClient';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Generic API hook for handling API requests with loading, error, and success states
 */
export const useApi = <T = any>(options: UseApiOptions = {}) => {
  const {
    onSuccess,
    onError,
    showSuccessToast = false,
    showErrorToast = true,
    successMessage,
    errorMessage,
  } = options;

  const { handleApiError, handleApiSuccess } = useApiClient();

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (apiCall: () => Promise<T>) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await apiCall();

        setState({
          data: result,
          loading: false,
          error: null,
        });

        if (showSuccessToast && successMessage) {
          handleApiSuccess(successMessage);
        }

        onSuccess?.(result);
        return result;
      } catch (error) {
        const errorMsg = handleApiError(error, errorMessage);

        setState({
          data: null,
          loading: false,
          error: errorMsg.message,
        });

        if (showErrorToast) {
          // Error toast is handled by handleApiError
        }

        onError?.(errorMsg.message);
        return null;
      }
    },
    [
      handleApiError,
      handleApiSuccess,
      onSuccess,
      onError,
      showSuccessToast,
      showErrorToast,
      successMessage,
      errorMessage,
    ],
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
    isLoading: state.loading,
    isError: !!state.error,
    isSuccess: !!state.data && !state.loading && !state.error,
  };
};
