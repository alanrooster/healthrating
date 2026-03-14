"use client"

import { useState } from "react"
import {
  Briefcase,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Home,
  UserX,
  Palmtree,
  Brain,
  Users,
  Shield,
  Info,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  calculateWork,
  EMPLOYMENT_OPTIONS,
  WORK_STRESS_QUESTIONS,
  type WorkAnswers,
  type WorkResult,
  type EmploymentStatus,
} from "@/lib/work-calculator"
import { getScoreColor } from "@/lib/health-score"

interface WorkSectionProps {
  onResult: (score: number) => void
  storedResult?: WorkResult | null
  onStoreResult?: (result: WorkResult) => void
  onRetake?: () => void
}

const DEFAULT_ANSWERS: WorkAnswers = {
  employmentStatus: "employed",
  // Schedule
  workingHoursPerDay: 8,
  daysPerWeek: 5,
  shiftType: "day",
  yearsOfShiftWork: 0,
  commuteMinutes: 30,
  // Burnout
  workExhaustion: "sometimes",
  workOverwhelm: "sometimes",
  cynicism: "rarely",
  // Demands
  quantitativeDemands: "sometimes",
  emotionalDemands: "sometimes",
  cognitiveDemands: "sometimes",
  // Resources
  jobControl: "moderate",
  roleClarity: "clear",
  meaningOfWork: "meaningful",
  possibilitiesForDevelopment: "moderate",
  // Relationships
  socialSupportColleagues: "often",
  socialSupportSupervisor: "sometimes",
  qualityOfLeadership: "adequate",
  organizationalJustice: "usually-fair",
  recognition: "fairly-recognized",
  workplaceConflict: "rarely",
  bullyingExposure: "never",
  senseOfCommunity: "moderate",
  workLifeConflict: "sometimes",
  // Security
  jobSecurity: "secure",
  jobInsecurityConditions: "slightly-worried",
  effortRewardBalance: "fairly-rewarded",
  // Unemployed
  unemploymentDuration: "less-than-3-months",
  jobSearchStress: "moderate",
  financialStress: "moderate",
  socialIsolation: "slightly",
  // Retired
  retirementSatisfaction: "satisfied",
  purposeInRetirement: "moderate",
  volunteeringEngagement: "occasional",
  // Student
  academicStress: "moderate",
  studyHoursPerDay: 6,
  academicSupport: "sometimes",
}

const STATUS_ICONS: Record<EmploymentStatus, React.ComponentType<{ className?: string }>> = {
  employed: Briefcase,
  freelancer: Briefcase,
  entrepreneur: Briefcase,
  unemployed: UserX,
  retired: Palmtree,
  student: GraduationCap,
  homemaker: Home,
  "unable-to-work": Home,
}

type StepType = "status" | "schedule" | "burnout" | "demands" | "resources" | "relationships" | "security"

const STEP_INFO: Record<StepType, { title: string; icon: React.ComponentType<{ className?: string }>; description: string }> = {
  status: { title: "Employment Status", icon: Briefcase, description: "Select your current situation" },
  schedule: { title: "Work Schedule", icon: Clock, description: "Hours, shifts, and commute" },
  burnout: { title: "Burnout & Exhaustion", icon: AlertTriangle, description: "Based on Copenhagen Burnout Inventory" },
  demands: { title: "Job Demands", icon: Brain, description: "Workload and pressure (COPSOQ III)" },
  resources: { title: "Job Resources", icon: CheckCircle2, description: "Control, clarity, and meaning" },
  relationships: { title: "Workplace Relationships", icon: Users, description: "Support, justice, and culture" },
  security: { title: "Job Security", icon: Shield, description: "Stability and rewards" },
}

const FREQUENCY_OPTIONS = [
  { value: "never", label: "Never" },
  { value: "rarely", label: "Rarely" },
  { value: "sometimes", label: "Sometimes" },
  { value: "often", label: "Often" },
  { value: "always", label: "Always" },
]

const SUPPORT_OPTIONS = [
  { value: "always", label: "Always" },
  { value: "often", label: "Often" },
  { value: "sometimes", label: "Sometimes" },
  { value: "rarely", label: "Rarely" },
  { value: "never", label: "Never" },
]

