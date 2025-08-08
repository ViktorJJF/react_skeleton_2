import React, { useContext } from "react";
import { ViewContext } from "@/contexts/view-context";
import type { ViewConfig } from "@/types/common/view";

export const useViewContext = () => {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error("useViewContext must be used within a ViewProvider");
  }
  return context;
};

export const useViewConfig = (config: ViewConfig) => {
  const { setViewConfig } = useViewContext();

  React.useEffect(() => {
    setViewConfig(config);

    return () => {
      setViewConfig(null);
    };
    // We intentionally run this only on mount/unmount to avoid loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
