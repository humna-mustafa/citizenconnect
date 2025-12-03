'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import { Camera, MapPin, Upload, AlertTriangle, CheckCircle2, Users, Clock, TrendingUp, ArrowRight, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Loading Map...</div>
})

interface CommunityStats {
  totalIssues: number
  resolvedIssues: number
  activeMentors: number
  avgResolutionTime: string
}

export default function ReportIssuePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    location: null as [number, number] | null,
    locationAddress: '',
    images: [] as File[]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [stats, setStats] = useState<CommunityStats>({
    totalIssues: 0,
    resolvedIssues: 0,
    activeMentors: 0,
    avgResolutionTime: '24h'
  })
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const supabase = createClient()

  useEffect(() => {
    // Check auth status
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkAuth()

    // Fetch community stats
    const fetchStats = async () => {
      try {
        // Get total issues count
        const { count: totalCount } = await supabase
          .from('community_issues')
          .select('*', { count: 'exact', head: true })

        // Get resolved issues count
        const { count: resolvedCount } = await supabase
          .from('community_issues')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'resolved')

        // Get active mentors count
        const { count: mentorsCount } = await supabase
          .from('mentors')
          .select('*', { count: 'exact', head: true })
          .eq('is_available', true)
          .eq('is_verified', true)

        setStats({
          totalIssues: totalCount || 0,
          resolvedIssues: resolvedCount || 0,
          activeMentors: mentorsCount || 0,
          avgResolutionTime: '24h'
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }
    fetchStats()
  }, [supabase])

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, location: [lat, lng] }))
    toast.success('Location pinned on map!')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + formData.images.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }
    
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`)
        return false
      }
      return true
    })

    setFormData(prev => ({ ...prev, images: [...prev.images, ...validFiles] }))
    
    // Create preview URLs
    validFiles.forEach(file => {
      const url = URL.createObjectURL(file)
      setPreviewUrls(prev => [...prev, url])
    })
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    URL.revokeObjectURL(previewUrls[index])
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please sign in to report an issue', {
        action: {
          label: 'Sign In',
          onClick: () => window.location.href = '/auth/login'
        }
      })
      return
    }

    if (!formData.location) {
      toast.error('Please select a location on the map')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Upload images to Supabase Storage
      const imageUrls: string[] = []
      for (const image of formData.images) {
        const fileName = `${user.id}/${Date.now()}-${image.name}`
        const { data, error } = await supabase.storage
          .from('issue-images')
          .upload(fileName, image)
        
        if (error) {
          console.error('Image upload error:', error)
        } else if (data) {
          const { data: { publicUrl } } = supabase.storage
            .from('issue-images')
            .getPublicUrl(data.path)
          imageUrls.push(publicUrl)
        }
      }

      // Insert issue into database
      const { data: issue, error } = await supabase
        .from('community_issues')
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priority: formData.priority,
          location: {
            lat: formData.location[0],
            lng: formData.location[1],
            address: formData.locationAddress || null
          },
          images: imageUrls,
          reporter_id: user.id,
          status: 'open'
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Issue reported successfully!', {
        description: `Your community issue #${issue.id.slice(0, 8)} has been submitted. Mentors will be notified.`,
        duration: 5000
      })

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        location: null,
        locationAddress: '',
        images: []
      })
      setPreviewUrls([])

    } catch (error: unknown) {
      console.error('Submit error:', error)
      toast.error('Failed to submit issue', {
        description: error instanceof Error ? error.message : 'Please try again later'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        {/* Community Stats Banner */}
        <div className="max-w-5xl mx-auto mb-10">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold mb-1">Community-Powered Issue Resolution</h2>
                <p className="text-emerald-100 text-sm">Our volunteer mentors help resolve community issues</p>
              </div>
              <div className="grid grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold">{stats.totalIssues}</div>
                  <div className="text-xs text-emerald-100">Total Issues</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.resolvedIssues}</div>
                  <div className="text-xs text-emerald-100">Resolved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.activeMentors}</div>
                  <div className="text-xs text-emerald-100">Active Mentors</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.avgResolutionTime}</div>
                  <div className="text-xs text-emerald-100">Avg Resolution</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Report a Community Issue</h1>
              <p className="text-slate-600">
                Submit an issue and our volunteer mentors will help resolve it
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Issue Details */}
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Issue Details
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Issue Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g., Broken Street Light on Main Street"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="issue-category" className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                      <select
                        id="issue-category"
                        required
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none bg-white transition-all"
                      >
                        <option value="">Select Category</option>
                        <option value="infrastructure">Infrastructure (Roads, Buildings)</option>
                        <option value="sanitation">Sanitation & Cleanliness</option>
                        <option value="utilities">Utilities (Water, Electricity, Gas)</option>
                        <option value="safety">Public Safety</option>
                        <option value="environment">Environment & Green Spaces</option>
                        <option value="transportation">Transportation & Traffic</option>
                        <option value="noise">Noise & Disturbance</option>
                        <option value="animals">Stray Animals</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="issue-priority" className="block text-sm font-medium text-slate-700 mb-1">Priority Level</label>
                      <select
                        id="issue-priority"
                        value={formData.priority}
                        onChange={e => setFormData({...formData, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent'})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none bg-white transition-all"
                      >
                        <option value="low">Low - Can wait</option>
                        <option value="medium">Medium - Needs attention</option>
                        <option value="high">High - Urgent</option>
                        <option value="urgent">Urgent - Safety hazard</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Description *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Please provide as much detail as possible about the issue, when you noticed it, and any relevant information that could help our mentors..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none transition-all"
                    ></textarea>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    Location
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address / Landmark (Optional)</label>
                    <input
                      type="text"
                      value={formData.locationAddress}
                      onChange={e => setFormData({...formData, locationAddress: e.target.value})}
                      placeholder="e.g., Near City Park, Main Street"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    />
                  </div>

                  <p className="text-sm text-slate-500">Click on the map to pinpoint the exact location *</p>
                  
                  <div className="h-[300px] rounded-xl overflow-hidden border-2 border-slate-100">
                    <Map 
                      center={[30.3753, 69.3451]} 
                      zoom={5}
                      onLocationSelect={handleLocationSelect}
                    />
                  </div>
                  {formData.location && (
                    <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Location pinned: {formData.location[0].toFixed(4)}, {formData.location[1].toFixed(4)}
                    </div>
                  )}
                </div>

                {/* Photo Evidence */}
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Camera className="w-5 h-5 text-emerald-600" />
                    Photo Evidence (Optional)
                  </h2>
                  
                  {previewUrls.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={url} 
                            alt={`Preview ${index + 1}`} 
                            className="w-24 h-24 object-cover rounded-lg border border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {formData.images.length < 5 && (
                    <label className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer block">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600 font-medium text-sm">Click to upload photos</p>
                      <p className="text-slate-400 text-xs mt-1">PNG, JPG up to 5MB each (max 5 photos)</p>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        aria-label="Upload images" 
                      />
                    </label>
                  )}
                </div>

                {!user && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-amber-800 text-sm">
                      <strong>Note:</strong> You need to{' '}
                      <Link href="/auth/login" className="underline font-medium">sign in</Link>
                      {' '}to submit an issue report.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !user}
                  className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Issue Report
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* How It Works */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                How It Works
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 text-emerald-600 font-bold text-sm">1</div>
                  <div>
                    <p className="font-medium text-slate-900">Report Issue</p>
                    <p className="text-sm text-slate-500">Submit your community issue with details and location</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 text-emerald-600 font-bold text-sm">2</div>
                  <div>
                    <p className="font-medium text-slate-900">Mentor Assignment</p>
                    <p className="text-sm text-slate-500">Volunteer mentors review and claim issues</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 text-emerald-600 font-bold text-sm">3</div>
                  <div>
                    <p className="font-medium text-slate-900">Community Response</p>
                    <p className="text-sm text-slate-500">Mentors provide guidance and solutions</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 text-emerald-600 font-bold text-sm">4</div>
                  <div>
                    <p className="font-medium text-slate-900">Resolution</p>
                    <p className="text-sm text-slate-500">Issue resolved with community help</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Become a Mentor */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
              <Users className="w-10 h-10 mb-4" />
              <h3 className="font-bold text-lg mb-2">Become a Mentor</h3>
              <p className="text-purple-100 text-sm mb-4">
                Help your community by volunteering as a mentor. Guide and support others in resolving local issues.
              </p>
              <Link 
                href="/volunteers" 
                className="inline-flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-purple-50 transition-colors"
              >
                Join as Volunteer
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Track Issues */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <Clock className="w-10 h-10 text-slate-400 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">Track Your Issues</h3>
              <p className="text-sm text-slate-500 mb-4">
                View status updates, mentor responses, and resolution progress for all your reported issues.
              </p>
              <Link 
                href="/community" 
                className="inline-flex items-center gap-2 text-emerald-600 font-medium text-sm hover:text-emerald-700"
              >
                View Community Issues
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
