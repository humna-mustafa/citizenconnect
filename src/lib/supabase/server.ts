import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If env vars are missing or clearly placeholders, provide a lightweight
  // development mock client so signup/login flows can be tested locally
    if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL.includes('placeholder')) {
      console.warn('Supabase env vars missing or placeholder detected — using dev mock client')

    // Simple in-memory mock implementation covering the methods used by the app
    const mockProfiles: Array<{ id: string; full_name?: string; email?: string }> = []

    const mockClient: any = {
      auth: {
        async signUp({ email }: { email: string }) {
          // create a mock profile
          const id = `mock_${Date.now()}`
          mockProfiles.push({ id, full_name: email, email })
          return { error: null }
        },
        async signInWithPassword({ email, password }: { email: string; password: string }) {
          // accept any password for mock
          const found = mockProfiles.find((p) => p.email === email)
          if (!found) return { error: { message: 'User not found' } }
          return { error: null }
        },
        async resetPasswordForEmail(_email: string, _opts: any) {
          return { error: null }
        },
        async signOut() {
          return
        },
      },
      from(table: string) {
        return {
          select: async (columns: string) => {
            if (table === 'profiles') {
              return { data: mockProfiles.map((p) => ({ id: p.id })), error: null }
            }
            return { data: [], error: null }
          },
          insert: async (rows: any) => {
            if (table === 'profiles') {
              rows.forEach((r: any) => mockProfiles.push({ id: `mock_${Date.now()}`, ...r }))
              return { data: rows, error: null }
            }
            return { data: rows, error: null }
          },
        }
      },
      rpc: async (_name: string) => {
        return { data: [{ now: new Date().toISOString() }], error: null }
      },
    }

    return mockClient
  }

  return createServerClient(
      SUPABASE_URL,
      SUPABASE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
