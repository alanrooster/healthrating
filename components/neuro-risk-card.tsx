import { BrainCircuit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { NeuroRiskBand, NeuroRiskResult } from "@/lib/neuro-risk-calculator"

const BAND_STYLES: Record<NeuroRiskBand, { border: string; color: string }> = {
  low: { border: "border-emerald-500/20", color: "hsl(var(--success))" },
  moderate: { border: "border-amber-500/20", color: "#f59e0b" },
  elevated: { border: "border-orange-500/20", color: "#fb923c" },
  high: { border: "border-rose-500/20", color: "#f43f5e" },
}

const MAX_DRIVERS_SHOWN = 4
const MAX_PROTECTIVE_SHOWN = 3
// Multiplying relative risks assumes independent factors; with many overlapping ones the
// product overstates risk, so it's only shown precisely below the High band
const MAX_PRECISE_RELATIVE_RISK = 4

function formatRelativeRisk(relativeRisk: number) {
  return relativeRisk >= MAX_PRECISE_RELATIVE_RISK
    ? `${MAX_PRECISE_RELATIVE_RISK}× or more`
    : `about ${relativeRisk.toFixed(1)}×`
}

export function NeuroRiskCard({ data }: { data?: NeuroRiskResult }) {
  const bandStyle = data ? BAND_STYLES[data.band] : undefined
  const hiddenDrivers = data ? data.flagged.length - MAX_DRIVERS_SHOWN : 0

  return (
    <Card className={`flex flex-col ${bandStyle?.border ?? "border-indigo-500/20"}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <BrainCircuit aria-hidden="true" className="h-5 w-5 text-indigo-500" />
          Neurodegenerative Risk
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2">
        {data && bandStyle ? (
          <>
            <span className="text-2xl font-bold" style={{ color: bandStyle.color }}>
              {data.bandLabel}
            </span>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {`${data.flagged.length} of ${data.factorsAssessed} dementia risk factors flagged${
                data.flagged.length > 0
                  ? `: ${formatRelativeRisk(data.relativeRisk)} the risk of someone with none`
                  : ""
              }. ${data.summary}`}
            </p>
            {data.flagged.length > 0 && (
              <ul aria-label="Risk factors" className="mt-1 flex flex-wrap gap-1">
                {data.flagged.slice(0, MAX_DRIVERS_SHOWN).map((factor) => (
                  <li
                    key={factor.id}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      factor.modifiable ? "bg-indigo-500/10 text-indigo-600" : "bg-muted text-muted-foreground"
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
            <p className="mt-auto pt-1 text-[10px] italic text-muted-foreground">
              {`Lancet Commission 2024 and LIBRA2 evidence. Not assessed: ${data.notAssessed.join(
                ", ",
              )}. A relative profile, not a diagnosis: age and genes drive absolute risk.`}
            </p>
          </>
        ) : (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Complete a few more assessments to profile your dementia risk. Lifestyle, Mental Health, and
            Senses &amp; Oral cover most of the known risk factors.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
