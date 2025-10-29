import type { NextRequest } from "next/server"

// Validate API key for CS2 plugin requests
export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get("X-API-Key")
  const expectedApiKey = process.env.CS2_PLUGIN_API_KEY

  if (!expectedApiKey) {
    console.error("[v0] CS2_PLUGIN_API_KEY not configured")
    return false
  }

  return apiKey === expectedApiKey
}

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number,
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: maxRequests - record.count }
}

// Clean up old rate limit records periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean up every minute
