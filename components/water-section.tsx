"use client"

import { useState, useMemo } from "react"
import {
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Info,
  FlaskConical,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  calculateWaterQuality,
  getWaterCountries,
  type WaterAnswers,
  type WaterResult,
  type WaterSource,
  type FiltrationType,
  type BottleType,
  type StorageCondition,
  type BuildingAge,
  type WaterIssue,
} from "@/lib/water-calculator"
import { getScoreColor } from "@/lib/health-score"

interface WaterSectionProps {
  onResult: (score: number) => void
}

const SOURCE_OPTIONS: { value: WaterSource; label: string; desc: string }[] = [
  { value: "municipal-tap", label: "Municipal Tap Water", desc: "City/town water supply" },
  { value: "private-well", label: "Private Well", desc: "Groundwater from private well" },
  { value: "spring", label: "Natural Spring", desc: "Spring or natural source" },
  { value: "rainwater", label: "Rainwater Collection", desc: "Collected rainwater" },
  { value: "bottled-only", label: "Bottled Water Only", desc: "Exclusively bottled water" },
  { value: "mixed", label: "Mixed Sources", desc: "Combination of sources" },
]

const FILTER_OPTIONS: { value: FiltrationType; label: string; desc: string }[] = [
  { value: "none", label: "No Filtration", desc: "Drink water as-is" },
  { value: "pitcher", label: "Pitcher Filter", desc: "Brita, PUR, etc." },
  { value: "faucet", label: "Faucet Filter", desc: "Attached to faucet" },
  { value: "under-sink", label: "Under-Sink Filter", desc: "Carbon or multi-stage" },
  { value: "reverse-osmosis", label: "Reverse Osmosis", desc: "Removes 99% of contaminants" },
  { value: "whole-house", label: "Whole House System", desc: "Filters all water in home" },
  { value: "distillation", label: "Distillation", desc: "Steam distilled water" },
]

const BOTTLE_OPTIONS: { value: BottleType; label: string; risk: string }[] = [
  { value: "none", label: "Don't use bottled water", risk: "No risk" },
  { value: "glass", label: "Glass bottles", risk: "No risk" },
  { value: "reusable-metal", label: "Reusable metal (stainless steel)", risk: "No risk" },
  { value: "aluminum", label: "Aluminum cans", risk: "Minimal risk" },
  { value: "reusable-plastic", label: "Reusable plastic bottles", risk: "Low risk" },
  { value: "plastic", label: "Single-use plastic bottles", risk: "Moderate risk" },
]

const STORAGE_OPTIONS: { value: StorageCondition; label: string; desc: string }[] = [
  { value: "cool-indoor", label: "Cool indoor storage", desc: "Refrigerated or cool room" },
  { value: "room-temp", label: "Room temperature", desc: "Normal indoor temperature" },
  { value: "sometimes-heat", label: "Sometimes heat-exposed", desc: "Occasionally left in car/sun" },
  { value: "often-heat", label: "Often heat-exposed", desc: "Frequently left in car/sun" },
]

const BUILDING_AGE_OPTIONS: { value: BuildingAge; label: string }[] = [
  { value: "new", label: "Built in last 10 years" },
  { value: "10-30", label: "10-30 years old" },
  { value: "30-50", label: "30-50 years old" },
  { value: "50-plus", label: "More than 50 years old" },
  { value: "unknown", label: "Unknown" },
]

const WATER_ISSUE_OPTIONS: { value: WaterIssue; label: string }[] = [
  { value: "none", label: "No issues noticed" },
  { value: "taste", label: "Unusual taste" },
  { value: "odor", label: "Unusual odor" },
  { value: "color", label: "Discoloration" },
  { value: "hardness", label: "Hard water (scale buildup)" },
  { value: "multiple", label: "Multiple issues" },
]

