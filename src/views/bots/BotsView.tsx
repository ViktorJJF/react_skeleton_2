import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { PlusCircle, Loader2, Pencil, Trash2 } from 'lucide-react';

// Custom Hooks
import { useBots } from '@/hooks/entities/useBots';
import { useViewConfig } from '@/hooks/ui/useView';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Types
import type { IBot } from '@/types/entities/bots';

import Bots from '@/models/Bots';

const BotsView = () => {
  // initilal config for view
  useViewConfig({
    title: 'Gestión de Bots',
    description: 'Crea, edita y gestiona tus bots.',
  });

  const {
    bots,
    pagination,
    isLoading,
    isError,
    isFetching,
    searchTerm,
    selectedRows,
    setSearchTerm,
    setPage,
    handleSelectAll,
    handleRowSelect,
    saveBot,
    isSaving,
    deleteBot,
    isDeleting,
    bulkDeleteBots,
    isBulkDeleting,
  } = useBots();

  // --- UI-specific State (for the dialog/form) ---
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editedItem, setEditedItem] = useState<IBot>(Bots());

  // --- UI Handlers ---
  const closeDialog = () => {
    setDialogOpen(false);
    // Use a timeout to prevent flicker while the dialog closes
    setTimeout(() => setEditedItem(Bots()), 300);
  };

  const handleCreateClick = () => {
    setEditedItem(Bots());
    setDialogOpen(true);
  };

  const handleEditClick = (item: IBot) => {
    setEditedItem({ ...item });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!editedItem.name || editedItem.name.length < 3) {
      toast.error('El nombre es requerido (mínimo 3 caracteres).');
      return;
    }
    // The mutate function from TanStack Query can accept callbacks
    saveBot(editedItem, {
      onSuccess: () => closeDialog(),
    });
  };

  const handleBulkDelete = () => {
    if (selectedRows.length > 0) {
      bulkDeleteBots(selectedRows);
    }
  };

  // --- Derived State ---
  const formTitle = editedItem._id ? 'Editar Bot' : 'Crear Bot';
  const isMutating = isSaving || isDeleting || isBulkDeleting;

  // ===================================================================================
  //  UI DEFINITION
  // ===================================================================================

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        Error al cargar los datos. Por favor, inténtelo de nuevo.
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Toaster richColors position="top-right" />
      <Card>
        <CardHeader>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle>Gestión de Bots</CardTitle>
              <CardDescription>
                Crea, edita y gestiona tus bots.
              </CardDescription>
            </div>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <Input
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-[250px]"
              />
              {selectedRows.length > 0 ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isBulkDeleting}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar ({selectedRows.length})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        ¿Está absolutamente seguro?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esto eliminará permanentemente {selectedRows.length}{' '}
                        bot(s) seleccionados. Esta acción no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleBulkDelete}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        {isBulkDeleting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button onClick={handleCreateClick} disabled={isLoading}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Crear Bot
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        bots.length > 0 && selectedRows.length === bots.length
                      }
                      onCheckedChange={(checked) => handleSelectAll(!!checked)}
                      aria-label="Select all rows"
                    />
                  </TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Descripción
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">Estado</TableHead>
                  <TableHead className="w-[120px] text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Cargando datos...
                    </TableCell>
                  </TableRow>
                ) : bots.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No se encontraron bots.
                    </TableCell>
                  </TableRow>
                ) : (
                  bots.map((bot) => (
                    <TableRow
                      key={bot._id}
                      data-state={selectedRows.includes(bot._id) && 'selected'}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(bot._id)}
                          onCheckedChange={(checked) =>
                            handleRowSelect(bot._id, !!checked)
                          }
                          aria-label={`Select row for ${bot.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{bot.name}</TableCell>
                      <TableCell className="hidden max-w-xs truncate md:table-cell text-muted-foreground">
                        {bot.description || '—'}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            bot.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }`}
                        >
                          {bot.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditClick(bot)}
                                disabled={isMutating}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Editar</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Editar Bot</p>
                            </TooltipContent>
                          </Tooltip>
                          <AlertDialog>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                    disabled={isMutating}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Eliminar</span>
                                  </Button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Eliminar Bot</p>
                              </TooltipContent>
                            </Tooltip>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  ¿Está absolutamente seguro?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción eliminará permanentemente el bot "
                                  {bot.name}". Esto no se puede deshacer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteBot(bot._id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  {isDeleting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : null}
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {selectedRows.length > 0
                ? `${selectedRows.length} de ${pagination.totalDocs} fila(s) seleccionada(s).`
                : `Total ${pagination.totalDocs} bots.`}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={pagination.page <= 1}
              >
                Anterior
              </Button>
              <span className="text-sm font-medium">
                Página {pagination.page} de {pagination.totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={
                  pagination.page >= pagination.totalPages || isFetching
                }
              >
                Siguiente
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="sm:max-w-[425px]"
          onInteractOutside={closeDialog}
        >
          <DialogHeader>
            <DialogTitle>{formTitle}</DialogTitle>
            <DialogDescription>
              Complete los detalles del bot a continuación. Haga clic en guardar
              cuando haya terminado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                value={editedItem.name}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descripción
              </Label>
              <Textarea
                id="description"
                value={editedItem.description ?? ''}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, description: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Estado Activo</Label>
                <p className="text-xs text-muted-foreground">
                  Determina si el bot está actualmente operativo.
                </p>
              </div>
              <Switch
                id="isActive"
                checked={editedItem.isActive}
                onCheckedChange={(checked) =>
                  setEditedItem({ ...editedItem, isActive: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default BotsView;
