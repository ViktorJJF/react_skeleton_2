import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from '@/router'
import './index.css'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from "@/components/ui/toaster"

// Set document title
document.title = 'AI Panel - Intelligent Dashboard'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppRouter />
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>,
)
