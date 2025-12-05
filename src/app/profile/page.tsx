'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { isDemoMode, DEMO_USER, DEMO_PROFILE, disableDemoMode } from '@/lib/demo-user'
import type { User } from '@supabase/supabase-js'
import { 
  User as UserIcon, 
  MapPin, 
  Droplets, 
  LogOut, 
  Edit2, 
  BarChart2, 
  Award, 
  Heart, 
  Settings, 
  ChevronRight, 
  Bell, 
  Trash2, 
  Save, 
  X,
  BookOpen,
  Handshake,
  Loader2,
  AlertTriangle
} from 'lucide-react'

interface Profile {
  id: string
  full_name: string
  email: string
  phone: string
  city: string
  role: string
  avatar_url?: string
  blood_group?: string
  created_at: string
}

interface Badge {
  id: string
  name: string
  description: string
  icon: any
  earned_at: string
  color: string
}

interface Contribution {
  id: string
  type: string
  title: string
  description: string
  date: string
  icon?: any
  color?: string
  created_at?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    city: '',
    blood_group: '',
  })
  
  const supabase = createClient()
  const router = useRouter()

  const [stats, setStats] = useState({
    donations: 0,
    bloodDonations: 0,
    volunteerTasks: 0,
    guides: 0
  })
  const [badges, setBadges] = useState<Badge[]>([])
  const [contributions, setContributions] = useState<Contribution[]>([])

  // Badge Definitions

  // Badge Definitions
  const BADGE_DEFINITIONS: Record<string, Omit<Badge, 'earned_at'>> = {
    'first_donation': { id: 'first_donation', name: 'First Donation', description: 'Made your first donation', icon: Heart, color: 'text-pink-500 bg-pink-50' },
    'blood_hero': { id: 'blood_hero', name: 'Blood Hero', description: 'Donated blood 3 times', icon: Droplets, color: 'text-red-500 bg-red-50' },
    'community_star': { id: 'community_star', name: 'Community Star', description: 'Helped 10 people', icon: Award, color: 'text-amber-500 bg-amber-50' },
    'guide_creator': { id: 'guide_creator', name: 'Guide Creator', description: 'Published a helpful guide', icon: BookOpen, color: 'text-blue-500 bg-blue-50' },
  }

  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      try {
        // Check for demo mode first
        if (isDemoMode()) {
          setIsDemo(true)
          setUser(DEMO_USER as unknown as User)
          setProfile(DEMO_PROFILE as unknown as Profile)
          setFormData({
            full_name: DEMO_PROFILE.full_name || '',
            phone: DEMO_PROFILE.phone || '',
            city: DEMO_PROFILE.city || '',
            blood_group: DEMO_PROFILE.blood_group || '',
          })
          // Demo stats
          setStats({
            donations: 5,
            bloodDonations: 3,
            volunteerTasks: 8,
            guides: 2
          })
          // Demo badges
          setBadges([
            { id: 'first_donation', name: 'First Donation', description: 'Made your first donation', icon: Heart, color: 'text-pink-500 bg-pink-50', earned_at: '2025-01-15' },
            { id: 'blood_hero', name: 'Blood Hero', description: 'Donated blood 3 times', icon: Droplets, color: 'text-red-500 bg-red-50', earned_at: '2025-02-20' },
          ])
          // Demo contributions
          setContributions([
            { id: '1', type: 'donation', title: 'Flood Relief Fund', description: 'Donated Rs. 5,000', date: '2025-02-15', color: 'bg-green-100 text-green-600', icon: Heart, created_at: '2025-02-15' },
            { id: '2', type: 'blood', title: 'Blood Donation', description: 'Donated at Mayo Hospital', date: '2025-02-20', color: 'bg-red-100 text-red-600', icon: Droplets, created_at: '2025-02-20' },
            { id: '3', type: 'volunteer', title: 'Community Cleanup', description: 'Participated in cleanup drive', date: '2025-02-25', color: 'bg-blue-100 text-blue-600', icon: Handshake, created_at: '2025-02-25' },
          ])
          setLoading(false)
          return
        }
      } catch (error) {
        console.error('Error setting up demo mode:', error)
      }

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }
      
      setUser(user)
      
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileData) {
        setProfile(profileData)
        setFormData({
          full_name: profileData.full_name || '',
          phone: profileData.phone || '',
          city: profileData.city || '',
          blood_group: profileData.blood_group || '',
        })

        // Set badges
        if (profileData.badges) {
          const userBadges = profileData.badges.map((badgeId: string) => {
            const def = BADGE_DEFINITIONS[badgeId]
            return def ? { ...def, earned_at: 'Earned' } : null
          }).filter(Boolean) as Badge[]
          setBadges(userBadges)
        }
      }

      // Fetch stats and contributions
      const { getUserStats, getUserContributions } = await import('@/lib/supabase/helpers')
      const statsData = await getUserStats(user.id)
      const contributionsData = await getUserContributions(user.id)
      
      if (statsData.data) {
        setStats(statsData.data)
      }
      if (contributionsData) {
        setContributions(contributionsData)
      }
      
      setLoading(false)
    }
    
    getUser()
  }, [router, supabase])

  const handleSaveProfile = async () => {
    if (!user) return
    
    const { error } = await supabase
      .from('profiles')
      .update(formData)
      .eq('id', user.id)
    
    if (error) {
      alert('Error updating profile')
    } else {
      setProfile(prev => prev ? { ...prev, ...formData } : null)
      setEditing(false)
      alert('Profile updated successfully!')
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
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Profile Header */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-200 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-200 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="w-32 h-32 bg-emerald-600 rounded-3xl shadow-xl flex items-center justify-center text-5xl font-bold text-white ring-4 ring-emerald-200">
              {profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || user?.email?.[0].toUpperCase() || '?'}
            </div>
            
            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
                {profile?.full_name || 'Welcome, User!'}
              </h1>
              <p className="text-emerald-600 mb-4 font-medium">{user?.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-4 py-1.5 bg-white rounded-full text-sm border border-gray-200 flex items-center gap-2 text-gray-700 shadow-sm">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  {profile?.city || 'Pakistan'}
                </span>
                <span className="px-4 py-1.5 bg-white rounded-full text-sm border border-gray-200 flex items-center gap-2 capitalize text-gray-700 shadow-sm">
                  <UserIcon className="w-4 h-4 text-emerald-600" />
                  {profile?.role || 'Citizen'}
                </span>
                {profile?.blood_group && (
                  <span className="px-4 py-1.5 bg-red-50 rounded-full text-sm border border-red-200 flex items-center gap-2 text-red-700 shadow-sm">
                    <Droplets className="w-4 h-4" />
                    {profile.blood_group}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-3 bg-white text-emerald-900 font-bold rounded-xl hover:bg-emerald-50 transition-all shadow-lg flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
              <button
                onClick={handleSignOut}
                className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/10 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white shadow-sm sticky top-0 z-30 border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart2 },
              { id: 'badges', label: 'Badges', icon: Award },
              { id: 'contributions', label: 'Contributions', icon: Heart },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Donations', value: stats.donations, icon: Heart, color: 'text-pink-600 bg-pink-50' },
                  { label: 'Blood Donations', value: stats.bloodDonations, icon: Droplets, color: 'text-red-600 bg-red-50' },
                  { label: 'Volunteer Tasks', value: stats.volunteerTasks, icon: Handshake, color: 'text-purple-600 bg-purple-50' },
                  { label: 'Guides Created', value: stats.guides, icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
                ].map((stat, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100 hover:shadow-md transition-all group">
                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Donate Now', href: '/donations', icon: Heart, color: 'text-pink-600 bg-pink-50' },
                    { label: 'Find Blood Donor', href: '/blood-bank', icon: Droplets, color: 'text-red-600 bg-red-50' },
                    { label: 'Register as Volunteer', href: '/volunteers', icon: Handshake, color: 'text-purple-600 bg-purple-50' },
                    { label: 'Create a Guide', href: '/guides/create', icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
                  ].map((action, index) => (
                    <a
                      key={index}
                      href={action.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group"
                    >
                      <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-5 h-5" />
                      </div>
                      <span className="text-slate-700 font-medium group-hover:text-slate-900">{action.label}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="md:col-span-3 bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {contributions.slice(0, 3).map((contribution) => (
                    <div key={contribution.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
                      <div className={`w-12 h-12 rounded-xl ${contribution.color} flex items-center justify-center`}>
                        <contribution.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{contribution.title}</h4>
                        <p className="text-sm text-slate-500">{contribution.description}</p>
                      </div>
                      <span className="text-sm text-slate-400 font-medium">{contribution.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Badges Tab */}
          {activeTab === 'badges' && (
            <div>
              <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Your Badges ({badges.length})</h3>
                    <p className="text-slate-500 text-sm">Keep contributing to earn more!</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md hover:bg-white transition-all group"
                    >
                      <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${badge.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                        <badge.icon className="w-10 h-10" />
                      </div>
                      <h4 className="font-bold text-slate-900 mb-1">{badge.name}</h4>
                      <p className="text-sm text-slate-500 mb-3 line-clamp-2">{badge.description}</p>
                      <span className="text-xs text-slate-400 font-medium bg-white px-2 py-1 rounded-full border border-slate-100">
                        Earned {badge.earned_at}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Locked Badges */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-6">Locked Badges</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { name: 'Super Donor', desc: 'Donate 10 times', icon: Award },
                    { name: 'Life Saver', desc: 'Donate blood 10 times', icon: Heart },
                    { name: 'Volunteer Elite', desc: '100+ volunteer hours', icon: Handshake },
                    { name: 'Content Master', desc: 'Create 20 guides', icon: BookOpen },
                  ].map((badge, index) => (
                    <div
                      key={index}
                      className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                        <badge.icon className="w-10 h-10" />
                      </div>
                      <h4 className="font-bold text-slate-700 mb-1">{badge.name}</h4>
                      <p className="text-sm text-slate-500 mb-3">{badge.desc}</p>
                      <span className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                        Locked
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Contributions Tab */}
          {activeTab === 'contributions' && (
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-6">All Contributions</h3>
              <div className="space-y-4">
                {contributions.map((contribution) => (
                  <div key={contribution.id} className="flex items-center gap-6 p-6 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group">
                    <div className={`w-14 h-14 rounded-2xl ${contribution.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                      <contribution.icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-lg mb-1">{contribution.title}</h4>
                      <p className="text-slate-500">{contribution.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-slate-400 font-medium block mb-2">{contribution.date}</span>
                      <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${
                        contribution.type === 'donation' ? 'bg-pink-100 text-pink-700' :
                        contribution.type === 'blood' ? 'bg-red-100 text-red-700' :
                        contribution.type === 'volunteer' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {contribution.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-400" />
                  Profile Settings
                </h3>
                <form className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none bg-white transition-all"
                    >
                      <option value="">Select city</option>
                      {['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'].map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Blood Group</label>
                    <select
                      value={formData.blood_group}
                      onChange={(e) => setFormData(prev => ({ ...prev, blood_group: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none bg-white transition-all"
                    >
                      <option value="">Select blood group</option>
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                </form>
              </div>

              {/* Notification Settings */}
              <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-slate-400" />
                  Notifications
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Email notifications', desc: 'Receive updates via email' },
                    { label: 'Blood request alerts', desc: 'Get notified for nearby blood requests' },
                    { label: 'Donation campaign updates', desc: 'Updates on campaigns you\'ve donated to' },
                    { label: 'Volunteer opportunities', desc: 'New volunteer opportunities in your area' },
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                      <div>
                        <h4 className="font-bold text-slate-900">{setting.label}</h4>
                        <p className="text-sm text-slate-500">{setting.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={index < 2} />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50 rounded-2xl border border-red-100 p-8">
                <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  Danger Zone
                </h3>
                <p className="text-sm text-red-600/80 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                <button className="px-6 py-3 border-2 border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Edit Profile</h3>
              <button
                onClick={() => setEditing(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                />
              </div>
              <button
                onClick={() => {
                  handleSaveProfile()
                }}
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
