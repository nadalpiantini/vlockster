import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateRecommendations } from '@/lib/ai/recommendations'

// Mock logger
vi.mock('@/lib/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}))

describe('generateRecommendations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar un array de recomendaciones', async () => {
    const result = await generateRecommendations({
      videos_viewed: [],
      projects_backed: [],
    })
    
    expect(Array.isArray(result)).toBe(true)
  })

  it('debe retornar recomendaciones con estructura correcta', async () => {
    const result = await generateRecommendations({
      videos_viewed: [],
      projects_backed: [],
    })
    
    if (result.length > 0) {
      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('type')
      expect(result[0]).toHaveProperty('title')
      expect(result[0]).toHaveProperty('description')
      expect(result[0]).toHaveProperty('reason')
      expect(result[0]).toHaveProperty('confidence_score')
    }
  })

  it('debe tener type como "video" o "project"', async () => {
    const result = await generateRecommendations({
      videos_viewed: [],
      projects_backed: [],
    })
    
    result.forEach((rec) => {
      expect(['video', 'project']).toContain(rec.type)
    })
  })

  it('debe tener confidence_score entre 0 y 1', async () => {
    const result = await generateRecommendations({
      videos_viewed: [],
      projects_backed: [],
    })
    
    result.forEach((rec) => {
      expect(rec.confidence_score).toBeGreaterThanOrEqual(0)
      expect(rec.confidence_score).toBeLessThanOrEqual(1)
    })
  })

  it('debe manejar historial vacío', async () => {
    const result = await generateRecommendations({
      videos_viewed: [],
      projects_backed: [],
    })
    
    expect(Array.isArray(result)).toBe(true)
  })

  it('debe manejar historial con datos', async () => {
    const result = await generateRecommendations({
      videos_viewed: [
        {
          video_id: 'video-1',
          title: 'Test Video',
          genre: 'drama',
          creator_id: 'creator-1',
          watched_seconds: 100,
        },
      ],
      projects_backed: [
        {
          project_id: 'project-1',
          title: 'Test Project',
          genre: 'comedy',
          creator_id: 'creator-1',
          amount: 50,
        },
      ],
    })
    
    expect(Array.isArray(result)).toBe(true)
  })
})

