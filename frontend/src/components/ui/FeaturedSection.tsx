import type { Book, FeaturedCollection } from '../types/book'
import { BookCard } from './BookCard'

type FeaturedSectionProps = {
  collections: FeaturedCollection[]
  onAddToCart: (book: Book) => void
  onSelect?: (book: Book) => void
}

export const FeaturedSection = ({ collections, onAddToCart, onSelect }: FeaturedSectionProps) => {
  return (
    <section className="featured" id="collections">
      {collections.map((collection) => (
        <div className="featured-collection" key={collection.subject}>
          <div className="section-heading">
            <div>
              <h3>{collection.title}</h3>
              <p>{collection.description}</p>
            </div>
            <span>{collection.books.length} titles</span>
          </div>
          <div className="grid">
            {collection.books.slice(0, 6).map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onAddToCart={onAddToCart}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
