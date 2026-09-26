"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { BMIResult } from "@/lib/bmi-calculator"

interface BMIResultsProps {
  result: BMIResult
  onRetake?: () => void
}

function BMIGauge({ bmi }: { bmi: number }) {
  // Map BMI to position on gauge (15 to 45 range)
  const minBMI = 15
  const maxBMI = 45
  const clampedBMI = Math.max(minBMI, Math.min(maxBMI, bmi))
  const percentage = ((clampedBMI - minBMI) / (maxBMI - minBMI)) * 100

  // Color zones: Underweight | Normal | Overweight | Obese
  const zones = [
    { end: ((18.5 - minBMI) / (maxBMI - minBMI)) * 100, color: "hsl(var(--info))" },
    { end: ((25 - minBMI) / (maxBMI - minBMI)) * 100, color: "hsl(var(--success))" },
    { end: ((30 - minBMI) / (maxBMI - minBMI)) * 100, color: "hsl(var(--warning))" },
    { end: 100, color: "hsl(var(--destructive))" },
  ]

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-4 w-full overflow-hidden rounded-full">
        <div className="absolute inset-0 flex">
          {zones.map((zone, i) => {
            const prev = i === 0 ? 0 : zones[i - 1].end
            return (
              <div
                key={zone.color}
                className="h-full"
                style={{
                  width: `${zone.end - prev}%`,
                  backgroundColor: zone.color,
                }}
              />
            )
          })}
        </div>
        {/* Indicator */}
        <div
          className="absolute top-0 h-full w-1 -translate-x-1/2 rounded-full bg-foreground shadow-lg"
          style={{ left: `${percentage}%` }}
        />
      </div>
      <div className="flex w-full justify-between text-xs text-muted-foreground">
        <span>15</span>
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>45</span>
      </div>
      <div className="flex w-full justify-between text-[10px] text-muted-foreground sm:text-xs">
        <span>Underweight</span>
        <span>Normal</span>
        <span>Overweight</span>
        <span>Obese</span>
      </div>
    </div>
  )
}

