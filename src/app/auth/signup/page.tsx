'use client'

import { useActionState, useState, useEffect } from 'react'
import Link from 'next/link'
import { signup } from '../actions'
import { User, Mail, Phone, MapPin, Lock, Loader2, ArrowRight, Check, Eye, EyeOff, AlertCircle } from 'lucide-react'

const initialState = {
  error: '',
}

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signup, initialState)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [errors, setErrors] = useState<{email?: string; phone?: string; password?: string; confirmPassword?: string; terms?: string}>({})
  const [touched, setTouched] = useState<{email?: boolean; phone?: boolean; password?: boolean; confirmPassword?: boolean}>({})

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    const checks = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    }
    const strength = Object.values(checks).filter(Boolean).length
    return { strength, checks }
  }

  const passwordAnalysis = getPasswordStrength(password)
  const strengthLabel = passwordAnalysis.strength <= 2 ? 'Weak' : passwordAnalysis.strength <= 3 ? 'Medium' : 'Strong'
  const strengthColor = passwordAnalysis.strength <= 2 ? 'bg-red-500' : passwordAnalysis.strength <= 3 ? 'bg-yellow-500' : 'bg-emerald-500'
  const strengthTextColor = passwordAnalysis.strength <= 2 ? 'text-red-500' : passwordAnalysis.strength <= 3 ? 'text-yellow-500' : 'text-emerald-500'

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Phone validation (Pakistani format)
  const validatePhone = (phone: string) => {
    const phoneRegex = /^(03[0-9]{2}[-\s]?[0-9]{7}|\+92\s?3[0-9]{2}\s?[0-9]{7})$/
    return phone === '' || phoneRegex.test(phone.replace(/\s/g, ''))
  }

  // Format phone number
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.startsWith('92')) {
      return '+92 ' + digits.slice(2, 5) + ' ' + digits.slice(5, 12)
    }
    if (digits.length <= 4) return digits
    return digits.slice(0, 4) + '-' + digits.slice(4, 11)
  }

  useEffect(() => {
    const newErrors: typeof errors = {}
    
    if (touched.email && email && !validateEmail(email)) {
      newErrors.email = 'Enter a valid email address'
    }
    if (touched.phone && phone && !validatePhone(phone)) {
      newErrors.phone = 'Enter valid Pakistani phone number (03XX-XXXXXXX)'
    }
    if (touched.confirmPassword && password !== confirmPassword && confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
  }, [email, phone, password, confirmPassword, touched])

  const isFormValid = () => {
    return termsAccepted && 
           validateEmail(email) && 
           (phone === '' || validatePhone(phone)) && 
           password === confirmPassword && 
           password.length >= 6
  }

  const cities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 
    'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
    'Hyderabad', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Other'
  ]

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!termsAccepted) {
      e.preventDefault()
      setErrors(prev => ({ ...prev, terms: 'Please accept Terms of Service to continue' }))
      return
    }
    if (!isFormValid()) {
      e.preventDefault()
      return
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-900 to-slate-900"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-20 w-60 h-60 bg-teal-500 rounded-full blur-3xl opacity-20 animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">CitizenConnect</h1>
              <p className="text-sm text-emerald-200">Empowering Communities</p>
            </div>
          </Link>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h2>
            <p className="text-slate-500">Join our community of active citizens</p>
          </div>

          {state?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p>{state.error}</p>
            </div>
          )}
          {state?.success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl text-green-600 text-sm flex items-start gap-2">
              <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p>{state.success}</p>
            </div>
          )}

          <form action={formAction} onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  required
                  autoFocus
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-slate-200'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all`}
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-slate-200'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all`}
                    placeholder="03XX-XXXXXXX"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    name="city"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none bg-white transition-all appearance-none"
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  I want to be a
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    name="role"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none bg-white transition-all appearance-none"
                  >
                    <option value="citizen">Citizen</option>
                    <option value="donor">Blood Donor</option>
                    <option value="volunteer">Volunteer</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    placeholder="Min. 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            level <= passwordAnalysis.strength ? strengthColor : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${strengthTextColor}`}>
                      {strengthLabel}
                    </p>
                    <div className="mt-1 space-y-0.5">
                      {Object.entries(passwordAnalysis.checks).map(([key, passed]) => (
                        <p key={key} className={`text-xs flex items-center gap-1 ${passed ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {passed ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-slate-300 inline-block" />}
                          {key === 'length' && '8+ characters'}
                          {key === 'uppercase' && 'Uppercase letter'}
                          {key === 'lowercase' && 'Lowercase letter'}
                          {key === 'number' && 'Number'}
                          {key === 'special' && 'Special character'}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
                    className={`w-full pl-12 pr-12 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                  </p>
                )}
                {confirmPassword && password === confirmPassword && (
                  <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Passwords match
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="relative flex items-center mt-1">
                <input
                  type="checkbox"
                  name="terms"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked)
                    if (e.target.checked) {
                      setErrors(prev => ({ ...prev, terms: undefined }))
                    }
                  }}
                  className="peer sr-only"
                />
                <div 
                  onClick={() => {
                    setTermsAccepted(!termsAccepted)
                    if (!termsAccepted) {
                      setErrors(prev => ({ ...prev, terms: undefined }))
                    }
                  }}
                  className={`w-5 h-5 border-2 ${errors.terms ? 'border-red-500' : 'border-slate-300'} rounded cursor-pointer ${termsAccepted ? 'bg-emerald-500 border-emerald-500' : ''} transition-all`}
                >
                  {termsAccepted && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>
              <div>
                <span className="text-sm text-slate-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-emerald-600 font-medium hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-emerald-600 font-medium hover:underline">Privacy Policy</Link>
                  {' '}<span className="text-red-500">*</span>
                </span>
                {errors.terms && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.terms}
                  </p>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500">
              <span className="text-red-500">*</span> Required fields
            </p>

            <button
              type="submit"
              disabled={isPending || !isFormValid()}
              className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
