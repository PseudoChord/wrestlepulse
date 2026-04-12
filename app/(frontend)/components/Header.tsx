import Link from 'next/link'
import { SearchBar } from './SearchBar'
import { ThemeToggle } from './ThemeToggle'
import { MobileMenu } from './MobileMenu'

const NAV_LINKS = [
  { label: 'News',    href: '/news' },
  { label: 'WWE',     href: '/wwe' },
  { label: 'Opinion', href: '/opinion' },
  { label: 'Results', href: '/results' },
]

export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo">
          Wrestle<span>Pulse</span>
        </Link>
        <nav className="main-nav">
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={label} href={href}>{label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <SearchBar />
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
