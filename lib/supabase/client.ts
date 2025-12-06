import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

function createMockClient() {
  return {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null, count: 0 }),
    }),
    auth: {
      getUser: async () => ({ data: { user: { id: 'mock-admin' } }, error: null }),
      signInWithPassword: async () => ({ data: { user: { id: 'mock-admin' } }, error: null }),
      signOut: async () => ({ error: null }),
    },
  }
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
      )
    }
    return createMockClient()
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}
