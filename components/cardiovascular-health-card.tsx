import { HeartPulse } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CardiovascularHealthResult } from "@/lib/cardiovascular-health"

type Band = CardiovascularHealthResult["band"]

const BAND_STYLES: Record<Band, { border: string; color: string; chip: string }> = {
  high: { border: "border-emerald-500/20", color: "hsl(var(--success))", chip: "bg-emerald-500/10 text-emerald-600" },
  moderate: { border: "border-amber-500/20", color: "#d97706", chip: "bg-amber-500/10 text-amber-700" },
  low: { border: "border-rose-500/20", color: "#f43f5e", chip: "bg-rose-500/10 text-rose-600" },
}

// Life's Essential 8 uses the same cut-offs for a single metric as for the overall score
function getMetricBand(score: number): Band {
  if (score >= 80) return "high"
  if (score >= 50) return "moderate"
  return "low"
}

export function CardiovascularHealthCard({ data }: { data?: CardiovascularHealthResult }) {
  const bandStyle = data ? BAND_STYLES[data.band] : undefined

  return (
    <Card className={`flex flex-col ${bandStyle?.border ?? "border-rose-500/20"}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <HeartPulse aria-hidden="true" className="h-5 w-5 text-rose-500" />
          Cardiovascular Health
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2">
        {data && bandStyle ? (
          <>
            <p className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="text-2xl font-bold" style={{ color: bandStyle.color }}>
                {data.score}
              </span>
              <span className="text-xs text-muted-foreground">/100</span>
              <span className="ml-1 text-sm font-medium text-foreground">
                {`${data.bandLabel} cardiovascular health`}
              </span>
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {`Scored on ${data.metricsAssessed} of the ${data.totalMetrics} Life's Essential 8 metrics. ${data.summary}`}
            </p>
            <ul aria-label="Metric scores out of 100" className="mt-1 flex flex-wrap gap-1">
              {data.metrics.map((metric) => (
                <li
                  key={metric.id}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    BAND_STYLES[getMetricBand(metric.score)].chip
                  }`}
                >
                  {`${metric.label} ${metric.score}`}
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-1 text-[10px] italic text-muted-foreground">
              {`American Heart Association Life's Essential 8 (2022). Not assessed: ${data.notAssessed.join(
                ", ",
              )}. A health score, not a 10-year risk estimate such as SCORE2 or QRISK3.`}
            </p>
          </>
        ) : (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Complete Lifestyle plus Exercise, Body Composition or Diet to score your cardiovascular health on the
            American Heart Association&apos;s Life&apos;s Essential 8.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
