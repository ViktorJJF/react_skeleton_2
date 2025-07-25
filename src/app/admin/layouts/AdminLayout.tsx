import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-main-background text-text-primary">
      <aside className="w-64 bg-sidebar-background p-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        {/* Navigation links will go here */}
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 