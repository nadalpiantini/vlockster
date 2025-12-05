import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { handleError } from '@/lib/utils/api-helpers'
import { z } from 'zod'
import type { Database } from '@/types/database.types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const updateRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['viewer', 'creator', 'moderator', 'admin']),
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

    // Verificar que el usuario es admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || (profile as Database['public']['Tables']['profiles']['Row']).role !== 'admin') {
      return NextResponse.json(
        { error: 'Solo los administradores pueden cambiar roles' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Validar con Zod
    const validationResult = updateRoleSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { userId, role } = validationResult.data

    // No permitir cambiar el rol del último admin
    if (role !== 'admin') {
      const { data: admins } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')

      if (admins && admins.length === 1 && (admins[0] as Database['public']['Tables']['profiles']['Row']).id === userId) {
        return NextResponse.json(
          { error: 'No se puede quitar el rol de admin al último administrador' },
          { status: 400 }
        )
      }
    }

    // Actualizar rol
    const { data: updatedUser, error: updateError } = await supabase
      .from('profiles')
      .update({ role } as Database['public']['Tables']['profiles']['Update'])
      .eq('id', userId)
      .select()
      .single()

    if (updateError) {
      return handleError(updateError, 'Update user role')
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    return handleError(error, 'Update user role')
  }
}

