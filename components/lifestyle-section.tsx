"use client"

import { useState } from "react"
import {
  Briefcase,
  Moon,
  Clock,
  Users,
  Cigarette,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  calculateLifestyle,
  type LifestyleAnswers,
  type LifestyleResult,
} from "@/lib/lifestyle-calculator"
import { getScoreColor } from "@/lib/health-score"

interface LifestyleSectionProps {
  onResult: (score: number) => void
}

const DEFAULT_ANSWERS: LifestyleAnswers = {
  workingHoursPerDay: 8,
  daysPerWeek: 5,
  shiftType: "day",
  yearsOfShiftWork: 0,
  sleepHoursPerNight: 7,
  sleepQuality: "good",
  sleepDifficulty: "rarely",
  workExhaustion: "sometimes",
  workOverwhelm: "sometimes",
  effortRewardBalance: "fairly-rewarded",
  socialFrequency: "weekly",
  workLifeBalance: "good",
  screenTimeHours: 3,
  smokingStatus: "never",
  alcoholFrequency: "monthly",
}

interface QuestionGroup {
  title: string
  icon: React.ComponentType<{ className?: string }>
  questions: QuestionDef[]
}

interface QuestionDef {
  id: keyof LifestyleAnswers
  label: string
  description?: string
  type: "number" | "select"
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  step?: number
  unit?: string
}

