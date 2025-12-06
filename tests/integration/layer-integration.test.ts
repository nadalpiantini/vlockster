import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getProfileById } from '@/lib/utils/db-queries'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'
import { NextRequest } from 'next/server'

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

describe('Integración de Capas - Primer Mini Sprint', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debería integrar correctamente la capa de base de datos con la lógica de negocio', async () => {
    // Mock de un perfil de usuario realista
    const mockProfile = {
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      avatar_url: 'https://example.com/avatar.jpg',
      bio: 'Test bio',
      role: 'creator',
      is_premium_creator: true,
      public_profile_slug: 'testuser',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    }

    // Mock de Supabase
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

    // Ejecutar la función de la capa de base de datos
    const profile = await getProfileById('user123')

    // Verificar que la base de datos devuelve la información correcta
    expect(profile).toEqual(mockProfile)
    expect(createClient).toHaveBeenCalled()
    
    // Verificar que los datos tienen el formato esperado por la capa de negocio
    expect(profile).toHaveProperty('id')
    expect(profile).toHaveProperty('name')
    expect(profile).toHaveProperty('email')
    expect(profile).toHaveProperty('role')
  })

  it('debería integrar correctamente el logging estructurado con las operaciones de base de datos', async () => {
    const mockError = { message: 'User not found' }
    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: null, error: mockError }))
          }))
        }))
      }))
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    // Ejecutar la función que debería generar un log de error
    const result = await getProfileById('nonexistent-user')

    // Verificar que no devuelve datos
    expect(result).toBeNull()
    
    // Verificar que se llamó al logger para manejar el error
    expect(logger.error).toHaveBeenCalledWith(
      'Error al obtener perfil de usuario',
      mockError,
      expect.objectContaining({
        userId: 'nonexistent-user',
        endpoint: 'getProfileById',
      })
    )
  })

  it('debería seguir la tipificación correcta de la base de datos generada', async () => {
    const mockProfile = {
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      avatar_url: 'https://example.com/avatar.jpg',
      bio: 'Test bio',
      role: 'creator',
      is_premium_creator: true,
      public_profile_slug: 'testuser',
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

    // Verificar que los tipos de datos coinciden con los generados por Supabase
    const profile = await getProfileById('user123')
    
    // Verificar que todos los campos esperados están presentes
    expect(profile?.id).toBe(mockProfile.id)
    expect(profile?.name).toBe(mockProfile.name)
    expect(profile?.email).toBe(mockProfile.email)
    expect(profile?.role).toBe(mockProfile.role)
    expect(profile?.is_premium_creator).toBe(mockProfile.is_premium_creator)
  })

  it('debería integrar logging y manejo de errores de forma coordinada', async () => {
    const error = new Error('Network error')
    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.reject(error))
          }))
        }))
      }))
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    // Ejecutar la función que debería manejar el error
    const result = await getProfileById('error-user')

    // Verificar que devuelve null cuando hay un error
    expect(result).toBeNull()
    
    // Verificar que se llama al logger para manejar el error inesperado
    expect(logger.error).toHaveBeenCalledWith(
      'Error inesperado al obtener perfil de usuario',
      error,
      expect.objectContaining({
        userId: 'error-user',
        endpoint: 'getProfileById',
      })
    )
  })
})