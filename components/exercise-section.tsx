"use client"

import { useState, useMemo, useEffect } from "react"
import { Dumbbell, CheckCircle2, AlertTriangle, Activity } from "lucide-react"
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
  EXERCISE_QUESTIONS,
  calculateExerciseScore,
  type DailySteps,
  type ExerciseInputs,
  type ExerciseResult,
} from "@/lib/exercise-calculator"
import { getScoreColor } from "@/lib/health-score"

interface ExerciseSectionProps {
  onResult: (score: number) => void
  storedResult?: ExerciseResult | null
  onStoreResult?: (result: ExerciseResult) => void
  onRetake?: () => void
  storedInputs?: ExerciseInputs | null
  onStoreInputs?: (inputs: ExerciseInputs) => void
}

const DEFAULT_INPUTS: ExerciseInputs = {
  workVigDays: 0,
  workVigMin: 0,
  workModDays: 0,
  workModMin: 0,
  transportDays: 0,
  transportMin: 0,
  recVigDays: 0,
  recVigMin: 0,
  recModDays: 0,
  recModMin: 0,
  sedentaryHours: 8,
  stairsCapacity: "ok-4",
  walkingPace: "average",
  gripStrength: "average",
  restingHeartRate: 70,
  strengthDays: 0,
  dailySteps: "unknown",
}

const STEPS_OPTIONS: { value: DailySteps; label: string }[] = [
  { value: "unknown", label: "I don't track my steps" },
  { value: "under-3k", label: "Under 3,000" },
  { value: "3k-5k", label: "3,000-5,000" },
  { value: "5k-7k", label: "5,000-7,000" },
  { value: "7k-10k", label: "7,000-10,000" },
  { value: "10k-plus", label: "10,000 or more" },
]

