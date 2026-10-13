import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { PerformanceProfileProvider } from './hooks/usePerformanceProfile'
import { SmoothScrollProvider } from './providers/SmoothScrollProvider'
import './i18n'
import './styles/globals.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PerformanceProfileProvider>
      <SmoothScrollProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SmoothScrollProvider>
    </PerformanceProfileProvider>
  </StrictMode>,
)
