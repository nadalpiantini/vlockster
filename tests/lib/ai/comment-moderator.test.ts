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

// Mock fetch for API calls
global.fetch = vi.fn()

describe('moderateComment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock successful API response
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            content: JSON.stringify({
              severity: 'low',
              action: 'approve',
              reasons: ['Content is safe'],
              explanation: 'No issues detected',
              confidence: 0.95,
            }),
          },
        }],
      }),
    } as Response)
  })

  it('debe retornar un objeto con action, severity, reasons, confidence', async () => {
    const result = await moderateComment({
      comment_text: 'Test comment',
      author_id: 'user-123',
      author_name: 'Test User',
    })
    
    expect(result).toHaveProperty('action')
    expect(result).toHaveProperty('severity')
    expect(result).toHaveProperty('reasons')
    expect(result).toHaveProperty('confidence')
  })

  it('debe tener action como "approve", "review", o "reject"', async () => {
    const result = await moderateComment({
      comment_text: 'Test comment',
      author_id: 'user-123',
      author_name: 'Test User',
    })
    
    expect(['approve', 'review', 'delete', 'ban']).toContain(result.action)
  })

  it('debe tener severity como "safe", "warning", "moderate", o "severe"', async () => {
    const result = await moderateComment({
      comment_text: 'Test comment',
      author_id: 'user-123',
      author_name: 'Test User',
    })
    
    expect(['safe', 'warning', 'moderate', 'severe']).toContain(result.severity)
  })

  it('debe tener reasons como array', async () => {
    const result = await moderateComment({
      comment_text: 'Test comment',
      author_id: 'user-123',
      author_name: 'Test User',
    })
    
    expect(Array.isArray(result.reasons)).toBe(true)
  })

  it('debe tener confidence entre 0 y 1', async () => {
    const result = await moderateComment({
      comment_text: 'Test comment',
      author_id: 'user-123',
      author_name: 'Test User',
    })
    
    expect(result.confidence).toBeGreaterThanOrEqual(0)
    expect(result.confidence).toBeLessThanOrEqual(1)
  })

  it('debe manejar comentarios vacíos', async () => {
    const result = await moderateComment({
      comment_text: '',
      author_id: 'user-123',
      author_name: 'Test User',
    })
    
    expect(result).toBeDefined()
    expect(result.action).toBeDefined()
  })

  it('debe manejar comentarios muy largos', async () => {
    const longComment = 'a'.repeat(10000)
    const result = await moderateComment({
      comment_text: longComment,
      author_id: 'user-123',
      author_name: 'Test User',
    })
    
    expect(result).toBeDefined()
    expect(result.action).toBeDefined()
  })
})

