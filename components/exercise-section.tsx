"use client"

import { useState, useMemo } from "react"
import { Dumbbell, CheckCircle2, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  EXERCISE_QUESTIONS,
  calculateExerciseScore,
  type ExerciseInputs,
  type ExerciseResult,
} from "@/lib/exercise-calculator"
import { getScoreColor } from "@/lib/health-score"

interface ExerciseSectionProps {
  onResult: (score: number) => void
  storedResult?: ExerciseResult | null
  onStoreResult?: (result: ExerciseResult) => void
  onRetake?: () => void
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
}

export function ExerciseSection({ onResult, storedResult, onStoreResult, onRetake }: ExerciseSectionProps) {
  const [inputs, setInputs] = useState<ExerciseInputs>(DEFAULT_INPUTS)
  const [result, setResult] = useState<ExerciseResult | null>(storedResult ?? null)

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
    setInputs(DEFAULT_INPUTS)
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
          Based on WHO Global Physical Activity Questionnaire (GPAQ). Report your
          typical weekly activity.
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
    score,
    category,
    feedback,
    breakdown,
    sedentaryPenalty,
    sedentaryRisk,
    meetsWHOGuideline,
  } = result

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

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Active minutes/week
            </span>
            <span className="text-lg font-bold text-foreground">
              {breakdown.totalMinutesPerWeek}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-border p-3">
            {meetsWHOGuideline ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[hsl(var(--success))]" />
            ) : (
              <AlertTriangle className="h-5 w-5 shrink-0 text-[hsl(var(--accent))]" />
            )}
            <span className="text-sm text-foreground">
              {meetsWHOGuideline
                ? "You meet the WHO physical activity guideline (600+ MET-min/week)"
                : "You do not meet the WHO minimum of 600 MET-minutes/week (150 min moderate activity)"}
            </span>
          </div>

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

      <Button variant="outline" onClick={onReset} className="self-start">
        Retake Assessment
      </Button>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Scoring based on the WHO Global Physical Activity Questionnaire (GPAQ)
        analysis guide. MET values: vigorous = 8.0, moderate = 4.0, walking = 3.3.
        WHO recommends 150-300 minutes of moderate activity per week.
      </p>
    </div>
  )
}
