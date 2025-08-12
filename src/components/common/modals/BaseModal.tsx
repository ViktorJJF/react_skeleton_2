import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  loading?: boolean;
  disabled?: boolean;
  showFooter?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const sizeClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  full: 'sm:max-w-4xl',
};

/**
 * Reusable base modal component that can be used across different domains
 */
export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  confirmVariant = 'default',
  size = 'md',
  loading = false,
  disabled = false,
  showFooter = true,
  icon,
  className,
}) => {
  const { t } = useTranslation();

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className={`${sizeClasses[size]} ${className || ''}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icon}
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="py-4">{children}</div>

        {showFooter && (
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              {cancelText || t('common.cancel')}
            </Button>
            {onConfirm && (
              <Button
                onClick={handleConfirm}
                disabled={disabled || loading}
                variant={confirmVariant}
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {confirmText || t('common.confirm')}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
