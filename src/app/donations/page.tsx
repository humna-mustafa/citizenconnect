'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  Heart, 
  Stethoscope, 
  GraduationCap, 
  Waves, 
  Utensils, 
  Baby, 
  Home, 
  Search, 
  Filter, 
  CheckCircle2, 
  MapPin, 
  Lock, 
  BarChart3, 
  Wallet, 
  X,
  ChevronDown,
  ArrowRight
} from 'lucide-react'

interface DonationCase {
  id: string
  title: string
  description: string
  category: string
  target_amount: number
  raised_amount: number
  beneficiary_name: string
  city: string
  urgency: 'critical' | 'high' | 'medium' | 'low'
  status: 'active' | 'completed' | 'verified'
  verification_status: string
  created_at: string
  image_url?: string
}

const categories = [
  { id: 'all', name: 'All Causes', icon: Heart, count: 0 },
  { id: 'medical', name: 'Medical', icon: Stethoscope, count: 0 },
  { id: 'education', name: 'Education', icon: GraduationCap, count: 0 },
  { id: 'flood_relief', name: 'Flood Relief', icon: Waves, count: 0 },
  { id: 'food', name: 'Food & Ration', icon: Utensils, count: 0 },
  { id: 'orphanage', name: 'Orphanage', icon: Baby, count: 0 },
  { id: 'shelter', name: 'Shelter', icon: Home, count: 0 },
]

const urgencyColors = {
  critical: 'bg-red-600 text-white animate-pulse',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-500 text-white',
  low: 'bg-emerald-500 text-white',
}

const urgencyLabels = {
  critical: 'Critical',
  high: 'Urgent',
  medium: 'Medium',
  low: 'Normal',
}

// Sample data for demonstration
const sampleCases: DonationCase[] = [
  {
    id: '1',
    title: 'Heart Surgery for 5-Year-Old Ahmed',
    description: 'Ahmed needs urgent heart surgery. His family cannot afford the treatment. Help save this young life.',
    category: 'medical',
    target_amount: 500000,
    raised_amount: 350000,
    beneficiary_name: 'Ahmed Ali',
    city: 'Lahore',
    urgency: 'critical',
    status: 'active',
    verification_status: 'verified',
    created_at: '2024-01-15',
    image_url: '/images/donation-medical.jpg'
  },
  {
    id: '2',
    title: 'Scholarship for 50 Students in Sindh',
    description: 'Help provide quality education to deserving students from underprivileged families in rural Sindh.',
    category: 'education',
    target_amount: 300000,
    raised_amount: 180000,
    beneficiary_name: 'Various Students',
    city: 'Hyderabad',
    urgency: 'high',
    status: 'active',
    verification_status: 'verified',
    created_at: '2024-01-10',
  },
  {
    id: '3',
    title: 'Flood Relief - Rebuild Homes in Balochistan',
    description: 'Recent floods destroyed 200+ homes. Help families rebuild their lives and shelter.',
    category: 'flood_relief',
    target_amount: 2000000,
    raised_amount: 850000,
    beneficiary_name: 'Flood Victims',
    city: 'Quetta',
    urgency: 'critical',
    status: 'active',
    verification_status: 'verified',
    created_at: '2024-01-05',
  },
  {
    id: '4',
    title: 'Monthly Ration for 100 Families',
    description: 'Provide monthly food supplies to families struggling with poverty in Karachi slums.',
    category: 'food',
    target_amount: 200000,
    raised_amount: 120000,
    beneficiary_name: 'Multiple Families',
    city: 'Karachi',
    urgency: 'high',
    status: 'active',
    verification_status: 'verified',
    created_at: '2024-01-20',
  },
  {
    id: '5',
    title: 'Support Dar-ul-Atfal Orphanage',
    description: 'Help provide education, meals, and care for 75 orphan children at Dar-ul-Atfal.',
    category: 'orphanage',
    target_amount: 400000,
    raised_amount: 280000,
    beneficiary_name: 'Orphan Children',
    city: 'Peshawar',
    urgency: 'medium',
    status: 'active',
    verification_status: 'verified',
    created_at: '2024-01-12',
  },
  {
    id: '6',
    title: 'Build Shelter for Homeless in Islamabad',
    description: 'Construct a shelter home to provide warmth and safety for homeless individuals during winter.',
    category: 'shelter',
    target_amount: 800000,
    raised_amount: 400000,
    beneficiary_name: 'Homeless Community',
    city: 'Islamabad',
    urgency: 'medium',
    status: 'active',
    verification_status: 'verified',
    created_at: '2024-01-08',
  },
]

