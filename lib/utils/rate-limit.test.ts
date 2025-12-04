import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkRateLimit, apiRateLimit, authRateLimit, criticalRateLimit, contentRateLimit } from './rate-limit'

// Mock de Ratelimit
const mockLimiter = {
  limit: vi.fn().mockResolvedValue({
    success: true,
    limit: 100,
    remaining: 99,
    reset: Date.now() + 60000,
  }),
}

describe('rate-limit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('checkRateLimit', () => {
    it('debe retornar success en desarrollo sin Redis', async () => {
      // En desarrollo sin Redis configurado
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      const result = await checkRateLimit('test-id', null)

      expect(result.success).toBe(true)

      process.env.NODE_ENV = originalEnv
    })

    it('debe retornar success cuando limiter es null en desarrollo', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      const result = await checkRateLimit('test-id', null)

      expect(result.success).toBe(true)

      process.env.NODE_ENV = originalEnv
    })

    it('debe retornar success en producción sin Redis (fallback)', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const result = await checkRateLimit('test-id', null)

      expect(result.success).toBe(true)

      process.env.NODE_ENV = originalEnv
    })

    it('debe usar limiter cuando está disponible', async () => {
      const result = await checkRateLimit('test-id', mockLimiter as any)

      expect(result.success).toBe(true)
      expect(result.limit).toBe(100)
      expect(result.remaining).toBe(99)
      expect(mockLimiter.limit).toHaveBeenCalledWith('test-id')
    })

    it('debe manejar límite excedido', async () => {
      const mockLimiterExceeded = {
        limit: vi.fn().mockResolvedValue({
          success: false,
          limit: 100,
          remaining: 0,
          reset: Date.now() + 60000,
        }),
      }

      const result = await checkRateLimit('test-id', mockLimiterExceeded as any)

      expect(result.success).toBe(false)
      expect(result.remaining).toBe(0)
    })
  })

  describe('rate limiters', () => {
    it('debe tener apiRateLimit definido o null', () => {
      expect(apiRateLimit === null || typeof apiRateLimit !== 'undefined').toBe(true)
    })

    it('debe tener authRateLimit definido o null', () => {
      expect(authRateLimit === null || typeof authRateLimit !== 'undefined').toBe(true)
    })

    it('debe tener criticalRateLimit definido o null', () => {
      expect(criticalRateLimit === null || typeof criticalRateLimit !== 'undefined').toBe(true)
    })

    it('debe tener contentRateLimit definido o null', () => {
      expect(contentRateLimit === null || typeof contentRateLimit !== 'undefined').toBe(true)
    })
  })
})
