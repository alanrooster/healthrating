"use client"

import { useState, useEffect } from "react"
import { ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react"
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
  calculatePreventiveCare,
  VACCINE_MIN_AGE,
  type PreventiveCareAnswers,
  type PreventiveCareResult,
  type CarePeriod,
} from "@/lib/preventive-care-calculator"
import { getScoreColor } from "@/lib/health-score"

interface PreventiveCareSectionProps {
  onResult: (score: number) => void
  age?: number
  storedResult?: PreventiveCareResult | null
  onStoreResult?: (result: PreventiveCareResult) => void
  onRetake?: () => void
  storedInputs?: PreventiveCareAnswers | null
  onStoreInputs?: (inputs: PreventiveCareAnswers) => void
}

const DEFAULT_ANSWERS: PreventiveCareAnswers = {
  fluVaccine: "current",
  tdapVaccine: "current",
  covidUpToDate: "current",
  shinglesVaccine: "not-applicable",
  pneumococcalVaccine: "not-applicable",
  rsvVaccine: "not-applicable",
  bloodPressureCheck: "current",
  cholesterolCheck: "current",
  diabetesScreening: "current",
  cancerScreenings: "current",
  skinExam: "not-applicable",
  primaryCareVisit: "current",
  dentalVisit: "current",
  eyeExam: "current",
}

const PERIOD_OPTIONS: { value: CarePeriod; label: string }[] = [
  { value: "current", label: "Current / up-to-date" },
  { value: "overdue", label: "Slightly overdue" },
  { value: "long-overdue", label: "Long overdue (years behind)" },
  { value: "never", label: "Never had it" },
  { value: "not-applicable", label: "Not applicable for me" },
]

const QUESTIONS: { id: keyof PreventiveCareAnswers; label: string; description?: string }[] = [
  { id: "fluVaccine", label: "Annual flu vaccine" },
  { id: "tdapVaccine", label: "Tdap booster", description: "Recommended every 10 years" },
  { id: "covidUpToDate", label: "COVID-19 vaccination" },
  { id: "shinglesVaccine", label: "Shingles vaccine", description: "2 doses of the recombinant vaccine (Shingrix). US: all adults from 50. UK: from 65, depending on your birth date. Choose \"Not applicable\" if it isn't offered to you yet." },
  { id: "pneumococcalVaccine", label: "Pneumococcal vaccine", description: "One-off dose. US: all adults from 50. UK: from 65, or earlier with some long-term conditions." },
  { id: "rsvVaccine", label: "RSV vaccine", description: "Single dose. Recommended for everyone from 75. Under 75, only with conditions such as chronic heart or lung disease or a weakened immune system (US from 50, UK from 65)." },
  { id: "bloodPressureCheck", label: "Blood pressure check", description: "At least annually" },
  { id: "cholesterolCheck", label: "Cholesterol panel", description: "Every 4-6 years" },
  { id: "diabetesScreening", label: "Diabetes screening", description: "HbA1c or fasting glucose, every 3 years after 35" },
  { id: "cancerScreenings", label: "Age-appropriate cancer screenings", description: "Colonoscopy, mammogram, Pap, prostate, etc." },
  { id: "skinExam", label: "Skin examination" },
  { id: "primaryCareVisit", label: "Annual primary care visit" },
  { id: "dentalVisit", label: "Dental cleaning", description: "Every 6 months" },
  { id: "eyeExam", label: "Eye examination", description: "Every 1-2 years" },
]

export function PreventiveCareSection({ onResult, age, storedResult, onStoreResult, onRetake, storedInputs, onStoreInputs }: PreventiveCareSectionProps) {
  const [answers, setAnswers] = useState<PreventiveCareAnswers>({ ...DEFAULT_ANSWERS, ...storedInputs })
  const [result, setResult] = useState<PreventiveCareResult | null>(storedResult ?? null)

  useEffect(() => {
    onStoreInputs?.(answers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers])

  function update(id: keyof PreventiveCareAnswers, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value as CarePeriod }))
  }

  function handleCalculate() {
    const r = calculatePreventiveCare(answers, age)
    setResult(r)
    onStoreResult?.(r)
    onResult(r.overallScore)
  }

  function handleRetake() {
    setResult(null)
    onRetake?.()
  }

  if (result) {
    return <PreventiveCareResults result={result} onRetake={handleRetake} />
  }

  const visibleQuestions = QUESTIONS.filter((q) => {
    const minAge = VACCINE_MIN_AGE[q.id]
    return minAge === undefined || age === undefined || age >= minAge
  })

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Preventive Care Tracker</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Adherence to recommended preventive care can add several years of life expectancy.
                Track vaccines, screenings, and routine visits.
              </p>
              {age === undefined && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Shingles, pneumococcal and RSV vaccines are asked about from age 50. Add your
                  age in the Body module to skip them if you&apos;re younger.
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {visibleQuestions.map((q) => (
            <div key={q.id} className="flex flex-col gap-2">
              <Label htmlFor={`preventive-${q.id}`} className="text-foreground">{q.label}</Label>
              {q.description && <p className="text-xs text-muted-foreground">{q.description}</p>}
              <Select value={answers[q.id] ?? "not-applicable"} onValueChange={(v) => update(q.id, v)}>
                <SelectTrigger id={`preventive-${q.id}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PERIOD_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          <Button onClick={handleCalculate} className="self-start">
            Assess Preventive Care
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function PreventiveCareResults({ result, onRetake }: { result: PreventiveCareResult; onRetake: () => void }) {
  const { overallScore, itemsBehind, recommendations } = result
  const isGood = overallScore >= 80

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Preventive Care Score
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-6">
            <span className="text-5xl font-bold" style={{ color: getScoreColor(overallScore) }}>
              {overallScore}
            </span>
            <span className="text-sm text-muted-foreground">
              {isGood ? "Excellent preventive care adherence" : "Some preventive items need attention"}
            </span>
          </div>

          {itemsBehind.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-foreground">Behind on These Items</h3>
              {itemsBehind.map((it, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">{it.item}</span>
                    <span className="text-xs text-muted-foreground">{it.recommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-foreground">Recommendations</h3>
              {recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">{r}</span>
                </div>
              ))}
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
