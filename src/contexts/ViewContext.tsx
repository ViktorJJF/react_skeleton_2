import React, { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ViewConfig } from '@/types/common/view';
import { ViewContext } from './view-context';

export const ViewProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [viewConfig, setViewConfig] = useState<ViewConfig | null>(null);

  const contextValue = useMemo(
    () => ({ viewConfig, setViewConfig }),
    [viewConfig],
  );

  return (
    <ViewContext.Provider value={contextValue}>{children}</ViewContext.Provider>
  );
};
