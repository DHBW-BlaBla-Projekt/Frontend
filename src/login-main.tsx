import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import { LoginMpaPage } from './pages/LoginMpaPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <LoginMpaPage />
    </AuthProvider>
  </StrictMode>,
)
