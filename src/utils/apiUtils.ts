import type { AxiosResponse, AxiosError } from 'axios';

/**
 * Generic API response handler
 * @param response - Axios response
 * @returns Parsed response data
 */
export const handleApiResponse = <T>(response: AxiosResponse<T>): T => {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  throw new Error(`API request failed with status ${response.status}`);
};

/**
 * Generic API error handler
 * @param error - Axios error
 * @returns Formatted error message
 */
export const handleApiError = (error: AxiosError | Error): string => {
  if ('isAxiosError' in error && error.isAxiosError) {
    const axiosError = error as AxiosError;

    // Handle validation errors (422)
    if (axiosError.response?.status === 422) {
      const responseData = axiosError.response.data as any;
      if (responseData?.errors && Array.isArray(responseData.errors)) {
        return responseData.errors.map((err: any) => err.message).join(', ');
      }
    }

    // Handle other HTTP errors
    if (axiosError.response?.data) {
      const responseData = axiosError.response.data as any;
      if (responseData?.message) {
        return responseData.message;
      }
      if (responseData?.error) {
        return responseData.error;
      }
    }

    // Handle network errors
    if (axiosError.message) {
      return axiosError.message;
    }
  }

  // Handle generic errors
  return error.message || 'An unexpected error occurred';
};

/**
 * Check if API response is successful
 * @param response - API response
 * @returns Boolean indicating success
 */
export const isApiSuccess = (response: any): boolean => {
  return response && (response.ok === true || response.success === true);
};

/**
 * Extract payload from API response
 * @param response - API response
 * @returns Payload data
 */
export const extractPayload = <T>(response: any): T => {
  if (response?.payload !== undefined) {
    return response.payload;
  }
  if (response?.data !== undefined) {
    return response.data;
  }
  return response;
};

/**
 * Build query string from parameters
 * @param params - Query parameters object
 * @returns Query string
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Retry API request with exponential backoff
 * @param apiCall - Function that makes the API call
 * @param maxRetries - Maximum number of retries
 * @param baseDelay - Base delay in milliseconds
 * @returns Promise with the API response
 */
export const retryApiCall = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

/**
 * Create a timeout promise
 * @param ms - Timeout in milliseconds
 * @returns Promise that rejects after timeout
 */
export const createTimeout = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms);
  });
};

/**
 * Race API call with timeout
 * @param apiCall - Function that makes the API call
 * @param timeoutMs - Timeout in milliseconds
 * @returns Promise with the API response or timeout error
 */
export const apiCallWithTimeout = async <T>(
  apiCall: () => Promise<T>,
  timeoutMs: number = 30000,
): Promise<T> => {
  return Promise.race([apiCall(), createTimeout(timeoutMs)]);
};

/**
 * Batch API requests
 * @param requests - Array of API request functions
 * @param batchSize - Number of concurrent requests
 * @returns Promise with array of results
 */
export const batchApiRequests = async <T>(
  requests: (() => Promise<T>)[],
  batchSize: number = 5,
): Promise<T[]> => {
  const results: T[] = [];

  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((request) => request()));
    results.push(...batchResults);
  }

  return results;
};

/**
 * Create a cache for API responses
 * @param ttl - Time to live in milliseconds
 * @returns Cache object with get and set methods
 */
export const createApiCache = <T>(ttl: number = 300000) => {
  const cache = new Map<string, { data: T; timestamp: number }>();

  return {
    get: (key: string): T | null => {
      const entry = cache.get(key);
      if (!entry) return null;

      if (Date.now() - entry.timestamp > ttl) {
        cache.delete(key);
        return null;
      }

      return entry.data;
    },

    set: (key: string, data: T): void => {
      cache.set(key, { data, timestamp: Date.now() });
    },

    clear: (): void => {
      cache.clear();
    },

    delete: (key: string): boolean => {
      return cache.delete(key);
    },
  };
};
