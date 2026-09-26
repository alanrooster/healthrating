"use client"

import {
  Activity,
  ArrowRight,
  Brain,
  Briefcase,
  Candy,
  Cloud,
  Dna,
  Droplets,
  Dumbbell,
  Ear,
  Heart,
  HeartHandshake,
  HeartPulse,
  Hourglass,
  House,
  Moon,
  ShieldCheck,
  Smile,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OverallHealthResult } from "@/lib/health-score"
import { getScoreColor, getGradeColor } from "@/lib/health-score"
import {
  calculateCardiovascularRisk,
  buildActionPlan,
  calculatePeerComparison,
} from "@/lib/insights-calculator"
import type { CancerRiskResult } from "@/lib/cancer-risk-calculator"
import type { NeuroRiskResult } from "@/lib/neuro-risk-calculator"
import { ActionPlanCard } from "@/components/action-plan-card"
import { CancerRiskCard } from "@/components/cancer-risk-card"
import { NeuroRiskCard } from "@/components/neuro-risk-card"
import { PeerComparisonCard } from "@/components/peer-comparison-card"

interface LifeExpectancyData {
  adjustedYears: number
  totalAdjustment: number
  percentile: number
  potentialGain: number
  confidence: "low" | "medium" | "high"
  topFactors: { factor: string; years: number; direction: "positive" | "negative" }[]
}

interface BiologicalAgeData {
  biologicalAge: number
  chronologicalAge: number
  delta: number
  paceOfAging: number
  band: "younger" | "aligned" | "older"
  confidence: "low" | "medium" | "high"
  summary: string
}

interface HealthDashboardProps {
  result: OverallHealthResult
  onNavigate: (section: string) => void
  lifeExpectancyData?: LifeExpectancyData
  biologicalAgeData?: BiologicalAgeData
  diabetesRiskData?: DiabetesRiskData
  neuroRiskData?: NeuroRiskResult
  cancerRiskData?: CancerRiskResult
}

interface DiabetesRiskData {
  points: number
  maxPoints: number
  band: "low" | "slightly-elevated" | "moderate" | "high"
  bandLabel: string
  tenYearRisk: string
  dataPointsUsed: number
  totalDataPoints: number
  drivers: string[]
  note: string
}

const MODULE_META: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; section: string }
> = {
  body: { label: "Body Composition", icon: Activity, section: "body" },
  airQuality: { label: "Air Quality", icon: Cloud, section: "air" },
  waterQuality: { label: "Water Quality", icon: Droplets, section: "water" },
  diet: { label: "Diet", icon: UtensilsCrossed, section: "diet" },
  exercise: { label: "Exercise", icon: Dumbbell, section: "exercise" },
  work: { label: "Work", icon: Briefcase, section: "work" },
  lifestyle: { label: "Lifestyle", icon: Moon, section: "lifestyle" },
  mentalHealth: { label: "Mental Health", icon: Brain, section: "mental" },
  familyHistory: { label: "Family History", icon: Dna, section: "family" },
  preventiveCare: { label: "Preventive Care", icon: ShieldCheck, section: "preventive" },
  sensesOral: { label: "Senses & Oral", icon: Ear, section: "senses" },
  lifeContext: { label: "Life Context", icon: HeartHandshake, section: "lifecontext" },
  personality: { label: "Personality", icon: Smile, section: "personality" },
  homeEnvironment: { label: "Home Environment", icon: House, section: "home" },
}

