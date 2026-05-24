"use client"

import { useState, useEffect } from "react"
import { Dna, AlertTriangle, CheckCircle2 } from "lucide-react"
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
  calculateFamilyHistory,
  type FamilyHistoryAnswers,
  type FamilyHistoryResult,
  type FamilyRelation,
} from "@/lib/family-history-calculator"
import { getScoreColor } from "@/lib/health-score"

interface FamilyHistorySectionProps {
  onResult: (score: number) => void
  storedResult?: FamilyHistoryResult | null
  onStoreResult?: (result: FamilyHistoryResult) => void
  onRetake?: () => void
  storedInputs?: FamilyHistoryAnswers | null
  onStoreInputs?: (inputs: FamilyHistoryAnswers) => void
}

const DEFAULT_ANSWERS: FamilyHistoryAnswers = {
  heartDisease: "none",
  hypertension: "none",
  diabetes: "none",
  cancerBreast: "none",
  cancerColon: "none",
  cancerOther: "none",
  alzheimers: "none",
  mentalHealth: "none",
  autoimmune: "none",
}

const RELATION_OPTIONS: { value: FamilyRelation; label: string }[] = [
  { value: "none", label: "No known family history" },
  { value: "second-degree", label: "Second-degree relative (grandparent, aunt/uncle)" },
  { value: "first-degree", label: "First-degree relative (parent, sibling, child)" },
  { value: "multiple-or-early", label: "Multiple relatives or early onset (under age 55)" },
]

const QUESTIONS: { id: keyof FamilyHistoryAnswers; label: string }[] = [
  { id: "heartDisease", label: "Heart disease, heart attack, or stroke" },
  { id: "hypertension", label: "High blood pressure (hypertension)" },
  { id: "diabetes", label: "Type 2 diabetes" },
  { id: "cancerBreast", label: "Breast or ovarian cancer" },
  { id: "cancerColon", label: "Colorectal cancer" },
  { id: "cancerOther", label: "Other cancers" },
  { id: "alzheimers", label: "Alzheimer's disease or dementia" },
  { id: "mentalHealth", label: "Depression, bipolar, or schizophrenia" },
  { id: "autoimmune", label: "Autoimmune conditions (RA, lupus, MS, IBD)" },
]

export function FamilyHistorySection({ onResult, storedResult, onStoreResult, onRetake, storedInputs, onStoreInputs }: FamilyHistorySectionProps) {
  const [answers, setAnswers] = useState<FamilyHistoryAnswers>(storedInputs ?? DEFAULT_ANSWERS)
  const [result, setResult] = useState<FamilyHistoryResult | null>(storedResult ?? null)

  useEffect(() => {
    onStoreInputs?.(answers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers])

  function update(id: keyof FamilyHistoryAnswers, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value as FamilyRelation }))
  }

  function handleCalculate() {
    const r = calculateFamilyHistory(answers)
    setResult(r)
    onStoreResult?.(r)
    onResult(r.overallScore)
  }

  function handleRetake() {
    setResult(null)
    onRetake?.()
  }

  if (result) {
    return <FamilyHistoryResults result={result} onRetake={handleRetake} />
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Dna className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Family Medical History</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Family history identifies genetic and shared-environment risk for major chronic conditions.
                It informs screening decisions but does not determine outcomes.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="flex flex-col gap-2">
              <Label className="text-foreground">{q.label}</Label>
              <Select value={answers[q.id]} onValueChange={(v) => update(q.id, v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RELATION_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          <Button onClick={handleCalculate} className="self-start">
            Assess Family History
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function FamilyHistoryResults({ result, onRetake }: { result: FamilyHistoryResult; onRetake: () => void }) {
  const { overallScore, riskFactors, recommendations } = result
  const isGood = overallScore >= 80

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dna className="h-5 w-5 text-primary" />
            Family History Score
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-6">
            <span className="text-5xl font-bold" style={{ color: getScoreColor(overallScore) }}>
              {overallScore}
            </span>
            <span className="text-sm text-muted-foreground">
              {isGood ? "Lower-than-average inherited risk profile" : "Family history suggests elevated risk for some conditions"}
            </span>
          </div>

          {riskFactors.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-foreground">Identified Risk Areas</h3>
              {riskFactors.map((rf, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">{rf.condition}</span>
                    <span className="text-xs text-muted-foreground">{rf.impact}</span>
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

          <Button variant="outline" onClick={onRetake} className="self-start">
            Retake Assessment
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
