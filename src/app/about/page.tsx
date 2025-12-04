'use client'

import Link from 'next/link'
import { 
  Users, 
  Target, 
  Heart, 
  Shield, 
  Lightbulb, 
  BookOpen, 
  Droplets, 
  Phone, 
  Gift, 
  HandHeart, 
  BarChart3, 
  Code2, 
  Database, 
  Layout, 
  Server, 
  Cpu,
  GraduationCap,
  Award,
  Star
} from 'lucide-react'

export default function AboutPage() {
  const teamMembers = [
    { 
      name: 'Humna Mustafa', 
      rollNo: 'FA25-BSE-051', 
      role: 'Project Lead & Full Stack Developer', 
      image: '👩‍💻',
      contribution: 'Led the entire project development, implemented core features, database design, and UI/UX',
      isLead: true
    },
    { 
      name: 'Laiba Khalid', 
      rollNo: 'FA25-BSE-057', 
      role: 'Frontend Developer', 
      image: '👩‍🎨',
      contribution: 'UI components and responsive design'
    },
    { 
      name: 'Amna Tayyaba Iftikhar', 
      rollNo: 'FA25-BSE-148', 
      role: 'Backend Developer', 
      image: '👩‍💼',
      contribution: 'API integration and database queries'
    },
    { 
      name: 'Moiza Raseed ul Hassan', 
      rollNo: 'FA25-BSE-176', 
      role: 'Documentation & Testing', 
      image: '👩‍🔬',
      contribution: 'Testing, documentation, and quality assurance'
    },
  ]

  const milestones = [
    { year: '2025', title: 'Project Initiated', desc: 'CitizenConnect conceptualized as Civics & Community Engagement project' },
    { year: '2025', title: 'Development Phase', desc: 'Built complete platform with Next.js, Supabase, and modern technologies' },
    { year: '2025', title: 'Feature Complete', desc: 'Implemented all core modules: Guides, Blood Bank, Donations, Volunteers' },
    { year: '2025', title: 'Project Submission', desc: 'Presented to Prof. Ayesha Aqeel as semester project' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Academic Project Banner */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-white text-center">
            <GraduationCap className="w-5 h-5" />
            <span className="font-medium">
              BS Software Engineering Semester Project | Course: Civics and Community Engagement | 
              <span className="font-bold"> Supervised by Prof. Ayesha Aqeel</span>
            </span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-primary"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">About CitizenConnect</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Empowering Pakistani citizens with simplified access to government services, 
              emergency help, and community support.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
                <Target className="w-4 h-4" />
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Bridging the Gap Between Citizens & Services</h2>
              <div className="space-y-4 text-muted-foreground text-lg">
                <p>
                  CitizenConnect was created with a simple yet powerful mission: to bridge the gap 
                  between citizens and essential services in Pakistan.
                </p>
                <p>
                  We believe that every citizen deserves easy access to information about government 
                  procedures, emergency services, and community support. Our platform simplifies 
                  complex bureaucratic processes and connects people with the help they need.
                </p>
                <p>
                  As a BS Software Engineering semester project, CitizenConnect demonstrates how 
                  technology can create meaningful social impact while providing practical solutions 
                  to everyday challenges faced by Pakistani citizens.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: BookOpen, title: '150+', desc: 'Step-by-step Guides' },
                { icon: Droplets, title: '10+', desc: 'Blood Donors' },
                { icon: Users, title: '15+', desc: 'Active Volunteers' },
                { icon: Heart, title: 'PKR 100,000+', desc: 'Donations Facilitated' },
              ].map((stat, index) => (
                <div key={index} className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-all group">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.title}</div>
                  <div className="text-sm text-muted-foreground">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-muted-foreground">The principles that guide our mission to serve the community.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Target, title: 'Simplicity', desc: 'Making complex processes easy to understand and follow' },
              { icon: Shield, title: 'Trust', desc: 'Building transparent systems that users can rely on' },
              { icon: Users, title: 'Community', desc: 'Fostering connections that help citizens support each other' },
              { icon: Lightbulb, title: 'Innovation', desc: 'Using technology to solve real civic challenges' },
            ].map((value, index) => (
              <div key={index} className="bg-background rounded-2xl p-8 shadow-sm border border-border hover:shadow-md transition-all text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform text-primary">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">What We Offer</h2>
            <p className="text-muted-foreground">Comprehensive tools and resources for every citizen.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: 'Step-by-Step Guides', desc: 'Comprehensive guides for CNIC, passport, license, and more' },
              { icon: Droplets, title: 'Blood Donor Network', desc: 'Find and connect with blood donors in your area' },
              { icon: Phone, title: 'Emergency Help', desc: 'Quick access to emergency contacts and procedures' },
              { icon: Gift, title: 'Donation Platform', desc: 'Verified donation campaigns with complete transparency' },
              { icon: HandHeart, title: 'Volunteer Network', desc: 'Connect with volunteers or offer your skills' },
              { icon: BarChart3, title: 'Transparency Dashboard', desc: 'Real-time tracking of all community contributions' },
            ].map((feature, index) => (
              <div key={index} className="bg-card rounded-2xl p-8 shadow-sm border border-border hover:border-primary/50 transition-all group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-slate-900 text-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-16 text-center">Our Journey</h2>
          
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-8 mb-12 last:mb-0 group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>
                  {index !== milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-slate-800 my-4 group-hover:bg-primary/50 transition-colors"></div>
                  )}
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 flex-1 border border-slate-700 hover:border-primary/50 transition-colors">
                  <span className="text-primary font-bold mb-2 block">{milestone.year}</span>
                  <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                  <p className="text-slate-400">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              <GraduationCap className="w-4 h-4" />
              Semester Project Team
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground">
              CitizenConnect is a BS Software Engineering semester project for <strong>Civics and Community Engagement</strong> course, 
              supervised by <strong>Prof. Ayesha Aqeel</strong>.
            </p>
          </div>
          
          {/* Project Lead - Featured */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-3xl p-8 border-2 border-emerald-200 dark:border-emerald-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold">
                  <Star className="w-3 h-3" /> Project Lead
                </span>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="text-7xl transform hover:scale-110 transition-transform duration-300">👩‍💻</div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="font-bold text-foreground text-2xl mb-1">Humna Mustafa</h3>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold mb-1">FA25-BSE-051</p>
                  <p className="text-primary font-medium mb-3">Project Lead & Full Stack Developer</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Led the entire project development including system architecture, database design, 
                    frontend & backend implementation, UI/UX design, and integration of all major features. 
                    Responsible for the majority of the codebase and project coordination.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                    {['Next.js', 'React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'UI/UX'].map(skill => (
                      <span key={skill} className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Other Team Members */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.filter(m => !m.isLead).map((member, index) => (
              <div key={index} className="bg-card rounded-2xl p-6 text-center border border-border hover:shadow-lg transition-all group hover:border-primary/50">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{member.image}</div>
                <h3 className="font-bold text-foreground text-lg mb-1">{member.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{member.rollNo}</p>
                <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
                <p className="text-xs text-muted-foreground">{member.contribution}</p>
              </div>
            ))}
          </div>

          {/* Professor Credit */}
          <div className="mt-16 max-w-xl mx-auto">
            <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-8 text-center text-white">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <p className="text-emerald-400 font-medium text-sm mb-2">Course Supervisor</p>
              <h3 className="text-2xl font-bold mb-2">Prof. Ayesha Aqeel</h3>
              <p className="text-slate-400">Civics and Community Engagement</p>
              <p className="text-slate-500 text-sm mt-2">COMSATS University Islamabad</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Built With Modern Technology</h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'Next.js', icon: Layout },
              { name: 'React', icon: Code2 },
              { name: 'TypeScript', icon: Code2 },
              { name: 'Tailwind CSS', icon: Layout },
              { name: 'Supabase', icon: Database },
              { name: 'PostgreSQL', icon: Server }
            ].map((tech, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-6 py-3 bg-background rounded-full shadow-sm border border-border hover:border-primary hover:text-primary transition-all cursor-default"
              >
                <tech.icon className="w-4 h-4" />
                <span className="font-semibold">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-3xl p-12 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Mission</h2>
              <p className="text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
                Be part of a community that's making civic services accessible to all. 
                Every contribution matters.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/auth/signup"
                  className="px-8 py-4 bg-background text-foreground font-bold rounded-xl hover:shadow-lg transition-all hover:scale-105"
                >
                  Get Started
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 border-2 border-primary-foreground text-primary-foreground font-bold rounded-xl hover:bg-primary-foreground hover:text-primary transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
