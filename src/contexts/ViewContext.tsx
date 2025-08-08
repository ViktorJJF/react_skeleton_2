import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface ViewConfig {
  title: string;
  description: string;
  actionButton?: ReactNode;
  filters?: ReactNode;
  showBreadcrumbs?: boolean;
}

interface ViewContextType {
  viewConfig: ViewConfig | null;
  setViewConfig: (config: ViewConfig | null) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [viewConfig, setViewConfig] = useState<ViewConfig | null>(null);

  return (
    <ViewContext.Provider value={{ viewConfig, setViewConfig }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useViewContext = () => {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useViewContext must be used within a ViewProvider');
  }
  return context;
};

export const useViewConfig = (config: ViewConfig) => {
  const { setViewConfig } = useViewContext();
  
  React.useEffect(() => {
    setViewConfig(config);
    return () => setViewConfig(null);
  }, [config, setViewConfig]);
};
