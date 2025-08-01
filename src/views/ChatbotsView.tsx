import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bot, Settings, Trash2, Plus, Search, MoreVertical } from 'lucide-react';
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

interface Chatbot {
  id: number;
  name: string;
  description: string;
  model: string;
  color: string;
}

const modelOptions = ["GPT-4", "GPT-3.5", "Claude-3", "Gemini-Pro"];

const ChatbotsView = () => {
  const [chatbots, setChatbots] = useState<Chatbot[]>([
    {
      id: 1,
      name: "Customer Support Bot",
      description: "Handles customer inquiries and support tickets",
      model: "GPT-4",
      color: "bg-blue-500"
    },
    {
      id: 2,
      name: "Sales Assistant",
      description: "Qualifies leads and books demos",
      model: "Claude-3",
      color: "bg-green-500"
    },
    {
      id: 3,
      name: "FAQ Bot",
      description: "Answers frequently asked questions",
      model: "GPT-3.5",
      color: "bg-purple-500"
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChatbot, setEditingChatbot] = useState<Chatbot | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingChatbotId, setDeletingChatbotId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSave = () => {
    if (!editingChatbot?.name || !editingChatbot?.description || !editingChatbot?.model) {
        toast({
            title: "Missing Information",
            description: "Please fill out all fields.",
            variant: "destructive",
        });
        return;
    }

    if (editingChatbot.id) {
      setChatbots(chatbots.map(bot => bot.id === editingChatbot.id ? editingChatbot : bot));
      toast({
        title: "Chatbot Updated",
        description: `"${editingChatbot.name}" has been successfully updated.`,
      });
    } else {
      const newChatbot = {
        ...editingChatbot,
        id: chatbots.length > 0 ? Math.max(...chatbots.map(b => b.id)) + 1 : 1,
        color: `bg-gray-500`, // Assign a default color
      };
      setChatbots([...chatbots, newChatbot]);
      toast({
        title: "Chatbot Created",
        description: `"${editingChatbot.name}" has been successfully created.`,
      });
    }
    setIsModalOpen(false);
    setEditingChatbot(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingChatbotId) {
      const chatbotToDelete = chatbots.find(bot => bot.id === deletingChatbotId);
      setChatbots(chatbots.filter(bot => bot.id !== deletingChatbotId));
      toast({
        title: "Chatbot Deleted",
        description: `"${chatbotToDelete?.name}" has been deleted.`,
      });
      setIsDeleteDialogOpen(false);
      setDeletingChatbotId(null);
    }
  };

  const openDeleteDialog = (id: number) => {
    setDeletingChatbotId(id);
    setIsDeleteDialogOpen(true);
  };

  const openEditModal = (bot: Chatbot) => {
    setEditingChatbot(bot);
    setIsModalOpen(true);
  };
  
  const openCreateModal = () => {
    setEditingChatbot({ id: 0, name: '', description: '', model: modelOptions[0], color: '' });
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingChatbot) {
      setEditingChatbot({ ...editingChatbot, [e.target.id]: e.target.value });
    }
  };

  const handleModelChange = (value: string) => {
    if (editingChatbot) {
      setEditingChatbot({ ...editingChatbot, model: value });
    }
  };

  const filteredChatbots = chatbots.filter(bot =>
    bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bot.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ViewComponent
      title="Chatbots"
      description="Manage your AI chatbots and their configurations"
      actionButton={
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Create Chatbot
        </Button>
      }
      filters={
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search chatbots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      }
    >
      {/* Chatbots Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredChatbots.map((bot) => (
          <Card key={bot.id} className="group hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg ${bot.color} flex items-center justify-center`}>
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{bot.name}</CardTitle>
                    <CardDescription className="text-sm">{bot.description}</CardDescription>
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
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => openDeleteDialog(bot.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Model</span>
                  <span className="font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">{bot.model}</span>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredChatbots.length === 0 && (
        <Card className="col-span-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bot className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No chatbots found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery ? `No chatbots match "${searchQuery}"` : "Get started by creating your first chatbot"}
            </p>
            <Button onClick={openCreateModal}>
              <Plus className="w-4 h-4 mr-2" />
              Create Chatbot
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingChatbot?.id ? "Edit Chatbot" : "Create Chatbot"}</DialogTitle>
            <DialogDescription>
              {editingChatbot?.id ? "Edit the details of your chatbot." : "Create a new chatbot to engage with your users."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input id="name" value={editingChatbot?.name || ""} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Description
              </label>
              <Input id="description" value={editingChatbot?.description || ""} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="model" className="text-right">
                Model
              </label>
              <Select value={editingChatbot?.model} onValueChange={handleModelChange}>
                  <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                      {modelOptions.map(model => (
                          <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the chatbot.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ViewComponent>
  );
};

export default ChatbotsView;
