import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import type { Book } from '../../types/book'
import { getBookDetails } from '../../services/openLibrary'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { AuthModal } from '../../components/ui/AuthModal'

import './BookDetails.css'

export const BookDetails = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { bookId } = useParams<{ bookId: string }>()
  const state = location.state as { book?: Book } | null
  const baseBook = state?.book
  const [book, setBook] = useState<Book | null>(baseBook ?? null)
  const [loading, setLoading] = useState(!baseBook)
  const [error, setError] = useState<string | null>(null)
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')



  useEffect(() => {
    if (!bookId || (book && book.summary)) return
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const details = await getBookDetails(bookId)
        if (!active) return
        setBook((prev) => {
          if (prev) {
            return {
              ...prev,
              ...details,
              author: details.author === 'Unknown author' ? prev.author : details.author,
              coverUrl: details.coverUrl || prev.coverUrl,
              subjects: details.subjects?.length ? details.subjects : prev.subjects,
              price: prev.price,
              year: details.year ?? prev.year,
              summary: details.summary ?? prev.summary,
            }
          }
          return details
        })
        setError(null)
      } catch (err) {
        if (!active) return
        setError((err as Error).message)
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [bookId, book])

  const handleAddToCart = async () => {
    if (!book) return
    if (!isAuthenticated) {
      setAuthMode('login')
      setShowAuth(true)
      return
    }
    try {
      await addItem(book)
    } catch (err) {
      if ((err as Error).message === 'AUTH_REQUIRED') {
        setAuthMode('login')
        setShowAuth(true)
      } else {
        console.error(err)
      }
    }
  }

  const detailSections = useMemo(() => {
    if (!book) return []
    return [
      {
        label: 'Subjects',
        value: book.subjects?.join(', '),
      },
      {
        label: 'Published',
        value: book.year ? String(book.year) : undefined,
      },
    ].filter((section) => Boolean(section.value))
  }, [book])

  return (
    <div className="detail-shell">
      <button className="link" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {loading && <p className="status">Loading book…</p>}
      {error && <p className="status error">{error}</p>}

      {book && !loading && (
        <div className="book-detail">
          <div className="book-detail__media">
            <img src={book.coverUrl} alt={`Cover of ${book.title}`} />
          </div>
          <div className="book-detail__content">
            <p className="eyebrow">{book.subjects?.[0] ?? 'Book'}</p>
            <h1>{book.title}</h1>
            <p className="book-detail__author">By {book.author}</p>
            {book.summary && <p className="book-detail__summary">{book.summary}</p>}
            <div className="book-detail__meta">
              {detailSections.map((section) => (
                <div key={section.label}>
                  <span>{section.label}</span>
                  <strong>{section.value}</strong>
                </div>
              ))}
            </div>
            <div className="book-detail__actions">
              <span className="book-card__price">${book.price.toFixed(2)}</span>
              <button className="primary" onClick={handleAddToCart}>
                Add to cart
              </button>
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={showAuth}
        mode={authMode}
        onClose={() => setShowAuth(false)}
        onModeChange={setAuthMode}
      />
    </div>
  )
}
