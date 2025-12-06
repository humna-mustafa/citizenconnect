'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import { getBloodDonors, registerAsBloodDonor, createBloodRequest, subscribeToBloodRequests } from '@/lib/supabase/helpers'
import { toast } from 'sonner'
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
  Loader2,
  Map as MapIcon
} from 'lucide-react'

const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Loading Map...</div>
})

const getCityCoordinates = (city: string): [number, number] => {
  const coords: Record<string, [number, number]> = {
    'Karachi': [24.8607, 67.0011],
    'Lahore': [31.5204, 74.3587],
    'Islamabad': [33.6844, 73.0479],
    'Rawalpindi': [33.5651, 73.0169],
    'Faisalabad': [31.4504, 73.1350],
    'Multan': [30.1575, 71.5249],
    'Peshawar': [34.0151, 71.5249],
    'Quetta': [30.1798, 66.9750]
  }
  // Add some random jitter so markers don't overlap perfectly
  const base = coords[city] || [30.3753, 69.3451]
  return [base[0] + (Math.random() - 0.5) * 0.05, base[1] + (Math.random() - 0.5) * 0.05]
}

interface BloodDonor {
  id: string
  blood_group: string
  city: string
  area: string
  is_available: boolean
  contact_phone: string
  donation_count: number
  full_name: string
  avatar_url: string
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
  const [submitting, setSubmitting] = useState(false)
  const [filters, setFilters] = useState({
    bloodGroup: '',
    city: ''
  })
  const [showMap, setShowMap] = useState(false)
  
  // Registration form data
  const [registerForm, setRegisterForm] = useState({
    blood_group: '',
    city: '',
    area: '',
    contact_phone: '',
    whatsapp_number: '',
    is_available: true
  })
  
  const supabase = createClient()

  useEffect(() => {
    fetchDonors()
    fetchRequests()

    // Realtime subscription for blood requests
    const subscription = subscribeToBloodRequests(
      filters.city || 'Karachi',
      filters.bloodGroup || 'O+',
      (payload) => {
        console.log('New blood request:', payload)
        toast.info('New blood request received!', {
          description: `${payload.new.blood_group} needed in ${payload.new.city}`,
        })
        fetchRequests()
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [filters])

  const fetchDonors = async () => {
    setLoading(true)
    try {
      const { data, error } = await getBloodDonors({
        bloodGroup: filters.bloodGroup || undefined,
        city: filters.city || undefined
      })

      if (error) {
        console.error('Error fetching donors:', error)
        toast.error('Failed to fetch donors')
      }
      
      // Set whatever data we got (empty array if none)
      setDonors((data as BloodDonor[]) || [])
    } catch (error) {
      console.error('Error fetching donors:', error)
      setDonors([])
    } finally {
      setLoading(false)
    }
  }

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('blood_requests')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Error fetching requests:', error)
      }
      
      setRequests(data || [])
    } catch (error) {
      console.error('Error fetching requests:', error)
      setRequests([])
    }
  }

  const handleRegisterDonor = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const { data, error } = await registerAsBloodDonor({
        blood_group: registerForm.blood_group as 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-',
        city: registerForm.city,
        area: registerForm.area,
        contact_phone: registerForm.contact_phone,
        contact_whatsapp: registerForm.whatsapp_number || null,
        is_available: registerForm.is_available,
      })
      
