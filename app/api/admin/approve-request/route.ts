import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/utils/role-check'
import { adminApproveRequestSchema } from '@/lib/validations/schemas'
import { handleValidationError, handleError } from '@/lib/utils/api-helpers'
import { checkRateLimit, criticalRateLimit } from '@/lib/utils/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const admin = await requireRole(['admin'])

    // Rate limiting para operaciones admin
    const rateLimitResult = await checkRateLimit(admin.id, criticalRateLimit)
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
    const validationResult = adminApproveRequestSchema.safeParse(body)
    if (!validationResult.success) {
      return handleValidationError(validationResult.error)
    }

    const { requestId } = validationResult.data

    // Obtener la solicitud
    const { data: creatorRequest, error: fetchError } = await (supabase
      .from('creator_requests') as any)
      .select('user_id')
      .eq('id', requestId)
      .single()

    if (fetchError || !creatorRequest) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      )
    }

    // Actualizar el rol del usuario a creator
    const { error: updateRoleError } = await (supabase
      .from('profiles') as any)
      .update({ role: 'creator' })
      .eq('id', (creatorRequest as any).user_id)

    if (updateRoleError) {
      return handleError(updateRoleError, 'Approve request - update role')
    }

    // Marcar la solicitud como aprobada
    const { error: updateRequestError } = await (supabase
      .from('creator_requests') as any)
      .update({
        status: 'approved',
        reviewed_by: admin.id,
        reviewed_at: new Date().toISOString(),
      } as any)
      .eq('id', requestId)

    if (updateRequestError) {
      return handleError(updateRequestError, 'Approve request - update status')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleError(error, 'Approve request')
  }
}

