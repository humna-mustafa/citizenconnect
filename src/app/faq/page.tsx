'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Search, HelpCircle, MessageCircle, Mail } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  name: string
  icon: string
  faqs: FAQItem[]
}

const faqData: FAQCategory[] = [
  {
    name: 'General',
    icon: '🌐',
    faqs: [
      {
        question: 'What is CitizenConnect?',
        answer: 'CitizenConnect is a civic engagement platform designed to help Pakistani citizens access government services, find emergency help, connect with blood donors, and participate in community initiatives. It was created as a semester project for Civics and Community Engagement course at COMSATS University.'
      },
      {
        question: 'Is CitizenConnect free to use?',
        answer: 'Yes, CitizenConnect is completely free to use. All features including guides, blood donor search, volunteer network, and donation platform are available at no cost.'
      },
      {
        question: 'Who developed CitizenConnect?',
        answer: 'CitizenConnect was developed by a team of BS Software Engineering students at COMSATS University Islamabad, led by Humna Mustafa (FA25-BSE-051), under the supervision of Prof. Ayesha Aqeel.'
      },
      {
        question: 'How can I create an account?',
        answer: 'Click on "Sign Up" in the top navigation, fill in your details including name, email, and password. You\'ll receive a verification email to activate your account.'
      }
    ]
  },
  {
    name: 'Blood Bank',
    icon: '🩸',
    faqs: [
      {
        question: 'How do I register as a blood donor?',
        answer: 'Go to the Blood Bank section, click "Register as Donor", fill in your blood type, location, and contact details. Once registered, you\'ll appear in searches when someone needs your blood type in your area.'
      },
      {
        question: 'How can I find a blood donor?',
        answer: 'Navigate to Blood Bank, use the search filters to select blood type and city. The system will show available donors matching your criteria. You can then contact them directly.'
      },
      {
        question: 'Is my contact information safe?',
        answer: 'Yes, your contact information is only shared with verified users who are searching for blood donors. You can also choose to hide your phone number and communicate through the platform.'
      },
      {
        question: 'Can I post an emergency blood request?',
        answer: 'Yes, click "Post Blood Request" in the Blood Bank section. Fill in patient details, required blood type, hospital, and urgency level. The request will be visible to matching donors in your area.'
      }
    ]
  },
  {
    name: 'Donations',
    icon: '💝',
    faqs: [
      {
        question: 'How are donation campaigns verified?',
        answer: 'All donation campaigns go through a verification process. We require documentation, identity verification, and in some cases, hospital or institution letters before approving campaigns.'
      },
      {
        question: 'How do I donate to a cause?',
        answer: 'Browse active campaigns, select one that resonates with you, click "Donate Now", enter your amount, and complete the payment through our secure payment gateway.'
      },
      {
        question: 'Can I track where my donation goes?',
        answer: 'Yes, each campaign provides regular updates on fund utilization. You can also see progress towards the funding goal and how funds are being used.'
      },
      {
        question: 'How can I start a donation campaign?',
        answer: 'You need to create an account, go to Donations section, click "Start Campaign", fill in the required details, upload supporting documents, and submit for verification.'
      }
    ]
  },
  {
    name: 'Guides',
    icon: '📚',
    faqs: [
      {
        question: 'What kind of guides are available?',
        answer: 'We have step-by-step guides for various civic procedures including CNIC/NADRA services, passport applications, vehicle registration, utility complaints, tax filing, and more.'
      },
      {
        question: 'Can I contribute a guide?',
        answer: 'Yes! If you have experience with a government process, you can submit a guide. Click "Submit Guide" in the Guides section and follow the format guidelines.'
      },
      {
        question: 'Are the guides regularly updated?',
        answer: 'Yes, guides are reviewed and updated when procedures change. Users can also suggest updates through the feedback feature on each guide.'
      }
    ]
  },
  {
    name: 'Volunteers',
    icon: '🤝',
    faqs: [
      {
        question: 'How do I become a volunteer?',
        answer: 'Visit the Volunteers section, click "Join as Volunteer", complete your profile with skills and availability, and you\'ll be matched with relevant opportunities.'
      },
      {
        question: 'What volunteer opportunities are available?',
        answer: 'Opportunities include blood donation drives, community clean-ups, educational tutoring, emergency response, and various civic engagement activities.'
      },
      {
        question: 'Can organizations post volunteer needs?',
        answer: 'Yes, verified organizations and NGOs can post volunteer opportunities. Contact us for organization verification.'
      }
    ]
  },
  {
    name: 'Emergency',
    icon: '🚨',
    faqs: [
      {
        question: 'What emergency services are listed?',
        answer: 'We list Rescue 1122, Edhi Foundation (115), Police (15), Fire Brigade (16), and many more emergency services with their contact numbers.'
      },
      {
        question: 'Are the emergency numbers accurate?',
        answer: 'Yes, we regularly verify and update emergency contact numbers. However, we recommend saving critical numbers in your phone for offline access.'
      }
    ]
  }
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const filteredFAQs = faqData
    .filter(cat => !selectedCategory || cat.name === selectedCategory)
    .map(cat => ({
      ...cat,
      faqs: cat.faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(cat => cat.faqs.length > 0)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-emerald-900 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-semibold mb-8 backdrop-blur-md border border-white/20">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-100">Help Center</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-emerald-100 mb-10 leading-relaxed">
              Find answers to common questions about CitizenConnect
            </p>
            
            {/* Search */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 shadow-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 -mt-6 relative z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                !selectedCategory 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Categories
            </button>
            {faqData.map(cat => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  selectedCategory === cat.name
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
              <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
              <p className="text-slate-500">Try adjusting your search or browse all categories</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredFAQs.map((category) => (
                <div key={category.name} className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      {category.name}
                    </h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {category.faqs.map((faq, index) => {
                      const id = `${category.name}-${index}`
                      const isOpen = openItems.includes(id)
                      return (
                        <div key={index} className="group">
                          <button
                            onClick={() => toggleItem(id)}
                            className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                          >
                            <span className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                              {faq.question}
                            </span>
                            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-5 text-slate-600 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="relative z-10 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-6 opacity-80" />
              <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
              <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
                Can't find what you're looking for? Our team is here to help.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
