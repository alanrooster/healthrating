import React from "react"
import type { Metadata, Viewport } from 'next'

import { JsonLd } from '@/components/json-ld'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://healthrating.org'),
  title: {
    default: 'HealthRating.org — The Most Comprehensive Health Score on the Web',
    template: '%s | HealthRating.org',
  },
  description:
    'Discover your life expectancy, biological age, and disease risks with 14 in-depth assessments covering 100+ life factors, each grounded in peer-reviewed research. Free, private, no sign-up.',
  applicationName: 'HealthRating.org',
  category: 'health',
  keywords: [
    'health score calculator',
    'life expectancy calculator',
    'biological age calculator',
    'health assessment',
    'longevity calculator',
    'BMI calculator',
    'body composition calculator',
    'diabetes risk calculator',
    'cardiovascular health score',
    'dementia risk',
    'cancer risk',
    'health rating',
    'wellness score',
  ],
  authors: [{ name: 'HealthRating.org' }],
  creator: 'HealthRating.org',
  publisher: 'HealthRating.org',
  formatDetection: {
    telephone: false,
  },
  // Each route sets its own canonical: this one is the home page's
  alternates: {
    canonical: 'https://healthrating.org',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'HealthRating.org — The Most Comprehensive Health Score on the Web',
    description:
      'Life expectancy, biological age, and disease risk screens from 14 in-depth assessments grounded in 60+ peer-reviewed studies. Free and private.',
    url: 'https://healthrating.org',
    siteName: 'HealthRating.org',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HealthRating.org — comprehensive health scoring: life expectancy, biological age, and disease risk',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HealthRating.org — The Most Comprehensive Health Score on the Web',
    description:
      'Your life expectancy, biological age, and disease risks from 14 research-backed assessments. Free, private, no sign-up.',
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#2f9e7f',
}

// Site-wide entities. Each page adds its own (the home page: WebPage, WebApplication and FAQPage).
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://healthrating.org/#organization',
      name: 'HealthRating.org',
      url: 'https://healthrating.org',
      logo: {
        '@type': 'ImageObject',
        url: 'https://healthrating.org/icon-512.png',
        width: 512,
        height: 512,
      },
      description:
        'HealthRating.org publishes a free, private, research-backed health scoring application.',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://healthrating.org/#website',
      url: 'https://healthrating.org',
      name: 'HealthRating.org',
      publisher: { '@id': 'https://healthrating.org/#organization' },
      author: {
        '@type': 'Person',
        name: 'Alan Gallicchio',
        url: 'https://alangallicchio.com',
      },
      license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
      description:
        'The most comprehensive health scoring on the web: life expectancy, biological age, and disease risk from 14 research-backed assessments.',
      inLanguage: 'en',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <JsonLd data={structuredData} />
        {children}
      </body>
    </html>
  )
}
