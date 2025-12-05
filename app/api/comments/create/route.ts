import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { commentCreateSchema } from '@/lib/validations/schemas'
import { handleValidationError, handleError, sanitizeContent } from '@/lib/utils/api-helpers'
import { checkRateLimit, contentRateLimit } from '@/lib/utils/rate-limit'
import { moderateComment } from '@/lib/ai/comment-moderator'
import { logger } from '@/lib/utils/logger'
import type { Database } from '@/types/database.types'

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

    // Moderación automática con IA
    let moderationResult
    try {
      // Obtener historial del autor para contexto
      const { data: authorComments } = await supabase
        .from('comments')
        .select('id')
        .eq('user_id', user.id)

      const { data: authorProfile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single()

      const { data: moderationLogs } = await supabase
        .from('moderation_logs')
        .select('action')
        .eq('user_id', user.id)
        .in('action', ['delete', 'ban'])

      moderationResult = await moderateComment({
        comment_text: sanitizedContent,
        author_id: user.id,
        author_name: authorProfile?.name || 'Usuario',
        context: `post: ${post_id}`,
        author_history: {
          total_comments: authorComments?.length || 0,
          moderated_comments: moderationLogs?.length || 0,
          warnings: 0, // Puedes agregar tracking de warnings después
        },
      })

      // Si es severe, eliminar inmediatamente
      if (moderationResult.severity === 'severe' && moderationResult.action === 'delete') {
        return NextResponse.json(
          {
            error: 'Tu comentario no cumple con nuestras políticas de comunidad',
            moderation: {
              severity: moderationResult.severity,
              reason: moderationResult.reasons.join(', '),
            },
          },
          { status: 403 }
        )
      }

      // Si es ban, también rechazar
      if (moderationResult.action === 'ban') {
        return NextResponse.json(
          {
            error: 'Tu comentario ha sido rechazado. Si continúas, tu cuenta puede ser suspendida.',
            moderation: {
              severity: moderationResult.severity,
              reason: moderationResult.reasons.join(', '),
            },
          },
          { status: 403 }
        )
      }
    } catch (moderationError) {
      // Si falla la moderación, continuar pero marcar para revisión
      logger.error('Error en moderación automática de comentario', moderationError, {
        userId: user.id,
        postId: body.postId,
        endpoint: '/api/comments/create'
      })
      moderationResult = {
        severity: 'moderate' as const,
        action: 'review' as const,
        reasons: ['Error en análisis automático'],
        explanation: '',
        confidence: 0.3,
      }
    }

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

    // Crear comentario con estado de moderación
    const commentData: Database['public']['Tables']['comments']['Insert'] = {
      post_id,
      user_id: user.id,
      content: sanitizedContent,
      parent_comment_id: parentCommentId || null,
      moderation_status:
        moderationResult.action === 'approve'
          ? 'approved'
          : moderationResult.action === 'review'
            ? 'pending_review'
            : 'pending_review', // Por seguridad, si no es approve, revisar
    }

    const { data: comment, error: commentError } = await supabase
      .from('comments')
      .insert(commentData)
      .select('*')
      .single()

    if (commentError) {
      return handleError(commentError, 'Create comment')
    }

    // Si requiere revisión, agregar a cola de moderación
    if (moderationResult.action === 'review' && comment) {
      await supabase.from('moderation_queue').insert({
        comment_id: comment.id,
        severity: moderationResult.severity,
        reasons: moderationResult.reasons,
        created_at: new Date().toISOString(),
      })
    }

    // Registrar en logs de moderación
    if (moderationResult && comment) {
      await supabase.from('moderation_logs').insert({
        comment_id: comment.id,
        user_id: user.id,
        action: moderationResult.action,
        severity: moderationResult.severity,
        reasons: moderationResult.reasons,
        confidence: moderationResult.confidence,
        created_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      comment,
      moderation:
        moderationResult.action !== 'approve'
          ? {
              status: moderationResult.action,
              message:
                moderationResult.action === 'review'
                  ? 'Tu comentario está siendo revisado y se publicará pronto si cumple con nuestras políticas.'
                  : 'Tu comentario requiere revisión.',
            }
          : undefined,
    })
  } catch (error) {
    return handleError(error, 'Create comment')
  }
}
