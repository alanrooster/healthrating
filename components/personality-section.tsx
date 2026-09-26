"use client"

import { useState, useEffect } from "react"
import { Smile, Sparkles, AlertTriangle, CheckCircle2, Laugh, Heart, Compass } from "lucide-react"
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
  calculatePersonality,
  type PersonalityAnswers,
  type PersonalityResult,
} from "@/lib/personality-calculator"
import { getScoreColor } from "@/lib/health-score"

interface PersonalitySectionProps {
  onResult: (score: number) => void
  storedResult?: PersonalityResult | null
  onStoreResult?: (result: PersonalityResult) => void
  onRetake?: () => void
  storedInputs?: PersonalityAnswers | null
  onStoreInputs?: (inputs: PersonalityAnswers) => void
}

const DEFAULTS: PersonalityAnswers = {
  optimism_expectBest: 3,
  optimism_expectWorst: 3,
  optimism_future: 3,
  optimism_rareGood: 3,
  consc_chores: 3,
  consc_disorganized: 3,
  consc_order: 3,
  consc_mess: 3,
  control_internal: 3,
  control_external: 3,
  forgiveness_others: "moderate",
  forgiveness_grudges: "sometimes",
  humor_laughFrequency: "weekly",
  humor_inDifficulty: "sometimes",
}

const LIKERT_OPTIONS = [
  { value: "1", label: "1 - Strongly disagree" },
  { value: "2", label: "2 - Disagree" },
  { value: "3", label: "3 - Neutral" },
  { value: "4", label: "4 - Agree" },
  { value: "5", label: "5 - Strongly agree" },
]

const FORGIVE_OTHERS_OPTIONS = [
  { value: "very-easily", label: "Very easily" },
  { value: "easily", label: "Easily" },
  { value: "moderate", label: "Moderate" },
  { value: "difficult", label: "Difficult" },
  { value: "very-difficult", label: "Very difficult" },
]

const FORGIVE_GRUDGE_OPTIONS = [
  { value: "never", label: "Never" },
  { value: "rarely", label: "Rarely" },
  { value: "sometimes", label: "Sometimes" },
  { value: "often", label: "Often" },
  { value: "always", label: "Always" },
]

const LAUGH_OPTIONS = [
  { value: "many-daily", label: "Many times a day" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "A few times a week" },
  { value: "monthly", label: "A few times a month" },
  { value: "rarely", label: "Rarely" },
]

const HUMOR_DIFFICULTY_OPTIONS = [
  { value: "always", label: "Always" },
  { value: "often", label: "Often" },
  { value: "sometimes", label: "Sometimes" },
  { value: "rarely", label: "Rarely" },
  { value: "never", label: "Never" },
]

type SelectQ =
  | { id: keyof PersonalityAnswers; label: string; type: "likert" }
  | {
      id: keyof PersonalityAnswers
      label: string
      type: "select"
      options: { value: string; label: string }[]
    }

const GROUPS: Array<{
  title: string
  description: string
  icon: typeof Smile
  questions: SelectQ[]
}> = [
  {
    title: "Optimism",
    description:
      "LOT-R short form. Lee 2019 (PNAS): top-quartile optimists live 11-15% longer with 50-70% greater odds of reaching age 85.",
    icon: Sparkles,
    questions: [
      { id: "optimism_expectBest", label: "In uncertain times, I usually expect the best.", type: "likert" },
      { id: "optimism_expectWorst", label: "If something can go wrong for me, it will.", type: "likert" },
      { id: "optimism_future", label: "I'm always optimistic about my future.", type: "likert" },
      { id: "optimism_rareGood", label: "I rarely count on good things happening to me.", type: "likert" },
    ],
  },
  {
    title: "Conscientiousness",
    description:
      "Mini-IPIP. Friedman & Kern 2014: high-conscientiousness adults live ~4 years longer on average.",
    icon: Compass,
    questions: [
      { id: "consc_chores", label: "I get chores done right away.", type: "likert" },
      { id: "consc_disorganized", label: "I often forget to put things back in their proper place.", type: "likert" },
      { id: "consc_order", label: "I like order.", type: "likert" },
      { id: "consc_mess", label: "I make a mess of things.", type: "likert" },
    ],
  },
  {
    title: "Sense of Control",
    description: "Internal locus of control predicts proactive health behaviors and lower mortality.",
    icon: Heart,
    questions: [
      { id: "control_internal", label: "What happens to me is mostly the result of my own actions.", type: "likert" },
      { id: "control_external", label: "Many things in my life are beyond my control.", type: "likert" },
    ],
  },
  {
    title: "Forgiveness",
    description: "Toussaint 2012: forgiveness associated with reduced mortality risk.",
    icon: Smile,
    questions: [
      {
        id: "forgiveness_others",
        label: "How easily do you forgive others who have wronged you?",
        type: "select",
        options: FORGIVE_OTHERS_OPTIONS,
      },
      {
        id: "forgiveness_grudges",
        label: "How often do you hold grudges?",
        type: "select",
        options: FORGIVE_GRUDGE_OPTIONS,
      },
    ],
  },
  {
    title: "Humor & Laughter",
    description: "Romundstad 2016 (HUNT, n=53k): high humor sense ~35% lower infection mortality.",
    icon: Laugh,
    questions: [
      {
        id: "humor_laughFrequency",
        label: "How often do you laugh out loud?",
        type: "select",
        options: LAUGH_OPTIONS,
      },
      {
        id: "humor_inDifficulty",
        label: "How often do you find humor in difficult situations?",
        type: "select",
        options: HUMOR_DIFFICULTY_OPTIONS,
      },
    ],
  },
]

