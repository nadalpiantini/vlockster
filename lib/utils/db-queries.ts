/**
 * Utilidades para consultas optimizadas e inteligentes a la base de datos
 * Implementa optimizaciones de queries, cache inteligente y acceso eficiente a datos comunes
 */

import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'
import type { Database } from '@/types/database.types'

type ProfileRow = Database['public']['Tables']['profiles']['Row']

// Simple cache en memoria para datos que no cambian frecuentemente
const simpleCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

/**
 * Obtiene un perfil de usuario con un query optimizado y cache opcional
 * Incluye manejo de errores y logging estructurado
 */
export async function getProfileById(userId: string, useCache: boolean = true): Promise<ProfileRow | null> {
  try {
    // Verificar cache si está habilitado
    if (useCache) {
      const cached = simpleCache.get(`profile:${userId}`)
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        logger.info('Perfil obtenido de cache', {
          userId,
          endpoint: 'getProfileById',
        })
        return cached.data
      }
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, avatar_url, bio, role, is_premium_creator, public_profile_slug, created_at, updated_at')
      .eq('id', userId)
      .single()

    if (error) {
      logger.error('Error al obtener perfil de usuario', error, {
        userId,
        endpoint: 'getProfileById',
      })
      return null
    }

    // Guardar en cache si es exitoso
    if (useCache && data) {
      simpleCache.set(`profile:${userId}`, { data, timestamp: Date.now() })
    }

    return data
  } catch (error) {
    logger.error('Error inesperado al obtener perfil de usuario', error, {
      userId,
      endpoint: 'getProfileById',
    })
    return null
  }
}

/**
 * Limpia la cache para un perfil específico
 */
export function clearProfileCache(userId: string): void {
  simpleCache.delete(`profile:${userId}`)
}

/**
 * Limpia toda la cache
 */
export function clearAllCache(): void {
  simpleCache.clear()
}

/**
 * Obtiene múltiples perfiles de usuarios con un query optimizado
 */
export async function getProfilesByIds(userIds: string[]): Promise<ProfileRow[]> {
  try {
    const supabase = await createClient()

    // Validar que no sea un array vacío
    if (!userIds || userIds.length === 0) {
      logger.warn('Intento de obtener perfiles con array vacío', {
        userIds,
        endpoint: 'getProfilesByIds',
      })
      return []
    }

    // Verificar perfiles en cache
    const cachedProfiles: ProfileRow[] = []
    const uncachedIds: string[] = []

    userIds.forEach(id => {
      const cached = simpleCache.get(`profile:${id}`)
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        cachedProfiles.push(cached.data)
      } else {
        uncachedIds.push(id)
      }
    })

    if (uncachedIds.length === 0) {
      logger.info('Todos los perfiles obtenidos de cache', {
        count: userIds.length,
        endpoint: 'getProfilesByIds',
      })
      return cachedProfiles
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, avatar_url, bio, role, is_premium_creator, public_profile_slug, created_at, updated_at')
      .in('id', uncachedIds)

    if (error) {
      logger.error('Error al obtener múltiples perfiles de usuarios', error, {
        userIds,
        endpoint: 'getProfilesByIds',
        count: userIds.length,
      })
      return cachedProfiles
    }

    // Guardar en cache los resultados nuevos
    data?.forEach(profile => {
      simpleCache.set(`profile:${profile.id}`, { data: profile, timestamp: Date.now() })
    })

    return [...cachedProfiles, ...(data || [])]
  } catch (error) {
    logger.error('Error inesperado al obtener múltiples perfiles de usuarios', error, {
      userIds,
      endpoint: 'getProfilesByIds',
      count: userIds.length,
    })
    return []
  }
}

/**
 * Obtiene un perfil de usuario por slug de perfil público
 */
