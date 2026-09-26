"use client"

import { useState, useEffect } from "react"
import {
  Brain,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Heart,
  BookOpen,
  Target,
} from "lucide-react"
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
  calculateMentalHealth,
  type MentalHealthAnswers,
  type MentalHealthResult,
} from "@/lib/mental-health-calculator"
import { getScoreColor } from "@/lib/health-score"

interface MentalHealthSectionProps {
  onResult: (score: number) => void
  storedResult?: MentalHealthResult | null
  onStoreResult?: (result: MentalHealthResult) => void
  onRetake?: () => void
  storedInputs?: MentalHealthAnswers | null
  onStoreInputs?: (inputs: MentalHealthAnswers) => void
}

const DEFAULT_ANSWERS: MentalHealthAnswers = {
  k10_tired: "some",
  k10_nervous: "a-little",
  k10_soNervous: "none",
  k10_hopeless: "none",
  k10_restless: "a-little",
  k10_soRestless: "none",
  k10_depressed: "none",
  k10_soDepressed: "none",
  k10_everything: "a-little",
  k10_worthless: "none",
  phq2_interest: "not-at-all",
  phq2_depressed: "not-at-all",
  gad2_anxious: "not-at-all",
  gad2_worry: "not-at-all",
  wellbeing_cheerful: "most",
  wellbeing_calm: "most",
  wellbeing_active: "some",
  wellbeing_rested: "some",
  cognitive_learning: "weekly",
  cognitive_reading: "weekly",
  cognitive_challenges: "weekly",
  purpose_meaning: "agree",
  purpose_goals: "agree",
  purpose_value: "agree",
}

const K10_FREQUENCY_OPTIONS = [
  { value: "none", label: "None of the time" },
  { value: "a-little", label: "A little of the time" },
  { value: "some", label: "Some of the time" },
  { value: "most", label: "Most of the time" },
  { value: "all", label: "All of the time" },
]

const PHQ_FREQUENCY_OPTIONS = [
  { value: "not-at-all", label: "Not at all" },
  { value: "several-days", label: "Several days" },
  { value: "more-than-half", label: "More than half the days" },
  { value: "nearly-every-day", label: "Nearly every day" },
]

const WELLBEING_OPTIONS = [
  { value: "all", label: "All of the time" },
  { value: "most", label: "Most of the time" },
  { value: "some", label: "Some of the time" },
  { value: "a-little", label: "A little of the time" },
  { value: "none", label: "At no time" },
]

const ENGAGEMENT_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "rarely", label: "Rarely" },
  { value: "never", label: "Never" },
]

const AGREEMENT_OPTIONS = [
  { value: "strongly-agree", label: "Strongly agree" },
  { value: "agree", label: "Agree" },
  { value: "neutral", label: "Neutral" },
  { value: "disagree", label: "Disagree" },
  { value: "strongly-disagree", label: "Strongly disagree" },
]

interface QuestionGroup {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  questions: {
    id: keyof MentalHealthAnswers
    label: string
    options: { value: string; label: string }[]
  }[]
}

