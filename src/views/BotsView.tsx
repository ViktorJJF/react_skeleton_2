import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { formatDate, useDebounceSearch, buildSearchQuery } from '@/utils/utils';
import type { IBot, ICreateBotRequest, IUpdateBotRequest } from '@/types/entities/bots';

interface BotFormData {
  name: string;
  isActive: boolean;
}

const BotsView = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // State for UI and form
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(false);
  const [editedItem, setEditedItem] = useState<BotFormData>({
    name: '',
    isActive: true,
  });
  const [defaultItem] = useState<BotFormData>({
    name: '',
    isActive: true,
  });
  const [editedIndex, setEditedIndex] = useState<number>(-1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingBot, setDeletingBot] = useState<IBot | null>(null);
  const initializedRef = useRef(false);

  // Hooks
  const { 
    bots, 
    pagination, 
    isLoading, 
    error, 
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
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    startItem,
    endItem,
  } = usePagination({
    pagination,
    onPageChange: useCallback((page: number) => {
      const payload = {
        page,
        filters: search || undefined,
        sort: 'updatedAt',
        order: 'desc' as const,
      };
      updateQuery(payload);
    }, [search, updateQuery]),
    onLimitChange: useCallback((limit: number) => {
      updateQuery({ limit, page: 1 });
    }, [updateQuery]),
  });

  const {
    errors,
    isValid,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
  } = useBotValidation();

  // Computed values
  const formTitle = useMemo(() => {
    return editedIndex === -1 ? t('bots.createBot') : t('bots.editBot');
  }, [editedIndex, t]);

  const loadingButton = isCreating || isUpdating;



  // Handle search with debounce using reusable utility
  const handleSearch = useCallback((searchValue: string) => {
    const payload = buildSearchQuery(
      searchValue,
      1, // Reset to first page on search
      10, // Default limit
      'updatedAt',
      'desc'
    );
    updateQuery(payload);
  }, [updateQuery]);

  useDebounceSearch(search, handleSearch, 600);

  // Initialize component (run once)
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      const payload = {
        page: 1,
        sort: 'updatedAt',
        order: 'desc' as const,
      };
      updateQuery(payload);
    }
  }, [updateQuery]);

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
    setEditedItem(prev => ({ ...prev, [field]: value }));
    
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

  const save = useCallback(async () => {
    if (!validate(editedItem)) {
      toast({
        title: t('bots.validation.invalid'),
        description: t('bots.validation.fixErrors'),
        variant: "destructive",
      });
      return;
    }

    try {
      if (editedIndex > -1) {
        // Update existing bot
        const botToUpdate = bots[editedIndex];
        const updateData: IUpdateBotRequest = {
          name: editedItem.name.trim(),
          isActive: editedItem.isActive,
        };
        
        const result = await update(botToUpdate._id, updateData);
        if (result) {
          toast({
            title: t('bots.updated'),
            description: t('bots.updateSuccess', { name: result.name }),
          });
          setDialog(false);
          setTimeout(() => {
            setEditedItem({ ...defaultItem });
            setEditedIndex(-1);
            clearErrors();
          }, 300);
        }
      } else {
        // Create new bot
        const createData: ICreateBotRequest = {
          name: editedItem.name.trim(),
          isActive: editedItem.isActive,
        };
        
        const result = await create(createData);
        if (result) {
          toast({
            title: t('bots.created'),
            description: t('bots.createSuccess', { name: result.name }),
          });
          setDialog(false);
          setTimeout(() => {
            setEditedItem({ ...defaultItem });
            setEditedIndex(-1);
            clearErrors();
          }, 300);
          // Data will be refreshed automatically by the mutation hook
        }
      }
    } catch (error) {
      console.error('Error saving bot:', error);
    }
  }, [editedItem, editedIndex, bots, validate, create, update, toast, t, defaultItem, clearErrors]);

  const editItem = useCallback((item: IBot) => {
    const index = bots.findIndex(bot => bot._id === item._id);
    setEditedIndex(index);
    setEditedItem({
      name: item.name,
      isActive: item.isActive,
    });
    setDialog(true);
  }, [bots]);

  const deleteItem = useCallback(async (item: IBot) => {
    setDeletingBot(item);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingBot) return;

    try {
      const success = await remove(deletingBot._id);
      
      if (success) {
        toast({
          title: t('bots.deleted'),
          description: t('bots.deleteSuccess', { name: deletingBot.name }),
        });
        setIsDeleteDialogOpen(false);
        setDeletingBot(null);
        // Data will be refreshed automatically by the mutation hook
      }
    } catch (error) {
      console.error('Error deleting bot:', error);
    }
  }, [deletingBot, remove, toast, t]);

  const close = useCallback(() => {
    setDialog(false);
    setTimeout(() => {
      setEditedItem({ ...defaultItem });
      setEditedIndex(-1);
      clearErrors();
    }, 300);
  }, [defaultItem, clearErrors]);

  const openCreateDialog = useCallback(() => {
    setDialog(false);
    setTimeout(() => {
      setEditedItem({ ...defaultItem });
      setEditedIndex(-1);
      clearErrors();
    }, 300);
    setDialog(true);
  }, [defaultItem, clearErrors]);



  return (
    <ViewComponent
      title={t('bots.title')}
      description={t('bots.description')}
    >
      <div className="space-y-6">
        {/* Main Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t('bots.title')}</span>
              <Button onClick={openCreateDialog} disabled={isLoading}>
                <Plus className="w-4 h-4 mr-2" />
                {t('bots.createBot')}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pagination Info - Top */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {t('common.pagination.showing', { 
                  start: startItem, 
                  end: endItem, 
                  total: totalItems 
                })}
              </div>
              {pagination && totalPages > 1 && (
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
              )}
            </div>

            {/* Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common.created')}</TableHead>
                    <TableHead>{t('common.name')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end">
                        <div className="relative w-64">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder={t('bots.searchPlaceholder')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
                          <span className="text-muted-foreground">{t('common.loading')}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <div className="flex items-center justify-center text-destructive">
                          <AlertCircle className="w-8 h-8 mr-2" />
                          <div>
                            <h3 className="text-lg font-medium">{t('common.error')}</h3>
                            <p className="text-sm text-muted-foreground">{error}</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : bots.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <div className="flex flex-col items-center">
                          <Bot className="w-12 h-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium mb-2">{t('bots.noBotsFound')}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {search ? t('bots.noBotsMatch', { query: search }) : t('bots.getStartedMessage')}
                          </p>
                          <Button onClick={openCreateDialog}>
                            <Plus className="w-4 h-4 mr-2" />
                            {t('bots.createBot')}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    bots.map((bot) => (
                      <TableRow key={bot._id}>
                        <TableCell>
                          <span className="text-sm">
                            {formatDate(bot.updatedAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${bot.isActive ? 'bg-green-500' : 'bg-gray-500'} flex items-center justify-center`}>
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium">{bot.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            bot.isActive 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }`}>
                            {bot.isActive ? t('common.active') : t('common.inactive')}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => editItem(bot)}>
                                <Settings className="w-4 h-4 mr-2" />
                                {t('common.edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => deleteItem(bot)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t('common.delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Info - Bottom */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {t('common.pagination.showing', { 
                  start: startItem, 
                  end: endItem, 
                  total: totalItems 
                })}
              </div>
              {pagination && totalPages > 1 && (
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
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit/Create Dialog */}
        <Dialog open={dialog} onOpenChange={close}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{formTitle}</DialogTitle>
              <DialogDescription>
                {editedIndex === -1 ? t('bots.createDescription') : t('bots.editDescription')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('common.name')} *</Label>
                <Input
                  id="name"
                  value={editedItem.name}
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
                  checked={editedItem.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={close}>
                {t('common.cancel')}
              </Button>
              <Button 
                onClick={save} 
                disabled={loadingButton || !isValid}
              >
                {loadingButton && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
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
      </div>
    </ViewComponent>
  );
};

export default BotsView;