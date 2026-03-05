import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { twMerge } from 'tailwind-merge';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
  const value = {
        appendTo: 'self',
         unstyled: false,  pt: {}, ptOptions: { mergeSections: true, mergeProps: true, classNameMergeFunction: twMerge }
    };
createRoot(document.getElementById('root')!).render(
  
  <StrictMode>
    <PrimeReactProvider value={value}>
    <App />
    </PrimeReactProvider>
  </StrictMode>,
)
