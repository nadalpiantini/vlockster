import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { projectCreateSchema } from '@/lib/validations/schemas'
import { handleValidationError, handleError, sanitizeContent } from '@/lib/utils/api-helpers'
import { checkRateLimit, contentRateLimit } from '@/lib/utils/rate-limit'
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

    // Verificar que el usuario es creator o admin
    type ProfileRow = Database['public']['Tables']['profiles']['Row']
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const profileTyped = profile as ProfileRow | null
    if (!profileTyped || !['creator', 'admin'].includes(profileTyped.role)) {
      return NextResponse.json(
        { error: 'Solo los creators pueden crear proyectos' },
        { status: 403 }
      )
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
    const validationResult = projectCreateSchema.safeParse(body)
    if (!validationResult.success) {
      return handleValidationError(validationResult.error)
    }

    const { title, description, goal_amount, deadline, video_id, rewards } = validationResult.data

    // Sanitizar contenido
    const sanitizedTitle = sanitizeContent(title, false)
    const sanitizedDescription = sanitizeContent(description, true) // Permitir HTML básico

    // Crear proyecto
    type ProjectInsert = Database['public']['Tables']['projects']['Insert']
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        title: sanitizedTitle,
        description: sanitizedDescription,
        goal_amount,
        deadline,
        creator_id: user.id,
        video_id: video_id || null,
        status: 'active',
      } as ProjectInsert)
      .select()
      .single()

    if (projectError) {
      return handleError(projectError, 'Create project')
    }

    // Crear recompensas si existen
    if (rewards && Array.isArray(rewards) && rewards.length > 0 && project) {
      type RewardInsert = Database['public']['Tables']['rewards']['Insert']
      const rewardsToInsert: RewardInsert[] = rewards.map((reward) => ({
        project_id: project.id,
        title: sanitizeContent(reward.title, false),
        description: sanitizeContent(reward.description, true),
        amount: reward.amount,
        limit: reward.limit || null,
      }))

      const { error: rewardsError } = await supabase
        .from('rewards')
        .insert(rewardsToInsert)

      if (rewardsError) {
        // Loggear pero no fallar - el proyecto ya está creado
        logger.error('Error creating rewards', rewardsError, {
          userId: user.id,
          projectId: project.id,
          endpoint: '/api/projects/create',
        })
      }
    }

    return NextResponse.json({
      success: true,
      project,
    })
  } catch (error) {
    return handleError(error, 'Create project')
  }
}
