import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getPerformanceMetrics } from '@/lib/utils/performance-queries'
import { getProfileById } from '@/lib/utils/db-queries'
import { NextRequest } from 'next/server'
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

describe('Integración de Capas - Tercer Mini Sprint', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debería integrar correctamente la capa de base de datos de rendimiento con la lógica de negocio', async () => {
    const mockVideos = [
      { 
        id: 'vid1', 
        title: 'Performance Video', 
        view_count: 1000, 
        avg_watch_time: 120, 
        completion_rate: 0.75 
      }
    ]
    
    const mockProjects = [
      { 
        id: 'proj1', 
        title: 'Performance Project', 
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

    // Ejecutar la función de la capa de base de datos de rendimiento
    const metrics = await getPerformanceMetrics()

    // Verificar que los resultados son correctos
    expect(metrics).not.toBeNull()
    expect(metrics?.topVideos).toHaveLength(1)
    expect(metrics?.topProjects).toHaveLength(1)
    
    // Verificar que los datos tienen las propiedades esperadas
    expect(metrics?.topVideos[0]).toHaveProperty('id')
    expect(metrics?.topVideos[0]).toHaveProperty('title')
    expect(metrics?.topProjects[0]).toHaveProperty('funded_percentage')
  })

  it('debería integrar las funciones de seguridad de tipos con las funciones de base de datos', async () => {
    // Simular datos para la función de perfil
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

    // Ejecutar la función con seguridad de tipos
    const profile = await getProfileById('user123')

    // Verificar que el perfil se obtiene correctamente
    expect(profile).toEqual(mockProfile)
    expect(profile?.role).toBe('creator')
  })

  it('debería mantener consistencia en el manejo de errores entre capas', async () => {
    const mockError = { message: 'Database error' }
    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn(() => Promise.resolve({ data: null, error: mockError }))
            }))
          }))
        }))
      }))
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    // Ejecutar la función que debería manejar el error
    const result = await getPerformanceMetrics()

    // Verificar que devuelve null cuando hay un error
    expect(result).toBeNull()
    
    // Verificar que se llama al logger para manejar el error
    expect(logger.error).toHaveBeenCalledWith(
      'Error al obtener métricas de videos',
      mockError,
      expect.objectContaining({
        endpoint: 'getPerformanceMetrics',
      })
    )
  })
})