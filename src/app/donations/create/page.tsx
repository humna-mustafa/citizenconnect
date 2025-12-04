'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { 
  Heart, 
  Upload, 
  DollarSign, 
  Calendar, 
  User, 
  FileText, 
  CreditCard, 
  Phone, 
  Mail,
  Loader2,
  AlertCircle
} from 'lucide-react'

export default function CreateCampaignPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    beneficiary_name: '',
    beneficiary_cnic: '',
    target_amount: '',
    description: '',
    story: '', // Why This Campaign Matters
    bank_account_title: '',
    bank_name: '',
    account_number: '',
    jazzcash_number: '',
    duration: '30 days',
    contact_email: '',
    contact_phone: ''
  })
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('donation_categories').select('*')
      if (data) setCategories(data)
    }
    fetchCategories()

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Please login to create a campaign')
        router.push('/auth/login?redirect=/donations/create')
      }
    }
    checkUser()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be under 5MB')
        return
      }
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.category_id || !formData.beneficiary_name || !formData.target_amount || !formData.description || !formData.story || !file || !formData.bank_account_title || !formData.bank_name || !formData.account_number || !formData.contact_email || !formData.contact_phone) {
      toast.error('Please fill all required fields')
      return
    }

    const amount = parseInt(formData.target_amount)
    if (amount < 1000 || amount > 10000000) {
      toast.error('Target amount must be between 1,000 and 10,000,000')
      return
    }

    if (formData.description.length < 100) {
      toast.error('Description must be at least 100 characters')
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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Upload file
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('evidence-files')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Create campaign
      const { error: insertError } = await supabase
        .from('donation_cases')
        .insert({
          title: formData.title,
          slug: formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
          category_id: formData.category_id,
          beneficiary_name: formData.beneficiary_name,
          goal_amount: amount,
          description: formData.description,
          story: formData.story,
          documents: [filePath],
          bank_details: {
            account_title: formData.bank_account_title,
            bank_name: formData.bank_name,
            account_number: formData.account_number
          },
          jazzcash_number: formData.jazzcash_number,
          author_id: user.id,
          status: 'Pending Approval',
          is_active: false,
          is_verified: false,
          raised_amount: 0
        })

      if (insertError) throw insertError

      toast.success('Campaign submitted for review. Our team will verify and publish within 24-48 hours.')
      router.push('/donations')
    } catch (error) {
      console.error(error)
      toast.error('Failed to create campaign. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-green-600 px-8 py-6 text-white">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Heart className="h-8 w-8" />
                Create Campaign
              </h1>
              <p className="mt-2 text-green-100">
                Start a fundraising campaign for a cause you care about.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Campaign Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Campaign Details
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      maxLength={100}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target Amount (PKR) *
                      </label>
                      <input
                        type="number"
                        name="target_amount"
                        value={formData.target_amount}
                        onChange={handleChange}
                        min="1000"
                        max="10000000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Description * (Min 100 chars)
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      minLength={100}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Why This Campaign Matters *
                    </label>
                    <textarea
                      name="story"
                      value={formData.story}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Supporting Documents *
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-green-500 transition-colors">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                            <span>Upload a file</span>
                            <input type="file" className="sr-only" onChange={handleFileChange} accept="image/*,.pdf" required />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, PDF up to 5MB
                        </p>
                        {file && (
                          <p className="text-sm text-green-600 font-medium mt-2">
                            Selected: {file.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Beneficiary Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-green-600" />
                  Beneficiary Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Beneficiary Name *
                    </label>
                    <input
                      type="text"
                      name="beneficiary_name"
                      value={formData.beneficiary_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Beneficiary CNIC
                    </label>
                    <input
                      type="text"
                      name="beneficiary_cnic"
                      value={formData.beneficiary_cnic}
                      onChange={handleChange}
                      placeholder="XXXXX-XXXXXXX-X"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  Bank Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Account Title *
                    </label>
                    <input
                      type="text"
                      name="bank_account_title"
                      value={formData.bank_account_title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Number / IBAN *
                    </label>
                    <input
                      type="text"
                      name="account_number"
                      value={formData.account_number}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      JazzCash/Easypaisa Number
                    </label>
                    <input
                      type="text"
                      name="jazzcash_number"
                      value={formData.jazzcash_number}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      name="contact_email"
                      value={formData.contact_email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Duration
                    </label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="15 days">15 days</option>
                      <option value="30 days">30 days</option>
                      <option value="60 days">60 days</option>
                      <option value="90 days">90 days</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting Campaign...
                    </>
                  ) : (
                    'Submit Campaign for Review'
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
