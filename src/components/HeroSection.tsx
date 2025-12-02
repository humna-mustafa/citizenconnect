import Link from 'next/link'
import SearchBar from './SearchBar'
import { ArrowRight, Heart, AlertTriangle, FileText } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-6 animate-in fade-in slide-in-from-bottom-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Empowering Pakistani Citizens
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-in fade-in slide-in-from-bottom-5 delay-100">
              Step-by-Step
              <span className="block text-primary">Solutions</span>
              <span className="block text-3xl md:text-4xl lg:text-5xl font-semibold text-muted-foreground mt-2">
                for Local Issues
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-6 delay-200">
              Access guides for civic issues, connect with blood donors, request emergency help, 
              and contribute to verified causes. Together, we build stronger communities.
            </p>

            {/* Search Bar */}
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-7 delay-300">
              <SearchBar size="lg" placeholder="Search guides by issue or category..." />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-8 delay-400">
              <Link
                href="/guides"
                className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5 flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Browse Guides
              </Link>
              <Link
                href="/blood-bank"
                className="px-6 py-3 bg-background text-destructive font-semibold rounded-xl border-2 border-destructive hover:bg-destructive hover:text-destructive-foreground transition-all flex items-center gap-2"
              >
                <Heart className="w-5 h-5" />
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

          {/* Right Content - Illustration */}
          <div className="hidden lg:block relative animate-in fade-in slide-in-from-right-8 delay-500">
            <div className="relative">
              {/* Main Card */}
              <div className="bg-card rounded-3xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500 border border-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <ArrowRight className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Issue Resolved!</h3>
                    <p className="text-sm text-muted-foreground">Road pothole fixed in 5 days</p>
                  </div>
                </div>
                
                {/* Progress Steps */}
                <div className="space-y-4">
                  {['Report Filed', 'Under Review', 'Work Assigned', 'Issue Resolved'].map((step, i) => (
                    <div key={step} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        i <= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {i < 3 ? '✓' : i + 1}
                      </div>
                      <span className={i <= 3 ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-6 -right-6 bg-card rounded-2xl shadow-xl p-4 animate-bounce border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground text-sm font-bold">
                    A+
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Blood Donor Found</p>
                    <p className="text-xs text-muted-foreground">2 km away</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-6 bg-card rounded-2xl shadow-xl p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">PKR 50,000</p>
                    <p className="text-xs text-muted-foreground">Donated today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="mt-16 pt-16 border-t border-border">
          <p className="text-center text-muted-foreground mb-8 text-sm font-medium uppercase tracking-wider">
            Trusted by citizens across Pakistan
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            {['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta', 'Multan'].map((city) => (
              <div key={city} className="text-xl font-bold text-foreground">
                {city}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
