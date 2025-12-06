import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { handleError } from '@/lib/utils/api-helpers'
import { logger } from '@/lib/utils/logger'
import type { Database } from '@/types/database.types'

type Project = Database['public']['Tables']['projects']['Row']

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Analytics para Creators
 * 
 * QUÉ HACE:
 * - Agrega métricas de videos, proyectos y backings
 * - Calcula: views, engagement, revenue, conversión
 * - Proporciona datos para dashboards
 */

export async function GET(request: NextRequest) {
  try {
    logger.info('Inicio de obtención de analytics del creador', {
      endpoint: '/api/analytics/creator',
    })

    const supabase = await createClient()

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      logger.warn('Intento de acceso no autorizado a analytics del creador', {
        endpoint: '/api/analytics/creator',
      })
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const creatorId = searchParams.get('creator_id') || user.id
    const days = parseInt(searchParams.get('days') || '30')

    logger.info('Obteniendo analytics para creador', {
      userId: user.id,
      creatorId,
      days,
      endpoint: '/api/analytics/creator',
    })

    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)

    // Videos del creator
    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select('id, title, view_count, like_count, created_at')
      .eq('uploader_id', creatorId)
      .gte('created_at', startDate.toISOString())

    if (videosError) {
      logger.error('Error al obtener videos del creador', videosError, {
        userId: user.id,
        creatorId,
        endpoint: '/api/analytics/creator',
      })
      return NextResponse.json({ error: 'Error al obtener videos del creador' }, { status: 500 })
    }

    // Proyectos del creator
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, title, goal_amount, current_amount, status, created_at')
      .eq('creator_id', creatorId)
      .gte('created_at', startDate.toISOString())

    if (projectsError) {
      logger.error('Error al obtener proyectos del creador', projectsError, {
        userId: user.id,
        creatorId,
        endpoint: '/api/analytics/creator',
      })
      return NextResponse.json({ error: 'Error al obtener proyectos del creador' }, { status: 500 })
    }

    // Backings recibidos
    const projectIds = ((projects as Project[] | null)?.map((p: Project) => p.id) || []) as string[]
    const { data: backings, error: backingsError } = await supabase
      .from('backings')
      .select('id, amount, project_id, created_at')
      .in('project_id', projectIds.length > 0 ? projectIds : [''])
      .eq('payment_status', 'completed')
      .gte('created_at', startDate.toISOString())

    if (backingsError) {
      logger.error('Error al obtener backings del creador', backingsError, {
        userId: user.id,
        creatorId,
        endpoint: '/api/analytics/creator',
      })
      return NextResponse.json({ error: 'Error al obtener backings del creador' }, { status: 500 })
    }

    // Métricas de videos
    const totalViews = videos?.reduce((sum: number, v: { view_count?: number }) => sum + (v.view_count || 0), 0) || 0
    const totalLikes = videos?.reduce((sum: number, v: { like_count?: number }) => sum + (v.like_count || 0), 0) || 0
    const avgViewsPerVideo = videos?.length ? totalViews / videos.length : 0

    // Métricas de proyectos
    const totalRevenue = backings?.reduce((sum: number, b: { amount?: number }) => sum + (b.amount || 0), 0) || 0
    const activeProjects = projects?.filter((p: { status: string }) => p.status === 'active').length || 0
    const fundedProjects = projects?.filter((p: { status: string }) => p.status === 'funded').length || 0
    const avgBacking = backings?.length ? totalRevenue / backings.length : 0

    // Engagement
    const postIds = ((projects as Project[] | null)?.map((p: Project) => p.id) || []) as string[]
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('id')
      .in('post_id', postIds.length > 0 ? postIds : [''])
      .gte('created_at', startDate.toISOString())

    if (commentsError) {
      logger.warn('Error al obtener comentarios para engagement', {
        userId: user.id,
        creatorId,
        endpoint: '/api/analytics/creator',
        error: commentsError,
      })
    }

    const totalEngagement = (totalLikes || 0) + (comments?.length || 0)

    logger.info('Analytics del creador obtenidas exitosamente', {
      userId: user.id,
      creatorId,
      days,
      videoCount: videos?.length || 0,
      projectCount: projects?.length || 0,
      endpoint: '/api/analytics/creator',
    })

    return NextResponse.json({
      success: true,
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        days,
      },
      videos: {
        total: videos?.length || 0,
        total_views: totalViews,
        total_likes: totalLikes,
        avg_views_per_video: Math.round(avgViewsPerVideo),
      },
      projects: {
        total: projects?.length || 0,
        active: activeProjects,
        funded: fundedProjects,
        total_goal: projects?.reduce((sum: number, p: { goal_amount?: number }) => sum + (p.goal_amount || 0), 0) || 0,
        total_raised: totalRevenue,
      },
      backings: {
        total: backings?.length || 0,
        total_revenue: totalRevenue,
        avg_backing: Math.round(avgBacking * 100) / 100,
      },
      engagement: {
        total: totalEngagement,
        likes: totalLikes,
        comments: comments?.length || 0,
      },
    })
  } catch (error) {
    const errorId = logger.error('Error inesperado al obtener analytics del creador', error, {
      endpoint: '/api/analytics/creator',
    })
    return handleError(error, 'Get creator analytics', { endpoint: '/api/analytics/creator' })
  }
}

