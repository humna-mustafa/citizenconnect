'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Save, 
  Loader2,
  FileText,
  Clock,
  DollarSign,
  Link as LinkIcon,
  Lightbulb,
  User,
  MapPin,
  Mail
} from 'lucide-react'
import { createGuide } from '@/lib/supabase/helpers'

const categories = [
  'Roads & Transport',
  'Sewerage & Water',
  'Electricity & Gas',
  'Health',
  'Education',
  'Social Causes',
  'Legal',
  'Government Services'
]

const cities = [
  'Islamabad', 'Karachi', 'Lahore', 'Rawalpindi', 'Faisalabad', 
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Abbottabad', 'Bahawalpur', 'Sargodha', 'Sukkur'
]

export default function SubmitGuidePage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [dbCategories, setDbCategories] = useState<any[]>([])
  const [steps, setSteps] = useState([{ title: '', description: '' }])
  const [links, setLinks] = useState([''])
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    subcategory: '',
    description: '',
    documents_required: '',
    estimated_time: '',
    estimated_cost: '',
    pro_tips: '',
    author_name: '',
    author_email: '',
    author_city: '',
    author_experience: ''
  })

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*')
      if (data) setDbCategories(data)
    }
    fetchCategories()

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Please login to submit a guide')
        router.push('/auth/login?redirect=/guides/submit')
      }
    }
    checkUser()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleStepChange = (index: number, field: 'title' | 'description', value: string) => {
    const newSteps = [...steps]
    newSteps[index][field] = value
    setSteps(newSteps)
  }

  const addStep = () => {
    setSteps([...steps, { title: '', description: '' }])
  }

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index)
      setSteps(newSteps)
    }
  }

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links]
    newLinks[index] = value
    setLinks(newLinks)
  }

  const addLink = () => {
    setLinks([...links, ''])
  }

  const removeLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index)
    setLinks(newLinks)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.category_id || !formData.description || !formData.estimated_time || !formData.estimated_cost || !formData.author_name || !formData.author_email || !formData.author_city) {
      toast.error('Please fill all required fields')
      return
    }

    if (steps.some(step => !step.title || !step.description)) {
      toast.error('Please fill all step titles and descriptions')
      return
    }

    setLoading(true)

    try {
      const { error } = await createGuide({
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        category_id: formData.category_id,
        problem_explanation: formData.description,
        steps: steps,
        required_documents: formData.documents_required.split('\n').filter(d => d.trim()),
        timeline_expectation: formData.estimated_time,
        online_portals: links.filter(l => l.trim()),
        is_published: false
      })

      if (error) {
        toast.error('Failed to submit guide. Please try again.')
        console.error(error)
      } else {
        toast.success('Thank you for contributing! Your guide will be reviewed and published soon.')
        router.push('/guides')
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-blue-600 px-8 py-6 text-white">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <BookOpen className="h-8 w-8" />
                Submit a Guide
              </h1>
              <p className="mt-2 text-blue-100">
                Share your knowledge and help others navigate civic processes.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Basic Info */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guide Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      maxLength={100}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Category</option>
                        {dbCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subcategory
                      </label>
                      <input
                        type="text"
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brief Description * (Max 200 chars)
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      maxLength={200}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Detailed Steps
                </h2>
                <div className="space-y-6">
                  {steps.map((step, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200 relative">
                      <div className="absolute top-4 right-4">
                        {steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeStep(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Step {index + 1}</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Step Title *
                          </label>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Step Description *
                          </label>
                          <textarea
                            value={step.description}
                            onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addStep}
                    className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700"
                  >
                    <Plus className="h-5 w-5" />
                    Add Another Step
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Additional Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documents Required (One per line)
                    </label>
                    <textarea
                      name="documents_required"
                      value={formData.documents_required}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Time *
                    </label>
                    <input
                      type="text"
                      name="estimated_time"
                      value={formData.estimated_time}
                      onChange={handleChange}
                      placeholder="e.g. 2-3 days"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Cost *
                    </label>
                    <input
                      type="text"
                      name="estimated_cost"
                      value={formData.estimated_cost}
                      onChange={handleChange}
                      placeholder="e.g. PKR 500"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Helpful Links
                    </label>
                    <div className="space-y-3">
                      {links.map((link, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="url"
                            value={link}
                            onChange={(e) => handleLinkChange(index, e.target.value)}
                            placeholder="https://"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {links.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeLink(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addLink}
                        className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700"
                      >
                        <Plus className="h-5 w-5" />
                        Add Another Link
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pro Tips
                    </label>
                    <textarea
                      name="pro_tips"
                      value={formData.pro_tips}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Contributor Info */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Your Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="author_name"
                      value={formData.author_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      name="author_email"
                      value={formData.author_email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your City *
                    </label>
                    <select
                      name="author_city"
                      value={formData.author_city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select City</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Experience
                    </label>
                    <textarea
                      name="author_experience"
                      value={formData.author_experience}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting Guide...
                    </>
                  ) : (
                    'Submit Guide for Review'
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
