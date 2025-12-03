'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Phone, 
  Ambulance, 
  Shield, 
  Flame, 
  Siren, 
  HeartHandshake, 
  CreditCard, 
  Activity, 
  AlertTriangle, 
  Car, 
  Waves, 
  CheckSquare, 
  List, 
  ExternalLink,
  ChevronRight,
  Stethoscope,
  Building2
} from 'lucide-react'

interface EmergencyContact {
  name: string
  phone: string
  description: string
  icon: any
}

interface EmergencyGuide {
  id: string
  title: string
  category: string
  steps: string[]
  checklist: string[]
  icon: any
  color: string
  gradient: string
}

const emergencyContacts: EmergencyContact[] = [
  { name: 'Rescue 1122', phone: '1122', description: 'Emergency Rescue Services (Punjab)', icon: Ambulance },
  { name: 'Edhi Foundation', phone: '115', description: 'Nationwide Emergency & Ambulance', icon: Stethoscope },
  { name: 'Police Emergency', phone: '15', description: 'Police Emergency Helpline', icon: Shield },
  { name: 'Fire Brigade', phone: '16', description: 'Fire Emergency Services', icon: Flame },
  { name: 'Chippa Foundation', phone: '1021', description: 'Ambulance & Emergency Services', icon: Siren },
  { name: 'Madadgar Helpline', phone: '1098', description: 'Child Protection & Women Helpline', icon: HeartHandshake },
  { name: 'NADRA Helpline', phone: '111-786-100', description: 'CNIC & Identity Services', icon: CreditCard },
  { name: 'Chhipa Helpline', phone: '0800-42244', description: 'Toll Free Ambulance Service', icon: Phone },
]

const emergencyGuides: EmergencyGuide[] = [
  {
    id: 'medical',
    title: 'Medical Emergency',
    category: 'medical',
    icon: Activity,
    color: 'text-red-600',
    gradient: 'from-red-500 to-pink-600',
    steps: [
      'Stay calm and assess the situation',
      'Call Rescue 1122 or Edhi 115 immediately',
      'Provide your exact location and nature of emergency',
      'Check if the person is breathing and conscious',
      'If trained, provide CPR or first aid as needed',
      'Do not move the person unless absolutely necessary',
      'Keep the person warm and comfortable',
      'Stay with them until help arrives'
    ],
    checklist: [
      'Emergency contact numbers saved',
      'First aid kit available',
      'Know nearest hospital location',
      'Blood type information ready',
      'Medical history documents accessible'
    ]
  },
  {
    id: 'fire',
    title: 'Fire Emergency',
    category: 'fire',
    icon: Flame,
    color: 'text-orange-600',
    gradient: 'from-orange-500 to-red-600',
    steps: [
      'Alert everyone by shouting "FIRE!"',
      'Activate fire alarm if available',
      'Call Fire Brigade at 16',
      'Evacuate immediately - use stairs, not elevators',
      'Stay low if there is smoke (crawl if needed)',
      'Feel doors before opening - if hot, don\'t open',
      'Once outside, stay outside - don\'t go back in',
      'Meet at designated assembly point'
    ],
    checklist: [
      'Know two escape routes from every room',
      'Fire extinguisher accessible and working',
      'Smoke detectors installed and tested',
      'Family meeting point established',
      'Emergency bag ready near exit'
    ]
  },
  {
    id: 'accident',
    title: 'Road Accident',
    category: 'accident',
    icon: Car,
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-cyan-600',
    steps: [
      'Ensure your own safety first',
      'Call Rescue 1122 or Police 15',
      'Turn on hazard lights and set up warning signs',
      'Do not move injured persons unless in immediate danger',
      'Check for breathing and consciousness',
      'Control any bleeding with clean cloth',
      'Keep the victim calm and still',
      'Note vehicle numbers and witness details'
    ],
    checklist: [
      'First aid kit in vehicle',
      'Emergency numbers saved',
      'Reflective triangle in car',
      'Know basic first aid',
      'Vehicle documents accessible'
    ]
  },
  {
    id: 'natural-disaster',
    title: 'Natural Disaster',
    category: 'natural_disaster',
    icon: Waves,
    color: 'text-cyan-600',
    gradient: 'from-cyan-500 to-blue-600',
    steps: [
      'Stay calm and don\'t panic',
      'If earthquake: Drop, Cover, Hold On',
      'If flood: Move to higher ground immediately',
      'Listen to official announcements',
      'Avoid damaged buildings and downed power lines',
      'Help others if safe to do so',
      'Contact family to confirm safety',
      'Follow evacuation orders if given'
    ],
    checklist: [
      'Emergency water supply (3 days)',
      'Non-perishable food supply',
      'Flashlight and extra batteries',
      'First aid kit',
      'Important documents in waterproof bag',
      'Cash in small denominations',
      'Phone charger / power bank'
    ]
  }
]

