"use client"

import { useState } from "react"
import {
  UtensilsCrossed,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Apple,
  Leaf,
  Wheat,
  Candy,
  Beef,
} from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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

// Group questions into logical steps
const STEPS = [
  {
    title: "Fruits & Vegetables",
    description: "Your daily fruit and vegetable intake",
    icon: Apple,
    questionIds: ["fruits", "vegetables"],
  },
  {
    title: "Whole Grains & Legumes",
    description: "Fiber-rich foods in your diet",
    icon: Wheat,
    questionIds: ["wholegrains", "legumes"],
  },
  {
    title: "Sugary Foods & Drinks",
    description: "Sugar and sweetened beverage consumption",
    icon: Candy,
    questionIds: ["sugary_drinks", "ultra_processed"],
  },
  {
    title: "Meat & Protein",
    description: "Your protein sources",
    icon: Beef,
    questionIds: ["processed_meat", "fish_protein"],
  },
  {
    title: "Fats & Salt",
    description: "Fat quality and sodium intake",
    icon: Leaf,
    questionIds: ["saturated_fat", "salt"],
  },
]

export function DietSection({ onResult }: DietSectionProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<DietAnswers>({})
  const [result, setResult] = useState<DietResult | null>(null)

  const totalSteps = STEPS.length
  const step = STEPS[currentStep]
  const StepIcon = step?.icon || UtensilsCrossed

  const currentQuestions = step?.questionIds.map((id) =>
    DIET_QUESTIONS.find((q) => q.id === id)
  ).filter(Boolean) || []

  const currentStepComplete = currentQuestions.every(
    (q) => q && answers[q.id] !== undefined
  )

  const allAnswered = Object.keys(answers).length === DIET_QUESTIONS.length

  function handleAnswer(questionId: string, value: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  function handleNext() {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
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
    setCurrentStep(0)
  }

  if (result) {
    return <DietResults result={result} onReset={handleReset} />
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Diet Assessment
        </h1>
        <p className="text-sm text-muted-foreground">
          Based on WHO Healthy Diet Monitoring Initiative. Answer questions about your
          eating habits.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / totalSteps) * 100}%`,
            }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          Step {currentStep + 1} of {totalSteps}
        </span>
      </div>

      {/* Single Card Wizard */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <StepIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span>{step.title}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {step.description}
              </span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {currentQuestions.map((q, idx) => {
            if (!q) return null
            return (
              <div key={q.id} className="flex flex-col gap-3">
                <div className="flex items-start gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                    {idx + 1}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <Label className="text-sm font-medium text-foreground">
                      {q.question}
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {q.description}
                    </span>
                  </div>
                </div>

                <RadioGroup
                  value={answers[q.id]?.toString()}
                  onValueChange={(val) => handleAnswer(q.id, Number.parseInt(val))}
                  className="flex flex-col gap-2 pl-8"
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
              </div>
            )
          })}
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          {currentStep < totalSteps - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!currentStepComplete}
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleCalculate}
              disabled={!allAnswered}
              className="gap-1"
            >
              Calculate Score
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Questions based on WHO Healthy Diet Monitoring Initiative (HDMI).
        Recommendations include 400g/day of fruits and vegetables, limited
        free sugars, and less than 5g salt per day.
      </p>
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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Diet Assessment
        </h1>
        <p className="text-sm text-muted-foreground">
          Your results based on WHO dietary guidelines
        </p>
      </div>

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
                    {cat.question
                      .replace("How often do you ", "")
                      .replace("How many servings of ", "")
                      .replace("How would you describe your ", "")
                      .replace("?", "")
                      .replace("eat ", "")
                      .replace("consume ", "")
                      .replace("drink ", "")}
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
