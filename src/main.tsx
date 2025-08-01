import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from '@/router'
import './index.css'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from "@/components/ui/toaster"
import ErrorBoundary from '@/components/ErrorBoundary'
import { PWAUpdateHandler } from '@/components/PWAUpdateHandler'
import { GoogleOAuthProvider } from '@react-oauth/google';
import config from './config';
import './i18n';

// Set document title
document.title = 'AI Panel - Intelligent Dashboard'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
      <ErrorBoundary>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppRouter />
      <Toaster />
          <PWAUpdateHandler />
    </ThemeProvider>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
