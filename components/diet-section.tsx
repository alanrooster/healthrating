"use client"

import { useState } from "react"
import { UtensilsCrossed, CheckCircle2, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import {
  DIET_QUESTIONS,
  calculateDietScore,
  type DietAnswers,
  type DietResult,
} from "@/lib/diet-calculator"
import { getScoreColor } from "@/lib/health-score"

interface DietSectionProps {
  onResult: (score: number) => void
}

export function DietSection({ onResult }: DietSectionProps) {
  const [answers, setAnswers] = useState<DietAnswers>({})
  const [result, setResult] = useState<DietResult | null>(null)

  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === DIET_QUESTIONS.length

  function handleAnswer(questionId: string, value: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  function handleCalculate() {
    if (!allAnswered) return
    const dietResult = calculateDietScore(answers)
    setResult(dietResult)
    onResult(dietResult.totalScore)
  }

  function handleReset() {
    setAnswers({})
    setResult(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Diet Assessment
        </h1>
        <p className="text-sm text-muted-foreground">
          Based on WHO Healthy Diet Monitoring Initiative. Answer 10 questions about your
          eating habits.
        </p>
      </div>

      {!result ? (
        <>
          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${(answeredCount / DIET_QUESTIONS.length) * 100}%`,
                }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {answeredCount}/{DIET_QUESTIONS.length}
            </span>
          </div>

          {/* Questions */}
          <div className="flex flex-col gap-4">
            {DIET_QUESTIONS.map((q, idx) => (
              <Card key={q.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-start gap-3 text-sm font-medium text-foreground">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {idx + 1}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <span>{q.question}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {q.description}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={answers[q.id]?.toString()}
                    onValueChange={(val) => handleAnswer(q.id, Number.parseInt(val))}
                    className="flex flex-col gap-2"
                  >
                    {q.options.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2.5 transition-colors hover:bg-secondary has-[input:checked]:border-primary has-[input:checked]:bg-primary/5"
                      >
                        <RadioGroupItem
                          value={opt.value.toString()}
                          className="shrink-0"
                        />
                        <span className="text-sm text-foreground">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            onClick={handleCalculate}
            disabled={!allAnswered}
            className="self-start"
            size="lg"
          >
            Calculate Diet Score
          </Button>
        </>
      ) : (
        <DietResults result={result} onReset={handleReset} />
      )}
    </div>
  )
}

function DietResults({
  result,
  onReset,
}: {
  result: DietResult
  onReset: () => void
}) {
  const { totalScore, categoryScores, overallFeedback, category } = result

  return (
    <div className="flex flex-col gap-4">
      {/* Score Banner */}
      <Card className="overflow-hidden">
        <div
          className="p-6"
          style={{ backgroundColor: getScoreColor(totalScore), color: "#fff" }}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-3">
              <UtensilsCrossed className="h-8 w-8" />
              <span className="text-5xl font-bold">{totalScore}</span>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium opacity-80">/ 100</span>
                <span className="text-lg font-semibold">{category}</span>
              </div>
            </div>
            <p className="max-w-md text-sm opacity-90">{overallFeedback}</p>
          </div>
        </div>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">
            Detailed Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {categoryScores.map((cat, idx) => {
            const pct = (cat.score / cat.maxScore) * 100
            const isGood = cat.score >= 7

            return (
              <div key={idx} className="flex flex-col gap-1.5 rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {cat.question.replace("How often do you ", "").replace("How many servings of ", "").replace("How would you describe your ", "").replace("?", "")}
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: getScoreColor(pct) }}
                  >
                    {cat.score}/{cat.maxScore}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: getScoreColor(pct),
                    }}
                  />
                </div>
                <div className="flex items-start gap-1.5">
                  {isGood ? (
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[hsl(var(--success))]" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[hsl(var(--accent))]" />
                  )}
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    {cat.feedback}
                  </span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Button variant="outline" onClick={onReset} className="self-start">
        Retake Assessment
      </Button>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Scoring based on WHO Healthy Diet Monitoring Initiative (HDMI) guidelines.
        This assessment evaluates alignment with WHO dietary recommendations
        including the 400g/day fruit and vegetable target, limited free sugars
        ({"<"}10% energy), and less than 5g salt per day.
      </p>
    </div>
  )
}
