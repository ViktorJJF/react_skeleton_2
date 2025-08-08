import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Trash2,
  RefreshCw,
  Settings
} from 'lucide-react';
import type { IBot } from '@/types/entities/bots';

interface BotActionsProps {
  // Search and filter
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  onStatusFilterChange: (status: 'all' | 'active' | 'inactive') => void;
  
  // Actions
  onCreateBot: () => void;
  onRefresh: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onBulkDelete?: () => void;
  
  // Selected items
  selectedBots: IBot[];
  
  // Loading states
  isLoading?: boolean;
  isRefreshing?: boolean;
  
  // Permissions
  canCreate?: boolean;
  canBulkDelete?: boolean;
  canExport?: boolean;
  canImport?: boolean;
}

/**
 * Action bar component for bot management
 */
export const BotActions: React.FC<BotActionsProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onCreateBot,
  onRefresh,
  onExport,
  onImport,
  onBulkDelete,
  selectedBots,
  isLoading = false,
  isRefreshing = false,
  canCreate = true,
  canBulkDelete = true,
  canExport = true,
  canImport = false,
}) => {
  const hasSelectedBots = selectedBots.length > 0;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-b">
      {/* Left side: Search and Filters */}
      <div className="flex-1 flex items-center gap-2 w-full md:w-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search bots..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value: 'all' | 'active' | 'inactive') => onStatusFilterChange(value)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-auto md:w-[140px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-2">
        {hasSelectedBots && canBulkDelete && onBulkDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onBulkDelete()}
            disabled={isLoading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete ({selectedBots.length})
          </Button>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onRefresh}
                disabled={isLoading || isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh</TooltipContent>
          </Tooltip>

          {canExport && onExport && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onExport} disabled={isLoading}>
                  <Download className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export</TooltipContent>
            </Tooltip>
          )}

          {canImport && onImport && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onImport} disabled={isLoading}>
                  <Upload className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Import</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" disabled={isLoading}>
                <Settings className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {canCreate && (
          <Button onClick={onCreateBot} disabled={isLoading}>
            <Plus className="w-4 h-4 mr-2" />
            Create Bot
          </Button>
        )}
      </div>
    </div>
  );
};