function RiskBadge({ level }: { level: BMIResult["riskLevel"] }) {
  const config = {
    low: {
      label: "Low Risk",
      bg: "bg-[hsl(var(--success))]",
      text: "text-[hsl(var(--success-foreground))]",
    },
    moderate: {
      label: "Moderate Risk",
      bg: "bg-[hsl(var(--warning))]",
      text: "text-[hsl(var(--warning-foreground))]",
    },
    high: {
      label: "High Risk",
      bg: "bg-[hsl(var(--destructive))]",
      text: "text-destructive-foreground",
    },
    "very-high": {
      label: "Very High Risk",
      bg: "bg-[hsl(var(--destructive))]",
      text: "text-destructive-foreground",
    },
  }

  const c = config[level]

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${c.bg} ${c.text}`}
    >
      {c.label}
    </span>
  )
}

function MetricCard({
  label,
  value,
  unit,
  sublabel,
}: {
  label: string
  value: string | number
  unit?: string
  sublabel?: string
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {unit && (
          <span className="text-sm font-medium text-muted-foreground">{unit}</span>
        )}
      </div>
      {sublabel && (
        <span className="text-xs text-muted-foreground">{sublabel}</span>
      )}
    </div>
  )
}

export function BMIResults({ result, onRetake }: BMIResultsProps) {
  const {
    bmi,
    compositeScore,
    adjustedBMI,
    category,
    idealWeightMin,
    idealWeightMax,
    overweightBy,
    underweightBy,
    bodyFatPercentage,
    waistToHeightRatio,
    riskLevel,
    recommendations,
    hasBodyMeasurements,
  } = result

  const isOverweight = overweightBy > 0
  const isUnderweight = underweightBy > 0
  const isHealthy = !isOverweight && !isUnderweight

  // Show composite score as primary when body measurements are provided
  const primaryScore = hasBodyMeasurements ? compositeScore : bmi
  const primaryLabel = hasBodyMeasurements ? "Body Score" : "BMI"

  return (
    <div className="flex flex-col gap-6">
      {/* Primary Result */}
      <Card className="overflow-hidden">
        <div
          className={`p-6 ${
            isHealthy
              ? "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]"
              : isOverweight
                ? "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"
                : "bg-[hsl(var(--info))] text-[hsl(var(--info-foreground))]"
          }`}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-3">
              <span className="text-5xl font-bold sm:text-6xl">{primaryScore}</span>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium opacity-80">{primaryLabel}</span>
                <span className="text-lg font-semibold">{category}</span>
              </div>
            </div>

            {hasBodyMeasurements && (
              <p className="text-xs opacity-80">
                Composite score combining BMI, body fat, and waist measurements
              </p>
            )}

            {isOverweight && (
              <p className="text-lg font-semibold">
                You are{" "}
                <span className="text-2xl font-bold underline decoration-2 underline-offset-4">
                  {overweightBy} kg
                </span>{" "}
                above your ideal weight range
              </p>
            )}
            {isUnderweight && (
              <p className="text-lg font-semibold">
                You are{" "}
                <span className="text-2xl font-bold underline decoration-2 underline-offset-4">
                  {underweightBy} kg
                </span>{" "}
                below your ideal weight range
              </p>
            )}
            {isHealthy && (
              <p className="text-lg font-semibold">
                You are within your ideal weight range
              </p>
            )}
          </div>
        </div>

        <CardContent className="flex flex-col gap-6 pt-6">
          <BMIGauge bmi={primaryScore} />

          <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                Ideal weight range
                {hasBodyMeasurements && " (measurement-adjusted)"}
              </span>
              <span className="text-lg font-bold text-foreground">
                {idealWeightMin} - {idealWeightMax} kg
              </span>
            </div>
            <RiskBadge level={riskLevel} />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">
            Detailed Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <MetricCard
              label="Standard BMI"
              value={bmi}
              unit="kg/m2"
              sublabel="Weight & height only"
            />
            <MetricCard
              label="Adjusted BMI"
              value={adjustedBMI}
              unit="kg/m2"
              sublabel="Age, sex & ethnicity"
            />
            {hasBodyMeasurements && (
              <MetricCard
                label="Composite Score"
                value={compositeScore}
                unit="pts"
                sublabel="Includes body measurements"
              />
            )}
            {bodyFatPercentage !== null && (
              <MetricCard
                label="Body Fat"
                value={bodyFatPercentage}
                unit="%"
                sublabel={
                  hasBodyMeasurements
                    ? "Circumference + Deurenberg"
                    : "Deurenberg estimate"
                }
              />
            )}
            {waistToHeightRatio !== null && (
              <MetricCard
                label="Waist-to-Height"
                value={waistToHeightRatio}
                sublabel={
                  waistToHeightRatio >= 0.6
                    ? "High health risk"
                    : waistToHeightRatio >= 0.5
                      ? "Increased health risk"
                      : "Healthy range"
                }
              />
            )}
            <MetricCard
              label="Ideal Range"
              value={`${idealWeightMin}-${idealWeightMax}`}
              unit="kg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {recommendations.map((rec) => (
                <li key={rec} className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span className="text-sm leading-relaxed text-foreground">
                    {rec}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Retake Button */}
      {onRetake && (
        <Button variant="outline" onClick={onRetake} className="self-start">
          Retake Assessment
        </Button>
      )}

      {/* Disclaimer */}
      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        This calculator provides estimates based on statistical formulas. Results
        are not a substitute for professional medical advice. The adjusted BMI
        accounts for age, sex, and ethnicity-specific cardiometabolic risk (NICE
        NG246). Body fat estimation averages a circumference method (U.S. Navy for
        men, Relative Fat Mass for women) with the Deurenberg formula.
      </p>
    </div>
  )
}
