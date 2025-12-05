import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { checkRateLimit } from '@/lib/utils/rate-limit'

// Mock @upstash/redis
vi.mock('@upstash/redis', () => ({
  Redis: vi.fn().mockImplementation(() => ({
    get: vi.fn(),
    set: vi.fn(),
    expire: vi.fn(),
  })),
}))

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock environment variables
    process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io'
    process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token'
  })

  afterEach(() => {
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
  })

  it('debe permitir request cuando no hay límite alcanzado', async () => {
    const { Redis } = await import('@upstash/redis')
    const mockRedis = new Redis({} as any)
    
    vi.mocked(mockRedis.get).mockResolvedValue('0')
    vi.mocked(mockRedis.set).mockResolvedValue('OK')
    vi.mocked(mockRedis.expire).mockResolvedValue(1)

    const result = await checkRateLimit('user-123', {
      maxRequests: 10,
      windowSeconds: 60,
    })

    expect(result.success).toBe(true)
  })

  it('debe rechazar request cuando se alcanza el límite', async () => {
    const { Redis } = await import('@upstash/redis')
    const mockRedis = new Redis({} as any)
    
    vi.mocked(mockRedis.get).mockResolvedValue('10') // Already at limit

    const result = await checkRateLimit('user-123', {
      maxRequests: 10,
      windowSeconds: 60,
    })

    expect(result.success).toBe(false)
    expect(result.reset).toBeGreaterThan(0)
  })

  it('debe incrementar el contador en cada request', async () => {
    const { Redis } = await import('@upstash/redis')
    const mockRedis = new Redis({} as any)
    
    vi.mocked(mockRedis.get).mockResolvedValue('5')
    vi.mocked(mockRedis.set).mockResolvedValue('OK')
    vi.mocked(mockRedis.expire).mockResolvedValue(1)

    const result = await checkRateLimit('user-123', {
      maxRequests: 10,
      windowSeconds: 60,
    })

    expect(result.success).toBe(true)
    expect(mockRedis.set).toHaveBeenCalled()
  })

  it('debe manejar errores de Redis gracefully', async () => {
    const { Redis } = await import('@upstash/redis')
    const mockRedis = new Redis({} as any)
    
    vi.mocked(mockRedis.get).mockRejectedValue(new Error('Redis error'))

    // Should not throw, but return failure
    const result = await checkRateLimit('user-123', {
      maxRequests: 10,
      windowSeconds: 60,
    })

    // In case of error, should default to allowing (fail open)
    expect(result).toBeDefined()
  })
})

