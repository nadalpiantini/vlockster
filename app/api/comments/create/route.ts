import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { commentCreateSchema } from '@/lib/validations/schemas'
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
    const validationResult = commentCreateSchema.safeParse({
      post_id: body.post_id,
      content: body.content,
      parent_id: body.parent_id,
      parent_comment_id: body.parent_comment_id,
    })

    if (!validationResult.success) {
      return handleValidationError(validationResult.error)
    }

    const { post_id, content, parent_comment_id, parent_id } = validationResult.data
    const parentCommentId = parent_comment_id || parent_id // Support both for compatibility

    // Sanitizar contenido
    const sanitizedContent = sanitizeContent(content, false)

    // Verificar que el post existe
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id')
      .eq('id', post_id)
      .single()

    if (postError || !post) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      )
    }

    // Si hay parent_comment_id, verificar que el comentario padre existe
    if (parentCommentId) {
      const { data: parentComment, error: parentError } = await supabase
        .from('comments')
        .select('id')
        .eq('id', parentCommentId)
        .single()

      if (parentError || !parentComment) {
        return NextResponse.json(
          { error: 'Comentario padre no encontrado' },
          { status: 404 }
        )
      }
    }

    // Crear comentario
    const { data: comment, error: commentError } = await supabase
      .from('comments')
      .insert({
        post_id,
        user_id: user.id,
        content: sanitizedContent,
        parent_comment_id: parentCommentId || null,
      } as Database['public']['Tables']['comments']['Insert'])
      .select('*')
      .single()

    if (commentError) {
      return handleError(commentError, 'Create comment')
    }

    return NextResponse.json({
      success: true,
      comment,
    })
  } catch (error) {
    return handleError(error, 'Create comment')
  }
}
