import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import { ServerPagination } from '@/components/tables';
import { LoadingSpinner } from '@/components/common/modals/LoadingSpinner';
import { useViewConfig } from '@/hooks/ui/useView';
import { RefreshCw, Plus } from 'lucide-react';
import { useModal } from '@/hooks/ui/useModal';
import { usePagination } from '@/hooks/ui/usePagination';

// Bot components (scoped to this view)
import { 
  BotActions,
  getBotTableColumns,
  BotDeleteDialog,
  BotBulkDeleteDialog,
  BotFormModal,
} from './components';

// Bot hooks
import { useBots } from '@/hooks/bots';

// View-specific components are imported above

// Types
import type { IBot, ICreateBotRequest, IUpdateBotRequest } from '@/types/entities/bots';

/**
 * Main BotsView component with full CRUD functionality
 */
export const BotsView: React.FC = () => {
  // State for selected bot operations
  const [selectedBot, setSelectedBot] = useState<IBot | null>(null);
  const [selectedBots, setSelectedBots] = useState<IBot[]>([]);

  // Modal states
  const createModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();
  const bulkDeleteModal = useModal();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Main bots hook
  const {
    bots,
    pagination,
    isLoading,
    isMutating,
    isBulkOperating,
    hasError,
    error,
    refetch,
    setPage,
    setLimit,
    setSearch,
    updateParams,
    createMutation,
    updateMutation,
    deleteMutation,
    bulkDelete,
  } = useBots({
    initialParams: {
      page: 1,
      limit: 10,
    },
    enableStats: false,
  });

  // Pagination hook
  const paginationControls = usePagination({
    pagination,
    onPageChange: setPage,
    onLimitChange: setLimit,
  });

  // Table columns configuration
  const columns = useMemo(
    () => getBotTableColumns({
      onEdit: (bot) => {
        setSelectedBot(bot);
        editModal.open();
      },
      onDelete: (bot) => {
        setSelectedBot(bot);
        deleteModal.open();
      },
      showActions: true,
      showSelection: true,
    }),
    [editModal, deleteModal]
  );

  // Event handlers
  const handleCreateBot = (data: ICreateBotRequest) => {
    createMutation.mutate(data, {
      onSuccess: () => createModal.close(),
    });
  };

  const handleUpdateBot = (data: IUpdateBotRequest) => {
    if (!selectedBot) return;
    updateMutation.mutate({ id: selectedBot._id, data }, {
      onSuccess: () => editModal.close(),
    });
  };

  const handleDeleteBot = () => {
    if (!selectedBot) return;
    deleteMutation.mutate(selectedBot._id, {
      onSuccess: () => deleteModal.close(),
    });
  };

  const handleBulkDelete = () => {
    if (!selectedBots.length) return;
    const ids = selectedBots.map(bot => bot._id);
    bulkDelete({ ids }, {
      onSuccess: () => bulkDeleteModal.close(),
    });
  };

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setSearch(query);
  }, [setSearch]);

  const handleStatusChange = useCallback((status: 'all' | 'active' | 'inactive') => {
    setStatusFilter(status);
    const isActive = status === 'all' ? undefined : status === 'active';
    updateParams({ isActive, page: 1 });
  }, [updateParams]);

  // Configure view properties for the AdminLayout (memoized to avoid loops)
  const viewConfig = useMemo(() => ({
    title: "Bots Management",
    description: "A list of all the bots in your account.",
    actionButton: (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${(isMutating || isBulkOperating) ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button onClick={createModal.open}>
          <Plus className="h-4 w-4 mr-2" />
          Create Bot
        </Button>
      </div>
    ),
    filters: (
      <BotActions
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusChange}
        onCreateBot={createModal.open}
        onRefresh={refetch}
        onBulkDelete={() => bulkDeleteModal.open()}
        selectedBots={selectedBots}
        isLoading={isLoading}
        isRefreshing={isMutating || isBulkOperating}
      />
    ),
  }), [
    searchQuery,
    statusFilter,
    selectedBots,
    isLoading,
    isMutating,
    isBulkOperating,
    refetch,
    createModal,
    bulkDeleteModal,
    handleSearchChange,
    handleStatusChange,
  ]);

  useViewConfig(viewConfig);

  // Loading state
  if (isLoading && !bots.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (hasError && !bots.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Failed to load bots</h3>
          <p className="text-muted-foreground mt-2">
            {error?.message || 'An unexpected error occurred'}
          </p>
          <Button onClick={() => refetch()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-background border rounded-lg shadow-sm">
        <DataTable
          columns={columns}
          data={bots}
          onRowSelectionChange={setSelectedBots}
          showSearch={false}
          showFooter={false}
        />
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t">
            <ServerPagination controls={paginationControls} />
          </div>
        )}
      </div>

      {/* Modals */}
      <BotFormModal
        isOpen={createModal.isOpen || editModal.isOpen}
        onClose={() => {
          if (createModal.isOpen) {
            createModal.close();
          } else {
            editModal.close();
          }
          setSelectedBot(null);
        }}
        onSubmit={editModal.isOpen ? handleUpdateBot : handleCreateBot as (data: ICreateBotRequest | IUpdateBotRequest) => void}
        bot={selectedBot}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <BotDeleteDialog
        isOpen={deleteModal.isOpen}
        onClose={() => deleteModal.close()}
        onConfirm={handleDeleteBot}
        bot={selectedBot}
        loading={deleteMutation.isPending}
      />

      <BotBulkDeleteDialog
        isOpen={bulkDeleteModal.isOpen}
        onClose={() => bulkDeleteModal.close()}
        onConfirm={handleBulkDelete}
        bots={selectedBots}
        loading={isBulkOperating}
      />
    </div>
  );
};
