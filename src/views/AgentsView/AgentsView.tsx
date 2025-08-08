import React from 'react';
import { useViewConfig } from '@/contexts/ViewContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const AgentsView: React.FC = () => {
  // Configure view properties for the AdminLayout
  useViewConfig({
    title: "Agents",
    description: "Manage your AI agents and their configurations",
    actionButton: (
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Create Agent
      </Button>
    ),
  });

  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-muted-foreground">Agents functionality coming soon...</p>
    </div>
  );
};

export default AgentsView; 