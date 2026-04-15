import { NextRequest, NextResponse } from 'next/server'

// ── Rate limit store ──────────────────────────────────────────────────────────
// In-memory — sufficient for single-server deployment, resets on restart.
interface RateRecord { count: number; resetAt: number }
const stores = {
  login:  new Map<string, RateRecord>(),
  search: new Map<string, RateRecord>(),
  api:    new Map<string, RateRecord>(),
}

function getIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown'
}

function isRateLimited(
  store: Map<string, RateRecord>,
  ip: string,
  maxRequests: number,
  windowMs: number,
): boolean {
  const now = Date.now()
  const record = store.get(ip)

  if (record && now < record.resetAt) {
    if (record.count >= maxRequests) return true
    record.count++
  } else {
    store.set(ip, { count: 1, resetAt: now + windowMs })
  }
  return false
}

function tooManyResponse(message = 'Too many requests. Please try again later.') {
  return NextResponse.json({ errors: [{ message }] }, { status: 429 })
}

// ── Middleware ────────────────────────────────────────────────────────────────
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method
  const ip = getIP(request)

  // 1. Login brute-force — 5 attempts per 15 minutes
  if (method === 'POST' && pathname === '/api/users/login') {
    if (isRateLimited(stores.login, ip, 5, 15 * 60 * 1000)) {
      return tooManyResponse('Too many login attempts. Please try again in 15 minutes.')
    }
  }

  // 2. Search — 30 requests per minute
  if (pathname === '/search') {
    if (isRateLimited(stores.search, ip, 30, 60 * 1000)) {
      return tooManyResponse('Too many search requests. Please slow down.')
    }
  }

  // 3. API routes — 60 requests per minute
  if (pathname.startsWith('/api/')) {
    if (isRateLimited(stores.api, ip, 60, 60 * 1000)) {
      return tooManyResponse('API rate limit exceeded. Please try again shortly.')
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/users/login',
    '/search',
    '/api/:path*',
  ],
}
