'use client'

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { jwtDecode } from 'jwt-decode'


type Role =
  | 'super_admin'
  | 'manager'
  | 'building_admin'
  | 'resident'
  | 'provider'

interface JWT {
  exp: number
  id: string
  role: Role
  buildingId?: string
}

interface User {
  id: string
  role: Role
  buildingId?: string
}

interface AuthContextType {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  isLoading: boolean
  login: (accessToken: string, refreshToken: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedAccess = localStorage.getItem('accessToken')
    const storedRefresh = localStorage.getItem('refreshToken')

    if (storedAccess) setAccessToken(storedAccess)
    if (storedRefresh) setRefreshToken(storedRefresh)

    setIsLoading(false)
  }, [])

  const logout = useCallback(async () => {
    try {
      if (refreshToken) {
        await fetch('https://techgazzeta.org/iam/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        })
      }
    } catch {}

    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }, [refreshToken])

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) {
      logout()
      return
    }

    try {
      const res = await fetch('https://techgazzeta.org/iam/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      if (!res.ok) throw new Error()

      const data = await res.json()
      setAccessToken(data.accessToken)
      localStorage.setItem('accessToken', data.accessToken)
    } catch {
      logout()
    }
  }, [refreshToken, logout])

  useEffect(() => {
    if (!accessToken) {
      setUser(null)
      return
    }

    try {
      const decoded = jwtDecode<JWT>(accessToken)
      const now = Date.now() / 1000

      if (decoded.exp < now) {
        refreshAccessToken()
        return
      }

      setUser({
        id: decoded.id,
        role: decoded.role,
        buildingId: decoded.buildingId,
      })
    } catch {
      logout()
    }
  }, [accessToken, refreshAccessToken, logout])

  const login = (newAccessToken: string, newRefreshToken: string) => {
    setAccessToken(newAccessToken)
    setRefreshToken(newRefreshToken)

    localStorage.setItem('accessToken', newAccessToken)
    localStorage.setItem('refreshToken', newRefreshToken)
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
