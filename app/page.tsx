"use client"

import { useState, useRef } from "react"
import { BMIForm } from "@/components/bmi-form"
import { BMIResults } from "@/components/bmi-results"
import { calculateBMI, type BodyMeasurements, type BMIResult } from "@/lib/bmi-calculator"

export default function Page() {
  const [result, setResult] = useState<BMIResult | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  function handleCalculate(measurements: BodyMeasurements) {
    const bmiResult = calculateBMI(measurements)
    setResult(bmiResult)
    // Scroll to results after render
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-primary-foreground"
              aria-hidden="true"
            >
              <path d="M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3" />
              <path d="M16 19h6" />
              <path d="M19 16v6" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Smart BMI Calculator
            </h1>
            <p className="text-sm text-muted-foreground">
              Advanced body composition analysis
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Info Banner */}
        <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm leading-relaxed text-foreground">
            <strong className="font-semibold">More than just BMI.</strong> This
            calculator uses age, sex, and optional body measurements (waist, hip,
            neck, wrist) to provide a comprehensive body composition analysis
            including body fat estimation, waist-to-hip ratio, and personalized
            health risk assessment.
          </p>
        </div>

        <BMIForm onCalculate={handleCalculate} />

        {result && (
          <div ref={resultsRef} className="mt-8">
            <BMIResults result={result} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <p className="text-center text-xs text-muted-foreground">
            Built for informational purposes only. Always consult a healthcare
            professional for medical advice.
          </p>
        </div>
      </footer>
    </main>
  )
}
