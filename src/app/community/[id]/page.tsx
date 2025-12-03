'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { 
  ArrowLeft, MapPin, Clock, User, ThumbsUp, MessageCircle, 
  AlertTriangle, CheckCircle2, Send, Shield, Star, Loader2,
  Share2, Flag, ChevronDown, ChevronUp, Heart
} from 'lucide-react'

const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Loading Map...</div>
})

interface IssueResponse {
  id: string
  content: string
  is_solution: boolean
  is_accepted: boolean
  likes_count: number
  created_at: string
  responder: {
    id: string
    full_name: string | null
    avatar_url: string | null
  } | null
  is_mentor: boolean
}

interface CommunityIssue {
  id: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed'
  location: { lat: number; lng: number; address?: string } | null
  images: string[]
  upvotes_count: number
  responses_count: number
  created_at: string
  resolved_at: string | null
  reporter_id: string
  reporter: {
    id: string
    full_name: string | null
    avatar_url: string | null
  } | null
  assigned_mentor_id: string | null
  assigned_mentor: {
    id: string
    full_name: string | null
    avatar_url: string | null
  } | null
}

const categoryColors: Record<string, string> = {
  infrastructure: 'bg-orange-100 text-orange-700',
  sanitation: 'bg-green-100 text-green-700',
  utilities: 'bg-blue-100 text-blue-700',
  safety: 'bg-red-100 text-red-700',
  environment: 'bg-emerald-100 text-emerald-700',
  transportation: 'bg-purple-100 text-purple-700',
  noise: 'bg-yellow-100 text-yellow-700',
  animals: 'bg-pink-100 text-pink-700',
  other: 'bg-slate-100 text-slate-700'
}

const priorityColors: Record<string, string> = {
  low: 'bg-slate-100 text-slate-600 border-slate-200',
  medium: 'bg-blue-100 text-blue-600 border-blue-200',
  high: 'bg-orange-100 text-orange-600 border-orange-200',
  urgent: 'bg-red-100 text-red-600 border-red-200'
}

const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  open: { color: 'bg-yellow-100 text-yellow-700', label: 'Open', icon: <AlertTriangle className="w-4 h-4" /> },
  assigned: { color: 'bg-blue-100 text-blue-700', label: 'Assigned', icon: <User className="w-4 h-4" /> },
  in_progress: { color: 'bg-purple-100 text-purple-700', label: 'In Progress', icon: <Loader2 className="w-4 h-4" /> },
  resolved: { color: 'bg-green-100 text-green-700', label: 'Resolved', icon: <CheckCircle2 className="w-4 h-4" /> },
  closed: { color: 'bg-slate-100 text-slate-700', label: 'Closed', icon: <CheckCircle2 className="w-4 h-4" /> }
}

