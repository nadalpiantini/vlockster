import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

function createMockClient() {
  const defaultResponse = { data: [], error: null, count: 0 }
  const builder: any = {
    select: () => builder,
    order: () => builder,
    range: () => builder,
    eq: () => builder,
    neq: () => builder,
    in: () => builder,
    single: () => Promise.resolve({ data: null, error: null, count: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
    then: (onFulfilled: any, onRejected: any) =>
      Promise.resolve(defaultResponse).then(onFulfilled, onRejected),
  }

  return {
    from: () => builder,
    auth: {
      getUser: async () => ({ data: { user: { id: 'mock-admin' } }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
    },
  }
}

export async function createClient() {
  const cookieStore = await cookies()

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

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored - cookies are handled by Next.js.
          }
        },
      },
    }
  )
}
