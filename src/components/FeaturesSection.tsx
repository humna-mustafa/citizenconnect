import Link from 'next/link'
import { Heart, AlertTriangle, Coins, Users, ArrowRight } from 'lucide-react'

const features = [
  {
    title: 'Find Blood Donors',
    description: 'Connect with verified blood donors in your city. Filter by blood group and get instant contact.',
    icon: Heart,
    href: '/blood-bank',
    color: 'text-destructive bg-destructive/10',
    stats: '500+ Donors'
  },
  {
    title: 'Emergency Help',
    description: 'Access emergency contacts, step-by-step guidance for medical, fire, and disaster situations.',
    icon: AlertTriangle,
    href: '/emergency',
    color: 'text-orange-500 bg-orange-500/10',
    stats: '24/7 Available'
  },
  {
    title: 'Donate to Causes',
    description: 'Support verified cases for medical, education, food, and disaster relief with full transparency.',
    icon: Coins,
    href: '/donations',
    color: 'text-amber-500 bg-amber-500/10',
    stats: 'PKR 2.5M+ Raised'
  },
  {
    title: 'Become a Volunteer',
    description: 'Join our community of volunteers. Share your skills and make a real difference in peoples lives.',
    icon: Users,
    href: '/volunteers',
    color: 'text-primary bg-primary/10',
    stats: '200+ Volunteers'
  }
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How Can We <span className="text-primary">Help</span> You?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            CitizenConnect offers multiple ways to help and get help. Choose what suits your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-lg hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-6">
                <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full">
                      {feature.stats}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="mt-4 flex items-center text-primary font-semibold">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