export async function getProfileBySlug(slug: string): Promise<ProfileRow | null> {
  try {
    const supabase = await createClient()

    // Para perfiles por slug, primero necesitamos obtener el ID
    const { data: profileLookup, error: lookupError } = await supabase
      .from('profiles')
      .select('id')
      .eq('public_profile_slug', slug)
      .single()

    if (lookupError || !profileLookup?.id) {
      logger.error('Error al buscar perfil por slug', lookupError, {
        profileSlug: slug,
        endpoint: 'getProfileBySlug',
      })
      return null
    }

    const userId = profileLookup.id

    // Verificar cache si está habilitado
    const cached = simpleCache.get(`profile:${userId}`)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      logger.info('Perfil por slug obtenido de cache', {
        userId,
        profileSlug: slug,
        endpoint: 'getProfileBySlug',
      })
      return cached.data
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, avatar_url, bio, role, is_premium_creator, public_profile_slug, created_at, updated_at')
      .eq('id', userId)
      .single()

    if (error) {
      logger.error('Error al obtener perfil por slug', error, {
        profileSlug: slug,
        userId,
        endpoint: 'getProfileBySlug',
      })
      return null
    }

    // Guardar en cache
    if (data) {
      simpleCache.set(`profile:${data.id}`, { data, timestamp: Date.now() })
    }

    return data
  } catch (error) {
    logger.error('Error inesperado al obtener perfil por slug', error, {
      profileSlug: slug,
      endpoint: 'getProfileBySlug',
    })
    return null
  }
}

/**
 * Obtiene estadísticas de un creador para optimizar consultas frecuentes
 */
export async function getCreatorStats(creatorId: string): Promise<{
  projectsCount: number
  backersCount: number
  totalFunded: number
} | null> {
  try {
    const supabase = await createClient()

    // Primero obtener conteo de proyectos
    const { count: projectsCount, error: projectsError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', creatorId)

    if (projectsError) {
      logger.error('Error al obtener conteo de proyectos del creador', projectsError, {
        creatorId,
        endpoint: 'getCreatorStats',
      })
      return null
    }

    // Obtener métricas de backers y fondos desde los proyectos
    const { data: projectsData, error: projectsDataError } = await supabase
      .from('projects')
      .select('id, backers_count, funded_amount')
      .eq('creator_id', creatorId)

    if (projectsDataError) {
      logger.error('Error al obtener datos de proyectos del creador', projectsDataError, {
        creatorId,
        endpoint: 'getCreatorStats',
      })
      return null
    }

    const backersCount = projectsData?.reduce((sum, project) => sum + (project.backers_count || 0), 0) || 0
    const totalFunded = projectsData?.reduce((sum, project) => sum + (project.funded_amount || 0), 0) || 0

    return {
      projectsCount: projectsCount || 0,
      backersCount,
      totalFunded,
    }
  } catch (error) {
    logger.error('Error inesperado al obtener estadísticas del creador', error, {
      creatorId,
      endpoint: 'getCreatorStats',
    })
    return null
  }
}

/**
 * Obtiene proyectos de un usuario creador con métricas optimizadas
 */
export async function getCreatorProjects(creatorId: string, limit: number = 10, offset: number = 0): Promise<{
  projects: Database['public']['Tables']['projects']['Row'][],
  total: number
} | null> {
  try {
    const supabase = await createClient()

    // Contar total de proyectos
    const { count: totalCount, error: countError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', creatorId)

    if (countError) {
      logger.error('Error al contar proyectos del creador', countError, {
        creatorId,
        limit,
        offset,
        endpoint: 'getCreatorProjects',
      })
      return null
    }

    // Obtener proyectos con límite y offset
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (projectsError) {
      logger.error('Error al obtener proyectos del creador', projectsError, {
        creatorId,
        limit,
        offset,
        endpoint: 'getCreatorProjects',
      })
      return null
    }

    return {
      projects: projects || [],
      total: totalCount || 0,
    }
  } catch (error) {
    logger.error('Error inesperado al obtener proyectos del creador', error, {
      creatorId,
      limit,
      offset,
      endpoint: 'getCreatorProjects',
    })
    return null
  }
}

/**
 * Obtiene los proyectos más populares
 */
export async function getPopularProjects(limit: number = 10): Promise<Database['public']['Tables']['projects']['Row'][]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .is('deleted_at', null) // Excluir proyectos eliminados
      .order('backers_count', { ascending: false })
      .limit(limit)

    if (error) {
      logger.error('Error al obtener proyectos populares', error, {
        limit,
        endpoint: 'getPopularProjects',
      })
      return []
    }

    return data || []
  } catch (error) {
    logger.error('Error inesperado al obtener proyectos populares', error, {
      limit,
      endpoint: 'getPopularProjects',
    })
    return []
  }
}

/**
 * Obtiene proyectos de una categoría específica con optimización de queries
 */
