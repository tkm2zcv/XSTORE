/**
 * Rate Limiting Utilities
 *
 * This file provides rate limiting functionality for API routes.
 * Currently using a simple in-memory store for development.
 *
 * For production, consider using:
 * - @upstash/ratelimit + Vercel KV
 * - Redis
 * - Other distributed rate limiting solutions
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// Simple in-memory store (not suitable for production with multiple instances)
const store = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed
   */
  limit: number
  /**
   * Time window in milliseconds
   */
  window: number
}

export interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  success: boolean
  /**
   * Number of requests remaining
   */
  remaining: number
  /**
   * Time when the rate limit resets (Unix timestamp)
   */
  reset: number
}

/**
 * Simple rate limiter using sliding window algorithm
 *
 * @param identifier - Unique identifier for the rate limit (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 *
 * @example
 * ```typescript
 * const result = rateLimit('192.168.1.1', { limit: 10, window: 60000 })
 * if (!result.success) {
 *   return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
 * }
 * ```
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 10, window: 60000 }
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(identifier)

  // Clean up expired entries (optional, improves memory usage)
  if (entry && entry.resetTime < now) {
    store.delete(identifier)
  }

  const currentEntry = store.get(identifier)

  if (!currentEntry) {
    // First request within the window
    store.set(identifier, {
      count: 1,
      resetTime: now + config.window,
    })

    return {
      success: true,
      remaining: config.limit - 1,
      reset: now + config.window,
    }
  }

  if (currentEntry.count >= config.limit) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      reset: currentEntry.resetTime,
    }
  }

  // Increment count
  currentEntry.count++
  store.set(identifier, currentEntry)

  return {
    success: true,
    remaining: config.limit - currentEntry.count,
    reset: currentEntry.resetTime,
  }
}

/**
 * Get client identifier from request
 *
 * Uses IP address or a fallback for development
 *
 * @param request - Next.js request object
 * @returns Client identifier
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from headers (works with Vercel)
  const forwardedFor = (request.headers.get('x-forwarded-for') ?? '').split(',')[0]
  const realIp = request.headers.get('x-real-ip')

  return forwardedFor || realIp || '127.0.0.1'
}

/**
 * Preset rate limit configurations
 */
export const RateLimitPresets = {
  /**
   * Strict: 5 requests per 10 seconds
   */
  STRICT: { limit: 5, window: 10000 },

  /**
   * Standard: 10 requests per 10 seconds
   */
  STANDARD: { limit: 10, window: 10000 },

  /**
   * Relaxed: 30 requests per minute
   */
  RELAXED: { limit: 30, window: 60000 },

  /**
   * Authentication: 5 login attempts per 15 minutes
   */
  AUTH: { limit: 5, window: 900000 },

  /**
   * Public form: 3 submissions per hour
   */
  PUBLIC_FORM: { limit: 3, window: 3600000 },
} as const

/**
 * Clean up expired entries periodically
 * Call this in a background job or on app initialization
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetTime < now) {
      store.delete(key)
    }
  }
}

// Optional: Clean up every 5 minutes
if (typeof window === 'undefined') {
  // Only run in server environment
  setInterval(cleanupRateLimitStore, 300000)
}

/**
 * Example usage in API Route:
 *
 * ```typescript
 * import { NextRequest, NextResponse } from 'next/server'
 * import { rateLimit, getClientIdentifier, RateLimitPresets } from '@/lib/rate-limit'
 *
 * export async function POST(request: NextRequest) {
 *   const identifier = getClientIdentifier(request)
 *   const result = rateLimit(identifier, RateLimitPresets.STANDARD)
 *
 *   if (!result.success) {
 *     return NextResponse.json(
 *       {
 *         error: 'Too many requests',
 *         retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
 *       },
 *       {
 *         status: 429,
 *         headers: {
 *           'X-RateLimit-Limit': String(RateLimitPresets.STANDARD.limit),
 *           'X-RateLimit-Remaining': String(result.remaining),
 *           'X-RateLimit-Reset': String(result.reset),
 *           'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)),
 *         },
 *       }
 *     )
 *   }
 *
 *   // Process request...
 *   return NextResponse.json({ success: true })
 * }
 * ```
 */
