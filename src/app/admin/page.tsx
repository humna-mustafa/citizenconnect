'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
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
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Shield,
  Bell,
  Menu,
  X
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalGuides: number
  totalDonors: number
  totalVolunteers: number
  totalDonations: number
  pendingVerifications: number
}

interface UserData {
  id: string
  email: string
  full_name: string
  role: string
  city: string
  created_at: string
  verified: boolean
}

interface GuideData {
  id: string
  title: string
  category: string
  status: string
  author: string
  created_at: string
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 15678,
    totalGuides: 156,
    totalDonors: 2847,
    totalVolunteers: 1234,
    totalDonations: 8456,
    pendingVerifications: 45,
  })

  // Sample data
  const [users] = useState<UserData[]>([
    { id: '1', email: 'ahmed@example.com', full_name: 'Ahmed Khan', role: 'citizen', city: 'Karachi', created_at: '2024-01-15', verified: true },
    { id: '2', email: 'fatima@example.com', full_name: 'Fatima Ali', role: 'donor', city: 'Lahore', created_at: '2024-01-14', verified: true },
    { id: '3', email: 'hassan@example.com', full_name: 'Hassan Raza', role: 'volunteer', city: 'Islamabad', created_at: '2024-01-13', verified: false },
    { id: '4', email: 'ayesha@example.com', full_name: 'Ayesha Malik', role: 'citizen', city: 'Faisalabad', created_at: '2024-01-12', verified: true },
    { id: '5', email: 'usman@example.com', full_name: 'Usman Sheikh', role: 'donor', city: 'Peshawar', created_at: '2024-01-11', verified: false },
  ])

  const [guides] = useState<GuideData[]>([
    { id: '1', title: 'How to Get CNIC', category: 'documents', status: 'published', author: 'Admin', created_at: '2024-01-20' },
    { id: '2', title: 'Passport Application Guide', category: 'documents', status: 'published', author: 'Ahmed Khan', created_at: '2024-01-18' },
    { id: '3', title: 'Driving License Process', category: 'documents', status: 'pending', author: 'Fatima Ali', created_at: '2024-01-17' },
    { id: '4', title: 'Property Registration', category: 'legal', status: 'draft', author: 'Hassan Raza', created_at: '2024-01-16' },
    { id: '5', title: 'Birth Certificate Guide', category: 'documents', status: 'published', author: 'Admin', created_at: '2024-01-15' },
  ])

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }
      
      setUser(user)
      
      // Check if user is admin (in real app, check from profiles table)
      // For demo purposes, allow access
      setIsAdmin(true)
      setLoading(false)
    }
    
    checkAdmin()
  }, [router, supabase])

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
                  { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-600 bg-blue-50' },
                  { label: 'Guides', value: stats.totalGuides, icon: BookOpen, color: 'text-purple-600 bg-purple-50' },
                  { label: 'Blood Donors', value: stats.totalDonors.toLocaleString(), icon: Droplets, color: 'text-red-600 bg-red-50' },
                  { label: 'Volunteers', value: stats.totalVolunteers.toLocaleString(), icon: Handshake, color: 'text-emerald-600 bg-emerald-50' },
                  { label: 'Donations', value: stats.totalDonations.toLocaleString(), icon: Heart, color: 'text-pink-600 bg-pink-50' },
                  { label: 'Pending', value: stats.pendingVerifications, icon: AlertCircle, color: 'text-orange-600 bg-orange-50' },
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

                {/* Pending Verifications */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900">Pending Verifications</h3>
                    <button className="text-sm text-emerald-600 font-semibold hover:text-emerald-700">View All</button>
                  </div>
                  <div className="space-y-3">
                    {users.filter(u => !u.verified).slice(0, 3).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
                            {user.full_name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{user.full_name}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors">
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900">Recent Activity</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Action</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">User</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Type</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { action: 'New user registered', user: 'Ahmed Khan', type: 'registration', time: '2 min ago' },
                        { action: 'Guide published', user: 'Admin', type: 'content', time: '15 min ago' },
                        { action: 'Blood donor verified', user: 'Fatima Ali', type: 'verification', time: '1 hour ago' },
                        { action: 'Donation received', user: 'Hassan Raza', type: 'donation', time: '2 hours ago' },
                        { action: 'Volunteer registered', user: 'Ayesha Malik', type: 'registration', time: '3 hours ago' },
                      ].map((activity, index) => (
                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6 text-slate-900 font-medium">{activity.action}</td>
                          <td className="py-4 px-6 text-slate-500">{activity.user}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                              activity.type === 'registration' ? 'bg-blue-100 text-blue-700' :
                              activity.type === 'content' ? 'bg-purple-100 text-purple-700' :
                              activity.type === 'verification' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-pink-100 text-pink-700'
                            }`}>
                              {activity.type}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-400 text-sm">{activity.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
                <button className="px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20">
                  <Plus className="w-5 h-5" />
                  Add User
                </button>
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
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
                                {u.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{u.full_name}</p>
                                <p className="text-sm text-slate-500">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                              u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                              u.role === 'donor' ? 'bg-red-100 text-red-700' :
                              u.role === 'volunteer' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-600">{u.city}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              u.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${u.verified ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
                              {u.verified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-500 text-sm">{u.created_at}</td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
                <button className="px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20">
                  <Plus className="w-5 h-5" />
                  Create Guide
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Title</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Category</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Author</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Status</th>
                        <th className="text-left py-4 px-6 text-sm text-slate-500 font-semibold">Created</th>
                        <th className="text-right py-4 px-6 text-sm text-slate-500 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {guides.map((guide) => (
                        <tr key={guide.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6">
                            <p className="font-bold text-slate-900">{guide.title}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wide">
                              {guide.category}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-600">{guide.author}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              guide.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                              guide.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                guide.status === 'published' ? 'bg-emerald-500' :
                                guide.status === 'pending' ? 'bg-orange-500' :
                                'bg-slate-500'
                              }`}></span>
                              {guide.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-500 text-sm">{guide.created_at}</td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {['donations', 'donors', 'volunteers', 'reports', 'settings'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <Settings className="w-12 h-12 text-slate-300" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2 capitalize">{activeTab} Management</h2>
              <p className="text-slate-500 max-w-md">This section is currently under development. Check back later for updates.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
