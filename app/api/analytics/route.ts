import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    if (!profile || !['creator', 'admin'].includes((profile as any).role)) {
      return NextResponse.json(
        { error: 'Solo creators pueden acceder a analytics' },
        { status: 403 }
      )
    }

    // Obtener estadísticas de videos
    const { data: videos } = await (supabase
      .from('videos') as any)
      .select('id, title, created_at')
      .eq('uploader_id', user.id)

    const totalVideos = videos?.length || 0

    // Obtener métricas de videos
    const videoIds = videos?.map((v: any) => v.id) || []
    const result = videoIds.length > 0
      ? await (supabase
          .from('video_metrics') as any)
          .select('video_id, watched_seconds, liked, completed')
          .in('video_id', videoIds)
      : { data: null, error: null }
    const videoMetrics = result.data

    const totalViews = videoMetrics?.length || 0
    const totalWatchTime = (videoMetrics as any[])?.reduce(
      (sum, m: any) => sum + (m.watched_seconds || 0),
      0
    ) || 0
    const totalLikes = (videoMetrics as any[])?.filter((m: any) => m.liked).length || 0
    const completionRate =
      totalViews > 0
        ? (
            ((videoMetrics as any[])?.filter((m: any) => m.completed).length || 0) / totalViews
          ) * 100
        : 0

    // Obtener estadísticas de proyectos
    const { data: projects } = await (supabase
      .from('projects') as any)
      .select('id, title, goal_amount, current_amount, status, created_at')
      .eq('creator_id', user.id)

    const totalProjects = projects?.length || 0
    const activeProjects =
      (projects as any[])?.filter((p: any) => p.status === 'active').length || 0
    const fundedProjects =
      (projects as any[])?.filter((p: any) => p.status === 'funded').length || 0
    const totalRaised =
      (projects as any[])?.reduce((sum: number, p: any) => sum + Number(p.current_amount), 0) || 0

    // Obtener backings recibidos
    const projectIds = (projects as any[])?.map((p: any) => p.id) || []
    const backingResult = projectIds.length > 0
      ? await (supabase
          .from('backings') as any)
          .select('amount, created_at')
          .in('project_id', projectIds)
      : { data: null, error: null }
    const backings = backingResult.data

    const totalBackers = backings?.length || 0

    // Calcular tendencias (últimos 30 días)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentVideos = (videos as any[])?.filter(
      (v: any) => new Date(v.created_at) >= thirtyDaysAgo
    ).length || 0

    const recentBackings = (backings as any[])?.filter(
      (b: any) => new Date(b.created_at) >= thirtyDaysAgo
    ).length || 0

    const recentRevenue =
      (backings as any[])
        ?.filter((b: any) => new Date(b.created_at) >= thirtyDaysAgo)
        .reduce((sum: number, b: any) => sum + Number(b.amount), 0) || 0

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
        (videos as any[])
          ?.map((video: any) => {
            const metrics = (videoMetrics as any[])?.filter(
              (m: any) => m.video_id === video.id
            )
            return {
              id: video.id,
              title: video.title,
              views: metrics?.length || 0,
              likes: metrics?.filter((m: any) => m.liked).length || 0,
            }
          })
          .sort((a, b) => b.views - a.views)
          .slice(0, 5) || [],
      topProjects:
        (projects as any[])
          ?.map((project: any) => ({
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
