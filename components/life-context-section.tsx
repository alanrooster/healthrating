"use client"

import { useState, useEffect } from "react"
import { Heart, Users, GraduationCap, Wallet, Sparkles, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  calculateLifeContext,
  type LifeContextAnswers,
  type LifeContextResult,
} from "@/lib/life-context-calculator"
import { getScoreColor } from "@/lib/health-score"

interface LifeContextSectionProps {
  onResult: (score: number) => void
  storedResult?: LifeContextResult | null
  onStoreResult?: (result: LifeContextResult) => void
  onRetake?: () => void
  storedInputs?: LifeContextAnswers | null
  onStoreInputs?: (inputs: LifeContextAnswers) => void
}

const DEFAULTS: LifeContextAnswers = {
  relationshipStatus: "single",
  relationshipQuality: "not-applicable",
  hasChildren: "none",
  closeConfidants: 2,
  educationLevel: "bachelor",
  incomeBracket: "middle",
  financialStress: "mild",
  financialLiteracy: "moderate",
  religiousAttendance: "rarely",
  spiritualPractice: "occasional",
  petOwnership: "none",
  volunteerHoursPerYear: 0,
  acesCount: 0,
}

const GROUPS: Array<{
  title: string
  description?: string
  icon: typeof Heart
  questions: Array<
    | {
        id: keyof LifeContextAnswers
        label: string
        type: "select"
        options: { value: string; label: string }[]
        description?: string
      }
    | {
        id: keyof LifeContextAnswers
        label: string
        type: "number"
        min: number
        max: number
        step?: number
        unit?: string
        description?: string
      }
  >
}> = [
  {
    title: "Relationships",
    description: "Robles 2014 meta-analysis: relationship quality matters more than status alone.",
    icon: Heart,
    questions: [
      {
        id: "relationshipStatus",
        label: "Current relationship status",
        type: "select",
        options: [
          { value: "married", label: "Married" },
          { value: "partnered", label: "Partnered / cohabiting" },
          { value: "dating", label: "Dating exclusively" },
          { value: "single", label: "Single" },
          { value: "separated", label: "Separated" },
          { value: "divorced", label: "Divorced" },
          { value: "widowed", label: "Widowed" },
        ],
      },
      {
        id: "relationshipQuality",
        label: "Quality of your closest romantic relationship",
        type: "select",
        options: [
          { value: "excellent", label: "Excellent" },
          { value: "good", label: "Good" },
          { value: "fair", label: "Fair" },
          { value: "poor", label: "Poor / distressed" },
          { value: "not-applicable", label: "Not applicable" },
        ],
      },
      {
        id: "closeConfidants",
        label: "Close confidants",
        description: "People you can discuss important personal matters with",
        type: "number",
        min: 0,
        max: 20,
        step: 1,
        unit: "people",
      },
    ],
  },
  {
    title: "Family & Children",
    icon: Users,
    questions: [
      {
        id: "hasChildren",
        label: "Number of children you've raised",
        description: "Modlin 2024: parents have ~5-10% lower mortality (U-shaped, optimum 2-3)",
        type: "select",
        options: [
          { value: "none", label: "None" },
          { value: "1", label: "1 child" },
          { value: "2-3", label: "2-3 children" },
          { value: "4+", label: "4 or more" },
        ],
      },
    ],
  },
  {
    title: "Education",
    description: "Balaj et al. 2024 (Lancet Public Health): each extra year of schooling lowers adult mortality risk by ~2%.",
    icon: GraduationCap,
    questions: [
      {
        id: "educationLevel",
        label: "Highest level of education completed",
        type: "select",
        options: [
          { value: "none", label: "No formal education" },
          { value: "primary", label: "Primary school" },
          { value: "secondary", label: "Secondary / high school" },
          { value: "vocational", label: "Vocational / trade certification" },
          { value: "bachelor", label: "Bachelor's degree" },
          { value: "master", label: "Master's degree" },
          { value: "doctorate", label: "Doctorate / professional" },
        ],
      },
    ],
  },
  {
    title: "Financial Wellbeing",
    description: "Chetty 2016 (JAMA): up to 14.6-year lifespan gap between top and bottom income deciles.",
    icon: Wallet,
    questions: [
      {
        id: "incomeBracket",
        label: "Household income relative to your country",
        type: "select",
        options: [
          { value: "very-low", label: "Bottom 20%" },
          { value: "low", label: "Lower-middle (20-40%)" },
          { value: "middle", label: "Middle (40-60%)" },
          { value: "upper-middle", label: "Upper-middle (60-80%)" },
          { value: "high", label: "Top 20%" },
        ],
      },
      {
        id: "financialStress",
        label: "Financial stress level",
        description: "Ryan 2014: high financial stress = +13% all-cause mortality",
        type: "select",
        options: [
          { value: "none", label: "None - comfortable" },
          { value: "mild", label: "Mild - some concerns" },
          { value: "moderate", label: "Moderate - regular worry" },
          { value: "high", label: "High - frequent stress" },
          { value: "severe", label: "Severe - struggling to cover basics" },
        ],
      },
      {
        id: "financialLiteracy",
        label: "Financial literacy",
        description: "Lusardi & Mitchell 'Big Three' proxy: comfort with interest, inflation, diversification",
        type: "select",
        options: [
          { value: "low", label: "Low - unsure about basic concepts" },
          { value: "basic", label: "Basic - know fundamentals" },
          { value: "moderate", label: "Moderate - manage budgeting & savings" },
          { value: "high", label: "High - confident with investing & planning" },
        ],
      },
    ],
  },
  {
    title: "Spirituality & Community",
    description: "Li et al. 2016 (JAMA Internal Medicine): attending services more than once a week = ~33% lower mortality.",
    icon: Sparkles,
    questions: [
      {
        id: "religiousAttendance",
        label: "Religious or spiritual community attendance",
        type: "select",
        options: [
          { value: "weekly", label: "Weekly or more" },
          { value: "monthly", label: "Monthly" },
          { value: "few-yearly", label: "A few times per year" },
          { value: "rarely", label: "Rarely" },
          { value: "never", label: "Never / not applicable" },
        ],
      },
      {
        id: "spiritualPractice",
        label: "Personal spiritual or contemplative practice",
        description: "Meditation, prayer, journaling, etc.",
        type: "select",
        options: [
          { value: "daily", label: "Daily" },
          { value: "weekly", label: "Weekly" },
          { value: "occasional", label: "Occasional" },
          { value: "none", label: "None" },
        ],
      },
      {
        id: "petOwnership",
        label: "Pet ownership",
        description: "Mubanga 2017: dog owners have ~24% lower mortality",
        type: "select",
        options: [
          { value: "dog", label: "Dog" },
          { value: "cat", label: "Cat" },
          { value: "other", label: "Other pet" },
          { value: "multiple", label: "Multiple pets" },
          { value: "none", label: "None" },
        ],
      },
      {
        id: "volunteerHoursPerYear",
        label: "Volunteer hours per year",
        description: "Kim 2020: 100+ hours/year = ~44% lower mortality",
        type: "number",
        min: 0,
        max: 1000,
        step: 10,
        unit: "hours",
      },
    ],
  },
  {
    title: "Early Life Experiences",
    description:
      "Adverse Childhood Experiences (ACEs) total - count any of: physical/emotional/sexual abuse, physical/emotional neglect, parental separation, household substance use, mental illness, domestic violence, or incarcerated household member. (Felitti 1998)",
    icon: ShieldAlert,
    questions: [
      {
        id: "acesCount",
        label: "Total ACEs reported",
        description: "Confidential and educational only. Range 0-10.",
        type: "number",
        min: 0,
        max: 10,
        step: 1,
        unit: "ACEs",
      },
    ],
  },
]

