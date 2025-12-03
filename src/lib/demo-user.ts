// Demo user for testing purposes
export const DEMO_USER = {
  id: 'demo-user-001',
  email: 'demo@citizenconnect.pk',
  user_metadata: {
    full_name: 'Demo User',
    city: 'Lahore',
    role: 'citizen',
    phone: '0300-1234567'
  },
  created_at: '2025-01-01T00:00:00Z'
}

export const DEMO_PROFILE = {
  id: 'demo-user-001',
  full_name: 'Demo User',
  email: 'demo@citizenconnect.pk',
  phone: '0300-1234567',
  city: 'Lahore',
  role: 'citizen',
  avatar_url: undefined,
  bio: 'This is a demo account for testing CitizenConnect features.',
  is_verified: true,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z'
}

export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false
  return document.cookie.includes('demo_mode=true')
}

export function enableDemoMode(): void {
  if (typeof window === 'undefined') return
  document.cookie = 'demo_mode=true; path=/; max-age=86400; samesite=lax'
}

export function disableDemoMode(): void {
  if (typeof window === 'undefined') return
  document.cookie = 'demo_mode=; path=/; max-age=0'
}
