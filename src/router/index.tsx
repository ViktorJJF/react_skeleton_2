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
import BotsView from '@/views/bots/BotsView';
import RouteErrorBoundary from '@/components/RouteErrorBoundary';
import TestView from '@/views/TestView';

// Authentication guard for protected routes
const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const autoLogin = useAuthStore((state) => state.autoLogin);
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // With Zustand persist we can attempt autoLogin always
      setIsAuthenticating(true);
      await autoLogin();
      setIsAuthenticating(false);
      setAuthChecked(true);
    };

    checkAuth();
  }, [autoLogin]);

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

// Guard for public routes (redirect authenticated users to dashboard)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const autoLogin = useAuthStore((state) => state.autoLogin);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsAuthenticating(true);
      await autoLogin();
      setIsAuthenticating(false);
      setAuthChecked(true);
    };

    checkAuth();
  }, [autoLogin]);

  // Show loading while checking auth
  if (!authChecked || isAuthenticating) {
    return <div className="auth-loading">Checking authentication...</div>;
  }

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

// Define routes
const AppRouter: React.FC = () => {
  // Initialize GA and check for updates when router is initialized
  useEffect(() => {
    initGA();
    if (config.APP_VERSION) {
      checkForUpdates(config.APP_VERSION);
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: '/test',
      element: <TestView title="Test de tests" />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      element: <RootLayout />,
      errorElement: <RouteErrorBoundary />,
      children: [
        // Public Routes (with auth redirect guard)
        {
          path: '/login',
          element: (
            <PublicRoute>
              <LoginView />
            </PublicRoute>
          ),
          errorElement: <RouteErrorBoundary />,
        },
        {
          path: '/register',
          element: (
            <PublicRoute>
              <RegisterView />
            </PublicRoute>
          ),
          errorElement: <RouteErrorBoundary />,
        },
        {
          path: '/forgot-password',
          element: (
            <PublicRoute>
              <ForgotPasswordView />
            </PublicRoute>
          ),
          errorElement: <RouteErrorBoundary />,
        },

        // Protected Routes with Admin Layout
        {
          path: '/',
          element: <ProtectedRoute />,
          errorElement: <RouteErrorBoundary />,
          children: [
            {
              element: <AdminLayout />,
              errorElement: <RouteErrorBoundary />,
              children: [
                // Default route - redirect to dashboard as home
                {
                  index: true,
                  element: <Navigate to="/dashboard" replace />,
                  errorElement: <RouteErrorBoundary />,
                },

                // Main application routes
                {
                  path: 'dashboard',
                  element: <DashboardView />,
                  errorElement: <RouteErrorBoundary />,
                },
                {
                  path: 'bots',
                  element: <BotsView />,
                  errorElement: <RouteErrorBoundary />,
                },
                {
                  path: 'profile',
                  element: <ProfileView />,
                  errorElement: <RouteErrorBoundary />,
                },
              ],
            },
          ],
        },

        // 404 Not Found route
        {
          path: '/404',
          element: <NotFoundView />,
          errorElement: <RouteErrorBoundary />,
        },
        // Catch-all 404
        {
          path: '*',
          element: <NotFoundView />,
          errorElement: <RouteErrorBoundary />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
