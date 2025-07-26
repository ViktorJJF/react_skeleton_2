import React from 'react';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

interface ViewComponentProps {
  children: React.ReactNode;
  title: string;
  description: string;
  actionButton?: React.ReactNode;
  filters?: React.ReactNode;
}

const ViewComponent: React.FC<ViewComponentProps> = ({ children, title, description, actionButton, filters }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {actionButton}
      </div>
      {filters}
      <div className="p-6 bg-card text-card-foreground rounded-lg shadow-sm">
        {children}
      </div>
    </div>
  );
};

export default ViewComponent; 