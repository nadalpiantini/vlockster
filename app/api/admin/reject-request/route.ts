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

    // Marcar la solicitud como rechazada
    const { error } = await supabase
      .from('creator_requests')
      .update({
        status: 'rejected',
        reviewed_by: admin.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    if (error) {
      console.error('Error rejecting request:', error)
      return NextResponse.json(
        { error: 'Error al rechazar solicitud' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reject request error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

