import { createContext, useContext, useState, ReactNode } from 'react'
import { MockUser, MOCK_USERS } from '@features/auth/data/mock-users'

export interface AuthState {
  user: MockUser | null
  login: (userId: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

const STORAGE_KEY = 'hris_auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null
      const parsed = JSON.parse(stored) as MockUser
      return MOCK_USERS.find(u => u.id === parsed.id) ?? null
    } catch {
      return null
    }
  })

  const login = (userId: string) => {
    const found = MOCK_USERS.find(u => u.id === userId)
    if (!found) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found))
    setUser(found)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
