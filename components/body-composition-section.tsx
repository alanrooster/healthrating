"use client"

import { useState, useRef } from "react"
import { BMIForm, type BMIFormInputs } from "@/components/bmi-form"
import { BMIResults } from "@/components/bmi-results"
import {
  calculateBMI,
  type BodyMeasurements,
  type BMIResult,
} from "@/lib/bmi-calculator"
import { bmiToHealthScore } from "@/lib/health-score"

type LEBmiCategory = "underweight" | "normal" | "overweight" | "obese" | "severely_obese"

/** Maps the BMI calculator's display category to the life expectancy model's enum */
function toLEBmiCategory(category: string): LEBmiCategory {
  const c = category.toLowerCase()
  if (c.includes("underweight")) return "underweight"
  if (c.includes("normal")) return "normal"
  if (c.includes("overweight")) return "overweight"
  if (c.includes("class ii") || c.includes("class iii")) return "severely_obese"
  if (c.includes("obese")) return "obese"
  return "normal"
}

interface BodyCompositionSectionProps {
  onResult: (
    score: number,
    demographics?: {
      age: number
      sex: "male" | "female"
      bmiCategory: LEBmiCategory
      bmi?: number
      waistCm?: number
    },
  ) => void
  storedResult?: BMIResult | null
  onStoreResult?: (result: BMIResult) => void
  onRetake?: () => void
  storedInputs?: BMIFormInputs | null
  onStoreInputs?: (inputs: BMIFormInputs) => void
}

export function BodyCompositionSection({ onResult, storedResult, onStoreResult, onRetake, storedInputs, onStoreInputs }: BodyCompositionSectionProps) {
  const [result, setResult] = useState<BMIResult | null>(storedResult ?? null)
  const resultsRef = useRef<HTMLDivElement>(null)

  function handleCalculate(measurements: BodyMeasurements) {
    const bmiResult = calculateBMI(measurements)
    setResult(bmiResult)
    onStoreResult?.(bmiResult)
    onResult(bmiToHealthScore(bmiResult.compositeScore), {
      age: measurements.age,
      sex: measurements.sex === "female" ? "female" : "male",
      bmiCategory: toLEBmiCategory(bmiResult.category),
      bmi: bmiResult.bmi,
      waistCm: measurements.waistCm,
    })
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  function handleRetake() {
    setResult(null)
    onRetake?.()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Body Composition Analysis
        </h1>
        <p className="text-sm text-muted-foreground">
          Advanced BMI calculator using age, sex, ethnicity, and body measurements
          for a comprehensive body composition score.
        </p>
      </div>

      <BMIForm onCalculate={handleCalculate} initialInputs={storedInputs} onInputsChange={onStoreInputs} />

      {result && (
        <div ref={resultsRef}>
          <BMIResults result={result} onRetake={handleRetake} />
        </div>
      )}
    </div>
  )
}
