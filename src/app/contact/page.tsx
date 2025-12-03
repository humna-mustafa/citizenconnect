'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react'

const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="h-80 w-full bg-muted animate-pulse rounded-xl flex items-center justify-center text-muted-foreground">Loading Map...</div>
})

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { createContactMessage } = await import('@/lib/supabase/helpers')
    const { error } = await createContactMessage(formData)
    
    if (error) {
      alert('Error sending message. Please try again.')
      console.error(error)
    } else {
      setSubmitted(true)
    }
    
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-card border border-border rounded-3xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Message Sent!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for reaching out. We'll get back to you within 24-48 hours.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-primary"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Contact Us</h1>
            <p className="text-xl text-primary-foreground/90">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {/* Quick Contact Cards */}
            {[
              { icon: Mail, title: 'Email', value: 'support@citizenconnect.pk', link: 'mailto:support@citizenconnect.pk' },
              { icon: Phone, title: 'Phone', value: '+92 300 1234567', link: 'tel:+923001234567' },
              { icon: MapPin, title: 'Location', value: 'Lahore, Pakistan', link: '#' },
              { icon: Clock, title: 'Working Hours', value: 'Mon-Fri: 9AM - 6PM', link: '#' },
            ].map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="flex items-center gap-4 p-5 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <p className="font-semibold text-foreground">{item.value}</p>
                </div>
              </a>
            ))}

            {/* Social Links */}
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-foreground mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, name: 'Facebook' },
                  { icon: Twitter, name: 'Twitter' },
                  { icon: Instagram, name: 'Instagram' },
                  { icon: Linkedin, name: 'LinkedIn' },
                ].map((social, index) => (
                  <button
                    key={index}
                    className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all"
                    title={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Have Questions?
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Check our FAQ section for quick answers to common questions.
              </p>
              <Link
                href="/faq"
                className="text-primary font-semibold hover:underline flex items-center gap-2"
              >
                Visit FAQ
                <Send className="w-4 h-4 rotate-45" />
              </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-3xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Muhammad Ahmed"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="ahmed@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                      <option value="">Select category</option>
                      <option value="general">General Inquiry</option>
                      <option value="guides">Guides & Content</option>
                      <option value="blood-bank">Blood Bank</option>
                      <option value="donations">Donations</option>
                      <option value="volunteers">Volunteering</option>
                      <option value="technical">Technical Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="How can we help?"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Find Us</h2>
          <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
            <Map 
              markers={[
                {
                  id: 'office',
                  position: [31.5204, 74.3587] as [number, number],
                  title: 'CitizenConnect HQ',
                  description: 'Lahore, Punjab, Pakistan'
                }
              ]}
              zoom={12}
              center={[31.5204, 74.3587] as [number, number]}
            />
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-destructive rounded-3xl p-8 text-destructive-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">Need Emergency Help?</h2>
                  <p className="text-destructive-foreground/90">
                    For emergencies, please contact the relevant services directly.
                  </p>
                </div>
              </div>
              <Link
                href="/emergency"
                className="px-8 py-4 bg-white text-destructive font-bold rounded-xl hover:shadow-lg transition-all hover:scale-105"
              >
                Emergency Contacts
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
