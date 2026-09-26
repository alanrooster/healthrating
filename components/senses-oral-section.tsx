"use client"

import { useState, useEffect } from "react"
import { Eye, Ear, Smile, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  calculateSensesOral,
  type SensesOralAnswers,
  type SensesOralResult,
} from "@/lib/senses-oral-calculator"
import { getScoreColor } from "@/lib/health-score"

interface SensesOralSectionProps {
  onResult: (score: number) => void
  storedResult?: SensesOralResult | null
  onStoreResult?: (result: SensesOralResult) => void
  onRetake?: () => void
  storedInputs?: SensesOralAnswers | null
  onStoreInputs?: (inputs: SensesOralAnswers) => void
}

const DEFAULT_ANSWERS: SensesOralAnswers = {
  hearingDifficulty: "none",
  hearingTested: "1-3-yr",
  hearingAids: "not-needed",
  noiseExposure: "moderate",
  visionCorrection: "corrected",
  eyeStrain: "rarely",
  lastEyeExam: "1-2-yr",
  brushingFrequency: "twice-daily",
  flossingFrequency: "weekly",
  gumBleeding: "rarely",
  toothCount: "all",
  toothPain: "rarely",
}

type SectionDef = {
  title: string
  icon: typeof Ear
  questions: { id: keyof SensesOralAnswers; label: string; options: { value: string; label: string }[] }[]
}

const SECTIONS: SectionDef[] = [
  {
    title: "Hearing",
    icon: Ear,
    questions: [
      {
        id: "hearingDifficulty",
        label: "Difficulty hearing in conversation",
        options: [
          { value: "none", label: "None - hearing is clear" },
          { value: "mild", label: "Mild - sometimes ask to repeat" },
          { value: "moderate", label: "Moderate - often miss words" },
          { value: "severe", label: "Severe - struggle without aids" },
        ],
      },
      {
        id: "hearingTested",
        label: "Last hearing test",
        options: [
          { value: "recently", label: "Within the last year" },
          { value: "1-3-yr", label: "1-3 years ago" },
          { value: "3+yr", label: "More than 3 years ago" },
          { value: "never", label: "Never had a formal test" },
        ],
      },
      {
        id: "hearingAids",
        label: "Hearing aids",
        options: [
          { value: "not-needed", label: "Not needed" },
          { value: "wears", label: "I wear them as recommended" },
          { value: "needs-but-no", label: "Recommended but I don't use them" },
        ],
      },
      {
        id: "noiseExposure",
        label: "Chronic loud noise exposure",
        options: [
          { value: "low", label: "Low - mostly quiet environments" },
          { value: "moderate", label: "Moderate - occasional loud settings" },
          { value: "high", label: "High - frequently loud (industrial, music, etc.)" },
        ],
      },
    ],
  },
  {
    title: "Vision",
    icon: Eye,
    questions: [
      {
        id: "visionCorrection",
        label: "Vision quality",
        options: [
          { value: "perfect", label: "Perfect - no correction needed" },
          { value: "corrected", label: "Corrected (glasses/contacts work well)" },
          { value: "blurry-with-correction", label: "Blurry even with correction" },
          { value: "uncorrected-impairment", label: "Impaired and uncorrected" },
        ],
      },
      {
        id: "eyeStrain",
        label: "Eye strain or fatigue",
        options: [
          { value: "never", label: "Never" },
          { value: "rarely", label: "Rarely" },
          { value: "frequently", label: "Frequently" },
          { value: "constantly", label: "Constantly" },
        ],
      },
      {
        id: "lastEyeExam",
        label: "Last comprehensive eye exam",
        options: [
          { value: "0-1-yr", label: "Within the last year" },
          { value: "1-2-yr", label: "1-2 years ago" },
          { value: "2-5-yr", label: "2-5 years ago" },
          { value: "5+yr", label: "More than 5 years ago" },
          { value: "never", label: "Never" },
        ],
      },
    ],
  },
  {
    title: "Oral Health",
    icon: Smile,
    questions: [
      {
        id: "brushingFrequency",
        label: "Brushing frequency",
        options: [
          { value: "twice-daily", label: "Twice daily or more" },
          { value: "daily", label: "Once daily" },
          { value: "less-than-daily", label: "Less than daily" },
        ],
      },
      {
        id: "flossingFrequency",
        label: "Flossing frequency",
        options: [
          { value: "daily", label: "Daily" },
          { value: "weekly", label: "A few times a week" },
          { value: "rarely", label: "Rarely" },
          { value: "never", label: "Never" },
        ],
      },
      {
        id: "gumBleeding",
        label: "Gum bleeding when brushing or flossing",
        options: [
          { value: "never", label: "Never" },
          { value: "rarely", label: "Rarely" },
          { value: "sometimes", label: "Sometimes" },
          { value: "often", label: "Often" },
        ],
      },
      {
        id: "toothCount",
        label: "Natural teeth",
        options: [
          { value: "all", label: "All natural teeth (or full set with implants)" },
          { value: "missing-1-3", label: "Missing 1-3 teeth" },
          { value: "missing-4-10", label: "Missing 4-10 teeth" },
          { value: "missing-many", label: "Missing many teeth" },
          { value: "edentulous", label: "No natural teeth" },
        ],
      },
      {
        id: "toothPain",
        label: "Tooth or jaw pain",
        options: [
          { value: "never", label: "Never" },
          { value: "rarely", label: "Rarely" },
          { value: "sometimes", label: "Sometimes" },
          { value: "often", label: "Often" },
        ],
      },
    ],
  },
]