const QUESTION_GROUPS: QuestionGroup[] = [
  {
    title: "Work Schedule",
    icon: Briefcase,
    questions: [
      {
        id: "workingHoursPerDay",
        label: "Working hours per day",
        description: "Average hours spent working each day",
        type: "number",
        min: 0,
        max: 18,
        step: 0.5,
        unit: "hours",
      },
      {
        id: "daysPerWeek",
        label: "Working days per week",
        type: "number",
        min: 0,
        max: 7,
        step: 1,
        unit: "days",
      },
      {
        id: "shiftType",
        label: "Shift type",
        description: "What type of work schedule do you have?",
        type: "select",
        options: [
          { value: "day", label: "Day shift (regular hours)" },
          { value: "rotating", label: "Rotating shifts" },
          { value: "night", label: "Permanent night shift" },
          { value: "not-working", label: "Not currently working" },
        ],
      },
      {
        id: "yearsOfShiftWork",
        label: "Years of shift/night work",
        description: "Total years spent doing shift or night work",
        type: "number",
        min: 0,
        max: 50,
        step: 1,
        unit: "years",
      },
    ],
  },
  {
    title: "Sleep",
    icon: Moon,
    questions: [
      {
        id: "sleepHoursPerNight",
        label: "Hours of sleep per night",
        description: "WHO recommends 7-9 hours for adults",
        type: "number",
        min: 0,
        max: 14,
        step: 0.5,
        unit: "hours",
      },
      {
        id: "sleepQuality",
        label: "Overall sleep quality",
        description: "How would you rate your sleep quality over the past month?",
        type: "select",
        options: [
          { value: "very-good", label: "Very good" },
          { value: "good", label: "Good" },
          { value: "fair", label: "Fair" },
          { value: "poor", label: "Poor" },
          { value: "very-poor", label: "Very poor" },
        ],
      },
      {
        id: "sleepDifficulty",
        label: "Difficulty falling or staying asleep",
        description: "How often do you have trouble falling asleep or staying asleep?",
        type: "select",
        options: [
          { value: "never", label: "Never" },
          { value: "rarely", label: "Rarely" },
          { value: "sometimes", label: "Sometimes" },
          { value: "often", label: "Often" },
          { value: "always", label: "Always" },
        ],
      },
    ],
  },
  {
    title: "Work Stress",
    icon: Clock,
    questions: [
      {
        id: "workExhaustion",
        label: "How often do you feel exhausted from work?",
        description: "Inspired by the Copenhagen Burnout Inventory",
        type: "select",
        options: [
          { value: "never", label: "Never" },
          { value: "rarely", label: "Rarely" },
          { value: "sometimes", label: "Sometimes" },
          { value: "often", label: "Often" },
          { value: "always", label: "Always" },
        ],
      },
      {
        id: "workOverwhelm",
        label: "How often do you feel overwhelmed by your workload?",
        type: "select",
        options: [
          { value: "never", label: "Never" },
          { value: "rarely", label: "Rarely" },
          { value: "sometimes", label: "Sometimes" },
          { value: "often", label: "Often" },
          { value: "always", label: "Always" },
        ],
      },
      {
        id: "effortRewardBalance",
        label: "How well does your effort match your rewards?",
        description: "Based on Siegrist Effort-Reward Imbalance model",
        type: "select",
        options: [
          { value: "well-rewarded", label: "Well rewarded" },
          { value: "fairly-rewarded", label: "Fairly rewarded" },
          { value: "neutral", label: "Neutral" },
          { value: "under-rewarded", label: "Under-rewarded" },
          { value: "very-under-rewarded", label: "Very under-rewarded" },
        ],
      },
    ],
  },
  {
    title: "Social & Work-Life Balance",
    icon: Users,
    questions: [
      {
        id: "socialFrequency",
        label: "How often do you socialize (family/friends)?",
        description: "Holt-Lunstad research: social isolation significantly impacts health",
        type: "select",
        options: [
          { value: "daily", label: "Daily" },
          { value: "several-weekly", label: "Several times a week" },
          { value: "weekly", label: "Weekly" },
          { value: "monthly", label: "Monthly" },
          { value: "rarely", label: "Rarely or never" },
        ],
      },
      {
        id: "workLifeBalance",
        label: "How would you rate your work-life balance?",
        type: "select",
        options: [
          { value: "excellent", label: "Excellent" },
          { value: "good", label: "Good" },
          { value: "fair", label: "Fair" },
          { value: "poor", label: "Poor" },
          { value: "very-poor", label: "Very poor" },
        ],
      },
      {
        id: "screenTimeHours",
        label: "Recreational screen time per day",
        description: "Non-work screen time (social media, TV, gaming)",
        type: "number",
        min: 0,
        max: 16,
        step: 0.5,
        unit: "hours",
      },
    ],
  },
  {
    title: "Habits",
    icon: Cigarette,
    questions: [
      {
        id: "smokingStatus",
        label: "Smoking status",
        type: "select",
        options: [
          { value: "never", label: "Never smoked" },
          { value: "former", label: "Former smoker" },
          { value: "occasional", label: "Occasional smoker" },
          { value: "daily", label: "Daily smoker" },
        ],
      },
      {
        id: "alcoholFrequency",
        label: "Alcohol consumption frequency",
        description: "WHO: no level of alcohol consumption is safe for health",
        type: "select",
        options: [
          { value: "never", label: "Never" },
          { value: "monthly", label: "Monthly or less" },
          { value: "weekly", label: "Weekly" },
          { value: "several-weekly", label: "Several times a week" },
          { value: "daily", label: "Daily" },
        ],
      },
    ],
  },
]

