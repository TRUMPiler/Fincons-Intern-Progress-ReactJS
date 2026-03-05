import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/ThemeProvider.tsx'
import { BrowserRouter } from 'react-router'
import { SidebarProvider } from './components/ui/sidebar.tsx'
import { PrimeReactProvider } from 'primereact/api';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SidebarProvider defaultOpen={true}>
        <PrimeReactProvider>
      <BrowserRouter>
        <App />

      </BrowserRouter>
      </PrimeReactProvider>
      </SidebarProvider>
    </ThemeProvider>
  </StrictMode>,
)
