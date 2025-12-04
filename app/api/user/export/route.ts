import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { handleError } from '@/lib/utils/api-helpers'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Exporta todos los datos del usuario en formato JSON (GDPR)
 */
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

    // Recopilar todos los datos del usuario
    const [profile, videos, projects, backings, posts, comments] = await Promise.all([
      // Perfil
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single(),

      // Videos subidos
      supabase
        .from('videos')
        .select('*')
        .eq('uploader_id', user.id),

      // Proyectos creados
      supabase
        .from('projects')
        .select('*')
        .eq('creator_id', user.id),

      // Backings realizados
      supabase
        .from('backings')
        .select('*')
        .eq('user_id', user.id),

      // Posts creados
      supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id),

      // Comentarios realizados
      supabase
        .from('comments')
        .select('*')
        .eq('user_id', user.id),
    ])

    const exportData = {
      profile: profile.data,
      videos: videos.data || [],
      projects: projects.data || [],
      backings: backings.data || [],
      posts: posts.data || [],
      comments: comments.data || [],
      exportedAt: new Date().toISOString(),
    }

    // Retornar como JSON descargable
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="vlockster-data-export-${user.id}.json"`,
      },
    })
  } catch (error) {
    return handleError(error, 'Export user data')
  }
}

