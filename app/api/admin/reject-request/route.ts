import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/utils/role-check'
import { adminRejectRequestSchema } from '@/lib/validations/schemas'
import { handleValidationError, handleError } from '@/lib/utils/api-helpers'
import { checkRateLimit, criticalRateLimit } from '@/lib/utils/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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
    const validationResult = adminRejectRequestSchema.safeParse(body)
    if (!validationResult.success) {
      return handleValidationError(validationResult.error)
    }

    const { requestId } = validationResult.data

    // Marcar la solicitud como rechazada
    const { error } = await (supabase
      .from('creator_requests') as any)
      .update({
        status: 'rejected',
        reviewed_by: (admin as any).id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    if (error) {
      return handleError(error, 'Reject request')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleError(error, 'Reject request')
  }
}

