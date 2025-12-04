import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type Role = 'viewer' | 'creator' | 'moderator' | 'admin'

export async function getCurrentUser() {
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
  if (!user) redirect('/login')
  return user as UserProfile
}

export async function requireRole(allowedRoles: Role[]): Promise<UserProfile> {
  const user = await requireAuth()
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
