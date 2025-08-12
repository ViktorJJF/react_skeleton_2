import { createContext } from 'react';
import type { ViewContextType } from '@/types/common/view';

export const ViewContext = createContext<ViewContextType | undefined>(
  undefined,
);
