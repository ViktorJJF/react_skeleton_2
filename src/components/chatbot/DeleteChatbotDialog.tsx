import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useChatbotStore } from '@/store/chatbotStore';
import { Trash2 } from 'lucide-react';

export const DeleteChatbotDialog: React.FC = () => {
  const { isDeleteDialogOpen, deletingChatbot, actions } = useChatbotStore();

  const handleDelete = () => {
    if (deletingChatbot) {
      actions.deleteChatbot(deletingChatbot.id);
    }
    actions.closeDeleteDialog();
  };

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={actions.closeDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Chatbot
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>"{deletingChatbot?.name}"</strong>? This
            action cannot be undone and will permanently remove the chatbot and all its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}; 