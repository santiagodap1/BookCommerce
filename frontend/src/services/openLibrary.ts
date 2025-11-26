import type { Book, FeaturedCollection } from '../types/book'

const API_BASE = 'https://openlibrary.org'
const FALLBACK_COVER =
  'https://placehold.co/320x480/e2e8f0/0f172a?text=No+cover'

type SearchResponse = {
  docs: Array<{
    key: string
    title: string
    author_name?: string[]
    first_publish_year?: number
    cover_i?: number
    subject?: string[]
    edition_count?: number
    cover_edition_key?: string
  }>
}

type SubjectResponse = {
  works: Array<{
    key: string
    title: string
    authors?: Array<{ name: string }>
    first_publish_year?: number
    cover_id?: number
    subject?: string[]
    edition_count?: number
    description?: string | { value: string }
  }>
}

type WorkDetailResponse = {
  title: string
  description?: string | { value: string }
  subjects?: string[]
  covers?: number[]
  first_publish_date?: string
  created?: { value: string }
}

const getCoverUrl = (coverId?: number, size: 'S' | 'M' | 'L' = 'M') => {
  if (!coverId) {
    return FALLBACK_COVER
  }

  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
}

const normalizeSubjects = (subjects?: string[]) => {
  if (!subjects?.length) return []
  return subjects.slice(0, 5)
}

const calculatePrice = (seed: number) => {
  const base = 12 + (seed % 11)
  const cents = ((seed * 37) % 99) / 100
  return Number((base + cents).toFixed(2))
}

const randomId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `book-${Math.random().toString(36).slice(2, 9)}`

const sanitizeId = (key?: string) =>
  key?.split('/').filter(Boolean).pop() ?? randomId()

const docToBook = (doc: SearchResponse['docs'][number]): Book => {
  const id = sanitizeId(doc.key || doc.cover_edition_key)
  const priceSeed = doc.edition_count ?? doc.first_publish_year ?? id.length

  return {
    id,
    title: doc.title,
    author: doc.author_name?.[0] ?? 'Unknown author',
    year: doc.first_publish_year,
    coverUrl: getCoverUrl(doc.cover_i),
    subjects: normalizeSubjects(doc.subject),
    price: calculatePrice(priceSeed),
  }
}

const workToBook = (work: SubjectResponse['works'][number]): Book => {
  const id = sanitizeId(work.key)
  const priceSeed = work.edition_count ?? work.first_publish_year ?? id.length

  return {
    id,
    title: work.title,
    author: work.authors?.[0]?.name ?? 'Unknown author',
    year: work.first_publish_year,
    coverUrl: getCoverUrl(work.cover_id),
    subjects: normalizeSubjects(work.subject),
    price: calculatePrice(priceSeed),
    summary:
      typeof work.description === 'string'
        ? work.description
        : work.description?.value,
  }
}

export const searchBooks = async (
  query: string,
  limit = 12,
): Promise<Book[]> => {
  const params = new URLSearchParams({
    q: query,
    language: 'spa',
    limit: String(limit),
  })

  const response = await fetch(`${API_BASE}/search.json?${params.toString()}`)

  if (!response.ok) {
    throw new Error('Unable to load books. Please try again later.')
  }

  const payload = (await response.json()) as SearchResponse
  return payload.docs.map(docToBook)
}

export const getBooksBySubject = async (
  subject: string,
  limit = 8,
): Promise<Book[]> => {
  const params = new URLSearchParams({
    limit: String(limit),
    details: 'true',
    language: 'spa',
  })

  const response = await fetch(
    `${API_BASE}/subjects/${encodeURIComponent(subject)}.json?${params.toString()}`,
  )

  if (!response.ok) {
    throw new Error('Unable to load featured collections.')
  }

  const payload = (await response.json()) as SubjectResponse
  return payload.works.map(workToBook)
}

export const getFeaturedCollections = async (
  collections: Array<{
    title: string
    subject: string
    description: string
  }>,
): Promise<FeaturedCollection[]> => {
  const data = await Promise.all(
    collections.map(async (collection) => {
      const books = await getBooksBySubject(collection.subject)
      return {
        ...collection,
        books,
      }
    }),
  )

  return data
}

export const getBookDetails = async (id: string): Promise<Book> => {
  const response = await fetch(`${API_BASE}/works/${id}.json`)

  if (!response.ok) {
    throw new Error('Unable to load book details.')
  }

  const payload = (await response.json()) as WorkDetailResponse

  const coverId = payload.covers?.[0]
  const year = payload.first_publish_date
    ? Number(payload.first_publish_date.slice(0, 4))
    : undefined

  return {
    id,
    title: payload.title,
    author: 'Unknown author',
    year,
    coverUrl: getCoverUrl(coverId),
    subjects: normalizeSubjects(payload.subjects),
    price: calculatePrice(year ?? id.length),
    summary:
      typeof payload.description === 'string'
        ? payload.description
        : payload.description?.value,
  }
}
