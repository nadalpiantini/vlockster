import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateRecommendations } from '@/lib/ai/recommendations'
import { handleError } from '@/lib/utils/api-helpers'
import type { Database } from '@/types/database.types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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

    // Obtener historial del usuario
    // Videos vistos
    const { data: videoMetrics } = await supabase
      .from('video_metrics')
      .select('video_id, watched_seconds, completed, videos(id, title, genre, uploader_id)')
      .eq('viewer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    // Proyectos apoyados
    const { data: backings } = await supabase
      .from('backings')
      .select('project_id, amount, projects(id, title, genre, creator_id)')
      .eq('user_id', user.id)
      .eq('payment_status', 'completed')
      .order('created_at', { ascending: false })
      .limit(50)

    // Preparar historial
    type VideoMetricWithVideo = Database['public']['Tables']['video_metrics']['Row'] & {
      videos: Pick<Database['public']['Tables']['videos']['Row'], 'id' | 'title' | 'genre' | 'uploader_id'> | null
    }
    
    type BackingWithProject = Database['public']['Tables']['backings']['Row'] & {
      projects: Pick<Database['public']['Tables']['projects']['Row'], 'id' | 'title' | 'category' | 'creator_id'> | null
    }

    const videos_viewed =
      (videoMetrics as VideoMetricWithVideo[] | null)?.map((vm) => ({
        video_id: vm.video_id,
        title: vm.videos?.title || '',
        genre: vm.videos?.genre || '',
        creator_id: vm.videos?.uploader_id || '',
        watched_seconds: vm.watched_seconds || 0,
      })) || []

    const projects_backed =
      (backings as BackingWithProject[] | null)?.map((b) => ({
        project_id: b.project_id,
        title: b.projects?.title || '',
        genre: b.projects?.category || '', // Projects use 'category', not 'genre'
        creator_id: b.projects?.creator_id || '',
        amount: b.amount,
      })) || []

    // Calcular géneros preferidos
    const genreCounts: Record<string, number> = {}
    videos_viewed.forEach((v) => {
      if (v.genre) {
        genreCounts[v.genre] = (genreCounts[v.genre] || 0) + 1
      }
    })
    projects_backed.forEach((p) => {
      if (p.genre) {
        genreCounts[p.genre] = (genreCounts[p.genre] || 0) + 1
      }
    })

    const preferred_genres = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    const total_watch_time = videos_viewed.reduce((sum, v) => sum + (v.watched_seconds || 0), 0) / 60

    // Obtener contenido disponible
    const { data: videos } = await supabase
      .from('videos')
      .select('id, title, description, genre, uploader_id, view_count, created_at')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(50)

    const { data: projects } = await supabase
      .from('projects')
      .select('id, title, description, category, creator_id, goal_amount, current_amount, deadline')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(30)

    // Mapear proyectos al formato esperado
    const projectsMapped = (projects || []).map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description || '',
      category: p.category || '',
      creator_id: p.creator_id,
      goal_amount: p.goal_amount,
      current_amount: p.current_amount || 0,
      deadline: p.deadline,
    }))

    // Mapear videos al formato esperado
    const videosMapped = (videos || []).map((v) => ({
      id: v.id,
      title: v.title,
      description: v.description || '',
      genre: v.genre || '',
      creator_id: v.uploader_id,
      view_count: v.view_count || 0,
      created_at: v.created_at || new Date().toISOString(),
    }))

    // Generar recomendaciones
    const recommendations = await generateRecommendations(
      {
        videos_viewed,
        projects_backed,
        preferred_genres,
        total_watch_time,
      },
      {
        videos: videosMapped,
        projects: projectsMapped,
      }
    )

    return NextResponse.json({
      success: true,
      ...recommendations,
    })
  } catch (error) {
    return handleError(error, 'Get recommendations')
  }
}

