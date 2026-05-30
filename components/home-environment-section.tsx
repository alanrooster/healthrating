"use client"

import { useState, useEffect } from "react"
import { Home, CookingPot, SprayCan, Wind, AlertTriangle, CheckCircle2 } from "lucide-react"
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
  calculateHomeEnvironment,
  type HomeEnvironmentAnswers,
  type HomeEnvironmentResult,
} from "@/lib/home-environment-calculator"
import { getScoreColor } from "@/lib/health-score"

interface HomeEnvironmentSectionProps {
  onResult: (score: number) => void
  storedResult?: HomeEnvironmentResult | null
  onStoreResult?: (result: HomeEnvironmentResult) => void
  onRetake?: () => void
  storedInputs?: HomeEnvironmentAnswers | null
  onStoreInputs?: (inputs: HomeEnvironmentAnswers) => void
}

const DEFAULTS: HomeEnvironmentAnswers = {
  cookwareType: "mixed",
  foodStorage: "mixed",
  heatingInPlastic: "sometimes",
  expiryAttention: "usually",
  moldyFoodHandling: "depends",
  dustingFrequency: "biweekly",
  cleaningProducts: "conventional",
  ventilation: "occasional",
  cookingVentilation: "open-window",
  cookingFuel: "electric",
  dampMold: "none",
  airPurifier: "none",
  scentedProducts: "occasional",
  radonStatus: "not-tested",
  smokeIndoors: "never",
}

type Question = {
  id: keyof HomeEnvironmentAnswers
  label: string
  description?: string
  options: { value: string; label: string }[]
}

const GROUPS: Array<{
  title: string
  description: string
  icon: typeof Home
  questions: Question[]
}> = [
  {
    title: "Cookware & Food-Contact Plastics",
    description:
      "Luo 2022: a scratched nonstick pan can release ~9,100+ microplastic particles per crack. Hussain 2023: microwaving plastic releases billions of nanoplastics.",
    icon: CookingPot,
    questions: [
      {
        id: "cookwareType",
        label: "What are most of your pots & pans made of?",
        options: [
          { value: "inert", label: "Stainless steel, cast iron, glass or ceramic" },
          { value: "mixed", label: "A mix — some inert, some nonstick (intact)" },
          { value: "nonstick-good", label: "Mostly nonstick (Teflon/PTFE), coating intact" },
          { value: "nonstick-scratched", label: "Nonstick with scratched / flaking coating" },
        ],
      },
      {
        id: "foodStorage",
        label: "What do you store food & leftovers in?",
        description: "Glass/steel avoid BPA & phthalate migration (Carwile 2011).",
        options: [
          { value: "glass-steel", label: "Almost all glass / stainless steel" },
          { value: "mostly-glass", label: "Mostly glass, some plastic" },
          { value: "mixed", label: "About half and half" },
          { value: "mostly-plastic", label: "Mostly plastic containers" },
        ],
      },
      {
        id: "heatingInPlastic",
        label: "How often do you microwave or serve hot food in plastic?",
        options: [
          { value: "never", label: "Never — always glass/ceramic" },
          { value: "rarely", label: "Rarely" },
          { value: "sometimes", label: "Sometimes" },
          { value: "often", label: "Often" },
        ],
      },
    ],
  },
  {
    title: "Food Safety & Household Cleaning",
    description:
      "Aflatoxin from mold is an IARC Group 1 carcinogen. House dust holds PBDEs/phthalates/PFAS (Mitro 2016). Cleaning sprays are linked to lung-function decline (Svanes 2018).",
    icon: SprayCan,
    questions: [
      {
        id: "expiryAttention",
        label: "Do you pay attention to expiry dates & food freshness?",
        options: [
          { value: "always", label: "Always — check dates & rotate food" },
          { value: "usually", label: "Usually" },
          { value: "sometimes", label: "Sometimes" },
          { value: "rarely", label: "Rarely" },
        ],
      },
      {
        id: "moldyFoodHandling",
        label: "When food gets a bit of mold, what do you do?",
        description: "Mycotoxins spread beyond the visible spot in soft foods (USDA).",
        options: [
          { value: "discard-whole", label: "Throw the whole item away" },
          { value: "depends", label: "Discard soft foods; trim hard cheese / firm produce" },
          { value: "cut-around", label: "Usually cut the mold off and eat the rest" },
        ],
      },
      {
        id: "dustingFrequency",
        label: "How often is the home dusted / vacuumed?",
        options: [
          { value: "weekly", label: "Weekly or more" },
          { value: "biweekly", label: "Every couple of weeks" },
          { value: "monthly", label: "About monthly" },
          { value: "rarely", label: "Rarely" },
        ],
      },
      {
        id: "cleaningProducts",
        label: "What cleaning products do you mainly use?",
        options: [
          { value: "eco-lowvoc", label: "Fragrance-free / eco / 'bio' / mostly natural" },
          { value: "mixed", label: "A mix of eco and conventional" },
          { value: "conventional", label: "Standard scented sprays & cleaners" },
          { value: "heavy-bleach", label: "Frequent bleach / ammonia / strong sprays" },
        ],
      },
    ],
  },
  {
    title: "Indoor Air Quality",
    description:
      "Gas-stove NO2 (~12.7% of childhood asthma, Gruenwald 2023), indoor damp/mould (+30-50% respiratory illness, WHO 2009) and radon (2nd leading lung-cancer cause, EPA) are the big indoor drivers.",
    icon: Wind,
    questions: [
      {
        id: "ventilation",
        label: "How is your home ventilated?",
        options: [
          { value: "mechanical-hrv", label: "Mechanical ventilation / HRV system" },
          { value: "daily-airing", label: "I open windows to air it out daily" },
          { value: "occasional", label: "Occasionally open windows" },
          { value: "rarely", label: "Rarely — kept closed" },
        ],
      },
      {
        id: "cookingFuel",
        label: "What do you cook on?",
        options: [
          { value: "induction", label: "Induction" },
          { value: "electric", label: "Electric (coil / ceramic)" },
          { value: "gas", label: "Gas / propane" },
        ],
      },
      {
        id: "cookingVentilation",
        label: "How do you ventilate while cooking?",
        options: [
          { value: "vented-hood", label: "Range hood vented outside" },
          { value: "open-window", label: "Open a window / door" },
          { value: "recirc-hood", label: "Recirculating hood (filter only)" },
          { value: "none", label: "No ventilation" },
        ],
      },
      {
        id: "dampMold",
        label: "Any damp or mould in your home?",
        options: [
          { value: "none", label: "None — dry throughout" },
          { value: "minor-past", label: "Minor issue in the past, now fixed" },
          { value: "occasional-condensation", label: "Occasional condensation / damp spots" },
          { value: "visible-mold", label: "Visible mould present now" },
        ],
      },
      {
        id: "airPurifier",
        label: "Do you use an air purifier?",
        options: [
          { value: "hepa-regular", label: "Yes — HEPA, running regularly" },
          { value: "sometimes", label: "Sometimes / in one room" },
          { value: "none", label: "No" },
        ],
      },
      {
        id: "scentedProducts",
        label: "How often do you burn candles / incense or use air fresheners?",
        options: [
          { value: "none", label: "Never" },
          { value: "occasional", label: "Occasionally" },
          { value: "frequent", label: "Frequently / daily" },
        ],
      },
      {
        id: "radonStatus",
        label: "Has your home been tested for radon?",
        options: [
          { value: "tested-safe", label: "Tested — levels are safe" },
          { value: "mitigated", label: "Was elevated, now mitigated" },
          { value: "not-tested", label: "Never tested" },
          { value: "high-untested", label: "Known/likely high, not mitigated" },
        ],
      },
      {
        id: "smokeIndoors",
        label: "Does anyone smoke or vape inside the home?",
        options: [
          { value: "never", label: "Never indoors" },
          { value: "occasional", label: "Occasionally" },
          { value: "regular", label: "Regularly" },
        ],
      },
    ],
  },
]

