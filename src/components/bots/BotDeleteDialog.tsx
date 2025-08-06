import React from 'react';
import { BaseModal } from '@/components/common/modals/BaseModal';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Bot, CheckCircle, XCircle } from 'lucide-react';
import type { IBot } from '@/types/entities/bots';

interface BotDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bot: IBot | null;
  loading?: boolean;
}

/**
 * Confirmation dialog for deleting a bot
 */
export const BotDeleteDialog: React.FC<BotDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  bot,
  loading = false,
}) => {
  if (!bot) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Delete Bot"
      confirmText="Delete Bot"
      cancelText="Cancel"
      confirmVariant="destructive"
      loading={loading}
      size="md"
      icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
    >
      <div className="space-y-4">
        {/* Warning Message */}
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                This action cannot be undone
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Once deleted, this bot and all its associated data will be permanently removed 
                from the system. This action is irreversible.
              </p>
            </div>
          </div>
        </div>

        {/* Bot Details */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {bot.name}
                </h3>
                <Badge
                  variant={bot.isActive ? 'default' : 'secondary'}
                  className={`flex items-center gap-1 ${
                    bot.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {bot.isActive ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {bot.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              {bot.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {bot.description}
                </p>
              )}
              
              <div className="text-xs text-gray-500 dark:text-gray-500">
                <div>ID: {bot._id}</div>
                <div>Created: {new Date(bot.createdAt).toLocaleDateString()}</div>
                <div>Updated: {new Date(bot.updatedAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Text */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>
            Please confirm that you want to delete the bot <strong>"{bot.name}"</strong>.
          </p>
          <p className="mt-2">
            Type the bot name to confirm deletion, or click "Delete Bot" to proceed.
          </p>
        </div>

        {/* Impact Notice */}
        {bot.isActive && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Active Bot Warning
              </span>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              This bot is currently active and may be processing requests. 
              Deleting it may disrupt ongoing operations.
            </p>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

/**
 * Bulk delete confirmation dialog
 */
interface BotBulkDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bots: IBot[];
  loading?: boolean;
}

export const BotBulkDeleteDialog: React.FC<BotBulkDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  bots,
  loading = false,
}) => {
  const activeBots = bots.filter(bot => bot.isActive);
  const inactiveBots = bots.filter(bot => !bot.isActive);

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={`Delete ${bots.length} Bots`}
      confirmText={`Delete ${bots.length} Bots`}
      cancelText="Cancel"
      confirmVariant="destructive"
      loading={loading}
      size="md"
      icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
    >
      <div className="space-y-4">
        {/* Warning Message */}
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                Bulk deletion cannot be undone
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                You are about to permanently delete {bots.length} bots. 
                This action is irreversible and will remove all associated data.
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
            Deletion Summary
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white dark:bg-gray-700 rounded border">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {bots.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Bots
              </div>
            </div>
            <div className="space-y-2">
              {activeBots.length > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600 dark:text-green-400">Active:</span>
                  <span className="font-medium">{activeBots.length}</span>
                </div>
              )}
              {inactiveBots.length > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Inactive:</span>
                  <span className="font-medium">{inactiveBots.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Bot Warning */}
        {activeBots.length > 0 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Active Bots Warning
              </span>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              {activeBots.length} of the selected bots are currently active. 
              Deleting them may disrupt ongoing operations.
            </p>
          </div>
        )}

        {/* Bot List Preview */}
        <div className="max-h-32 overflow-y-auto border rounded-lg">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Bots to be deleted:
            </div>
            <div className="space-y-1">
              {bots.slice(0, 5).map(bot => (
                <div key={bot._id} className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    bot.isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  <span className="truncate">{bot.name}</span>
                </div>
              ))}
              {bots.length > 5 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  ... and {bots.length - 5} more
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};