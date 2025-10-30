import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Supabase client for client-side operations
 * Uses the anon key which respects Row Level Security (RLS) policies
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Create a Supabase client for server-side operations
 * This should be used in Server Components and API routes
 *
 * @example
 * ```tsx
 * // In a Server Component
 * import { createServerClient } from '@/lib/supabase'
 *
 * export default async function Page() {
 *   const supabase = createServerClient()
 *   const { data } = await supabase.from('accounts').select('*')
 *   return <div>{data}</div>
 * }
 * ```
 */
export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  })
}

/**
 * Create a Supabase admin client with elevated privileges
 * Uses the service role key which bypasses Row Level Security
 * ⚠️ ONLY use this in server-side code and API routes
 *
 * @example
 * ```tsx
 * // In an API route
 * import { createAdminClient } from '@/lib/supabase'
 *
 * export async function POST(request: Request) {
 *   const supabase = createAdminClient()
 *   const { data } = await supabase.from('accounts').insert({ ... })
 *   return Response.json(data)
 * }
 * ```
 */
export function createAdminClient() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
