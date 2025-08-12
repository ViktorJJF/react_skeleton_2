import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import botsService from '@/services/api/bots';
import { usePagination } from '@/hooks/ui/usePagination'; // <-- Import the new hook
import type { IBot, IPaginatedResponse } from '@/types/entities/bots';

const FIELDS_TO_SEARCH = ["name", "description"];

/**
 * A comprehensive hook for managing bot data, delegating pagination
 * and search logic to the usePagination hook.
 */
export const useBots = () => {
  // 1. Centralized pagination and search logic from the dedicated hook.
  const paginationControls = usePagination({ initialLimit: 10 });
  const { page, limit, debouncedSearchTerm } = paginationControls;

  // 2. Entity-specific state (selection).
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  const queryClient = useQueryClient();
  // The queryKey now correctly includes all dependencies that trigger a refetch.
  const queryKey = ['bots', page, limit, debouncedSearchTerm];

  // 3. Data Fetching (Query) - now simpler.
  // We use the spread operator to cleanly get all query status flags.
  const { data: botsData, ...queryInfo } = useQuery<IPaginatedResponse<IBot>>({
    queryKey,
    queryFn: async () => {
      const params = {
        page,
        limit,
        fields: FIELDS_TO_SEARCH.join(','),
        filter: debouncedSearchTerm || undefined,
      };
      const response = await botsService.list(params);
      return response.data;
    },
    keepPreviousData: true,
  });

  // 4. Data Mutations - Invalidation is simpler and more robust.
  const invalidateBotsQuery = () => queryClient.invalidateQueries({ queryKey: ['bots'] });

  const saveMutation = useMutation({
    mutationFn: (bot: IBot) => 
      bot._id ? botsService.update(bot._id, bot) : botsService.create(bot),
    onSuccess: (_, variables) => {
      toast.success(`Bot ${variables._id ? 'updated' : 'created'} successfully.`);
      invalidateBotsQuery();
    },
    onError: (error) => toast.error(error.message || "Failed to save bot."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => botsService.delete(id),
    onSuccess: () => {
      toast.success("Bot deleted successfully.");
      invalidateBotsQuery();
    },
    onError: (error) => toast.error(error.message || "Failed to delete bot."),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => botsService.bulkDelete({ ids }),
    onSuccess: (data) => {
      const count = data.data.payload.deleted ?? selectedRows.length;
      toast.success(`${count} bot${count > 1 ? 's' : ''} deleted successfully.`);
      invalidateBotsQuery();
      setSelectedRows([]); // Clear selection on success
    },
    onError: (error) => toast.error(error.message || "Failed to delete selected bots."),
  });

  // 5. Effects - Logic is now more focused.
  // This effect ensures row selections are cleared when the data changes (e.g., page change).
  useEffect(() => {
    setSelectedRows([]);
  }, [botsData]);

  // 6. Handlers for this specific entity
  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? (botsData?.payload.map(bot => bot._id) || []) : []);
  };
  
  const handleRowSelect = (id: string, checked: boolean) => {
    setSelectedRows(prev => checked ? [...prev, id] : prev.filter(rowId => rowId !== id));
  };
  
  // 7. Derived State and Return Value
  const bots = botsData?.payload || [];
  const paginationInfo = {
    page: botsData?.page || 1,
    totalPages: botsData?.totalPages || 1,
    totalDocs: botsData?.totalDocs || 0,
  };

  return {
    // Data and Status
    bots,
    pagination: paginationInfo,
    ...queryInfo, // (isLoading, isError, isFetching, etc.)

    // Entity State & Handlers
    selectedRows,
    handleSelectAll,
    handleRowSelect,
    
    // Pagination State & Handlers (passed through from usePagination)
    ...paginationControls,
    
    // Mutations and their status
    saveBot: saveMutation.mutate,
    isSaving: saveMutation.isPending,
    deleteBot: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    bulkDeleteBots: bulkDeleteMutation.mutate,
    isBulkDeleting: bulkDeleteMutation.isPending,
  };
};