export default function DonationsPage() {
  const [cases, setCases] = useState<DonationCase[]>(sampleCases)
  const [filteredCases, setFilteredCases] = useState<DonationCase[]>(sampleCases)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedUrgency, setSelectedUrgency] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('urgency')
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [selectedCase, setSelectedCase] = useState<DonationCase | null>(null)
  const [donationAmount, setDonationAmount] = useState('')
  const supabase = createClient()

  // Fetch donation cases from Supabase
  useEffect(() => {
    const fetchCases = async () => {
      const { data, error } = await supabase
        .from('donation_cases')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
      
      if (data && data.length > 0) {
        setCases(data)
      }
      // If no data from Supabase, keep using sample data
    }
    fetchCases()
  }, [])

  // Filter cases
  useEffect(() => {
    let filtered = [...cases]
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(c => c.category === selectedCategory)
    }
    
    if (selectedUrgency !== 'all') {
      filtered = filtered.filter(c => c.urgency === selectedUrgency)
    }
    
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Sort
    if (sortBy === 'urgency') {
      const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      filtered.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency])
    } else if (sortBy === 'progress') {
      filtered.sort((a, b) => (b.raised_amount / b.target_amount) - (a.raised_amount / a.target_amount))
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (sortBy === 'amount') {
      filtered.sort((a, b) => b.target_amount - a.target_amount)
    }
    
    setFilteredCases(filtered)
  }, [cases, selectedCategory, selectedUrgency, searchQuery, sortBy])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getProgress = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100)
  }

  const openDonationModal = (donationCase: DonationCase) => {
    setSelectedCase(donationCase)
    setShowDonationModal(true)
  }

  const handleDonation = async () => {
    if (!selectedCase || !donationAmount) return
    
    // In a real implementation, this would process payment
    alert(`Thank you for your donation of ${formatCurrency(Number(donationAmount))} to "${selectedCase.title}"! In a live system, this would redirect to a payment gateway.`)
    setShowDonationModal(false)
    setDonationAmount('')
    setSelectedCase(null)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-emerald-900 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-500 rounded-full blur-3xl opacity-10 animate-pulse delay-700"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-semibold mb-8 backdrop-blur-md border border-white/20 shadow-lg">
              <Heart className="w-4 h-4 text-pink-400" />
              <span className="text-emerald-100">100% Transparent Donations</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Support a Cause</h1>
            <p className="text-xl text-emerald-100 mb-10 leading-relaxed">
              Every contribution matters. Help those in need with verified and transparent donation campaigns.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { value: 'PKR 50M+', label: 'Total Raised' },
                { value: '500+', label: 'Lives Impacted' },
                { value: '100%', label: 'Verified Cases' },
              ].map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-emerald-200 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-8">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search campaigns by title, description, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedUrgency}
                  onChange={(e) => setSelectedUrgency(e.target.value)}
                  className="w-full md:w-48 px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none appearance-none font-medium text-slate-700"
                >
                  <option value="all">All Urgency</option>
                  <option value="critical">Critical</option>
                  <option value="high">Urgent</option>
                  <option value="medium">Medium</option>
                  <option value="low">Normal</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full md:w-48 px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none appearance-none font-medium text-slate-700"
                >
                  <option value="urgency">Sort by Urgency</option>
                  <option value="progress">Sort by Progress</option>
                  <option value="newest">Sort by Newest</option>
                  <option value="amount">Sort by Amount</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-2.5 rounded-full font-bold transition-all flex items-center gap-2 text-sm ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Donation Cases Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              {filteredCases.length} Active Campaigns
            </h2>
            <Link
              href="/donations/create"
              className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
            >
              Start a Campaign
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCases.map((donationCase) => {
              const CategoryIcon = categories.find(c => c.id === donationCase.category)?.icon || Heart
              return (
                <div
                  key={donationCase.id}
                  className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden hover:shadow-xl transition-all group hover:-translate-y-1 duration-300"
                >
                  {/* Image placeholder */}
                  <div className="h-56 bg-slate-100 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform duration-500">
                      <CategoryIcon className="w-24 h-24 opacity-50" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    
                    {/* Urgency Badge */}
                    <span className={`absolute top-4 left-4 px-4 py-1.5 ${urgencyColors[donationCase.urgency]} text-xs font-bold rounded-full shadow-lg uppercase tracking-wide`}>
                      {urgencyLabels[donationCase.urgency]}
                    </span>
                    
                    {/* Verified Badge */}
                    {donationCase.verification_status === 'verified' && (
                      <span className="absolute top-4 right-4 px-3 py-1.5 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}

                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center gap-2 text-sm font-medium mb-1 opacity-90">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {donationCase.city}</span>
                        <span>•</span>
                        <span className="capitalize">{donationCase.category.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {donationCase.title}
                    </h3>
                    
                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {donationCase.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold text-emerald-600 text-lg">{formatCurrency(donationCase.raised_amount)}</span>
                        <span className="text-slate-400 font-medium text-xs self-end mb-1">of {formatCurrency(donationCase.target_amount)}</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${getProgress(donationCase.raised_amount, donationCase.target_amount)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs font-bold text-slate-700">{getProgress(donationCase.raised_amount, donationCase.target_amount).toFixed(0)}% funded</span>
                        <span className="text-xs text-slate-400 font-medium">12 days left</span>
                      </div>
                    </div>

                    <button
                      onClick={() => openDonationModal(donationCase)}
                      className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-600/20 flex items-center justify-center gap-2"
                    >
                      <Heart className="w-5 h-5" />
                      Donate Now
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredCases.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Search className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No campaigns found</h3>
              <p className="text-slate-500">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Donations Work</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">We ensure your donations reach the right people with complete transparency and security.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Browse Campaigns', desc: 'Explore verified donation campaigns', icon: Search },
              { step: '02', title: 'Choose Amount', desc: 'Select how much you want to donate', icon: Wallet },
              { step: '03', title: 'Secure Payment', desc: 'Make payment through secure channels', icon: Lock },
              { step: '04', title: 'Track Impact', desc: 'See how your donation helps', icon: BarChart3 },
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-4 bg-white/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-4 text-center">
                  <div className="w-20 h-20 mx-auto bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform duration-300 border border-emerald-500/20">
                    <item.icon className="w-10 h-10" />
                  </div>
                  <div className="text-sm font-bold text-emerald-500 mb-3 tracking-widest">STEP {item.step}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Modal */}
      {showDonationModal && selectedCase && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
            
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Make a Donation</h3>
              <button
                onClick={() => setShowDonationModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-slate-500 text-sm mb-1">You are donating to:</p>
              <p className="font-bold text-slate-900 text-lg leading-tight">{selectedCase.title}</p>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Donation Amount (PKR)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rs.</span>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border-2 border-slate-200 focus:border-emerald-500 focus:ring-0 outline-none transition-all font-bold text-lg text-slate-900 placeholder:font-normal"
                />
              </div>
              {/* Quick amounts */}
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[500, 1000, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setDonationAmount(amt.toString())}
                    className="px-2 py-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 hover:bg-emerald-600 hover:text-white transition-all"
                  >
                    {formatCurrency(amt)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleDonation}
              disabled={!donationAmount}
              className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-lg"
            >
              Donate {donationAmount ? formatCurrency(Number(donationAmount)) : ''}
            </button>

            <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1.5 font-medium">
              <Lock className="w-3 h-3" /> Your payment is secure and encrypted
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
