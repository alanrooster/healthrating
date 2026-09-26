import { TrendingDown, TrendingUp, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getScoreColor } from "@/lib/health-score"
import type { PeerComparison } from "@/lib/insights-calculator"

interface RankedModule {
  label: string
  score: number
}

interface PeerComparisonCardProps {
  comparison: PeerComparison
  completedCount: number
  totalModules: number
  strengths: RankedModule[]
  weaknesses: RankedModule[]
}

function ordinal(n: number) {
  const lastTwo = n % 100
  if (lastTwo >= 11 && lastTwo <= 13) return `${n}th`
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`
}

function getConfidence(completedCount: number) {
  if (completedCount >= 10) return "high"
  if (completedCount >= 6) return "medium"
  return "low"
}

export function PeerComparisonCard({
  comparison,
  completedCount,
  totalModules,
  strengths,
  weaknesses,
}: PeerComparisonCardProps) {
  const ready = comparison.percentile > 0
  const barColor = getScoreColor(comparison.percentile)

  return (
    <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-transparent">
      <CardContent className="py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Users aria-hidden="true" className="h-7 w-7 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Peer Comparison</span>
              {ready ? (
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-3xl font-bold text-foreground">{comparison.band}</span>
                  <span className="text-sm text-muted-foreground">vs. peers</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">{comparison.message}</span>
              )}
            </div>
          </div>
          {ready && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:flex-col sm:items-end sm:gap-1.5">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {ordinal(comparison.percentile)} percentile
              </span>
              <span className="text-xs text-muted-foreground">
                {completedCount} of {totalModules} modules
              </span>
              <span className="text-xs text-muted-foreground">Confidence: {getConfidence(completedCount)}</span>
            </div>
          )}
        </div>

        {ready && (
          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-3">
            <div className="flex flex-col gap-1.5">
              <div
                role="img"
                aria-label={`${ordinal(comparison.percentile)} percentile, where the 50th is average`}
                className="relative h-2 w-full rounded-full bg-muted"
              >
                <div
                  className="h-full rounded-full transition-[width]"
                  style={{ width: `${comparison.percentile}%`, backgroundColor: barColor }}
                />
                <div className="absolute -inset-y-1 left-1/2 w-px bg-foreground/40" />
              </div>
              <div aria-hidden="true" className="flex justify-between text-[10px] text-muted-foreground">
                <span>Lowest</span>
                <span>Average</span>
                <span>Highest</span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{comparison.message}</p>
            {(strengths.length > 0 || weaknesses.length > 0) && (
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">What moves your ranking:</p>
                <ul className="flex flex-wrap gap-2">
                  {strengths.map((module) => (
                    <li
                      key={module.label}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600"
                    >
                      <TrendingUp aria-hidden="true" className="h-3 w-3" />
                      {module.label} {module.score}
                    </li>
                  ))}
                  {weaknesses.map((module) => (
                    <li
                      key={module.label}
                      className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-600"
                    >
                      <TrendingDown aria-hidden="true" className="h-3 w-3" />
                      {module.label} {module.score}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-[10px] italic text-muted-foreground">
              Approximate population-level comparison based on completed modules.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