export default function EmergencyPage() {
  const [guides, setGuides] = useState<EmergencyGuide[]>([])
  const [selectedGuide, setSelectedGuide] = useState<EmergencyGuide | null>(null)
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGuides = async () => {
      const { getEmergencyGuides } = await import('@/lib/supabase/helpers')
      const { data, error } = await getEmergencyGuides()
      
      if (data) {
        const transformedGuides = data.map((g: any) => ({
          id: g.id,
          title: g.title,
          category: g.category,
          steps: typeof g.steps === 'string' ? JSON.parse(g.steps) : g.steps,
          checklist: typeof g.checklist === 'string' ? JSON.parse(g.checklist) : g.checklist,
          icon: getIconForCategory(g.category),
          color: getColorForCategory(g.category),
          gradient: getGradientForCategory(g.category)
        }))
        setGuides(transformedGuides)
      }
      setLoading(false)
    }
    fetchGuides()
  }, [])

  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'medical': return Activity
      case 'fire': return Flame
      case 'accident': return Car
      case 'natural_disaster': return Waves
      default: return AlertTriangle
    }
  }

  const getColorForCategory = (category: string) => {
    switch (category) {
      case 'medical': return 'text-red-600'
      case 'fire': return 'text-orange-600'
      case 'accident': return 'text-blue-600'
      case 'natural_disaster': return 'text-cyan-600'
      default: return 'text-slate-600'
    }
  }

  const getGradientForCategory = (category: string) => {
    switch (category) {
      case 'medical': return 'from-red-500 to-pink-600'
      case 'fire': return 'from-orange-500 to-red-600'
      case 'accident': return 'from-blue-500 to-cyan-600'
      case 'natural_disaster': return 'from-cyan-500 to-blue-600'
      default: return 'from-slate-500 to-slate-600'
    }
  }

  const toggleCheckItem = (item: string) => {
    setCheckedItems(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-64 h-64 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-orange-500 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-red-500/30 animate-pulse">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-100">24/7 Emergency Support</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Emergency Help Center
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Quick access to emergency contacts, step-by-step guides, and essential checklists when you need them most.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-12 -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center flex items-center justify-center gap-3">
              <Phone className="w-6 h-6 text-red-500" />
              Emergency Contact Numbers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {emergencyContacts.map((contact, index) => (
                <a
                  key={index}
                  href={`tel:${contact.phone}`}
                  className="group bg-slate-50 rounded-xl p-5 border border-slate-200 hover:border-red-500 hover:bg-red-50 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <contact.icon className="w-6 h-6 text-slate-700 group-hover:text-red-500 transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                        {contact.name}
                      </h3>
                      <p className="text-2xl font-bold text-red-600 font-mono">{contact.phone}</p>
                      <p className="text-xs text-slate-500 mt-1">{contact.description}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Guides */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            Emergency Response Guides
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyGuides.map((guide) => (
              <button
                key={guide.id}
                onClick={() => setSelectedGuide(guide)}
                className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all text-left border-2 group relative overflow-hidden ${
                  selectedGuide?.id === guide.id ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-100'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${guide.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <guide.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{guide.title}</h3>
                <p className="text-sm text-slate-500 mb-4">
                  {guide.steps.length} steps • {guide.checklist.length} checklist items
                </p>
                <div className={`flex items-center font-semibold text-sm ${guide.color} group-hover:translate-x-1 transition-transform`}>
                  View Guide
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </button>
            ))}
          </div>

          {/* Selected Guide Details */}
          {selectedGuide && (
            <div className="mt-12 bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 border border-slate-100">
              <div className={`bg-gradient-to-r ${selectedGuide.gradient} p-8 md:p-10 text-white`}>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <selectedGuide.icon className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-2">{selectedGuide.title}</h3>
                    <p className="text-white/90 text-lg">Follow these steps carefully to ensure safety.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8 md:p-10">
                <div className="grid md:grid-cols-2 gap-12">
                  {/* Steps */}
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <List className="w-6 h-6 text-slate-400" />
                      Step-by-Step Guide
                    </h4>
                    <div className="space-y-4">
                      {selectedGuide.steps.map((step: any, index) => (
                        <div key={index} className="flex gap-4 items-start group">
                          <span className={`w-8 h-8 rounded-full bg-gradient-to-br ${selectedGuide.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                            {index + 1}
                          </span>
                          <div className="pt-1">
                            {typeof step === 'string' ? (
                              <p className="text-slate-600 leading-relaxed">{step}</p>
                            ) : (
                              <>
                                <h5 className="font-bold text-slate-900 mb-1">{step.title}</h5>
                                <p className="text-slate-600 leading-relaxed">{step.description}</p>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <CheckSquare className="w-6 h-6 text-emerald-500" />
                      Preparedness Checklist
                    </h4>
                    <div className="space-y-3">
                      {selectedGuide.checklist.map((item, index) => (
                        <label
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 cursor-pointer transition-all shadow-sm"
                        >
                          <input
                            type="checkbox"
                            checked={checkedItems.includes(item)}
                            onChange={() => toggleCheckItem(item)}
                            className="w-5 h-5 accent-emerald-500 rounded border-slate-300 focus:ring-emerald-500"
                          />
                          <span className={`${checkedItems.includes(item) ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                            {item}
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-emerald-100/50 rounded-xl border border-emerald-100">
                      <p className="text-sm text-emerald-800 font-medium flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        {checkedItems.filter(item => selectedGuide.checklist.includes(item)).length} of {selectedGuide.checklist.length} items ready
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* NGO Contacts */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            NGO & Support Organizations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Edhi Foundation', desc: 'Ambulance, burial, shelter services', phone: '115', website: 'edhi.org' },
              { name: 'Saylani Welfare', desc: 'Food, education, healthcare', phone: '0800-72952', website: 'saylaniwelfare.com' },
              { name: 'Akhuwat Foundation', desc: 'Interest-free loans', phone: '042-35761999', website: 'akhuwat.org.pk' },
              { name: 'Shaukat Khanum', desc: 'Cancer treatment & support', phone: '042-35905000', website: 'shaukatkhanum.org.pk' },
              { name: 'Pakistan Red Crescent', desc: 'Disaster relief, first aid', phone: '051-9250404', website: 'prcs.org.pk' },
              { name: 'Baitussalam Welfare', desc: 'Healthcare, education', phone: '0800-00786', website: 'baitussalamwelfare.org' },
            ].map((org, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-200 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{org.name}</h3>
                <p className="text-slate-500 text-sm mb-6">{org.desc}</p>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <a
                    href={`tel:${org.phone}`}
                    className="flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    {org.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-8 md:p-16 text-center text-white shadow-2xl shadow-red-900/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Immediate Assistance?</h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Our community is here to help. Post a request and connect with volunteers and donors nearby.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/blood-bank"
                  className="px-8 py-4 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all shadow-lg flex items-center gap-2"
                >
                  <HeartHandshake className="w-5 h-5" />
                  Find Blood Donor
                </Link>
                <Link
                  href="/volunteers"
                  className="px-8 py-4 bg-red-700 text-white font-bold rounded-xl hover:bg-red-800 transition-all shadow-lg border border-red-500 flex items-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Contact Volunteers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
