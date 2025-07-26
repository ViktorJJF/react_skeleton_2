import React from 'react';
import { getColumns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Bot, Sparkles, Brain } from "lucide-react";

import ViewComponent from '@/components/layout/TheView';
import { useChatbotStore } from '@/store/chatbotStore';
import { ChatbotFormModal } from '@/components/chatbot/ChatbotFormModal';
import { DeleteChatbotDialog } from '@/components/chatbot/DeleteChatbotDialog';

const ChatbotsTableView: React.FC = () => {
  const { chatbots, actions } = useChatbotStore();

  const columns = getColumns({
    onEdit: (chatbot) => actions.openModal(chatbot),
    onDelete: (chatbot) => actions.openDeleteDialog(chatbot),
  });

  const totalConversations = chatbots.reduce((sum, bot) => sum + bot.conversations, 0);
  const activeBots = chatbots.filter(bot => bot.status === 'active').length;

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

      <DataTable columns={columns} data={chatbots} />

      {/* Modals */}
      <ChatbotFormModal />
      <DeleteChatbotDialog />

    </ViewComponent>
  );
};

export default ChatbotsTableView; 