const INTAKE_OPTIONS: { value: WaterAnswers["dailyWaterIntake"]; label: string }[] = [
  { value: "less-than-1L", label: "Less than 1 liter" },
  { value: "1-2L", label: "1-2 liters" },
  { value: "2-3L", label: "2-3 liters (recommended)" },
  { value: "more-than-3L", label: "More than 3 liters" },
]

const FREQUENCY_OPTIONS: { value: WaterAnswers["bottledFrequency"]; label: string }[] = [
  { value: "never", label: "Never" },
  { value: "rarely", label: "Rarely (few times a month)" },
  { value: "weekly", label: "Weekly" },
  { value: "daily", label: "Daily" },
  { value: "primary", label: "Primary water source" },
]

export function WaterSection({ onResult }: WaterSectionProps) {
  const countries = useMemo(() => getWaterCountries(), [])

  const [answers, setAnswers] = useState<Partial<WaterAnswers>>({
    filterMaintained: true,
    plasticBottlesPerWeek: 0,
    knownPipeIssues: false,
    recentRenovation: false,
  })
  const [result, setResult] = useState<WaterResult | null>(null)
  const [step, setStep] = useState(1)

  const updateAnswer = <K extends keyof WaterAnswers>(key: K, value: WaterAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  const canProceedStep1 = answers.country && answers.primarySource
  const canProceedStep2 = answers.filtration !== undefined
  const canProceedStep3 =
    answers.bottledFrequency !== undefined &&
    (answers.bottledFrequency === "never" ||
      (answers.bottleType !== undefined && answers.bottleStorage !== undefined))
  const canProceedStep4 = answers.buildingAge && answers.observedIssues
  const canCalculate = canProceedStep4 && answers.dailyWaterIntake

  function handleCalculate() {
    if (!canCalculate) return
    const waterResult = calculateWaterQuality(answers as WaterAnswers)
    setResult(waterResult)
    onResult(waterResult.score)
  }

  const showPlasticQuestions =
    answers.bottledFrequency &&
    answers.bottledFrequency !== "never" &&
    answers.bottleType &&
    (answers.bottleType === "plastic" || answers.bottleType === "reusable-plastic")

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">
            Water Quality Assessment
          </h1>
          <p className="text-sm text-muted-foreground">
            Combines country-level data with your personal water consumption
            habits, including microplastic exposure from plastic bottles.
          </p>
        </div>

        {/* Step 1: Location & Source */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <Droplets className="h-5 w-5 text-primary" />
              Step 1: Location & Water Source
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Country *</Label>
              <Select
                value={answers.country || ""}
                onValueChange={(v) => updateAnswer("country", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Used to determine baseline water infrastructure quality (WHO/UNICEF data)
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Label className="text-foreground">Primary Drinking Water Source *</Label>
              <RadioGroup
                value={answers.primarySource || ""}
                onValueChange={(v) => updateAnswer("primarySource", v as WaterSource)}
                className="grid gap-2 sm:grid-cols-2"
              >
                {SOURCE_OPTIONS.map((opt) => (
                  <Label
                    key={opt.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                      answers.primarySource === opt.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem value={opt.value} className="mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-foreground">{opt.label}</span>
                      <span className="text-xs text-muted-foreground">{opt.desc}</span>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {canProceedStep1 && step === 1 && (
              <Button onClick={() => setStep(2)} className="self-start">
                Continue
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Filtration */}
        {step >= 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                <FlaskConical className="h-5 w-5 text-primary" />
                Step 2: Home Water Filtration
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <Label className="text-foreground">Filtration System *</Label>
                <RadioGroup
                  value={answers.filtration || ""}
                  onValueChange={(v) => updateAnswer("filtration", v as FiltrationType)}
                  className="grid gap-2 sm:grid-cols-2"
                >
                  {FILTER_OPTIONS.map((opt) => (
                    <Label
                      key={opt.value}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                        answers.filtration === opt.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value={opt.value} className="mt-0.5" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-foreground">{opt.label}</span>
                        <span className="text-xs text-muted-foreground">{opt.desc}</span>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {answers.filtration && answers.filtration !== "none" && (
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <Switch
                    id="filter-maintained"
                    checked={answers.filterMaintained}
                    onCheckedChange={(v) => updateAnswer("filterMaintained", v)}
                  />
                  <div className="flex flex-col gap-0.5">
                    <Label htmlFor="filter-maintained" className="text-sm font-medium text-foreground">
                      Filter regularly maintained/replaced
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      Unmaintained filters can harbor bacteria
                    </span>
                  </div>
                </div>
              )}

              {canProceedStep2 && step === 2 && (
                <Button onClick={() => setStep(3)} className="self-start">
                  Continue
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Bottled Water & Plastic */}
        {step >= 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                <Droplets className="h-5 w-5 text-primary" />
                Step 3: Bottled Water & Microplastics
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">
                      WHO (2022) & PNAS (2024): Plastic bottles contain 10-100x more
                      microplastics than tap water. Heat exposure increases chemical leaching.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <Label className="text-foreground">How often do you drink bottled water? *</Label>
                <RadioGroup
                  value={answers.bottledFrequency || ""}
                  onValueChange={(v) =>
                    updateAnswer("bottledFrequency", v as WaterAnswers["bottledFrequency"])
                  }
                  className="grid gap-2 sm:grid-cols-3"
                >
                  {FREQUENCY_OPTIONS.map((opt) => (
                    <Label
                      key={opt.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                        answers.bottledFrequency === opt.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value={opt.value} />
                      <span className="text-sm text-foreground">{opt.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {answers.bottledFrequency && answers.bottledFrequency !== "never" && (
                <>
                  <div className="flex flex-col gap-3">
                    <Label className="text-foreground">Primary bottle type *</Label>
                    <RadioGroup
                      value={answers.bottleType || ""}
                      onValueChange={(v) => updateAnswer("bottleType", v as BottleType)}
                      className="grid gap-2 sm:grid-cols-2"
                    >
                      {BOTTLE_OPTIONS.filter((o) => o.value !== "none").map((opt) => (
                        <Label
                          key={opt.value}
                          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                            answers.bottleType === opt.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:bg-muted/50"
                          }`}
                        >
                          <RadioGroupItem value={opt.value} className="mt-0.5" />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-foreground">{opt.label}</span>
                            <span
                              className={`text-xs ${
                                opt.risk === "No risk"
                                  ? "text-[hsl(var(--success))]"
                                  : opt.risk === "Moderate risk"
                                    ? "text-[hsl(var(--accent))]"
                                    : "text-muted-foreground"
                              }`}
                            >
                              Microplastic risk: {opt.risk}
                            </span>
                          </div>
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>

                  {showPlasticQuestions && (
                    <>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-foreground">
                            Plastic bottles per week
                          </Label>
                          <span className="text-sm font-bold text-foreground">
                            {answers.plasticBottlesPerWeek}
                          </span>
                        </div>
                        <Slider
                          value={[answers.plasticBottlesPerWeek || 0]}
                          onValueChange={([v]) => updateAnswer("plasticBottlesPerWeek", v)}
                          min={0}
                          max={30}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0</span>
                          <span>5</span>
                          <span>10</span>
                          <span>20</span>
                          <span>30+</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <Label className="text-foreground">
                          How are your plastic bottles usually stored? *
                        </Label>
                        <RadioGroup
                          value={answers.bottleStorage || ""}
                          onValueChange={(v) => updateAnswer("bottleStorage", v as StorageCondition)}
                          className="grid gap-2 sm:grid-cols-2"
                        >
                          {STORAGE_OPTIONS.map((opt) => (
                            <Label
                              key={opt.value}
                              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                                answers.bottleStorage === opt.value
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:bg-muted/50"
                              }`}
                            >
                              <RadioGroupItem value={opt.value} className="mt-0.5" />
                              <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium text-foreground">
                                  {opt.label}
                                </span>
                                <span className="text-xs text-muted-foreground">{opt.desc}</span>
                              </div>
                            </Label>
                          ))}
                        </RadioGroup>
                        <p className="text-xs text-muted-foreground">
                          Heat increases BPA and phthalate leaching by up to 55x (Rochester & Bolden 2015)
                        </p>
                      </div>
                    </>
                  )}

                  {answers.bottleType &&
                    answers.bottleType !== "plastic" &&
                    answers.bottleType !== "reusable-plastic" && (
                      <div className="flex flex-col gap-3">
                        <Label className="text-foreground">
                          How are your bottles usually stored? *
                        </Label>
                        <RadioGroup
                          value={answers.bottleStorage || ""}
                          onValueChange={(v) => updateAnswer("bottleStorage", v as StorageCondition)}
                          className="grid gap-2 sm:grid-cols-2"
                        >
                          {STORAGE_OPTIONS.slice(0, 2).map((opt) => (
                            <Label
                              key={opt.value}
                              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                                answers.bottleStorage === opt.value
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:bg-muted/50"
                              }`}
                            >
                              <RadioGroupItem value={opt.value} />
                              <span className="text-sm text-foreground">{opt.label}</span>
                            </Label>
                          ))}
                        </RadioGroup>
                      </div>
                    )}
                </>
              )}

              {canProceedStep3 && step === 3 && (
                <Button onClick={() => setStep(4)} className="self-start">
                  Continue
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 4: Infrastructure & Hydration */}
        {step >= 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                <Droplets className="h-5 w-5 text-primary" />
                Step 4: Infrastructure & Hydration
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <Label className="text-foreground">Building/Home Age *</Label>
                <RadioGroup
                  value={answers.buildingAge || ""}
                  onValueChange={(v) => updateAnswer("buildingAge", v as BuildingAge)}
                  className="grid gap-2 sm:grid-cols-3"
                >
                  {BUILDING_AGE_OPTIONS.map((opt) => (
                    <Label
                      key={opt.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                        answers.buildingAge === opt.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value={opt.value} />
                      <span className="text-sm text-foreground">{opt.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                  Buildings before 1986 may have lead pipes (varies by country)
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <Switch
                    id="pipe-issues"
                    checked={answers.knownPipeIssues}
                    onCheckedChange={(v) => updateAnswer("knownPipeIssues", v)}
                  />
                  <Label htmlFor="pipe-issues" className="text-sm text-foreground">
                    Known pipe issues or plumbing problems
                  </Label>
                </div>

                {(answers.buildingAge === "30-50" || answers.buildingAge === "50-plus") && (
                  <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <Switch
                      id="renovation"
                      checked={answers.recentRenovation}
                      onCheckedChange={(v) => updateAnswer("recentRenovation", v)}
                    />
                    <div className="flex flex-col gap-0.5">
                      <Label htmlFor="renovation" className="text-sm text-foreground">
                        Recent renovation or construction
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        Can disturb old pipes and release lead
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Label className="text-foreground">Any observed water quality issues? *</Label>
                <RadioGroup
                  value={answers.observedIssues || ""}
                  onValueChange={(v) => updateAnswer("observedIssues", v as WaterIssue)}
                  className="grid gap-2 sm:grid-cols-3"
                >
                  {WATER_ISSUE_OPTIONS.map((opt) => (
                    <Label
                      key={opt.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                        answers.observedIssues === opt.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value={opt.value} />
                      <span className="text-sm text-foreground">{opt.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex flex-col gap-3">
                <Label className="text-foreground">Daily Water Intake *</Label>
                <RadioGroup
                  value={answers.dailyWaterIntake || ""}
                  onValueChange={(v) =>
                    updateAnswer("dailyWaterIntake", v as WaterAnswers["dailyWaterIntake"])
                  }
                  className="grid gap-2 sm:grid-cols-2"
                >
                  {INTAKE_OPTIONS.map((opt) => (
                    <Label
                      key={opt.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                        answers.dailyWaterIntake === opt.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value={opt.value} />
                      <span className="text-sm text-foreground">{opt.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <Button onClick={handleCalculate} disabled={!canCalculate} className="self-start">
                Calculate Water Quality Score
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && <WaterResults result={result} />}
      </div>
    </TooltipProvider>
  )
}

function WaterResults({ result }: { result: WaterResult }) {
  const {
    score,
    category,
    riskLevel,
    countryBaseline,
    personalFactors,
    microplasticRisk,
    recommendations,
    breakdown,
  } = result

  const isGood = score >= 70

  return (
    <div className="flex flex-col gap-4">
      {/* Score Banner */}
      <Card className="overflow-hidden">
        <div
          className="p-6"
          style={{ backgroundColor: getScoreColor(score), color: "#fff" }}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-3">
              <span className="text-5xl font-bold">{score}</span>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium opacity-80">/ 100</span>
                <span className="text-lg font-semibold">{category}</span>
              </div>
            </div>
            <div className="flex gap-4 text-sm opacity-90">
              <span>Country baseline: {countryBaseline}</span>
              <span>Personal factors: {personalFactors}</span>
            </div>
          </div>
        </div>

        <CardContent className="flex flex-col gap-6 pt-6">
          {/* Breakdown */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground">Score Breakdown</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              <BreakdownItem label="Country Infrastructure" value={breakdown.countryScore} weight="25%" />
              <BreakdownItem label="Water Source" value={breakdown.sourceScore} weight="20%" />
              <BreakdownItem label="Filtration" value={breakdown.filtrationScore} weight="20%" />
              <BreakdownItem label="Plastic Exposure" value={breakdown.plasticScore} weight="20%" />
              <BreakdownItem label="Infrastructure" value={breakdown.infrastructureScore} weight="10%" />
              <BreakdownItem label="Hydration" value={breakdown.hydrationScore} weight="5%" />
            </div>
          </div>

          {/* Microplastic Risk */}
          <div
            className={`flex items-center gap-3 rounded-lg p-4 ${
              microplasticRisk === "low"
                ? "bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/20"
                : microplasticRisk === "moderate"
                  ? "bg-[hsl(var(--warning))]/10 border border-[hsl(var(--warning))]/20"
                  : "bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20"
            }`}
          >
            {microplasticRisk === "low" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[hsl(var(--success))]" />
            ) : (
              <AlertTriangle
                className={`h-5 w-5 shrink-0 ${
                  microplasticRisk === "moderate"
                    ? "text-[hsl(var(--warning))]"
                    : "text-[hsl(var(--accent))]"
                }`}
              />
            )}
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-foreground">
                Microplastic Exposure Risk: {microplasticRisk.charAt(0).toUpperCase() + microplasticRisk.slice(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                {microplasticRisk === "low"
                  ? "Your water consumption habits minimize microplastic exposure."
                  : microplasticRisk === "moderate"
                    ? "Some exposure from plastic bottles. Consider glass or metal alternatives."
                    : "High exposure from plastic bottles. Heat exposure increases chemical leaching."}
              </span>
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-foreground">Recommendations</h3>
              <ul className="flex flex-col gap-2">
                {recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Country baseline from WHO/UNICEF Joint Monitoring Programme (JMP) 2023 and
        Environmental Performance Index 2024. Microplastic data from WHO (2022),
        Mason et al. (2018), and PNAS (2024). BPA leaching research from Rochester & Bolden (2015).
      </p>
    </div>
  )
}

function BreakdownItem({
  label,
  value,
  weight,
}: {
  label: string
  value: number
  weight: string
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs text-muted-foreground/70">{weight}</span>
      </div>
      <span
        className="text-sm font-bold"
        style={{ color: getScoreColor(value) }}
      >
        {value}
      </span>
    </div>
  )
}
