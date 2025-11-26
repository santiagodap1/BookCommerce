import type { Book } from '../types/book'
import type { User } from '../types/user'
import type { CartItem, CartPayload } from '../types/cart'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:3001/api'

let accessToken: string | null = null

export const setAccessToken = (token: string | null) => {
  accessToken = token
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
  auth?: boolean
}

export const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  }

  if (options.auth && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Request failed')
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export type AuthResponse = {
  accessToken: string
  user: User
}

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: payload }),
  register: (payload: { email: string; password: string; name?: string }) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: payload }),
  me: () => request<User>('/users/me', { auth: true }),
}

const mapBookToPayload = (book: Book, quantity = 1): CartPayload => ({
  bookId: book.id,
  title: book.title,
  author: book.author,
  coverUrl: book.coverUrl,
  price: book.price,
  quantity,
})

export const cartApi = {
  list: () => request<CartItem[]>('/cart', { auth: true }),
  add: (book: Book, quantity = 1) =>
    request<CartItem>('/cart', {
      method: 'POST',
      auth: true,
      body: mapBookToPayload(book, quantity),
    }),
  update: (bookId: string, quantity: number) =>
    request<CartItem>(`/cart/${bookId}`, {
      method: 'PATCH',
      auth: true,
      body: { quantity },
    }),
  remove: (bookId: string) =>
    request<void>(`/cart/${bookId}`, { method: 'DELETE', auth: true }),
  clear: () => request<void>('/cart', { method: 'DELETE', auth: true }),
}
