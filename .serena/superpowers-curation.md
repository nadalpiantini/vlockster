# Superpowers Curation - Primer Mini Sprint

## Mejoras Aplicadas

### 1. Frontend - Optimización de Tipos de Supabase
- **Mejora aplicada**: Validación adicional de los tipos generados
- **Detalle**: Se verificó que la regeneración de tipos esté alineada con el esquema actual de la base de datos
- **Resultado**: Mayor seguridad de tipos en todas las operaciones de base de datos

### 2. Backend - Refinamiento del Logging Estructurado
- **Mejora aplicada**: Adición de contexto adicional a los logs existentes
- **Detalle**: Se añadieron campos de contexto como `postId`, `profileSlug`, etc., para mejor trazabilidad
- **Resultado**: Logs más ricos en información para debugging y monitoreo

### 3. Database - Optimización de Consultas Avanzadas
- **Mejora aplicada**: Adición de funciones de utilidad adicionales
- **Detalle**: Se han mejorado las funciones existentes y se han añadido nuevas funciones para consultas comunes

## Código Mejorado: `lib/utils/db-queries.ts`

```typescript
/**
 * Utilidades para consultas optimizadas a la base de datos
 * Implementa optimizaciones de queries y acceso eficiente a datos comunes
 */

import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'
import type { Database } from '@/types/database.types'

type ProfileRow = Database['public']['Tables']['profiles']['Row']

/**
 * Obtiene un perfil de usuario con un query optimizado
 * Incluye manejo de errores y logging estructurado
 */
export async function getProfileById(userId: string): Promise<ProfileRow | null> {
  try {
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

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, avatar_url, bio, role, is_premium_creator, public_profile_slug, created_at, updated_at')
      .in('id', userIds)

    if (error) {
      logger.error('Error al obtener múltiples perfiles de usuarios', error, {
        userIds,
        endpoint: 'getProfilesByIds',
        count: userIds.length,
      })
      return []
    }

    return data || []
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

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, avatar_url, bio, role, is_premium_creator, public_profile_slug, created_at, updated_at')
      .eq('public_profile_slug', slug)
      .single()

    if (error) {
      logger.error('Error al obtener perfil por slug', error, {
        profileSlug: slug,
        endpoint: 'getProfileBySlug',
      })
      return null
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
```

## Resultado de la Aplicación de Superpowers

1. **Mayor robustez**: Validación adicional de parámetros de entrada
2. **Mejor rendimiento**: Consultas optimizadas para datos frecuentes
3. **Mejor trazabilidad**: Logging más detallado con contexto adicional
4. **Más funcionalidades**: Adición de nuevas funciones de utilidad para consultas comunes
5. **Mayor seguridad**: Validación adicional para prevenir errores de parámetros

El output del primer mini sprint ha sido curado y optimizado para tener un mayor impacto técnico y funcional.