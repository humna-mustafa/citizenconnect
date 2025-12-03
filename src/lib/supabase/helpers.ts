// Supabase Helper Functions
// Reusable functions for common database operations

import { createClient } from './client'
import type { Database } from './database.types'

type Tables = Database['public']['Tables']
type Guide = Tables['guides']['Row']
type BloodDonor = Tables['blood_donors']['Row']
type BloodRequest = Tables['blood_requests']['Row']
type DonationCase = Tables['donation_cases']['Row']
type Volunteer = Tables['volunteers']['Row']

// =====================================================
// GUIDES
// =====================================================

export async function getGuides(options?: {
  category?: string
  search?: string
  sort?: 'recent' | 'popular' | 'rated' | 'upvoted'
  limit?: number
}) {
  const supabase = createClient()
  
  let query = supabase
    .from('guides')
    .select(`
      *,
      categories(name, slug, icon),
      profiles(full_name)
    `)
    .eq('is_published', true)

  if (options?.category) {
    query = query.eq('categories.slug', options.category)
  }

  if (options?.search) {
    query = query.or(`title.ilike.%${options.search}%,problem_explanation.ilike.%${options.search}%`)
  }

  if (options?.sort === 'popular') {
    query = query.order('views_count', { ascending: false })
  } else if (options?.sort === 'rated') {
    query = query.order('average_rating', { ascending: false })
  } else if (options?.sort === 'upvoted') {
    query = query.order('upvotes_count', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  return { data, error }
}

export async function getGuideBySlug(slug: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('guides')
    .select(`
      *,
      categories(name, slug, icon),
      profiles(full_name, avatar_url)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (data && !error) {
    // Increment view count
    await supabase.rpc('increment_guide_views', { guide_id: data.id })
  }

  return { data, error }
}

export async function createGuide(guideData: Partial<Guide>) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const { data, error } = await supabase
    .from('guides')
    .insert([
      {
        ...guideData,
        author_id: user.id,
      }
    ])
    .select()
    .single()

  return { data, error }
}

export async function upvoteGuide(guideId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const { data, error } = await supabase
    .from('guide_upvotes')
    .insert([{ guide_id: guideId, user_id: user.id }])

  return { data, error }
}

export async function removeUpvote(guideId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const { data, error } = await supabase
    .from('guide_upvotes')
    .delete()
    .eq('guide_id', guideId)
    .eq('user_id', user.id)

  return { data, error }
}

// =====================================================
// BLOOD BANK
// =====================================================

export async function getBloodDonors(filters?: {
  bloodGroup?: string
  city?: string
}) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .rpc('get_filtered_blood_donors', {
      blood_group_filter: filters?.bloodGroup || null,
      city_filter: filters?.city || null
    })

  return { data, error }
}

export async function createBloodRequest(requestData: Partial<BloodRequest>) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const { data, error } = await supabase
    .from('blood_requests')
    .insert([
      {
        ...requestData,
        requester_id: user.id,
      }
    ])
    .select()
    .single()

  return { data, error }
}

export async function registerAsBloodDonor(donorData: Partial<BloodDonor>) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const { data, error } = await supabase
    .from('blood_donors')
    .upsert([
      {
        ...donorData,
        user_id: user.id,
      }
    ])
    .select()
    .single()

  return { data, error }
}

// =====================================================
// DONATIONS
// =====================================================

export async function getDonationCases(filters?: {
  category?: string
  isActive?: boolean
  search?: string
  urgency?: string
}) {
  const supabase = createClient()
  
  let query = supabase
    .from('donation_cases')
    .select(`
      *,
      donation_categories(name, slug),
      profiles(full_name)
    `)

  if (filters?.isActive !== undefined) {
    query = query.eq('is_active', filters.isActive)
  }

  if (filters?.category) {
    query = query.eq('donation_categories.slug', filters.category)
  }

  if (filters?.urgency) {
    query = query.eq('urgency', filters.urgency)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,city.ilike.%${filters.search}%`)
  }

  query = query.order('created_at', { ascending: false })

  const { data, error } = await query

  return { data, error }
}

export async function createDonation(donationData: {
  case_id: string
  amount: number
  payment_method?: string
  is_anonymous?: boolean
  donor_message?: string
}) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const { data, error } = await supabase
    .from('donations')
    .insert([
      {
        ...donationData,
        donor_id: user.id,
        status: 'completed', // In production, this would be 'pending' until payment confirmed
      }
    ])
    .select()
    .single()

  return { data, error }
}

