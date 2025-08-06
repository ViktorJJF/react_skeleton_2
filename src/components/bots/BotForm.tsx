import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import type { IBot, ICreateBotRequest, IUpdateBotRequest } from '@/types/entities/bots';

interface BotFormProps {
  bot?: IBot | null;
  onSubmit: (data: ICreateBotRequest | IUpdateBotRequest) => void;
  onCancel?: () => void;
  loading?: boolean;
  disabled?: boolean;
  showActions?: boolean;
}

interface FormData {
  name: string;
  description: string;
  isActive: boolean;
}

/**
 * Reusable bot form component for create/edit operations
 */
export const BotForm: React.FC<BotFormProps> = ({
  bot,
  onSubmit,
  onCancel,
  loading = false,
  disabled = false,
  showActions = true,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Initialize form data when bot changes
  useEffect(() => {
    if (bot) {
      setFormData({
        name: bot.name || '',
        description: bot.description || '',
        isActive: bot.isActive ?? true,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        isActive: true,
      });
    }
    setErrors({});
  }, [bot]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      isActive: formData.isActive,
    };

    onSubmit(submitData);
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isEditing = !!bot;
  const isFormDisabled = disabled || loading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="bot-name" className="text-sm font-medium">
          Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="bot-name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter bot name"
          disabled={isFormDisabled}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="bot-description" className="text-sm font-medium">
          Description
        </Label>
        <textarea
          id="bot-description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter bot description (optional)"
          disabled={isFormDisabled}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.description 
              ? 'border-red-500' 
              : 'border-gray-300 dark:border-gray-600'
          } ${
            isFormDisabled 
              ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' 
              : 'bg-white dark:bg-gray-900'
          }`}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
        <p className="text-xs text-gray-500">
          {formData.description.length}/500 characters
        </p>
      </div>

      {/* Active Status */}
      <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <div className="space-y-1">
          <Label htmlFor="bot-active" className="text-sm font-medium">
            Active Status
          </Label>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {formData.isActive 
              ? 'Bot is currently active and operational' 
              : 'Bot is inactive and will not process requests'
            }
          </p>
        </div>
        <Switch
          id="bot-active"
          checked={formData.isActive}
          onCheckedChange={(checked) => handleInputChange('isActive', checked)}
          disabled={isFormDisabled}
        />
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex justify-end gap-3 pt-4 border-t">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isFormDisabled}
            className="min-w-[100px]"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEditing ? 'Update Bot' : 'Create Bot'}
          </Button>
        </div>
      )}
    </form>
  );
};