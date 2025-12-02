'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
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
  Home
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

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalGuides: 156,
    totalDonors: 2847,
    totalVolunteers: 1234,
    totalDonations: 8456,
    totalDonationAmount: 52000000,
    totalUsersHelped: 15678,
  })
  
  const [topContributors, setTopContributors] = useState<TopContributor[]>([
    { id: '1', name: 'Ahmed Khan', type: 'donor', contributions: 25, badge: '🥇', city: 'Karachi' },
    { id: '2', name: 'Fatima Ali', type: 'volunteer', contributions: 150, badge: '🏆', city: 'Lahore' },
    { id: '3', name: 'Hassan Raza', type: 'contributor', contributions: 45, badge: '🥈', city: 'Islamabad' },
    { id: '4', name: 'Ayesha Malik', type: 'donor', contributions: 20, badge: '🥉', city: 'Faisalabad' },
    { id: '5', name: 'Usman Sheikh', type: 'volunteer', contributions: 100, badge: '⭐', city: 'Multan' },
  ])

  const [recentActivities] = useState<RecentActivity[]>([
    { id: '1', type: 'donation', description: 'PKR 50,000 donated to Medical Fund', timestamp: '2 minutes ago', icon: Heart, color: 'text-pink-500 bg-pink-50' },
    { id: '2', type: 'volunteer', description: 'New volunteer registered in Karachi', timestamp: '15 minutes ago', icon: Handshake, color: 'text-emerald-500 bg-emerald-50' },
    { id: '3', type: 'blood', description: 'Blood donation request fulfilled in Lahore', timestamp: '1 hour ago', icon: Droplets, color: 'text-red-500 bg-red-50' },
    { id: '4', type: 'guide', description: 'New guide published: NADRA Registration', timestamp: '2 hours ago', icon: BookOpen, color: 'text-blue-500 bg-blue-50' },
    { id: '5', type: 'donation', description: 'Flood Relief campaign reached 80% goal', timestamp: '3 hours ago', icon: TrendingUp, color: 'text-cyan-500 bg-cyan-50' },
  ])

  const [selectedTimeframe, setSelectedTimeframe] = useState('month')
  const supabase = createClient()

  // Simulated chart data
  const monthlyDonations = [
    { month: 'Jan', amount: 4200000 },
    { month: 'Feb', amount: 3800000 },
    { month: 'Mar', amount: 5100000 },
    { month: 'Apr', amount: 4700000 },
    { month: 'May', amount: 5500000 },
    { month: 'Jun', amount: 4900000 },
    { month: 'Jul', amount: 5200000 },
    { month: 'Aug', amount: 6100000 },
    { month: 'Sep', amount: 5800000 },
    { month: 'Oct', amount: 6400000 },
    { month: 'Nov', amount: 5900000 },
    { month: 'Dec', amount: 7200000 },
  ]

  const categoryDistribution = [
    { name: 'Medical', percentage: 35, color: 'bg-red-500' },
    { name: 'Education', percentage: 25, color: 'bg-blue-500' },
    { name: 'Flood Relief', percentage: 20, color: 'bg-cyan-500' },
    { name: 'Food', percentage: 12, color: 'bg-orange-500' },
    { name: 'Other', percentage: 8, color: 'bg-slate-500' },
  ]

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `PKR ${(amount / 10000000).toFixed(1)} Cr`
    } else if (amount >= 100000) {
      return `PKR ${(amount / 100000).toFixed(1)} Lac`
    }
    return `PKR ${amount.toLocaleString()}`
  }

  const maxDonation = Math.max(...monthlyDonations.map(d => d.amount))

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
                  <Award className="w-5 h-5 text-amber-500" />
                  Top Contributors
                </h2>
                <Link href="/leaderboard" className="text-sm text-emerald-600 font-medium hover:underline">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {topContributors.map((contributor, index) => (
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
                        {contributor.type === 'donor' ? 'donations' : contributor.type === 'volunteer' ? 'hours' : 'guides'}
                      </div>
                    </div>
                  </div>
                ))}
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
                {recentActivities.map((activity, index) => (
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
                ))}
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