export function ExerciseSection({ onResult, storedResult, onStoreResult, onRetake, storedInputs, onStoreInputs }: ExerciseSectionProps) {
  const [inputs, setInputs] = useState<ExerciseInputs>({ ...DEFAULT_INPUTS, ...storedInputs })
  const [result, setResult] = useState<ExerciseResult | null>(storedResult ?? null)

  useEffect(() => {
    onStoreInputs?.(inputs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs])

  const groups = useMemo(() => {
    const g: Record<string, typeof EXERCISE_QUESTIONS> = {}
    for (const q of EXERCISE_QUESTIONS) {
      if (!g[q.group]) g[q.group] = []
      g[q.group].push(q)
    }
    return g
  }, [])

  function handleInputChange(id: keyof ExerciseInputs, value: string) {
    const num = Number.parseFloat(value) || 0
    const question = EXERCISE_QUESTIONS.find((q) => q.id === id)
    const clamped = question
      ? Math.max(question.min, Math.min(question.max, num))
      : num
    setInputs((prev) => ({ ...prev, [id]: clamped }))
  }

  function handleCalculate() {
    const exResult = calculateExerciseScore(inputs)
    setResult(exResult)
    onStoreResult?.(exResult)
    onResult(exResult.score)
  }

  function handleReset() {
    setResult(null)
    onRetake?.()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Exercise Assessment
        </h1>
        <p className="text-sm text-muted-foreground">
          Based on the WHO Global Physical Activity Questionnaire (GPAQ) and WHO
          muscle-strengthening guidance. Report your typical weekly activity.
        </p>
      </div>

      {!result ? (
        <>
          {Object.entries(groups).map(([groupName, questions]) => (
            <Card key={groupName}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-foreground">
                  {groupName}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {questions.map((q) => (
                  <div key={q.id} className="flex flex-col gap-1.5">
                    <Label className="text-sm text-foreground">{q.question}</Label>
                    <p className="text-xs text-muted-foreground">{q.description}</p>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={inputs[q.id]}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        min={q.min}
                        max={q.max}
                        step={q.step}
                        className="w-28"
                      />
                      <span className="text-sm text-muted-foreground">
                        {q.type === "days"
                          ? "days/week"
                          : q.type === "minutes"
                            ? "min/day"
                            : "hours/day"}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">Daily Steps</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1.5">
              <Label htmlFor="daily-steps" className="text-sm text-foreground">
                Average steps per day
              </Label>
              <p className="text-xs text-muted-foreground">
                From your phone or wearable. If you don&apos;t track steps, the score uses your
                other answers.
              </p>
              <Select
                value={inputs.dailySteps ?? "unknown"}
                onValueChange={(v) => setInputs((p) => ({ ...p, dailySteps: v as DailySteps }))}
              >
                <SelectTrigger id="daily-steps" className="max-w-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STEPS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Activity className="h-5 w-5 text-primary" />
                Functional Fitness
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Self-reported markers that predict mortality independently of activity levels
                (Studenski 2011, Leong 2015 Lancet, Mandsager 2018 JAMA).
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-foreground">
                  Climbing 4 flights of stairs without stopping
                </Label>
                <p className="text-xs text-muted-foreground">
                  Strong proxy for cardiorespiratory fitness (VO2 max)
                </p>
                <Select
                  value={inputs.stairsCapacity}
                  onValueChange={(v) =>
                    setInputs((p) => ({ ...p, stairsCapacity: v as ExerciseInputs["stairsCapacity"] }))
                  }
                >
                  <SelectTrigger className="max-w-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy-4plus">Easy - I can do more than 4 flights</SelectItem>
                    <SelectItem value="ok-4">Comfortable with 4 flights</SelectItem>
                    <SelectItem value="ok-2">Can manage 2 flights</SelectItem>
                    <SelectItem value="struggle-1">Struggle even with 1 flight</SelectItem>
                    <SelectItem value="cannot">Cannot climb stairs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-foreground">Usual walking pace</Label>
                <p className="text-xs text-muted-foreground">
                  Gait speed predicts survival as well as age + sex + chronic conditions combined
                </p>
                <Select
                  value={inputs.walkingPace}
                  onValueChange={(v) =>
                    setInputs((p) => ({ ...p, walkingPace: v as ExerciseInputs["walkingPace"] }))
                  }
                >
                  <SelectTrigger className="max-w-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very-fast">Very fast (overtake most people)</SelectItem>
                    <SelectItem value="brisk">Brisk</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="slow">Slow</SelectItem>
                    <SelectItem value="very-slow">Very slow / use mobility aid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-foreground">Grip strength (self-rated)</Label>
                <p className="text-xs text-muted-foreground">
                  Opening jars, carrying groceries, holding heavy bags
                </p>
                <Select
                  value={inputs.gripStrength}
                  onValueChange={(v) =>
                    setInputs((p) => ({ ...p, gripStrength: v as ExerciseInputs["gripStrength"] }))
                  }
                >
                  <SelectTrigger className="max-w-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very-strong">Very strong - never struggle</SelectItem>
                    <SelectItem value="strong">Strong</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="weak">Weak - sometimes need help</SelectItem>
                    <SelectItem value="very-weak">Very weak - often need help</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-foreground">Resting heart rate</Label>
                <p className="text-xs text-muted-foreground">
                  Take pulse for 60 seconds while seated and relaxed. Optimal range: 50-65 bpm.
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={inputs.restingHeartRate}
                    onChange={(e) =>
                      setInputs((p) => ({
                        ...p,
                        restingHeartRate: Math.max(30, Math.min(150, Number.parseFloat(e.target.value) || 0)),
                      }))
                    }
                    min={30}
                    max={150}
                    step={1}
                    className="w-28"
                  />
                  <span className="text-sm text-muted-foreground">bpm</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleCalculate} className="self-start" size="lg">
            Calculate Exercise Score
          </Button>
        </>
      ) : (
        <ExerciseResults result={result} onReset={handleReset} />
      )}
    </div>
  )
}

function ExerciseResults({
  result,
  onReset,
}: {
  result: ExerciseResult
  onReset: () => void
}) {
  const {
    totalMETMinutes,
    whoGpaqMETMinutes,
    score,
    activityScore,
    functionalScore,
    category,
    feedback,
    breakdown,
    sedentaryPenalty,
    sedentaryRisk,
    meetsWHOGuideline,
    functionalFlags,
    strengthDays,
    dailySteps,
    meetsStrengthGuideline,
    activityFlags = [],
  } = result
  const stepsLabel =
    dailySteps && dailySteps !== "unknown"
      ? STEPS_OPTIONS.find((option) => option.value === dailySteps)?.label
      : undefined

  const gpaqMETMinutes = whoGpaqMETMinutes ?? totalMETMinutes
  const showGpaq = gpaqMETMinutes !== totalMETMinutes

  const breakdownItems = [
    { label: "Work (vigorous)", met: breakdown.workVigorous },
    { label: "Work (moderate)", met: breakdown.workModerate },
    { label: "Active transport", met: breakdown.transport },
    { label: "Recreation (vigorous)", met: breakdown.recVigorous },
    { label: "Recreation (moderate)", met: breakdown.recModerate },
  ].filter((b) => b.met > 0)

  return (
    <div className="flex flex-col gap-4">
      {/* Score Banner */}
      <Card className="overflow-hidden">
        <div
          className="p-6"
          style={{ backgroundColor: getScoreColor(score), color: "#fff" }}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-3">
              <Dumbbell className="h-8 w-8" />
              <span className="text-5xl font-bold">{score}</span>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium opacity-80">/ 100</span>
                <span className="text-lg font-semibold">{category}</span>
              </div>
            </div>
            <p className="max-w-md text-sm opacity-90">{feedback}</p>
          </div>
        </div>
      </Card>

      {/* MET minutes & WHO guideline */}
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Total MET-minutes/week
            </span>
            <span className="text-lg font-bold text-foreground">
              {totalMETMinutes.toLocaleString()}
            </span>
          </div>

          {showGpaq && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  WHO GPAQ method
                </span>
                <span className="text-lg font-bold text-foreground">
                  {gpaqMETMinutes.toLocaleString()}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Your score counts walking or cycling for transport at 3.3 MET,
                stricter than the 4.0 MET in the WHO GPAQ analysis guide.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Active minutes/week
            </span>
            <span className="text-lg font-bold text-foreground">
              {breakdown.totalMinutesPerWeek}
            </span>
          </div>

          {stepsLabel && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Average daily steps</span>
              <span className="text-lg font-bold text-foreground">{stepsLabel}</span>
            </div>
          )}

          <GuidelineRow
            met={meetsWHOGuideline}
            text={
              meetsWHOGuideline
                ? "You meet the WHO physical activity guideline (600+ MET-min/week)"
                : gpaqMETMinutes >= 600
                  ? "Below 600 MET-min/week with the stricter transport value used here, though you meet the WHO minimum by the WHO GPAQ method"
                  : "You do not meet the WHO minimum of 600 MET-minutes/week (150 min moderate activity)"
            }
          />

          {typeof meetsStrengthGuideline === "boolean" && (
            <GuidelineRow
              met={meetsStrengthGuideline}
              text={
                meetsStrengthGuideline
                  ? `Muscle strengthening on ${strengthDays} days a week meets the WHO guideline (2+ days)`
                  : `Muscle strengthening on ${strengthDays} ${strengthDays === 1 ? "day" : "days"} a week is below the WHO guideline of 2+ days`
              }
            />
          )}

          {/* MET Breakdown */}
          {breakdownItems.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">
                Activity Breakdown
              </span>
              {breakdownItems.map((b) => {
                const pct = totalMETMinutes > 0 ? (b.met / totalMETMinutes) * 100 : 0
                return (
                  <div key={b.label} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{b.label}</span>
                      <span>{b.met.toLocaleString()} MET-min</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Sub-score split */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Activity</span>
                <span className="text-base font-bold" style={{ color: getScoreColor(activityScore) }}>
                  {activityScore}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${activityScore}%`, backgroundColor: getScoreColor(activityScore) }}
                />
              </div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Functional Fitness</span>
                <span className="text-base font-bold" style={{ color: getScoreColor(functionalScore) }}>
                  {functionalScore}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${functionalScore}%`, backgroundColor: getScoreColor(functionalScore) }}
                />
              </div>
            </div>
          </div>

          <FlagList title="Activity Markers to Address" flags={activityFlags} />
          <FlagList title="Functional Markers to Address" flags={functionalFlags} />

          {/* Sedentary Warning */}
          {sedentaryPenalty > 0 && (
            <div className="rounded-lg border border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/5 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">
                    Sedentary Behavior Penalty: -{sedentaryPenalty} points
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {sedentaryRisk}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>


      <p className="text-xs text-muted-foreground leading-relaxed">
        Scoring based on the WHO Global Physical Activity Questionnaire (GPAQ)
        analysis guide. MET values: vigorous = 8.0, moderate = 4.0, active travel = 3.3 (IPAQ walking value, stricter than the 4.0 in the GPAQ guide, which is shown for reference).
        WHO recommends 150-300 minutes of moderate activity per week plus
        muscle-strengthening activity on 2 or more days. The activity sub-score
        weights aerobic volume 60%, strength days 25% and daily steps 15%; without
        step data, the other two are reweighted.
      </p>
    </div>
  )
}

function GuidelineRow({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border p-3">
      {met ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-[hsl(var(--success))]" />
      ) : (
        <AlertTriangle className="h-5 w-5 shrink-0 text-[hsl(var(--accent))]" />
      )}
      <span className="text-sm text-foreground">{text}</span>
    </div>
  )
}

function FlagList({ title, flags }: { title: string; flags: string[] }) {
  if (flags.length === 0) return null
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{title}</span>
      {flags.map((flag) => (
        <div
          key={flag}
          className="flex items-start gap-2 rounded-lg border border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/5 p-3"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />
          <span className="text-xs text-muted-foreground leading-relaxed">{flag}</span>
        </div>
      ))}
    </div>
  )
}
