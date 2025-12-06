'use client'

import Link from 'next/link'
import { Shield, Lock, Eye, Database, UserCheck, Bell, FileText, ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: [
        'Account Information: Name, email address, phone number, and password when you register.',
        'Profile Information: Blood type, city, and other optional details you provide.',
        'Usage Data: How you interact with our platform, pages visited, and features used.',
        'Device Information: Browser type, IP address, and device identifiers for security purposes.'
      ]
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        'To provide and maintain our services including blood donor matching and donation facilitation.',
        'To personalize your experience and show relevant content.',
        'To communicate with you about updates, security alerts, and support.',
        'To improve our platform and develop new features.',
        'To ensure the safety and security of our users.'
      ]
    },
    {
      icon: UserCheck,
      title: 'Information Sharing',
      content: [
        'Blood Donors: Your blood type and city are visible to users searching for donors. Contact information is shared only upon your consent.',
        'Donations: Campaign creators can see donor names (unless you choose to donate anonymously).',
        'Volunteers: Your skills and availability are visible to organizations seeking volunteers.',
        'We never sell your personal information to third parties.',
        'We may share data with law enforcement when required by law.'
      ]
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: [
        'We use industry-standard encryption (SSL/TLS) for data transmission.',
        'Passwords are hashed and never stored in plain text.',
        'Regular security audits and vulnerability assessments are conducted.',
        'Access to user data is restricted to authorized personnel only.',
        'We use Supabase for secure database management with row-level security.'
      ]
    },
    {
      icon: Bell,
      title: 'Your Rights',
      content: [
        'Access: You can request a copy of your personal data at any time.',
        'Correction: You can update your information through your profile settings.',
        'Deletion: You can request deletion of your account and associated data.',
        'Opt-out: You can unsubscribe from marketing communications.',
        'Data Portability: You can request your data in a portable format.'
      ]
    },
    {
      icon: FileText,
      title: 'Cookies & Tracking',
      content: [
        'Essential Cookies: Required for the platform to function properly.',
        'Analytics Cookies: Help us understand how users interact with our platform.',
        'You can manage cookie preferences through your browser settings.',
        'We do not use cookies for advertising purposes.'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl opacity-20 animate-pulse delay-700"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-semibold mb-8 backdrop-blur-md border border-white/20">
              <Shield className="w-4 h-4 text-white" />
              <span className="text-emerald-100">Your Privacy Matters</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xl text-emerald-100 mb-4 leading-relaxed">
              How we collect, use, and protect your information
            </p>
            <p className="text-sm text-emerald-200">
              Last updated: January 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Introduction */}
            <div className="p-8 bg-emerald-50 border-b border-emerald-100">
              <p className="text-slate-700 leading-relaxed">
                At CitizenConnect, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our platform. As a semester project 
                for COMSATS University's Civics and Community Engagement course, we are committed to maintaining 
                the trust and confidence of our users.
              </p>
            </div>

            {/* Sections */}
            <div className="divide-y divide-slate-100">
              {sections.map((section, index) => (
                <div key={index} className="p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                      <section.icon className="w-5 h-5" />
                    </div>
                    {section.title}
                  </h2>
                  <ul className="space-y-3">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2.5 shrink-0"></span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="p-8 bg-slate-50 border-t border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Us</h2>
              <p className="text-slate-600 mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="text-emerald-600 font-semibold">citizenconnect.team@gmail.com</p>
            </div>
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
