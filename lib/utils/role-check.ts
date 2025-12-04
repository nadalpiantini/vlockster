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

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

export async function requireRole(allowedRoles: Role[]) {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.role as Role)) {
    redirect('/dashboard')
  }
  return user
}

export async function checkIsCreator() {
  const user = await getCurrentUser()
  return user && ['creator', 'admin'].includes(user.role)
}

export async function checkIsAdmin() {
  const user = await getCurrentUser()
  return user && user.role === 'admin'
}
