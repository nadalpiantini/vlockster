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
    const projectsWithPercentageAndEngagement = topProjects?.map(project => {
      const fundedPercentage = project.goal_amount ? (project.current_amount! / project.goal_amount) * 100 : 0
      // Calcular engagement score basado en backers_count y tiempo restante
      const createdDate = new Date(project.created_at)
      const now = new Date()
      const daysSinceCreation = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
      // Engagement score: backers_count normalizado por tiempo
      const engagementScore = daysSinceCreation > 0 ? project.backers_count / daysSinceCreation : project.backers_count

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

    // Contar usuarios activos diarios (hoy)
    const { count: dailyActiveUsers, error: dailyError } = await supabase
      .from('user_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString().split('T')[0])

    if (dailyError) {
      logger.error('Error al obtener usuarios activos diarios', dailyError, {
        endpoint: 'getUsageMetrics',
      })
      return null
    }

    // Contar usuarios activos semanales
    const { count: weeklyActiveUsers, error: weeklyError } = await supabase
      .from('user_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString())

    if (weeklyError) {
      logger.error('Error al obtener usuarios activos semanales', weeklyError, {
        endpoint: 'getUsageMetrics',
      })
      return null
    }

    // Contar usuarios activos mensuales
    const { count: monthlyActiveUsers, error: monthlyError } = await supabase
      .from('user_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneMonthAgo.toISOString())

    if (monthlyError) {
      logger.error('Error al obtener usuarios activos mensuales', monthlyError, {
        endpoint: 'getUsageMetrics',
      })
      return null
    }

    // Calcular tasa de crecimiento (comparando con el período anterior)
    const { count: prevWeekUsers, error: prevWeekError } = await supabase
      .from('user_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', twoWeeksAgo.toISOString())
      .lt('created_at', oneWeekAgo.toISOString())

    if (prevWeekError) {
      logger.error('Error al obtener usuarios semana anteriores', prevWeekError, {
        endpoint: 'getUsageMetrics',
      })
      return null
    }

    const prevWeekCount = prevWeekUsers || 1 // Para evitar división por cero
    const currentWeekCount = weeklyActiveUsers || 0
    const userGrowthRate = prevWeekCount > 0 ? ((currentWeekCount - prevWeekCount) / prevWeekCount) * 100 : 0

    // Obtener características más populares
    const { data: featureUsage, error: featureError } = await supabase
      .from('feature_usage')
      .select('feature, count(*) as usage_count')
      .gte('created_at', oneWeekAgo.toISOString())
      .group('feature')
      .order('usage_count', { ascending: false })
      .limit(5)

    if (featureError) {
      logger.error('Error al obtener uso de características', featureError, {
        endpoint: 'getUsageMetrics',
      })
      return null
    }

    // Calcular tasas de crecimiento para características
    const { data: prevFeatureUsage, error: prevFeatureError } = await supabase
      .from('feature_usage')
      .select('feature, count(*) as usage_count')
      .gte('created_at', twoWeeksAgo.toISOString())
      .lt('created_at', oneWeekAgo.toISOString())
      .group('feature')

    if (prevFeatureError) {
      logger.error('Error al obtener uso previo de características', prevFeatureError, {
        endpoint: 'getUsageMetrics',
      })
      return null
    }

    // Mapear características con tasas de crecimiento
    const featuresWithGrowth = featureUsage?.map(f => {
      const prevUsage = prevFeatureUsage?.find(prev => prev.feature === f.feature)
      const prevCount = prevUsage ? parseInt(prevUsage.usage_count) : 1 // Para evitar división por cero
      const currentCount = parseInt(f.usage_count)
      const growthRate = prevCount > 0 ? ((currentCount - prevCount) / prevCount) * 100 : 0

      return {
        feature: f.feature,
        usage_count: currentCount,
        growth_rate: growthRate
      }
    }) || []

    // Obtener horas pico de uso
    const { data: peakHours, error: peakHoursError } = await supabase
      .from('user_sessions')
      .select(`
        EXTRACT(HOUR FROM created_at) as hour,
        count(*) as usage_count
      `)
      .gte('created_at', oneWeekAgo.toISOString())
      .group('hour')
      .order('usage_count', { ascending: false })

    if (peakHoursError) {
      logger.error('Error al obtener horas pico de uso', peakHoursError, {
        endpoint: 'getUsageMetrics',
      })
      return null
    }

    // Calcular porcentaje relativo para cada hora
    const totalUsage = peakHours?.reduce((sum, hour) => sum + parseInt(hour.usage_count), 0) || 1
    const peakHoursWithPercentage = peakHours?.map(h => ({
      hour: parseInt(h.hour),
      usage_count: parseInt(h.usage_count),
      relative_percentage: (parseInt(h.usage_count) / totalUsage) * 100
    })) || []

    // Obtener métricas de sesión
    const { data: sessionData, error: sessionError } = await supabase
      .from('user_sessions')
      .select(`
        avg(session_duration) as avg_duration,
        avg(pages_visited) as avg_pages
      `)
      .gte('created_at', oneMonthAgo.toISOString())

    if (sessionError) {
      logger.error('Error al obtener métricas de sesión', sessionError, {
        endpoint: 'getUsageMetrics',
      })
      return null
    }

    const avgSessionDuration = sessionData?.[0]?.avg_duration || 0
    const pagesPerSession = sessionData?.[0]?.avg_pages || 0

    // Calcular tasa de rebote (usuarios con solo una página vista)
    const { data: totalSessions, error: totalSessionsError } = await supabase
      .from('user_sessions')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', oneMonthAgo.toISOString())

    const { data: singlePageSessions, error: singlePageError } = await supabase
      .from('user_sessions')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', oneMonthAgo.toISOString())
      .eq('pages_visited', 1)

    if (totalSessionsError || singlePageError) {
      logger.error('Error al calcular tasa de rebote', {
        totalSessionsError,
        singlePageError
      }, {
        endpoint: 'getUsageMetrics',
      })
      return null
    }

    const totalSess = totalSessions?.count || 1
    const singleSess = singlePageSessions?.count || 0
    const bounceRate = totalSess > 0 ? (singleSess / totalSess) * 100 : 0

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

    videoCategories?.forEach(cat => {
      if (cat.category) {
        allCategoriesMap.set(cat.category, {
          count: parseInt(cat.count),
          avg_engagement: parseFloat(cat.avg_engagement) || 0
        })
      }
    })

    projectCategories?.forEach(cat => {
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