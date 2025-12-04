'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  AlertCircle,
  Building2,
  FileText,
  Droplets,
  Clock,
  Loader2
} from 'lucide-react'
import { createBloodRequest } from '@/lib/supabase/helpers'

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const cities = [
  'Islamabad', 'Karachi', 'Lahore', 'Rawalpindi', 'Faisalabad', 
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Abbottabad', 'Bahawalpur', 'Sargodha', 'Sukkur'
]

export default function BloodRequestPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_age: '',
    blood_group: '',
    units_required: 1,
    hospital_name: '',
    hospital_address: '',
    city: '',
    contact_person: '',
    contact_phone: '',
    urgency_level: 'Normal',
    additional_notes: '',
    required_by_date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Please login to post a blood request')
        router.push('/auth/login?redirect=/blood-bank/request')
        return
      }
      setUser(user)
    }
    checkUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.patient_name || !formData.patient_age || !formData.blood_group || !formData.hospital_name || !formData.hospital_address || !formData.city || !formData.contact_person || !formData.contact_phone) {
      toast.error('Please fill all required fields')
      return
    }

    // Validate phone
    const phoneRegex = /^(\+92|0)?3[0-9]{9}$/
    if (!phoneRegex.test(formData.contact_phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid Pakistani phone number (03XX-XXXXXXX)')
      return
    }

    setLoading(true)

    try {
      const { error } = await createBloodRequest({
        requester_id: user.id,
        patient_name: formData.patient_name,
        blood_group: formData.blood_group as 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-',
        units_needed: parseInt(formData.units_required.toString()),
        hospital_name: formData.hospital_name,
        hospital_address: formData.hospital_address || null,
        city: formData.city,
        contact_phone: formData.contact_phone,
        urgency_level: formData.urgency_level.toLowerCase() as 'critical' | 'urgent' | 'normal',
        notes: formData.additional_notes || null,
        status: 'open'
      })

      if (error) {
        toast.error('Failed to post request. Please try again.')
        console.error(error)
      } else {
        toast.success('Blood request posted successfully! Matching donors will be notified.')
        router.push('/blood-bank')
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-red-600 px-8 py-6 text-white">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Droplets className="h-8 w-8" />
                Request Blood
              </h1>
              <p className="mt-2 text-red-100">
                Fill out the form below to request blood. We will notify matching donors in your area.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Patient Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-red-600" />
                  Patient Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      name="patient_name"
                      value={formData.patient_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Age *
                    </label>
                    <input
                      type="number"
                      name="patient_age"
                      value={formData.patient_age}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Group Needed *
                    </label>
                    <select
                      name="blood_group"
                      value={formData.blood_group}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Blood Group</option>
                      {bloodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Units Required *
                    </label>
                    <input
                      type="number"
                      name="units_required"
                      value={formData.units_required}
                      onChange={handleChange}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Hospital Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-red-600" />
                  Hospital Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hospital Name *
                    </label>
                    <input
                      type="text"
                      name="hospital_name"
                      value={formData.hospital_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hospital Address *
                    </label>
                    <input
                      type="text"
                      name="hospital_address"
                      value={formData.hospital_address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select City</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Required By Date *
                    </label>
                    <input
                      type="date"
                      name="required_by_date"
                      value={formData.required_by_date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-red-600" />
                  Contact Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      name="contact_person"
                      value={formData.contact_person}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      name="contact_phone"
                      value={formData.contact_phone}
                      onChange={handleChange}
                      placeholder="03XX-XXXXXXX"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Urgency & Notes */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Urgency & Notes
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level
                  </label>
                  <div className="flex gap-4">
                    {['Critical', 'Urgent', 'Normal'].map((level) => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="urgency_level"
                          value={level}
                          checked={formData.urgency_level === level}
                          onChange={handleChange}
                          className="text-red-600 focus:ring-red-500"
                        />
                        <span className={
                          level === 'Critical' ? 'text-red-600 font-bold' :
                          level === 'Urgent' ? 'text-orange-600 font-semibold' :
                          'text-gray-700'
                        }>
                          {level}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    name="additional_notes"
                    value={formData.additional_notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    'Post Blood Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
