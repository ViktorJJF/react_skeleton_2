import { useEffect, useRef, useCallback } from "react";

/**
 * Default debounce delay in milliseconds
 */
export const DEFAULT_DEBOUNCE_DELAY = 600;

/**
 * Debounce utility function
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = DEFAULT_DEBOUNCE_DELAY
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Hook for debounced search functionality
 * @param searchValue - Current search value
 * @param onSearch - Function to call when search should be executed
 * @param delay - Debounce delay in milliseconds
 */
export const useDebounceSearch = (
  searchValue: string,
  onSearch: (value: string) => void,
  delay: number = DEFAULT_DEBOUNCE_DELAY
) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onSearchRef = useRef(onSearch);

  // Update the ref with the latest onSearch function
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onSearchRef.current(searchValue);
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [searchValue, delay]); // Removed onSearch from dependencies

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
};

/**
 * Create a debounced callback function
 * @param callback - Function to debounce
 * @param delay - Debounce delay in milliseconds
 * @param deps - Dependencies array for useCallback
 * @returns Debounced callback function
 */
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = DEFAULT_DEBOUNCE_DELAY,
  deps: React.DependencyList = []
) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [...deps, delay]
  );
};

/**
 * Filter array of objects by search term across multiple fields
 * @param items - Array of objects to search
 * @param searchTerm - Search term
 * @param searchFields - Fields to search in
 * @returns Filtered array
 */
export const filterBySearch = <T extends Record<string, any>>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] => {
  if (!searchTerm.trim()) {
    return items;
  }

  const lowerSearchTerm = searchTerm.toLowerCase().trim();

  return items.filter((item) =>
    searchFields.some((field) => {
      const fieldValue = item[field];
      if (fieldValue == null) return false;

      return String(fieldValue).toLowerCase().includes(lowerSearchTerm);
    })
  );
};

/**
 * Highlight search term in text
 * @param text - Text to highlight
 * @param searchTerm - Term to highlight
 * @param className - CSS class for highlighted text
 * @returns Text with highlighted search term
 */
export const highlightSearchTerm = (
  text: string,
  searchTerm: string,
  className: string = "bg-yellow-200 dark:bg-yellow-800"
): string => {
  if (!searchTerm.trim()) {
    return text;
  }

  const regex = new RegExp(
    `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  return text.replace(regex, `<span class="${className}">$1</span>`);
};

/**
 * Build search query parameters for API requests
 * @param search - Search term
 * @param page - Page number
 * @param limit - Items per page
 * @param sort - Sort field
 * @param order - Sort order
 * @param additionalParams - Additional query parameters
 * @returns Query parameters object
 */
export const buildSearchQuery = (
  search?: string,
  page: number = 1,
  limit: number = 10,
  sort: string = "createdAt",
  order: "asc" | "desc" = "desc",
  additionalParams?: Record<string, any>
) => {
  const query: Record<string, any> = {
    page,
    limit,
    sort,
    order,
    ...additionalParams,
  };

  if (search?.trim()) {
    query.filters = search.trim();
  }

  // Remove undefined values
  Object.keys(query).forEach((key) => {
    if (query[key] === undefined) {
      delete query[key];
    }
  });

  return query;
};