export default function IssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [issue, setIssue] = useState<CommunityIssue | null>(null)
  const [responses, setResponses] = useState<IssueResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [isMentor, setIsMentor] = useState(false)
  const [hasUpvoted, setHasUpvoted] = useState(false)
  const [newResponse, setNewResponse] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAllImages, setShowAllImages] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Check if user is a mentor
        const { data: mentorData } = await supabase
          .from('mentors')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_verified', true)
          .single()
        
        setIsMentor(!!mentorData)

        // Check if user has upvoted
        const { data: upvote } = await supabase
          .from('issue_upvotes')
          .select('id')
          .eq('issue_id', id)
          .eq('user_id', user.id)
          .single()
        
        setHasUpvoted(!!upvote)
      }
    }
    checkAuth()
    fetchIssue()
    fetchResponses()
  }, [id, supabase])

  const fetchIssue = async () => {
    try {
      const { data, error } = await supabase
        .from('community_issues')
        .select(`
          *,
          reporter:profiles!community_issues_reporter_id_fkey(id, full_name, avatar_url),
          assigned_mentor:profiles!community_issues_assigned_mentor_id_fkey(id, full_name, avatar_url)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setIssue(data)
    } catch (error) {
      console.error('Error fetching issue:', error)
      toast.error('Failed to load issue')
    } finally {
      setLoading(false)
    }
  }

  const fetchResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('issue_responses')
        .select(`
          *,
          responder:profiles!issue_responses_responder_id_fkey(id, full_name, avatar_url)
        `)
        .eq('issue_id', id)
        .order('is_accepted', { ascending: false })
        .order('is_solution', { ascending: false })
        .order('likes_count', { ascending: false })
        .order('created_at', { ascending: true })

      if (error) throw error

      // Check which responders are mentors
      const responderIds = data?.map(r => r.responder?.id).filter(Boolean) || []
      let mentorIds: string[] = []
      
      if (responderIds.length > 0) {
        const { data: mentorsData } = await supabase
          .from('mentors')
          .select('user_id')
          .in('user_id', responderIds)
          .eq('is_verified', true)
        
        mentorIds = mentorsData?.map(m => m.user_id) || []
      }

      setResponses(data?.map(r => ({
        ...r,
        is_mentor: r.responder?.id ? mentorIds.includes(r.responder.id) : false
      })) || [])
    } catch (error) {
      console.error('Error fetching responses:', error)
    }
  }

  const handleUpvote = async () => {
    if (!user) {
      toast.error('Please sign in to upvote')
      return
    }

    try {
      if (hasUpvoted) {
        await supabase
          .from('issue_upvotes')
          .delete()
          .eq('issue_id', id)
          .eq('user_id', user.id)
        setHasUpvoted(false)
        setIssue(prev => prev ? { ...prev, upvotes_count: prev.upvotes_count - 1 } : null)
      } else {
        await supabase
          .from('issue_upvotes')
          .insert({ issue_id: id, user_id: user.id })
        setHasUpvoted(true)
        setIssue(prev => prev ? { ...prev, upvotes_count: prev.upvotes_count + 1 } : null)
      }
    } catch (error) {
      console.error('Upvote error:', error)
      toast.error('Failed to update vote')
    }
  }

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please sign in to respond')
      return
    }
    if (!newResponse.trim()) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('issue_responses')
        .insert({
          issue_id: id,
          responder_id: user.id,
          content: newResponse.trim(),
          is_solution: isMentor
        })

      if (error) throw error

      toast.success('Response submitted!')
      setNewResponse('')
      fetchResponses()
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Failed to submit response')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClaimIssue = async () => {
    if (!user || !isMentor || !issue) return

    try {
      const { error } = await supabase
        .from('community_issues')
        .update({ 
          assigned_mentor_id: user.id,
          status: 'assigned'
        })
        .eq('id', issue.id)

      if (error) throw error

      toast.success('You have claimed this issue!')
      fetchIssue()
    } catch (error) {
      console.error('Claim error:', error)
      toast.error('Failed to claim issue')
    }
  }

  const handleMarkResolved = async () => {
    if (!issue || !user) return
    if (issue.reporter_id !== user.id && issue.assigned_mentor_id !== user.id) return

    try {
      const { error } = await supabase
        .from('community_issues')
        .update({ 
          status: 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', issue.id)

      if (error) throw error

      toast.success('Issue marked as resolved!')
      fetchIssue()
    } catch (error) {
      console.error('Resolve error:', error)
      toast.error('Failed to resolve issue')
    }
  }

  const handleAcceptSolution = async (responseId: string) => {
    if (!user || !issue || issue.reporter_id !== user.id) return

    try {
      const { error } = await supabase
        .from('issue_responses')
        .update({ is_accepted: true })
        .eq('id', responseId)

      if (error) throw error

      toast.success('Solution accepted!')
      fetchResponses()
    } catch (error) {
      console.error('Accept error:', error)
      toast.error('Failed to accept solution')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    )
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Issue Not Found</h2>
          <p className="text-slate-500 mb-4">This issue may have been removed or doesn&apos;t exist.</p>
          <Link href="/community" className="text-emerald-600 font-medium hover:underline">
            ← Back to Community Issues
          </Link>
        </div>
      </div>
    )
  }

  const statusInfo = statusConfig[issue.status]

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link 
            href="/community" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Community Issues
          </Link>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[issue.category] || categoryColors.other}`}>
                  {issue.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityColors[issue.priority]}`}>
                  {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)} Priority
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusInfo.color}`}>
                  {statusInfo.icon}
                  {statusInfo.label}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                {issue.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                    {issue.reporter?.full_name?.charAt(0) || 'A'}
                  </div>
                  <span>{issue.reporter?.full_name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDate(issue.created_at)}
                </div>
                <button
                  onClick={handleUpvote}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
                    hasUpvoted 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  {issue.upvotes_count}
                </button>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {issue.responses_count} responses
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-6 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 mb-3">Description</h2>
              <p className="text-slate-700 whitespace-pre-wrap">{issue.description}</p>
            </div>

            {/* Images */}
            {issue.images && issue.images.length > 0 && (
              <div className="p-6 border-b border-slate-100">
                <h2 className="font-bold text-slate-900 mb-3">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(showAllImages ? issue.images : issue.images.slice(0, 3)).map((img, index) => (
                    <div key={index} className="aspect-video rounded-xl overflow-hidden bg-slate-100">
                      <img 
                        src={img} 
                        alt={`Issue photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                {issue.images.length > 3 && (
                  <button
                    onClick={() => setShowAllImages(!showAllImages)}
                    className="mt-4 text-emerald-600 font-medium text-sm flex items-center gap-1"
                  >
                    {showAllImages ? (
                      <>Show Less <ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <>Show All {issue.images.length} Photos <ChevronDown className="w-4 h-4" /></>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Location */}
            {issue.location && (
              <div className="p-6 border-b border-slate-100">
                <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Location
                </h2>
                {issue.location.address && (
                  <p className="text-slate-600 mb-3">{issue.location.address}</p>
                )}
                <div className="h-[300px] rounded-xl overflow-hidden border border-slate-200">
                  <Map 
                    center={[issue.location.lat, issue.location.lng]} 
                    zoom={15}
                    markers={[{
                      position: [issue.location.lat, issue.location.lng],
                      popup: issue.title
                    }]}
                  />
                </div>
              </div>
            )}

            {/* Assigned Mentor */}
            {issue.assigned_mentor && (
              <div className="p-6 border-b border-slate-100 bg-purple-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                    {issue.assigned_mentor.full_name?.charAt(0) || 'M'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-600">Assigned Mentor</span>
                    </div>
                    <p className="font-bold text-slate-900">{issue.assigned_mentor.full_name}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {user && (
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <div className="flex flex-wrap gap-3">
                  {isMentor && !issue.assigned_mentor_id && issue.status === 'open' && (
                    <button
                      onClick={handleClaimIssue}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Claim This Issue
                    </button>
                  )}
                  {(issue.reporter_id === user.id || issue.assigned_mentor_id === user.id) && 
                   issue.status !== 'resolved' && issue.status !== 'closed' && (
                    <button
                      onClick={handleMarkResolved}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark as Resolved
                    </button>
                  )}
                  <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            )}

            {/* Responses */}
            <div className="p-6">
              <h2 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                Responses ({responses.length})
              </h2>

              {responses.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No responses yet. Be the first to help!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {responses.map(response => (
                    <div 
                      key={response.id} 
                      className={`p-4 rounded-xl border ${
                        response.is_accepted 
                          ? 'border-emerald-200 bg-emerald-50' 
                          : response.is_solution 
                            ? 'border-purple-200 bg-purple-50' 
                            : 'border-slate-100 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          response.is_mentor 
                            ? 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {response.responder?.full_name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-slate-900">
                              {response.responder?.full_name || 'Anonymous'}
                            </span>
                            {response.is_mentor && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs font-medium flex items-center gap-1">
                                <Shield className="w-3 h-3" /> Mentor
                              </span>
                            )}
                            {response.is_accepted && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full text-xs font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Accepted Solution
                              </span>
                            )}
                          </div>
                          <p className="text-slate-700 mb-2">{response.content}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>{formatDate(response.created_at)}</span>
                            <button className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                              <Heart className="w-4 h-4" /> {response.likes_count}
                            </button>
                            {user && issue.reporter_id === user.id && response.is_solution && !response.is_accepted && (
                              <button 
                                onClick={() => handleAcceptSolution(response.id)}
                                className="text-emerald-600 font-medium hover:underline"
                              >
                                Accept as Solution
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Response */}
              {user ? (
                <form onSubmit={handleSubmitResponse} className="mt-6">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      isMentor 
                        ? 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white' 
                        : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {user.id.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newResponse}
                        onChange={e => setNewResponse(e.target.value)}
                        placeholder={isMentor ? "Share your expertise and solution..." : "Share your thoughts or suggestions..."}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none"
                      ></textarea>
                      <div className="flex items-center justify-between mt-3">
                        {isMentor && (
                          <span className="text-sm text-purple-600 flex items-center gap-1">
                            <Shield className="w-4 h-4" />
                            Responding as Mentor
                          </span>
                        )}
                        <button
                          type="submit"
                          disabled={isSubmitting || !newResponse.trim()}
                          className="ml-auto px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          Submit Response
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="mt-6 p-4 bg-slate-50 rounded-xl text-center">
                  <p className="text-slate-600 mb-3">Sign in to share your response</p>
                  <Link 
                    href="/auth/login"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
