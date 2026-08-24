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

interface BodyCompositionSectionProps {
  onResult: (score: number, demographics?: { age: number; sex: "male" | "female" }) => void
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
