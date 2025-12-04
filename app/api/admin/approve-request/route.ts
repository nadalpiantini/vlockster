import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/utils/role-check'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const admin = await requireRole(['admin'])

    const body = await request.json()
    const { requestId } = body

    if (!requestId) {
      return NextResponse.json(
        { error: 'ID de solicitud requerido' },
        { status: 400 }
      )
    }

    // Obtener la solicitud
    const { data: request, error: fetchError } = await supabase
      .from('creator_requests')
      .select('user_id')
      .eq('id', requestId)
      .single()

    if (fetchError || !request) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      )
    }

    // Actualizar el rol del usuario a creator
    const { error: updateRoleError } = await supabase
      .from('profiles')
      .update({ role: 'creator' })
      .eq('id', request.user_id)

    if (updateRoleError) {
      console.error('Error updating role:', updateRoleError)
      return NextResponse.json(
        { error: 'Error al actualizar rol del usuario' },
        { status: 500 }
      )
    }

    // Marcar la solicitud como aprobada
    const { error: updateRequestError } = await supabase
      .from('creator_requests')
      .update({
        status: 'approved',
        reviewed_by: admin.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    if (updateRequestError) {
      console.error('Error updating request:', updateRequestError)
      return NextResponse.json(
        { error: 'Error al actualizar solicitud' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Approve request error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

