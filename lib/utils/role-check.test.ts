import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase server client antes de importar el módulo
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`Redirect to ${path}`)
  }),
}))

// Importar después de mockear
import { getCurrentUser, requireAuth } from './role-check'
import { createClient } from '@/lib/supabase/server'

describe('role-check', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCurrentUser', () => {
    it('debe retornar null cuando DISABLE_AUTH está activo', async () => {
      // Cuando DISABLE_AUTH = true (constante en el código),
      // getCurrentUser retorna null directamente sin llamar a Supabase
      // Como DISABLE_AUTH = false en el código actual, este test verifica
      // el comportamiento cuando se llama a Supabase sin usuario
      
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ 
            data: { user: null }, 
            error: null 
          }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn(),
            }),
          }),
        }),
      }
      
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
      
      const user = await getCurrentUser()
      
      // Debe retornar null cuando no hay usuario
      expect(user).toBeNull()
    })

    it('debe retornar perfil cuando hay usuario autenticado', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      }
      
      const mockProfile = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        bio: null,
        avatar_url: null,
        role: 'viewer',
        role_scope: null,
        is_premium_creator: false,
        public_profile_slug: null,
        preferred_lang: 'es',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ 
            data: { user: mockUser }, 
            error: null 
          }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
            }),
          }),
        }),
      }
      
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
      
      const user = await getCurrentUser()
      
      expect(user).toBeDefined()
      expect(user?.id).toBe('user-123')
      expect(user?.email).toBe('test@example.com')
    })
  })

  describe('requireAuth', () => {
    it('debe lanzar error de redirect cuando no hay usuario y DISABLE_AUTH está desactivado', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ 
            data: { user: null }, 
            error: null 
          }),
        },
        from: vi.fn(),
      }
      
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
      
      // requireAuth debe intentar redirect cuando no hay usuario
      // y DISABLE_AUTH = false
      await expect(requireAuth()).rejects.toThrow('Redirect to /login')
    })
  })
})
