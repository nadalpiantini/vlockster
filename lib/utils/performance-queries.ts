/**
 * Utilidades para consultas optimizadas relacionadas con bundle optimization y métricas de uso
 * Implementa optimizaciones de queries para métricas de rendimiento y uso
 */

import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'
import type { Database } from '@/types/database.types'

/**
 * Obtiene métricas de rendimiento de videos
 */
export async function getPerformanceMetrics(): Promise<{
  topVideos: Array<{
    id: string
    title: string
    view_count: number
    avg_watch_time: number
    completion_rate: number
  }>
  topProjects: Array<{
    id: string
    title: string
    backers_count: number
    funded_percentage: number
    engagement_score: number
  }>
} | null> {
  try {
    const supabase = await createClient()

    // Obtener los videos más vistos con métricas de engagement
    const { data: topVideos, error: videosError } = await supabase
      .from('videos')
      .select(`
        id,
        title,
        view_count,
        avg_watch_time,
        completion_rate
      `)
      .eq('visibility', 'public')
      .order('view_count', { ascending: false })
      .limit(10)

    if (videosError) {
      logger.error('Error al obtener métricas de videos', videosError, {
        endpoint: 'getPerformanceMetrics',
      })
      return null
    }

    // Obtener los proyectos más populares con métricas de financiación
    const { data: topProjects, error: projectsError } = await supabase
      .from('projects')
      .select(`
        id,
        title,
        backers_count,
        goal_amount,
        current_amount,
        created_at
      `)
      .eq('status', 'active')
      .order('backers_count', { ascending: false })
      .limit(10)

    if (projectsError) {
      logger.error('Error al obtener métricas de proyectos', projectsError, {
        endpoint: 'getPerformanceMetrics',
      })
      return null
    }

    // Calcular el porcentaje de financiación y puntuación de engagement
    const projectsWithPercentageAndEngagement = topProjects?.map((project: Database['public']['Tables']['projects']['Row']) => {
      const fundedPercentage = project.goal_amount ? (project.current_amount! / project.goal_amount) * 100 : 0
      // Calcular engagement score basado en backers_count y tiempo restante
      const createdDate = project.created_at ? new Date(project.created_at) : new Date() // Usar fecha actual si no hay created_at
      const now = new Date()
      const daysSinceCreation = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
      // Engagement score: backers_count normalizado por tiempo
      const engagementScore = daysSinceCreation > 0 ?
        (project.backers_count || 0) / daysSinceCreation :
        (project.backers_count || 0)

      return {
        id: project.id,
        title: project.title,
        backers_count: project.backers_count,
        funded_percentage: fundedPercentage,
        engagement_score: engagementScore
      }
    }) || []

    return {
      topVideos: topVideos || [],
      topProjects: projectsWithPercentageAndEngagement
    }
  } catch (error) {
    logger.error('Error inesperado al obtener métricas de rendimiento', error, {
      endpoint: 'getPerformanceMetrics',
    })
    return null
  }
}

/**
 * Obtiene métricas de uso para optimización de bundles
 */
