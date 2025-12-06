import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'
import { handleError } from '@/lib/utils/api-helpers'
import type { Database } from '@/types/database.types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que el usuario es creator o admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['creator', 'admin'].includes((profile as Database['public']['Tables']['profiles']['Row']).role)) {
      return NextResponse.json(
        { error: 'Solo creators pueden acceder a analytics' },
        { status: 403 }
      )
    }

    // Obtener estadísticas de videos
    const { data: videos } = await supabase
      .from('videos')
      .select('id, title, created_at')
      .eq('uploader_id', user.id)

    const totalVideos = videos?.length || 0

    // Obtener métricas de videos (optimizado: una sola query en lugar de N+1)
    type VideoSelect = { id: string; title: string | null; created_at: string | null }
    const videoIds = videos?.map((v: VideoSelect) => v.id) || []
    const result = videoIds.length > 0
      ? await supabase
          .from('video_metrics')
          .select('video_id, watched_seconds, liked, completed')
          .in('video_id', videoIds)
          .order('created_at', { ascending: false })
      : { data: null, error: null }
    const videoMetrics = result.data

    type VideoMetric = Database['public']['Tables']['video_metrics']['Row']
    const totalViews = videoMetrics?.length || 0
    const totalWatchTime = (videoMetrics as VideoMetric[] | null)?.reduce(
      (sum: number, m: VideoMetric) => sum + (m.watched_seconds || 0),
      0
    ) || 0
    const totalLikes = (videoMetrics as VideoMetric[] | null)?.filter((m: VideoMetric) => m.liked).length || 0
    const completionRate =
      totalViews > 0
        ? (((videoMetrics as VideoMetric[] | null)?.filter((m: VideoMetric) => m.completed).length || 0) / totalViews) * 100
        : 0

    // Obtener estadísticas de proyectos
    const { data: projects } = await supabase
      .from('projects')
      .select('id, title, goal_amount, current_amount, status, created_at')
      .eq('creator_id', user.id)

    type Project = Database['public']['Tables']['projects']['Row']
    const totalProjects = projects?.length || 0
    const activeProjects = (projects as Project[] | null)?.filter((p: Project) => p.status === 'active').length || 0
    const fundedProjects = (projects as Project[] | null)?.filter((p: Project) => p.status === 'funded').length || 0
    const totalRaised =
      (projects as Project[] | null)?.reduce((sum: number, p: Project) => sum + Number(p.current_amount || 0), 0) || 0

    // Obtener backings recibidos (optimizado: una sola query en lugar de N+1)
    const projectIds = (projects as Project[] | null)?.map((p: Project) => p.id) || []
    const backingResult = projectIds.length > 0
      ? await supabase
          .from('backings')
          .select('amount, created_at')
          .in('project_id', projectIds)
          .eq('payment_status', 'completed')
          .order('created_at', { ascending: false })
      : { data: null, error: null }
    const backings = backingResult.data

    const totalBackers = backings?.length || 0

    // Calcular tendencias (últimos 30 días)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    type Video = Database['public']['Tables']['videos']['Row']
    type Backing = Database['public']['Tables']['backings']['Row']
    const recentVideos =
      (videos as Video[] | null)?.filter((v: Video) => new Date(v.created_at || '') >= thirtyDaysAgo).length || 0

    const recentBackings =
      (backings as Backing[] | null)?.filter((b: Backing) => new Date(b.created_at || '') >= thirtyDaysAgo).length || 0

    const recentRevenue =
      (backings as Backing[] | null)
        ?.filter((b: Backing) => new Date(b.created_at || '') >= thirtyDaysAgo)
        .reduce((sum: number, b: Backing) => sum + Number(b.amount || 0), 0) || 0

    return NextResponse.json({
      videos: {
        total: totalVideos,
        totalViews,
        totalWatchTime: Math.round(totalWatchTime / 60), // en minutos
        totalLikes,
        completionRate: completionRate.toFixed(1),
        recent: recentVideos,
      },
      projects: {
        total: totalProjects,
        active: activeProjects,
        funded: fundedProjects,
        totalRaised: totalRaised.toFixed(2),
        totalBackers,
        recent: recentBackings,
        recentRevenue: recentRevenue.toFixed(2),
      },
      topVideos:
        (videos as Video[] | null)
          ?.map((video) => {
            const metrics = (videoMetrics as VideoMetric[] | null)?.filter((m) => m.video_id === video.id)
            return {
              id: video.id,
              title: video.title,
              views: metrics?.length || 0,
              likes: metrics?.filter((m: VideoMetric) => m.liked).length || 0,
            }
          })
          .sort((a, b) => b.views - a.views)
          .slice(0, 5) || [],
      topProjects:
        (projects as Project[] | null)
          ?.map((project: Project) => ({
            id: project.id,
            title: project.title,
            raised: Number(project.current_amount),
            goal: Number(project.goal_amount),
            progress:
              (Number(project.current_amount) / Number(project.goal_amount)) *
              100,
          }))
          .sort((a, b) => b.raised - a.raised)
          .slice(0, 5) || [],
    })
  } catch (error) {
    return handleError(error, 'Analytics', {
      endpoint: '/api/analytics',
    })
  }
}
