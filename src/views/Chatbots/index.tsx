import React from 'react';
import { getColumns } from "./components/ChatbotsTableColumns";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import ViewComponent from '@/components/layout/TheView';
import { useChatbotStore } from './store/useChatbotStore';
import { ChatbotFormModal } from './components/ChatbotFormModal';
import { DeleteChatbotDialog } from './components/DeleteChatbotDialog';
import { ChatbotsStats } from './components/ChatbotsStats';

const ChatbotsView: React.FC = () => {
  const { chatbots, actions } = useChatbotStore();

  const columns = getColumns({
    onEdit: (chatbot) => actions.openModal(chatbot),
    onDelete: (chatbot) => actions.openDeleteDialog(chatbot),
  });

  return (
    <ViewComponent
      title="🤖 Chatbots Management"
      description="Create, manage, and monitor your AI chatbots with powerful analytics and easy controls."
      actionButton={
        <Button onClick={() => actions.openModal()} className="gap-2">
          <Plus className="w-4 h-4" />
          Create New Bot
        </Button>
      }
    >
      <ChatbotsStats />
      <DataTable columns={columns} data={chatbots} />
      <ChatbotFormModal />
      <DeleteChatbotDialog />
    </ViewComponent>
  );
};

export default ChatbotsView; 