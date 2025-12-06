import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { postCreateSchema } from '@/lib/validations/schemas'
import { handleValidationError, handleError, sanitizeContent } from '@/lib/utils/api-helpers'
import { checkRateLimit, contentRateLimit } from '@/lib/utils/rate-limit'
import { logger } from '@/lib/utils/logger'
import type { Database } from '@/types/database.types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Log de inicio de petición
    logger.info('Inicio de creación de post', {
      userId: 'pending',
      endpoint: '/api/posts/create',
    })

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      logger.warn('Intento de creación de post sin autenticación', {
        endpoint: '/api/posts/create',
      })
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Rate limiting
    const rateLimitResult = await checkRateLimit(user.id, contentRateLimit)
    if (!rateLimitResult.success) {
      logger.warn('Límite de tasa excedido para creación de post', {
        userId: user.id,
        endpoint: '/api/posts/create',
        retryAfter: rateLimitResult.reset,
      })
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
      logger.warn('Validación fallida para creación de post', {
        userId: user.id,
        endpoint: '/api/posts/create',
        errors: validationResult.error.flatten(),
      })
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
      logger.warn('Intento de crear post en comunidad inexistente', {
        userId: user.id,
        communityId: community_id,
        endpoint: '/api/posts/create',
      })
      return NextResponse.json(
        { error: 'Comunidad no encontrada' },
        { status: 404 }
      )
    }

    // Crear post
    const insertData: Database['public']['Tables']['posts']['Insert'] = {
      community_id,
      user_id: user.id,
      title: sanitizedTitle,
      content: sanitizedContent,
    }
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert(insertData)
      .select('*')
      .single()

    if (postError) {
      const errorId = logger.error('Error al crear post en la base de datos', postError, {
        userId: user.id,
        communityId: community_id,
        endpoint: '/api/posts/create',
      })
      return handleError(postError, 'Create post', errorId)
    }

    logger.info('Post creado exitosamente', {
      userId: user.id,
      postId: post?.id,
      communityId: community_id,
      endpoint: '/api/posts/create',
    })

    return NextResponse.json({
      success: true,
      post,
    })
  } catch (error) {
    const errorId = logger.error('Error inesperado en creación de post', error, {
      endpoint: '/api/posts/create',
    })
    return handleError(error, 'Create post', errorId)
  }
}
