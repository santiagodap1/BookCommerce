import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User } from '../types/user'
import { authApi, setAccessToken } from '../services/apiClient'

const TOKEN_KEY = 'bookcommerce_token'

type AuthContextValue = {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (payload: { email: string; password: string }) => Promise<void>
  register: (payload: { email: string; password: string; name?: string }) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const persistToken = useCallback((value: string | null) => {
    if (value) {
      localStorage.setItem(TOKEN_KEY, value)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
    setAccessToken(value)
    setToken(value)
  }, [])

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY)
    if (savedToken) {
      persistToken(savedToken)
      authApi
        .me()
        .then(setUser)
        .catch(() => persistToken(null))
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [persistToken])

  const handleAuthSuccess = useCallback(
    (accessToken: string, authUser: User) => {
      persistToken(accessToken)
      setUser(authUser)
    },
    [persistToken],
  )

  const login = useCallback(async (payload: { email: string; password: string }) => {
    const response = await authApi.login(payload)
    handleAuthSuccess(response.accessToken, response.user)
  }, [handleAuthSuccess])

  const register = useCallback(
    async (payload: { email: string; password: string; name?: string }) => {
      const response = await authApi.register(payload)
      handleAuthSuccess(response.accessToken, response.user)
    },
    [handleAuthSuccess],
  )

  const logout = useCallback(() => {
    persistToken(null)
    setUser(null)
  }, [persistToken])

  const refreshProfile = useCallback(async () => {
    if (!token) return
    const profile = await authApi.me()
    setUser(profile)
  }, [token])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, token, isLoading, login, register, logout, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