export function LifestyleSection({ onResult }: LifestyleSectionProps) {
  const [answers, setAnswers] = useState<LifestyleAnswers>(DEFAULT_ANSWERS)
  const [result, setResult] = useState<LifestyleResult | null>(null)
  const [currentGroup, setCurrentGroup] = useState(0)

  function updateAnswer(id: keyof LifestyleAnswers, value: string | number) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function handleNext() {
    if (currentGroup < QUESTION_GROUPS.length - 1) {
      setCurrentGroup((prev) => prev + 1)
    }
  }

  function handlePrev() {
    if (currentGroup > 0) {
      setCurrentGroup((prev) => prev - 1)
    }
  }

  function handleCalculate() {
    const r = calculateLifestyle(answers)
    setResult(r)
    onResult(r.overallScore)
  }

  function handleReset() {
    setAnswers(DEFAULT_ANSWERS)
    setResult(null)
    setCurrentGroup(0)
  }

  const isLastGroup = currentGroup === QUESTION_GROUPS.length - 1
  const group = QUESTION_GROUPS[currentGroup]
  const GroupIcon = group.icon

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Lifestyle Assessment
        </h1>
        <p className="text-sm text-muted-foreground">
          Based on WHO/ILO occupational health guidelines, Copenhagen Burnout
          Inventory, and validated sleep/social health research.
        </p>
      </div>

      {!result ? (
        <>
          {/* Progress indicator */}
          <div className="flex items-center gap-1">
            {QUESTION_GROUPS.map((g, i) => (
              <button
                key={g.title}
                type="button"
                onClick={() => setCurrentGroup(i)}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= currentGroup ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <GroupIcon className="h-5 w-5 text-primary" />
                {group.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Section {currentGroup + 1} of {QUESTION_GROUPS.length}
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {group.questions.map((q) => (
                <div key={q.id} className="flex flex-col gap-1.5">
                  <Label className="text-sm text-foreground">{q.label}</Label>
                  {q.description && (
                    <p className="text-xs text-muted-foreground">{q.description}</p>
                  )}
                  {q.type === "number" ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={answers[q.id] as number}
                        onChange={(e) =>
                          updateAnswer(
                            q.id,
                            Math.max(
                              q.min ?? 0,
                              Math.min(q.max ?? 999, Number.parseFloat(e.target.value) || 0)
                            )
                          )
                        }
                        min={q.min}
                        max={q.max}
                        step={q.step}
                        className="w-28"
                      />
                      {q.unit && (
                        <span className="text-sm text-muted-foreground">{q.unit}</span>
                      )}
                    </div>
                  ) : (
                    <Select
                      value={answers[q.id] as string}
                      onValueChange={(val) => updateAnswer(q.id, val)}
                    >
                      <SelectTrigger className="w-full max-w-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {q.options?.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            {currentGroup > 0 && (
              <Button variant="outline" onClick={handlePrev}>
                Previous
              </Button>
            )}
            {!isLastGroup ? (
              <Button onClick={handleNext} className="gap-1">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleCalculate} size="lg">
                Calculate Lifestyle Score
              </Button>
            )}
          </div>
        </>
      ) : (
        <LifestyleResults result={result} onReset={handleReset} />
      )}
    </div>
  )
}

function LifestyleResults({
  result,
  onReset,
}: {
  result: LifestyleResult
  onReset: () => void
}) {
  const { overallScore, subScores, riskFactors, recommendations } = result

  const subScoreItems = [
    { label: "Work Schedule", score: subScores.workSchedule, icon: Briefcase },
    { label: "Sleep", score: subScores.sleep, icon: Moon },
    { label: "Work Stress", score: subScores.workStress, icon: Clock },
    { label: "Social & Balance", score: subScores.socialBalance, icon: Users },
    { label: "Habits", score: subScores.habits, icon: Cigarette },
  ]

  const category =
    overallScore >= 85
      ? "Excellent"
      : overallScore >= 70
        ? "Good"
        : overallScore >= 55
          ? "Moderate"
          : overallScore >= 35
            ? "Poor"
            : "Critical"

  return (
    <div className="flex flex-col gap-4">
      {/* Score Banner */}
      <Card className="overflow-hidden">
        <div
          className="p-6"
          style={{ backgroundColor: getScoreColor(overallScore), color: "#fff" }}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-3">
              <Briefcase className="h-8 w-8" />
              <span className="text-5xl font-bold">{overallScore}</span>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium opacity-80">/ 100</span>
                <span className="text-lg font-semibold">{category}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Sub-scores */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">
            Sub-Scores
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {subScoreItems.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: getScoreColor(item.score) }}
                  >
                    {item.score}/100
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${item.score}%`,
                      backgroundColor: getScoreColor(item.score),
                    }}
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Risk Factors */}
      {riskFactors.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <AlertTriangle className="h-5 w-5 text-[hsl(var(--accent))]" />
              Identified Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {riskFactors.map((risk, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--accent))]" />
                  {risk}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2">
            {recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--success))]" />
                {rec}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Button variant="outline" onClick={onReset} className="self-start">
        Retake Assessment
      </Button>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Based on WHO/ILO Joint Estimates on working hours (2021), IARC Monograph
        124 on night shift work (2019), Copenhagen Burnout Inventory (Kristensen
        et al. 2005), Effort-Reward Imbalance model (Siegrist 1996), PSQI sleep
        scoring, and Holt-Lunstad social connection meta-analyses (2010, 2015).
      </p>
    </div>
  )
}
