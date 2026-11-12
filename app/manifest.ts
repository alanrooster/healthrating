import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HealthRating.org — Comprehensive Health Scoring',
    short_name: 'HealthRating',
    description:
      'Discover your life expectancy, biological age, and disease risks with 14 research-backed assessments. Free, private, no sign-up.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2f9e7f',
    categories: ['health', 'fitness', 'lifestyle'],
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