export function HomeEnvironmentSection({
  onResult,
  storedResult,
  onStoreResult,
  onRetake,
  storedInputs,
  onStoreInputs,
}: HomeEnvironmentSectionProps) {
  const [answers, setAnswers] = useState<HomeEnvironmentAnswers>(storedInputs ?? DEFAULTS)
  const [result, setResult] = useState<HomeEnvironmentResult | null>(storedResult ?? null)

  useEffect(() => {
    onStoreInputs?.(answers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers])

  function update<K extends keyof HomeEnvironmentAnswers>(id: K, value: HomeEnvironmentAnswers[K]) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function handleCalculate() {
    const r = calculateHomeEnvironment(answers)
    setResult(r)
    onStoreResult?.(r)
    onResult(r.overallScore)
  }

  function handleRetake() {
    setResult(null)
    onRetake?.()
  }

  if (result) {
    return <HomeEnvironmentResults result={result} onRetake={handleRetake} />
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Home Environment & Exposures</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Everyday household choices — cookware, food storage, cleaning and indoor air — add up to meaningful
                chemical and particulate exposure over a lifetime.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {GROUPS.map((g) => {
            const Icon = g.icon
            return (
              <div key={g.title} className="flex flex-col gap-4 rounded-lg border border-border p-4">
                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-foreground">{g.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{g.description}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {g.questions.map((q) => (
                    <div key={q.id} className="flex flex-col gap-2">
                      <Label className="text-foreground">{q.label}</Label>
                      {q.description && <p className="text-xs text-muted-foreground">{q.description}</p>}
                      <Select
                        value={String(answers[q.id])}
                        onValueChange={(v) => update(q.id, v as HomeEnvironmentAnswers[typeof q.id])}
                      >
                        <SelectTrigger className="max-w-md">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {q.options.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          <Button onClick={handleCalculate} className="self-start">
            Calculate Home Environment Score
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function HomeEnvironmentResults({
  result,
  onRetake,
}: {
  result: HomeEnvironmentResult
  onRetake: () => void
}) {
  const { overallScore, subScores, protectiveFactors, riskFactors, recommendations } = result
  const isGood = overallScore >= 70

  const items = [
    { label: "Cookware & Plastics", score: subScores.cookware },
    { label: "Food Safety & Cleaning", score: subScores.foodAndCleaning },
    { label: "Indoor Air", score: subScores.indoorAir },
  ]

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            Home Environment Score
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-6">
            <span className="text-5xl font-bold" style={{ color: getScoreColor(overallScore) }}>
              {overallScore}
            </span>
            <span className="text-sm text-muted-foreground">
              {isGood
                ? "Low-exposure home with strong protective habits"
                : "Several common household exposures worth reducing"}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {items.map((it) => (
              <div key={it.label} className="flex flex-col gap-1 rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{it.label}</span>
                  <span className="text-sm font-bold" style={{ color: getScoreColor(it.score) }}>
                    {it.score}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${it.score}%`, backgroundColor: getScoreColor(it.score) }}
                  />
                </div>
              </div>
            ))}
          </div>

          {protectiveFactors.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-foreground">Protective Factors</h3>
              {protectiveFactors.map((p, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--success))]" />
                  <span className="text-sm text-muted-foreground">{p}</span>
                </div>
              ))}
            </div>
          )}

          {riskFactors.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-foreground">Risk Factors</h3>
              {riskFactors.map((r, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />
                  <span className="text-sm text-muted-foreground">{r}</span>
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
