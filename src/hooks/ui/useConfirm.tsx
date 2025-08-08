import React from "react";
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

type ConfirmVariant = "default" | "destructive";

export interface ConfirmOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
}

interface InternalState extends ConfirmOptions {
  open: boolean;
}

export const useConfirm = () => {
  const resolverRef = React.useRef<((value: boolean) => void) | null>(null);
  const [state, setState] = React.useState<InternalState>({
    open: false,
    title: "Are you sure?",
    description: "This action cannot be undone.",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "default",
  });

  const confirm = React.useCallback((options?: ConfirmOptions) => {
    setState((prev) => ({ ...prev, ...options, open: true }));
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleClose = React.useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const handleCancel = React.useCallback(() => {
    resolverRef.current?.(false);
    handleClose();
  }, [handleClose]);

  const handleConfirm = React.useCallback(() => {
    resolverRef.current?.(true);
    handleClose();
  }, [handleClose]);

  const ConfirmDialog = React.useCallback(() => {
    return (
      <AlertDialog open={state.open} onOpenChange={(open) => !open && handleCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{state.title}</AlertDialogTitle>
            {state.description && (
              <AlertDialogDescription>{state.description}</AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {state.cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={state.variant === "destructive" ? "bg-red-600 text-white hover:bg-red-700" : undefined}
            >
              {state.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }, [state, handleCancel, handleConfirm]);

  return { confirm, ConfirmDialog } as const;
};

export default useConfirm;


