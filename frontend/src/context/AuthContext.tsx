import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'

export interface AppUser {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  grad_class: string
}

interface AuthContextType {
  user: AppUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  // On mount, restore session from stored token
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setLoading(false)
      return
    }
    apiFetch<AppUser>('/api/auth/me')
      .then((u) => setUser(u))
      .catch(() => localStorage.removeItem('access_token'))
      .finally(() => setLoading(false))
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const data = await apiFetch<{ access_token: string; token_type: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      localStorage.setItem('access_token', data.access_token)
      const me = await apiFetch<AppUser>('/api/auth/me')
      setUser(me)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const data = await apiFetch<{ access_token: string; token_type: string }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: name || email.split('@')[0], email, password }),
      })
      localStorage.setItem('access_token', data.access_token)
      const me = await apiFetch<AppUser>('/api/auth/me')
      setUser(me)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    localStorage.removeItem('access_token')
    setUser(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
