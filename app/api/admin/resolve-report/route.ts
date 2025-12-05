import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { handleError } from '@/lib/utils/api-helpers'
import { z } from 'zod'
import type { Database } from '@/types/database.types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const resolveReportSchema = z.object({
  reportId: z.string().uuid(),
  action: z.enum(['resolve', 'dismiss']),
  notes: z.string().optional(),
})

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

    // Verificar que el usuario es admin o moderator
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'moderator'].includes((profile as Database['public']['Tables']['profiles']['Row']).role)) {
      return NextResponse.json(
        { error: 'Solo administradores y moderadores pueden resolver reportes' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Validar con Zod
    const validationResult = resolveReportSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { reportId, action, notes } = validationResult.data

    // Actualizar estado del reporte
    const status = action === 'resolve' ? 'resolved' : 'dismissed'

    const { data: updatedReport, error: updateError } = await supabase
      .from('reports')
      .update({
        status,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        resolution_notes: notes || null,
      } as Database['public']['Tables']['reports']['Update'])
      .eq('id', reportId)
      .select()
      .single()

    if (updateError) {
      return handleError(updateError, 'Resolve report')
    }

    return NextResponse.json({
      success: true,
      report: updatedReport,
    })
  } catch (error) {
    return handleError(error, 'Resolve report')
  }
}

