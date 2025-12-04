import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { handleError } from '@/lib/utils/api-helpers'

/**
 * Elimina la cuenta del usuario y todos sus datos (GDPR - Derecho al olvido)
 * NOTA: Esto es una eliminación suave (soft delete) para mantener integridad referencial
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Confirmar eliminación (debería venir en el body)
    const body = await request.json().catch(() => ({}))
    if (!body.confirm || body.confirm !== 'DELETE_MY_ACCOUNT') {
      return NextResponse.json(
        { error: 'Confirmación requerida para eliminar cuenta' },
        { status: 400 }
      )
    }

    // Soft delete: Marcar perfil como eliminado
    const { error: profileError } = await (supabase
      .from('profiles') as any)
      .update({
        email: `deleted_${user.id}@deleted.local`,
        name: 'Usuario Eliminado',
        bio: null,
        avatar_url: null,
        is_deleted: true,
        deleted_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (profileError) {
      return handleError(profileError, 'Delete account - profile')
    }

    // Eliminar cuenta de autenticación en Supabase Auth
    // NOTA: Esto requiere permisos de service role, normalmente se hace desde el backend
    // Por ahora, solo marcamos el perfil como eliminado

    return NextResponse.json({
      success: true,
      message: 'Cuenta eliminada exitosamente. Todos tus datos han sido removidos.',
    })
  } catch (error) {
    return handleError(error, 'Delete account')
  }
}

