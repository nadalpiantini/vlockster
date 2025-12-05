import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type Role = 'viewer' | 'creator' | 'moderator' | 'admin'

// Autenticación habilitada para producción
// Cambiar a true solo para testing local sin usuarios
const DISABLE_AUTH = false

export async function getCurrentUser() {
  // Auth bypass: Skip auth check when DISABLE_AUTH=true (testing only)
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

  // Auth bypass: Return mock guest user when DISABLE_AUTH=true
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

  // Redirect to login if user not authenticated
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
  // Auth bypass: Allow access with mock user when DISABLE_AUTH=true
  if (DISABLE_AUTH) {
    return user // Already returns mock profile from requireAuth
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