const QUESTION_GROUPS: QuestionGroup[] = [
  {
    title: "Psychological Distress (K10)",
    description:
      "Kessler Psychological Distress Scale: During the past 30 days, about how often did you feel...",
    icon: Brain,
    questions: [
      { id: "k10_tired", label: "Tired out for no good reason?", options: K10_FREQUENCY_OPTIONS },
      { id: "k10_nervous", label: "Nervous?", options: K10_FREQUENCY_OPTIONS },
      { id: "k10_soNervous", label: "So nervous that nothing could calm you down?", options: K10_FREQUENCY_OPTIONS },
      { id: "k10_hopeless", label: "Hopeless?", options: K10_FREQUENCY_OPTIONS },
      { id: "k10_restless", label: "Restless or fidgety?", options: K10_FREQUENCY_OPTIONS },
    ],
  },
  {
    title: "Psychological Distress (K10 cont.)",
    description: "Continuing the K10 assessment. During the past 30 days, about how often did you feel...",
    icon: Brain,
    questions: [
      { id: "k10_soRestless", label: "So restless you could not sit still?", options: K10_FREQUENCY_OPTIONS },
      { id: "k10_depressed", label: "Depressed?", options: K10_FREQUENCY_OPTIONS },
      { id: "k10_soDepressed", label: "So depressed that nothing could cheer you up?", options: K10_FREQUENCY_OPTIONS },
      { id: "k10_everything", label: "That everything was an effort?", options: K10_FREQUENCY_OPTIONS },
      { id: "k10_worthless", label: "Worthless?", options: K10_FREQUENCY_OPTIONS },
    ],
  },
  {
    title: "Depression & Anxiety Screening",
    description:
      "PHQ-2 and GAD-2 validated screeners. Over the last 2 weeks, how often have you been bothered by...",
    icon: ShieldAlert,
    questions: [
      { id: "phq2_interest", label: "Little interest or pleasure in doing things?", options: PHQ_FREQUENCY_OPTIONS },
      { id: "phq2_depressed", label: "Feeling down, depressed, or hopeless?", options: PHQ_FREQUENCY_OPTIONS },
      { id: "gad2_anxious", label: "Feeling nervous, anxious, or on edge?", options: PHQ_FREQUENCY_OPTIONS },
      { id: "gad2_worry", label: "Not being able to stop or control worrying?", options: PHQ_FREQUENCY_OPTIONS },
    ],
  },
  {
    title: "Wellbeing & Resilience",
    description:
      "Inspired by the WHO-5 Well-Being Index. Over the past 2 weeks, how often have you felt...",
    icon: Heart,
    questions: [
      { id: "wellbeing_cheerful", label: "Cheerful and in good spirits?", options: WELLBEING_OPTIONS },
      { id: "wellbeing_calm", label: "Calm and relaxed?", options: WELLBEING_OPTIONS },
      { id: "wellbeing_active", label: "Active and vigorous?", options: WELLBEING_OPTIONS },
      { id: "wellbeing_rested", label: "Waking up feeling fresh and rested?", options: WELLBEING_OPTIONS },
    ],
  },
  {
    title: "Cognitive Engagement",
    description:
      "Lancet Commission 2024 identifies cognitive engagement as a major modifiable factor for brain health and dementia prevention.",
    icon: BookOpen,
    questions: [
      { id: "cognitive_learning", label: "How often do you actively learn something new (courses, languages, skills)?", options: ENGAGEMENT_OPTIONS },
      { id: "cognitive_reading", label: "How often do you read books or long-form articles?", options: ENGAGEMENT_OPTIONS },
      { id: "cognitive_challenges", label: "How often do you engage with puzzles, problem-solving, or strategy games?", options: ENGAGEMENT_OPTIONS },
    ],
  },
  {
    title: "Purpose & Meaning",
    description:
      "Higher purpose-in-life is associated with longer lifespan and lower mortality risk (Hill & Turiano, 2014).",
    icon: Target,
    questions: [
      { id: "purpose_meaning", label: "I feel my life has meaning and purpose.", options: AGREEMENT_OPTIONS },
      { id: "purpose_goals", label: "I have clear goals and direction in my life.", options: AGREEMENT_OPTIONS },
      { id: "purpose_value", label: "I feel valued and appreciated by others.", options: AGREEMENT_OPTIONS },
    ],
  },
]