export async function getUsageMetrics(): Promise<{
  dailyActiveUsers: number
  weeklyActiveUsers: number
  monthlyActiveUsers: number
  userGrowthRate: number
  mostPopularFeatures: Array<{
    feature: string
    usage_count: number
    growth_rate: number
  }>
  peakUsageHours: Array<{
    hour: number
    usage_count: number
    relative_percentage: number
  }>
  sessionMetrics: {
    avg_session_duration: number
    pages_per_session: number
    bounce_rate: number
  }
} | null> {
  try {
    const supabase = await createClient()

    // Calcular fechas para diferentes periodos
    const today = new Date()
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(today.getDate() - 7)
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(today.getDate() - 14)
    const oneMonthAgo = new Date()
    oneMonthAgo.setDate(today.getDate() - 30)
    const twoMonthsAgo = new Date()
    twoMonthsAgo.setDate(today.getDate() - 60)

    // Contar usuarios activos (usando una estimación temporal ya que no hay tabla user_sessions en el esquema actual)
    // NOTA: En una implementación real, se usaría una tabla específica como vlockster_user_sessions
    const dailyActiveUsers = 100; // Valor simulado
    const weeklyActiveUsers = 500; // Valor simulado
    const monthlyActiveUsers = 1500; // Valor simulado
    const prevWeekUsers = 450; // Valor simulado
    const prevWeekCount = prevWeekUsers || 1 // Para evitar división por cero
    const currentWeekCount = weeklyActiveUsers || 0
    const userGrowthRate = prevWeekCount > 0 ? ((currentWeekCount - prevWeekCount) / prevWeekCount) * 100 : 0

    // Obtener características más populares (usando valores simulados temporalmente)
    // NOTA: En una implementación real, se usaría una tabla específica como vlockster_feature_usage
    const featuresWithGrowth = [
      { feature: "projects.create", usage_count: 120, growth_rate: 15 },
      { feature: "projects.browse", usage_count: 350, growth_rate: 8 },
      { feature: "watch.video", usage_count: 420, growth_rate: 5 },
      { feature: "community.posts", usage_count: 180, growth_rate: 22 },
      { feature: "profile.setup", usage_count: 95, growth_rate: -2 }
    ]

    // Obtener horas pico de uso (usando valores simulados temporalmente)
    // NOTA: En una implementación real, se usaría una tabla específica como vlockster_user_sessions
    const peakHoursWithPercentage = [
      { hour: 14, usage_count: 120, relative_percentage: 25 },
      { hour: 16, usage_count: 110, relative_percentage: 23 },
      { hour: 19, usage_count: 105, relative_percentage: 22 },
      { hour: 20, usage_count: 85, relative_percentage: 18 },
      { hour: 21, usage_count: 60, relative_percentage: 12 }
    ]

    // Obtener métricas de sesión
    const avgSessionDuration = 300; // Valor simulado (5 minutos)
    const pagesPerSession = 3; // Valor simulado

    // Calcular tasa de rebote (valores simulados)
    const totalSess = 1500; // Valor simulado
    const singleSess = 525; // Valor simulado (35% de rebote)
    const bounceRate = totalSess > 0 ? (singleSess / totalSess) * 100 : 35

    return {
      dailyActiveUsers: dailyActiveUsers || 0,
      weeklyActiveUsers: weeklyActiveUsers || 0,
      monthlyActiveUsers: monthlyActiveUsers || 0,
      userGrowthRate,
      mostPopularFeatures: featuresWithGrowth,
      peakUsageHours: peakHoursWithPercentage,
      sessionMetrics: {
        avg_session_duration: avgSessionDuration,
        pages_per_session: pagesPerSession,
        bounce_rate: bounceRate
      }
    }
  } catch (error) {
    logger.error('Error inesperado al obtener métricas de uso', error, {
      endpoint: 'getUsageMetrics',
    })
    return null
  }
}

/**
 * Obtiene datos para análisis de bundle optimization
 */
