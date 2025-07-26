import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useChatbotStore } from '../store/useChatbotStore';
import { Plus, Edit, Bot, Brain, Sparkles, Zap } from 'lucide-react';

interface Chatbot {
    id: string;
    name: string;
    status: 'active' | 'paused' | 'draft';
    model: string;
    conversations: number;
  }
  
export const ChatbotFormModal: React.FC = () => {
  const { isModalOpen, editingChatbot, actions } = useChatbotStore();
  const [botData, setBotData] = useState<Partial<Chatbot>>({});

  useEffect(() => {
    if (editingChatbot) {
      setBotData(editingChatbot);
    } else {
      setBotData({
        name: '',
        model: '',
        status: 'draft'
      });
    }
  }, [editingChatbot]);

  const handleSave = () => {
    if (botData.id) {
      actions.updateChatbot(botData as Chatbot);
    } else {
      actions.addChatbot(botData as Omit<Chatbot, 'id' | 'conversations'>);
    }
    actions.closeModal();
  };

  const handleFieldChange = (field: keyof Chatbot, value: any) => {
    setBotData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={actions.closeModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {botData.id ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {botData.id ? 'Edit Chatbot' : 'Create New Chatbot'}
          </DialogTitle>
          <DialogDescription>
            {botData.id
              ? "Update your chatbot's configuration and settings."
              : 'Create a new AI chatbot to engage with your users.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Bot Name
            </Label>
            <Input
              id="name"
              value={botData.name || ''}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="Enter bot name..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="model" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Model
            </Label>
            <Select
              value={botData.model || ''}
              onValueChange={(value) => handleFieldChange('model', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GPT-4" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  GPT-4 (Most Advanced)
                </SelectItem>
                <SelectItem value="Claude-3" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Claude-3 (Analytical)
                </SelectItem>
                <SelectItem value="GPT-3.5" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  GPT-3.5 (Fast & Efficient)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Status
            </Label>
            <Select
              value={botData.status || 'draft'}
              onValueChange={(value) => handleFieldChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">🟢 Active</SelectItem>
                <SelectItem value="paused">🟡 Paused</SelectItem>
                <SelectItem value="draft">⚪ Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={actions.closeModal}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!botData.name || !botData.model}>
            {botData.id ? 'Update Bot' : 'Create Bot'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 