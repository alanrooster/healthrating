import { Ribbon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CancerRiskBand, CancerRiskResult } from "@/lib/cancer-risk-calculator"

const BAND_STYLES: Record<CancerRiskBand, { border: string; color: string }> = {
  low: { border: "border-emerald-500/20", color: "hsl(var(--success))" },
  moderate: { border: "border-amber-500/20", color: "#d97706" },
  elevated: { border: "border-orange-500/20", color: "#ea580c" },
  high: { border: "border-rose-500/20", color: "#f43f5e" },
}

const MAX_DRIVERS_SHOWN = 4
const MAX_PROTECTIVE_SHOWN = 3
// Multiplying relative risks assumes independent factors; with many overlapping ones the
// product overstates risk, so it's only shown precisely below 3×
const MAX_PRECISE_RELATIVE_RISK = 3

function describeRelativeRisk(relativeRisk: number) {
  if (relativeRisk >= MAX_PRECISE_RELATIVE_RISK) {
    return `${MAX_PRECISE_RELATIVE_RISK}× or more the risk of someone with none`
  }
  if (relativeRisk >= 2) return `about ${relativeRisk.toFixed(1)}× the risk of someone with none`
  const excessPercent = Math.round((relativeRisk - 1) * 100)
  return excessPercent < 1
    ? "a slightly higher risk than someone with none"
    : `about ${excessPercent}% higher risk than someone with none`
}

function formatPoints(points: number) {
  return String(Number(points.toFixed(2)))
}

export function CancerRiskCard({ data }: { data?: CancerRiskResult }) {
  const bandStyle = data ? BAND_STYLES[data.band] : undefined
  const hiddenDrivers = data ? data.flagged.length - MAX_DRIVERS_SHOWN : 0

  return (
    <Card className={`flex flex-col ${bandStyle?.border ?? "border-fuchsia-500/20"}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Ribbon aria-hidden="true" className="h-5 w-5 text-fuchsia-500" />
          Cancer Risk
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2">
        {data && bandStyle ? (
          <>
            <span className="text-2xl font-bold" style={{ color: bandStyle.color }}>
              {data.bandLabel}
            </span>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {`${data.flagged.length} of ${data.factorsAssessed} cancer risk factors flagged${
                data.flagged.length > 0 ? `: ${describeRelativeRisk(data.relativeRisk)}` : ""
              }. ${data.summary}`}
            </p>
            {data.flagged.length > 0 && (
              <ul aria-label="Risk factors" className="mt-1 flex flex-wrap gap-1">
                {data.flagged.slice(0, MAX_DRIVERS_SHOWN).map((factor) => (
                  <li
                    key={factor.id}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      factor.modifiable
                        ? "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {factor.label}
                    {!factor.modifiable && <span className="sr-only"> (not modifiable)</span>}
                  </li>
                ))}
                {hiddenDrivers > 0 && (
                  <li className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    +{hiddenDrivers} more
                  </li>
                )}
              </ul>
            )}
            {data.protective.length > 0 && (
              <ul aria-label="Protective factors" className="flex flex-wrap gap-1">
                {data.protective.slice(0, MAX_PROTECTIVE_SHOWN).map((factor) => (
                  <li
                    key={factor}
                    className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600"
                  >
                    {factor}
                  </li>
                ))}
              </ul>
            )}
            {(data.preventionScore || data.screening || data.infections) && (
              <ul
                aria-label="Prevention status"
                className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground"
              >
                {data.preventionScore && (
                  <li>
                    WCRF/AICR prevention score{" "}
                    <span className="font-semibold text-foreground">
                      {formatPoints(data.preventionScore.points)}/{data.preventionScore.maxPoints}
                    </span>
                  </li>
                )}
                {data.screening && (
                  <li>
                    Screening{" "}
                    <span
                      className={`font-semibold ${
                        data.screening === "due" ? "text-amber-600" : "text-emerald-600"
                      }`}
                    >
                      {data.screening === "due" ? "due" : "up to date"}
                    </span>
                  </li>
                )}
                {data.infections && (
                  <li>
                    Infection vaccines &amp; tests{" "}
                    <span
                      className={`font-semibold ${
                        data.infections === "due" ? "text-amber-600" : "text-emerald-600"
                      }`}
                    >
                      {data.infections === "due" ? "due" : "up to date"}
                    </span>
                  </li>
                )}
              </ul>
            )}
            <p className="mt-auto pt-1 text-[10px] italic text-muted-foreground">
              {`European Code Against Cancer (IARC/WHO, 2025) and WCRF/AICR evidence. Not assessed: ${data.notAssessed.join(
                ", ",
              )}. A relative profile, not a diagnosis: age and inherited variants drive absolute risk.`}
            </p>
          </>
        ) : (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Complete a few more assessments to profile your cancer risk. Lifestyle, Diet, and Body
            Composition cover the main risk factors.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
