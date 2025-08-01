import { Outlet } from 'react-router-dom';
import TheHeader from '@/components/layout/TheHeader';
import DesktopSidebar from '@/components/layout/DesktopSidebar';
import NotificationBanner from '@/components/notifications/NotificationBanner';
import { useVersionCheck } from '@/hooks/useVersionCheck';

const AdminLayout = () => {
  useVersionCheck();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <DesktopSidebar />
      <div className="flex flex-col">
        <NotificationBanner />
        <TheHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto bg-muted/40">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 