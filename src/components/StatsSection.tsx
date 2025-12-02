'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FileText, Heart, Users, Coins } from 'lucide-react'

interface StatsData {
  totalGuides: number
  totalDonors: number
  totalVolunteers: number
  totalDonations: number
}

export default function StatsSection() {
  const [stats, setStats] = useState<StatsData>({
    totalGuides: 0,
    totalDonors: 0,
    totalVolunteers: 0,
    totalDonations: 0
  })
  const [animatedStats, setAnimatedStats] = useState<StatsData>({
    totalGuides: 0,
    totalDonors: 0,
    totalVolunteers: 0,
    totalDonations: 0
  })
  const [isVisible, setIsVisible] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch guides count
      const { count: guidesCount } = await supabase
        .from('guides')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)

      // Fetch donors count
      const { count: donorsCount } = await supabase
        .from('blood_donors')
        .select('*', { count: 'exact', head: true })

      // Fetch volunteers count
      const { count: volunteersCount } = await supabase
        .from('volunteers')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      // Fetch total donations
      const { data: donationsData } = await supabase
        .from('donations')
        .select('amount')
        .eq('status', 'completed')

      const totalDonations = donationsData?.reduce((sum, d) => sum + Number(d.amount), 0) || 0

      setStats({
        totalGuides: guidesCount || 150, // Default values for demo
        totalDonors: donorsCount || 500,
        totalVolunteers: volunteersCount || 200,
        totalDonations: totalDonations || 2500000
      })
    }

    fetchStats()
  }, [supabase])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    const element = document.getElementById('stats-section')
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)

      setAnimatedStats({
        totalGuides: Math.floor(stats.totalGuides * easeOutQuart),
        totalDonors: Math.floor(stats.totalDonors * easeOutQuart),
        totalVolunteers: Math.floor(stats.totalVolunteers * easeOutQuart),
        totalDonations: Math.floor(stats.totalDonations * easeOutQuart)
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setAnimatedStats(stats)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isVisible, stats])

  const statItems = [
    {
      label: 'Issue Guides',
      value: animatedStats.totalGuides,
      suffix: '+',
      icon: FileText,
      color: 'text-primary bg-primary/10'
    },
    {
      label: 'Blood Donors',
      value: animatedStats.totalDonors,
      suffix: '+',
      icon: Heart,
      color: 'text-destructive bg-destructive/10'
    },
    {
      label: 'Active Volunteers',
      value: animatedStats.totalVolunteers,
      suffix: '+',
      icon: Users,
      color: 'text-blue-500 bg-blue-500/10'
    },
    {
      label: 'Donations Raised',
      value: animatedStats.totalDonations,
      prefix: 'PKR ',
      suffix: '',
      format: true,
      icon: Coins,
      color: 'text-amber-500 bg-amber-500/10'
    }
  ]

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toLocaleString()
  }

  return (
    <section id="stats-section" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Making a <span className="text-primary">Difference</span> Together
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of citizens working together to solve local issues and help those in need.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, index) => (
            <div
              key={stat.label}
              className={`bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${
                isVisible ? 'animate-in fade-in slide-in-from-bottom-4' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-16 h-16 rounded-2xl ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {stat.prefix || ''}
                {stat.format ? formatNumber(stat.value) : stat.value.toLocaleString()}
                {stat.suffix}
              </div>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
