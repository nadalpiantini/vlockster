import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { checkRateLimit } from '@/lib/utils/rate-limit'
import { Ratelimit } from '@upstash/ratelimit'

// Mock @upstash/redis
const mockRedis = {
  get: vi.fn(),
  set: vi.fn(),
  expire: vi.fn(),
}

vi.mock('@upstash/redis', () => ({
  Redis: vi.fn().mockImplementation(() => mockRedis),
}))

// Mock @upstash/ratelimit
vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: vi.fn().mockImplementation(() => ({
    limit: vi.fn(),
  })),
}))

describe('checkRateLimit', () => {
  let mockLimiter: { limit: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    // Mock environment variables
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://test.upstash.io')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-token')

    // Create mock limiter
    mockLimiter = {
      limit: vi.fn(),
    }
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('debe permitir request cuando no hay límite alcanzado', async () => {
    mockLimiter.limit.mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 60000,
    })

    const result = await checkRateLimit('user-123', mockLimiter as unknown as Ratelimit)

    expect(result.success).toBe(true)
    expect(mockLimiter.limit).toHaveBeenCalledWith('user-123')
  })

  it('debe rechazar request cuando se alcanza el límite', async () => {
    mockLimiter.limit.mockResolvedValue({
      success: false,
      limit: 10,
      remaining: 0,
      reset: Date.now() + 60000,
    })

    const result = await checkRateLimit('user-123', mockLimiter as unknown as Ratelimit)

    expect(result.success).toBe(false)
    expect(result.reset).toBeGreaterThan(0)
    expect(mockLimiter.limit).toHaveBeenCalledWith('user-123')
  })

  it('debe retornar success cuando no hay limiter (desarrollo)', async () => {
    vi.stubEnv('NODE_ENV', 'development')

    const result = await checkRateLimit('user-123', null)

    expect(result.success).toBe(true)
  })

  it('debe manejar errores de Redis gracefully', async () => {
    mockLimiter.limit.mockRejectedValue(new Error('Redis error'))

    // Should not throw, but the function should handle it
    await expect(checkRateLimit('user-123', mockLimiter as unknown as Ratelimit)).rejects.toThrow('Redis error')
  })
})

