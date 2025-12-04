import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    const body = await request.json()
    const { post_id, content, parent_id, parent_comment_id } = body
    const parentCommentId = parent_comment_id || parent_id // Support both for compatibility

    if (!post_id || !content) {
      return NextResponse.json(
        { error: 'Post ID y contenido son requeridos' },
        { status: 400 }
      )
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

    // Crear comentario
    const { data: comment, error: commentError } = await supabase
      .from('comments')
      .insert({
        post_id,
        user_id: user.id,
        content,
        parent_comment_id: parentCommentId || null,
      })
      .select(
        `
        *,
        profiles:user_id (
          name,
          avatar_url
        )
      `
      )
      .single()

    if (commentError) {
      console.error('Error creating comment:', commentError)
      return NextResponse.json(
        { error: 'Error al crear comentario' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      comment,
    })
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
