import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

function createMockClient(): SupabaseClient<Database> {
  // Create a minimal mock that matches the SupabaseClient type
  // This will only be used in development when env vars are missing
  const mockClient = createBrowserClient<Database>(
    'https://mock.supabase.co',
    'mock-anon-key'
  )
  return mockClient
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
