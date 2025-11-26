import type { KeyboardEvent } from 'react'
import type { Book } from '../../types/book'

interface BookCardProps {
  book: Book
  onAddToCart: (book: Book) => void
  onSelect?: (book: Book) => void
  variant?: 'default' | 'compact'
}

export const BookCard = ({ book, onAddToCart, onSelect, variant = 'default' }: BookCardProps) => {
  const handleSelect = () => {
    onSelect?.(book)
  }

  const handleKeyPress = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleSelect()
    }
  }

  return (
    <article
      className={`book-card ${variant === 'compact' ? 'compact' : ''}`}
      onClick={handleSelect}
      onKeyDown={handleKeyPress}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className="book-card__media">
        <img src={book.coverUrl} alt={`Cover of ${book.title}`} loading="lazy" />
      </div>

      <div className="book-card__content">
        <span className="book-card__author">{book.author}</span>
        <h3>{book.title}</h3>
        {book.year && <p className="book-card__meta">Published in {book.year}</p>}
        {book.subjects.length > 0 && (
          <ul className="book-card__tags">
            {book.subjects.map((subject) => (
              <li key={subject}>{subject}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="book-card__footer">
        <span className="book-card__price">${book.price.toFixed(2)}</span>
        <button
          onClick={(event) => {
            event.stopPropagation()
            onAddToCart(book)
          }}
        >
          Add
        </button>
      </div>
    </article>
  )
}
