'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Guide {
  id: string
  title: string
  description: string
  category: string
  content: string
  steps: GuideStep[]
  documents_required: string[]
  estimated_time: string
  fees: string
  helpful_links: { title: string; url: string }[]
  created_at: string
  author: string
  views: number
}

interface GuideStep {
  id: string
  step_number: number
  title: string
  description: string
  tips: string[]
}

interface Comment {
  id: string
  user_name: string
  content: string
  created_at: string
  helpful_count: number
}

// Sample guide data
const sampleGuide: Guide = {
  id: '1',
  title: 'How to Get CNIC (National ID Card) in Pakistan',
  description: 'Complete step-by-step guide for obtaining your Computerized National Identity Card (CNIC) from NADRA.',
  category: 'documents',
  content: 'The Computerized National Identity Card (CNIC) is the basic identity document for all Pakistani citizens aged 18 and above. This guide will walk you through the entire process of obtaining your CNIC.',
  steps: [
    {
      id: '1',
      step_number: 1,
      title: 'Gather Required Documents',
      description: 'Before visiting the NADRA office, make sure you have all the required documents ready.',
      tips: ['Keep original and photocopies', 'Documents should be clear and legible', 'Old ID card (if renewing)']
    },
    {
      id: '2',
      step_number: 2,
      title: 'Visit NADRA Registration Center',
      description: 'Go to your nearest NADRA Registration Center (NRC) or NADRA Mega Center.',
      tips: ['Visit during off-peak hours (early morning)', 'Check working hours beforehand', 'Some centers accept appointments']
    },
    {
      id: '3',
      step_number: 3,
      title: 'Get Token and Fill Application Form',
      description: 'Get a token number and fill out the CNIC application form. Staff will assist if needed.',
      tips: ['Fill form in capital letters', 'Double-check all information', 'Ask staff for help if unsure']
    },
    {
      id: '4',
      step_number: 4,
      title: 'Biometric Verification',
      description: 'Your fingerprints and photograph will be taken at the biometric counter.',
      tips: ['Clean hands for fingerprint scan', 'Remove glasses for photo', 'Look directly at camera']
    },
    {
      id: '5',
      step_number: 5,
      title: 'Pay Fee and Get Receipt',
      description: 'Pay the required fee and keep the receipt safe. Your CNIC will be ready in 15-30 days.',
      tips: ['Keep receipt safe - needed for collection', 'Note down tracking ID', 'Track status online at www.nadra.gov.pk']
    },
    {
      id: '6',
      step_number: 6,
      title: 'Collect Your CNIC',
      description: 'Visit the same center to collect your CNIC or opt for home delivery (additional charges apply).',
      tips: ['Bring original receipt', 'Verify all details on card', 'Report errors immediately']
    }
  ],
  documents_required: [
    'Original B-Form (for first-time applicants)',
    'Parent\'s CNIC copies (Father & Mother)',
    'Passport size photographs (2)',
    'Old CNIC (if renewal or modification)',
    'Proof of address (utility bill)',
    'Marriage certificate (if applicable)'
  ],
  estimated_time: '15-30 working days',
  fees: 'PKR 400 (Normal) / PKR 1,500 (Urgent)',
  helpful_links: [
    { title: 'NADRA Official Website', url: 'https://www.nadra.gov.pk' },
    { title: 'Track CNIC Status', url: 'https://id.nadra.gov.pk/identity-tracking/' },
    { title: 'Find Nearest Center', url: 'https://www.nadra.gov.pk/locations/' },
  ],
  created_at: '2024-01-15',
  author: 'CitizenConnect Team',
  views: 12543
}

const sampleComments: Comment[] = [
  { id: '1', user_name: 'Ahmed Ali', content: 'Very helpful guide! I got my CNIC in just 2 weeks following these steps.', created_at: '2024-03-15', helpful_count: 24 },
  { id: '2', user_name: 'Sara Khan', content: 'Pro tip: Visit early morning to avoid long queues. I was done in 30 minutes!', created_at: '2024-03-10', helpful_count: 18 },
  { id: '3', user_name: 'Hassan Raza', content: 'The online tracking feature is really useful. Thanks for including that tip.', created_at: '2024-03-05', helpful_count: 12 },
]

