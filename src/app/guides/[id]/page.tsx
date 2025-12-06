'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  Clock, 
  Coins, 
  Eye, 
  CheckCircle2, 
  ArrowRight, 
  Share2, 
  MessageSquare, 
  ThumbsUp, 
  AlertCircle, 
  FileText, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Home
} from 'lucide-react'

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading guide...</p>
        </div>
      </div>
    )
  }

  const progress = (completedSteps.length / guide.steps.length) * 100

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Link href="/" className="text-slate-500 hover:text-emerald-600 flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/guides" className="text-slate-500 hover:text-emerald-600">Guides</Link>
            <span className="text-slate-300">/</span>
            <span className="text-emerald-600 capitalize truncate max-w-[200px]">{guide.category}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl opacity-20 animate-pulse delay-700"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-emerald-100 text-sm font-bold mb-6 capitalize shadow-lg">
              {guide.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">{guide.title}</h1>
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed max-w-3xl">{guide.description}</p>
            
            <div className="flex flex-wrap gap-6 text-white/90 text-sm font-medium">
              <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                <Clock className="w-4 h-4 text-white" />
                {guide.estimated_time}
              </span>
              <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                <Coins className="w-4 h-4 text-white" />
                {guide.fees}
              </span>
              <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                <Eye className="w-4 h-4 text-white" />
                {guide.views.toLocaleString()} views
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <div className="bg-white shadow-sm border-b border-slate-100 sticky top-[53px] z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-700">Your Progress</span>
            <span className="text-sm text-slate-500 font-medium">{completedSteps.length} of {guide.steps.length} steps completed</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Introduction */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-emerald-600" />
                Overview
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">{guide.content}</p>
            </div>

            {/* Step-by-Step Guide */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                Step-by-Step Guide
              </h2>
              
              <div className="space-y-4">
                {guide.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                      completedSteps.includes(step.step_number)
                        ? 'border-emerald-500 bg-emerald-50/30'
                        : activeStep === index
                        ? 'border-emerald-500 shadow-md'
                        : 'border-slate-100 hover:border-emerald-200'
                    }`}
                  >
                    <button
                      onClick={() => setActiveStep(activeStep === index ? -1 : index)}
                      className="w-full p-5 flex items-center gap-4 text-left"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all shadow-sm ${
                        completedSteps.includes(step.step_number)
                          ? 'bg-emerald-500 text-white'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {completedSteps.includes(step.step_number) ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          step.step_number
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg ${completedSteps.includes(step.step_number) ? 'text-emerald-900' : 'text-slate-900'}`}>
                          {step.title}
                        </h3>
                      </div>
                      {activeStep === index ? (
                        <ChevronUp className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    {activeStep === index && (
                      <div className="px-5 pb-6 pt-2 border-t border-slate-100/50">
                        <p className="text-slate-600 mb-6 leading-relaxed">{step.description}</p>
                        
                        {step.tips.length > 0 && (
                          <div className="bg-blue-50 rounded-xl p-5 mb-6 border border-blue-100">
                            <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                              <AlertCircle className="w-5 h-5" />
                              Pro Tips
                            </h4>
                            <ul className="space-y-2">
                              {step.tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="text-blue-700 text-sm flex items-start gap-2 font-medium">
                                  <span className="mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <button
                          onClick={() => toggleStepComplete(step.step_number)}
                          className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                            completedSteps.includes(step.step_number)
                              ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20'
                          }`}
                        >
                          {completedSteps.includes(step.step_number) ? (
                            <>Mark as Incomplete</>
                          ) : (
                            <>
                              <CheckCircle2 className="w-5 h-5" />
                              Mark as Complete
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-emerald-600" />
                Community Tips ({comments.length})
              </h2>
              
              {/* Add Comment */}
              <form onSubmit={handleCommentSubmit} className="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience or tips..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none transition-all mb-4"
                ></textarea>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                >
                  Post Comment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-6 bg-white border border-slate-100 rounded-2xl hover:shadow-sm transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                          {comment.user_name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{comment.user_name}</p>
                          <p className="text-xs text-slate-500 font-medium">{comment.created_at}</p>
                        </div>
                      </div>
                      <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 font-medium transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        {comment.helpful_count} Helpful
                      </button>
                    </div>
                    <p className="text-slate-600 leading-relaxed pl-[52px]">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Documents Required */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Documents Required
              </h3>
              <ul className="space-y-3">
                {guide.documents_required.map((doc, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    </div>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Info */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-900/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <h3 className="text-lg font-bold mb-4 relative z-10">Quick Info</h3>
              <div className="space-y-4 relative z-10">
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <p className="text-emerald-100 text-xs font-medium mb-1">Processing Time</p>
                  <p className="font-bold">{guide.estimated_time}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <p className="text-emerald-100 text-xs font-medium mb-1">Fee</p>
                  <p className="font-bold">{guide.fees}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <p className="text-emerald-100 text-xs font-medium mb-1">Last Updated</p>
                  <p className="font-bold">{guide.created_at}</p>
                </div>
              </div>
            </div>

            {/* Helpful Links */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-emerald-600" />
                Helpful Links
              </h3>
              <ul className="space-y-3">
                {guide.helpful_links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 hover:underline font-medium text-sm group"
                    >
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Share */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-600" />
                Share This Guide
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {['facebook', 'twitter', 'whatsapp', 'copy'].map((platform) => (
                  <button
                    key={platform}
                    className="aspect-square rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 transition-all flex items-center justify-center border border-slate-100 hover:border-emerald-200"
                    onClick={() => {
                      if (platform === 'copy') {
                        navigator.clipboard.writeText(window.location.href)
                        alert('Link copied!')
                      }
                    }}
                    title={`Share on ${platform}`}
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
            <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-orange-700 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Need Help?
              </h3>
              <p className="text-orange-600/80 mb-4 text-sm font-medium">
                Can't find what you're looking for? Our community is here to help!
              </p>
              <Link
                href="/emergency"
                className="block text-center py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
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
