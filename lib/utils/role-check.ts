import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type Role = 'viewer' | 'creator' | 'moderator' | 'admin'

// TEMPORAL: Deshabilitar autenticación para acceso libre
// Cambiar a false para reactivar autenticación
const DISABLE_AUTH = true

export async function getCurrentUser() {
  // TEMPORAL: Si auth está deshabilitado, retornar null sin verificar
  if (DISABLE_AUTH) {
    return null
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

export type UserProfile = {
  id: string
  email: string
  name: string | null
  bio: string | null
  avatar_url: string | null
  role: Role
  role_scope: unknown
  is_premium_creator: boolean
  public_profile_slug: string | null
  preferred_lang: string
  created_at: string
  updated_at: string
}

export async function requireAuth(): Promise<UserProfile> {
  const user = await getCurrentUser()
  
  // TEMPORAL: Si auth está deshabilitado y no hay user, retornar un perfil mock
  if (!user && DISABLE_AUTH) {
    return {
      id: 'guest-user',
      email: 'guest@vlockster.com',
      name: 'Guest User',
      bio: null,
      avatar_url: null,
      role: 'viewer' as Role,
      role_scope: null,
      is_premium_creator: false,
      public_profile_slug: null,
      preferred_lang: 'es',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as UserProfile
  }
  
  // TEMPORAL: No redirigir si auth está deshabilitado
  if (!user && !DISABLE_AUTH) {
    redirect('/login')
    // redirect nunca retorna, pero TypeScript no lo sabe
    throw new Error('Redirect failed')
  }
  
  // Si llegamos aquí, user debe existir (TypeScript necesita esta verificación explícita)
  if (user) {
    return user as UserProfile
  }
  
  // Fallback (no debería llegar aquí)
  throw new Error('User not found and auth is required')
}

export async function requireRole(allowedRoles: Role[]): Promise<UserProfile> {
  const user = await requireAuth()
  // TEMPORAL: Si auth está deshabilitado, permitir acceso con rol mock
  if (DISABLE_AUTH) {
    return user // Ya retorna un perfil mock desde requireAuth
  }
  if (!allowedRoles.includes(user.role as Role)) {
    redirect('/dashboard')
  }
  return user
}

export async function checkIsCreator() {
  const user = await getCurrentUser()
  return user !== null && ['creator', 'admin'].includes((user as UserProfile).role)
}

export async function checkIsAdmin() {
  const user = await getCurrentUser()
  return user !== null && (user as UserProfile).role === 'admin'
}
