import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Mono } from 'next/font/google'

import './globals.css'

const _inter = Inter({ subsets: ['latin'] })
const _spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://healthrating.org'),
  title: 'HealthRating.org — The Most Comprehensive Health Score on the Web',
  description:
    'Discover your life expectancy, biological age, and disease risks with 14 in-depth assessments covering 100+ life factors, each weighted by peer-reviewed research. Free, private, no sign-up.',
  openGraph: {
    title: 'HealthRating.org — The Most Comprehensive Health Score on the Web',
    description:
      'Life expectancy, biological age, and disease risk screens from 14 in-depth assessments grounded in 60+ peer-reviewed studies. Free and private.',
    url: 'https://healthrating.org',
    siteName: 'HealthRating.org',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#2f9e7f',
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
