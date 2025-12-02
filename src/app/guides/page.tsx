'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import SearchBar from '@/components/SearchBar'
import { 
  Car, 
  Droplets, 
  Zap, 
  Stethoscope, 
  BookOpen, 
  HandHeart, 
  Eye, 
  ThumbsUp, 
  ArrowRight, 
  Plus, 
  LayoutGrid, 
  Star,
  Filter,
  Loader2
} from 'lucide-react'

interface Guide {
  id: string
  title: string
  slug: string
  problem_explanation: string
  views_count: number
  upvotes_count: number
  average_rating: number
  created_at: string
  category: {
    name: string
    slug: string
    icon: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description: string
}

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('newest')
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
    
    fetchCategories()
    fetchGuides()
  }, [searchParams])

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (data) {
      setCategories(data)
    }
  }

  const fetchGuides = async () => {
    setLoading(true)
    
    let query = supabase
      .from('guides')
      .select(`
        id, title, slug, problem_explanation, views_count, upvotes_count, average_rating, created_at,
        category:categories(name, slug, icon)
      `)
      .eq('is_published', true)

    if (selectedCategory) {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', selectedCategory)
        .single()
      
      if (cat) {
        query = query.eq('category_id', cat.id)
      }
    }

    const searchQuery = searchParams.get('search')
    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`)
    }

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        query = query.order('views_count', { ascending: false })
        break
      case 'most-upvoted':
        query = query.order('upvotes_count', { ascending: false })
        break
      case 'top-rated':
        query = query.order('average_rating', { ascending: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    const { data } = await query.limit(20)
    
    if (data) {
      setGuides(data as unknown as Guide[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchGuides()
  }, [selectedCategory, sortBy])

  // Demo guides data
  const demoGuides: Guide[] = [
    {
      id: '1',
      title: 'How to Report a Pothole in Your Area',
      slug: 'report-pothole',
      problem_explanation: 'Step-by-step guide to report potholes and road damage to the relevant authorities for quick repairs.',
      views_count: 1234,
      upvotes_count: 89,
      average_rating: 4.5,
      created_at: new Date().toISOString(),
      category: { name: 'Roads & Transport', slug: 'roads-transport', icon: '🚗' }
    },
    {
      id: '2',
      title: 'Water Supply Complaint: Complete Guide',
      slug: 'water-supply-complaint',
      problem_explanation: 'Learn how to file complaints about water supply issues, low pressure, or contaminated water.',
      views_count: 987,
      upvotes_count: 67,
      average_rating: 4.3,
      created_at: new Date().toISOString(),
      category: { name: 'Sewerage & Water', slug: 'sewerage-water', icon: '💧' }
    },
    {
      id: '3',
      title: 'Filing an Electricity Overcharge Complaint',
      slug: 'electricity-overcharge',
      problem_explanation: 'Guide to dispute electricity bills and file complaints about meter issues or overcharging.',
      views_count: 2341,
      upvotes_count: 156,
      average_rating: 4.7,
      created_at: new Date().toISOString(),
      category: { name: 'Electricity & Gas', slug: 'electricity-gas', icon: '⚡' }
    },
    {
      id: '4',
      title: 'Getting Your CNIC Made or Renewed',
      slug: 'cnic-renewal',
      problem_explanation: 'Complete process for applying for a new CNIC or renewing your existing national identity card.',
      views_count: 5678,
      upvotes_count: 234,
      average_rating: 4.8,
      created_at: new Date().toISOString(),
      category: { name: 'Social Causes', slug: 'social-causes', icon: '🤝' }
    },
    {
      id: '5',
      title: 'How to Get Domicile Certificate',
      slug: 'domicile-certificate',
      problem_explanation: 'Step-by-step guide for obtaining a domicile certificate from your local government office.',
      views_count: 3456,
      upvotes_count: 189,
      average_rating: 4.6,
      created_at: new Date().toISOString(),
      category: { name: 'Social Causes', slug: 'social-causes', icon: '🤝' }
    },
    {
      id: '6',
      title: 'School Admission Process Guide',
      slug: 'school-admission',
      problem_explanation: 'Navigate the school admission process including required documents and deadlines.',
      views_count: 2100,
      upvotes_count: 98,
      average_rating: 4.4,
      created_at: new Date().toISOString(),
      category: { name: 'Education', slug: 'education', icon: '📚' }
    }
  ]

  const displayGuides = guides.length > 0 ? guides : demoGuides

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'roads-transport': return Car
      case 'sewerage-water': return Droplets
      case 'electricity-gas': return Zap
      case 'health': return Stethoscope
      case 'education': return BookOpen
      case 'social-causes': return HandHeart
      default: return LayoutGrid
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-emerald-900 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-500 rounded-full blur-3xl opacity-10 animate-pulse delay-700"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-semibold mb-8 backdrop-blur-md border border-white/20 shadow-lg">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-100">Knowledge Base</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Issue Guides</h1>
            <p className="text-xl text-emerald-100 mb-10 leading-relaxed">
              Find step-by-step solutions for civic issues. Search by category or keyword to get started.
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                placeholder="Search guides by issue, category, or keyword..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-72 flex-shrink-0">
              <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 sticky top-24">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                      !selectedCategory 
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                    <span>All Categories</span>
                  </button>
                  {(categories.length > 0 ? categories : [
                    { id: '1', name: 'Roads & Transport', slug: 'roads-transport', icon: '🚗', description: '' },
                    { id: '2', name: 'Sewerage & Water', slug: 'sewerage-water', icon: '💧', description: '' },
                    { id: '3', name: 'Electricity & Gas', slug: 'electricity-gas', icon: '⚡', description: '' },
                    { id: '4', name: 'Health', slug: 'health', icon: '🏥', description: '' },
                    { id: '5', name: 'Education', slug: 'education', icon: '📚', description: '' },
                    { id: '6', name: 'Social Causes', slug: 'social-causes', icon: '🤝', description: '' },
                  ]).map(cat => {
                    const Icon = getCategoryIcon(cat.slug)
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                          selectedCategory === cat.slug 
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{cat.name}</span>
                      </button>
                    )
                  })}
                </div>

                <hr className="my-6 border-slate-100" />

                <h3 className="font-bold text-slate-900 mb-4">Sort By</h3>
                <div className="space-y-2">
                  {[
                    { value: 'newest', label: 'Newest First' },
                    { value: 'popular', label: 'Most Viewed' },
                    { value: 'most-upvoted', label: 'Most Upvoted' },
                    { value: 'top-rated', label: 'Top Rated' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl transition-all font-medium ${
                        sortBy === option.value
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Guides Grid */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <p className="text-slate-500">
                  Showing <span className="font-bold text-slate-900">{displayGuides.length}</span> guides
                  {selectedCategory && <span> in selected category</span>}
                </p>
                <Link
                  href="/guides/submit"
                  className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Plus className="w-5 h-5" />
                  Submit Guide
                </Link>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
                </div>
              ) : (
                <div className="grid gap-6">
                  {displayGuides.map(guide => {
                    const CategoryIcon = getCategoryIcon(guide.category?.slug || '')
                    return (
                      <Link
                        key={guide.id}
                        href={`/guides/${guide.slug}`}
                        className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:border-emerald-100 hover:-translate-y-1 duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full text-sm font-bold text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                            <CategoryIcon className="w-4 h-4" />
                            {guide.category?.name}
                          </span>
                          <div className="flex items-center gap-1 text-amber-400 bg-amber-50 px-3 py-1 rounded-full">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-bold text-amber-700">{guide.average_rating.toFixed(1)}</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                          {guide.title}
                        </h3>
                        <p className="text-slate-500 mb-6 line-clamp-2 leading-relaxed">
                          {guide.problem_explanation}
                        </p>

                        <div className="flex items-center gap-6 text-sm text-slate-400 font-medium border-t border-slate-50 pt-4">
                          <span className="flex items-center gap-1.5">
                            <Eye className="w-4 h-4" />
                            {guide.views_count.toLocaleString()} views
                          </span>
                          <span className="flex items-center gap-1.5">
                            <ThumbsUp className="w-4 h-4" />
                            {guide.upvotes_count} upvotes
                          </span>
                          <span className="flex items-center gap-1.5 ml-auto text-emerald-600 font-bold group-hover:translate-x-1 transition-transform">
                            Read Guide
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
