import React from 'react';
import { Bot, Sparkles, Brain } from 'lucide-react';
import { useChatbotStore } from '../store/useChatbotStore';

export const ChatbotsStats: React.FC = () => {
  const { chatbots } = useChatbotStore();

  const totalConversations = chatbots.reduce((sum, bot) => sum + bot.conversations, 0);
  const activeBots = chatbots.filter((bot) => bot.status === 'active').length;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Bots</p>
            <p className="text-2xl font-bold">{chatbots.length}</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
            <Sparkles className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Bots</p>
            <p className="text-2xl font-bold">{activeBots}</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <Brain className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Conversations</p>
            <p className="text-2xl font-bold">{totalConversations.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 