import Link from 'next/link'
import { ArrowRight, Plus, Shield, Lock, Users, Phone } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Make a <span className="underline decoration-wavy decoration-white/50">Difference</span>?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of citizens who are already solving local issues, helping those in need, 
            and building stronger communities together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-white text-primary font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/guides/submit"
              className="px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white hover:bg-white hover:text-primary transition-all flex items-center justify-center gap-2"
            >
              Submit a Guide
              <Plus className="w-5 h-5" />
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-white/80">
              <Shield className="w-6 h-6" />
              <span>Verified Guides</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Lock className="w-6 h-6" />
              <span>Secure Platform</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Users className="w-6 h-6" />
              <span>Community Driven</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Phone className="w-6 h-6" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
