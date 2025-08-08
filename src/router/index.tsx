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
import { BotsView } from '@/views/BotsView/BotsView';

// Authentication guard for protected routes
const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const autoLogin = useAuthStore((state) => state.autoLogin);
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('ProtectedRoute: Starting auth check');
      // With Zustand persist we can attempt autoLogin always
      setIsAuthenticating(true);
      await autoLogin();
      setIsAuthenticating(false);
      setAuthChecked(true);
    };

    checkAuth();
  }, [autoLogin]);

  // Log auth state changes
  useEffect(() => {
    console.log('ProtectedRoute: Auth state changed, isAuthenticated:', isAuthenticated);
  }, [isAuthenticated]);

  // Show loading or spinner while we're checking auth state
  if (!authChecked || isAuthenticating) {
    console.log('ProtectedRoute: Showing loading state');
    return <div className="auth-loading">Checking authentication...</div>;
  }

  console.log('ProtectedRoute: Final auth state:', isAuthenticated);
  
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    // Redirect to login page with the return location
    return (
      <Navigate
        to="/login?reason=unauthorized"
        state={{ from: location }}
        replace
      />
    );
  }

  console.log('ProtectedRoute: Authenticated, showing outlet');
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
