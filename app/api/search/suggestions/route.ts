import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { handleError } from '@/lib/utils/api-helpers'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Autocompletado de Búsqueda
 * 
 * QUÉ HACE:
 * - Genera sugerencias mientras el usuario escribe
 * - Busca en títulos de videos y proyectos
 * - Retorna búsquedas populares
 * - Mejora UX de búsqueda
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    if (query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    const supabase = await createClient()

    // Buscar en títulos de videos
    const { data: videos } = await supabase
      .from('videos')
      .select('title')
      .ilike('title', `%${query}%`)
      .eq('visibility', 'public')
      .limit(5)

    // Buscar en títulos de proyectos
    const { data: projects } = await supabase
      .from('projects')
      .select('title')
      .ilike('title', `%${query}%`)
      .eq('status', 'active')
      .limit(5)

    // Combinar y deduplicar
    type VideoRow = { title: string }
    type ProjectRow = { title: string }
    const suggestions = [
      ...((videos as VideoRow[] | null)?.map((v: VideoRow) => v.title) || []),
      ...((projects as ProjectRow[] | null)?.map((p: ProjectRow) => p.title) || []),
    ]
      .filter((title: string, index: number, self: string[]) => self.indexOf(title) === index)
      .slice(0, 10)

    return NextResponse.json({
      success: true,
      suggestions,
    })
  } catch (error) {
    return handleError(error, 'Get search suggestions')
  }
}

