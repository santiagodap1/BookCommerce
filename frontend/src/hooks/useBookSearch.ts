import { useEffect, useState } from 'react'
import { searchBooks } from '../services/openLibrary'
import type { Book } from '../types/book'
import { useDebounce } from './useDebounce'

type SearchState = {
  data: Book[]
  loading: boolean
  error: string | null
}

const defaultState: SearchState = {
  data: [],
  loading: false,
  error: null,
}

export const useBookSearch = (query: string) => {
  const [state, setState] = useState<SearchState>(defaultState)
  const debouncedQuery = useDebounce(query.trim())

  useEffect(() => {
    if (!debouncedQuery) {
      setState(defaultState)
      return
    }

    let active = true

    const fetchBooks = async () => {
      setState({ data: [], loading: true, error: null })
      try {
        const data = await searchBooks(debouncedQuery)
        if (!active) return
        setState({ data, loading: false, error: null })
      } catch (error) {
        console.error(error)
        if (!active) return
        setState({ data: [], loading: false, error: (error as Error).message })
      }
    }

    fetchBooks()

    return () => {
      active = false
    }
  }, [debouncedQuery])

  return {
    ...state,
    hasQuery: Boolean(debouncedQuery),
  }
}
