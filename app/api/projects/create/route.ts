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

    // Verificar que el usuario es creator o admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['creator', 'admin'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Solo los creators pueden crear proyectos' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, goal_amount, deadline, video_id, rewards } = body

    // Validaciones
    if (!title || !description || !goal_amount || !deadline) {
      return NextResponse.json(
        { error: 'Todos los campos requeridos deben ser completados' },
        { status: 400 }
      )
    }

    if (goal_amount <= 0) {
      return NextResponse.json(
        { error: 'El monto objetivo debe ser mayor a 0' },
        { status: 400 }
      )
    }

    const deadlineDate = new Date(deadline)
    if (deadlineDate <= new Date()) {
      return NextResponse.json(
        { error: 'La fecha límite debe ser futura' },
        { status: 400 }
      )
    }

    // Crear proyecto
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        title,
        description,
        goal_amount,
        deadline,
        creator_id: user.id,
        video_id: video_id || null,
        status: 'active',
      })
      .select()
      .single()

    if (projectError) {
      console.error('Error creating project:', projectError)
      return NextResponse.json(
        { error: 'Error al crear proyecto' },
        { status: 500 }
      )
    }

    // Crear recompensas si existen
    if (rewards && Array.isArray(rewards) && rewards.length > 0) {
      const rewardsToInsert = rewards.map((reward: any) => ({
        project_id: project.id,
        title: reward.title,
        description: reward.description,
        amount: reward.amount,
        limit: reward.limit || null,
      }))

      const { error: rewardsError } = await supabase
        .from('rewards')
        .insert(rewardsToInsert)

      if (rewardsError) {
        console.error('Error creating rewards:', rewardsError)
        // No fallar si las recompensas fallan, el proyecto ya está creado
      }
    }

    return NextResponse.json({
      success: true,
      project,
    })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
