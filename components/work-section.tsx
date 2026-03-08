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
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  calculateWork,
  EMPLOYMENT_OPTIONS,
  type WorkAnswers,
  type WorkResult,
  type EmploymentStatus,
} from "@/lib/work-calculator"
import { getScoreColor } from "@/lib/health-score"

interface WorkSectionProps {
  onResult: (score: number) => void
}

const DEFAULT_ANSWERS: WorkAnswers = {
  employmentStatus: "employed",
  workingHoursPerDay: 8,
  daysPerWeek: 5,
  shiftType: "day",
  yearsOfShiftWork: 0,
  commuteMinutes: 30,
  workExhaustion: "sometimes",
  workOverwhelm: "sometimes",
  effortRewardBalance: "fairly-rewarded",
  jobControl: "moderate",
  jobSecurity: "secure",
  unemploymentDuration: "less-than-3-months",
  jobSearchStress: "moderate",
  financialStress: "moderate",
  retirementSatisfaction: "satisfied",
  purposeInRetirement: "moderate",
  academicStress: "moderate",
  studyHoursPerDay: 6,
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

export function WorkSection({ onResult }: WorkSectionProps) {
  const [answers, setAnswers] = useState<WorkAnswers>(DEFAULT_ANSWERS)
  const [result, setResult] = useState<WorkResult | null>(null)
  const [step, setStep] = useState<"status" | "details" | "stress">("status")

  function updateAnswer<K extends keyof WorkAnswers>(id: K, value: WorkAnswers[K]) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function handleStatusSelect(status: EmploymentStatus) {
    updateAnswer("employmentStatus", status)

    // Determine next step based on status
    if (status === "homemaker" || status === "unable-to-work") {
      // Skip to calculation for these statuses
      const newAnswers = { ...answers, employmentStatus: status }
      const r = calculateWork(newAnswers)
      setResult(r)
      onResult(r.overallScore)
    } else if (status === "retired") {
      setStep("details") // Go to retirement-specific questions
    } else if (status === "unemployed") {
      setStep("details") // Go to unemployment-specific questions
    } else if (status === "student") {
      setStep("details") // Go to student-specific questions
    } else {
      setStep("details") // Go to work schedule for employed/freelancer/entrepreneur
    }
  }

  function handleNext() {
    if (step === "details") {
      // For employed/freelancer/entrepreneur, go to stress questions
      if (
        answers.employmentStatus === "employed" ||
        answers.employmentStatus === "freelancer" ||
        answers.employmentStatus === "entrepreneur"
      ) {
        setStep("stress")
      } else {
        // For others, calculate now
        handleCalculate()
      }
    }
  }

  function handleCalculate() {
    const r = calculateWork(answers)
    setResult(r)
    onResult(r.overallScore)
  }

  function handleReset() {
    setAnswers(DEFAULT_ANSWERS)
    setResult(null)
    setStep("status")
  }

  function handleBack() {
    if (step === "stress") {
      setStep("details")
    } else if (step === "details") {
      setStep("status")
    }
  }

  const isWorking =
    answers.employmentStatus === "employed" ||
    answers.employmentStatus === "freelancer" ||
    answers.employmentStatus === "entrepreneur"

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Work Assessment
        </h1>
        <p className="text-sm text-muted-foreground">
          Based on WHO/ILO occupational health guidelines, Copenhagen Burnout
          Inventory, and Karasek Job Demand-Control model.
        </p>
      </div>

      {!result ? (
        <>
          {/* Progress indicator */}
          <div className="flex items-center gap-1">
            {["status", "details", ...(isWorking ? ["stress"] : [])].map((s, i, arr) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  arr.indexOf(step) >= i ? "bg-primary" : "bg-muted"
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
                <p className="text-xs text-muted-foreground">
                  Select your current employment situation
                </p>
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
                          <span className="text-sm font-medium text-foreground">
                            {opt.label}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {opt.description}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step: Details (varies by status) */}
          {step === "details" && (
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
                {/* Employed/Freelancer/Entrepreneur questions */}
                {isWorking && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-foreground">
                        Working hours per day
                      </Label>
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
                      <Label className="text-sm text-foreground">
                        Working days per week
                      </Label>
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
                        <Label className="text-sm text-foreground">
                          Years of shift/night work
                        </Label>
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
                      <Label className="text-sm text-foreground">
                        Daily commute time (one way)
                      </Label>
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

                {/* Unemployed questions */}
                {answers.employmentStatus === "unemployed" && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-foreground">
                        How long have you been unemployed?
                      </Label>
                      <Select
                        value={answers.unemploymentDuration}
                        onValueChange={(val) =>
                          updateAnswer("unemploymentDuration", val as WorkAnswers["unemploymentDuration"])
                        }
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
                      <Label className="text-sm text-foreground">
                        Job search stress level
                      </Label>
                      <Select
                        value={answers.jobSearchStress}
                        onValueChange={(val) =>
                          updateAnswer("jobSearchStress", val as WorkAnswers["jobSearchStress"])
                        }
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
                      <Label className="text-sm text-foreground">
                        Financial stress level
                      </Label>
                      <Select
                        value={answers.financialStress}
                        onValueChange={(val) =>
                          updateAnswer("financialStress", val as WorkAnswers["financialStress"])
                        }
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
                  </>
                )}

                {/* Retired questions */}
                {answers.employmentStatus === "retired" && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-foreground">
                        How satisfied are you with retirement?
                      </Label>
                      <Select
                        value={answers.retirementSatisfaction}
                        onValueChange={(val) =>
                          updateAnswer("retirementSatisfaction", val as WorkAnswers["retirementSatisfaction"])
                        }
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
                      <Label className="text-sm text-foreground">
                        Sense of purpose in retirement
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Activities, hobbies, volunteering, social engagement
                      </p>
                      <Select
                        value={answers.purposeInRetirement}
                        onValueChange={(val) =>
                          updateAnswer("purposeInRetirement", val as WorkAnswers["purposeInRetirement"])
                        }
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
                  </>
                )}

                {/* Student questions */}
                {answers.employmentStatus === "student" && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-foreground">
                        Academic stress level
                      </Label>
                      <Select
                        value={answers.academicStress}
                        onValueChange={(val) =>
                          updateAnswer("academicStress", val as WorkAnswers["academicStress"])
                        }
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
                      <Label className="text-sm text-foreground">
                        Study hours per day (including classes)
                      </Label>
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
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step: Work Stress (for employed/freelancer/entrepreneur only) */}
          {step === "stress" && isWorking && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Work Stress
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Based on Copenhagen Burnout Inventory and Effort-Reward Imbalance model
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-foreground">
                    How often do you feel exhausted from work?
                  </Label>
                  <Select
                    value={answers.workExhaustion}
                    onValueChange={(val) =>
                      updateAnswer("workExhaustion", val as WorkAnswers["workExhaustion"])
                    }
                  >
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="rarely">Rarely</SelectItem>
                      <SelectItem value="sometimes">Sometimes</SelectItem>
                      <SelectItem value="often">Often</SelectItem>
                      <SelectItem value="always">Always</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-foreground">
                    How often do you feel overwhelmed by your workload?
                  </Label>
                  <Select
                    value={answers.workOverwhelm}
                    onValueChange={(val) =>
                      updateAnswer("workOverwhelm", val as WorkAnswers["workOverwhelm"])
                    }
                  >
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="rarely">Rarely</SelectItem>
                      <SelectItem value="sometimes">Sometimes</SelectItem>
                      <SelectItem value="often">Often</SelectItem>
                      <SelectItem value="always">Always</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-foreground">
                    How well does your effort match your rewards?
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Rewards include salary, recognition, job security, and career opportunities
                  </p>
                  <Select
                    value={answers.effortRewardBalance}
                    onValueChange={(val) =>
                      updateAnswer("effortRewardBalance", val as WorkAnswers["effortRewardBalance"])
                    }
                  >
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="well-rewarded">Well rewarded</SelectItem>
                      <SelectItem value="fairly-rewarded">Fairly rewarded</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="under-rewarded">Under-rewarded</SelectItem>
                      <SelectItem value="very-under-rewarded">Very under-rewarded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-foreground">
                    How much control do you have over your work?
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Decision-making authority, flexibility in how you do your job
                  </p>
                  <Select
                    value={answers.jobControl}
                    onValueChange={(val) =>
                      updateAnswer("jobControl", val as WorkAnswers["jobControl"])
                    }
                  >
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High control</SelectItem>
                      <SelectItem value="moderate">Moderate control</SelectItem>
                      <SelectItem value="low">Low control</SelectItem>
                      <SelectItem value="very-low">Very low control</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-foreground">
                    How secure is your job?
                  </Label>
                  <Select
                    value={answers.jobSecurity}
                    onValueChange={(val) =>
                      updateAnswer("jobSecurity", val as WorkAnswers["jobSecurity"])
                    }
                  >
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very-secure">Very secure</SelectItem>
                      <SelectItem value="secure">Secure</SelectItem>
                      <SelectItem value="uncertain">Uncertain</SelectItem>
                      <SelectItem value="insecure">Insecure</SelectItem>
                      <SelectItem value="very-insecure">Very insecure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation buttons */}
          {step !== "status" && (
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              {step === "details" && isWorking ? (
                <Button onClick={handleNext} className="gap-1">
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              ) : step === "details" ? (
                <Button onClick={handleCalculate} size="lg">
                  Calculate Work Score
                </Button>
              ) : (
                <Button onClick={handleCalculate} size="lg">
                  Calculate Work Score
                </Button>
              )}
            </div>
          )}
        </>
      ) : (
        <WorkResults result={result} onReset={handleReset} />
      )}
    </div>
  )
}

function WorkResults({
  result,
  onReset,
}: {
  result: WorkResult
  onReset: () => void
}) {
  const { overallScore, category, subScores, riskFactors, recommendations, employmentStatus } =
    result

  const statusLabel =
    EMPLOYMENT_OPTIONS.find((o) => o.value === employmentStatus)?.label ?? employmentStatus

  const showSubScores =
    employmentStatus === "employed" ||
    employmentStatus === "freelancer" ||
    employmentStatus === "entrepreneur"

  return (
    <div className="flex flex-col gap-4">
      {/* Score Banner */}
      <Card className="overflow-hidden">
        <div
          className="p-6"
          style={{ backgroundColor: getScoreColor(overallScore), color: "#fff" }}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-sm font-medium opacity-80">{statusLabel}</p>
            <div className="flex items-center gap-3">
              <Briefcase className="h-8 w-8" />
              <span className="text-5xl font-bold">{overallScore}</span>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium opacity-80">/ 100</span>
                <span className="text-lg font-semibold">{category}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Sub-scores (for working statuses) */}
      {showSubScores && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">
              Sub-Scores
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[
              { label: "Work Schedule", score: subScores.schedule, icon: Clock },
              { label: "Work Stress", score: subScores.stress, icon: AlertTriangle },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{item.label}</span>
                    </div>
                    <span
                      className="text-sm font-bold"
                      style={{ color: getScoreColor(item.score) }}
                    >
                      {item.score}/100
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${item.score}%`,
                        backgroundColor: getScoreColor(item.score),
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Risk Factors */}
      {riskFactors.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <AlertTriangle className="h-5 w-5 text-[hsl(var(--accent))]" />
              Identified Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {riskFactors.map((risk, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--accent))]" />
                  {risk}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2">
            {recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--success))]" />
                {rec}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Button variant="outline" onClick={onReset} className="self-start">
        Retake Assessment
      </Button>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Based on WHO/ILO Joint Estimates on working hours (2021), IARC Monograph
        124 on night shift work (2019), Copenhagen Burnout Inventory (Kristensen
        et al. 2005), Effort-Reward Imbalance model (Siegrist 1996), and Karasek
        Job Demand-Control model (1979).
      </p>
    </div>
  )
}
