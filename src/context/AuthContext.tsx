import { useMemo, useState, type ReactNode } from 'react'
import type { AuthResponse } from '../api/authApi'
import { AuthContext, type AuthContextValue } from './context'
const AUTH_STORAGE_KEY = 'blabla-auth'

function readStoredAuth(): AuthResponse | null {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored) as AuthResponse
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuthState] = useState<AuthResponse | null>(readStoredAuth)

  const value = useMemo<AuthContextValue>(() => ({
    auth,
    setAuth: (nextAuth) => {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth))
      setAuthState(nextAuth)
    },
    logout: () => {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      setAuthState(null)
    },
  }), [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
