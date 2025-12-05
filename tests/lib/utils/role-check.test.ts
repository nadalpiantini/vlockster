import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createClient } from '@/lib/supabase/server'

// Mock Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`Redirect to ${path}`)
  }),
}))

describe('role-check utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCurrentUser', () => {
    it('debe retornar null cuando no hay usuario autenticado', async () => {
      const { getCurrentUser } = await import('@/lib/utils/role-check')
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
          }),
        },
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const user = await getCurrentUser()
      expect(user).toBeNull()
    })

    it('debe retornar perfil cuando hay usuario autenticado', async () => {
      const { getCurrentUser } = await import('@/lib/utils/role-check')
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: {
              user: {
                id: 'user-123',
                email: 'test@example.com',
              },
            },
          }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 'user-123',
                  role: 'viewer',
                  email: 'test@example.com',
                },
              }),
            }),
          }),
        }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const user = await getCurrentUser()
      expect(user).toBeDefined()
      expect(user?.id).toBe('user-123')
    })
  })

  describe('requireAuth', () => {
    it('debe retornar usuario cuando está autenticado', async () => {
      const { requireAuth } = await import('@/lib/utils/role-check')
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: {
              user: {
                id: 'user-123',
                email: 'test@example.com',
              },
            },
          }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 'user-123',
                  role: 'viewer',
                  email: 'test@example.com',
                  name: null,
                  bio: null,
                  avatar_url: null,
                  role_scope: null,
                  is_premium_creator: false,
                  public_profile_slug: null,
                  preferred_lang: 'es',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
              }),
            }),
          }),
        }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const user = await requireAuth()
      expect(user).toBeDefined()
      expect(user.id).toBe('user-123')
    })

    it('debe lanzar error cuando no hay usuario y DISABLE_AUTH es false', async () => {
      const { requireAuth } = await import('@/lib/utils/role-check')
      const { redirect } = await import('next/navigation')
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
          }),
        },
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      await expect(requireAuth()).rejects.toThrow()
      expect(redirect).toHaveBeenCalledWith('/login')
    })
  })

  describe('requireRole', () => {
    it('debe retornar usuario cuando tiene rol permitido', async () => {
      const { requireRole } = await import('@/lib/utils/role-check')
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: {
              user: {
                id: 'user-123',
                email: 'test@example.com',
              },
            },
          }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 'user-123',
                  role: 'viewer',
                  email: 'test@example.com',
                  name: null,
                  bio: null,
                  avatar_url: null,
                  role_scope: null,
                  is_premium_creator: false,
                  public_profile_slug: null,
                  preferred_lang: 'es',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
              }),
            }),
          }),
        }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const user = await requireRole(['viewer', 'creator'])
      expect(user).toBeDefined()
      expect(user.role).toBe('viewer')
    })

    it('debe redirigir cuando el rol no está permitido', async () => {
      const { requireRole } = await import('@/lib/utils/role-check')
      const { redirect } = await import('next/navigation')
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: {
              user: {
                id: 'user-123',
                email: 'test@example.com',
              },
            },
          }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 'user-123',
                  role: 'viewer',
                  email: 'test@example.com',
                  name: null,
                  bio: null,
                  avatar_url: null,
                  role_scope: null,
                  is_premium_creator: false,
                  public_profile_slug: null,
                  preferred_lang: 'es',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
              }),
            }),
          }),
        }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      await expect(requireRole(['admin', 'moderator'])).rejects.toThrow()
      expect(redirect).toHaveBeenCalledWith('/dashboard')
    })
  })

  describe('checkIsCreator', () => {
    it('debe retornar false cuando no hay usuario', async () => {
      const { checkIsCreator } = await import('@/lib/utils/role-check')
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
          }),
        },
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await checkIsCreator()
      expect(result).toBe(false)
    })

    it('debe retornar true cuando el usuario es creator', async () => {
      const { checkIsCreator } = await import('@/lib/utils/role-check')
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: {
              user: {
                id: 'user-123',
                email: 'test@example.com',
              },
            },
          }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 'user-123',
                  role: 'creator',
                },
              }),
            }),
          }),
        }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await checkIsCreator()
      expect(result).toBe(true)
    })

    it('debe retornar true cuando el usuario es admin', async () => {
      const { checkIsCreator } = await import('@/lib/utils/role-check')
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: {
              user: {
                id: 'user-123',
                email: 'test@example.com',
              },
            },
          }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 'user-123',
                  role: 'admin',
                },
              }),
            }),
          }),
        }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await checkIsCreator()
      expect(result).toBe(true)
    })

    it('debe retornar false cuando el usuario es viewer', async () => {
      const { checkIsCreator } = await import('@/lib/utils/role-check')
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: {
              user: {
                id: 'user-123',
                email: 'test@example.com',
              },
            },
          }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 'user-123',
                  role: 'viewer',
                },
              }),
            }),
          }),
        }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await checkIsCreator()
      expect(result).toBe(false)
    })
  })

  describe('checkIsAdmin', () => {
    it('debe retornar false cuando no hay usuario', async () => {
      const { checkIsAdmin } = await import('@/lib/utils/role-check')
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
          }),
        },
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await checkIsAdmin()
      expect(result).toBe(false)
    })

    it('debe retornar true cuando el usuario es admin', async () => {
      const { checkIsAdmin } = await import('@/lib/utils/role-check')
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: {
              user: {
                id: 'user-123',
                email: 'test@example.com',
              },
            },
          }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 'user-123',
                  role: 'admin',
                },
              }),
            }),
          }),
        }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await checkIsAdmin()
      expect(result).toBe(true)
    })

    it('debe retornar false cuando el usuario no es admin', async () => {
      const { checkIsAdmin } = await import('@/lib/utils/role-check')
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: {
              user: {
                id: 'user-123',
                email: 'test@example.com',
              },
            },
          }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 'user-123',
                  role: 'viewer',
                },
              }),
            }),
          }),
        }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await checkIsAdmin()
      expect(result).toBe(false)
    })
  })
})

