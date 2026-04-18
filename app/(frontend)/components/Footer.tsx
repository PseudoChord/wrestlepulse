import Link from 'next/link'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link href="/" className="logo">
          Wrestle<span>Pulse</span>
        </Link>
        <p>India&apos;s home for professional wrestling journalism.</p>
        <nav className="footer-links">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <p className="footer-copy">&copy; {new Date().getFullYear()} WrestlePulse. All rights reserved.</p>
      </div>
    </footer>
  )
}