      if (error) {
        if (error.message === 'Not authenticated') {
          toast.error('Please login to register as a donor', {
            action: {
              label: 'Login',
              onClick: () => window.location.href = '/auth/login'
            }
          })
        } else {
          toast.error('Failed to register', { description: error.message })
        }
      } else {
        toast.success('Successfully registered as blood donor!', {
          description: 'Thank you for joining our donor network.'
        })
        setRegisterForm({
          blood_group: '',
          city: '',
          area: '',
          contact_phone: '',
          whatsapp_number: '',
          is_available: true
        })
        setActiveTab('find')
        fetchDonors()
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('An error occurred while registering')
    } finally {
      setSubmitting(false)
    }
  }

  const handleHelpRequest = async (request: BloodRequest) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      toast.error('Please login to respond to blood requests', {
        action: {
          label: 'Login',
          onClick: () => window.location.href = '/auth/login'
        }
      })
      return
    }
    
    toast.success('Thank you for offering to help!', {
      description: `Contact info will be shared with the requester for ${request.patient_name}.`
    })
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
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-red-950 to-slate-900">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/40 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-rose-900/30 via-transparent to-transparent"></div>
        </div>
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        
        {/* Decorative Blur Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-red-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-rose-500 rounded-full blur-3xl opacity-15 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600 rounded-full blur-3xl opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl shadow-red-900/50">
              <Droplets className="w-12 h-12 text-red-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Blood Bank</h1>
            <p className="text-xl text-red-100/80 mb-10 leading-relaxed">
              Find blood donors, request blood, or register as a donor. <br className="hidden md:block" />
              Every drop counts in saving a life.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { value: '10+', label: 'Registered Donors' },
                { value: '25+', label: 'Lives Saved' },
                { value: '24/7', label: 'Available' },
              ].map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-red-200/70 font-medium">{stat.label}</div>
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
                  <div className="flex items-end gap-2">
                    <button
                      onClick={fetchDonors}
                      className="flex-1 px-6 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                    >
                      <Search className="w-5 h-5" />
                      Search
                    </button>
                    <button
                      onClick={() => setShowMap(!showMap)}
                      className={`px-4 py-4 font-bold rounded-xl transition-all border border-slate-200 flex items-center justify-center gap-2 ${
                        showMap ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <MapIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Map View */}
              {showMap && (
                <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                  <Map 
                    markers={donors.map(d => ({
                      id: d.id,
                      position: getCityCoordinates(d.city),
                      title: `${d.full_name} (${d.blood_group})`,
                      description: `${d.city}, ${d.area}`
                    }))}
                    zoom={6}
                  />
                </div>
              )}

              {/* Donors Grid */}
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                </div>
              ) : donors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {donors.map(donor => (
                    <div key={donor.id} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border border-slate-100 group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                      
                      <div className="flex items-center gap-5 mb-6 relative z-10">
                        <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 text-2xl font-bold shadow-inner group-hover:bg-red-600 group-hover:text-white transition-colors">
                          {donor.blood_group}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{donor.full_name || 'Anonymous Donor'}</h3>
                          <p className="text-slate-500 flex items-center gap-1.5 mt-1">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            {donor.city}{donor.area ? `, ${donor.area}` : ''}
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
                          {donor.donation_count || 0} donations
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
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-300">
                    <Droplets className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">No donors found</h3>
                  <p className="text-slate-500 mb-8">
                    {filters.bloodGroup || filters.city 
                      ? 'Try adjusting your filters or search in a different city' 
                      : 'Be the first to register as a blood donor!'}
                  </p>
                  <button
                    onClick={() => setActiveTab('register')}
                    className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                  >
                    Register as Donor
                  </button>
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
                      <button 
                        onClick={() => handleHelpRequest(request)}
                        className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                      >
                        <Heart className="w-5 h-5" />
                        I Can Help
                      </button>
                      <button 
                        onClick={() => {
                          navigator.share?.({
                            title: `Blood Needed: ${request.blood_group}`,
                            text: `${request.blood_group} blood needed for ${request.patient_name} at ${request.hospital_name}, ${request.city}`,
                            url: window.location.href
                          }).catch(() => {
                            navigator.clipboard.writeText(`${request.blood_group} blood needed for ${request.patient_name} at ${request.hospital_name}, ${request.city}`)
                            toast.success('Link copied to clipboard!')
                          })
                        }}
                        className="px-6 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition-all flex items-center gap-2"
                      >
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

                <form onSubmit={handleRegisterDonor} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Blood Group *</label>
                      <select 
                        required
                        value={registerForm.blood_group}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, blood_group: e.target.value }))}
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-medium"
                      >
                        <option value="">Select</option>
                        {bloodGroups.map(group => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">City *</label>
                      <select 
                        required
                        value={registerForm.city}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-medium"
                      >
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
                      value={registerForm.area}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, area: e.target.value }))}
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-medium"
                      placeholder="e.g., Gulshan, DHA, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      value={registerForm.contact_phone}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, contact_phone: e.target.value }))}
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-medium"
                      placeholder="03XX-XXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp Number (Optional)</label>
                    <input
                      type="tel"
                      value={registerForm.whatsapp_number}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-medium"
                      placeholder="03XX-XXXXXXX"
                    />
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <input 
                      type="checkbox" 
                      required
                      checked={registerForm.is_available}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, is_available: e.target.checked }))}
                      className="mt-1 w-5 h-5 text-red-600 border-slate-300 rounded focus:ring-red-500" 
                    />
                    <span className="text-sm text-slate-600 font-medium">
                      I confirm that I am eligible to donate blood and agree to be contacted by those in need.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-5 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition-all shadow-red-600/20 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      'Register as Donor'
                    )}
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
