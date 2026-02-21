"use client"

import { useState, useRef } from "react"
import { BMIForm } from "@/components/bmi-form"
import { BMIResults } from "@/components/bmi-results"
import {
  calculateBMI,
  type BodyMeasurements,
  type BMIResult,
} from "@/lib/bmi-calculator"
import { bmiToHealthScore } from "@/lib/health-score"

interface BodyCompositionSectionProps {
  onResult: (score: number) => void
}

export function BodyCompositionSection({ onResult }: BodyCompositionSectionProps) {
  const [result, setResult] = useState<BMIResult | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  function handleCalculate(measurements: BodyMeasurements) {
    const bmiResult = calculateBMI(measurements)
    setResult(bmiResult)
    onResult(bmiToHealthScore(bmiResult.compositeScore))
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
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

      <BMIForm onCalculate={handleCalculate} />

      {result && (
        <div ref={resultsRef}>
          <BMIResults result={result} />
        </div>
      )}
    </div>
  )
}
