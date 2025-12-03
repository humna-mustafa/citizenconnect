import { Metadata } from 'next'

interface MetadataProps {
  title: string
  description: string
  image?: string
  noIndex?: boolean
}

export function constructMetadata({
  title,
  description,
  image = '/og-image.png',
  noIndex = false,
}: MetadataProps): Metadata {
  return {
    title: {
      default: title,
      template: `%s | CitizenConnect`,
    },
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@citizenconnect',
    },
    icons: {
      icon: '/favicon.ico',
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}
