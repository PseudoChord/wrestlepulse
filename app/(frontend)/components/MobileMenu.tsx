'use client'

import { useState } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'News',    href: '/news' },
  { label: 'WWE',     href: '/wwe' },
  { label: 'Opinion', href: '/opinion' },
  { label: 'Results', href: '/results' },
]

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="hamburger"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>

      {open && (
        <nav className="mobile-nav">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="mobile-nav-link"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </>
  )
}
