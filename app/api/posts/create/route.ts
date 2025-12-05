import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { postCreateSchema } from '@/lib/validations/schemas'
import { handleValidationError, handleError, sanitizeContent } from '@/lib/utils/api-helpers'
import { checkRateLimit, contentRateLimit } from '@/lib/utils/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Rate limiting
    const rateLimitResult = await checkRateLimit(user.id, contentRateLimit)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Demasiadas solicitudes. Por favor intenta más tarde.',
          retryAfter: rateLimitResult.reset,
        },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Validar con Zod
    const validationResult = postCreateSchema.safeParse(body)
    if (!validationResult.success) {
      return handleValidationError(validationResult.error)
    }

    const { community_id, title, content } = validationResult.data

    // Sanitizar contenido
    const sanitizedTitle = sanitizeContent(title, false)
    const sanitizedContent = sanitizeContent(content, true) // Permitir HTML básico en posts

    // Verificar que la comunidad existe
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .select('id')
      .eq('id', community_id)
      .single()

    if (communityError || !community) {
      return NextResponse.json(
        { error: 'Comunidad no encontrada' },
        { status: 404 }
      )
    }

    // Crear post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        community_id,
        user_id: user.id,
        title: sanitizedTitle,
        content: sanitizedContent,
      })
      .select('*')
      .single()

    if (postError) {
      return handleError(postError, 'Create post')
    }

    return NextResponse.json({
      success: true,
      post,
    })
  } catch (error) {
    return handleError(error, 'Create post')
  }
}
