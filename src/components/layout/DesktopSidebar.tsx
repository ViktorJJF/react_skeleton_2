// no React import needed
import TheSidebar from '@/components/layout/TheSidebar';

const DesktopSidebar = () => {
  return (
    <aside className="hidden border-r bg-muted/40 md:block">
      <TheSidebar />
    </aside>
  );
};

export default DesktopSidebar; 