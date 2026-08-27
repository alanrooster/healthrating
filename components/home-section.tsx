"use client"

import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  ClipboardList,
  Dna,
  HeartPulse,
  Hourglass,
  Leaf,
  LockKeyhole,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface HomeSectionProps {
  completedCount: number
  totalCount: number
  onNavigate: (section: string) => void
}

const HIGHLIGHTS = [
  {
    icon: Hourglass,
    title: "Life Expectancy",
    description:
      "A personalized estimate built from WHO baselines and peer-reviewed adjustments for every factor you assess.",
  },
  {
    icon: HeartPulse,
    title: "Biological Age",
    description:
      "See whether your body is trending younger or older than your calendar age, and what moves the needle.",
  },
  {
    icon: Activity,
    title: "Disease Risk Screens",
    description:
      "Evidence-based cardiovascular and type 2 diabetes screens, computed from data you already entered.",
  },
  {
    icon: Leaf,
    title: "Carbon Footprint",
    description:
      "Your lifestyle answers double as a personal CO2 estimate, connecting your health to the planet's.",
  },
]

const STEPS = [
  {
    icon: ClipboardList,
    title: "Answer simple questions",
    description:
      "14 short assessments cover your body, environment, habits, mind, history, and circumstances. No lab tests or devices needed.",
  },
  {
    icon: BarChart3,
    title: "Watch your dashboard build",
    description:
      "Every completed module sharpens your overall score, life expectancy, biological age, and risk screens in real time.",
  },
  {
    icon: Sparkles,
    title: "Act on what matters most",
    description:
      "A prioritized action plan shows which changes buy you the most healthy years, ranked by scientific impact.",
  },
]

export function HomeSection({ completedCount, totalCount, onNavigate }: HomeSectionProps) {
  const hasStarted = completedCount > 0

  return (
    <div className="flex flex-col gap-12 py-4">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 text-center">
        <p className="font-mono text-sm font-bold tracking-wide text-primary">
          healthrating.org
        </p>
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-foreground">
          <Dna className="h-3.5 w-3.5 text-primary" />
          <span>The most accurate &amp; comprehensive health scoring on the web</span>
        </div>
        <h1 className="max-w-2xl text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
          Understand the years ahead of you
        </h1>
        <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          14 in-depth assessments, 100+ life factors, every one weighted by
          peer-reviewed research — distilled into a clear picture of your life
          expectancy, biological age, and the levers you control.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button size="lg" onClick={() => onNavigate(hasStarted ? "dashboard" : "air")}>
            {hasStarted ? "Continue your assessment" : "Start your assessment"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => onNavigate("dashboard")}>
            View dashboard
          </Button>
        </div>
        {hasStarted && (
          <p className="text-sm text-muted-foreground">
            {completedCount} of {totalCount} assessments completed
          </p>
        )}
      </section>

      {/* Why this is different */}
      <section
        className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4"
        aria-label="What sets healthrating.org apart"
      >
        {[
          { value: "14", label: "In-depth assessments" },
          { value: "100+", label: "Life factors analyzed" },
          { value: "60+", label: "Peer-reviewed studies" },
          { value: "0", label: "Data sent to servers" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1 bg-card px-4 py-6 text-center">
            <span className="font-mono text-3xl font-bold text-primary">{stat.value}</span>
            <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* What you get */}
      <section className="flex flex-col gap-5" aria-labelledby="highlights-heading">
        <h2 id="highlights-heading" className="text-center text-2xl font-semibold text-foreground">
          What you&apos;ll discover
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {HIGHLIGHTS.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.title}>
                <CardContent className="flex flex-col gap-3 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="flex flex-col gap-5" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="text-center text-2xl font-semibold text-foreground">
          How it works
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Trust strip */}
      <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">Your data never leaves your browser</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Everything is stored locally on your device. No accounts, no servers, no tracking.
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="shrink-0 self-start md:self-auto"
          onClick={() => onNavigate("methodology")}
        >
          <BookOpenCheck className="mr-2 h-4 w-4" />
          Read the methodology
        </Button>
      </section>

      {/* Disclaimer */}
      <p className="mx-auto max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
        This tool provides educational estimates based on population-level research. It is
        not medical advice and does not replace consultation with a healthcare professional.
      </p>
    </div>
  )
}
