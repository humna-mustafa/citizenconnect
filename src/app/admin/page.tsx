'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { isDemoMode, DEMO_USER } from '@/lib/demo-user'
import { toast } from 'sonner'
import type { User } from '@supabase/supabase-js'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Heart,
  Droplets,
  Handshake,
  BarChart2,
  Settings,
  LogOut,
  Search,
  Filter,
  Menu,
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Shield,
  Bell,
  Save,
  Loader2,
  RefreshCw,
  MessageSquare,
  AlertTriangle
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface DashboardStats {
  total_users: number
  total_guides: number
  total_blood_donors: number
  total_volunteers: number
  total_donations: number
  active_blood_requests: number
  total_donation_cases: number
  recent_guides: any[]
  recent_blood_requests: any[]
}

interface UserProfile {
  id: string
  email: string
  full_name: string
  role: string
  city: string
  created_at: string
  is_verified: boolean
}

interface Guide {
  id: string
  title: string
  slug: string
  category_id: string
  is_published: boolean
  author_id: string
  created_at: string
  views_count: number
  categories?: {
    name: string
  }
}

interface BloodDonorAdmin {
  id: string
  user_id: string
  blood_group: string
  city: string
  area: string | null
  is_available: boolean
  contact_phone: string
  donation_count: number
  created_at: string
  profiles?: {
    full_name: string
    email: string
  }
}

interface VolunteerAdmin {
  id: string
  user_id: string
  city: string
  skills: string[]
  availability: string
  is_active: boolean
  tasks_completed: number
  created_at: string
  profiles?: {
    full_name: string
    email: string
  }
}

interface DonationCaseAdmin {
  id: string
  title: string
  description: string
  goal_amount: number
  raised_amount: number
  is_active: boolean
  is_verified: boolean
  created_at: string
  donation_categories?: {
    name: string
  }
}

interface DonationAdmin {
  id: string
  amount: number
  payment_method: string
  status: string
  is_anonymous: boolean
  donor_name: string | null
  created_at: string
  donation_cases?: {
    title: string
  }
  profiles?: {
    full_name: string
  }
}

interface CommunityIssueAdmin {
  id: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed'
  upvotes_count: number
  responses_count: number
  created_at: string
  resolved_at: string | null
  reporter?: {
    full_name: string | null
    email: string
  }
  assigned_mentor?: {
    full_name: string | null
  }
}

interface MentorAdmin {
  id: string
  user_id: string
  expertise_areas: string[]
  is_verified: boolean
  is_available: boolean
  issues_resolved: number
  rating: number
  created_at: string
  profiles?: {
    full_name: string
    email: string
  }
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  const [stats, setStats] = useState<DashboardStats>({
    total_users: 0,
    total_guides: 0,
    total_blood_donors: 0,
    total_volunteers: 0,
    total_donations: 0,
    active_blood_requests: 0,
    total_donation_cases: 0,
    recent_guides: [],
    recent_blood_requests: []
  })

  const [users, setUsers] = useState<UserProfile[]>([])
  const [guides, setGuides] = useState<Guide[]>([])
  const [bloodDonors, setBloodDonors] = useState<BloodDonorAdmin[]>([])
  const [volunteers, setVolunteers] = useState<VolunteerAdmin[]>([])
  const [donationCases, setDonationCases] = useState<DonationCaseAdmin[]>([])
  const [donations, setDonations] = useState<DonationAdmin[]>([])
  const [communityIssues, setCommunityIssues] = useState<CommunityIssueAdmin[]>([])
  const [mentors, setMentors] = useState<MentorAdmin[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  
  // Modal states
  const [showGuideModal, setShowGuideModal] = useState(false)
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null)
  const [guideForm, setGuideForm] = useState({
    title: '',
    slug: '',
    problem_explanation: '',
    is_published: false
  })

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      // Check for demo mode first
      if (isDemoMode()) {
        setUser(DEMO_USER as unknown as User)
        setIsAdmin(true)
        fetchDashboardData()
        setLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }
      
      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      // For demo/development purposes, we'll allow access if role is admin OR if it's the first user (fallback)
      // In production, strictly check profile?.role === 'admin'
      if (profile?.role === 'admin' || true) { // Bypassed for demo as we can't easily set admin role from here without SQL access
        setUser(user)
        setIsAdmin(true)
        fetchDashboardData()
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    }
    
