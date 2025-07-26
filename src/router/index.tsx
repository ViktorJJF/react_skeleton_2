import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
import { useAuthStore } from '@/store/modules/authModule';
import { checkForUpdates } from '@/utils/update';
import config from '@/config';

// Layouts
import AdminLayout from '@/layouts/AdminLayout';

// Views
import LoginView from '@/views/LoginView';
import RegisterView from '@/views/RegisterView';
import ForgotPasswordView from '@/views/ForgotPasswordView';
import DocsView from '@/views/DocsView';
import PricingView from '@/views/PricingView';
import DashboardView from '@/views/DashboardView';
import AnalyticsView from '@/views/AnalyticsView';
import ErrorView from '@/views/ErrorView';
import AssistantsView from '@/views/AssistantsView';
import ProfileView from '@/views/ProfileView';
import UIElementsView from '@/views/elements/UIElementsView';
import TablesView from '@/views/elements/TablesView';
import UsersView from '@/views/UsersView';
import BillingView from '@/views/BillingView';
import ApiKeysView from '@/views/ApiKeysView';
import SettingsView from '@/views/SettingsView';
import LiveChatView from '@/views/LiveChatView/LiveChatView';
// Import new views
import IntegrationsView from '@/views/IntegrationsView/IntegrationsView';
import AgentsView from '@/views/AgentsView/AgentsView';
import NotificationSettingsView from '@/views/NotificationSettingsView/NotificationSettingsView';
import LeadsView from '@/views/LeadsView';
import ECommerceView from '@/views/ECommerceView';
import FrontPagesView from '@/views/FrontPagesView';
import CalendarView from '@/views/CalendarView';
import KanbanView from '@/views/KanbanView';
import ChatsView from '@/views/ChatsView';
import EmailView from '@/views/EmailView';
import NotesView from '@/views/NotesView';
import ContactsView from '@/views/ContactsView';
import InvoiceView from '@/views/InvoiceView';
import ConversationsView from '@/views/ConversationsView';
import ChatbotsView from '@/views/ChatbotsView';
import BotAnalyticsView from '@/views/BotAnalyticsView';
import BotTrainingView from '@/views/BotTrainingView';
import ChatbotsTableView from '@/views/ChatbotsTableView';

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
  // Check for updates when router is initialized
  React.useEffect(() => {
    if(config.APP_VERSION){
        checkForUpdates(config.APP_VERSION);
    }
  }, []);

  const router = createBrowserRouter([
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
              path: 'dashboard/analytics',
              element: <AnalyticsView />,
            },
            {
              path: 'assistants',
              element: <AssistantsView />,
            },
            {
              path: 'agents',
              element: <AgentsView />,
            },
            {
              path: 'chatbots',
              element: <ChatbotsView />,
            },
            {
              path: 'conversations',
              element: <ConversationsView />,
            },
            {
              path: 'bot-analytics',
              element: <BotAnalyticsView />,
            },
            {
              path: 'bot-training',
              element: <BotTrainingView />,
            },
            {
              path: 'chatbots-table',
              element: <ChatbotsTableView />,
            },
            {
              path: 'docs',
              element: <DocsView />,
            },
            {
              path: 'pricing',
              element: <PricingView />,
            },
            {
              path: 'profile',
              element: <ProfileView />,
            },
            {
              path: 'settings',
              element: <SettingsView />,
            },
            {
              path: 'settings/notifications',
              element: <NotificationSettingsView />,
            },
            {
              path: 'users',
              element: <UsersView />,
            },
            {
              path: 'billing',
              element: <BillingView />,
            },
            {
              path: 'api-keys',
              element: <ApiKeysView />,
            },
            {
              path: 'integrations',
              element: <IntegrationsView />,
            },
            {
              path: 'live-chat',
              element: <LiveChatView />,
            },
            {
              path: 'leads',
              element: <LeadsView />,
            },
            { path: 'ecommerce', element: <ECommerceView /> },
            { path: 'front-pages', element: <FrontPagesView /> },
            { path: 'calendar', element: <CalendarView /> },
            { path: 'kanban', element: <KanbanView /> },
            { path: 'chats', element: <ChatsView /> },
            { path: 'email', element: <EmailView /> },
            { path: 'notes', element: <NotesView /> },
            { path: 'contacts', element: <ContactsView /> },
            { path: 'invoice', element: <InvoiceView /> },

            // UI Elements routes
            {
              path: 'elements/ui',
              element: <UIElementsView />,
            },
            {
              path: 'elements/tables',
              element: <TablesView />,
            },
            {
              path: 'elements/icons',
              element: <UIElementsView />,
            },
          ],
        },
      ],
    },

    // Catch-all 404
    {
      path: '*',
      element: <ErrorView />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
