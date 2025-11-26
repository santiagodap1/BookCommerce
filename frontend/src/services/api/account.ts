import { request } from '../apiClient'

export type Address = {
  id: string
  label: string
  recipientName: string
  street: string
  city: string
  state?: string
  postalCode: string
  country: string
  phone?: string
  isDefault: boolean
  createdAt: string
}

export type OrderItem = {
  id: string
  bookId: string
  title: string
  author?: string
  coverUrl?: string
  price: number
  quantity: number
  createdAt: string
}

export type Order = {
  id: string
  status: string
  totalPrice: number
  createdAt: string
  items: OrderItem[]
  shippingName: string
  shippingStreet: string
  shippingCity: string
  shippingState?: string
  shippingPostalCode: string
  shippingCountry: string
  shippingPhone?: string
}

export type AddressInput = Omit<Address, 'id' | 'createdAt'>

export const addressApi = {
  list: () => request<Address[]>('/addresses', { auth: true }),
  create: (payload: AddressInput) =>
    request<Address>('/addresses', { method: 'POST', body: payload, auth: true }),
  update: (id: string, payload: Partial<AddressInput>) =>
    request<Address>(`/addresses/${id}`, { method: 'PATCH', body: payload, auth: true }),
  remove: (id: string) => request<void>(`/addresses/${id}`, { method: 'DELETE', auth: true }),
}

export const ordersApi = {
  list: () => request<Order[]>('/orders', { auth: true }),
  detail: (id: string) => request<Order>(`/orders/${id}`, { auth: true }),
  checkout: (addressId: string) =>
    request<Order>('/orders', {
      method: 'POST',
      body: { addressId },
      auth: true,
    }),
}
