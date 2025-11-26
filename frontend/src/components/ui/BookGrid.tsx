import type { Book } from '../types/book'
import { BookCard } from './BookCard'

type BookGridProps = {
  books: Book[]
  title: string
  emptyMessage?: string
  onAddToCart: (book: Book) => void
  onSelect?: (book: Book) => void
}

export const BookGrid = ({ books, title, emptyMessage, onAddToCart, onSelect }: BookGridProps) => {

  return (
    <section className="book-grid">
      <div className="section-heading">
        <h2>{title}</h2>
        <span>{books.length} results</span>
      </div>

      {books.length === 0 ? (
        <p className="empty-state">
          {emptyMessage ?? 'No books available at the moment.'}
        </p>
      ) : (
        <div className="grid">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onAddToCart={onAddToCart}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </section>
  )
}
