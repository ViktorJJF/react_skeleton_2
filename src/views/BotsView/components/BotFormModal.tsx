import React from 'react';
import { BaseModal } from '@/components/common/modals/BaseModal';
import { BotForm } from '@/components/bots/BotForm';
import { Plus, Edit } from 'lucide-react';
import type { IBot, ICreateBotRequest, IUpdateBotRequest } from '@/types/entities/bots';

interface BotFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ICreateBotRequest | IUpdateBotRequest) => void;
  bot?: IBot | null;
  loading?: boolean;
}

/**
 * Modal wrapper for bot form - handles both create and edit modes
 */
export const BotFormModal: React.FC<BotFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  bot,
  loading = false,
}) => {
  const isEditing = !!bot;
  
  const handleSubmit = (data: ICreateBotRequest | IUpdateBotRequest) => {
    onSubmit(data);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Bot' : 'Create New Bot'}
      description={
        isEditing 
          ? `Update the details for "${bot?.name}"`
          : 'Create a new bot by filling in the details below'
      }
      size="lg"
      showFooter={false}
      icon={
        isEditing ? (
          <Edit className="w-5 h-5 text-blue-600" />
        ) : (
          <Plus className="w-5 h-5 text-green-600" />
        )
      }
    >
      <BotForm
        bot={bot}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        loading={loading}
        showActions={true}
      />
    </BaseModal>
  );
};