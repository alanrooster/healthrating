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
  Flame,
  Wine,
  AlertOctagon,
  Fish,
  Info,
} from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DIET_QUESTIONS,
  calculateDietScore,
  type DietAnswers,
  type DietResult,
} from "@/lib/diet-calculator"
import { getScoreColor } from "@/lib/health-score"

interface DietSectionProps {
  onResult: (score: number, meatData?: { redMeatFrequency: number; processedMeatFrequency: number; fishFrequency: number; alcoholFrequency: number }) => void
  storedResult?: DietResult | null
  onStoreResult?: (result: DietResult) => void
  onRetake?: () => void
}

// Group questions into logical steps with IARC classification awareness
const STEPS = [
  {
    title: "Fruits & Vegetables",
    description: "Protective foods - WHO recommends 400g/day",
    icon: Apple,
    questionIds: ["fruits", "vegetables"],
  },
  {
    title: "Whole Grains & Protein",
    description: "Fiber-rich foods and healthy proteins",
    icon: Wheat,
    questionIds: ["wholegrains", "legumes", "fish_protein"],
  },
  {
    title: "IARC Group 1 Carcinogens",
    description: "Foods classified as carcinogenic to humans",
    icon: AlertOctagon,
    questionIds: ["processed_meat", "alcohol", "salted_fish"],
    isIARCWarning: true,
  },
  {
    title: "IARC Group 2A Carcinogens",
    description: "Foods probably carcinogenic to humans",
    icon: Flame,
    questionIds: ["red_meat", "very_hot_beverages", "high_temp_cooking"],
    isIARCWarning: true,
  },
  {
    title: "Sugars & Processed Foods",
    description: "Ultra-processed foods and sweetened beverages",
    icon: Wine,
    questionIds: ["sugary_drinks", "ultra_processed"],
  },
  {
    title: "Fats & Salt",
    description: "Saturated fat and sodium intake",
    icon: Leaf,
    questionIds: ["saturated_fat", "salt"],
  },
]

const IARC_GROUP_COLORS = {
  "1": "hsl(0, 84%, 60%)", // red
  "2A": "hsl(25, 95%, 53%)", // orange
  "2B": "hsl(45, 93%, 47%)", // yellow
}

