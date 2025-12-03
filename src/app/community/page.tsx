'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { 
  Search, Filter, MapPin, Clock, User, ThumbsUp, MessageCircle, 
  AlertTriangle, CheckCircle2, ArrowRight, Plus, Eye, ChevronDown,
  Flame, TrendingUp, Loader2, Shield, Users
} from 'lucide-react'

interface CommunityIssue {
  id: string
  ticket_number: string
  title: string
  description: string
  category_id: string | null
  category: {
    name: string
    slug: string
  } | null
  city: string
  area: string | null
  address: string | null
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed'
  images: string[]
  upvotes: number
  views_count: number
  created_at: string
  reporter: {
    full_name: string | null
    avatar_url: string | null
  } | null
  assigned_mentor: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

interface Mentor {
  id: string
  user_id: string
  expertise_areas: string[]
  issues_resolved: number
  rating: number
  is_available: boolean
  profiles: {
    full_name: string | null
    avatar_url: string | null
  }
}

// Using community_contributors table instead of mentors

const categoryColors: Record<string, string> = {
  infrastructure: 'bg-orange-100 text-orange-700',
  sanitation: 'bg-green-100 text-green-700',
  utilities: 'bg-blue-100 text-blue-700',
  safety: 'bg-red-100 text-red-700',
  environment: 'bg-emerald-100 text-emerald-700',
  transportation: 'bg-purple-100 text-purple-700',
  noise: 'bg-yellow-100 text-yellow-700',
  animals: 'bg-pink-100 text-pink-700',
  other: 'bg-slate-100 text-slate-700',
  roads: 'bg-orange-100 text-orange-700',
  electricity: 'bg-amber-100 text-amber-700',
  water: 'bg-cyan-100 text-cyan-700',
  traffic: 'bg-violet-100 text-violet-700'
}

const priorityColors: Record<string, string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600'
}

const statusColors: Record<string, string> = {
  open: 'bg-yellow-100 text-yellow-700',
  assigned: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-purple-100 text-purple-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-slate-100 text-slate-700'
}

