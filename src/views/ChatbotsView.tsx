import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bot, Play, Pause, Settings, Trash2, Copy, Plus, Search, MoreVertical } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import ViewComponent from '@/components/layout/TheView';

interface Chatbot {
  id: number;
  name: string;
  description: string;
  status: string;
  conversations: number;
  lastActive: string;
  model: string;
  color: string;
}

const ChatbotsView = () => {
  const [chatbots, setChatbots] = useState<Chatbot[]>([
    {
      id: 1,
      name: "Customer Support Bot",
      description: "Handles customer inquiries and support tickets",
      status: "active",
      conversations: 1234,
      lastActive: "2 hours ago",
      model: "GPT-4",
      color: "bg-blue-500"
    },
    {
      id: 2,
      name: "Sales Assistant",
      description: "Qualifies leads and books demos",
      status: "active",
      conversations: 856,
      lastActive: "5 minutes ago",
      model: "Claude-3",
      color: "bg-green-500"
    },
    {
      id: 3,
      name: "FAQ Bot",
      description: "Answers frequently asked questions",
      status: "paused",
      conversations: 2341,
      lastActive: "1 day ago",
      model: "GPT-3.5",
      color: "bg-purple-500"
    },
    {
      id: 4,
      name: "Onboarding Bot",
      description: "Guides new users through setup",
      status: "active",
      conversations: 567,
      lastActive: "30 minutes ago",
      model: "GPT-4",
      color: "bg-orange-500"
    },
    {
      id: 5,
      name: "Feedback Collector",
      description: "Gathers user feedback and reviews",
      status: "draft",
      conversations: 0,
      lastActive: "Never",
      model: "GPT-3.5",
      color: "bg-gray-500"
    }
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChatbot, setEditingChatbot] = useState<Chatbot | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingChatbot, setDeletingChatbot] = useState<Chatbot | null>(null);
  const { toast } = useToast();

  const handleSave = () => {
    if (editingChatbot?.id) {
      setChatbots(chatbots.map(bot => bot.id === editingChatbot.id ? editingChatbot : bot));
      toast({
        title: "Chatbot updated",
        description: `Chatbot "${editingChatbot.name}" has been updated.`,
      });
    } else {
      setChatbots([...chatbots, { ...editingChatbot!, id: chatbots.length + 1, color: "bg-gray-500" }]);
      toast({
        title: "Chatbot created",
        description: `Chatbot "${editingChatbot?.name}" has been created.`,
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deletingChatbot) {
      setChatbots(chatbots.filter(bot => bot.id !== deletingChatbot.id));
      toast({
        title: "Chatbot deleted",
        description: `Chatbot "${deletingChatbot.name}" has been deleted.`,
      });
    }
    setIsDeleteDialogOpen(false);
  };

  const filteredChatbots = chatbots.filter(bot => {
    const matchesSearch = bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bot.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || bot.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      case "draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ViewComponent
      title="Chatbots"
      description="Manage your AI chatbots and their configurations"
      actionButton={
        <Button onClick={() => { setEditingChatbot(null); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Create Chatbot
        </Button>
      }
      filters={
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search chatbots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {filterStatus === "all" ? "All Status" : filterStatus}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("active")}>Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("paused")}>Paused</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("draft")}>Draft</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
    >
      {/* Chatbots Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredChatbots.map((bot) => (
          <Card key={bot.id} className="group hover:shadow-lg transition-shadow duration-300">
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
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        setDeletingChatbot(bot);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(bot.status)}>
                    {bot.status}
                  </Badge>
                  <Switch checked={bot.status === "active"} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Model</span>
                    <span className="font-medium">{bot.model}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Conversations</span>
                    <span className="font-medium">{bot.conversations.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Active</span>
                    <span className="font-medium">{bot.lastActive}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" className="flex-1">
                    {bot.status === "active" ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                    {bot.status === "active" ? "Pause" : "Start"}
                  </Button>
                  <Button size="sm" variant="secondary" className="flex-1" onClick={() => { setEditingChatbot(bot); setIsModalOpen(true); }}>
                    <Settings className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
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
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Chatbot
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingChatbot ? "Edit Chatbot" : "Create Chatbot"}</DialogTitle>
            <DialogDescription>
              {editingChatbot ? "Edit the details of your chatbot." : "Create a new chatbot to engage with your users."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input id="name" value={editingChatbot?.name || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Description
              </label>
              <Input id="description" value={editingChatbot?.description || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="model" className="text-right">
                Model
              </label>
              <Input id="model" value={editingChatbot?.model || ""} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your chatbot and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ViewComponent>
  );
};

export default ChatbotsView;
