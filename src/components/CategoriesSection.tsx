import Link from 'next/link'
import { Car, Droplets, Zap, Stethoscope, BookOpen, Users, ArrowRight } from 'lucide-react'

const categories = [
  {
    name: 'Roads & Transport',
    slug: 'roads-transport',
    icon: Car,
    description: 'Traffic, potholes, public transport issues',
    color: 'text-blue-500 bg-blue-500/10',
    count: 45
  },
  {
    name: 'Sewerage & Water',
    slug: 'sewerage-water',
    icon: Droplets,
    description: 'Water supply and drainage problems',
    color: 'text-cyan-500 bg-cyan-500/10',
    count: 32
  },
  {
    name: 'Electricity & Gas',
    slug: 'electricity-gas',
    icon: Zap,
    description: 'Power outages and utility issues',
    color: 'text-yellow-500 bg-yellow-500/10',
    count: 28
  },
  {
    name: 'Health',
    slug: 'health',
    icon: Stethoscope,
    description: 'Healthcare and medical assistance',
    color: 'text-red-500 bg-red-500/10',
    count: 38
  },
  {
    name: 'Education',
    slug: 'education',
    icon: BookOpen,
    description: 'Schools, colleges, and educational issues',
    color: 'text-purple-500 bg-purple-500/10',
    count: 25
  },
  {
    name: 'Social Causes',
    slug: 'social-causes',
    icon: Users,
    description: 'Community welfare and social issues',
    color: 'text-primary bg-primary/10',
    count: 42
  }
]

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Popular <span className="text-primary">Categories</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse through our categorized guides to find solutions for your specific issues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/guides?category=${category.slug}`}
              className="group relative bg-card rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${category.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="w-7 h-7" />
                  </div>
                  <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium">
                    {category.count} guides
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-muted-foreground">{category.description}</p>
                
                <div className="mt-4 flex items-center text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore guides</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            View All Categories
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
