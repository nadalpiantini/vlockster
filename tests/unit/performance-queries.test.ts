import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getPerformanceMetrics, getUsageMetrics, getBundleOptimizationData } from '@/lib/utils/performance-queries'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'

// Mock de las dependencias
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}))

describe('performance-queries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPerformanceMetrics', () => {
    it('should return performance metrics when data exists', async () => {
      const mockVideos = [
        { 
          id: 'vid1', 
          title: 'Popular Video', 
          view_count: 1000, 
          avg_watch_time: 120, 
          completion_rate: 0.75 
        }
      ]
      
      const mockProjects = [
        { 
          id: 'proj1', 
          title: 'Popular Project', 
          backers_count: 50, 
          goal_amount: 10000,
          current_amount: 7500
        }
      ]

      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === 'videos') {
            return {
              select: vi.fn(() => ({
                eq: vi.fn(() => ({
                  order: vi.fn(() => ({
                    limit: vi.fn(() => Promise.resolve({ data: mockVideos, error: null }))
                  }))
                }))
              }))
            }
          } else if (table === 'projects') {
            return {
              select: vi.fn(() => ({
                eq: vi.fn(() => ({
                  order: vi.fn(() => ({
                    limit: vi.fn(() => Promise.resolve({ data: mockProjects, error: null }))
                  }))
                }))
              }))
            }
          }
        })
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getPerformanceMetrics()

      expect(result).toEqual({
        topVideos: mockVideos,
        topProjects: [
          { 
            id: 'proj1', 
            title: 'Popular Project', 
            backers_count: 50, 
            funded_percentage: 75 
          }
        ]
      })
    })

    it('should return null when videos query fails', async () => {
      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === 'videos') {
            return {
              select: vi.fn(() => ({
                eq: vi.fn(() => ({
                  order: vi.fn(() => ({
                    limit: vi.fn(() => Promise.resolve({ data: null, error: { message: 'Error' } }))
                  }))
                }))
              }))
            }
          }
        })
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getPerformanceMetrics()

      expect(logger.error).toHaveBeenCalledWith(
        'Error al obtener métricas de videos',
        { message: 'Error' },
        expect.objectContaining({
          endpoint: 'getPerformanceMetrics',
        })
      )
      expect(result).toBeNull()
    })
  })

  describe('getUsageMetrics', () => {
    it('should return usage metrics when data exists', async () => {
      const mockUserSessions = [
        { created_at: '2023-01-01T10:00:00Z' },
        { created_at: '2023-01-01T11:00:00Z' },
      ]
      
      const mockFeatureUsage = [
        { feature: 'video_play', usage_count: '150' },
        { feature: 'project_create', usage_count: '75' },
      ]
      
      const mockPeakHours = [
        { hour: '14', usage_count: '45' },
        { hour: '15', usage_count: '38' },
      ]

      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === 'user_sessions') {
            return {
              select: vi.fn((fields) => {
                if (fields === '*') {
                  return {
                    count: vi.fn(() => Promise.resolve({ count: 150, error: null }))
                  }
                } else if (fields.includes('EXTRACT')) {
                  return {
                    gte: vi.fn(() => ({
                      group: vi.fn(() => ({
                        order: vi.fn(() => Promise.resolve({ data: mockPeakHours, error: null }))
                      }))
                    }))
                  }
                }
                // Para el count exact
                return {
                  gte: vi.fn(() => ({
                    count: vi.fn(() => Promise.resolve({ count: 150, error: null }))
                  }))
                }
              }),
              gte: vi.fn(() => ({
                count: vi.fn(() => Promise.resolve({ count: 150, error: null }))
              }))
            }
          } else if (table === 'feature_usage') {
            return {
              select: vi.fn(() => ({
                group: vi.fn(() => ({
                  order: vi.fn(() => ({
                    limit: vi.fn(() => Promise.resolve({ data: mockFeatureUsage, error: null }))
                  }))
                }))
              }))
            }
          }
        })
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getUsageMetrics()

      expect(result).toEqual({
        dailyActiveUsers: 150,
        weeklyActiveUsers: 150,
        monthlyActiveUsers: 150,
        mostPopularFeatures: [
          { feature: 'video_play', usage_count: 150 },
          { feature: 'project_create', usage_count: 75 },
        ],
        peakUsageHours: [
          { hour: 14, usage_count: 45 },
          { hour: 15, usage_count: 38 },
        ]
      })
    })
  })

  describe('getBundleOptimizationData', () => {
    it('should return bundle optimization data when data exists', async () => {
      const mockVideos = [
        { id: 'vid1', title: 'Top Video', view_count: 200 }
      ]
      
      const mockProjects = [
        { id: 'proj1', title: 'Top Project', backers_count: 30 }
      ]
      
      const mockEngagement = [
        { avg_watch_time: 180, total_views: 50 }
      ]

      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === 'videos') {
            return {
              select: vi.fn(() => ({
                eq: vi.fn(() => ({
                  order: vi.fn(() => ({
                    limit: vi.fn(() => Promise.resolve({ data: mockVideos, error: null }))
                  }))
                }))
              }))
            }
          } else if (table === 'projects') {
            return {
              select: vi.fn(() => ({
                eq: vi.fn(() => ({
                  order: vi.fn(() => ({
                    limit: vi.fn(() => Promise.resolve({ data: mockProjects, error: null }))
                  }))
                }))
              }))
            }
          } else if (table === 'video_metrics') {
            return {
              select: vi.fn(() => ({
                gt: vi.fn(() => Promise.resolve({ data: mockEngagement, error: null }))
              }))
            }
          }
        })
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getBundleOptimizationData()

      expect(result).toEqual({
        popularContent: {
          videos: mockVideos,
          projects: mockProjects
        },
        userEngagement: {
          avgSessionDuration: 180,
          pageViewsPerSession: 3,
          bounceRate: 0.35
        }
      })
    })
  })
})