export function WorkSection({ onResult, storedResult, onStoreResult, onRetake }: WorkSectionProps) {
  const [answers, setAnswers] = useState<WorkAnswers>(DEFAULT_ANSWERS)
  const [result, setResult] = useState<WorkResult | null>(storedResult ?? null)
  const [step, setStep] = useState<StepType>("status")

  function updateAnswer<K extends keyof WorkAnswers>(id: K, value: WorkAnswers[K]) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function handleStatusSelect(status: EmploymentStatus) {
    updateAnswer("employmentStatus", status)

    if (status === "homemaker" || status === "unable-to-work") {
      const newAnswers = { ...answers, employmentStatus: status }
      const r = calculateWork(newAnswers)
      setResult(r)
      onResult(r.overallScore)
    } else if (status === "retired" || status === "unemployed" || status === "student") {
      setStep("schedule") // Go to status-specific questions
    } else {
      setStep("schedule") // Work schedule for employed/freelancer/entrepreneur
    }
  }

  const isWorking =
    answers.employmentStatus === "employed" ||
    answers.employmentStatus === "freelancer" ||
    answers.employmentStatus === "entrepreneur"

  const workingSteps: StepType[] = ["status", "schedule", "burnout", "demands", "resources", "relationships", "security"]
  const otherSteps: StepType[] = ["status", "schedule"]

  const steps = isWorking ? workingSteps : otherSteps

  function handleNext() {
    const currentIndex = steps.indexOf(step)
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1])
    } else {
      handleCalculate()
    }
  }

  function handleBack() {
    const currentIndex = steps.indexOf(step)
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1])
    }
  }

