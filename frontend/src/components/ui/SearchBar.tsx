import type { FormEvent } from 'react'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
}

export const SearchBar = ({ value, onChange, onSubmit }: SearchBarProps) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit?.()
  }

  return (
    <form
      className="search-bar"
      onSubmit={handleSubmit}
      aria-label="Book search"
    >
      <input
        type="search"
        placeholder="Search by title, author, or ISBN"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  )
}
