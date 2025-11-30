import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThirdwebProvider } from "thirdweb/react"
import { NotificationProvider } from './context/NotificationContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThirdwebProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </ThirdwebProvider>
  </StrictMode>,
)
