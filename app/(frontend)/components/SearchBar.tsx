'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`)
      setOpen(false)
      setQuery('')
    }
  }

  if (open) {
    return (
      <form onSubmit={handleSubmit} className="search-form">
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles…"
          className="search-input"
        />
        <button type="submit" className="search-submit">Go</button>
        <button type="button" onClick={() => { setOpen(false); setQuery('') }} className="search-close">✕</button>
      </form>
    )
  }

  return (
    <button onClick={() => setOpen(true)} className="search-icon-btn" aria-label="Search">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </button>
  )
}
