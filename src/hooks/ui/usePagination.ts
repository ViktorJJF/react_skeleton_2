import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useConfigStore } from '@/store/configStore';

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSearchTerm?: string;
  debounceDelay?: number;
}

/**
 * A hook to centralize state management for server-side pagination,
 * sorting, and searching.
 * @param options - Initial configuration for page, limit, etc.
 * @returns An object with state values and stable handlers.
 */
export const usePagination = (options: UsePaginationOptions = {}) => {
  const config = useConfigStore.getState();
  const {
    initialPage = 1,
    initialLimit = config.itemsPerPage,
    initialSearchTerm = '',
    debounceDelay = config.debounceDelayMs,
  } = options;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  // Automatically reset to the first page when the search term changes.
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [debouncedSearchTerm]);

  // Use useCallback to ensure these functions have a stable identity,
  // preventing unnecessary re-renders in consumer components.
  const goToNextPage = useCallback(() => setPage((p) => p + 1), []);
  const goToPreviousPage = useCallback(
    () => setPage((p) => Math.max(1, p - 1)),
    [],
  );

  // useMemo ensures the entire returned object is stable unless its
  // dependency values actually change.
  return useMemo(
    () => ({
      // State
      page,
      limit,
      searchTerm,
      debouncedSearchTerm,
      // Setters
      setPage,
      setLimit,
      setSearchTerm,
      // Handlers
      goToNextPage,
      goToPreviousPage,
    }),
    [
      page,
      limit,
      searchTerm,
      debouncedSearchTerm,
      goToNextPage,
      goToPreviousPage,
      setLimit,
    ],
  );
};
