'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import { Camera, MapPin, Upload, AlertTriangle, CheckCircle2 } from 'lucide-react'

const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Loading Map...</div>
})

export default function ReportIssuePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: null as [number, number] | null,
    image: null as File | null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, location: [lat, lng] }))
    toast.success('Location selected!')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.location) {
      toast.error('Please select a location on the map')
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success('Issue reported successfully!', {
      description: 'Your report has been submitted to the relevant authorities. Ticket #12345 created.',
      duration: 5000
    })
    
    setIsSubmitting(false)
    setFormData({
      title: '',
      description: '',
      category: '',
      location: null,
      image: null
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Report an Issue</h1>
            <p className="text-slate-600 text-lg">
              Help improve your community by reporting local issues like potholes, garbage, or street light failures.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Issue Details */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Issue Details
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Issue Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g., Deep Pothole on Main St"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="issue-category" className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                    <select
                      id="issue-category"
                      required
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none bg-white transition-all"
                    >
                      <option value="">Select Category</option>
                      <option value="roads">Roads & Potholes</option>
                      <option value="sanitation">Garbage & Sanitation</option>
                      <option value="electricity">Street Lights / Electricity</option>
                      <option value="water">Water Supply / Sewerage</option>
                      <option value="traffic">Traffic Signals</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the issue in detail..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none resize-none transition-all"
                  ></textarea>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  Location
                </h2>
                <p className="text-sm text-slate-500">Click on the map to pinpoint the exact location of the issue.</p>
                
                <div className="h-[400px] rounded-2xl overflow-hidden border-2 border-slate-100">
                  <Map 
                    center={[30.3753, 69.3451]} 
                    zoom={5}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>
                {formData.location && (
                  <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Location selected: {formData.location[0].toFixed(4)}, {formData.location[1].toFixed(4)}
                  </div>
                )}
              </div>

              {/* Evidence */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Camera className="w-5 h-5 text-emerald-600" />
                  Photo Evidence
                </h2>
                
                <label className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer block">
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">Click to upload or drag and drop</p>
                  <p className="text-slate-400 text-sm mt-2">SVG, PNG, JPG or GIF (max. 5MB)</p>
                  <input type="file" className="hidden" aria-label="Upload image" />
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
