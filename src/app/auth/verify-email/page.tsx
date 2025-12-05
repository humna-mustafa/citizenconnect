import Link from 'next/link'
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-50 via-white to-teal-50"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 left-20 w-60 h-60 bg-teal-200 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-md text-center relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50/50">
            <Mail className="w-10 h-10 text-emerald-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Check Your Email</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            We&apos;ve sent a verification link to your email address. 
            Please click the link to verify your account and get started.
          </p>
          
          <div className="bg-slate-50 rounded-xl p-4 mb-8 border border-slate-100">
            <p className="text-sm text-slate-500 flex flex-col gap-2">
              <span>Didn&apos;t receive the email? Check your spam folder or</span>
              <button className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline flex items-center justify-center gap-2 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Resend verification email
              </button>
            </p>
          </div>
          
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
