'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { 
  Droplets, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Heart, 
  Shield, 
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const cities = [
  'Islamabad', 'Karachi', 'Lahore', 'Rawalpindi', 'Faisalabad', 
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Abbottabad', 'Bahawalpur', 'Sargodha', 'Sukkur'
]

export default function BloodBankRegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    blood_type: '',
    city: '',
    phone: '',
    last_donation_date: '',
    is_available: true,
    health_conditions: ''
  })

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Please login to register as a donor')
        router.push('/auth/login?redirect=/blood-bank/register')
        return
      }
      setUser(user)
      setCheckingAuth(false)
    }
    checkUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.blood_type || !formData.city || !formData.phone) {
      toast.error('Please fill all required fields')
      return
    }

    // Validate phone
    const phoneRegex = /^(\+92|0)?3[0-9]{9}$/
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid Pakistani phone number')
      return
    }

    setLoading(true)

    try {
      const { registerAsBloodDonor } = await import('@/lib/supabase/helpers')
      const { error } = await registerAsBloodDonor({
        user_id: user.id,
        blood_group: formData.blood_type as "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-",
        city: formData.city,
        last_donation_date: formData.last_donation_date || null,
        is_available: formData.is_available
      })

      if (error) {
        if (error.message?.includes('duplicate') || error.message?.includes('already')) {
          toast.error('You are already registered as a blood donor')
        } else {
          toast.error('Failed to register. Please try again.')
        }
        console.error(error)
      } else {
        toast.success('Successfully registered as a blood donor!')
        router.push('/blood-bank')
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-red-900 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-72 h-72 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/blood-bank"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blood Bank
          </Link>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-semibold mb-6 backdrop-blur-md border border-white/20">
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-red-100">Save Lives</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Register as Blood Donor
            </h1>
            <p className="text-xl text-slate-300">
              Join our network of life-savers. Your blood donation can save up to 3 lives.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 -mt-8 relative z-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Eligibility Notice */}
            <div className="p-6 bg-red-50 border-b border-red-100">
              <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Donor Eligibility
              </h3>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• You must be between 18-65 years old</li>
                <li>• Weight should be at least 50 kg</li>
                <li>• Last donation should be at least 3 months ago</li>
                <li>• No chronic diseases or recent surgeries</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Blood Type */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  Blood Type *
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {bloodTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, blood_type: type }))}
                      className={`py-4 rounded-xl font-bold text-lg transition-all ${
                        formData.blood_type === type
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 scale-105'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-bold text-slate-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  City *
                </label>
                <select
                  id="city"
                  title="Select your city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none"
                  required
                >
                  <option value="">Select your city</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="03XX XXXXXXX"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">This will be shared with those who need blood</p>
              </div>

              {/* Last Donation */}
              <div>
                <label htmlFor="lastDonation" className="block text-sm font-bold text-slate-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Last Donation Date (optional)
                </label>
                <input
                  id="lastDonation"
                  type="date"
                  title="Select your last blood donation date"
                  value={formData.last_donation_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_donation_date: e.target.value }))}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none"
                />
              </div>

              {/* Health Conditions */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Health Conditions (optional)
                </label>
                <textarea
                  value={formData.health_conditions}
                  onChange={(e) => setFormData(prev => ({ ...prev, health_conditions: e.target.value }))}
                  placeholder="Any health conditions we should know about..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none resize-none"
                />
              </div>

              {/* Availability */}
              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.is_available}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_available: e.target.checked }))}
                  className="w-5 h-5 accent-emerald-600 rounded"
                />
                <label htmlFor="available" className="text-slate-700 cursor-pointer">
                  <span className="font-semibold">I am currently available to donate</span>
                  <p className="text-sm text-slate-500">You can change this anytime from your profile</p>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Droplets className="w-5 h-5" />
                    Register as Donor
                  </>
                )}
              </button>

              {/* Terms */}
              <p className="text-xs text-slate-500 text-center">
                By registering, you agree to our{' '}
                <Link href="/terms" className="text-red-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-red-600 hover:underline">Privacy Policy</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
