import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    if (!profile || !['creator', 'admin'].includes(profile.role)) {
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

    // Obtener métricas de videos
    const videoIds = videos?.map((v) => v.id) || []
    const { data: videoMetrics } = videoIds.length > 0
      ? await supabase
          .from('video_metrics')
          .select('video_id, watched_seconds, liked, completed')
          .in('video_id', videoIds)
      : { data: null, error: null }

    const totalViews = videoMetrics?.length || 0
    const totalWatchTime = videoMetrics?.reduce(
      (sum, m) => sum + (m.watched_seconds || 0),
      0
    )
    const totalLikes = videoMetrics?.filter((m) => m.liked).length || 0
    const completionRate =
      totalViews > 0
        ? (
            (videoMetrics?.filter((m) => m.completed).length || 0) / totalViews
          ) * 100
        : 0

    // Obtener estadísticas de proyectos
    const { data: projects } = await supabase
      .from('projects')
      .select('id, title, goal_amount, current_amount, status, created_at')
      .eq('creator_id', user.id)

    const totalProjects = projects?.length || 0
    const activeProjects =
      projects?.filter((p) => p.status === 'active').length || 0
    const fundedProjects =
      projects?.filter((p) => p.status === 'funded').length || 0
    const totalRaised =
      projects?.reduce((sum, p) => sum + Number(p.current_amount), 0) || 0

    // Obtener backings recibidos
    const projectIds = projects?.map((p) => p.id) || []
    const { data: backings } = projectIds.length > 0
      ? await supabase
          .from('backings')
          .select('amount, created_at')
          .in('project_id', projectIds)
      : { data: null, error: null }

    const totalBackers = backings?.length || 0

    // Calcular tendencias (últimos 30 días)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentVideos = videos?.filter(
      (v) => new Date(v.created_at) >= thirtyDaysAgo
    ).length || 0

    const recentBackings = backings?.filter(
      (b) => new Date(b.created_at) >= thirtyDaysAgo
    ).length || 0

    const recentRevenue =
      backings
        ?.filter((b) => new Date(b.created_at) >= thirtyDaysAgo)
        .reduce((sum, b) => sum + Number(b.amount), 0) || 0

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
        videos
          ?.map((video) => {
            const metrics = videoMetrics?.filter(
              (m) => m.video_id === video.id
            )
            return {
              id: video.id,
              title: video.title,
              views: metrics?.length || 0,
              likes: metrics?.filter((m) => m.liked).length || 0,
            }
          })
          .sort((a, b) => b.views - a.views)
          .slice(0, 5) || [],
      topProjects:
        projects
          ?.map((project) => ({
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
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
