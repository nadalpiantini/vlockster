import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getProjectsByCategory, getRecentProjects, getProjectsByStatus, getProjectStatsByCategory } from '@/lib/utils/db-queries'
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

// Definir tipos de ayuda para los mocks
type MockSupabaseQuery = {
  from: any
  select: any
  eq: any
  in: any
  single: any
  is: any
  order: any
  limit: any
  range: any
}

describe('db-queries - Segundo Mini Sprint', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getProjectsByCategory', () => {
    it('should return projects by category with total count when category exists', async () => {
      const mockProjects = [
        { id: 'proj1', title: 'Project 1', category: 'film', created_at: '2023-01-01T00:00:00Z' },
        { id: 'proj2', title: 'Project 2', category: 'film', created_at: '2023-01-02T00:00:00Z' },
      ]
      const mockCount = 10

      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === 'projects') {
            return {
              select: vi.fn(() => ({
                eq: vi.fn(() => ({
                  is: vi.fn(() => ({
                    order: vi.fn(() => ({
                      range: vi.fn(() => Promise.resolve({ data: mockProjects, error: null }))
                    }))
                  }))
                })),
                count: vi.fn(() => Promise.resolve({ count: mockCount, error: null }))
              }))
            }
          }
        })
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getProjectsByCategory('film', 10, 0)

      expect(createClient).toHaveBeenCalled()
      expect(result).toEqual({
        projects: mockProjects,
        total: mockCount,
      })
    })

    it('should return null when count query fails', async () => {
      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === 'projects') {
            return {
              select: vi.fn(() => ({
                eq: vi.fn(() => ({
                  is: vi.fn(() => ({
                    order: vi.fn(() => ({
                      range: vi.fn(() => Promise.resolve({ data: [], error: null }))
                    }))
                  }))
                })),
                count: vi.fn(() => Promise.resolve({ count: null, error: { message: 'Query failed' } }))
              }))
            }
          }
        })
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getProjectsByCategory('film')

      expect(logger.error).toHaveBeenCalledWith(
        'Error al contar proyectos por categoría',
        { message: 'Query failed' },
        expect.objectContaining({
          category: 'film',
          limit: 10,
          offset: 0,
          endpoint: 'getProjectsByCategory',
        })
      )
      expect(result).toBeNull()
    })
  })

  describe('getRecentProjects', () => {
    it('should return recent projects when they exist', async () => {
      const mockProjects = [
        { id: 'proj1', title: 'Recent Project 1', created_at: '2023-05-01T00:00:00Z' },
        { id: 'proj2', title: 'Recent Project 2', created_at: '2023-05-02T00:00:00Z' },
      ]

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            is: vi.fn(() => ({
              order: vi.fn(() => ({
                limit: vi.fn(() => Promise.resolve({ data: mockProjects, error: null }))
              }))
            }))
          }))
        }))
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getRecentProjects(5)

      expect(createClient).toHaveBeenCalled()
      expect(result).toEqual(mockProjects)
    })

    it('should return empty array when query fails', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            is: vi.fn(() => ({
              order: vi.fn(() => ({
                limit: vi.fn(() => Promise.resolve({ data: null, error: { message: 'Failed' } }))
              }))
            }))
          }))
        }))
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getRecentProjects(5)

      expect(logger.error).toHaveBeenCalledWith(
        'Error al obtener proyectos recientes',
        { message: 'Failed' },
        expect.objectContaining({
          limit: 5,
          endpoint: 'getRecentProjects',
        })
      )
      expect(result).toEqual([])
    })
  })

  describe('getProjectsByStatus', () => {
    it('should return projects by status with total count', async () => {
      const mockProjects = [
        { id: 'proj1', title: 'Active Project 1', status: 'active' },
        { id: 'proj2', title: 'Active Project 2', status: 'active' },
      ]
      const mockCount = 5

      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === 'projects') {
            return {
              select: vi.fn(() => ({
                eq: vi.fn(() => ({
                  is: vi.fn(() => ({
                    order: vi.fn(() => ({
                      range: vi.fn(() => Promise.resolve({ data: mockProjects, error: null }))
                    }))
                  }))
                })),
                count: vi.fn(() => Promise.resolve({ count: mockCount, error: null }))
              }))
            }
          }
        })
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getProjectsByStatus('active', 10, 0)

      expect(createClient).toHaveBeenCalled()
      expect(result).toEqual({
        projects: mockProjects,
        total: mockCount,
      })
    })
  })

  describe('getProjectStatsByCategory', () => {
    it('should return project statistics by category', async () => {
      const mockStats = [
        { total_projects: 10, total_funded: 50000, avg_funded_percentage: 75 }
      ]

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              is: vi.fn(() => Promise.resolve({ data: mockStats, error: null }))
            }))
          }))
        }))
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getProjectStatsByCategory('film')

      expect(createClient).toHaveBeenCalled()
      expect(result).toEqual({
        totalProjects: 10,
        totalFunded: 50000,
        avgFundedPercentage: 75,
      })
    })

    it('should return default stats when no data exists', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              is: vi.fn(() => Promise.resolve({ data: [], error: null }))
            }))
          }))
        }))
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getProjectStatsByCategory('nonexistent')

      expect(result).toEqual({
        totalProjects: 0,
        totalFunded: 0,
        avgFundedPercentage: 0,
      })
    })
  })
})