export function LifeContextSection({ onResult, storedResult, onStoreResult, onRetake, storedInputs, onStoreInputs }: LifeContextSectionProps) {
  const [answers, setAnswers] = useState<LifeContextAnswers>(storedInputs ?? DEFAULTS)
  const [result, setResult] = useState<LifeContextResult | null>(storedResult ?? null)

  useEffect(() => {
    onStoreInputs?.(answers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers])

  function update<K extends keyof LifeContextAnswers>(id: K, value: LifeContextAnswers[K]) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function handleCalculate() {
    const r = calculateLifeContext(answers)
    setResult(r)
    onStoreResult?.(r)
    onResult(r.overallScore)
  }

  function handleRetake() {
    setResult(null)
    onRetake?.()
  }

  if (result) {
    return <LifeContextResults result={result} onRetake={handleRetake} />
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Life Context & Relationships</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Social and economic context shapes longevity as much as biology. Privately reported, never shared.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {GROUPS.map((g) => {
            const Icon = g.icon
            return (
              <div key={g.title} className="flex flex-col gap-4 rounded-lg border border-border p-4">
                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-foreground">{g.title}</h3>
                    {g.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">{g.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {g.questions.map((q) => (
                    <div key={q.id} className="flex flex-col gap-2">
                      <Label className="text-foreground">{q.label}</Label>
                      {q.description && (
                        <p className="text-xs text-muted-foreground">{q.description}</p>
                      )}
                      {q.type === "select" ? (
                        <Select
                          value={String(answers[q.id])}
                          onValueChange={(v) => update(q.id, v as LifeContextAnswers[typeof q.id])}
                        >
                          <SelectTrigger className="max-w-md">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {q.options.map((o) => (
                              <SelectItem key={o.value} value={o.value}>
                                {o.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={q.min}
                            max={q.max}
                            step={q.step ?? 1}
                            value={Number(answers[q.id])}
                            onChange={(e) =>
                              update(q.id, Number(e.target.value) as LifeContextAnswers[typeof q.id])
                            }
                            className="max-w-[120px]"
                          />
                          {q.unit && <span className="text-sm text-muted-foreground">{q.unit}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          <Button onClick={handleCalculate} className="self-start">
            Calculate Life Context Score
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function LifeContextResults({ result, onRetake }: { result: LifeContextResult; onRetake: () => void }) {
  const { overallScore, subScores, protectiveFactors, riskFactors, recommendations } = result
  const isGood = overallScore >= 70

  const items = [
    { label: "Relationships", score: subScores.relationships },
    { label: "Family", score: subScores.family },
    { label: "Education", score: subScores.education },
    { label: "Socioeconomic", score: subScores.socioeconomic },
    { label: "Spirituality", score: subScores.spirituality },
    { label: "Community", score: subScores.community },
    { label: "Early Life", score: subScores.earlyLife },
  ]

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Life Context Score
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-6">
            <span className="text-5xl font-bold" style={{ color: getScoreColor(overallScore) }}>
              {overallScore}
            </span>
            <span className="text-sm text-muted-foreground">
              {isGood ? "Strong protective social and economic context" : "Areas of life context that may benefit from attention"}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {items.map((it) => (
              <div key={it.label} className="flex flex-col gap-1 rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{it.label}</span>
                  <span className="text-sm font-bold" style={{ color: getScoreColor(it.score) }}>
                    {it.score}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${it.score}%`, backgroundColor: getScoreColor(it.score) }}
                  />
                </div>
              </div>
            ))}
          </div>

          {protectiveFactors.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-foreground">Protective Factors</h3>
              {protectiveFactors.map((p, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--success))]" />
                  <span className="text-sm text-muted-foreground">{p}</span>
                </div>
              ))}
            </div>
          )}

          {riskFactors.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-foreground">Risk Factors</h3>
              {riskFactors.map((r, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />
                  <span className="text-sm text-muted-foreground">{r}</span>
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

          <Button variant="destructive" onClick={onRetake} className="w-full self-start sm:w-fit">
            Retake Assessment
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
