'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  Search, 
  AlertCircle, 
  Heart, 
  Plus, 
  Phone, 
  MapPin, 
  User, 
  Droplets, 
  Share2, 
  CheckCircle2, 
  XCircle,
  Filter,
  Loader2
} from 'lucide-react'

interface BloodDonor {
  id: string
  blood_group: string
  city: string
  area: string
  is_available: boolean
  contact_phone: string
  donation_count: number
  profile: {
    full_name: string
    avatar_url: string
  }
}

interface BloodRequest {
  id: string
  patient_name: string
  blood_group: string
  hospital_name: string
  city: string
  urgency_level: string
  status: string
  created_at: string
}

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta']

export default function BloodBankPage() {
  const [activeTab, setActiveTab] = useState<'find' | 'request' | 'register'>('find')
  const [donors, setDonors] = useState<BloodDonor[]>([])
  const [requests, setRequests] = useState<BloodRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    bloodGroup: '',
    city: ''
  })
  const supabase = createClient()

  // Demo data
  const demoDonors: BloodDonor[] = [
    { id: '1', blood_group: 'A+', city: 'Karachi', area: 'Gulshan', is_available: true, contact_phone: '0300-1234567', donation_count: 5, profile: { full_name: 'Ahmed Khan', avatar_url: '' } },
    { id: '2', blood_group: 'O-', city: 'Lahore', area: 'DHA', is_available: true, contact_phone: '0321-9876543', donation_count: 12, profile: { full_name: 'Sara Ali', avatar_url: '' } },
    { id: '3', blood_group: 'B+', city: 'Islamabad', area: 'F-10', is_available: true, contact_phone: '0333-5551234', donation_count: 8, profile: { full_name: 'Usman Malik', avatar_url: '' } },
    { id: '4', blood_group: 'AB+', city: 'Karachi', area: 'Clifton', is_available: false, contact_phone: '0345-7778899', donation_count: 3, profile: { full_name: 'Fatima Hassan', avatar_url: '' } },
    { id: '5', blood_group: 'O+', city: 'Rawalpindi', area: 'Saddar', is_available: true, contact_phone: '0312-4445566', donation_count: 15, profile: { full_name: 'Ali Raza', avatar_url: '' } },
  ]

  const demoRequests: BloodRequest[] = [
    { id: '1', patient_name: 'Muhammad Asif', blood_group: 'O-', hospital_name: 'Aga Khan Hospital', city: 'Karachi', urgency_level: 'critical', status: 'open', created_at: new Date().toISOString() },
    { id: '2', patient_name: 'Ayesha Bibi', blood_group: 'B+', hospital_name: 'Services Hospital', city: 'Lahore', urgency_level: 'urgent', status: 'open', created_at: new Date().toISOString() },
    { id: '3', patient_name: 'Kamran Shah', blood_group: 'A+', hospital_name: 'PIMS Hospital', city: 'Islamabad', urgency_level: 'normal', status: 'open', created_at: new Date().toISOString() },
  ]

  useEffect(() => {
    fetchDonors()
    fetchRequests()
  }, [filters])

  const fetchDonors = async () => {
    setLoading(true)
    let query = supabase
      .from('blood_donors')
      .select(`
        *,
        profile:profiles(full_name, avatar_url)
      `)
      .eq('is_available', true)

    if (filters.bloodGroup) {
      query = query.eq('blood_group', filters.bloodGroup)
    }
    if (filters.city) {
      query = query.eq('city', filters.city)
    }

    const { data } = await query.limit(20)
    if (data && data.length > 0) {
      setDonors(data as unknown as BloodDonor[])
    } else {
      setDonors(demoDonors)
    }
    setLoading(false)
  }

  const fetchRequests = async () => {
    const { data } = await supabase
      .from('blood_requests')
      .select('*')
      .eq('status', 'open')
      .order('urgency_level', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(10)

    if (data && data.length > 0) {
      setRequests(data)
    } else {
      setRequests(demoRequests)
    }
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600 text-white animate-pulse'
      case 'urgent': return 'bg-orange-500 text-white'
      default: return 'bg-emerald-600 text-white'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-red-900 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-red-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-red-500 rounded-full blur-3xl opacity-10 animate-pulse delay-700"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-md border border-white/20 shadow-2xl shadow-red-900/50">
              <Droplets className="w-12 h-12 text-red-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Blood Bank</h1>
            <p className="text-xl text-red-100 mb-10 leading-relaxed">
              Find blood donors, request blood, or register as a donor. <br className="hidden md:block" />
              Every drop counts in saving a life.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { value: '500+', label: 'Registered Donors' },
                { value: '150+', label: 'Lives Saved' },
                { value: '24/7', label: 'Available' },
              ].map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-red-200 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Urgent Requests Banner */}
      {requests.filter(r => r.urgency_level === 'critical').length > 0 && (
        <div className="bg-red-50 border-b border-red-100 py-4 sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-red-700">
              <div className="flex items-center gap-2 font-bold animate-pulse">
                <AlertCircle className="w-6 h-6" />
                <span>{requests.filter(r => r.urgency_level === 'critical').length} Critical Blood Request(s) Need Immediate Help!</span>
              </div>
              <button 
                onClick={() => setActiveTab('request')}
                className="px-6 py-2 bg-red-600 text-white rounded-full text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
              >
                View Requests
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
              {[
                { id: 'find', label: 'Find Donors', icon: Search },
                { id: 'request', label: 'Blood Requests', icon: AlertCircle },
                { id: 'register', label: 'Become a Donor', icon: Heart }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-3 ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Find Donors Tab */}
          {activeTab === 'find' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Filters */}
              <div className="bg-white rounded-3xl shadow-sm p-8 mb-10 border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Blood Group</label>
                    <div className="relative">
                      <select
                        value={filters.bloodGroup}
                        onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all appearance-none font-medium text-slate-700"
                      >
                        <option value="">All Blood Groups</option>
                        {bloodGroups.map(group => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </select>
                      <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                    <div className="relative">
                      <select
                        value={filters.city}
                        onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all appearance-none font-medium text-slate-700"
                      >
                        <option value="">All Cities</option>
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={fetchDonors}
                      className="w-full px-6 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                    >
                      <Search className="w-5 h-5" />
                      Search Donors
                    </button>
                  </div>
                </div>
              </div>

              {/* Donors Grid */}
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {donors.map(donor => (
                    <div key={donor.id} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border border-slate-100 group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                      
                      <div className="flex items-center gap-5 mb-6 relative z-10">
                        <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 text-2xl font-bold shadow-inner group-hover:bg-red-600 group-hover:text-white transition-colors">
                          {donor.blood_group}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{donor.profile?.full_name || 'Anonymous Donor'}</h3>
                          <p className="text-slate-500 flex items-center gap-1.5 mt-1">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            {donor.city}, {donor.area}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-6 relative z-10">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 ${
                          donor.is_available 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {donor.is_available ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          {donor.is_available ? 'Available' : 'Not Available'}
                        </span>
                        <span className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                          <Heart className="w-4 h-4 text-red-400" />
                          {donor.donation_count} donations
                        </span>
                      </div>
                      
                      <a
                        href={`tel:${donor.contact_phone}`}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-red-600 transition-all shadow-lg hover:shadow-red-600/20 relative z-10"
                      >
                        <Phone className="w-5 h-5" />
                        Contact Donor
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Blood Requests Tab */}
          {activeTab === 'request' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Active Blood Requests</h2>
                <Link
                  href="/blood-bank/request"
                  className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-600/20"
                >
                  <Plus className="w-5 h-5" />
                  Post Request
                </Link>
              </div>
              
              <div className="space-y-4">
                {requests.map(request => (
                  <div key={request.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-100">
                    <div className="flex flex-wrap items-start justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 text-xl font-bold border border-red-100">
                          {request.blood_group}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg mb-1">{request.patient_name}</h3>
                          <p className="text-slate-500 flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            {request.hospital_name}, {request.city}
                          </p>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${getUrgencyColor(request.urgency_level)}`}>
                        {request.urgency_level.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-6 flex items-center gap-4">
                      <button className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2">
                        <Heart className="w-5 h-5" />
                        I Can Help
                      </button>
                      <button className="px-6 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition-all flex items-center gap-2">
                        <Share2 className="w-5 h-5" />
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Register as Donor Tab */}
          {activeTab === 'register' && (
            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
                <div className="text-center mb-10">
                  <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                    <Heart className="w-12 h-12" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">Become a Blood Donor</h2>
                  <p className="text-slate-500 text-lg">Register as a blood donor and help save lives in your community.</p>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Blood Group *</label>
                      <select className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-medium">
                        <option value="">Select</option>
                        {bloodGroups.map(group => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">City *</label>
                      <select className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-medium">
                        <option value="">Select</option>
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Area / Locality</label>
                    <input
                      type="text"
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-medium"
                      placeholder="e.g., Gulshan, DHA, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Contact Phone *</label>
                    <input
                      type="tel"
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-medium"
                      placeholder="03XX-XXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp Number (Optional)</label>
                    <input
                      type="tel"
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-medium"
                      placeholder="03XX-XXXXXXX"
                    />
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <input type="checkbox" className="mt-1 w-5 h-5 text-red-600 border-slate-300 rounded focus:ring-red-500" />
                    <span className="text-sm text-slate-600 font-medium">
                      I confirm that I am eligible to donate blood and agree to be contacted by those in need.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-5 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition-all shadow-red-600/20 text-lg"
                  >
                    Register as Donor
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
