"use client"

import { useState } from "react"
import {
  Moon,
  Users,
  Tv,
  Cigarette,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  TreePine,
  Armchair,
  Sun,
  Car,
  Flame,
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
  onResult: (score: number, lifestyleExtras?: { smokingStatus: string; alcoholFrequency: string; alcoholUnitsPerSession: number }) => void
  storedResult?: LifestyleResult | null
  onStoreResult?: (result: LifestyleResult) => void
  onRetake?: () => void
}

const DEFAULT_ANSWERS: LifestyleAnswers = {
  sleepHoursPerNight: 7,
  sleepQuality: "good",
  sleepDifficulty: "rarely",
  sleepScheduleConsistency: "consistent",
  sleepLatencyMinutes: 15,
  daytimeDysfunction: "rarely",
  socialFrequency: "weekly",
  qualityRelationships: "good",
  lonelinessFrequency: "rarely",
  screenTimeHours: 3,
  outdoorTimeMinutes: 30,
  hobbiesEngagement: "weekly",
  sittingHoursPerDay: 6,
  sedentaryBreaks: "sometimes",
  sunExposureMinutes: 20,
  sunscreenUse: "sometimes",
  sunburnsPerYear: 0,
  commuteMinutesOneWay: 20,
  saunaSessionsPerWeek: 0,
  smokingStatus: "never",
  alcoholFrequency: "monthly",
  alcoholUnitsPerSession: 2,
  caffeineConsumption: "moderate",
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
      {
        id: "sleepScheduleConsistency",
        label: "Sleep schedule consistency",
        description: "How consistent is your sleep/wake time?",
        type: "select",
        options: [
          { value: "very-consistent", label: "Very consistent (same time daily)" },
          { value: "consistent", label: "Mostly consistent" },
          { value: "somewhat", label: "Somewhat variable" },
          { value: "inconsistent", label: "Inconsistent" },
          { value: "very-inconsistent", label: "Very irregular" },
        ],
      },
      {
        id: "sleepLatencyMinutes",
        label: "Time to fall asleep",
        description: "PSQI: typical minutes from lying down to falling asleep",
        type: "number",
        min: 0,
        max: 180,
        step: 5,
        unit: "minutes",
      },
      {
        id: "daytimeDysfunction",
        label: "Daytime sleepiness or low motivation",
        description: "How often do you struggle to stay awake or feel low energy during the day?",
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
    title: "Social Connection",
    icon: Users,
    questions: [
      {
        id: "socialFrequency",
        label: "How often do you socialize (family/friends)?",
        description: "In-person or meaningful video calls count",
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
        id: "qualityRelationships",
        label: "Quality of your close relationships",
        description: "How supportive and fulfilling are your relationships?",
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
        id: "lonelinessFrequency",
        label: "How often do you feel lonely?",
        description: "Feeling isolated or lacking companionship",
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
    title: "Leisure & Balance",
    icon: TreePine,
    questions: [
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
      {
        id: "outdoorTimeMinutes",
        label: "Daily outdoor/nature time",
        description: "Time spent outside, in parks, or natural settings",
        type: "number",
        min: 0,
        max: 480,
        step: 15,
        unit: "minutes",
      },
      {
        id: "hobbiesEngagement",
        label: "Engagement in hobbies/leisure activities",
        description: "Activities you enjoy outside of work and screens",
        type: "select",
        options: [
          { value: "daily", label: "Daily" },
          { value: "several-weekly", label: "Several times a week" },
          { value: "weekly", label: "Weekly" },
          { value: "monthly", label: "Monthly" },
          { value: "rarely", label: "Rarely or never" },
        ],
      },
    ],
  },
  {
    title: "Sedentary Time",
    icon: Armchair,
    questions: [
      {
        id: "sittingHoursPerDay",
        label: "Total sitting hours per day",
        description: "Including work, commuting, meals, and relaxation. Independent mortality risk factor.",
        type: "number",
        min: 0,
        max: 18,
        step: 0.5,
        unit: "hours",
      },
      {
        id: "sedentaryBreaks",
        label: "How often do you break up sitting time?",
        description: "Standing up or moving every 30-60 minutes",
        type: "select",
        options: [
          { value: "frequently", label: "Frequently (every 30-60 min)" },
          { value: "sometimes", label: "Sometimes (every 1-2 hours)" },
          { value: "rarely", label: "Rarely (only on breaks)" },
          { value: "never", label: "Never (sit for hours straight)" },
        ],
      },
    ],
  },
  {
    title: "Sun Exposure",
    icon: Sun,
    questions: [
      {
        id: "sunExposureMinutes",
        label: "Daily direct sun exposure",
        description: "Sweet spot is 10-30 min for vitamin D synthesis",
        type: "number",
        min: 0,
        max: 360,
        step: 5,
        unit: "minutes",
      },
      {
        id: "sunscreenUse",
        label: "Sunscreen use when outdoors",
        description: "Especially important for extended exposure (15+ min)",
        type: "select",
        options: [
          { value: "always", label: "Always" },
          { value: "usually", label: "Usually" },
          { value: "sometimes", label: "Sometimes" },
          { value: "rarely", label: "Rarely" },
          { value: "never", label: "Never" },
        ],
      },
      {
        id: "sunburnsPerYear",
        label: "Average sunburns per year",
        description: "Each blistering sunburn raises melanoma risk",
        type: "number",
        min: 0,
        max: 20,
        step: 1,
        unit: "burns",
      },
    ],
  },
  {
    title: "Commute",
    icon: Car,
    questions: [
      {
        id: "commuteMinutesOneWay",
        label: "Typical one-way commute time",
        description: "Hansson et al. 2011: 45+ min commutes raise depression and obesity risk. Use 0 if remote.",
        type: "number",
        min: 0,
        max: 240,
        step: 5,
        unit: "minutes",
      },
    ],
  },
  {
    title: "Sauna",
    icon: Flame,
    questions: [
      {
        id: "saunaSessionsPerWeek",
        label: "Sauna sessions per week",
        description: "Laukkanen et al. 2015 (JAMA): 4-7 sessions/week associated with 40% lower mortality vs 1/week.",
        type: "number",
        min: 0,
        max: 14,
        step: 1,
        unit: "sessions",
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
      {
        id: "alcoholUnitsPerSession",
        label: "Typical drinks per session",
        description: "1 unit = 1 beer, 1 glass of wine, or 1 shot",
        type: "number",
        min: 0,
        max: 15,
        step: 1,
        unit: "drinks",
      },
      {
        id: "caffeineConsumption",
        label: "Caffeine consumption",
        description: "Coffee, tea, energy drinks combined",
        type: "select",
        options: [
          { value: "none", label: "None" },
          { value: "moderate", label: "Moderate (1-3 cups)" },
          { value: "high", label: "High (4-6 cups)" },
          { value: "excessive", label: "Excessive (7+ cups)" },
        ],
      },
    ],
  },
]

export function LifestyleSection({ onResult, storedResult, onStoreResult, onRetake }: LifestyleSectionProps) {
  const [answers, setAnswers] = useState<LifestyleAnswers>(DEFAULT_ANSWERS)
  const [result, setResult] = useState<LifestyleResult | null>(storedResult ?? null)
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
    onStoreResult?.(r)
    // Pass smoking and alcohol data to carbon calculator
    const lifestyleExtras = {
      smokingStatus: answers.smokingStatus,
      alcoholFrequency: answers.alcoholFrequency,
      alcoholUnitsPerSession: answers.alcoholUnitsPerSession,
    }
    onResult(r.overallScore, lifestyleExtras)
  }

  function handleRetake() {
    setAnswers(DEFAULT_ANSWERS)
    setResult(null)
    setCurrentGroup(0)
    onRetake?.()
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
          Based on WHO guidelines, Pittsburgh Sleep Quality Index, and
          Holt-Lunstad social connection research.
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
        <LifestyleResults result={result} onReset={handleRetake} />
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
    { label: "Sleep", score: subScores.sleep, icon: Moon },
    { label: "Social Connection", score: subScores.social, icon: Users },
    { label: "Leisure & Balance", score: subScores.leisure, icon: Tv },
    { label: "Sedentary Time", score: subScores.sedentary, icon: Armchair },
    { label: "Sun Exposure", score: subScores.sun, icon: Sun },
    { label: "Commute", score: subScores.commute, icon: Car },
    { label: "Sauna", score: subScores.sauna, icon: Flame },
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
              <Moon className="h-8 w-8" />
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
        Based on WHO sleep recommendations, Pittsburgh Sleep Quality Index (PSQI),
        Holt-Lunstad social connection meta-analyses (2010, 2015), and WHO/CDC
        evidence on substance use impacts.
      </p>
    </div>
  )
}
