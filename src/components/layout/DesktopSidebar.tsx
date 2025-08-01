import React from 'react';
import TheSidebar from './TheSidebar';

const DesktopSidebar = () => {
  return (
    <aside className="hidden border-r bg-muted/40 md:block">
      <TheSidebar />
    </aside>
  );
};

export default DesktopSidebar; 