function handleCalculate() {
  const r = calculateWork(answers)
  setResult(r)
  onStoreResult?.(r)
  onResult(r.overallScore)
  }
  
  function handleReset() {
  setAnswers(DEFAULT_ANSWERS)
  setResult(null)
  setStep("status")
  onRetake?.()
    setStep("status")
  }

  const currentStepIndex = steps.indexOf(step)

  // Helper to render frequency select
  function FrequencySelect({
    id,
    value,
    onChange,
    questionKey,
  }: {
    id: string
    value: string
    onChange: (val: string) => void
    questionKey: keyof typeof WORK_STRESS_QUESTIONS
  }) {
    const q = WORK_STRESS_QUESTIONS[questionKey]
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-2">
          <Label className="text-sm text-foreground flex-1">{q.label}</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground shrink-0 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p className="text-xs">
                  <span className="font-medium">{q.domain}</span> — Source: {q.source}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FREQUENCY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  // Helper for custom option selects
  function CustomSelect({
    questionKey,
    value,
    onChange,
  }: {
    questionKey: keyof typeof WORK_STRESS_QUESTIONS
    value: string
    onChange: (val: string) => void
  }) {
    const q = WORK_STRESS_QUESTIONS[questionKey]
    const options = "options" in q ? q.options : []
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-2">
          <Label className="text-sm text-foreground flex-1">{q.label}</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground shrink-0 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p className="text-xs">
                  <span className="font-medium">{q.domain}</span> — Source: {q.source}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Work Assessment
        </h1>
        <p className="text-sm text-muted-foreground">
          Based on COPSOQ III, WHO/ILO guidelines, Copenhagen Burnout Inventory,
          Karasek JDC-S model, and EU-OSHA psychosocial risk framework.
        </p>
      </div>

      {!result ? (
        <>
          {/* Progress indicator */}
          <div className="flex items-center gap-1">
            {steps.map((s, i) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  currentStepIndex >= i ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Step: Employment Status */}
          {step === "status" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Employment Status
                </CardTitle>
                <CardDescription>Select your current employment situation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {EMPLOYMENT_OPTIONS.map((opt) => {
                    const Icon = STATUS_ICONS[opt.value]
                    const isSelected = answers.employmentStatus === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleStatusSelect(opt.value)}
                        className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                            isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-foreground">{opt.label}</span>
                          <p className="text-xs text-muted-foreground">{opt.description}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step: Schedule (varies by status) */}
          {step === "schedule" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Clock className="h-5 w-5 text-primary" />
                  {isWorking
                    ? "Work Schedule"
                    : answers.employmentStatus === "retired"
                      ? "Retirement"
                      : answers.employmentStatus === "unemployed"
                        ? "Unemployment Status"
                        : "Academic Load"}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                {/* Employed/Freelancer/Entrepreneur */}
                {isWorking && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-foreground">Working hours per day</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={answers.workingHoursPerDay}
                          onChange={(e) =>
                            updateAnswer("workingHoursPerDay", Math.min(18, Math.max(0, Number(e.target.value))))
                          }
                          min={0}
                          max={18}
                          step={0.5}
                          className="w-28"
                        />
                        <span className="text-sm text-muted-foreground">hours</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-foreground">Working days per week</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={answers.daysPerWeek}
                          onChange={(e) =>
                            updateAnswer("daysPerWeek", Math.min(7, Math.max(1, Number(e.target.value))))
                          }
                          min={1}
                          max={7}
                          className="w-28"
                        />
                        <span className="text-sm text-muted-foreground">days</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-foreground">Shift type</Label>
                      <Select
                        value={answers.shiftType}
                        onValueChange={(val) => updateAnswer("shiftType", val as WorkAnswers["shiftType"])}
                      >
                        <SelectTrigger className="w-full max-w-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">Day shift (regular hours)</SelectItem>
                          <SelectItem value="flexible">Flexible hours</SelectItem>
                          <SelectItem value="rotating">Rotating shifts</SelectItem>
                          <SelectItem value="night">Permanent night shift</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(answers.shiftType === "rotating" || answers.shiftType === "night") && (
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-sm text-foreground">Years of shift/night work</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={answers.yearsOfShiftWork}
                            onChange={(e) =>
                              updateAnswer("yearsOfShiftWork", Math.min(50, Math.max(0, Number(e.target.value))))
                            }
                            min={0}
                            max={50}
                            className="w-28"
                          />
                          <span className="text-sm text-muted-foreground">years</span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-foreground">Daily commute time (one way)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={answers.commuteMinutes}
                          onChange={(e) =>
                            updateAnswer("commuteMinutes", Math.min(180, Math.max(0, Number(e.target.value))))
                          }
                          min={0}
                          max={180}
                          className="w-28"
                        />
                        <span className="text-sm text-muted-foreground">minutes</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Unemployed */}
                {answers.employmentStatus === "unemployed" && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-foreground">How long have you been unemployed?</Label>
                      <Select
                        value={answers.unemploymentDuration}
                        onValueChange={(val) => updateAnswer("unemploymentDuration", val as WorkAnswers["unemploymentDuration"])}
                      >
                        <SelectTrigger className="w-full max-w-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="less-than-3-months">Less than 3 months</SelectItem>
                          <SelectItem value="3-6-months">3-6 months</SelectItem>
                          <SelectItem value="6-12-months">6-12 months</SelectItem>
                          <SelectItem value="over-1-year">Over 1 year</SelectItem>
                          <SelectItem value="over-2-years">Over 2 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-foreground">Job search stress level</Label>
                      <Select
                        value={answers.jobSearchStress}
                        onValueChange={(val) => updateAnswer("jobSearchStress", val as WorkAnswers["jobSearchStress"])}
                      >
                        <SelectTrigger className="w-full max-w-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="mild">Mild</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="severe">Severe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-foreground">Financial stress level</Label>
                      <Select
                        value={answers.financialStress}
                        onValueChange={(val) => updateAnswer("financialStress", val as WorkAnswers["financialStress"])}
                      >
                        <SelectTrigger className="w-full max-w-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="mild">Mild</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="severe">Severe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-foreground">Social isolation level</Label>
                      <Select
                        value={answers.socialIsolation}
                        onValueChange={(val) => updateAnswer("socialIsolation", val as WorkAnswers["socialIsolation"])}
                      >
                        <SelectTrigger className="w-full max-w-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-isolated">Not isolated - Regular social contact</SelectItem>
                          <SelectItem value="slightly">Slightly isolated</SelectItem>
                          <SelectItem value="moderately">Moderately isolated</SelectItem>
                          <SelectItem value="very">Very isolated - Rare social contact</SelectItem>
                          <SelectItem value="completely">Completely isolated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Retired */}
                {answers.employmentStatus === "retired" && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-foreground">How satisfied are you with retirement?</Label>
                      <Select
                        value={answers.retirementSatisfaction}
                        onValueChange={(val) => updateAnswer("retirementSatisfaction", val as WorkAnswers["retirementSatisfaction"])}
                      >
                        <SelectTrigger className="w-full max-w-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="very-satisfied">Very satisfied</SelectItem>
                          <SelectItem value="satisfied">Satisfied</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="dissatisfied">Dissatisfied</SelectItem>
                          <SelectItem value="very-dissatisfied">Very dissatisfied</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-foreground">Sense of purpose in retirement</Label>
                      <p className="text-xs text-muted-foreground">Activities, hobbies, goals that give meaning</p>
                      <Select
                        value={answers.purposeInRetirement}
                        onValueChange={(val) => updateAnswer("purposeInRetirement", val as WorkAnswers["purposeInRetirement"])}
                      >
                        <SelectTrigger className="w-full max-w-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="strong">Strong sense of purpose</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="some">Some purpose</SelectItem>
                          <SelectItem value="little">Little purpose</SelectItem>
                          <SelectItem value="none">No sense of purpose</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-foreground">Social engagement</Label>
                      <p className="text-xs text-muted-foreground">Volunteering, community activities, regular social contact</p>
                      <Select
                        value={answers.volunteeringEngagement}
                        onValueChange={(val) => updateAnswer("volunteeringEngagement", val as WorkAnswers["volunteeringEngagement"])}
                      >
                        <SelectTrigger className="w-full max-w-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="very-active">Very active - Regular involvement</SelectItem>
                          <SelectItem value="active">Active - Frequent participation</SelectItem>
                          <SelectItem value="occasional">Occasional involvement</SelectItem>
                          <SelectItem value="rare">Rare participation</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Student */}
                {answers.employmentStatus === "student" && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-foreground">Academic stress level</Label>
                      <Select
                        value={answers.academicStress}
                        onValueChange={(val) => updateAnswer("academicStress", val as WorkAnswers["academicStress"])}
                      >
                        <SelectTrigger className="w-full max-w-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="mild">Mild</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="severe">Severe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-foreground">Study hours per day</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={answers.studyHoursPerDay}
                          onChange={(e) =>
                            updateAnswer("studyHoursPerDay", Math.min(18, Math.max(0, Number(e.target.value))))
                          }
                          min={0}
                          max={18}
                          className="w-28"
                        />
                        <span className="text-sm text-muted-foreground">hours</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-foreground">Academic support</Label>
                      <p className="text-xs text-muted-foreground">Support from institution, professors, peers</p>
                      <Select
                        value={answers.academicSupport}
                        onValueChange={(val) => updateAnswer("academicSupport", val as WorkAnswers["academicSupport"])}
                      >
                        <SelectTrigger className="w-full max-w-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="always">Always available</SelectItem>
                          <SelectItem value="often">Often available</SelectItem>
                          <SelectItem value="sometimes">Sometimes available</SelectItem>
                          <SelectItem value="rarely">Rarely available</SelectItem>
                          <SelectItem value="never">Never available</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  {isWorking ? (
                    <Button onClick={handleNext}>
                      Continue
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleCalculate}>Calculate Score</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step: Burnout (CBI/MBI) */}
          {step === "burnout" && isWorking && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Burnout & Exhaustion
                </CardTitle>
                <CardDescription>
                  Based on Copenhagen Burnout Inventory (CBI) and Maslach Burnout Inventory (MBI)
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <FrequencySelect
                  id="workExhaustion"
                  value={answers.workExhaustion}
                  onChange={(val) => updateAnswer("workExhaustion", val as WorkAnswers["workExhaustion"])}
                  questionKey="workExhaustion"
                />
                <FrequencySelect
                  id="workOverwhelm"
                  value={answers.workOverwhelm}
                  onChange={(val) => updateAnswer("workOverwhelm", val as WorkAnswers["workOverwhelm"])}
                  questionKey="workOverwhelm"
                />
                <FrequencySelect
                  id="cynicism"
                  value={answers.cynicism}
                  onChange={(val) => updateAnswer("cynicism", val as WorkAnswers["cynicism"])}
                  questionKey="cynicism"
                />

                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline" onClick={handleBack}>Back</Button>
                  <Button onClick={handleNext}>
                    Continue
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step: Job Demands (COPSOQ III) */}
          {step === "demands" && isWorking && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Brain className="h-5 w-5 text-primary" />
                  Job Demands
                </CardTitle>
                <CardDescription>
                  Workload, emotional demands, and cognitive load (COPSOQ III)
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <FrequencySelect
                  id="quantitativeDemands"
                  value={answers.quantitativeDemands}
                  onChange={(val) => updateAnswer("quantitativeDemands", val as WorkAnswers["quantitativeDemands"])}
                  questionKey="quantitativeDemands"
                />
                <FrequencySelect
                  id="emotionalDemands"
                  value={answers.emotionalDemands}
                  onChange={(val) => updateAnswer("emotionalDemands", val as WorkAnswers["emotionalDemands"])}
                  questionKey="emotionalDemands"
                />
                <FrequencySelect
                  id="cognitiveDemands"
                  value={answers.cognitiveDemands}
                  onChange={(val) => updateAnswer("cognitiveDemands", val as WorkAnswers["cognitiveDemands"])}
                  questionKey="cognitiveDemands"
                />

                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline" onClick={handleBack}>Back</Button>
                  <Button onClick={handleNext}>
                    Continue
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step: Job Resources */}
          {step === "resources" && isWorking && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Job Resources
                </CardTitle>
                <CardDescription>
                  Control, clarity, meaning, and development (COPSOQ III, Karasek JDC)
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <CustomSelect
                  questionKey="jobControl"
                  value={answers.jobControl}
                  onChange={(val) => updateAnswer("jobControl", val as WorkAnswers["jobControl"])}
                />
                <CustomSelect
                  questionKey="roleClarity"
                  value={answers.roleClarity}
                  onChange={(val) => updateAnswer("roleClarity", val as WorkAnswers["roleClarity"])}
                />
                <CustomSelect
                  questionKey="meaningOfWork"
                  value={answers.meaningOfWork}
                  onChange={(val) => updateAnswer("meaningOfWork", val as WorkAnswers["meaningOfWork"])}
                />
                <CustomSelect
                  questionKey="possibilitiesForDevelopment"
                  value={answers.possibilitiesForDevelopment}
                  onChange={(val) => updateAnswer("possibilitiesForDevelopment", val as WorkAnswers["possibilitiesForDevelopment"])}
                />

                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline" onClick={handleBack}>Back</Button>
                  <Button onClick={handleNext}>
                    Continue
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step: Workplace Relationships */}
          {step === "relationships" && isWorking && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Users className="h-5 w-5 text-primary" />
                  Workplace Relationships
                </CardTitle>
                <CardDescription>
                  Support, leadership, justice, and work-life balance (COPSOQ III, EU-OSHA)
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                {/* Social Support */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-start gap-2">
                    <Label className="text-sm text-foreground flex-1">{WORK_STRESS_QUESTIONS.socialSupportColleagues.label}</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground shrink-0 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <p className="text-xs">Source: {WORK_STRESS_QUESTIONS.socialSupportColleagues.source}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select
                    value={answers.socialSupportColleagues}
                    onValueChange={(val) => updateAnswer("socialSupportColleagues", val as WorkAnswers["socialSupportColleagues"])}
                  >
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-start gap-2">
                    <Label className="text-sm text-foreground flex-1">{WORK_STRESS_QUESTIONS.socialSupportSupervisor.label}</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground shrink-0 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <p className="text-xs">Source: {WORK_STRESS_QUESTIONS.socialSupportSupervisor.source}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select
                    value={answers.socialSupportSupervisor}
                    onValueChange={(val) => updateAnswer("socialSupportSupervisor", val as WorkAnswers["socialSupportSupervisor"])}
                  >
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <CustomSelect
                  questionKey="qualityOfLeadership"
                  value={answers.qualityOfLeadership}
                  onChange={(val) => updateAnswer("qualityOfLeadership", val as WorkAnswers["qualityOfLeadership"])}
                />
                <CustomSelect
                  questionKey="organizationalJustice"
                  value={answers.organizationalJustice}
                  onChange={(val) => updateAnswer("organizationalJustice", val as WorkAnswers["organizationalJustice"])}
                />
                <CustomSelect
                  questionKey="recognition"
                  value={answers.recognition}
                  onChange={(val) => updateAnswer("recognition", val as WorkAnswers["recognition"])}
                />

                <FrequencySelect
                  id="workplaceConflict"
                  value={answers.workplaceConflict}
                  onChange={(val) => updateAnswer("workplaceConflict", val as WorkAnswers["workplaceConflict"])}
                  questionKey="workplaceConflict"
                />

                <CustomSelect
                  questionKey="bullyingExposure"
                  value={answers.bullyingExposure}
                  onChange={(val) => updateAnswer("bullyingExposure", val as WorkAnswers["bullyingExposure"])}
                />

                <CustomSelect
                  questionKey="senseOfCommunity"
                  value={answers.senseOfCommunity}
                  onChange={(val) => updateAnswer("senseOfCommunity", val as WorkAnswers["senseOfCommunity"])}
                />

                <FrequencySelect
                  id="workLifeConflict"
                  value={answers.workLifeConflict}
                  onChange={(val) => updateAnswer("workLifeConflict", val as WorkAnswers["workLifeConflict"])}
                  questionKey="workLifeConflict"
                />

                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline" onClick={handleBack}>Back</Button>
                  <Button onClick={handleNext}>
                    Continue
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step: Job Security */}
          {step === "security" && isWorking && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Shield className="h-5 w-5 text-primary" />
                  Job Security & Rewards
                </CardTitle>
                <CardDescription>
                  Stability, conditions, and effort-reward balance (COPSOQ III, Siegrist ERI)
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <CustomSelect
                  questionKey="jobSecurity"
                  value={answers.jobSecurity}
                  onChange={(val) => updateAnswer("jobSecurity", val as WorkAnswers["jobSecurity"])}
                />
                <CustomSelect
                  questionKey="jobInsecurityConditions"
                  value={answers.jobInsecurityConditions}
                  onChange={(val) => updateAnswer("jobInsecurityConditions", val as WorkAnswers["jobInsecurityConditions"])}
                />
                <CustomSelect
                  questionKey="effortRewardBalance"
                  value={answers.effortRewardBalance}
                  onChange={(val) => updateAnswer("effortRewardBalance", val as WorkAnswers["effortRewardBalance"])}
                />

                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline" onClick={handleBack}>Back</Button>
                  <Button onClick={handleCalculate}>Calculate Score</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        /* Results */
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">
                Work Health Score
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Overall Score */}
              <div className="flex items-center gap-6">
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-full border-4"
                  style={{ borderColor: getScoreColor(result.overallScore) }}
                >
                  <span className="text-3xl font-bold text-foreground">
                    {result.overallScore}
                  </span>
                </div>
                <div>
                  <p
                    className="text-xl font-semibold"
                    style={{ color: getScoreColor(result.overallScore) }}
                  >
                    {result.category}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {result.employmentStatus === "employed"
                      ? "Employed"
                      : result.employmentStatus === "freelancer"
                        ? "Freelancer"
                        : result.employmentStatus === "entrepreneur"
                          ? "Entrepreneur"
                          : result.employmentStatus === "retired"
                            ? "Retired"
                            : result.employmentStatus === "unemployed"
                              ? "Unemployed"
                              : result.employmentStatus === "student"
                                ? "Student"
                                : "Other"}
                  </p>
                </div>
              </div>

              {/* Sub-scores for working individuals */}
              {isWorking && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { label: "Schedule", score: result.subScores.schedule, icon: Clock },
                    { label: "Burnout", score: result.subScores.burnout, icon: AlertTriangle },
                    { label: "Demands", score: result.subScores.demands, icon: Brain },
                    { label: "Resources", score: result.subScores.resources, icon: CheckCircle2 },
                    { label: "Relationships", score: result.subScores.relationships, icon: Users },
                    { label: "Security", score: result.subScores.security, icon: Shield },
                  ].map((sub) => (
                    <div
                      key={sub.label}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <sub.icon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">{sub.label}</p>
                        <p
                          className="text-lg font-semibold"
                          style={{ color: getScoreColor(sub.score) }}
                        >
                          {sub.score}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Risk Factors */}
          {result.riskFactors.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Risk Factors Identified
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-2">
                  {result.riskFactors.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-2">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Button onClick={handleReset} variant="outline">
            Retake Assessment
          </Button>
        </div>
      )}
    </div>
  )
}
