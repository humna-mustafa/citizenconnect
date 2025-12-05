'use client'

import Link from 'next/link'
import { FileText, CheckCircle2, AlertCircle, Users, Shield, Scale, ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-sm font-semibold mb-8 border border-emerald-200">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">Legal Agreement</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-gray-900">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 mb-4 leading-relaxed">
              Please read these terms carefully before using CitizenConnect
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
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Important Notice */}
            <div className="p-6 bg-amber-50 border-b border-amber-100">
              <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <h3 className="font-bold text-amber-900 mb-1">Academic Project Notice</h3>
                  <p className="text-amber-800 text-sm">
                    CitizenConnect is a semester project developed by students at COMSATS University Islamabad 
                    for educational purposes. While we strive for accuracy, this is not an official government platform.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Section 1 */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 text-sm font-bold">1</span>
                  Acceptance of Terms
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  By accessing and using CitizenConnect, you accept and agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our platform.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  We may update these terms from time to time. Continued use of the platform after any changes 
                  constitutes acceptance of the new terms.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 text-sm font-bold">2</span>
                  User Accounts
                </h2>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>You must provide accurate and complete information when creating an account.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>You are responsible for maintaining the confidentiality of your account credentials.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>You must be at least 13 years old to create an account.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>One person may not maintain more than one account.</span>
                  </li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 text-sm font-bold">3</span>
                  Acceptable Use
                </h2>
                <p className="text-slate-600 mb-4">You agree NOT to:</p>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>Post false, misleading, or fraudulent information.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>Create fake blood donation requests or donation campaigns.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>Harass, abuse, or harm other users.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>Use the platform for any illegal activities.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>Attempt to gain unauthorized access to other accounts or systems.</span>
                  </li>
                </ul>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 text-sm font-bold">4</span>
                  Blood Donation & Donations
                </h2>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Blood donor information is provided as-is. We do not guarantee donor availability.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Users should verify donor eligibility through proper medical channels.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Donation campaigns are verified to the best of our ability but donors should exercise discretion.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>CitizenConnect is not responsible for the misuse of donated funds.</span>
                  </li>
                </ul>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 text-sm font-bold">5</span>
                  Content Guidelines
                </h2>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>User-submitted guides and content should be accurate and helpful.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>We reserve the right to remove content that violates our guidelines.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>By submitting content, you grant us a license to display it on the platform.</span>
                  </li>
                </ul>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 text-sm font-bold">6</span>
                  Limitation of Liability
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  CitizenConnect is provided "as is" without warranties of any kind. We are not liable for:
                </p>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-3">
                    <Scale className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Any damages arising from use or inability to use the platform.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Scale className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Accuracy of information provided by users or third parties.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Scale className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Actions of other users on the platform.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Scale className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Service interruptions or data loss.</span>
                  </li>
                </ul>
              </div>

              {/* Section 7 */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 text-sm font-bold">7</span>
                  Termination
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  We reserve the right to suspend or terminate accounts that violate these terms. 
                  You may also delete your account at any time through your account settings.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="p-8 bg-slate-50 border-t border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Questions?</h2>
              <p className="text-slate-600 mb-4">
                If you have questions about these Terms of Service, please contact us at:
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
