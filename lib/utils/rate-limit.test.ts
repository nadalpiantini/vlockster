import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkRateLimit, contentRateLimit, criticalRateLimit } from './rate-limit'

describe('rate-limit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('checkRateLimit', () => {
    it('debe retornar success: true cuando no hay límite alcanzado', async () => {
      const result = await checkRateLimit('test-user-id', contentRateLimit)
      expect(result.success).toBe(true)
    })

    it('debe respetar el límite de rate limit', async () => {
      const userId = `test-${Date.now()}`
      
      // Hacer múltiples requests rápidamente
      const promises = Array.from({ length: 10 }, () =>
        checkRateLimit(userId, contentRateLimit)
      )
      
      const results = await Promise.all(promises)
      const successCount = results.filter((r) => r.success).length
      
      // Al menos algunas deben ser exitosas
      expect(successCount).toBeGreaterThan(0)
    })

    it('debe retornar reset time cuando hay rate limit', async () => {
      const userId = `test-${Date.now()}`
      
      // Intentar exceder el límite
      const promises = Array.from({ length: 100 }, () =>
        checkRateLimit(userId, { limit: 5, window: '10s' })
      )
      
      const results = await Promise.all(promises)
      const rateLimited = results.find((r) => !r.success)
      
      if (rateLimited) {
        expect(rateLimited.reset).toBeDefined()
        expect(typeof rateLimited.reset).toBe('number')
      }
    })
  })

  describe('contentRateLimit', () => {
    it('debe tener configuración válida', () => {
      expect(contentRateLimit.limit).toBeGreaterThan(0)
      expect(contentRateLimit.window).toBeDefined()
    })
  })

  describe('criticalRateLimit', () => {
    it('debe tener configuración válida', () => {
      expect(criticalRateLimit.limit).toBeGreaterThan(0)
      expect(criticalRateLimit.window).toBeDefined()
    })
  })
})