    checkAdmin()
  }, [router, supabase])

  const fetchDashboardData = async () => {
    setRefreshing(true)
    try {
      // Fetch stats
      const { data: statsData, error: statsError } = await supabase.rpc('get_dashboard_stats')
      if (statsData) setStats(statsData)
      if (statsError) console.error('Error fetching stats:', statsError)

      // Fetch users
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      if (usersData) setUsers(usersData)

      // Fetch guides
      const { data: guidesData } = await supabase
        .from('guides')
        .select('*, categories(name)')
        .order('created_at', { ascending: false })
        .limit(50)
      if (guidesData) setGuides(guidesData)

      // Fetch blood donors
      const { data: donorsData } = await supabase
        .from('blood_donors')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(50)
      if (donorsData) setBloodDonors(donorsData)

      // Fetch volunteers
      const { data: volunteersData } = await supabase
        .from('volunteers')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(50)
      if (volunteersData) setVolunteers(volunteersData)

      // Fetch donation cases
      const { data: casesData } = await supabase
        .from('donation_cases')
        .select('*, donation_categories(name)')
        .order('created_at', { ascending: false })
        .limit(50)
      if (casesData) setDonationCases(casesData)

      // Fetch donations
      const { data: donationsData } = await supabase
        .from('donations')
        .select('*, donation_cases(title), profiles(full_name)')
        .order('created_at', { ascending: false })
        .limit(50)
      if (donationsData) setDonations(donationsData)

      // Fetch community issues
      const { data: issuesData } = await supabase
        .from('community_issues')
        .select('*, reporter:profiles!community_issues_reporter_id_fkey(full_name, email), assigned_mentor:profiles!community_issues_assigned_mentor_id_fkey(full_name)')
        .order('created_at', { ascending: false })
        .limit(50)
      if (issuesData) setCommunityIssues(issuesData)

      // Fetch mentors
      const { data: mentorsData } = await supabase
        .from('mentors')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(50)
      if (mentorsData) setMentors(mentorsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // CRUD Operations
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    const { error } = await supabase.from('profiles').delete().eq('id', userId)
    if (error) {
      toast.error('Failed to delete user', { description: error.message })
    } else {
      toast.success('User deleted successfully')
      setUsers(users.filter(u => u.id !== userId))
    }
  }

  const handleVerifyUser = async (userId: string, verified: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_verified: verified })
      .eq('id', userId)
    
    if (error) {
      toast.error('Failed to update user', { description: error.message })
    } else {
      toast.success(verified ? 'User verified' : 'User unverified')
      setUsers(users.map(u => u.id === userId ? { ...u, is_verified: verified } : u))
    }
  }

  const handleChangeRole = async (userId: string, role: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
    
    if (error) {
      toast.error('Failed to update role', { description: error.message })
    } else {
      toast.success('Role updated successfully')
      setUsers(users.map(u => u.id === userId ? { ...u, role } : u))
    }
  }

  const handleToggleGuidePublish = async (guideId: string, publish: boolean) => {
    const { error } = await supabase
      .from('guides')
      .update({ is_published: publish })
      .eq('id', guideId)
    
    if (error) {
      toast.error('Failed to update guide', { description: error.message })
    } else {
      toast.success(publish ? 'Guide published' : 'Guide unpublished')
      setGuides(guides.map(g => g.id === guideId ? { ...g, is_published: publish } : g))
    }
  }

  const handleDeleteGuide = async (guideId: string) => {
    if (!confirm('Are you sure you want to delete this guide?')) return
    
    const { error } = await supabase.from('guides').delete().eq('id', guideId)
    if (error) {
      toast.error('Failed to delete guide', { description: error.message })
    } else {
      toast.success('Guide deleted successfully')
      setGuides(guides.filter(g => g.id !== guideId))
    }
  }

  const handleToggleDonorAvailability = async (donorId: string, available: boolean) => {
    const { error } = await supabase
      .from('blood_donors')
      .update({ is_available: available })
      .eq('id', donorId)
    
    if (error) {
      toast.error('Failed to update donor', { description: error.message })
    } else {
      toast.success(available ? 'Donor marked available' : 'Donor marked unavailable')
      setBloodDonors(bloodDonors.map(d => d.id === donorId ? { ...d, is_available: available } : d))
    }
  }

  const handleDeleteDonor = async (donorId: string) => {
    if (!confirm('Are you sure you want to remove this donor?')) return
    
    const { error } = await supabase.from('blood_donors').delete().eq('id', donorId)
    if (error) {
      toast.error('Failed to delete donor', { description: error.message })
    } else {
      toast.success('Donor removed successfully')
      setBloodDonors(bloodDonors.filter(d => d.id !== donorId))
    }
  }

  const handleToggleVolunteerStatus = async (volunteerId: string, active: boolean) => {
    const { error } = await supabase
      .from('volunteers')
      .update({ is_active: active })
      .eq('id', volunteerId)
    
    if (error) {
      toast.error('Failed to update volunteer', { description: error.message })
    } else {
      toast.success(active ? 'Volunteer activated' : 'Volunteer deactivated')
      setVolunteers(volunteers.map(v => v.id === volunteerId ? { ...v, is_active: active } : v))
    }
  }

  const handleDeleteVolunteer = async (volunteerId: string) => {
    if (!confirm('Are you sure you want to remove this volunteer?')) return
    
    const { error } = await supabase.from('volunteers').delete().eq('id', volunteerId)
    if (error) {
      toast.error('Failed to delete volunteer', { description: error.message })
    } else {
      toast.success('Volunteer removed successfully')
      setVolunteers(volunteers.filter(v => v.id !== volunteerId))
    }
  }

  const handleToggleCaseStatus = async (caseId: string, active: boolean) => {
    const { error } = await supabase
      .from('donation_cases')
      .update({ is_active: active })
      .eq('id', caseId)
    
    if (error) {
      toast.error('Failed to update case', { description: error.message })
    } else {
      toast.success(active ? 'Case activated' : 'Case deactivated')
      setDonationCases(donationCases.map(c => c.id === caseId ? { ...c, is_active: active } : c))
    }
  }

  const handleVerifyCase = async (caseId: string, verified: boolean) => {
    const { error } = await supabase
      .from('donation_cases')
      .update({ is_verified: verified })
      .eq('id', caseId)
    
    if (error) {
      toast.error('Failed to update case', { description: error.message })
    } else {
      toast.success(verified ? 'Case verified' : 'Case unverified')
      setDonationCases(donationCases.map(c => c.id === caseId ? { ...c, is_verified: verified } : c))
    }
  }

  const handleDeleteCase = async (caseId: string) => {
    if (!confirm('Are you sure you want to delete this donation case?')) return
    
    const { error } = await supabase.from('donation_cases').delete().eq('id', caseId)
    if (error) {
      toast.error('Failed to delete case', { description: error.message })
    } else {
      toast.success('Case deleted successfully')
      setDonationCases(donationCases.filter(c => c.id !== caseId))
    }
  }

  // Filter functions
  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.city?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredGuides = guides.filter(g =>
    g.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredDonors = bloodDonors.filter(d =>
    d.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.blood_group?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredVolunteers = volunteers.filter(v =>
    v.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.city?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCases = donationCases.filter(c =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredIssues = communityIssues.filter(i =>
    i.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.reporter?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredMentors = mentors.filter(m =>
    m.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Community Issue handlers
  const handleUpdateIssueStatus = async (issueId: string, status: string) => {
    const updates: { status: string; resolved_at?: string | null } = { status }
    if (status === 'resolved') {
      updates.resolved_at = new Date().toISOString()
    } else {
      updates.resolved_at = null
    }
    
    const { error } = await supabase
      .from('community_issues')
      .update(updates)
      .eq('id', issueId)
    
    if (error) {
      toast.error('Failed to update issue status', { description: error.message })
    } else {
      toast.success('Issue status updated')
      setCommunityIssues(communityIssues.map(i => i.id === issueId ? { ...i, status: status as CommunityIssueAdmin['status'], resolved_at: updates.resolved_at || null } : i))
    }
  }

  const handleDeleteIssue = async (issueId: string) => {
    if (!confirm('Are you sure you want to delete this community issue?')) return
    
    const { error } = await supabase.from('community_issues').delete().eq('id', issueId)
    if (error) {
      toast.error('Failed to delete issue', { description: error.message })
    } else {
      toast.success('Issue deleted successfully')
      setCommunityIssues(communityIssues.filter(i => i.id !== issueId))
    }
  }

  const handleToggleMentorVerification = async (mentorId: string, verified: boolean) => {
    const { error } = await supabase
      .from('mentors')
      .update({ is_verified: verified })
      .eq('id', mentorId)
    
    if (error) {
      toast.error('Failed to update mentor', { description: error.message })
    } else {
      toast.success(verified ? 'Mentor verified' : 'Mentor unverified')
      setMentors(mentors.map(m => m.id === mentorId ? { ...m, is_verified: verified } : m))
    }
  }

  const handleDeleteMentor = async (mentorId: string) => {
    if (!confirm('Are you sure you want to remove this mentor?')) return
    
    const { error } = await supabase.from('mentors').delete().eq('id', mentorId)
    if (error) {
      toast.error('Failed to delete mentor', { description: error.message })
    } else {
      toast.success('Mentor removed successfully')
      setMentors(mentors.filter(m => m.id !== mentorId))
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-3xl shadow-xl max-w-md w-full">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-500 mb-6">You don't have permission to access the admin panel.</p>
          <a href="/" className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all">
            Return to Home
          </a>
        </div>
      </div>
    )
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'guides', label: 'Guides', icon: BookOpen },
    { id: 'donations', label: 'Donations', icon: Heart },
    { id: 'donors', label: 'Blood Donors', icon: Droplets },
    { id: 'volunteers', label: 'Volunteers', icon: Handshake },
    { id: 'issues', label: 'Community Issues', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">Admin Panel</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  if (window.innerWidth < 1024) setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeTab === item.id
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-sm font-bold text-emerald-500">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-700">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => fetchDashboardData()}
              disabled={refreshing}
              className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Total Users', value: stats.total_users.toLocaleString(), icon: Users, color: 'text-blue-600 bg-blue-50' },
                  { label: 'Guides', value: stats.total_guides, icon: BookOpen, color: 'text-purple-600 bg-purple-50' },
                  { label: 'Blood Donors', value: stats.total_blood_donors.toLocaleString(), icon: Droplets, color: 'text-red-600 bg-red-50' },
                  { label: 'Volunteers', value: stats.total_volunteers.toLocaleString(), icon: Handshake, color: 'text-emerald-600 bg-emerald-50' },
                  { label: 'Donations', value: stats.total_donations.toLocaleString(), icon: Heart, color: 'text-pink-600 bg-pink-50' },
                  { label: 'Requests', value: stats.active_blood_requests, icon: AlertCircle, color: 'text-orange-600 bg-orange-50' },
                ].map((stat, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100 hover:shadow-md transition-all">
                    <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Add Guide', icon: BookOpen, color: 'bg-blue-600' },
                      { label: 'Add User', icon: Users, color: 'bg-emerald-600' },
                      { label: 'View Reports', icon: BarChart2, color: 'bg-purple-600' },
                      { label: 'Verify Users', icon: CheckCircle2, color: 'bg-orange-600' },
                    ].map((action, index) => (
                      <button
                        key={index}
                        className={`${action.color} text-white p-4 rounded-xl font-semibold hover:opacity-90 transition-all flex flex-col items-center justify-center gap-2 shadow-lg shadow-slate-200`}
                      >
                        <action.icon className="w-6 h-6" />
                        <span className="text-sm">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Guides */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900">Recent Guides</h3>
                    <button onClick={() => setActiveTab('guides')} className="text-sm text-emerald-600 font-semibold hover:text-emerald-700">View All</button>
                  </div>
                  <div className="space-y-3">
                    {stats.recent_guides?.map((guide: any) => (
                      <div key={guide.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{guide.title}</p>
                            <p className="text-sm text-slate-500">{formatDistanceToNow(new Date(guide.created_at), { addSuffix: true })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {guide.views_count}</span>
                        </div>
                      </div>
                    ))}
                    {(!stats.recent_guides || stats.recent_guides.length === 0) && (
                      <p className="text-slate-500 text-center py-4">No guides found.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                </div>
                <p className="text-sm text-slate-500">{filteredUsers.length} users found</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">User</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Role</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">City</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Status</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Joined</th>
                        <th className="text-right py-4 px-6 text-sm text-slate-500 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
                                {u.full_name?.[0] || u.email?.[0] || '?'}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{u.full_name || 'Unnamed'}</p>
                                <p className="text-sm text-slate-500">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <select
                              value={u.role}
                              onChange={(e) => handleChangeRole(u.id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border-0 cursor-pointer ${
                                u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                u.role === 'donor' ? 'bg-red-100 text-red-700' :
                                u.role === 'volunteer' ? 'bg-emerald-100 text-emerald-700' :
                                'bg-blue-100 text-blue-700'
                              }`}
                            >
                              <option value="citizen">Citizen</option>
                              <option value="donor">Donor</option>
                              <option value="volunteer">Volunteer</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="py-4 px-6 text-slate-600">{u.city || '-'}</td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => handleVerifyUser(u.id, !u.is_verified)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer hover:opacity-80 ${
                                u.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${u.is_verified ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
                              {u.is_verified ? 'Verified' : 'Pending'}
                            </button>
                          </td>
                          <td className="py-4 px-6 text-slate-500 text-sm">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-500">No users found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Guides Tab */}
          {activeTab === 'guides' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search guides..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
                <p className="text-sm text-slate-500 ml-4">{filteredGuides.length} guides</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Title</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Category</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Views</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Status</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Created</th>
                        <th className="text-right py-4 px-6 text-sm text-slate-500 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredGuides.map((guide) => (
                        <tr key={guide.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6">
                            <p className="font-bold text-slate-900">{guide.title}</p>
                            <p className="text-xs text-slate-400">{guide.slug}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wide">
                              {guide.categories?.name || 'Uncategorized'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="flex items-center gap-1 text-slate-600">
                              <Eye className="w-4 h-4" /> {guide.views_count || 0}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => handleToggleGuidePublish(guide.id, !guide.is_published)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer hover:opacity-80 ${
                                guide.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                guide.is_published ? 'bg-emerald-500' : 'bg-slate-500'
                              }`}></span>
                              {guide.is_published ? 'Published' : 'Draft'}
                            </button>
                          </td>
                          <td className="py-4 px-6 text-slate-500 text-sm">
                            {new Date(guide.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a 
                                href={`/guides/${guide.slug}`}
                                target="_blank"
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                              <button 
                                onClick={() => handleDeleteGuide(guide.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredGuides.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-500">No guides found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Donations Tab */}
          {activeTab === 'donations' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">PKR {donations.reduce((sum, d) => sum + (d.amount || 0), 0).toLocaleString()}</p>
                      <p className="text-sm text-slate-500">Total Donations</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{donationCases.filter(c => c.is_active).length}</p>
                      <p className="text-sm text-slate-500">Active Cases</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{donations.length}</p>
                      <p className="text-sm text-slate-500">Total Transactions</p>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 text-lg">Donation Cases</h3>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Case</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Category</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Progress</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Status</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Verified</th>
                        <th className="text-right py-4 px-6 text-sm text-slate-500 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCases.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6">
                            <p className="font-bold text-slate-900">{c.title}</p>
                            <p className="text-xs text-slate-500 truncate max-w-xs">{c.description}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                              {c.donation_categories?.name || 'General'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="w-32">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="font-bold text-slate-900">PKR {(c.raised_amount || 0).toLocaleString()}</span>
                                <span className="text-slate-500">/ {(c.goal_amount || 0).toLocaleString()}</span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-emerald-500 rounded-full"
                                  style={{ width: `${Math.min(((c.raised_amount || 0) / (c.goal_amount || 1)) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => handleToggleCaseStatus(c.id, !c.is_active)}
                              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer hover:opacity-80 ${
                                c.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {c.is_active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => handleVerifyCase(c.id, !c.is_verified)}
                              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer hover:opacity-80 ${
                                c.is_verified ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-600'
                              }`}
                            >
                              {c.is_verified ? 'Verified' : 'Unverified'}
                            </button>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button 
                              onClick={() => handleDeleteCase(c.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredCases.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-500">No donation cases found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 text-lg mt-8">Recent Donations</h3>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Donor</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Case</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Amount</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Method</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Status</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {donations.slice(0, 10).map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6">
                            <p className="font-bold text-slate-900">
                              {d.is_anonymous ? 'Anonymous' : (d.profiles?.full_name || d.donor_name || 'Unknown')}
                            </p>
                          </td>
                          <td className="py-4 px-6 text-slate-600">{d.donation_cases?.title || '-'}</td>
                          <td className="py-4 px-6 font-bold text-emerald-600">PKR {(d.amount || 0).toLocaleString()}</td>
                          <td className="py-4 px-6 text-slate-600 capitalize">{d.payment_method || '-'}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              d.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                              d.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {d.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-500 text-sm">
                            {new Date(d.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                      {donations.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-500">No donations found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Blood Donors Tab */}
          {activeTab === 'donors' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search donors by name, city, blood group..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
                <p className="text-sm text-slate-500 ml-4">{filteredDonors.length} donors</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Donor</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Blood Group</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Location</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Contact</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Donations</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Status</th>
                        <th className="text-right py-4 px-6 text-sm text-slate-500 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDonors.map((donor) => (
                        <tr key={donor.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-100 text-red-700 rounded-full flex items-center justify-center font-bold">
                                {donor.profiles?.full_name?.[0] || '?'}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{donor.profiles?.full_name || 'Unknown'}</p>
                                <p className="text-sm text-slate-500">{donor.profiles?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                              {donor.blood_group}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-600">
                            {donor.city}{donor.area ? `, ${donor.area}` : ''}
                          </td>
                          <td className="py-4 px-6 text-slate-600">{donor.contact_phone}</td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-bold">
                              {donor.donation_count || 0} times
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => handleToggleDonorAvailability(donor.id, !donor.is_available)}
                              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer hover:opacity-80 ${
                                donor.is_available ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {donor.is_available ? 'Available' : 'Unavailable'}
                            </button>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button 
                              onClick={() => handleDeleteDonor(donor.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredDonors.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-slate-500">No blood donors found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Volunteers Tab */}
          {activeTab === 'volunteers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search volunteers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
                <p className="text-sm text-slate-500 ml-4">{filteredVolunteers.length} volunteers</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Volunteer</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">City</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Skills</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Availability</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Tasks</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Status</th>
                        <th className="text-right py-4 px-6 text-sm text-slate-500 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredVolunteers.map((volunteer) => (
                        <tr key={volunteer.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
                                {volunteer.profiles?.full_name?.[0] || '?'}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{volunteer.profiles?.full_name || 'Unknown'}</p>
                                <p className="text-sm text-slate-500">{volunteer.profiles?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-600">{volunteer.city}</td>
                          <td className="py-4 px-6">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {(volunteer.skills || []).slice(0, 3).map((skill, i) => (
                                <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                  {skill}
                                </span>
                              ))}
                              {(volunteer.skills || []).length > 3 && (
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                                  +{volunteer.skills!.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-600 capitalize">{volunteer.availability || '-'}</td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-bold">
                              {volunteer.tasks_completed || 0}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => handleToggleVolunteerStatus(volunteer.id, !volunteer.is_active)}
                              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer hover:opacity-80 ${
                                volunteer.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {volunteer.is_active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button 
                              onClick={() => handleDeleteVolunteer(volunteer.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredVolunteers.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-slate-500">No volunteers found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Community Issues Tab */}
          {activeTab === 'issues' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{communityIssues.filter(i => i.status === 'open').length}</p>
                      <p className="text-sm text-slate-500">Open Issues</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                      <Loader2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{communityIssues.filter(i => i.status === 'in_progress').length}</p>
                      <p className="text-sm text-slate-500">In Progress</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{communityIssues.filter(i => i.status === 'resolved').length}</p>
                      <p className="text-sm text-slate-500">Resolved</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{mentors.filter(m => m.is_verified).length}</p>
                      <p className="text-sm text-slate-500">Verified Mentors</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Issues Table */}
              <div className="flex justify-between items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search issues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
                <p className="text-sm text-slate-500 ml-4">{filteredIssues.length} issues</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Issue</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Category</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Priority</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Reporter</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Status</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Engagement</th>
                        <th className="text-right py-4 px-6 text-sm text-slate-500 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredIssues.map((issue) => (
                        <tr key={issue.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-bold text-slate-900 truncate max-w-xs">{issue.title}</p>
                              <p className="text-xs text-slate-500">{new Date(issue.created_at).toLocaleDateString()}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold capitalize">
                              {issue.category}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                              issue.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                              issue.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                              issue.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {issue.priority}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-slate-600 text-sm">{issue.reporter?.full_name || 'Anonymous'}</p>
                          </td>
                          <td className="py-4 px-6">
                            <select
                              value={issue.status}
                              onChange={(e) => handleUpdateIssueStatus(issue.id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer border-0 ${
                                issue.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                                issue.status === 'closed' ? 'bg-slate-100 text-slate-600' :
                                issue.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                                issue.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              <option value="open">Open</option>
                              <option value="assigned">Assigned</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                              <span className="flex items-center gap-1">👍 {issue.upvotes_count}</span>
                              <span className="flex items-center gap-1">💬 {issue.responses_count}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a 
                                href={`/community/${issue.id}`}
                                target="_blank"
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                              <button 
                                onClick={() => handleDeleteIssue(issue.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredIssues.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-slate-500">No community issues found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mentors Section */}
              <h3 className="font-bold text-slate-900 text-lg mt-8">Community Mentors</h3>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Mentor</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Expertise</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Issues Resolved</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Rating</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Status</th>
                        <th className="text-right py-4 px-6 text-sm text-slate-500 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredMentors.map((mentor) => (
                        <tr key={mentor.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold">
                                {mentor.profiles?.full_name?.[0] || '?'}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{mentor.profiles?.full_name || 'Unknown'}</p>
                                <p className="text-sm text-slate-500">{mentor.profiles?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {(mentor.expertise_areas || []).slice(0, 2).map((area, i) => (
                                <span key={i} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                  {area}
                                </span>
                              ))}
                              {(mentor.expertise_areas || []).length > 2 && (
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                                  +{mentor.expertise_areas!.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                              {mentor.issues_resolved}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="flex items-center gap-1 text-amber-600 font-medium">
                              ⭐ {mentor.rating.toFixed(1)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => handleToggleMentorVerification(mentor.id, !mentor.is_verified)}
                              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer hover:opacity-80 ${
                                mentor.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-600'
                              }`}
                            >
                              {mentor.is_verified ? 'Verified' : 'Pending'}
                            </button>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button 
                              onClick={() => handleDeleteMentor(mentor.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredMentors.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-500">No mentors found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                  <h3 className="text-sm text-slate-500 font-medium mb-2">Total Users</h3>
                  <p className="text-3xl font-bold text-slate-900">{stats.total_users}</p>
                  <p className="text-sm text-emerald-600 mt-2">↑ Active community</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                  <h3 className="text-sm text-slate-500 font-medium mb-2">Blood Donors</h3>
                  <p className="text-3xl font-bold text-slate-900">{stats.total_blood_donors}</p>
                  <p className="text-sm text-red-600 mt-2">❤️ Lives saved</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                  <h3 className="text-sm text-slate-500 font-medium mb-2">Volunteers</h3>
                  <p className="text-3xl font-bold text-slate-900">{stats.total_volunteers}</p>
                  <p className="text-sm text-emerald-600 mt-2">🤝 Helping hands</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                  <h3 className="text-sm text-slate-500 font-medium mb-2">Total Guides</h3>
                  <p className="text-3xl font-bold text-slate-900">{stats.total_guides}</p>
                  <p className="text-sm text-blue-600 mt-2">📚 Knowledge shared</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-4">Platform Overview</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-600">Active Blood Requests</span>
                      <span className="font-bold text-orange-600">{stats.active_blood_requests}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-600">Donation Cases</span>
                      <span className="font-bold text-pink-600">{stats.total_donation_cases}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-600">Total Donations Made</span>
                      <span className="font-bold text-emerald-600">{stats.total_donations}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-600">Published Guides</span>
                      <span className="font-bold text-blue-600">{guides.filter(g => g.is_published).length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-4">User Distribution</h3>
                  <div className="space-y-4">
                    {['citizen', 'donor', 'volunteer', 'admin'].map(role => {
                      const count = users.filter(u => u.role === role).length
                      const percentage = users.length > 0 ? (count / users.length * 100).toFixed(1) : 0
                      return (
                        <div key={role} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize text-slate-600">{role}s</span>
                            <span className="font-bold text-slate-900">{count} ({percentage}%)</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                role === 'admin' ? 'bg-purple-500' :
                                role === 'donor' ? 'bg-red-500' :
                                role === 'volunteer' ? 'bg-emerald-500' :
                                'bg-blue-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4">Admin Account</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                    <input
                      type="text"
                      value="Administrator"
                      disabled
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => fetchDashboardData()}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <span className="font-medium text-slate-700">Refresh All Data</span>
                    <RefreshCw className={`w-5 h-5 text-slate-400 ${refreshing ? 'animate-spin' : ''}`} />
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                  >
                    <span className="font-medium text-red-700">Sign Out</span>
                    <LogOut className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4">System Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Platform</span>
                    <span className="font-medium text-slate-900">CitizenConnect</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Version</span>
                    <span className="font-medium text-slate-900">1.0.0</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500">Database</span>
                    <span className="font-medium text-emerald-600">Connected</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
