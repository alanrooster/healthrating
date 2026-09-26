"use client"

import { ArrowRight, LayoutDashboard, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { HealthScores } from "@/lib/health-score"

interface AssessmentNextStepsProps {
  activeSection: string
  scores: HealthScores
  onNavigate: (section: string) => void
  onRetake: () => void
}

const MODULES: { section: string; label: string }[] = [
  { section: "air", label: "Air Quality" },
  { section: "water", label: "Water Quality" },
  { section: "diet", label: "Diet Assessment" },
  { section: "exercise", label: "Exercise" },
  { section: "body", label: "Body Composition" },
  { section: "work", label: "Work" },
  { section: "lifestyle", label: "Lifestyle" },
  { section: "mental", label: "Mental Health" },
  { section: "family", label: "Family History" },
  { section: "preventive", label: "Preventive Care" },
  { section: "senses", label: "Senses & Oral Health" },
  { section: "lifecontext", label: "Life Context" },
  { section: "personality", label: "Personality & Outlook" },
  { section: "home", label: "Home Environment" },
]

const SCORE_KEYS: Record<string, keyof HealthScores> = {
  body: "body",
  air: "airQuality",
  water: "waterQuality",
  diet: "diet",
  exercise: "exercise",
  work: "work",
  lifestyle: "lifestyle",
  mental: "mentalHealth",
  family: "familyHistory",
  preventive: "preventiveCare",
  senses: "sensesOral",
  lifecontext: "lifeContext",
  personality: "personality",
  home: "homeEnvironment",
}

export function AssessmentNextSteps({
  activeSection,
  scores,
  onNavigate,
  onRetake,
}: AssessmentNextStepsProps) {
  const scoreKey = SCORE_KEYS[activeSection]
  if (!scoreKey || !scores[scoreKey].completed) return null

  const currentIndex = MODULES.findIndex((module) => module.section === activeSection)
  const nextModule = MODULES[currentIndex + 1]

  return (
    <Card className="mt-6 border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">What do you want to do next?</CardTitle>
        <CardDescription>
          Your assessment is saved. You can review your overall results or keep going.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {nextModule && (
          <Button
            className="min-h-12 w-full sm:w-auto"
            onClick={() => onNavigate(nextModule.section)}
          >
            Go to next module: {nextModule.label}
            <ArrowRight data-icon="inline-end" />
          </Button>
        )}
        <Button
          variant="outline"
          className="min-h-12 w-full border-primary/30 bg-background sm:w-auto"
          onClick={() => onNavigate("dashboard")}
        >
          <LayoutDashboard data-icon="inline-start" />
          Check results in dashboard
        </Button>
        <Button
          variant="outline"
          className="min-h-12 w-full border-destructive/50 bg-background text-destructive hover:border-destructive hover:bg-destructive hover:text-destructive-foreground sm:w-auto"
          onClick={onRetake}
          data-retake-button
        >
          <RotateCcw data-icon="inline-start" />
          Retake Assessment
        </Button>
      </CardContent>
    </Card>
  )
}
