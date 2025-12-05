import { describe, it, expect, vi, beforeEach } from 'vitest'
import { moderateComment } from '@/lib/ai/comment-moderator'

// Mock logger
vi.mock('@/lib/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}))

describe('moderateComment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar un objeto con action, severity, reasons, confidence', async () => {
    const result = await moderateComment('Test comment')
    
    expect(result).toHaveProperty('action')
    expect(result).toHaveProperty('severity')
    expect(result).toHaveProperty('reasons')
    expect(result).toHaveProperty('confidence')
  })

  it('debe tener action como "approve", "review", o "reject"', async () => {
    const result = await moderateComment('Test comment')
    
    expect(['approve', 'review', 'reject']).toContain(result.action)
  })

  it('debe tener severity como "low", "medium", o "high"', async () => {
    const result = await moderateComment('Test comment')
    
    expect(['low', 'medium', 'high']).toContain(result.severity)
  })

  it('debe tener reasons como array', async () => {
    const result = await moderateComment('Test comment')
    
    expect(Array.isArray(result.reasons)).toBe(true)
  })

  it('debe tener confidence entre 0 y 1', async () => {
    const result = await moderateComment('Test comment')
    
    expect(result.confidence).toBeGreaterThanOrEqual(0)
    expect(result.confidence).toBeLessThanOrEqual(1)
  })

  it('debe manejar comentarios vacíos', async () => {
    const result = await moderateComment('')
    
    expect(result).toBeDefined()
    expect(result.action).toBeDefined()
  })

  it('debe manejar comentarios muy largos', async () => {
    const longComment = 'a'.repeat(10000)
    const result = await moderateComment(longComment)
    
    expect(result).toBeDefined()
    expect(result.action).toBeDefined()
  })
})

