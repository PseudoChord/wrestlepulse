import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const R2_PUBLIC_URL = 'https://pub-5a8c0a606aec4c5fada31f0500f5171b.r2.dev'

const csp = [
  "default-src 'self'",
  // Next.js requires unsafe-inline and unsafe-eval for hydration + Turbopack
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  // Tailwind + Payload admin use inline styles
  "style-src 'self' 'unsafe-inline'",
  // Allow images from self, R2, and data URIs
  `img-src 'self' data: blob: ${R2_PUBLIC_URL}`,
  // Fonts
  "font-src 'self' data:",
  // API connections
  `connect-src 'self' ${R2_PUBLIC_URL}`,
  // Disallow embedding in iframes on other sites
  "frame-src 'none'",
  "frame-ancestors 'self'",
  // Disallow plugins
  "object-src 'none'",
  // Restrict base tag
  "base-uri 'self'",
  // Restrict form actions
  "form-action 'self'",
].join('; ')

const securityHeaders = [
  { key: 'X-Frame-Options',          value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options',   value: 'nosniff' },
  { key: 'X-XSS-Protection',         value: '1; mode=block' },
  { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy',  value: csp },
]

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-5a8c0a606aec4c5fada31f0500f5171b.r2.dev',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default withPayload(nextConfig);
