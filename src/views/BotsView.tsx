import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bot, Settings, Trash2, Plus, Search, MoreVertical, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import ViewComponent from '@/components/layout/TheView';
import { useBotsQuery, useBotMutations } from '@/hooks/useBots';
import { usePagination } from '@/hooks/usePagination';
import { useBotValidation } from '@/hooks/useBotValidation';
import type { IBot, ICreateBotRequest, IUpdateBotRequest } from '@/types/entities/bots';

interface BotFormData {
  name: string;
  isActive: boolean;
}

const BotsView = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // State for UI
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<IBot | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingBotId, setDeletingBotId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BotFormData>({
    name: '',
    isActive: true,
  });

  // Hooks
  const { 
    bots, 
    pagination, 
    isLoading, 
    error, 
    query, 
    updateQuery, 
    clearError 
  } = useBotsQuery();
  
  const { 
    create, 
    update, 
    remove, 
    isCreating, 
    isUpdating, 
    isDeleting,
    error: mutationError,
    clearError: clearMutationError
  } = useBotMutations();

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    changeLimit,
    startItem,
    endItem,
  } = usePagination({
    pagination,
    onPageChange: (page) => updateQuery({ page }),
    onLimitChange: (limit) => updateQuery({ limit, page: 1 }),
  });

  const {
    errors,
    isValid,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
  } = useBotValidation();

  // Initialize component
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initial fetch is handled by useBotsQuery hook
      } catch (error) {
        console.error('Failed to initialize BotsView:', error);
      }
    };

    initialize();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== (query.filters || '')) {
        updateQuery({ 
          filters: searchQuery || undefined, 
          page: 1 
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, query.filters, updateQuery]);

  // Clear errors when they exist
  useEffect(() => {
    if (error) {
      toast({
        title: t('common.error'),
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, t, clearError]);

  useEffect(() => {
    if (mutationError) {
      toast({
        title: t('common.error'),
        description: mutationError,
        variant: "destructive",
      });
      clearMutationError();
    }
  }, [mutationError, toast, t, clearMutationError]);

  // Form handlers
  const handleInputChange = useCallback((field: keyof BotFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field as keyof typeof errors]) {
      clearFieldError(field as keyof typeof errors);
    }
    
    // Real-time validation
    const fieldError = validateField(field, value);
    if (!fieldError && errors[field as keyof typeof errors]) {
      clearFieldError(field as keyof typeof errors);
    }
  }, [errors, clearFieldError, validateField]);

  const handleSave = useCallback(async () => {
    if (!validate(formData)) {
      toast({
        title: t('bots.validation.invalid'),
        description: t('bots.validation.fixErrors'),
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingBot) {
        // Update existing bot
        const updateData: IUpdateBotRequest = {
          name: formData.name.trim(),
          isActive: formData.isActive,
        };
        
        const result = await update(editingBot._id, updateData);
        if (result) {
          toast({
            title: t('bots.updated'),
            description: t('bots.updateSuccess', { name: result.name }),
          });
          setIsModalOpen(false);
          setEditingBot(null);
          setFormData({
            name: '',
            isActive: true,
          });
          clearErrors();
        }
      } else {
        // Create new bot
        const createData: ICreateBotRequest = {
          name: formData.name.trim(),
          isActive: formData.isActive,
        };
        
        const result = await create(createData);
        if (result) {
          toast({
            title: t('bots.created'),
            description: t('bots.createSuccess', { name: result.name }),
          });
          setIsModalOpen(false);
          setEditingBot(null);
          setFormData({
            name: '',
            isActive: true,
          });
          clearErrors();
        }
      }
    } catch (error) {
      console.error('Error saving bot:', error);
    }
  }, [formData, editingBot, validate, create, update, toast, t, clearErrors]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingBotId) return;

    try {
      const botToDelete = bots.find(bot => bot._id === deletingBotId);
      const success = await remove(deletingBotId);
      
      if (success) {
        toast({
          title: t('bots.deleted'),
          description: t('bots.deleteSuccess', { name: botToDelete?.name }),
        });
        setIsDeleteDialogOpen(false);
        setDeletingBotId(null);
      }
    } catch (error) {
      console.error('Error deleting bot:', error);
    }
  }, [deletingBotId, bots, remove, toast, t]);

  // Modal handlers
  const openDeleteDialog = useCallback((id: string) => {
    setDeletingBotId(id);
    setIsDeleteDialogOpen(true);
  }, []);

  const openEditModal = useCallback((bot: IBot) => {
    setEditingBot(bot);
    setFormData({
      name: bot.name,
      isActive: bot.isActive,
    });
    clearErrors();
    setIsModalOpen(true);
  }, [clearErrors]);
  
  const openCreateModal = useCallback(() => {
    setEditingBot(null);
    setFormData({
      name: '',
      isActive: true,
    });
    clearErrors();
    setIsModalOpen(true);
  }, [clearErrors]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingBot(null);
    setFormData({
      name: '',
      isActive: true,
    });
    clearErrors();
  }, [clearErrors]);

  // Filter bots based on search query (client-side filtering for immediate feedback)
  const filteredBots = bots.filter(bot =>
    bot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ViewComponent
      title={t('bots.title')}
      description={t('bots.description')}
      actionButton={
        <Button onClick={openCreateModal} disabled={isLoading}>
          <Plus className="w-4 h-4 mr-2" />
          {t('bots.createBot')}
        </Button>
      }
      filters={
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t('bots.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => changeLimit(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    >
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">{t('common.loading')}</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card className="border-destructive">
          <CardContent className="flex items-center justify-center py-12">
            <AlertCircle className="w-8 h-8 text-destructive mr-2" />
            <div>
              <h3 className="text-lg font-medium text-destructive">{t('common.error')}</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bots Grid */}
      {!isLoading && !error && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBots.map((bot) => (
              <Card key={bot._id} className="group hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${bot.isActive ? 'bg-green-500' : 'bg-gray-500'} flex items-center justify-center`}>
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{bot.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {bot.isActive ? t('common.active') : t('common.inactive')}
                        </CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditModal(bot)}>
                          <Settings className="w-4 h-4 mr-2" />
                          {t('common.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => openDeleteDialog(bot._id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t('common.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{t('common.created')}</span>
                    <span className="font-medium">
                      {new Date(bot.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredBots.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bot className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('bots.noBotsFound')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery ? t('bots.noBotsMatch', { query: searchQuery }) : t('bots.getStartedMessage')}
                </p>
                <Button onClick={openCreateModal}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('bots.createBot')}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {pagination && totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                {t('common.pagination.showing', { 
                  start: startItem, 
                  end: endItem, 
                  total: totalItems 
                })}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={!hasPrevPage}
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t('common.pagination.previous')}
                </Button>
                <span className="text-sm">
                  {t('common.pagination.pageOf', { 
                    current: currentPage, 
                    total: totalPages 
                  })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={!hasNextPage}
                >
                  {t('common.pagination.next')}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBot ? t('bots.editBot') : t('bots.createBot')}
            </DialogTitle>
            <DialogDescription>
              {editingBot ? t('bots.editDescription') : t('bots.createDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t('common.name')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={t('bots.namePlaceholder')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">{t('common.active')}</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isCreating || isUpdating || !isValid}
            >
              {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('bots.deleteConfirmation')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('bots.deleteWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ViewComponent>
  );
};

export default BotsView;