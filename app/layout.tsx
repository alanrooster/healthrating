import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Mono } from 'next/font/google'

import './globals.css'

const _inter = Inter({ subsets: ['latin'] })
const _spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://healthrating.org'),
  title: {
    default: 'HealthRating.org — The Most Comprehensive Health Score on the Web',
    template: '%s | HealthRating.org',
  },
  description:
    'Discover your life expectancy, biological age, and disease risks with 14 in-depth assessments covering 100+ life factors, each weighted by peer-reviewed research. Free, private, no sign-up.',
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
    'cardiovascular risk',
    'health rating',
    'carbon footprint calculator',
    'wellness score',
  ],
  authors: [{ name: 'HealthRating.org' }],
  creator: 'HealthRating.org',
  publisher: 'HealthRating.org',
  formatDetection: {
    telephone: false,
  },
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
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png', sizes: '512x512' }],
    apple: [{ url: '/icon.png', sizes: '512x512' }],
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
  maximumScale: 1,
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://healthrating.org/#website',
      url: 'https://healthrating.org',
      name: 'HealthRating.org',
      description:
        'The most comprehensive health scoring on the web: life expectancy, biological age, and disease risk from 14 research-backed assessments.',
      inLanguage: 'en',
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://healthrating.org/#app',
      name: 'HealthRating.org Health Score',
      url: 'https://healthrating.org',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description:
        '14 in-depth assessments covering 100+ life factors, each weighted by peer-reviewed research, computing your life expectancy, biological age, cardiovascular and diabetes risk, and carbon footprint.',
      featureList: [
        'Life expectancy estimate',
        'Biological age estimate',
        'Cardiovascular risk screen',
        'Type 2 diabetes risk screen (FINDRISC-adapted)',
        'Body composition analysis',
        'Carbon footprint calculator',
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://healthrating.org/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What does HealthRating.org calculate?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'HealthRating.org combines 14 in-depth assessments — body composition, diet, exercise, sleep, mental health, environment, family history, and more — into a single health score, plus estimates of your life expectancy, biological age, cardiovascular risk, and type 2 diabetes risk.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is HealthRating.org free and private?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. All assessments are free with no sign-up required, and your answers never leave your browser — nothing is sent to any server.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is the health score scientifically grounded?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Every factor is weighted using published, peer-reviewed research — over 60 studies including Chetty et al. 2016 (income and longevity), Holt-Lunstad 2010 (social connection), and the FINDRISC diabetes screening questionnaire. It is an educational tool, not a medical diagnosis.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is biological age different from life expectancy?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Life expectancy estimates how many years you may live based on your current habits and risk factors. Biological age expresses the same signal differently: whether your body is effectively younger or older than your calendar age.',
          },
        },
      ],
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
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  )
}
