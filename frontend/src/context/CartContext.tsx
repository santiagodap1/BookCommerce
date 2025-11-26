import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Book } from '../types/book'
import type { CartItem } from '../types/cart'
import { cartApi } from '../services/apiClient'
import { useAuth } from './AuthContext'

const CartContext = createContext<CartContextValue | undefined>(undefined)

type CartContextValue = {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
  totalItems: number
  totalPrice: number
  addItem: (book: Book) => Promise<void>
  updateQuantity: (bookId: string, quantity: number) => Promise<void>
  removeItem: (bookId: string) => Promise<void>
  clearCart: () => Promise<void>
  toggleCart: (open?: boolean) => void
  loadCart: () => Promise<void>
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAuthError = (error: unknown) => {
    const message = (error as Error).message ?? ''
    if (message.toLowerCase().includes('unauthorized')) {
      throw new Error('AUTH_REQUIRED')
    }
    throw error
  }

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([])
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    try {
      const data = await cartApi.list()
      setItems(data)
    } catch (error) {
      const message = (error as Error).message?.toLowerCase() ?? ''
      if (message.includes('unauthorized')) {
        setItems([])
      } else {
        console.error(error)
      }
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    void loadCart()
  }, [loadCart])

  const addItem = useCallback(
    async (book: Book) => {
      if (!isAuthenticated) {
        throw new Error('AUTH_REQUIRED')
      }
      const item = await cartApi.add(book).catch((error) => {
        handleAuthError(error)
      })
      if (!item) return
      setItems((prev) => {
        const exists = prev.find((entry) => entry.bookId === item.bookId)
        if (exists) {
          return prev.map((entry) =>
            entry.bookId === item.bookId ? item : entry,
          )
        }
        return [item, ...prev]
      })
      setIsOpen(true)
    },
    [isAuthenticated],
  )

  const updateQuantity = useCallback(
    async (bookId: string, quantity: number) => {
      if (!isAuthenticated) {
        throw new Error('AUTH_REQUIRED')
      }
      const item = await cartApi.update(bookId, quantity).catch((error) => {
        handleAuthError(error)
      })
      if (!item) return
      setItems((prev) => prev.map((entry) => (entry.bookId === bookId ? item : entry)))
    },
    [isAuthenticated],
  )

  const removeItem = useCallback(
    async (bookId: string) => {
      if (!isAuthenticated) {
        throw new Error('AUTH_REQUIRED')
      }
      await cartApi.remove(bookId).catch((error) => {
        handleAuthError(error)
      })
      setItems((prev) => prev.filter((entry) => entry.bookId !== bookId))
    },
    [isAuthenticated],
  )

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('AUTH_REQUIRED')
    }
    await cartApi.clear().catch((error) => {
      handleAuthError(error)
    })
    setItems([])
  }, [isAuthenticated])

  const toggleCart = useCallback((open?: boolean) => {
    setIsOpen((prev) => (typeof open === 'boolean' ? open : !prev))
  }, [])

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  )

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      isLoading,
      totalItems,
      totalPrice: Number(totalPrice.toFixed(2)),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      toggleCart,
      loadCart,
    }),
    [
      items,
      isOpen,
      isLoading,
      totalItems,
      totalPrice,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      toggleCart,
      loadCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
