import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const supabase = createClient()

  // Get all published guides
  const { data: guides } = await supabase
    .from('guides')
    .select('slug, updated_at')
    .eq('is_published', true)

  const guideUrls =
    guides?.map((guide) => ({
      url: `${baseUrl}/guides/${guide.slug}`,
      lastModified: new Date(guide.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })) ?? []

  // Get all active donation cases
  const { data: campaigns } = await supabase
    .from('donation_cases')
    .select('slug, updated_at')
    .eq('is_active', true)

  const campaignUrls =
    campaigns?.map((campaign) => ({
      url: `${baseUrl}/donations/${campaign.slug}`,
      lastModified: new Date(campaign.updated_at),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })) ?? []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blood-bank`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/donations`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/volunteers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/emergency`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...guideUrls,
    ...campaignUrls,
  ]
}
