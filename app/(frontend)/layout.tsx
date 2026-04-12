import React from 'react'
import './styles.css'

export const metadata = {
  title: "WrestlePulse — India's Wrestling News",
  description: "India's home for professional wrestling journalism. WWE, AEW, and Indian wrestling coverage.",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'manifest', url: '/site.webmanifest' },
    ],
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var t = localStorage.getItem('wp-theme') ||
              (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            document.documentElement.setAttribute('data-theme', t);
          } catch(e) {}
        ` }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
