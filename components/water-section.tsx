"use client"

import { useState, useMemo } from "react"
import {
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Info,
  FlaskConical,
  ChevronLeft,
  ChevronRight,
  Building,
  GlassWater,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
import { Progress } from "@/components/ui/progress"
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
  onResult: (score: number, plasticData?: { plasticBottlesPerWeek: number }) => void
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

const STEP_INFO = [
  { title: "Location & Source", icon: Droplets },
  { title: "Home Filtration", icon: FlaskConical },
  { title: "Bottled Water & Microplastics", icon: Droplets },
  { title: "Infrastructure & Quality", icon: Building },
  { title: "Daily Intake", icon: GlassWater },
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
  const [step, setStep] = useState(0)

  const updateAnswer = <K extends keyof WaterAnswers>(key: K, value: WaterAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  // Step validation
  const canProceed = (currentStep: number): boolean => {
    switch (currentStep) {
      case 0:
        return !!(answers.country && answers.primarySource)
      case 1:
        return answers.filtration !== undefined
      case 2:
        return !!(
          answers.bottledFrequency !== undefined &&
          (answers.bottledFrequency === "never" ||
            (answers.bottleType !== undefined && 
             (answers.bottleType === "glass" || 
              answers.bottleType === "reusable-metal" || 
              answers.bottleType === "aluminum" ||
              answers.bottleStorage !== undefined)))
        )
      case 3:
        return !!(answers.buildingAge && answers.observedIssues)
      case 4:
        return answers.dailyWaterIntake !== undefined
      default:
        return false
    }
  }

  const totalSteps = 5

  function handleNext() {
    if (step < totalSteps - 1 && canProceed(step)) {
      setStep(step + 1)
    }
  }

  function handleBack() {
    if (step > 0) {
      setStep(step - 1)
    }
  }

function handleCalculate() {
  if (!canProceed(4)) return
  const waterResult = calculateWaterQuality(answers as WaterAnswers)
  setResult(waterResult)
  // Pass plastic bottle data to carbon calculator
  const plasticData = {
    plasticBottlesPerWeek: answers.bottleType === "plastic" ? (answers.plasticBottlesPerWeek ?? 0) : 0,
  }
  onResult(waterResult.score, plasticData)
  }

  const showPlasticQuestions =
    answers.bottledFrequency &&
    answers.bottledFrequency !== "never" &&
    answers.bottleType &&
    (answers.bottleType === "plastic" || answers.bottleType === "reusable-plastic")

  const needsStorageQuestion =
    answers.bottledFrequency &&
    answers.bottledFrequency !== "never" &&
    answers.bottleType &&
    answers.bottleType !== "glass" &&
    answers.bottleType !== "reusable-metal"

  // Results view
  if (result) {
    return (
      <TooltipProvider>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground text-balance">
              Water Quality Results
            </h1>
            <p className="text-sm text-muted-foreground">
              Based on your location, habits, and microplastic exposure
            </p>
          </div>

          {/* Score Card */}
          <Card className="overflow-hidden">
            <div
              className={`p-6 ${
                result.score >= 75
                  ? "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]"
                  : result.score >= 50
                    ? "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]"
                    : "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"
              }`}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-5xl font-bold">{result.score}</span>
                <span className="text-lg font-semibold">{result.category}</span>
              </div>
            </div>

            <CardContent className="flex flex-col gap-4 pt-6">
              {/* Sub-scores */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <ScoreItem label="Country Baseline" value={result.breakdown.countryScore} />
                <ScoreItem label="Source" value={result.breakdown.sourceScore} />
                <ScoreItem label="Filtration" value={result.breakdown.filtrationScore} />
                <ScoreItem label="Plastic Exposure" value={result.breakdown.plasticScore} />
                <ScoreItem label="Infrastructure" value={result.breakdown.infrastructureScore} />
                <ScoreItem label="Hydration" value={result.breakdown.hydrationScore} />
              </div>

              {/* Microplastic Alert */}
              {result.microplasticRisk !== "none" && (
                <div
                  className={`flex items-start gap-3 rounded-lg border p-4 ${
                    result.microplasticRisk === "high" || result.microplasticRisk === "very-high"
                      ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10"
                      : "border-[hsl(var(--warning))] bg-[hsl(var(--warning))]/10"
                  }`}
                >
                  <AlertTriangle className="h-5 w-5 shrink-0 text-[hsl(var(--accent))]" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-foreground">
                      Microplastic Risk: {result.microplasticRisk.replace("-", " ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Consider switching to glass or metal containers. Avoid heat-exposed plastic bottles.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Button variant="outline" onClick={() => { setResult(null); setStep(0) }}>
            Retake Assessment
          </Button>
        </div>
      </TooltipProvider>
    )
  }

  const StepIcon = STEP_INFO[step].icon

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

        {/* Progress */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Step {step + 1} of {totalSteps}
            </span>
            <span className="font-medium text-foreground">{STEP_INFO[step].title}</span>
          </div>
          <Progress value={((step + 1) / totalSteps) * 100} className="h-2" />
        </div>

        {/* Single Card for Current Step */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <StepIcon className="h-5 w-5 text-primary" />
              {STEP_INFO[step].title}
              {step === 2 && (
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
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-5">
            {/* Step 0: Location & Source */}
            {step === 0 && (
              <>
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
              </>
            )}

            {/* Step 1: Filtration */}
            {step === 1 && (
              <>
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
              </>
            )}

            {/* Step 2: Bottled Water & Plastic */}
            {step === 2 && (
              <>
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
                )}

                {showPlasticQuestions && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground">Plastic bottles per week</Label>
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
                )}

                {needsStorageQuestion && (
                  <div className="flex flex-col gap-3">
                    <Label className="text-foreground">
                      How are your bottles usually stored? *
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
                            <span className="text-sm font-medium text-foreground">{opt.label}</span>
                            <span className="text-xs text-muted-foreground">{opt.desc}</span>
                          </div>
                        </Label>
                      ))}
                    </RadioGroup>
                    {showPlasticQuestions && (
                      <p className="text-xs text-muted-foreground">
                        Heat increases BPA and phthalate leaching by up to 55x (Rochester & Bolden 2015)
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Step 3: Infrastructure */}
            {step === 3 && (
              <>
                <div className="flex flex-col gap-3">
                  <Label className="text-foreground">Building Age *</Label>
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
                    Buildings before 1986 may have lead pipes; before 2014 may have lead solder
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Label className="text-foreground">Observed Water Quality Issues *</Label>
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

                <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="pipe-issues"
                      checked={answers.knownPipeIssues}
                      onCheckedChange={(v) => updateAnswer("knownPipeIssues", v)}
                    />
                    <Label htmlFor="pipe-issues" className="text-sm font-medium text-foreground">
                      Known plumbing/pipe issues
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="recent-reno"
                      checked={answers.recentRenovation}
                      onCheckedChange={(v) => updateAnswer("recentRenovation", v)}
                    />
                    <Label htmlFor="recent-reno" className="text-sm font-medium text-foreground">
                      Recent plumbing renovation (last 5 years)
                    </Label>
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Daily Intake */}
            {step === 4 && (
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
                <p className="text-xs text-muted-foreground">
                  WHO recommends 2-3 liters of water per day for adults
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 0}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            {step < totalSteps - 1 ? (
              <Button onClick={handleNext} disabled={!canProceed(step)} className="gap-1">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleCalculate} disabled={!canProceed(step)}>
                Calculate Score
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </TooltipProvider>
  )
}

function ScoreItem({ label, value }: { label: string; value: number }) {
  const color = getScoreColor(value)
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-secondary p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-lg font-bold ${color}`}>{value}</span>
    </div>
  )
}
