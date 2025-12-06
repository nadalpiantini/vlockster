import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getProfileById, getProfilesByIds, getProfileBySlug, getCreatorStats } from '@/lib/utils/db-queries'
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
}

describe('db-queries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getProfileById', () => {
    it('should return profile data when user exists', async () => {
      const mockProfile = {
        id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
        avatar_url: 'https://example.com/avatar.jpg',
        bio: 'A test user',
        role: 'user',
        is_premium_creator: false,
        public_profile_slug: 'johndoe',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      }

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ data: mockProfile, error: null }))
            }))
          }))
        }))
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getProfileById('user123')

      expect(createClient).toHaveBeenCalled()
      expect(result).toEqual(mockProfile)
    })

    it('should return null when user does not exist', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ data: null, error: { message: 'User not found' } }))
            }))
          }))
        }))
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getProfileById('nonexistent')

      expect(logger.error).toHaveBeenCalled()
      expect(result).toBeNull()
    })

    it('should return null when an error occurs', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => Promise.reject(new Error('Network error')))
            }))
          }))
        }))
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getProfileById('erroruser')

      expect(logger.error).toHaveBeenCalled()
      expect(result).toBeNull()
    })
  })

  describe('getProfilesByIds', () => {
    it('should return multiple profiles when users exist', async () => {
      const mockProfiles = [
        { id: 'user1', name: 'User One', email: 'user1@example.com', avatar_url: null, bio: null, role: 'user', is_premium_creator: false, public_profile_slug: null, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
        { id: 'user2', name: 'User Two', email: 'user2@example.com', avatar_url: null, bio: null, role: 'user', is_premium_creator: false, public_profile_slug: null, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
      ]

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            in: vi.fn(() => Promise.resolve({ data: mockProfiles, error: null }))
          }))
        }))
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getProfilesByIds(['user1', 'user2'])

      expect(createClient).toHaveBeenCalled()
      expect(result).toEqual(mockProfiles)
    })
  })

  describe('getProfileBySlug', () => {
    it('should return profile when found by slug', async () => {
      const mockProfile = {
        id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
        avatar_url: 'https://example.com/avatar.jpg',
        bio: 'A test user',
        role: 'user',
        is_premium_creator: false,
        public_profile_slug: 'johndoe',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      }

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ data: mockProfile, error: null }))
            }))
          }))
        }))
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getProfileBySlug('johndoe')

      expect(result).toEqual(mockProfile)
    })
  })

  describe('getCreatorStats', () => {
    it('should return creator statistics when data exists', async () => {
      const mockProjects = [
        { id: 'project1', backers_count: 10, funded_amount: 1000 },
        { id: 'project2', backers_count: 5, funded_amount: 500 },
      ]

      // Crear un supabase mock que maneje operaciones de count y select de forma diferente
      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === 'projects') {
            // Para la operación de count
            return {
              select: vi.fn((_, options) => {
                if (options && options.count === 'exact') {
                  // Simular la operación de count
                  return Promise.resolve({ count: 2, error: null })
                }
                // Para la operación normal de select
                return {
                  eq: vi.fn(() => Promise.resolve({ data: mockProjects, error: null }))
                }
              }),
              eq: vi.fn(() => ({
                single: vi.fn(() => Promise.resolve({ data: null, error: null }))
              }))
            }
          }
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn(() => Promise.resolve({ data: null, error: null }))
              }))
            }))
          }
        })
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getCreatorStats('creator123')

      expect(result).toEqual({
        projectsCount: 2,
        backersCount: 15,
        totalFunded: 1500,
      })
    })
  })
})