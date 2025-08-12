import React from 'react';
import { Button } from '@/components/ui/button';
import type { UsePaginationReturn } from '@/hooks/ui/usePagination';

interface ServerPaginationProps {
  controls: UsePaginationReturn;
}

export const ServerPagination: React.FC<ServerPaginationProps> = ({
  controls,
}) => {
  const {
    currentPage,
    totalPages,
    totalItems,
    startItem,
    endItem,
    hasPrevPage,
    hasNextPage,
    goToPrevPage,
    goToNextPage,
  } = controls;

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        {totalItems === 0 ? (
          <span>No results</span>
        ) : (
          <span>
            Showing {startItem}-{endItem} of {totalItems}
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrevPage}
          disabled={!hasPrevPage}
        >
          Previous
        </Button>
        <div className="text-sm">
          Page {currentPage} of {Math.max(totalPages, 1)}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextPage}
          disabled={!hasNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ServerPagination;
