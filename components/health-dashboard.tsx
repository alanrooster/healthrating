"use client"

import {
  Activity,
  Brain,
  Briefcase,
  Cloud,
  Dumbbell,
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

interface HealthDashboardProps {
  result: OverallHealthResult
  onNavigate: (section: string) => void
}

const MODULE_META: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; section: string }
> = {
  body: { label: "Body Composition", icon: Activity, section: "body" },
  airQuality: { label: "Air Quality", icon: Cloud, section: "air" },
  diet: { label: "Diet", icon: UtensilsCrossed, section: "diet" },
  exercise: { label: "Exercise", icon: Dumbbell, section: "exercise" },
  lifestyle: { label: "Lifestyle", icon: Briefcase, section: "lifestyle" },
  mentalHealth: { label: "Mental Health", icon: Brain, section: "mental" },
}

export function HealthDashboard({ result, onNavigate }: HealthDashboardProps) {
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
