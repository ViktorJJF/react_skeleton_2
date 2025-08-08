import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  ArrowUpDown,
  CheckCircle,
  Edit,
  Trash2,
  XCircle
} from 'lucide-react';
import type { IBot } from '@/types/entities/bots';

interface BotTableColumnsOptions {
  onEdit?: (bot: IBot) => void;
  onDelete?: (bot: IBot) => void;
  showActions?: boolean;
  showSelection?: boolean;
}

export const getBotTableColumns = (
  options: BotTableColumnsOptions = {}
): ColumnDef<IBot>[] => {
  const { 
    onEdit, 
    onDelete, 
    showActions = true,
    showSelection = true 
  } = options;

  const columns: ColumnDef<IBot>[] = [];

  if (showSelection) {
    columns.push({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    });
  }

  columns.push({
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 font-semibold"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const bot = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {bot.name}
          </span>
          {bot.description && (
            <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
              {bot.description}
            </span>
          )}
        </div>
      );
    },
    enableSorting: true,
    minSize: 200,
  });

  columns.push({
    accessorKey: 'isActive',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 font-semibold"
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean;
      return (
        <Badge
          variant={isActive ? 'default' : 'secondary'}
          className={`flex items-center gap-1 w-fit ${
            isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
          }`}
        >
          {isActive ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <XCircle className="w-3 h-3" />
          )}
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
    enableSorting: true,
    filterFn: (row, id, value) => {
      const isActive = row.getValue(id) as boolean;
      if (value === 'all') return true;
      if (value === 'active') return isActive;
      if (value === 'inactive') return !isActive;
      return true;
    },
    size: 100,
  });

  columns.push({
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 font-semibold"
      >
        Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt') as string);
      return (
        <div className="flex flex-col">
          <span className="text-sm text-gray-900 dark:text-gray-100">
            {date.toLocaleDateString()}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      );
    },
    enableSorting: true,
    size: 120,
  });

  if (showActions) {
    columns.push({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const bot = row.original;

        return (
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              {onEdit && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(bot)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit Bot</TooltipContent>
                </Tooltip>
              )}
              {onDelete && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(bot)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Bot</TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>
        );
      },
      size: 100,
    });
  }

  return columns;
};


