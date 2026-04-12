import Link from 'next/link'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link href="/" className="logo">
          Wrestle<span>Pulse</span>
        </Link>
        <p>India&apos;s home for professional wrestling journalism.</p>
        <p className="footer-copy">&copy; {new Date().getFullYear()} WrestlePulse. All rights reserved.</p>
      </div>
    </footer>
  )
}