export default function GuideDetailPage() {
  const params = useParams()
  const [guide, setGuide] = useState<Guide | null>(sampleGuide)
  const [comments, setComments] = useState<Comment[]>(sampleComments)
  const [newComment, setNewComment] = useState('')
  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // In production, fetch from Supabase
    // const fetchGuide = async () => {
    //   const { data } = await supabase
    //     .from('guides')
    //     .select('*, guide_steps(*)')
    //     .eq('id', params.id)
    //     .single()
    //   if (data) setGuide(data)
    // }
    // fetchGuide()
  }, [params.id])

  const toggleStepComplete = (stepNumber: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepNumber)
        ? prev.filter(s => s !== stepNumber)
        : [...prev, stepNumber]
    )
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    
    // In production, save to Supabase
    const newCommentObj: Comment = {
      id: Date.now().toString(),
      user_name: 'You',
      content: newComment,
      created_at: new Date().toISOString().split('T')[0],
      helpful_count: 0
    }
    setComments(prev => [newCommentObj, ...prev])
    setNewComment('')
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#009950] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#666666]">Loading guide...</p>
        </div>
      </div>
    )
  }

  const progress = (completedSteps.length / guide.steps.length) * 100

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-[#666666] hover:text-[#009950]">Home</Link>
            <span className="text-[#666666]">/</span>
            <Link href="/guides" className="text-[#666666] hover:text-[#009950]">Guides</Link>
            <span className="text-[#666666]">/</span>
            <span className="text-[#009950] capitalize">{guide.category}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#009950] to-[#27AE60] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-white text-sm font-semibold mb-4 capitalize">
              {guide.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{guide.title}</h1>
            <p className="text-xl text-white/90 mb-6">{guide.description}</p>
            
            <div className="flex flex-wrap gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {guide.estimated_time}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {guide.fees}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {guide.views.toLocaleString()} views
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#333333]">Your Progress</span>
            <span className="text-sm text-[#666666]">{completedSteps.length} of {guide.steps.length} steps completed</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#009950] to-[#27AE60] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Introduction */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">Overview</h2>
              <p className="text-[#666666] leading-relaxed">{guide.content}</p>
            </div>

            {/* Step-by-Step Guide */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-6">Step-by-Step Guide</h2>
              
              <div className="space-y-4">
                {guide.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`border-2 rounded-xl overflow-hidden transition-all ${
                      completedSteps.includes(step.step_number)
                        ? 'border-green-500 bg-green-50'
                        : activeStep === index
                        ? 'border-[#009950]'
                        : 'border-gray-200'
                    }`}
                  >
                    <button
                      onClick={() => setActiveStep(activeStep === index ? -1 : index)}
                      className="w-full p-4 flex items-center gap-4 text-left"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                        completedSteps.includes(step.step_number)
                          ? 'bg-green-500 text-white'
                          : 'bg-[#009950] text-white'
                      }`}>
                        {completedSteps.includes(step.step_number) ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          step.step_number
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#333333]">{step.title}</h3>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${activeStep === index ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {activeStep === index && (
                      <div className="px-4 pb-4 border-t border-gray-200">
                        <p className="text-[#666666] my-4">{step.description}</p>
                        
                        {step.tips.length > 0 && (
                          <div className="bg-blue-50 rounded-lg p-4 mb-4">
                            <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Pro Tips
                            </h4>
                            <ul className="space-y-1">
                              {step.tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="text-blue-700 text-sm flex items-start gap-2">
                                  <span>•</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <button
                          onClick={() => toggleStepComplete(step.step_number)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            completedSteps.includes(step.step_number)
                              ? 'bg-gray-200 text-[#666666]'
                              : 'bg-[#009950] text-white hover:bg-[#00783F]'
                          }`}
                        >
                          {completedSteps.includes(step.step_number) ? 'Mark as Incomplete' : 'Mark as Complete'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#333333] mb-6">
                Community Tips ({comments.length})
              </h2>
              
              {/* Add Comment */}
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience or tips..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#009950] focus:ring-2 focus:ring-[#009950]/20 outline-none resize-none"
                ></textarea>
                <button
                  type="submit"
                  className="mt-2 px-6 py-2 bg-[#009950] text-white font-semibold rounded-lg hover:bg-[#00783F] transition-colors"
                >
                  Post Comment
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#009950] rounded-full flex items-center justify-center text-white font-bold">
                          {comment.user_name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-[#333333]">{comment.user_name}</p>
                          <p className="text-xs text-[#666666]">{comment.created_at}</p>
                        </div>
                      </div>
                      <button className="flex items-center gap-1 text-sm text-[#666666] hover:text-[#009950]">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        {comment.helpful_count}
                      </button>
                    </div>
                    <p className="text-[#666666]">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Documents Required */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-[#333333] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#009950]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Documents Required
              </h3>
              <ul className="space-y-2">
                {guide.documents_required.map((doc, index) => (
                  <li key={index} className="flex items-start gap-2 text-[#666666]">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Info */}
            <div className="bg-gradient-to-br from-[#009950] to-[#27AE60] rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Quick Info</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-white/70 text-sm">Processing Time</p>
                  <p className="font-semibold">{guide.estimated_time}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Fee</p>
                  <p className="font-semibold">{guide.fees}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Last Updated</p>
                  <p className="font-semibold">{guide.created_at}</p>
                </div>
              </div>
            </div>

            {/* Helpful Links */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-[#333333] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#009950]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Helpful Links
              </h3>
              <ul className="space-y-2">
                {guide.helpful_links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#009950] hover:underline"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Share */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-[#333333] mb-4">Share This Guide</h3>
              <div className="flex gap-3">
                {['facebook', 'twitter', 'whatsapp', 'copy'].map((platform) => (
                  <button
                    key={platform}
                    className="flex-1 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                    onClick={() => {
                      if (platform === 'copy') {
                        navigator.clipboard.writeText(window.location.href)
                        alert('Link copied!')
                      }
                    }}
                  >
                    {platform === 'facebook' && '📘'}
                    {platform === 'twitter' && '🐦'}
                    {platform === 'whatsapp' && '💬'}
                    {platform === 'copy' && '📋'}
                  </button>
                ))}
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-orange-600 mb-2">Need Help?</h3>
              <p className="text-[#666666] mb-4 text-sm">
                Can't find what you're looking for? Our community is here to help!
              </p>
              <Link
                href="/emergency"
                className="block text-center py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
              >
                Get Emergency Help
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
