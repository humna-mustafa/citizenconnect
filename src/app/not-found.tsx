'use client'

import Link from 'next/link'
import { Home, Search, ArrowLeft, HelpCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl opacity-20 animate-pulse delay-700"></div>

      <div className="text-center relative z-10">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold text-white/10 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
              <Search className="w-16 h-16 md:w-20 md:h-20 text-white" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-emerald-100 mb-8 max-w-md mx-auto">
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
            className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 max-w-lg mx-auto border border-white/10">
          <h3 className="text-white font-bold mb-4 flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
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
                className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-slate-500 text-sm mt-8">
          If you believe this is an error, please{' '}
          <Link href="/contact" className="text-emerald-400 hover:underline">
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
