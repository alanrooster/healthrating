"use client"

import {
  Activity,
  Brain,
  Briefcase,
  Cloud,
  Dna,
  Droplets,
  Dumbbell,
  Ear,
  Heart,
  Leaf,
  Moon,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  TreePine,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OverallHealthResult } from "@/lib/health-score"
import { getScoreColor, getGradeColor } from "@/lib/health-score"

interface LifeExpectancyData {
  adjustedYears: number
  totalAdjustment: number
  percentile: number
  potentialGain: number
  confidence: "low" | "medium" | "high"
  topFactors: { factor: string; years: number; direction: "positive" | "negative" }[]
}

interface HealthDashboardProps {
  result: OverallHealthResult
  onNavigate: (section: string) => void
  carbonData?: {
    score: number
    totalKgCO2: number
  }
  lifeExpectancyData?: LifeExpectancyData
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
}

export function HealthDashboard({ result, onNavigate, carbonData, lifeExpectancyData }: HealthDashboardProps) {
  const { overallScore, letterGrade, completedCount, totalModules, scores, summary } =
    result

  const radarData = Object.entries(scores).map(([key, mod]) => ({
    subject: MODULE_META[key]?.label ?? key,
    score: mod.completed ? mod.score : 0,
    fullMark: 100,
  }))

  const gradeColorClass = getGradeColor(letterGrade)

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
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <span className="text-3xl font-bold text-muted-foreground">?</span>
                </div>
                <p className="text-sm text-muted-foreground">{summary}</p>
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
              <div className="flex h-[220px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Complete assessments to see your health profile
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Life Expectancy Card */}
      <Card className="border-rose-500/20 bg-gradient-to-br from-rose-500/5 to-transparent">
        <CardContent className="py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-rose-500/10">
                <Heart className="h-7 w-7 text-rose-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">
                  Estimated Life Expectancy
                </span>
                {lifeExpectancyData ? (
                  <div className="flex items-baseline gap-2">
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
              <div className="flex flex-col items-end gap-1.5">
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

      {/* Carbon Footprint Card */}
      <button
        type="button"
        onClick={() => onNavigate("carbon")}
        className="text-left transition-shadow hover:shadow-md w-full"
      >
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="flex items-center justify-between gap-4 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Leaf className="h-7 w-7 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">
                  Carbon Footprint
                </span>
                {carbonData ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">
                      {(carbonData.totalKgCO2 / 1000).toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">tonnes CO2e/year</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Calculate your environmental impact
                  </span>
                )}
              </div>
            </div>
            {carbonData && (
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <TreePine className="h-4 w-4" />
                  <span>{Math.ceil(carbonData.totalKgCO2 / 22)} trees to offset</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Paris target: 2.0t
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </button>

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
    </div>
  )
}
