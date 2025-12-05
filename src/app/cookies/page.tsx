'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Cookie, Settings, Shield, BarChart3, ArrowLeft, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function CookiesPage() {
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    functional: true
  })

  const handleSavePreferences = () => {
    // In a real app, this would save to localStorage or a cookie
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences))
    toast.success('Cookie preferences saved!')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-sm font-semibold mb-8 border border-amber-200">
              <Cookie className="w-4 h-4 text-amber-600" />
              <span className="text-amber-700">Cookie Settings</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-gray-900">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-600 mb-4 leading-relaxed">
              Learn how we use cookies and manage your preferences
            </p>
            <p className="text-sm text-gray-500">
              Last updated: January 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* What are Cookies */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                  <Cookie className="w-5 h-5" />
                </div>
                What are Cookies?
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Cookies are small text files that are placed on your device when you visit a website. 
                They help websites remember your preferences and understand how you use the site.
              </p>
              <p className="text-slate-600 leading-relaxed">
                CitizenConnect uses cookies to ensure the platform works properly, remember your preferences, 
                and understand how visitors interact with our platform.
              </p>
            </div>
          </div>

          {/* Types of Cookies */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                {/* Essential */}
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">Essential Cookies</h3>
                        <p className="text-sm text-slate-500">Always active</p>
                      </div>
                    </div>
                    <div className="w-12 h-7 bg-emerald-600 rounded-full flex items-center justify-end px-1">
                      <div className="w-5 h-5 bg-white rounded-full shadow"></div>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    These cookies are necessary for the website to function properly. They enable core features 
                    like user authentication, security, and session management. You cannot opt out of these cookies.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['Session ID', 'Authentication', 'Security tokens', 'CSRF protection'].map(cookie => (
                      <span key={cookie} className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-600">
                        {cookie}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Analytics */}
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">Analytics Cookies</h3>
                        <p className="text-sm text-slate-500">Optional</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                      aria-label="Toggle analytics cookies"
                      className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors ${
                        preferences.analytics ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 bg-white rounded-full shadow"></div>
                    </button>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Help us understand how visitors interact with our platform. This data helps us improve 
                    the user experience and identify areas that need improvement.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['Page views', 'User behavior', 'Performance metrics'].map(cookie => (
                      <span key={cookie} className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-600">
                        {cookie}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Functional */}
                <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white">
                        <Settings className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">Functional Cookies</h3>
                        <p className="text-sm text-slate-500">Optional</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, functional: !prev.functional }))}
                      aria-label="Toggle functional cookies"
                      className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors ${
                        preferences.functional ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 bg-white rounded-full shadow"></div>
                    </button>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Remember your preferences such as language settings, theme preferences, and recently 
                    viewed content to provide a more personalized experience.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['Theme preference', 'Language', 'Recently viewed'].map(cookie => (
                      <span key={cookie} className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-600">
                        {cookie}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleSavePreferences}
                  className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Save Preferences
                </button>
              </div>
            </div>
          </div>

          {/* Managing Cookies */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Managing Cookies in Your Browser</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Delete all cookies from your browser</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Block all cookies or only third-party cookies</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Set preferences for specific websites</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Get notifications when cookies are set</span>
                </li>
              </ul>
              <p className="text-slate-500 text-sm mt-4">
                Note: Blocking all cookies may affect your experience on CitizenConnect and other websites.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-slate-100 rounded-3xl p-8 text-center">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Questions?</h2>
            <p className="text-slate-600 mb-4">
              If you have questions about our cookie policy, please contact us at:
            </p>
            <p className="text-emerald-600 font-semibold">citizenconnect.team@gmail.com</p>
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
