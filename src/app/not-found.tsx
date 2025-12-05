'use client'

import Link from 'next/link'
import { Home, Search, ArrowLeft, HelpCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold text-emerald-100 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-200">
              <Search className="w-16 h-16 md:w-20 md:h-20 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, the page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link
            href="/"
            className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all hover:scale-105 shadow-lg shadow-emerald-600/20 flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 bg-white text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all border border-gray-200 flex items-center gap-2 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="bg-white rounded-2xl p-6 max-w-lg mx-auto border border-gray-200 shadow-sm">
          <h3 className="text-gray-900 font-bold mb-4 flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            Popular Pages
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Guides', href: '/guides' },
              { name: 'Blood Bank', href: '/blood-bank' },
              { name: 'Donations', href: '/donations' },
              { name: 'Volunteers', href: '/volunteers' },
              { name: 'Emergency', href: '/emergency' },
              { name: 'Contact', href: '/contact' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors border border-gray-200"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-gray-500 text-sm mt-8">
          If you believe this is an error, please{' '}
          <Link href="/contact" className="text-emerald-600 hover:underline">
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
