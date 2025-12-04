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
    const { community_id, title, content } = body

    if (!community_id || !title || !content) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que la comunidad existe
    const { data: community, error: communityError } = await (supabase
      .from('communities') as any)
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
    const { data: post, error: postError } = await (supabase
      .from('posts') as any)
      .insert({
        community_id,
        user_id: user.id,
        title,
        content,
      })
      .select('*')
      .single()

    if (postError) {
      console.error('Error creating post:', postError)
      return NextResponse.json(
        { error: 'Error al crear post' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      post,
    })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