export function HealthDashboard({
  result,
  onNavigate,
  lifeExpectancyData,
  biologicalAgeData,
  diabetesRiskData,
  neuroRiskData,
  cancerRiskData,
}: HealthDashboardProps) {
  const { overallScore, letterGrade, completedCount, totalModules, scores, summary } =
  result

  const cvRisk = calculateCardiovascularRisk(scores)
  const actionPlan = buildActionPlan(scores)
  const peerComparison = calculatePeerComparison(overallScore, completedCount)
  const rankedModules = Object.entries(scores)
    .filter(([key, mod]) => mod.completed && MODULE_META[key])
    .map(([key, mod]) => ({ label: MODULE_META[key].label, score: mod.score }))
    .sort((a, b) => b.score - a.score)
  // Same cut-offs as calculatePeerComparison: 75+ is above average, under 55 below
  const peerStrengths = rankedModules.filter((mod) => mod.score >= 75).slice(0, 2)
  const peerWeaknesses = rankedModules.filter((mod) => mod.score < 55).slice(-2).reverse()

  const radarData = Object.entries(scores).map(([key, mod]) => ({
    subject: MODULE_META[key]?.label ?? key,
    score: mod.completed ? mod.score : 0,
    fullMark: 100,
  }))

  const gradeColorClass = getGradeColor(letterGrade)
  const nextAssessment = Object.entries(scores).find(
    ([key, module]) => !module.completed && MODULE_META[key]?.section,
  )
  const nextAssessmentMeta = nextAssessment
    ? MODULE_META[nextAssessment[0]]
    : undefined
  const startNextAssessment = () =>
    onNavigate(nextAssessmentMeta?.section ?? "body")

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Health Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          {completedCount} of {totalModules} assessments completed
        </p>
      </div>

      {/* Overall Score + Radar */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Overall Score Card */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
            {completedCount > 0 ? (
              <>
                {/* Circular score display */}
                <div className="relative flex h-40 w-40 items-center justify-center">
                  <svg className="h-40 w-40 -rotate-90" viewBox="0 0 160 160">
                    <circle
                      cx="80"
                      cy="80"
                      r="68"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="12"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="68"
                      fill="none"
                      stroke={getScoreColor(overallScore)}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${(overallScore / 100) * 427.3} 427.3`}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-bold text-foreground">
                      {overallScore}
                    </span>
                    <span
                      className={`text-lg font-bold ${gradeColorClass}`}
                    >
                      {letterGrade}
                    </span>
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground">{summary}</p>
              </>
            ) : (
              <div className="relative flex min-h-[256px] flex-col justify-between gap-5 overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-card to-muted/50 p-5 sm:p-6">
                <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-10 size-36 rounded-full border border-primary/10">
                  <div className="absolute inset-4 rounded-full border border-primary/10" />
                  <div className="absolute inset-8 rounded-full border border-primary/10" />
                </div>
                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <HeartPulse aria-hidden="true" className="size-6" />
                  </div>
                  <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                    {completedCount} of {totalModules} complete
                  </span>
                </div>
                <div className="relative flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Your health baseline
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-semibold tracking-tight text-muted-foreground/50">—</span>
                    <span className="text-sm text-muted-foreground">/ 100</span>
                  </div>
                  <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{summary}</p>
                  <div
                    aria-label={`${completedCount} of ${totalModules} assessments completed`}
                    className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={totalModules}
                    aria-valuenow={completedCount}
                  >
                    <div
                      className="h-full rounded-full bg-primary transition-[width]"
                      style={{ width: `${(completedCount / totalModules) * 100}%` }}
                    />
                  </div>
                </div>
                <Button className="relative w-full sm:w-fit" onClick={startNextAssessment}>
                  {nextAssessmentMeta ? `Start ${nextAssessmentMeta.label}` : "Review assessments"}
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Health Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            {completedCount > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData} outerRadius="70%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col gap-4 pb-4">
                <div className="flex items-center justify-center overflow-hidden rounded-xl border border-dashed border-border/80 bg-muted/20 py-3">
                  <svg
                    aria-hidden="true"
                    className="h-32 w-full max-w-56"
                    viewBox="0 0 200 130"
                    fill="none"
                  >
                    <path d="M100 12 154 43v44l-54 31-54-31V43l54-31Z" stroke="hsl(var(--border))" />
                    <path d="m100 30 38 22v26l-38 22-38-22V52l38-22Z" stroke="hsl(var(--border))" />
                    <path d="m100 48 22 13v9l-22 13-22-13v-9l22-13Z" stroke="hsl(var(--border))" />
                    <path d="M100 12v62M154 43l-54 31M154 87l-54-13M100 118V74M46 87l54-13M46 43l54 31" stroke="hsl(var(--muted-foreground) / 0.3)" strokeDasharray="3 4" />
                    <path d="m100 56 18 11-12 15-20-8 2-12 12-6Z" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary) / 0.42)" strokeDasharray="4 4" />
                    <circle cx="100" cy="56" r="2.5" fill="hsl(var(--primary) / 0.5)" />
                    <circle cx="118" cy="67" r="2.5" fill="hsl(var(--primary) / 0.5)" />
                    <circle cx="106" cy="82" r="2.5" fill="hsl(var(--primary) / 0.5)" />
                    <circle cx="86" cy="74" r="2.5" fill="hsl(var(--primary) / 0.5)" />
                    <circle cx="88" cy="62" r="2.5" fill="hsl(var(--primary) / 0.5)" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-foreground">Your profile is ready to take shape</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Complete an assessment to start building a personalized view of your health.
                  </p>
                </div>
                <Button className="w-full" variant="outline" onClick={startNextAssessment}>
                  Start your first assessment
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Life Expectancy Card */}
      <Card className="border-rose-500/20 bg-linear-to-br from-rose-500/5 to-transparent">
        <CardContent className="py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-rose-500/10">
                <Heart className="h-7 w-7 text-rose-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">
                  Estimated Life Expectancy
                </span>
                {lifeExpectancyData ? (
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-3xl font-bold text-foreground">
                      {lifeExpectancyData.adjustedYears.toFixed(0)}
                    </span>
                    <span className="text-sm text-muted-foreground">years</span>
                    {lifeExpectancyData.totalAdjustment !== 0 && (
                      <span className={`flex items-center gap-0.5 text-sm font-medium ${
                        lifeExpectancyData.totalAdjustment > 0 ? "text-emerald-500" : "text-rose-500"
                      }`}>
                        {lifeExpectancyData.totalAdjustment > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {lifeExpectancyData.totalAdjustment > 0 ? "+" : ""}
                        {lifeExpectancyData.totalAdjustment.toFixed(1)}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Complete assessments to estimate
                  </span>
                )}
              </div>
            </div>
            {lifeExpectancyData && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:flex-col sm:items-end sm:gap-1.5">
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="text-muted-foreground">Top {lifeExpectancyData.percentile}%</span>
                </div>
                {lifeExpectancyData.potentialGain > 0 && (
                  <div className="flex items-center gap-1 text-xs text-emerald-500">
                    <Sparkles className="h-3 w-3" />
                    <span>+{lifeExpectancyData.potentialGain.toFixed(0)}y potential</span>
                  </div>
                )}
                <span className="text-xs text-muted-foreground">
                  Confidence: {lifeExpectancyData.confidence}
                </span>
              </div>
            )}
          </div>
          
          {/* Top factors */}
          {lifeExpectancyData && lifeExpectancyData.topFactors.length > 0 && (
            <div className="mt-4 border-t border-border pt-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Key factors affecting your estimate:</p>
              <div className="flex flex-wrap gap-2">
                {lifeExpectancyData.topFactors.slice(0, 4).map((f) => (
                  <span
                    key={f.factor}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      f.direction === "positive"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-rose-500/10 text-rose-600"
                    }`}
                  >
                    {f.direction === "positive" ? "+" : ""}
                    {f.years.toFixed(1)}y {f.factor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Biological Age Card */}
      <Card className="border-violet-500/20 bg-linear-to-br from-violet-500/5 to-transparent">
        <CardContent className="py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                <Hourglass className="h-7 w-7 text-violet-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">
                  Estimated Biological Age
                </span>
                {biologicalAgeData ? (
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-3xl font-bold text-foreground">
                      {biologicalAgeData.biologicalAge.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      vs {biologicalAgeData.chronologicalAge} calendar years
                    </span>
                    {biologicalAgeData.delta !== 0 && (
                      <span
                        className={`flex items-center gap-0.5 text-sm font-medium ${
                          biologicalAgeData.delta < 0 ? "text-emerald-500" : "text-rose-500"
                        }`}
                      >
                        {biologicalAgeData.delta < 0 ? (
                          <TrendingDown className="h-4 w-4" />
                        ) : (
                          <TrendingUp className="h-4 w-4" />
                        )}
                        {biologicalAgeData.delta > 0 ? "+" : ""}
                        {biologicalAgeData.delta.toFixed(1)}y
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Complete the Body Composition assessment (age required) to estimate
                  </span>
                )}
              </div>
            </div>
            {biologicalAgeData && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:flex-col sm:items-end sm:gap-1.5">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    biologicalAgeData.band === "younger"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : biologicalAgeData.band === "older"
                        ? "bg-rose-500/10 text-rose-600"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {biologicalAgeData.band === "younger"
                    ? "Aging slower"
                    : biologicalAgeData.band === "older"
                      ? "Aging faster"
                      : "On track"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Pace: {biologicalAgeData.paceOfAging.toFixed(2)}x per year
                </span>
                <span className="text-xs text-muted-foreground">
                  Confidence: {biologicalAgeData.confidence}
                </span>
              </div>
            )}
          </div>
          {biologicalAgeData && (
            <div className="mt-4 border-t border-border pt-3">
              <p className="text-xs text-muted-foreground leading-relaxed">{biologicalAgeData.summary}</p>
              <p className="mt-1 text-[10px] text-muted-foreground italic">
                Lifestyle-based estimate (Levine PhenoAge 2018, Belsky Dunedin 2015 framework). Not a
                clinical biomarker measurement.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <PeerComparisonCard
        comparison={peerComparison}
        completedCount={completedCount}
        totalModules={totalModules}
        strengths={peerStrengths}
        weaknesses={peerWeaknesses}
      />

      {/* Risk cards: Cardiovascular, Type 2 Diabetes, Neurodegenerative, Cancer */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Cardiovascular Risk */}
        <Card className={`flex flex-col border-${cvRisk.band === "low" ? "emerald" : cvRisk.band === "borderline" ? "amber" : cvRisk.band === "intermediate" ? "orange" : "rose"}-500/20`}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <HeartPulse className="h-5 w-5 text-rose-500" />
              Cardiovascular Risk
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-2">
            <span
              className="text-2xl font-bold"
              style={{
                color:
                  cvRisk.band === "low"
                    ? "hsl(var(--success))"
                    : cvRisk.band === "borderline"
                    ? "#f59e0b"
                    : cvRisk.band === "intermediate"
                    ? "#fb923c"
                    : "#f43f5e",
              }}
            >
              {cvRisk.label}
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">{cvRisk.estimate}</p>
            {cvRisk.drivers.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {cvRisk.drivers.map((d) => (
                  <span
                    key={d}
                    className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-600"
                  >
                    {d}
                  </span>
                ))}
              </div>
            )}
            <p className="mt-auto pt-1 text-[10px] text-muted-foreground italic">
              Educational estimate. Not a substitute for ASCVD/QRISK3.
            </p>
          </CardContent>
        </Card>

        {/* Type 2 Diabetes Risk (FINDRISC-adapted) */}
        <Card
          className={`flex flex-col ${
            diabetesRiskData?.band === "high"
              ? "border-rose-500/20"
              : diabetesRiskData?.band === "moderate"
                ? "border-orange-500/20"
                : diabetesRiskData?.band === "slightly-elevated"
                  ? "border-amber-500/20"
                  : "border-emerald-500/20"
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Candy className="h-5 w-5 text-orange-500" />
              Type 2 Diabetes Risk
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-2">
            {diabetesRiskData ? (
              <>
                <span
                  className="text-2xl font-bold"
                  style={{
                    color:
                      diabetesRiskData.band === "low"
                        ? "hsl(var(--success))"
                        : diabetesRiskData.band === "slightly-elevated"
                          ? "#f59e0b"
                          : diabetesRiskData.band === "moderate"
                            ? "#fb923c"
                            : "#f43f5e",
                  }}
                >
                  {diabetesRiskData.bandLabel}
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  FINDRISC-adapted screen: {diabetesRiskData.points}/{diabetesRiskData.maxPoints} points
                  {" "}({diabetesRiskData.tenYearRisk} 10-year risk). Based on{" "}
                  {diabetesRiskData.dataPointsUsed} of {diabetesRiskData.totalDataPoints} factors.
                </p>
                {diabetesRiskData.drivers.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {diabetesRiskData.drivers.map((d) => (
                      <span
                        key={d}
                        className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-medium text-orange-600"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-auto pt-1 text-[10px] text-muted-foreground italic">{diabetesRiskData.note}</p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground leading-relaxed">
                Complete the Body Composition assessment to screen your type 2 diabetes
                risk. Exercise, Diet, and Family History further refine it.
              </p>
            )}
          </CardContent>
        </Card>

        <NeuroRiskCard data={neuroRiskData} />
        <CancerRiskCard data={cancerRiskData} />
      </div>

      {/* Module Score Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(scores).map(([key, mod]) => {
          const meta = MODULE_META[key]
          if (!meta) return null
          const Icon = meta.icon

          return (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate(meta.section)}
              className="text-left transition-shadow hover:shadow-md"
            >
              <Card className="h-full">
                <CardContent className="flex items-center gap-4 py-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: mod.completed
                        ? getScoreColor(mod.score)
                        : "hsl(var(--muted))",
                    }}
                  >
                    <Icon
                      className="h-6 w-6"
                      style={{
                        color: mod.completed
                          ? "hsl(var(--primary-foreground))"
                          : "hsl(var(--muted-foreground))",
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {meta.label}
                    </span>
                    {mod.completed ? (
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className="text-2xl font-bold"
                          style={{ color: getScoreColor(mod.score) }}
                        >
                          {mod.score}
                        </span>
                        <span className="text-xs text-muted-foreground">/100</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Not completed yet
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </button>
          )
        })}
      </div>

      <ActionPlanCard
        items={actionPlan}
        onSelect={(module) => onNavigate(MODULE_META[module]?.section ?? module)}
      />
    </div>
  )
}
