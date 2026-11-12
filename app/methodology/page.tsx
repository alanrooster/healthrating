import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { JsonLd } from "@/components/json-ld"
import { MethodologySection } from "@/components/methodology-section"
import { SiteFooter } from "@/components/site-footer"

const TITLE = "Methodology & Sources"
const DESCRIPTION =
  "How HealthRating.org scores each of its 14 assessments and estimates life expectancy, biological age, cardiovascular health and diabetes, dementia and cancer risk, with every formula explained and every source cited."
const URL = "https://healthrating.org/methodology"
// Update when the scoring or its sources change
const LAST_REVIEWED = "2026-11-12"

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: `${TITLE} | HealthRating.org`,
    description: DESCRIPTION,
    url: URL,
    siteName: "HealthRating.org",
    type: "article",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HealthRating.org — comprehensive health scoring: life expectancy, biological age, and disease risk",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | HealthRating.org`,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${URL}#webpage`,
  url: URL,
  name: TITLE,
  description: DESCRIPTION,
  isPartOf: { "@id": "https://healthrating.org/#website" },
  inLanguage: "en",
  dateModified: LAST_REVIEWED,
}

const lastReviewedLabel = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(LAST_REVIEWED))

export default function MethodologyPage() {
  return (
    <div className="min-h-svh bg-background">
      <JsonLd data={structuredData} />
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-4 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Heart aria-hidden="true" className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="font-mono text-sm font-bold text-foreground">healthrating.org</span>
          </Link>
          <Button asChild size="sm">
            <Link href="/">
              Open the app
              <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl p-4 md:p-6">
        <MethodologySection />
        <p className="mt-6 text-xs text-muted-foreground">
          Last reviewed: <time dateTime={LAST_REVIEWED}>{lastReviewedLabel}</time>. Educational estimates
          based on population-level research: not medical advice, and no substitute for a healthcare
          professional.
        </p>
        <SiteFooter />
      </main>
    </div>
  )
}
