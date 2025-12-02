import { createBrowserClient } from '@supabase/ssr'

// Placeholder URL and key for development when Supabase is not configured
const PLACEHOLDER_URL = 'https://placeholder.supabase.co'
const PLACEHOLDER_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PLACEHOLDER_KEY
  
  // Use placeholder values if not properly configured
  const url = supabaseUrl.includes('placeholder') || !supabaseUrl.startsWith('https://') 
    ? PLACEHOLDER_URL 
    : supabaseUrl
  const key = supabaseKey.includes('placeholder') 
    ? PLACEHOLDER_KEY 
    : supabaseKey
  
  return createBrowserClient(url, key)
}
