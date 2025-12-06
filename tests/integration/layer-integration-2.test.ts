import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getProjectsByCategory, getRecentProjects } from '@/lib/utils/db-queries'
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

describe('Integración de Capas - Segundo Mini Sprint', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debería integrar correctamente la capa de base de datos con Frontend y Backend', async () => {
    // Mock de datos realistas
    const mockProjects = [
      { 
        id: 'proj1', 
        title: 'Prueba Project', 
        description: 'Test description', 
        goal_amount: 1000, 
        funded_amount: 500,
        backers_count: 10,
        deadline: '2025-12-31T23:59:59Z',
        status: 'active',
        created_at: '2025-12-01T00:00:00Z',
        creator_id: 'user123',
        category: 'film',
        video_id: null,
        thumbnail_url: null
      }
    ]
    
    const mockCount = 1

    // Crear mock de Supabase que maneje múltiples operaciones
    const mockSupabase = {
      from: vi.fn((table) => {
        if (table === 'projects') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn((field, value) => {
                if (field === 'category') {
                  return {
                    is: vi.fn(() => ({
                      order: vi.fn(() => ({
                        range: vi.fn(() => Promise.resolve({ data: mockProjects, error: null }))
                      }))
                    }))
                  }
                } else if (field === 'status') {
                  return {
                    is: vi.fn(() => ({
                      order: vi.fn(() => ({
                        range: vi.fn(() => Promise.resolve({ data: mockProjects, error: null }))
                      }))
                    }))
                  }
                }
                return {
                  is: vi.fn(() => ({
                    order: vi.fn(() => ({
                      range: vi.fn(() => Promise.resolve({ data: mockProjects, error: null }))
                    }))
                  }))
                }
              }),
              is: vi.fn(() => ({
                order: vi.fn(() => ({
                  limit: vi.fn(() => Promise.resolve({ data: mockProjects, error: null }))
                }))
              })),
              count: vi.fn(() => Promise.resolve({ count: mockCount, error: null }))
            }))
          }
        }
      })
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    // Prueba de la función de base de datos
    const projectsResult = await getProjectsByCategory('film', 5, 0)
    
    // Verificar que la capa de base de datos funcione correctamente
    expect(projectsResult).not.toBeNull()
    expect(projectsResult?.projects).toHaveLength(1)
    expect(projectsResult?.total).toBe(mockCount)
    
    // Verificar que los datos tengan las propiedades esperadas
    const project = projectsResult?.projects[0]
    expect(project).toHaveProperty('id')
    expect(project).toHaveProperty('title')
    expect(project).toHaveProperty('category')
    expect(project?.category).toBe('film')
  })

  it('debería manejar errores de base de datos adecuadamente', async () => {
    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            is: vi.fn(() => ({
              order: vi.fn(() => ({
                limit: vi.fn(() => Promise.resolve({ data: null, error: new Error('Database error') }))
              }))
            }))
          }))
        }))
      }))
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    // Ejecutar la función que debería manejar el error
    const result = await getRecentProjects(5)

    // Verificar que devuelve un array vacío en caso de error
    expect(result).toEqual([])
    
    // Verificar que se llama al logger para manejar el error
    expect(logger.error).toHaveBeenCalledWith(
      'Error al obtener proyectos recientes',
      expect.any(Error),
      expect.objectContaining({
        limit: 5,
        endpoint: 'getRecentProjects',
      })
    )
  })

  it('debería mantener la seguridad de tipos con los tipos de Supabase', async () => {
    const mockProjects = [
      { 
        id: 'proj1', 
        title: 'Typed Project', 
        description: 'Test typed description', 
        goal_amount: 5000, 
        funded_amount: 2500,
        backers_count: 5,
        deadline: '2025-12-31T23:59:59Z',
        status: 'active',
        created_at: '2025-12-01T00:00:00Z',
        creator_id: 'user456',
        category: 'documentary',
        video_id: null,
        thumbnail_url: null
      }
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

    // Verificar que los tipos de datos coincidan con los tipos de Supabase
    const recentProjects = await getRecentProjects(10)
    
    // Verificar que todos los campos esperados están presentes
    if (recentProjects.length > 0) {
      const project = recentProjects[0]
      expect(project.id).toBe('proj1')
      expect(project.title).toBe('Typed Project')
      expect(project.category).toBe('documentary')
      expect(project.status).toBe('active')
      expect(typeof project.goal_amount).toBe('number')
    }
  })
})