export interface Book {
  id: string
  title: string
  author: string
  year?: number
  coverUrl: string
  subjects: string[]
  price: number
  summary?: string
}

export interface FeaturedCollection {
  title: string
  subject: string
  books: Book[]
  description: string
}