export function MentalHealthSection({ onResult, storedResult, onStoreResult, onRetake, storedInputs, onStoreInputs }: MentalHealthSectionProps) {
  const [answers, setAnswers] = useState<MentalHealthAnswers>(storedInputs ?? DEFAULT_ANSWERS)
  const [result, setResult] = useState<MentalHealthResult | null>(storedResult ?? null)
  const [currentGroup, setCurrentGroup] = useState(0)

  useEffect(() => {
    onStoreInputs?.(answers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers])

  function updateAnswer(id: keyof MentalHealthAnswers, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value as MentalHealthAnswers[typeof id] }))
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
  const r = calculateMentalHealth(answers)
  setResult(r)
  onStoreResult?.(r)
  onResult(r.overallScore)
  }
  
  function handleReset() {
  setResult(null)
  setCurrentGroup(0)
  onRetake?.()
    setCurrentGroup(0)
  }

  const isLastGroup = currentGroup === QUESTION_GROUPS.length - 1
  const group = QUESTION_GROUPS[currentGroup]
  const GroupIcon = group.icon

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Mental Health Screening
        </h1>
        <p className="text-sm text-muted-foreground">
          Based on validated instruments: Kessler K10 (psychological distress),
          PHQ-2 (depression), GAD-2 (anxiety), and WHO-5 (wellbeing).
        </p>
      </div>

      {/* Important notice */}
      <Card className="border-[hsl(var(--info))]/30 bg-[hsl(var(--info))]/5">
        <CardContent className="flex items-start gap-3 py-4">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--info))]" />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-foreground">
              Screening Tool Disclaimer
            </span>
            <span className="text-xs text-muted-foreground leading-relaxed">
              This is a screening tool only and does not provide a clinical
              diagnosis. If you are experiencing mental health difficulties,
              please consult a qualified healthcare professional. If you are in
              crisis, contact your local emergency services or crisis helpline.
            </span>
          </div>
        </CardContent>
      </Card>

      {!result ? (
        <>
          {/* Progress */}
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
                {group.description}
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {group.questions.map((q) => (
                <div key={q.id} className="flex flex-col gap-1.5">
                  <Label className="text-sm text-foreground">{q.label}</Label>
                  <Select
                    value={answers[q.id]}
                    onValueChange={(val) => updateAnswer(q.id, val)}
                  >
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {q.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                Calculate Mental Health Score
              </Button>
            )}
          </div>
        </>
      ) : (
        <MentalHealthResults result={result} onReset={handleReset} />
      )}
    </div>
  )
}

function MentalHealthResults({
  result,
  onReset,
}: {
  result: MentalHealthResult
  onReset: () => void
}) {
  const { overallScore, subScores, distressLevel, flags, recommendations } = result

  const distressLabel =
    distressLevel === "low"
      ? "Low Distress"
      : distressLevel === "mild"
        ? "Mild Distress"
        : distressLevel === "moderate"
          ? "Moderate Distress"
          : "Severe Distress"

  const subScoreItems = [
    {
      label: `K10 Distress (${subScores.k10Category})`,
      description: `Raw score: ${subScores.k10Score}/50`,
      score: Math.round(((50 - subScores.k10Score) / 40) * 100),
    },
    {
      label: `Depression Screen (PHQ-2)`,
      description: `Score: ${subScores.phq2Score}/6${subScores.phq2Flag ? " - POSITIVE" : ""}`,
      score: Math.round(((6 - subScores.phq2Score) / 6) * 100),
    },
    {
      label: `Anxiety Screen (GAD-2)`,
      description: `Score: ${subScores.gad2Score}/6${subScores.gad2Flag ? " - POSITIVE" : ""}`,
      score: Math.round(((6 - subScores.gad2Score) / 6) * 100),
    },
    {
      label: "Wellbeing (WHO-5 inspired)",
      description: `Score: ${subScores.wellbeingScore}/100`,
      score: subScores.wellbeingScore,
    },
    {
      label: "Cognitive Engagement",
      description: "Learning, reading, and mental challenges",
      score: subScores.cognitiveScore,
    },
    {
      label: "Purpose & Meaning",
      description: "Sense of purpose, goals, and being valued",
      score: subScores.purposeScore,
    },
  ]

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
              <Brain className="h-8 w-8" />
              <span className="text-5xl font-bold">{overallScore}</span>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium opacity-80">/ 100</span>
                <span className="text-lg font-semibold">{distressLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Sub-scores */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">
            Assessment Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {subScoreItems.map((item) => (
            <div key={item.label} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm text-foreground">{item.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
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
          ))}
        </CardContent>
      </Card>

      {/* Clinical Flags */}
      {flags.length > 0 && (
        <Card className="border-[hsl(var(--accent))]/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <AlertTriangle className="h-5 w-5 text-[hsl(var(--accent))]" />
              Clinical Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {flags.map((flag, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--accent))]" />
                  {flag}
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


      <p className="text-xs text-muted-foreground leading-relaxed">
        Instruments used: Kessler K10 (Kessler et al. 2002), PHQ-2 (Kroenke et
        al. 2003), GAD-2 (Kroenke et al. 2007), WHO-5 Well-Being Index. Cut-off
        values from Andrews & Slade (2001) and validated clinical studies.
      </p>
    </div>
  )
}
