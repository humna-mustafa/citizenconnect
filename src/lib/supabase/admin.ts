// Admin Dashboard Utilities
// Helper functions for admin operations

import { createClient } from './client'

export async function getAdminStats() {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.rpc('get_dashboard_stats')
    
    if (error) throw error
    
    return {
      success: true,
      stats: {
        totalUsers: data.total_users || 0,
        totalGuides: data.total_guides || 0,
        totalBloodDonors: data.total_blood_donors || 0,
        totalVolunteers: data.total_volunteers || 0,
        totalDonations: data.total_donations || 0,
        activeBloodRequests: data.active_blood_requests || 0,
        totalDonationCases: data.total_donation_cases || 0,
        recentGuides: data.recent_guides || [],
        recentBloodRequests: data.recent_blood_requests || []
      }
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return { success: false, stats: null }
  }
}

export async function getAllUsers(limit = 50) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  
  return { data, error }
}

export async function updateUserRole(userId: string, newRole: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)
  
  return { data, error }
}

export async function verifyUser(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_verified: true })
    .eq('id', userId)
  
  return { data, error }
}

export async function getAllGuides(limit = 50) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('guides')
    .select(`
      *,
      categories(name),
      profiles(full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  return { data, error }
}

export async function publishGuide(guideId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('guides')
    .update({ is_published: true })
    .eq('id', guideId)
  
  return { data, error }
}

export async function unpublishGuide(guideId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('guides')
    .update({ is_published: false })
    .eq('id', guideId)
  
  return { data, error }
}

export async function deleteGuide(guideId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('guides')
    .delete()
    .eq('id', guideId)
  
  return { data, error }
}

export async function getAllDonationCases(limit = 50) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('donation_cases')
    .select(`
      *,
      donation_categories(name),
      profiles(full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  return { data, error }
}

export async function verifyDonationCase(caseId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('donation_cases')
    .update({ is_verified: true })
    .eq('id', caseId)
  
  return { data, error }
}

export async function deactivateDonationCase(caseId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('donation_cases')
    .update({ is_active: false })
    .eq('id', caseId)
  
  return { data, error }
}

export async function getAllBloodRequests(limit = 50) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('blood_requests')
    .select(`
      *,
      profiles(full_name, phone)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  return { data, error }
}

export async function closeBloodRequest(requestId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('blood_requests')
    .update({ status: 'fulfilled' })
    .eq('id', requestId)
  
  return { data, error }
}

export async function getContactMessages(limit = 50) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  
  return { data, error }
}

export async function resolveContactMessage(messageId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ is_resolved: true })
    .eq('id', messageId)
  
  return { data, error }
}

export async function getSiteStatsHistory(days = 30) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('site_stats')
    .select('*')
    .order('stat_date', { ascending: true })
    .limit(days)
  
  return { data, error }
}

export async function getTopContributors(limit = 10) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .rpc('get_top_contributors', { limit_count: limit })
  
  return { data, error }
}

export async function getTopBloodDonors(limit = 10) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .rpc('get_top_blood_donors', { limit_count: limit })
  
  return { data, error }
}
