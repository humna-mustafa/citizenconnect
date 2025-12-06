import Link from 'next/link'
import SearchBar from './SearchBar'
import { ArrowRight, Heart, AlertTriangle, FileText, Users, Droplets, HandHeart } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-40 animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-200 rounded-full blur-3xl opacity-30 animate-pulse delay-1000" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6 animate-in fade-in slide-in-from-bottom-5 delay-100">
              Empowering Pakistani Citizens
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-6 delay-200">
              Navigate government services with ease. Access step-by-step guides, connect with blood donors, 
              find emergency help, and support verified campaigns. Let's build a stronger Pakistan together.
            </p>

            {/* Search Bar */}
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-7 delay-300 relative z-50">
              <SearchBar size="lg" placeholder="Search guides by issue or category..." />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-8 delay-400">
              <Link
                href="/guides"
                className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 transition-all hover:-translate-y-0.5 flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Browse Guides
              </Link>
              <Link
                href="/blood-bank"
                className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
              >
                <Heart className="w-5 h-5 text-red-500" />
                Find Blood Donor
              </Link>
              <Link
                href="/emergency"
                className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2 animate-pulse"
              >
                <AlertTriangle className="w-5 h-5" />
                Emergency Help
              </Link>
            </div>
          </div>

          {/* Right Content - Cards */}
          <div className="hidden lg:block relative h-[600px] w-full animate-in fade-in slide-in-from-right-8 delay-500">
            {/* Card 1: Community Impact */}
            <div className="absolute top-10 right-10 bg-white border border-gray-100 p-6 rounded-2xl shadow-xl w-72 transform hover:scale-105 transition-all duration-500 animate-float">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Community</h3>
                  <p className="text-xs text-gray-500">Active Citizens</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-3/4"></div>
                </div>
                <p className="text-xs text-gray-500 text-right">15+ Active Volunteers</p>
              </div>
            </div>

            {/* Card 2: Blood Bank */}
            <div className="absolute top-40 left-10 bg-white border border-gray-100 p-6 rounded-2xl shadow-xl w-72 transform hover:scale-105 transition-all duration-500 animate-float delay-1000" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-500">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Blood Bank</h3>
                  <p className="text-xs text-gray-500">Lives Saved</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">+10 Donors</p>
              </div>
            </div>

            {/* Card 3: Donations */}
            <div className="absolute bottom-20 right-20 bg-white border border-gray-100 p-6 rounded-2xl shadow-xl w-72 transform hover:scale-105 transition-all duration-500 animate-float delay-2000" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-500">
                  <HandHeart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Donations</h3>
                  <p className="text-xs text-gray-500">Impact Created</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">PKR 100k+</div>
              <p className="text-xs text-emerald-600">↑ Raised this month</p>
            </div>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <p className="text-center text-gray-500 mb-8 text-sm font-medium uppercase tracking-wider">
            Trusted by citizens across Pakistan
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 justify-items-center">
            {['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta', 'Multan'].map((city) => (
              <div 
                key={city} 
                className="w-full max-w-[160px] px-4 py-3 bg-white border border-gray-200 rounded-xl text-center hover:bg-gray-50 transition-all duration-300 cursor-default group shadow-sm"
              >
                <span className="text-lg font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{city}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
