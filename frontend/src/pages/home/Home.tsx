import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { SearchBar } from '../../components/ui/SearchBar'
import { BookGrid } from '../../components/ui/BookGrid'
import { FeaturedSection } from '../../components/ui/FeaturedSection'
import { AuthModal } from '../../components/ui/AuthModal'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useBookSearch } from '../../hooks/useBookSearch'
import { getFeaturedCollections } from '../../services/openLibrary'
import type { Book, FeaturedCollection } from '../../types/book'
import './Home.css'

const FEATURED_CONFIG = [
  {
    title: 'Contemporary fantasy',
    subject: 'fantasy',
    description: 'Epic universes, urban magic, and sagas you cannot put down.',
  },
  {
    title: 'Visionary science fiction',
    subject: 'science_fiction',
    description: 'Stories that explore future possibilities and bold questions.',
  },
  {
    title: 'Romance and intimate stories',
    subject: 'romance',
    description: 'Heartfelt tales with unforgettable characters.',
  },
]

export const Home = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const { data, loading, error, hasQuery } = useBookSearch(query)
  const [featured, setFeatured] = useState<FeaturedCollection[]>([])
  const [featuredLoading, setFeaturedLoading] = useState(true)
  const [featuredError, setFeaturedError] = useState<string | null>(null)
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const [isAuthOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  useEffect(() => {
    let active = true

    const loadCollections = async () => {
      setFeaturedLoading(true)
      try {
        const collections = await getFeaturedCollections(FEATURED_CONFIG)
        if (!active) return
        setFeatured(collections)
        setFeaturedError(null)
      } catch (error) {
        if (!active) return
        setFeaturedError((error as Error).message)
      } finally {
        if (active) setFeaturedLoading(false)
      }
    }

    loadCollections()

    return () => {
      active = false
    }
  }, [])

  const highlightedBooks = useMemo(() => {
    return featured.flatMap((collection) => collection.books).slice(0, 8)
  }, [featured])

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode)
    setAuthOpen(true)
  }

  const handleAddToCart = async (book: Book) => {
    if (!isAuthenticated) {
      handleAuthClick('login')
      return
    }
    try {
      await addItem(book)
    } catch (error) {
      if ((error as Error).message === 'AUTH_REQUIRED') {
        handleAuthClick('login')
      } else {
        console.error(error)
      }
    }
  }

  const handleSelectBook = (book: Book) => {
    navigate(`/books/${book.id}`, { state: { book } })
  }

  return (
    <div className="home-container">

      <main>
        <section className="hero" id="about">
          <div className="hero__content">
            <span className="eyebrow">Powered by Open Library</span>
            <h1>Discover your next read with curated recommendations</h1>
            <p>
              We connect to the open Open Library catalog to serve an always-fresh
              storefront with thousands of titles. Explore thematic collections and
              fill your cart in seconds.
            </p>
            <div className="hero__stats">
              <div>
                <strong>120K+</strong>
                <span>Titles indexed</span>
              </div>
              <div>
                <strong>250</strong>
                <span>Genres and tags</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>Availability</span>
              </div>
            </div>
          </div>
          <div className="hero__actions">
            <SearchBar value={query} onChange={setQuery} onSubmit={() => void 0} />
            <p className="helper-text">
              Examples: &ldquo;magical realism&rdquo;, &ldquo;Isabel Allende&rdquo;,
              &ldquo;UX design&rdquo;
            </p>
          </div>
        </section>

        <section className="results" id="highlights">
          {loading && <p className="status">Searching for matches...</p>}
          {error && <p className="status error">{error}</p>}
          {hasQuery && !loading && !error && (
            <BookGrid
              books={data}
              title={`Results for “${query}”`}
              emptyMessage="No matches found. Please try a different term."
              onAddToCart={handleAddToCart}
              onSelect={handleSelectBook}
            />
          )}
        </section>

        {!hasQuery && (
          <>
            <section className="results" id="collections">
              {featuredLoading && (
                <p className="status">Loading featured collections...</p>
              )}
              {featuredError && <p className="status error">{featuredError}</p>}
              {!featuredLoading && !featuredError && highlightedBooks.length > 0 && (
                <BookGrid
                  books={highlightedBooks}
                  title="Team picks"
                  emptyMessage="We are curating fresh recommendations."
                  onAddToCart={handleAddToCart}
                  onSelect={handleSelectBook}
                />
              )}
            </section>
            {!featuredLoading && !featuredError && featured.length > 0 && (
              <FeaturedSection
                collections={featured}
                onAddToCart={handleAddToCart}
                onSelect={handleSelectBook}
              />
            )}
          </>
        )}
      </main>

      <AuthModal
        isOpen={isAuthOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onModeChange={setAuthMode}
      />
    </div>
  )
}