export function DietSection({ onResult, storedResult, onStoreResult, onRetake }: DietSectionProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<DietAnswers>({})
  const [result, setResult] = useState<DietResult | null>(storedResult ?? null)

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
    onStoreResult?.(dietResult)
    // Pass meat and alcohol consumption data to carbon calculator
    const meatData = {
      redMeatFrequency: answers.red_meat ?? 0,
      processedMeatFrequency: answers.processed_meat ?? 0,
      fishFrequency: answers.fish_protein ?? 0,
      alcoholFrequency: answers.alcohol ?? 0,
    }
    onResult(dietResult.totalScore, meatData)
  }

  function handleReset() {
    setAnswers({})
    setResult(null)
    setCurrentStep(0)
    onRetake?.()
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
          Based on WHO guidelines and IARC cancer classifications. Answer questions about your eating habits.
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
      <Card className={step?.isIARCWarning ? "border-destructive/50" : ""}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step?.isIARCWarning ? "bg-destructive/10" : "bg-primary/10"}`}>
              <StepIcon className={`h-5 w-5 ${step?.isIARCWarning ? "text-destructive" : "text-primary"}`} />
            </div>
            <div className="flex flex-col">
              <span>{step.title}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {step.description}
              </span>
            </div>
          </CardTitle>
        </CardHeader>

        {step?.isIARCWarning && (
          <div className="mx-6 mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <div className="flex items-start gap-2">
              <AlertOctagon className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <strong>IARC Classification Notice:</strong> The foods in this section have been classified by the International Agency for Research on Cancer (IARC) as carcinogenic or probably carcinogenic to humans. This is the same agency that classifies tobacco smoking.
              </div>
            </div>
          </div>
        )}

        <CardContent className="flex flex-col gap-6">
          {currentQuestions.map((q, idx) => {
            if (!q) return null
            return (
              <div key={q.id} className="flex flex-col gap-3">
                <div className="flex items-start gap-2">
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${q.iarcGroup ? "text-white" : "bg-secondary text-secondary-foreground"}`}
                    style={q.iarcGroup ? { backgroundColor: IARC_GROUP_COLORS[q.iarcGroup] } : {}}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium text-foreground">
                        {q.question}
                      </Label>
                      {q.iarcGroup && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white cursor-help"
                                style={{ backgroundColor: IARC_GROUP_COLORS[q.iarcGroup] }}
                              >
                                IARC {q.iarcGroup}
                                <Info className="h-3 w-3" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="text-xs">{q.iarcNote}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
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
        Questions based on WHO Healthy Diet Monitoring Initiative (HDMI) and IARC Monographs on cancer risk.
        IARC Group 1 = carcinogenic to humans. Group 2A = probably carcinogenic.
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
  const { totalScore, categoryScores, overallFeedback, category, iarcRisks, iarcSummary } = result

  const group1Risks = iarcRisks.filter((r) => r.group === "1")
  const group2ARisks = iarcRisks.filter((r) => r.group === "2A")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Diet Assessment
        </h1>
        <p className="text-sm text-muted-foreground">
          Your results based on WHO dietary guidelines and IARC cancer classifications
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

      {/* IARC Cancer Risk Summary */}
      {iarcRisks.length > 0 && (
        <Card className="border-destructive/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-destructive">
              <AlertOctagon className="h-5 w-5" />
              IARC Carcinogen Exposure
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">{iarcSummary}</p>

            {group1Risks.length > 0 && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-destructive">
                  <span className="rounded-full bg-[hsl(0,84%,60%)] px-2 py-0.5 text-xs text-white">
                    Group 1
                  </span>
                  Carcinogenic to humans
                </h4>
                <div className="flex flex-col gap-2">
                  {group1Risks.map((risk, idx) => (
                    <div key={idx} className="flex flex-col gap-1 rounded border border-destructive/20 bg-background p-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {risk.substance}
                        </span>
                        <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${
                          risk.riskLevel === "high" ? "bg-destructive text-destructive-foreground" :
                          risk.riskLevel === "moderate" ? "bg-orange-500 text-white" :
                          "bg-yellow-500 text-black"
                        }`}>
                          {risk.frequency}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{risk.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {group2ARisks.length > 0 && (
              <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-4">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-600">
                  <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
                    Group 2A
                  </span>
                  Probably carcinogenic to humans
                </h4>
                <div className="flex flex-col gap-2">
                  {group2ARisks.map((risk, idx) => (
                    <div key={idx} className="flex flex-col gap-1 rounded border border-orange-500/20 bg-background p-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {risk.substance}
                        </span>
                        <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${
                          risk.riskLevel === "high" ? "bg-destructive text-destructive-foreground" :
                          risk.riskLevel === "moderate" ? "bg-orange-500 text-white" :
                          "bg-yellow-500 text-black"
                        }`}>
                          {risk.frequency}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{risk.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              IARC = International Agency for Research on Cancer (WHO). Group 1 substances have the same carcinogenicity classification as tobacco smoking and asbestos.
            </p>
          </CardContent>
        </Card>
      )}

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
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground line-clamp-1">
                      {cat.question
                        .replace("How often do you ", "")
                        .replace("How many servings of ", "")
                        .replace("How would you describe your ", "")
                        .replace("?", "")
                        .replace("eat ", "")
                        .replace("consume ", "")
                        .replace("drink ", "")}
                    </span>
                    {cat.iarcGroup && (
                      <span
                        className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white"
                        style={{ backgroundColor: cat.iarcGroup === "Group 1" ? IARC_GROUP_COLORS["1"] : IARC_GROUP_COLORS["2A"] }}
                      >
                        IARC {cat.iarcGroup.replace("Group ", "")}
                      </span>
                    )}
                  </div>
                  <span
                    className="text-sm font-bold shrink-0"
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
        Scoring based on WHO Healthy Diet Monitoring Initiative (HDMI) and IARC Monographs
        (International Agency for Research on Cancer). IARC classifications: Group 1 = carcinogenic
        to humans (same as tobacco), Group 2A = probably carcinogenic, Group 2B = possibly carcinogenic.
      </p>
    </div>
  )
}
