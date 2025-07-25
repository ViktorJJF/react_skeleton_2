import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AdminLayout from '@/app/admin/layouts/AdminLayout';
import DashboardPage from '@/app/admin/pages/DashboardPage';
import { LandingPage } from '@/app/landing/pages/landing/LandingPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes; 