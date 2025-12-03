'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { getDashboardStats, getTopContributors, getDonationStats } from '@/lib/supabase/helpers'
import { formatDistanceToNow } from 'date-fns'
import { 
  BookOpen, 
  Droplets, 
  Handshake, 
  Heart, 
  TrendingUp, 
  Users, 
  Award, 
  MapPin, 
  Activity, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  BarChart3,
  Search,
  Home,
  Loader2,
  Trophy
} from 'lucide-react'

interface DashboardStats {
  totalGuides: number
  totalDonors: number
  totalVolunteers: number
  totalDonations: number
  totalDonationAmount: number
  totalUsersHelped: number
}

interface TopContributor {
  id: string
  name: string
  type: 'donor' | 'volunteer' | 'contributor'
  contributions: number
  badge: string
  city: string
}

interface RecentActivity {
  id: string
  type: string
  description: string
  timestamp: string
  icon: any
  color: string
}

interface MonthlyDonation {
  month: string
  amount: number
}

interface CategoryDistribution {
  name: string
  percentage: number
  color: string
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalGuides: 0,
    totalDonors: 0,
    totalVolunteers: 0,
    totalDonations: 0,
    totalDonationAmount: 0,
    totalUsersHelped: 0,
  })
  
  const [topContributors, setTopContributors] = useState<TopContributor[]>([])
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [monthlyDonations, setMonthlyDonations] = useState<MonthlyDonation[]>([])
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryDistribution[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState('month')
  const supabase = createClient()

  // Default chart data as fallback
  const defaultMonthlyDonations: MonthlyDonation[] = [
    { month: 'Jan', amount: 0 },
    { month: 'Feb', amount: 0 },
    { month: 'Mar', amount: 0 },
    { month: 'Apr', amount: 0 },
    { month: 'May', amount: 0 },
    { month: 'Jun', amount: 0 },
    { month: 'Jul', amount: 0 },
    { month: 'Aug', amount: 0 },
    { month: 'Sep', amount: 0 },
    { month: 'Oct', amount: 0 },
    { month: 'Nov', amount: 0 },
    { month: 'Dec', amount: 0 },
  ]

  const categoryColors: Record<string, string> = {
    'Medical': 'bg-red-500',
    'Education': 'bg-blue-500',
    'Flood Relief': 'bg-cyan-500',
    'Food': 'bg-orange-500',
    'Orphanage': 'bg-purple-500',
    'Shelter': 'bg-green-500',
    'Other': 'bg-slate-500',
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Dashboard Stats
        const { data: statsData, error: statsError } = await getDashboardStats()
        
        if (statsData && !statsError) {
          setStats({
            totalGuides: statsData.total_guides || 0,
            totalDonors: statsData.total_blood_donors || 0,
            totalVolunteers: statsData.total_volunteers || 0,
            totalDonations: statsData.total_donations || 0,
            totalDonationAmount: statsData.total_donation_amount || 0,
            totalUsersHelped: statsData.total_users || 0,
          })

          // Process Recent Activity
          const activities: RecentActivity[] = []
          
          if (statsData.recent_guides) {
            statsData.recent_guides.forEach((guide: any) => {
              activities.push({
                id: `guide-${guide.id}`,
                type: 'guide',
                description: `New guide published: ${guide.title}`,
                timestamp: formatDistanceToNow(new Date(guide.created_at), { addSuffix: true }),
                icon: BookOpen,
                color: 'text-blue-500 bg-blue-50'
              })
            })
          }

          if (statsData.recent_blood_requests) {
            statsData.recent_blood_requests.forEach((req: any) => {
              activities.push({
                id: `blood-${req.id}`,
                type: 'blood',
                description: `Urgent ${req.blood_group} blood needed in ${req.city}`,
                timestamp: formatDistanceToNow(new Date(req.created_at), { addSuffix: true }),
                icon: Droplets,
                color: 'text-red-500 bg-red-50'
              })
            })
          }

          setRecentActivities(activities.slice(0, 5))
        }

        // Fetch Top Contributors
        const { data: contributorsData, error: contributorsError } = await getTopContributors()
        
        if (contributorsData && !contributorsError) {
          const formattedContributors = contributorsData.map((c: any, index: number) => ({
            id: c.user_id,
            name: c.full_name || 'Anonymous',
            type: 'contributor',
            contributions: c.total_contributions,
            badge: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐',
            city: c.city || 'Pakistan'
          }))
          setTopContributors(formattedContributors)
        }

        // Fetch Donation Stats for charts
        const { monthlyStats, categoryStats, error: donationStatsError } = await getDonationStats()
        
        if (monthlyStats && monthlyStats.length > 0) {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          const chartData = months.map((month, index) => {
            const stat = monthlyStats.find((s: any) => s.month === index + 1)
            return {
              month,
              amount: stat?.total_amount || 0
            }
          })
          setMonthlyDonations(chartData)
        } else {
          setMonthlyDonations(defaultMonthlyDonations)
        }

        if (categoryStats && categoryStats.length > 0) {
          const total = categoryStats.reduce((sum: number, cat: any) => sum + (cat.count || 0), 0)
          const catData = categoryStats.map((cat: any) => ({
            name: cat.category_name || 'Other',
            percentage: total > 0 ? Math.round((cat.count / total) * 100) : 0,
            color: categoryColors[cat.category_name] || 'bg-slate-500'
          }))
          setCategoryDistribution(catData)
        } else {
          // Default category distribution
          setCategoryDistribution([
            { name: 'Medical', percentage: 0, color: 'bg-red-500' },
            { name: 'Education', percentage: 0, color: 'bg-blue-500' },
            { name: 'Other', percentage: 0, color: 'bg-slate-500' },
          ])
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setMonthlyDonations(defaultMonthlyDonations)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Realtime Subscription for Live Activity
    const channel = supabase
      .channel('dashboard-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'blood_requests' }, (payload) => {
        const newReq = payload.new as any
        const newActivity: RecentActivity = {
          id: `blood-${newReq.id}`,
          type: 'blood',
          description: `New ${newReq.blood_group} request in ${newReq.city}`,
          timestamp: 'Just now',
          icon: Droplets,
          color: 'text-red-500 bg-red-50'
        }
        setRecentActivities(prev => [newActivity, ...prev.slice(0, 4)])
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guides' }, (payload) => {
        const newGuide = payload.new as any
        if (newGuide.is_published) {
          const newActivity: RecentActivity = {
            id: `guide-${newGuide.id}`,
            type: 'guide',
            description: `New guide: ${newGuide.title}`,
            timestamp: 'Just now',
            icon: BookOpen,
            color: 'text-blue-500 bg-blue-50'
          }
          setRecentActivities(prev => [newActivity, ...prev.slice(0, 4)])
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'donations' }, (payload) => {
        const newDonation = payload.new as any
        const newActivity: RecentActivity = {
          id: `donation-${newDonation.id}`,
          type: 'donation',
          description: `New donation of PKR ${newDonation.amount?.toLocaleString() || 0}`,
          timestamp: 'Just now',
          icon: Heart,
          color: 'text-pink-500 bg-pink-50'
        }
        setRecentActivities(prev => [newActivity, ...prev.slice(0, 4)])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const maxDonation = Math.max(...monthlyDonations.map(d => d.amount), 1)

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `PKR ${(amount / 10000000).toFixed(1)} Cr`
    } else if (amount >= 100000) {
      return `PKR ${(amount / 100000).toFixed(1)} Lac`
    }
    return `PKR ${amount.toLocaleString()}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Loading live dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-900 to-slate-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Live Impact Tracking</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Transparency Dashboard
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Real-time insights into community impact. Every contribution tracked, every rupee accounted.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8 -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Guides Published', value: stats.totalGuides, icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
              { label: 'Blood Donors', value: stats.totalDonors.toLocaleString(), icon: Droplets, color: 'text-red-600 bg-red-50' },
              { label: 'Active Volunteers', value: stats.totalVolunteers.toLocaleString(), icon: Handshake, color: 'text-purple-600 bg-purple-50' },
              { label: 'Donations Made', value: stats.totalDonations.toLocaleString(), icon: Heart, color: 'text-pink-600 bg-pink-50' },
              { label: 'Total Raised', value: formatCurrency(stats.totalDonationAmount), icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Users Helped', value: stats.totalUsersHelped.toLocaleString(), icon: Users, color: 'text-orange-600 bg-orange-50' },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-all border border-slate-100 group"
              >
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Monthly Donations Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                    Donation Trends
                  </h2>
                  <p className="text-sm text-slate-500">Monthly donation overview</p>
                </div>
                <div className="flex gap-2 bg-slate-50 p-1 rounded-xl">
                  {['week', 'month', 'year'].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setSelectedTimeframe(tf)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        selectedTimeframe === tf
                          ? 'bg-white text-emerald-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {tf.charAt(0).toUpperCase() + tf.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Bar Chart */}
              <div className="flex items-end gap-3 h-64">
                {monthlyDonations.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center group">
                    <div className="w-full relative flex flex-col justify-end h-full">
                      <div
                        className="w-full bg-emerald-100 rounded-t-lg transition-all duration-500 group-hover:bg-emerald-200 relative"
                        style={{ height: `${(data.amount / maxDonation) * 100}%` }}
                      >
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap z-10 shadow-xl">
                          {formatCurrency(data.amount)}
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900"></div>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 mt-3 font-medium">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Donation Categories</h2>
              <p className="text-sm text-slate-500 mb-8">Distribution by cause</p>
              
              <div className="space-y-6">
                {categoryDistribution.map((cat, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-slate-700">{cat.name}</span>
                      <span className="text-slate-500 font-medium">{cat.percentage}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${cat.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${cat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <Link
                  href="/donations"
                  className="text-emerald-600 font-semibold text-sm flex items-center justify-center gap-2 hover:text-emerald-700 transition-colors group"
                >
                  View All Campaigns
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard & Activity */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Top Contributors */}
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Top Contributors
                </h2>
              </div>
              <div className="space-y-4">
                {topContributors.length > 0 ? topContributors.map((contributor, index) => (
                  <div
                    key={contributor.id}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all border ${
                      index === 0 
                        ? 'bg-amber-50/50 border-amber-100' 
                        : 'bg-white border-slate-100 hover:border-emerald-100 hover:shadow-sm'
                    }`}
                  >
                    <span className="text-2xl filter drop-shadow-sm">{contributor.badge}</span>
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20">
                      {contributor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900">{contributor.name}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {contributor.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600">{contributor.contributions}</div>
                      <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                        Contributions
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-slate-500">
                    No contributors yet. Be the first!
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  Live Activity Feed
                </h2>
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Live
                </div>
              </div>
              <div className="space-y-6">
                {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
                  <div key={activity.id} className="relative pl-8 group">
                    {/* Timeline Line */}
                    {index !== recentActivities.length - 1 && (
                      <div className="absolute left-[19px] top-10 bottom-[-24px] w-0.5 bg-slate-100 group-hover:bg-emerald-100 transition-colors"></div>
                    )}
                    
                    <div className={`absolute left-0 top-1 w-10 h-10 rounded-xl ${activity.color} flex items-center justify-center shadow-sm z-10`}>
                      <activity.icon className="w-5 h-5" />
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-4 group-hover:bg-white group-hover:shadow-sm group-hover:border-emerald-100 border border-transparent transition-all">
                      <p className="text-slate-900 font-medium">{activity.description}</p>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{activity.timestamp}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-slate-500">
                    No recent activity.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stories */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Impact Stories</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Heart Surgery Funded',
                description: '5-year-old Ahmed received life-saving heart surgery thanks to 200+ donors.',
                amount: 'PKR 5,00,000',
                donors: 234,
                icon: Heart,
                color: 'text-red-500 bg-red-50'
              },
              {
                title: '500 Students Educated',
                description: 'Scholarship program enabled 500 students to continue their education.',
                amount: 'PKR 30,00,000',
                donors: 89,
                icon: BookOpen,
                color: 'text-blue-500 bg-blue-50'
              },
              {
                title: 'Flood Relief Success',
                description: '200 families received shelter and food supplies after devastating floods.',
                amount: 'PKR 20,00,000',
                donors: 456,
                icon: Home,
                color: 'text-orange-500 bg-orange-50'
              },
            ].map((story, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-lg transition-all border border-slate-200 group">
                <div className={`w-14 h-14 rounded-2xl ${story.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <story.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{story.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{story.description}</p>
                <div className="flex justify-between pt-6 border-t border-slate-100">
                  <div>
                    <div className="font-bold text-emerald-600 text-lg">{story.amount}</div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Raised</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 text-lg">{story.donors}</div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Donors</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Commitment */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 md:p-16 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Transparency Commitment</h2>
              <p className="text-xl text-emerald-50 mb-12 leading-relaxed">
                Every donation is tracked, every campaign is verified, and every rupee reaches those in need.
                We believe in complete transparency and accountability.
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/20 transition-colors">
                  <ShieldCheck className="w-10 h-10 mb-4 mx-auto text-emerald-300" />
                  <h3 className="font-bold mb-2 text-lg">100% Verified</h3>
                  <p className="text-emerald-100 text-sm">All campaigns are verified by our team before going live</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/20 transition-colors">
                  <Activity className="w-10 h-10 mb-4 mx-auto text-emerald-300" />
                  <h3 className="font-bold mb-2 text-lg">Real-time Tracking</h3>
                  <p className="text-emerald-100 text-sm">Track where your donation goes and its impact</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/20 transition-colors">
                  <FileText className="w-10 h-10 mb-4 mx-auto text-emerald-300" />
                  <h3 className="font-bold mb-2 text-lg">Regular Reports</h3>
                  <p className="text-emerald-100 text-sm">Monthly transparency reports published publicly</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
