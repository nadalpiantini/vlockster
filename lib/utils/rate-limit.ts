import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Redis client - usar variables de entorno o fallback a memoria
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null

// Rate limiter general para API
export const apiRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      analytics: true,
    })
  : null

// Rate limiter estricto para autenticación
export const authRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      analytics: true,
    })
  : null

// Rate limiter para operaciones críticas (pagos, admin)
export const criticalRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
    })
  : null

// Rate limiter para creación de contenido
export const contentRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '1 m'),
      analytics: true,
    })
  : null

/**
 * Verifica rate limit y retorna error si se excede
 */
export async function checkRateLimit(
  identifier: string,
  limiter: Ratelimit | null
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  if (!limiter) {
    // En desarrollo sin Redis, permitir todo
    if (process.env.NODE_ENV === 'development') {
      return { success: true }
    }
    // En producción sin Redis, usar límite básico en memoria
    return { success: true }
  }

  const { success, limit, remaining, reset } = await limiter.limit(identifier)

  return { success, limit, remaining, reset }
}