export default function CommunityPage() {
  const [issues, setIssues] = useState<CommunityIssue[]>([])
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'upvotes' | 'responses'>('recent')
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [upvotedIssues, setUpvotedIssues] = useState<Set<string>>(new Set())
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolved: 0,
    mentors: 0
  })

  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      // Get user's upvoted issues
      if (user) {
        const { data: upvotes } = await supabase
          .from('issue_upvotes')
          .select('issue_id')
          .eq('user_id', user.id)
        
        if (upvotes) {
          setUpvotedIssues(new Set(upvotes.map(u => u.issue_id)))
        }
      }
    }
    checkAuth()
  }, [supabase])

  useEffect(() => {
    fetchIssues()
    fetchMentors()
    fetchStats()
  }, [selectedCategory, selectedStatus, selectedPriority, sortBy])

  const fetchStats = async () => {
    try {
      const { count: total } = await supabase
        .from('community_issues')
        .select('*', { count: 'exact', head: true })

      const { count: open } = await supabase
        .from('community_issues')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open')

      const { count: resolved } = await supabase
        .from('community_issues')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'resolved')

      const { count: mentorsCount } = await supabase
        .from('community_contributors')
        .select('*', { count: 'exact', head: true })
        .in('role', ['mentor', 'senior_mentor'])

      setStats({
        total: total || 0,
        open: open || 0,
        resolved: resolved || 0,
        mentors: mentorsCount || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchIssues = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('community_issues')
        .select(`
          *,
          category:issue_categories(name, slug),
          reporter:profiles!community_issues_reporter_id_fkey(full_name, avatar_url),
          assigned_mentor:profiles!community_issues_assigned_mentor_id_fkey(full_name, avatar_url)
        `)

      if (selectedCategory) {
        // Query by category slug
        const { data: categoryData } = await supabase
          .from('issue_categories')
          .select('id')
          .eq('slug', selectedCategory)
          .single()
        
        if (categoryData) {
          query = query.eq('category_id', categoryData.id)
        }
      }
      if (selectedStatus) {
        query = query.eq('status', selectedStatus)
      }
      if (selectedPriority) {
        query = query.eq('priority', selectedPriority)
      }

      // Sort
      if (sortBy === 'recent') {
        query = query.order('created_at', { ascending: false })
      } else if (sortBy === 'upvotes') {
        query = query.order('upvotes', { ascending: false })
      } else if (sortBy === 'responses') {
        query = query.order('views_count', { ascending: false })
      }

      const { data, error } = await query.limit(50)

      if (error) throw error
      setIssues(data || [])
    } catch (error) {
      console.error('Error fetching issues:', error)
      toast.error('Failed to load issues')
    } finally {
      setLoading(false)
    }
  }

  const fetchMentors = async () => {
    try {
      const { data, error } = await supabase
        .from('community_contributors')
        .select(`
          *,
          profiles(full_name, avatar_url)
        `)
        .in('role', ['mentor', 'senior_mentor'])
        .eq('is_available', true)
        .order('issues_resolved', { ascending: false })
        .limit(5)

      if (error) throw error
      setMentors(data || [])
    } catch (error) {
      console.error('Error fetching mentors:', error)
    }
  }

  const handleUpvote = async (issueId: string) => {
    if (!user) {
      toast.error('Please sign in to upvote', {
        action: {
          label: 'Sign In',
          onClick: () => window.location.href = '/auth/login'
        }
      })
      return
    }

    try {
      if (upvotedIssues.has(issueId)) {
        // Remove upvote
        await supabase
          .from('issue_upvotes')
          .delete()
          .eq('issue_id', issueId)
          .eq('user_id', user.id)

        setUpvotedIssues(prev => {
          const next = new Set(prev)
          next.delete(issueId)
          return next
        })

        // Update local count
        setIssues(prev => prev.map(issue => 
          issue.id === issueId 
            ? { ...issue, upvotes: issue.upvotes - 1 }
            : issue
        ))
      } else {
        // Add upvote
        await supabase
          .from('issue_upvotes')
          .insert({ issue_id: issueId, user_id: user.id })

        setUpvotedIssues(prev => new Set([...prev, issueId]))

        // Update local count
        setIssues(prev => prev.map(issue => 
          issue.id === issueId 
            ? { ...issue, upvotes: issue.upvotes + 1 }
            : issue
        ))
      }
    } catch (error) {
      console.error('Upvote error:', error)
      toast.error('Failed to update vote')
    }
  }

  const filteredIssues = issues.filter(issue =>
    searchQuery === '' ||
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return 'Just now'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Community Issues Hub</h1>
            <p className="text-xl text-emerald-100 mb-8">
              Report, track, and help resolve local community issues together
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-sm text-emerald-100">Total Issues</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">{stats.open}</div>
                <div className="text-sm text-emerald-100">Open</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">{stats.resolved}</div>
                <div className="text-sm text-emerald-100">Resolved</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">{stats.mentors}</div>
                <div className="text-sm text-emerald-100">Mentors</div>
              </div>
            </div>

            <Link 
              href="/report-issue"
              className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Report New Issue
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Search */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search issues..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={e => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-emerald-500 outline-none"
                    >
                      <option value="">All Categories</option>
                      <option value="infrastructure">Infrastructure</option>
                      <option value="sanitation">Sanitation</option>
                      <option value="utilities">Utilities</option>
                      <option value="safety">Public Safety</option>
                      <option value="environment">Environment</option>
                      <option value="transportation">Transportation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Status</label>
                    <select
                      value={selectedStatus}
                      onChange={e => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-emerald-500 outline-none"
                    >
                      <option value="">All Status</option>
                      <option value="open">Open</option>
                      <option value="assigned">Assigned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Priority</label>
                    <select
                      value={selectedPriority}
                      onChange={e => setSelectedPriority(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-emerald-500 outline-none"
                    >
                      <option value="">All Priorities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Sort By
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSortBy('recent')}
                    className={`w-full px-3 py-2 rounded-lg text-left text-sm flex items-center gap-2 transition-colors ${
                      sortBy === 'recent' ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-slate-50'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    Most Recent
                  </button>
                  <button
                    onClick={() => setSortBy('upvotes')}
                    className={`w-full px-3 py-2 rounded-lg text-left text-sm flex items-center gap-2 transition-colors ${
                      sortBy === 'upvotes' ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-slate-50'
                    }`}
                  >
                    <Flame className="w-4 h-4" />
                    Most Upvoted
                  </button>
                  <button
                    onClick={() => setSortBy('responses')}
                    className={`w-full px-3 py-2 rounded-lg text-left text-sm flex items-center gap-2 transition-colors ${
                      sortBy === 'responses' ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-slate-50'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Most Discussed
                  </button>
                </div>
              </div>

              {/* Top Mentors */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  Top Mentors
                </h3>
                {mentors.length > 0 ? (
                  <div className="space-y-3">
                    {mentors.map(mentor => (
                      <div key={mentor.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                          {mentor.profiles?.full_name?.charAt(0) || 'M'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 text-sm truncate">
                            {mentor.profiles?.full_name || 'Anonymous Mentor'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {mentor.issues_resolved} issues resolved
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 text-sm">
                          ⭐ {mentor.rating.toFixed(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No active mentors yet</p>
                )}
                <Link 
                  href="/volunteers" 
                  className="mt-4 text-sm text-purple-600 font-medium flex items-center gap-1 hover:text-purple-700"
                >
                  Become a Mentor <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Issues List */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {filteredIssues.length} Issues Found
                </h2>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                </div>
              ) : filteredIssues.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
                  <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No Issues Found</h3>
                  <p className="text-slate-500 mb-6">
                    {searchQuery || selectedCategory || selectedStatus 
                      ? 'Try adjusting your filters'
                      : 'Be the first to report a community issue!'}
                  </p>
                  <Link 
                    href="/report-issue"
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Report an Issue
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredIssues.map(issue => (
                    <div 
                      key={issue.id}
                      className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        {/* Upvote */}
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => handleUpvote(issue.id)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                              upvotedIssues.has(issue.id)
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            }`}
                          >
                            <ThumbsUp className="w-5 h-5" />
                          </button>
                          <span className={`text-sm font-bold ${
                            upvotedIssues.has(issue.id) ? 'text-emerald-600' : 'text-slate-500'
                          }`}>
                            {issue.upvotes}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[issue.category?.slug || 'other'] || categoryColors.other}`}>
                              {issue.category?.name || 'Other'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[issue.priority]}`}>
                              {issue.priority}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[issue.status]}`}>
                              {issue.status.replace('_', ' ')}
                            </span>
                          </div>

                          <Link href={`/community/${issue.id}`}>
                            <h3 className="text-lg font-bold text-slate-900 hover:text-emerald-600 transition-colors mb-2">
                              {issue.title}
                            </h3>
                          </Link>

                          <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                            {issue.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {issue.reporter?.full_name || 'Anonymous'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTimeAgo(issue.created_at)}
                            </div>
                            {(issue.address || issue.area || issue.city) && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {issue.address || issue.area || issue.city}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {issue.views_count} views
                            </div>
                          </div>

                          {issue.assigned_mentor && (
                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold">
                                {issue.assigned_mentor.full_name?.charAt(0) || 'M'}
                              </div>
                              <span className="text-sm text-slate-600">
                                Assigned to <strong className="text-purple-600">{issue.assigned_mentor.full_name}</strong>
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Images Preview */}
                        {issue.images && issue.images.length > 0 && (
                          <div className="hidden md:block w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={issue.images[0]} 
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            {issue.images.length > 1 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-bold">
                                +{issue.images.length - 1}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
