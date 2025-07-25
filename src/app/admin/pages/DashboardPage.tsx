const DashboardPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-sidebar-background p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-text-secondary">Total Users</h2>
          <p className="text-2xl font-bold text-text-primary">1,234</p>
        </div>
        <div className="bg-sidebar-background p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-text-secondary">Active Bots</h2>
          <p className="text-2xl font-bold text-text-primary">56</p>
        </div>
        <div className="bg-sidebar-background p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-text-secondary">Revenue</h2>
          <p className="text-2xl font-bold text-text-primary">$12,345</p>
        </div>
        <div className="bg-sidebar-background p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-text-secondary">Server Status</h2>
          <p className="text-2xl font-bold text-accent-green">Online</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 