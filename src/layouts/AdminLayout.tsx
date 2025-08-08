import { Outlet } from 'react-router-dom';
import TheHeader from '@/components/layout/TheHeader';
import DesktopSidebar from '@/components/layout/DesktopSidebar';
import NotificationBanner from '@/components/notifications/NotificationBanner';
import ViewComponent from '@/components/layout/TheView';
import { useVersionCheck } from '@/hooks/useVersionCheck';
import { ViewProvider } from '@/contexts/ViewContext';
import { useViewContext } from '@/hooks/ui/useView';

const AdminLayoutContent = () => {
  const { viewConfig } = useViewContext();
  useVersionCheck();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <DesktopSidebar />
      <div className="flex flex-col">
        <NotificationBanner />
        <TheHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto bg-muted/40">
          {viewConfig ? (
            <ViewComponent
              title={viewConfig.title}
              description={viewConfig.description}
              actionButton={viewConfig.actionButton}
              filters={viewConfig.filters}
              showBreadcrumbs={viewConfig.showBreadcrumbs}
            >
              <Outlet />
            </ViewComponent>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  return (
    <ViewProvider>
      <AdminLayoutContent />
    </ViewProvider>
  );
};

export default AdminLayout; 