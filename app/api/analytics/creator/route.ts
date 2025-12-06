import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { handleError } from '@/lib/utils/api-helpers'
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
    const supabase = await createClient()

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const creatorId = searchParams.get('creator_id') || user.id
    const days = parseInt(searchParams.get('days') || '30')

    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)

    // Videos del creator
    const { data: videos } = await supabase
      .from('videos')
      .select('id, title, view_count, like_count, created_at')
      .eq('uploader_id', creatorId)
      .gte('created_at', startDate.toISOString())

    // Proyectos del creator
    const { data: projects } = await supabase
      .from('projects')
      .select('id, title, goal_amount, current_amount, status, created_at')
      .eq('creator_id', creatorId)
      .gte('created_at', startDate.toISOString())

    // Backings recibidos
    const projectIds = ((projects as Project[] | null)?.map((p: Project) => p.id) || []) as string[]
    const { data: backings } = await supabase
      .from('backings')
      .select('id, amount, project_id, created_at')
      .in('project_id', projectIds.length > 0 ? projectIds : [''])
      .eq('payment_status', 'completed')
      .gte('created_at', startDate.toISOString())

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
    const { data: comments } = await supabase
      .from('comments')
      .select('id')
      .in('post_id', postIds.length > 0 ? postIds : [''])
      .gte('created_at', startDate.toISOString())

    const totalEngagement = (totalLikes || 0) + (comments?.length || 0)

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
    return handleError(error, 'Get creator analytics')
  }
}