export async function getBundleOptimizationData(): Promise<{
  popularContent: {
    videos: Database['public']['Tables']['videos']['Row'][]
    projects: Database['public']['Tables']['projects']['Row'][]
    categories: Array<{
      name: string
      count: number
      avg_engagement: number
    }>
  }
  userEngagement: {
    avgSessionDuration: number
    pageViewsPerSession: number
    bounceRate: number
    retentionMetrics: {
      day1: number
      day7: number
      day30: number
    }
  }
  optimizationRecommendations: Array<{
    type: 'preload' | 'lazyload' | 'split'
    resource: string
    priority: 'high' | 'medium' | 'low'
    impact: number // 0-100
    confidence: number // 0-100
  }>
} | null> {
  try {
    const supabase = await createClient()

    // Obtener contenido más popular para pre-carga
    const { data: popularVideos, error: videosError } = await supabase
      .from('videos')
      .select('*')
      .eq('visibility', 'public')
      .order('view_count', { ascending: false })
      .limit(20)

    if (videosError) {
      logger.error('Error al obtener videos populares', videosError, {
        endpoint: 'getBundleOptimizationData',
      })
      return null
    }

    const { data: popularProjects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'active')
      .order('backers_count', { ascending: false })
      .limit(20)

    if (projectsError) {
      logger.error('Error al obtener proyectos populares', projectsError, {
        endpoint: 'getBundleOptimizationData',
      })
      return null
    }

    // Obtener categorías con métricas de engagement
    const { data: videoCategories, error: videoCatError } = await supabase
      .from('videos')
      .select(`
        category,
        count(*) as count,
        avg(avg_watch_time) as avg_engagement
      `)
      .eq('visibility', 'public')
      .group('category')
      .order('count', { ascending: false })

    if (videoCatError) {
      logger.error('Error al obtener categorías de videos', videoCatError, {
        endpoint: 'getBundleOptimizationData',
      })
      return null
    }

    const { data: projectCategories, error: projectCatError } = await supabase
      .from('projects')
      .select(`
        category,
        count(*) as count,
        avg(backers_count) as avg_engagement
      `)
      .eq('status', 'active')
      .group('category')
      .order('count', { ascending: false })

    if (projectCatError) {
      logger.error('Error al obtener categorías de proyectos', projectCatError, {
        endpoint: 'getBundleOptimizationData',
      })
      return null
    }

    // Combinar categorías de videos y proyectos
    const allCategoriesMap = new Map<string, { count: number; avg_engagement: number }>()

    videoCategories?.forEach((cat: { category: string | null; count: string; avg_engagement: string }) => {
      if (cat.category) {
        allCategoriesMap.set(cat.category, {
          count: parseInt(cat.count),
          avg_engagement: parseFloat(cat.avg_engagement) || 0
        })
      }
    })

    projectCategories?.forEach((cat: { category: string | null; count: string; avg_engagement: string }) => {
      if (cat.category) {
        const existing = allCategoriesMap.get(cat.category) || { count: 0, avg_engagement: 0 }
        allCategoriesMap.set(cat.category, {
          count: existing.count + parseInt(cat.count),
          avg_engagement: existing.avg_engagement + (parseFloat(cat.avg_engagement) || 0)
        })
      }
    })

    const allCategories = Array.from(allCategoriesMap, ([name, data]) => ({
      name,
      count: data.count,
      avg_engagement: data.avg_engagement
    }))

    // Obtener métricas de engagement y retención del usuario
    const { data: engagementData, error: engagementError } = await supabase
      .from('video_metrics')
      .select(`
        avg(watched_seconds) as avg_watch_time,
        count(*) as total_views
      `)
      .gt('watched_seconds', 0)

    if (engagementError) {
      logger.error('Error al obtener datos de engagement', engagementError, {
        endpoint: 'getBundleOptimizationData',
      })
      return null
    }

    const avgWatchTime = engagementData?.[0]?.avg_watch_time || 0
    const retentionMetrics = {
      day1: 45, // Porcentaje de usuarios que regresan al día 1
      day7: 25, // Porcentaje de usuarios que regresan al día 7
      day30: 10 // Porcentaje de usuarios que regresan al día 30
    }

    // Generar recomendaciones de optimización basadas en datos
    const recommendations: Array<{
      type: 'preload' | 'lazyload' | 'split'
      resource: string
      priority: 'high' | 'medium' | 'low'
      impact: number
      confidence: number
    }> = []

    // Si hay videos con alta visualización, recomendar precarga
    if (popularVideos && popularVideos.length > 0) {
      const topVideo = popularVideos[0]
      if (topVideo && topVideo.view_count && topVideo.view_count > 1000) {
        recommendations.push({
          type: 'preload',
          resource: `video-${topVideo.id}`,
          priority: 'high',
          impact: 85,
          confidence: 90
        })
      }
    }

    // Si hay proyectos con muchos backers, recomendar precarga
    if (popularProjects && popularProjects.length > 0) {
      const topProject = popularProjects[0]
      if (topProject && topProject.backers_count && topProject.backers_count > 50) {
        recommendations.push({
          type: 'preload',
          resource: `project-${topProject.id}`,
          priority: 'high',
          impact: 75,
          confidence: 85
        })
      }
    }

    // Recomendar lazy loading para recursos menos populares
    recommendations.push({
      type: 'lazyload',
      resource: 'low-traffic-videos',
      priority: 'medium',
      impact: 60,
      confidence: 80
    })

    // Recomendar bundle splitting para categorías populares
    if (allCategories.length > 0) {
      const topCategory = allCategories.reduce((top, cat) => cat.count > top.count ? cat : top, allCategories[0])
      recommendations.push({
        type: 'split',
        resource: `category-${topCategory.name}`,
        priority: 'medium',
        impact: 70,
        confidence: 75
      })
    }

    return {
      popularContent: {
        videos: popularVideos || [],
        projects: popularProjects || [],
        categories: allCategories
      },
      userEngagement: {
        avgSessionDuration: avgWatchTime,
        pageViewsPerSession: 3, // Valor simulado para ejemplo
        bounceRate: 0.35, // Valor simulado para ejemplo (35%)
        retentionMetrics
      },
      optimizationRecommendations: recommendations
    }
  } catch (error) {
    logger.error('Error inesperado al obtener datos para optimización de bundle', error, {
      endpoint: 'getBundleOptimizationData',
    })
    return null
  }
}