import { Outlet } from 'react-router-dom';
import TheHeader from '@/components/layout/TheHeader';
import TheSidebar from '@/components/layout/TheSidebar';

const AdminLayout = () => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <TheSidebar />
      <div className="flex flex-col min-h-screen">
        <TheHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto bg-muted/40">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 