// =====================================================
// VOLUNTEERS
// =====================================================

export async function getVolunteers(filters?: {
  city?: string
  skill?: string
}) {
  const supabase = createClient()
  
  let query = supabase
    .from('volunteers')
    .select(`
      *,
      profiles(full_name, email)
    `)
    .eq('is_active', true)

  if (filters?.city) {
    query = query.eq('city', filters.city)
  }

  if (filters?.skill) {
    query = query.contains('skills', [filters.skill])
  }

  const { data, error } = await query

  return { data, error }
}

export async function registerAsVolunteer(volunteerData: Partial<Volunteer>) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const { data, error } = await supabase
    .from('volunteers')
    .upsert([
      {
        ...volunteerData,
        user_id: user.id,
      }
    ])
    .select()
    .single()

  return { data, error }
}

// =====================================================
// COMMENTS
// =====================================================

export async function getComments(guideId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles(full_name, avatar_url)
    `)
    .eq('guide_id', guideId)
    .is('parent_id', null)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function createComment(commentData: {
  guide_id: string
  content: string
  parent_id?: string
  is_tip?: boolean
}) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        ...commentData,
        user_id: user.id,
      }
    ])
    .select()
    .single()

  return { data, error }
}

// =====================================================
// EMERGENCY GUIDES
// =====================================================

export async function getEmergencyGuides() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('emergency_guides')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return { data, error }
}

// =====================================================
// CONTACT & FEEDBACK
// =====================================================

export async function createContactMessage(messageData: {
  name: string
  email: string
  subject: string
  message: string
  category?: string
}) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([messageData])
    .select()
    .single()

  return { data, error }
}

// =====================================================
// USER CONTRIBUTIONS
// =====================================================

export async function getUserContributions(userId: string) {
  const supabase = createClient()
  
  // Get monetary donations
  const { data: donations } = await supabase
    .from('donations')
    .select('*')
    .eq('donor_id', userId)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(5)

  // Get guides created
  const { data: guides } = await supabase
    .from('guides')
    .select('*')
    .eq('author_id', userId)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(5)

  // Combine and sort
  const contributions = [
    ...(donations?.map(d => ({
      id: d.id,
      type: 'donation',
      title: 'Donated to Cause',
      description: `PKR ${d.amount} donated`,
      date: new Date(d.created_at).toLocaleDateString(),
      created_at: d.created_at
    })) || []),
    ...(guides?.map(g => ({
      id: g.id,
      type: 'guide',
      title: 'Published Guide',
      description: g.title,
      date: new Date(g.created_at).toLocaleDateString(),
      created_at: g.created_at
    })) || [])
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return contributions
}

// =====================================================
// DASHBOARD STATS
// =====================================================

export async function getDashboardStats() {
  const supabase = createClient()
  
  const { data, error } = await supabase.rpc('get_dashboard_stats')

  return { data, error }
}

export async function getUserStats(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.rpc('get_user_stats', {
    user_uuid: userId
  })

  return { data, error }
}

export async function getTopContributors(limit = 5) {
  const supabase = createClient()
  
  const { data, error } = await supabase.rpc('get_top_contributors', {
    limit_count: limit
  })

  return { data, error }
}

// =====================================================
// NOTIFICATIONS
// =====================================================

export async function getNotifications(limit = 20) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  return { data, error }
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)

  return { data, error }
}

// =====================================================
// SEARCH
// =====================================================

export async function searchGuides(query: string, limit = 10) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .rpc('search_guides', {
      search_query: query,
      limit_count: limit
    })

  return { data, error }
}

// =====================================================
// REALTIME SUBSCRIPTIONS
// =====================================================

export function subscribeToBloodRequests(
  city: string,
  bloodGroup: string,
  callback: (payload: any) => void
) {
  const supabase = createClient()
  
  return supabase
    .channel('blood_requests')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'blood_requests',
        filter: `city=eq.${city},blood_group=eq.${bloodGroup}`
      },
      callback
    )
    .subscribe()
}

export function subscribeToNotifications(
  userId: string,
  callback: (payload: any) => void
) {
  const supabase = createClient()
  
  return supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe()
}