export function PersonalitySection({ onResult, storedResult, onStoreResult, onRetake, storedInputs, onStoreInputs }: PersonalitySectionProps) {
  const [answers, setAnswers] = useState<PersonalityAnswers>(storedInputs ?? DEFAULTS)
  const [result, setResult] = useState<PersonalityResult | null>(storedResult ?? null)

  useEffect(() => {
    onStoreInputs?.(answers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers])

  function updateLikert(id: keyof PersonalityAnswers, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: Number(value) as 1 | 2 | 3 | 4 | 5 }))
  }

  function updateSelect(id: keyof PersonalityAnswers, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value as PersonalityAnswers[typeof id] }))
  }

  function handleCalculate() {
    const r = calculatePersonality(answers)
    setResult(r)
    onStoreResult?.(r)
    onResult(r.overallScore)
  }

  function handleRetake() {
    setResult(null)
    onRetake?.()
  }

  if (result) {
    return <PersonalityResults result={result} onRetake={handleRetake} />
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Smile className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Personality & Outlook</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Personality traits are partially modifiable and meaningfully predict longevity.
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
                    <p className="text-xs text-muted-foreground leading-relaxed">{g.description}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {g.questions.map((q) => (
                    <div key={q.id} className="flex flex-col gap-2">
                      <Label className="text-foreground">{q.label}</Label>
                      <Select
                        value={String(answers[q.id])}
                        onValueChange={(v) =>
                          q.type === "likert" ? updateLikert(q.id, v) : updateSelect(q.id, v)
                        }
                      >
                        <SelectTrigger className="max-w-md">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(q.type === "likert" ? LIKERT_OPTIONS : q.options).map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          <Button onClick={handleCalculate} className="self-start">
            Calculate Personality Score
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function PersonalityResults({ result, onRetake }: { result: PersonalityResult; onRetake: () => void }) {
  const { overallScore, subScores, strengths, growthAreas, recommendations } = result

  const items = [
    { label: "Optimism", score: subScores.optimism },
    { label: "Conscientiousness", score: subScores.conscientiousness },
    { label: "Sense of Control", score: subScores.locusOfControl },
    { label: "Forgiveness", score: subScores.forgiveness },
    { label: "Humor", score: subScores.humor },
  ]

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="h-5 w-5 text-primary" />
            Personality & Outlook Score
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-6">
            <span className="text-5xl font-bold" style={{ color: getScoreColor(overallScore) }}>
              {overallScore}
            </span>
            <span className="text-sm text-muted-foreground">
              {overallScore >= 70 ? "Strong protective psychological traits" : "Several traits where small changes pay off long-term"}
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

          {strengths.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-foreground">Strengths</h3>
              {strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--success))]" />
                  <span className="text-sm text-muted-foreground">{s}</span>
                </div>
              ))}
            </div>
          )}

          {growthAreas.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-foreground">Growth Areas</h3>
              {growthAreas.map((g, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />
                  <span className="text-sm text-muted-foreground">{g}</span>
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
