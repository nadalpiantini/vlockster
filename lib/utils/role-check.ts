import { createClient } from '@/lib/supabase/server'

export type Role = 'viewer' | 'creator' | 'moderator' | 'admin'

/**
 * ⚠️ SECURITY WARNING: DISABLE_AUTH Feature Flag
 * 
 * This flag should ONLY be used for local development/testing when Supabase auth
 * is not configured. NEVER enable this in production.
 * 
 * When DISABLE_AUTH = true:
 * - All auth checks are bypassed
 * - Returns mock guest user with 'viewer' role
 * - All protected routes become accessible
 * 
 * Production Safety:
 * - This constant is hardcoded to false
 * - To enable for testing, manually change to true
 * - Always verify it's false before deploying to production
 * 
 * @deprecated Consider removing this feature flag entirely if not needed
 */
const HAS_SUPABASE_ENV = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
// Always open - no auth required
const DISABLE_AUTH = true

export async function getCurrentUser() {
  // Always open - return mock admin user if no real user
  if (DISABLE_AUTH) {
    // Try to get real user first if Supabase is configured
    if (HAS_SUPABASE_ENV) {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) return profile
      }
    }

    // Return mock admin user
    return {
      id: 'mock-admin',
      email: 'admin@vlockster.test',
      name: 'Admin User',
      bio: null,
      avatar_url: null,
      role: 'admin',
      role_scope: null,
      is_premium_creator: false,
      public_profile_slug: null,
      preferred_lang: 'en',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as UserProfile
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

  // Always return mock admin user - everything is open
  if (!user) {
    return {
      id: 'mock-admin',
      email: 'admin@vlockster.test',
      name: 'Admin User',
      bio: null,
      avatar_url: null,
      role: 'admin' as Role,
      role_scope: null,
      is_premium_creator: false,
      public_profile_slug: null,
      preferred_lang: 'en',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as UserProfile
  }
  
  return user as UserProfile
}

export async function requireRole(_allowedRoles: Role[]): Promise<UserProfile> {
  const user = await requireAuth()
  // Always allow access - everything is open
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
