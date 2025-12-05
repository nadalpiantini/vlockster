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

// Mock fetch for API calls
global.fetch = vi.fn()

describe('generateRecommendations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock successful API response
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            content: JSON.stringify({
              recommendations: [
                {
                  id: 'v1',
                  type: 'video',
                  title: 'Video 1',
                  description: 'Desc 1',
                  reason: 'Based on your viewing history',
                  confidence_score: 0.85,
                },
              ],
              insights: 'You enjoy drama content',
            }),
          },
        }],
      }),
    } as Response)
  })

  const mockAvailableContent = {
    videos: [
      { id: 'v1', title: 'Video 1', description: 'Desc 1', genre: 'drama', creator_id: 'c1', view_count: 10, created_at: new Date().toISOString() },
    ],
    projects: [
      { id: 'p1', title: 'Project 1', description: 'Desc 1', category: 'comedy', creator_id: 'c1', goal_amount: 1000, current_amount: 0, deadline: new Date().toISOString() },
    ],
  }

  it('debe retornar un objeto con recommendations e insights', async () => {
    const result = await generateRecommendations({
      videos_viewed: [],
      projects_backed: [],
      preferred_genres: [],
      total_watch_time: 0,
    }, mockAvailableContent)
    
    expect(result).toHaveProperty('recommendations')
    expect(result).toHaveProperty('insights')
    expect(Array.isArray(result.recommendations)).toBe(true)
  })

  it('debe retornar recomendaciones con estructura correcta', async () => {
    const result = await generateRecommendations({
      videos_viewed: [],
      projects_backed: [],
      preferred_genres: [],
      total_watch_time: 0,
    }, mockAvailableContent)
    
    if (result.recommendations.length > 0) {
      expect(result.recommendations[0]).toHaveProperty('id')
      expect(result.recommendations[0]).toHaveProperty('type')
      expect(result.recommendations[0]).toHaveProperty('title')
      expect(result.recommendations[0]).toHaveProperty('description')
      expect(result.recommendations[0]).toHaveProperty('reason')
      expect(result.recommendations[0]).toHaveProperty('confidence_score')
    }
  })

  it('debe tener type como "video" o "project"', async () => {
    const result = await generateRecommendations({
      videos_viewed: [],
      projects_backed: [],
      preferred_genres: [],
      total_watch_time: 0,
    }, mockAvailableContent)
    
    result.recommendations.forEach((rec) => {
      expect(['video', 'project']).toContain(rec.type)
    })
  })

  it('debe tener confidence_score entre 0 y 1', async () => {
    const result = await generateRecommendations({
      videos_viewed: [],
      projects_backed: [],
      preferred_genres: [],
      total_watch_time: 0,
    }, mockAvailableContent)
    
    result.recommendations.forEach((rec) => {
      expect(rec.confidence_score).toBeGreaterThanOrEqual(0)
      expect(rec.confidence_score).toBeLessThanOrEqual(1)
    })
  })

  it('debe manejar historial vacío', async () => {
    const result = await generateRecommendations({
      videos_viewed: [],
      projects_backed: [],
      preferred_genres: [],
      total_watch_time: 0,
    }, mockAvailableContent)
    
    expect(Array.isArray(result.recommendations)).toBe(true)
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
      preferred_genres: [['drama', 1]],
      total_watch_time: 1.67,
    }, mockAvailableContent)
    
    expect(Array.isArray(result.recommendations)).toBe(true)
  })
})

