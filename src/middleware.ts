import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Skip Supabase session management if credentials are not properly configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder') || !supabaseUrl.startsWith('https://')) {
    return NextResponse.next()
  }

  // Demo mode bypass for testing protected routes
  // Check for demo_session cookie or query param
  const demoMode = request.cookies.get('demo_mode')?.value === 'true' || 
                   request.nextUrl.searchParams.get('demo') === 'true'
  
  if (demoMode) {
    // Set demo mode cookie if accessed via query param
    if (request.nextUrl.searchParams.get('demo') === 'true') {
      const response = NextResponse.next()
      response.cookies.set('demo_mode', 'true', { 
        path: '/', 
        maxAge: 60 * 60 * 24, // 24 hours
        sameSite: 'lax'
      })
      return response
    }
    // Allow access to protected routes in demo mode
    return NextResponse.next()
  }
  
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
