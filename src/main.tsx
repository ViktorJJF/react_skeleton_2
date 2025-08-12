import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AppRouter from '@/router';
import './index.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ErrorBoundary';
import { PWAUpdateHandler } from '@/components/PWAUpdateHandler';
import { GoogleOAuthProvider } from '@react-oauth/google';
import config from '@/config';
import queryClient from '@/lib/queryClient';
import '@/i18n';

// Set document title
document.title = 'AI Panel - Intelligent Dashboard';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
        <ErrorBoundary>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AppRouter />
            <Toaster />
            <PWAUpdateHandler />
          </ThemeProvider>
        </ErrorBoundary>
      </GoogleOAuthProvider>
      {/* TanStack Query DevTools - only in development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </React.StrictMode>,
);