export function SensesOralSection({ onResult, storedResult, onStoreResult, onRetake, storedInputs, onStoreInputs }: SensesOralSectionProps) {
  const [answers, setAnswers] = useState<SensesOralAnswers>(storedInputs ?? DEFAULT_ANSWERS)
  const [result, setResult] = useState<SensesOralResult | null>(storedResult ?? null)

  useEffect(() => {
    onStoreInputs?.(answers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers])

  function update(id: keyof SensesOralAnswers, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value as SensesOralAnswers[typeof id] }))
  }

  function handleCalculate() {
    const r = calculateSensesOral(answers)
    setResult(r)
    onStoreResult?.(r)
    onResult(r.overallScore)
  }

  function handleRetake() {
    setResult(null)
    onRetake?.()
  }

  if (result) {
    return <SensesOralResults result={result} onRetake={handleRetake} />
  }

  return (
    <div className="flex flex-col gap-6">
      {SECTIONS.map((section) => {
        const Icon = section.icon
        return (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {section.questions.map((q) => (
                <div key={q.id} className="flex flex-col gap-2">
                  <Label className="text-foreground">{q.label}</Label>
                  <Select value={answers[q.id]} onValueChange={(v) => update(q.id, v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {q.options.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}
      <Button onClick={handleCalculate} className="self-start">
        Assess Senses & Oral Health
      </Button>
    </div>
  )
}

function SensesOralResults({ result, onRetake }: { result: SensesOralResult; onRetake: () => void }) {
  const { overallScore, subScores, flags, recommendations } = result
  const isGood = overallScore >= 75

  const subItems = [
    { label: "Hearing", score: subScores.hearing, icon: Ear },
    { label: "Vision", score: subScores.vision, icon: Eye },
    { label: "Oral Health", score: subScores.oral, icon: Smile },
  ]

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Senses & Oral Health Score</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-6">
            <span className="text-5xl font-bold" style={{ color: getScoreColor(overallScore) }}>
              {overallScore}
            </span>
            <span className="text-sm text-muted-foreground">
              {isGood ? "Senses and oral health are well-supported" : "Some areas warrant attention"}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {subItems.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex flex-col gap-2 rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </div>
                  <span className="text-2xl font-bold" style={{ color: getScoreColor(item.score) }}>
                    {item.score}
                  </span>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.score}%`, backgroundColor: getScoreColor(item.score) }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {flags.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-foreground">Clinical Notes</h3>
              {flags.map((f, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />
                  <span className="text-sm text-muted-foreground">{f}</span>
                </div>
              ))}
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-foreground">Recommendations</h3>
              {recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">{r}</span>
                </div>
              ))}
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
