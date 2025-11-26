export interface CartItem {
  id: string
  bookId: string
  title: string
  author?: string
  coverUrl?: string
  price: number
  quantity: number
  createdAt: string
  updatedAt: string
}

export interface CartPayload {
  bookId: string
  title: string
  author?: string
  coverUrl?: string
  price: number
  quantity: number
}
