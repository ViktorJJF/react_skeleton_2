import type { ReactNode } from "react";

export interface ViewConfig {
  title: string;
  description: string;
  actionButton?: ReactNode;
  filters?: ReactNode;
  showBreadcrumbs?: boolean;
}

export interface ViewContextType {
  viewConfig: ViewConfig | null;
  setViewConfig: (config: ViewConfig | null) => void;
}