export async function getProjectsByCategory(category: string, limit: number = 10, offset: number = 0): Promise<{
  projects: Database['public']['Tables']['projects']['Row'][],
  total: number
} | null> {
  try {
    const supabase = await createClient()

    // Contar total de proyectos en la categoría
    const { count: totalCount, error: countError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('category', category)
      .is('deleted_at', null)

    if (countError) {
      logger.error('Error al contar proyectos por categoría', countError, {
        category,
        limit,
        offset,
        endpoint: 'getProjectsByCategory',
      })
      return null
    }

    // Obtener los proyectos con límites
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('category', category)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (projectsError) {
      logger.error('Error al obtener proyectos por categoría', projectsError, {
        category,
        limit,
        offset,
        endpoint: 'getProjectsByCategory',
      })
      return null
    }

    return {
      projects: projects || [],
      total: totalCount || 0,
    }
  } catch (error) {
    logger.error('Error inesperado al obtener proyectos por categoría', error, {
      category,
      limit,
      offset,
      endpoint: 'getProjectsByCategory',
    })
    return null
  }
}

/**
 * Obtiene proyectos recientes con optimización de queries
 */
export async function getRecentProjects(limit: number = 10): Promise<Database['public']['Tables']['projects']['Row'][]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('projects')
      .select(`
        id,
        title,
        description,
        goal_amount,
        funded_amount,
        backers_count,
        deadline,
        status,
        created_at,
        creator_id,
        category,
        video_id,
        thumbnail_url
      `)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      logger.error('Error al obtener proyectos recientes', error, {
        limit,
        endpoint: 'getRecentProjects',
      })
      return []
    }

    return data || []
  } catch (error) {
    logger.error('Error inesperado al obtener proyectos recientes', error, {
      limit,
      endpoint: 'getRecentProjects',
    })
    return []
  }
}

/**
 * Obtiene proyectos por estado con conteo optimizado
 */
export async function getProjectsByStatus(status: string, limit: number = 10, offset: number = 0): Promise<{
  projects: Database['public']['Tables']['projects']['Row'][],
  total: number
} | null> {
  try {
    const supabase = await createClient()

    // Contar total de proyectos con el estado
    const { count: totalCount, error: countError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('status', status)
      .is('deleted_at', null)

    if (countError) {
      logger.error('Error al contar proyectos por estado', countError, {
        status,
        limit,
        offset,
        endpoint: 'getProjectsByStatus',
      })
      return null
    }

    // Obtener los proyectos con límites
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('status', status)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (projectsError) {
      logger.error('Error al obtener proyectos por estado', projectsError, {
        status,
        limit,
        offset,
        endpoint: 'getProjectsByStatus',
      })
      return null
    }

    return {
      projects: projects || [],
      total: totalCount || 0,
    }
  } catch (error) {
    logger.error('Error inesperado al obtener proyectos por estado', error, {
      status,
      limit,
      offset,
      endpoint: 'getProjectsByStatus',
    })
    return null
  }
}

/**
 * Obtiene estadísticas de proyectos por categoría de forma optimizada
 */
export async function getProjectStatsByCategory(category: string): Promise<{
  totalProjects: number
  totalFunded: number
  avgFundedPercentage: number
} | null> {
  try {
    const supabase = await createClient()

    // Obtener estadísticas agregadas
    const { data, error } = await supabase
      .from('projects')
      .select(`
        count(*) as total_projects,
        sum(funded_amount) as total_funded,
        avg((funded_amount / goal_amount) * 100) as avg_funded_percentage
      `)
      .eq('category', category)
      .is('deleted_at', null)

    if (error) {
      logger.error('Error al obtener estadísticas de proyectos por categoría', error, {
        category,
        endpoint: 'getProjectStatsByCategory',
      })
      return null
    }

    if (!data || data.length === 0) {
      return {
        totalProjects: 0,
        totalFunded: 0,
        avgFundedPercentage: 0,
      }
    }

    return {
      totalProjects: data[0].total_projects || 0,
      totalFunded: data[0].total_funded || 0,
      avgFundedPercentage: data[0].avg_funded_percentage || 0,
    }
  } catch (error) {
    logger.error('Error inesperado al obtener estadísticas de proyectos por categoría', error, {
      category,
      endpoint: 'getProjectStatsByCategory',
    })
    return null
  }
}

// Re-exportar las funciones de performance para tenerlas en un solo lugar
export {
  getPerformanceMetrics,
  getUsageMetrics,
  getBundleOptimizationData
} from './performance-queries'