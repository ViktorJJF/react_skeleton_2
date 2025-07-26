import { create } from "zustand";
import { toast } from "@/hooks/use-toast";

interface Chatbot {
  id: string;
  name: string;
  status: "active" | "paused" | "draft";
  model: string;
  conversations: number;
}

interface ChatbotState {
  chatbots: Chatbot[];
  isModalOpen: boolean;
  editingChatbot: Chatbot | null;
  isDeleteDialogOpen: boolean;
  deletingChatbot: Chatbot | null;
  actions: {
    addChatbot: (chatbot: Omit<Chatbot, "id" | "conversations">) => void;
    updateChatbot: (chatbot: Chatbot) => void;
    deleteChatbot: (chatbotId: string) => void;
    openModal: (chatbot?: Chatbot) => void;
    closeModal: () => void;
    openDeleteDialog: (chatbot: Chatbot) => void;
    closeDeleteDialog: () => void;
  };
}

const initialChatbots: Chatbot[] = [
  {
    id: "1",
    name: "Customer Support Bot",
    status: "active",
    model: "GPT-4",
    conversations: 1234,
  },
  {
    id: "2",
    name: "Sales Assistant",
    status: "active",
    model: "Claude-3",
    conversations: 856,
  },
  {
    id: "3",
    name: "FAQ Bot",
    status: "paused",
    model: "GPT-3.5",
    conversations: 2341,
  },
  {
    id: "4",
    name: "Onboarding Bot",
    status: "active",
    model: "GPT-4",
    conversations: 567,
  },
  {
    id: "5",
    name: "Feedback Collector",
    status: "draft",
    model: "GPT-3.5",
    conversations: 0,
  },
];

export const useChatbotStore = create<ChatbotState>((set, get) => ({
  chatbots: initialChatbots,
  isModalOpen: false,
  editingChatbot: null,
  isDeleteDialogOpen: false,
  deletingChatbot: null,
  actions: {
    addChatbot: (newBotData) => {
      set((state) => ({
        chatbots: [
          ...state.chatbots,
          {
            ...newBotData,
            id: (state.chatbots.length + 1).toString(),
            conversations: 0,
          },
        ],
      }));
      toast({
        title: "🎉 Chatbot created",
        description: `Chatbot "${newBotData.name}" has been successfully created.`,
      });
    },
    updateChatbot: (updatedBot) => {
      set((state) => ({
        chatbots: state.chatbots.map((bot) =>
          bot.id === updatedBot.id ? updatedBot : bot
        ),
      }));
      toast({
        title: "✅ Chatbot updated",
        description: `Chatbot "${updatedBot.name}" has been successfully updated.`,
      });
    },
    deleteChatbot: (chatbotId) => {
      const chatbotToDelete = get().chatbots.find(
        (bot) => bot.id === chatbotId
      );
      set((state) => ({
        chatbots: state.chatbots.filter((bot) => bot.id !== chatbotId),
      }));
      if (chatbotToDelete) {
        toast({
          title: "🗑️ Chatbot deleted",
          description: `Chatbot "${chatbotToDelete.name}" has been permanently deleted.`,
        });
      }
    },
    openModal: (chatbot) => {
      set({ isModalOpen: true, editingChatbot: chatbot || null });
    },
    closeModal: () => {
      set({ isModalOpen: false, editingChatbot: null });
    },
    openDeleteDialog: (chatbot) => {
      set({ isDeleteDialogOpen: true, deletingChatbot: chatbot });
    },
    closeDeleteDialog: () => {
      set({ isDeleteDialogOpen: false, deletingChatbot: null });
    },
  },
}));
