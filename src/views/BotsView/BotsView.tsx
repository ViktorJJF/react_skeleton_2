import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import { LoadingSpinner } from '@/components/common/modals/LoadingSpinner';
import { useModal } from '@/hooks/ui/useModal';
import { usePagination } from '@/hooks/ui/usePagination';

// Bot components
import { 
  BotActions,
  getBotTableColumns,
  BotDeleteDialog,
  BotBulkDeleteDialog
} from '@/components/bots';

// Bot hooks
import { useBots } from '@/hooks/bots';

// View-specific components
import { BotFormModal } from './components/BotFormModal';

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
    createMutation,
    updateMutation,
    deleteMutation,
    bulkDelete,
  } = useBots({
    initialParams: {
      page: 1,
      limit: 10,
      search: searchQuery || undefined,
      isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
    },
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
    <div className="container mx-auto py-8 px-4 space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Bots Management</h1>
        <p className="text-muted-foreground mt-2">
          A list of all the bots in your account.
        </p>
      </header>

      <div className="bg-background border rounded-lg shadow-sm">
        <BotActions
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onCreateBot={createModal.open}
          onRefresh={refetch}
          onBulkDelete={handleBulkDelete}
          selectedBots={selectedBots}
          isLoading={isLoading}
          isRefreshing={isMutating || isBulkOperating}
        />
        <DataTable
          columns={columns}
          data={bots}
          onRowSelectionChange={setSelectedBots}
          isDeleting={isBulkOperating}
        />
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              {paginationControls.totalItems} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={paginationControls.goToPrevPage}
                disabled={!paginationControls.hasPrevPage}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={paginationControls.goToNextPage}
                disabled={!paginationControls.hasNextPage}
              >
                Next
              </Button>
            </div>
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
