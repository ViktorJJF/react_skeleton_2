import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { checkForUpdates } from '@/utils/update';
import config from '@/config';
import { initGA } from '@/utils/analytics';

// Layouts
import AdminLayout from '@/layouts/AdminLayout';
import RootLayout from '@/layouts/RootLayout';

// Views
import LoginView from '@/views/LoginView';
import RegisterView from '@/views/RegisterView';
import ForgotPasswordView from '@/views/ForgotPasswordView';
import DashboardView from '@/views/DashboardView';
import NotFoundView from '@/views/NotFoundView';
import ProfileView from '@/views/ProfileView';
import FrontPagesView from '@/views/FrontPagesView';
import BotsView from '@/views/BotsView';

// Authentication guard for protected routes
const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const autoLogin = useAuthStore((state) => state.autoLogin);
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const hasToken = localStorage.getItem('auth_token') !== null;

      if (hasToken && !isAuthenticated) {
        // Try auto login if we have a token but not authenticated yet
        setIsAuthenticating(true);
        await autoLogin();
        setIsAuthenticating(false);
      }

      setAuthChecked(true);
    };

    checkAuth();
  }, [isAuthenticated, autoLogin]);

  // Show loading or spinner while we're checking auth state
  if (!authChecked || isAuthenticating) {
    return <div className="auth-loading">Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page with the return location
    return (
      <Navigate
        to="/login?reason=unauthorized"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
};

// Define routes
const AppRouter: React.FC = () => {
  // Initialize GA and check for updates when router is initialized
  useEffect(() => {
    initGA();
    if(config.APP_VERSION){
        checkForUpdates(config.APP_VERSION);
    }
  }, []);

  const router = createBrowserRouter([
    {
      element: <RootLayout />,
      children: [
        // Public Routes
        {
          path: '/login',
          element: <LoginView />,
        },
        {
          path: '/register',
          element: <RegisterView />,
        },
        {
          path: '/forgot-password',
          element: <ForgotPasswordView />,
        },

        // Protected Routes with Admin Layout
        {
          path: '/',
          element: <ProtectedRoute />,
          children: [
            {
              element: <AdminLayout />,
              children: [
                // Default route - redirect to dashboard as home
                {
                  index: true,
                  element: <Navigate to="/dashboard" replace />,
                },

                // Main application routes
                {
                  path: 'dashboard',
                  element: <DashboardView />,
                },
                {
                  path: 'bots',
                  element: <BotsView />,
                },
                {
                  path: 'bots-table',
                  element: <BotsView />,
                },
                {
                  path: 'profile',
                  element: <ProfileView />,
                },
              ],
            },
          ],
        },

        // 404 Not Found route
        {
          path: '/404',
          element: <NotFoundView />,
        },
        // Catch-all 404
        {
          path: '*',
          element: <NotFoundView />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
