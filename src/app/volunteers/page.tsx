'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { registerAsVolunteer } from '@/lib/supabase/helpers'
import { toast } from 'sonner'
import { 
  Handshake, 
  Heart, 
  Award, 
  Users, 
  TrendingUp, 
  Search, 
  MapPin, 
  Clock, 
  X, 
  CheckCircle, 
  Stethoscope, 
  BookOpen, 
  Cpu, 
  Truck, 
  Siren,
  Filter,
  Loader2
} from 'lucide-react'

interface Volunteer {
  id: string
  full_name: string
  email: string
  phone: string
  city: string
  skills: string[]
  availability: string
  experience: string
  verified: boolean
  created_at: string
}

const cities = [
  'All Cities',
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Hyderabad',
  'Sialkot',
  'Gujranwala',
]

const skillCategories = [
  { id: 'medical', name: 'Medical & First Aid', icon: Stethoscope, skills: ['First Aid', 'Nursing', 'Doctor', 'Paramedic'] },
  { id: 'education', name: 'Education & Tutoring', icon: BookOpen, skills: ['Teaching', 'Tutoring', 'Mentoring', 'Training'] },
  { id: 'technical', name: 'Technical Skills', icon: Cpu, skills: ['IT Support', 'Web Development', 'Data Entry', 'Repair'] },
  { id: 'social', name: 'Social Work', icon: Heart, skills: ['Counseling', 'Community Outreach', 'Translation', 'Event Management'] },
  { id: 'logistics', name: 'Logistics & Transport', icon: Truck, skills: ['Driving', 'Delivery', 'Warehouse', 'Coordination'] },
  { id: 'emergency', name: 'Emergency Response', icon: Siren, skills: ['Rescue', 'Firefighting', 'Disaster Relief', 'Security'] },
]

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>([])
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const [selectedSkill, setSelectedSkill] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    city: '',
    skills: [] as string[],
    availability: '',
    experience: '',
  })
  const supabase = createClient()

  // Fetch volunteers from Supabase
  useEffect(() => {
    const fetchVolunteers = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('volunteers')
          .select(`
            *,
            profiles:user_id (
              full_name,
              email,
              phone,
              city,
              avatar_url
            )
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Error fetching volunteers:', error)
        }
        
        if (data) {
          // Transform data to match Volunteer interface
          const transformedVolunteers = data.map((v: any) => ({
            id: v.id,
            full_name: v.profiles?.full_name || 'Anonymous Volunteer',
            email: v.profiles?.email || '',
            phone: v.profiles?.phone || '',
            city: v.city,
            skills: v.skills || [],
            availability: v.availability,
            experience: v.experience,
            verified: true,
            created_at: v.created_at,
          }))
          setVolunteers(transformedVolunteers)
          setFilteredVolunteers(transformedVolunteers)
        } else {
          setVolunteers([])
          setFilteredVolunteers([])
        }
      } catch (error) {
        console.error('Error:', error)
        setVolunteers([])
        setFilteredVolunteers([])
      } finally {
        setLoading(false)
      }
    }
    fetchVolunteers()
  }, [])

  // Filter volunteers
  useEffect(() => {
    let filtered = [...volunteers]
    
    if (selectedCity !== 'All Cities') {
      filtered = filtered.filter(v => v.city === selectedCity)
    }
    
    if (selectedSkill !== 'all') {
      filtered = filtered.filter(v => 
        v.skills.some(s => s.toLowerCase().includes(selectedSkill.toLowerCase()))
      )
    }
    
    if (searchQuery) {
      filtered = filtered.filter(v => 
        v.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        v.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    setFilteredVolunteers(filtered)
  }, [volunteers, selectedCity, selectedSkill, searchQuery])

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate phone
    const phoneRegex = /^(\+92|0)?3[0-9]{9}$/
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      toast.error('Please enter valid Pakistani phone number (03XX-XXXXXXX)')
      return
    }

    setSubmitting(true)
    
    try {
      const { data, error } = await registerAsVolunteer({
        city: formData.city,
        skills: formData.skills,
        availability: formData.availability.toLowerCase() as 'weekdays' | 'weekends' | 'both' | 'flexible',
        experience: formData.experience,
        is_active: true
      })
      
      if (error) {
        if (error.message === 'Not authenticated') {
          toast.error('Please login to register as a volunteer', {
            action: {
              label: 'Login',
              onClick: () => window.location.href = '/auth/login'
            }
          })
        } else if ('code' in error && error.code === '23505') {
          toast.error('You are already registered as a volunteer!')
        } else {
          toast.error('Registration failed', { description: error.message })
        }
      } else {
        toast.success('Thank you for registering as a volunteer!', {
          description: 'Your profile has been added to our network.'
        })
        setShowRegistrationForm(false)
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          city: '',
          skills: [],
          availability: '',
          experience: '',
        })
        
        // Refresh the volunteers list
        const { data: refreshedData } = await supabase
          .from('volunteers')
          .select(`
            *,
            profiles:user_id (
              full_name,
              email,
              phone,
              city,
              avatar_url
            )
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
        
        if (refreshedData) {
          const transformedVolunteers = refreshedData.map((v: any) => ({
            id: v.id,
            full_name: v.profiles?.full_name || 'Anonymous Volunteer',
            email: v.profiles?.email || '',
            phone: v.profiles?.phone || '',
            city: v.city,
            skills: v.skills || [],
            availability: v.availability,
            experience: v.experience,
            verified: true,
            created_at: v.created_at,
          }))
          setVolunteers(transformedVolunteers)
          setFilteredVolunteers(transformedVolunteers)
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('An error occurred while registering')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl opacity-20 animate-pulse delay-700"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
              <Handshake className="w-4 h-4 text-white" />
              <span>Join 15+ Active Volunteers</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Volunteer Network
            </h1>
            <p className="text-xl text-emerald-100 mb-10 leading-relaxed">
              Connect with volunteers or become one yourself. Make a difference in your community through your skills and time.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setShowRegistrationForm(true)}
                className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Become a Volunteer
              </button>
              <a
                href="#find-volunteer"
                className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/10 flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Find Volunteers
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Volunteer */}
      <section className="py-12 -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Why Volunteer With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: Heart, title: 'Make Impact', desc: 'Help those in need and create real change' },
                { icon: Award, title: 'Earn Recognition', desc: 'Get badges and certificates for your service' },
                { icon: Users, title: 'Build Network', desc: 'Connect with like-minded community members' },
                { icon: TrendingUp, title: 'Grow Skills', desc: 'Develop leadership and professional skills' },
              ].map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-100 transition-colors">
                    <item.icon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skill Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Volunteer Categories</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-100 group"
                onClick={() => setSelectedSkill(cat.skills[0])}
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                  <cat.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{cat.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find Volunteers */}
      <section id="find-volunteer" className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Find Volunteers</h2>
              <p className="text-slate-600">Connect with skilled individuals ready to help.</p>
            </div>
          </div>
          
          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search volunteers by name, skill, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                />
              </div>
              <div className="relative min-w-[200px]">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none bg-white appearance-none cursor-pointer"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="relative min-w-[200px]">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none bg-white appearance-none cursor-pointer"
                >
                  <option value="all">All Skills</option>
                  {skillCategories.flatMap(cat => cat.skills).map((skill) => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Volunteers Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVolunteers.map((volunteer) => (
              <div
                key={volunteer.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-emerald-500/20">
                      {volunteer.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        {volunteer.full_name}
                        {volunteer.verified && (
                          <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-50" />
                        )}
                      </h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {volunteer.city}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-grow">{volunteer.experience}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {volunteer.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100"
                    >
                      {skill}
                    </span>
                  ))}
                  {volunteer.skills.length > 3 && (
                    <span className="px-2.5 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-full border border-slate-100">
                      +{volunteer.skills.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                  <span className="text-sm text-slate-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {volunteer.availability}
                  </span>
                  <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}

          {!loading && filteredVolunteers.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No volunteers found</h3>
              <p className="text-slate-500 mb-8">Try adjusting your filters or be the first volunteer in this category!</p>
              <button
                onClick={() => setShowRegistrationForm(true)}
                className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
              >
                Register as Volunteer
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Registration Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 my-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Become a Volunteer</h3>
                <p className="text-slate-500 text-sm">Join our community of changemakers</p>
              </div>
              <button
                onClick={() => setShowRegistrationForm(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    placeholder="0300-1234567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    City *
                  </label>
                  <select
                    required
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none bg-white transition-all"
                  >
                    <option value="">Select city</option>
                    {cities.slice(1).map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Skills * (Select at least one)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {skillCategories.flatMap(cat => cat.skills).map((skill) => (
                    <label
                      key={skill}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                        formData.skills.includes(skill) 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.skills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        className="accent-emerald-600 w-4 h-4 rounded"
                      />
                      <span className="text-sm font-medium">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Availability *
                </label>
                <select
                  required
                  value={formData.availability}
                  onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none bg-white transition-all"
                >
                  <option value="">Select availability</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Weekends">Weekends</option>
                  <option value="Evenings">Evenings</option>
                  <option value="Flexible">Flexible</option>
                  <option value="Full-time">Full-time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Experience / Bio
                </label>
                <textarea
                  rows={3}
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="Tell us about your experience and why you want to volunteer..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none transition-all"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting || formData.skills.length === 0}
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register as Volunteer'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
