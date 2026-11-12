/**
 * Cardiovascular health screen: the behaviour and weight metrics of the American Heart
 * Association's Life's Essential 8 (Lloyd-Jones et al., Circulation 2022;146:e18-e43), scored from
 * answers already given in other modules (no extra questions).
 *
 * Five of the eight metrics are collected: nicotine exposure, physical activity, sleep, BMI and
 * diet. Blood lipids, blood glucose and blood pressure need measurements the app doesn't ask for.
 * Each metric scores 0-100 with the published point tables; the overall score is their unweighted
 * mean, as in Life's Essential 8, with its categories: 80-100 high, 50-79 moderate and 0-49 low
 * cardiovascular health.
 *
 * Where an answer doesn't map exactly onto the published table:
 * - Former smokers score 50, the middle category (quit 1 to under 5 years ago), because the time
 *   since quitting isn't asked. Occasional smokers are current smokers (0).
 * - Activity minutes are MET-minutes / 4, so a vigorous minute counts as two moderate ones.
 * - BMI is the Body module's composite, which already applies the strictest ethnicity-specific
 *   cut-offs (the advisory notes that BMI ranges differ by ancestry).
 * - Diet: the advisory scores five quantiles of a DASH-style diet score (100, 80, 50, 25, 0); the
 *   Diet module's five bands (Excellent, Good, Fair, Poor, Very Poor) stand in for them.
 *
 * It screens modifiable cardiovascular health. It is not a 10-year risk estimate such as SCORE2,
 * ASCVD or QRISK3, which need age, blood pressure and cholesterol.
 */

export type CardiovascularMetricId = "nicotine" | "activity" | "sleep" | "weight" | "diet"

export interface CardiovascularHealthInputs {
  smokingStatus?: "never" | "former" | "occasional" | "daily"
  /** Whether anyone smokes inside the home (Home Environment module) */
  smokeIndoors?: "never" | "occasional" | "regular"
  sleepHours?: number
  /** MET-minutes of activity a week (Exercise module) */
  metMinutesPerWeek?: number
  bmiCategory?: "underweight" | "normal" | "overweight" | "obese" | "severely_obese"
  /** Composite BMI; absent in Body results saved before it was passed on */
  compositeBmi?: number
  /** Diet module score, 0-100 */
  dietScore?: number
}

export interface CardiovascularMetric {
  id: CardiovascularMetricId
  label: string
  score: number
}

export interface CardiovascularHealthResult {
  /** Mean of the assessed metrics, 0-100 */
  score: number
  band: "high" | "moderate" | "low"
  bandLabel: string
  summary: string
  /** Lowest first */
  metrics: CardiovascularMetric[]
  metricsAssessed: number
  totalMetrics: number
  notAssessed: string[]
}

const TOTAL_METRICS = 8
const MIN_METRICS_ASSESSED = 3
const NOT_ASSESSED = ["blood pressure", "cholesterol", "blood glucose"]
const SECONDHAND_SMOKE_PENALTY = 20
const MODERATE_MET = 4

// Each table lists [lower bound, points], highest bound first
const ACTIVITY_POINTS: [minutes: number, points: number][] = [
  [150, 100],
  [120, 90],
  [90, 80],
  [60, 60],
  [30, 40],
  [1, 20],
]
const BMI_POINTS: [bmi: number, points: number][] = [
  [40, 0],
  [35, 15],
  [30, 30],
  [25, 70],
]
const DIET_POINTS: [score: number, points: number][] = [
  [85, 100],
  [70, 80],
  [50, 50],
  [30, 25],
]

function pointsFor(table: [number, number][], value: number, belowAll: number): number {
  for (const [lowerBound, points] of table) {
    if (value >= lowerBound) return points
  }
  return belowAll
}

function scoreNicotine(inputs: CardiovascularHealthInputs): number | undefined {
  const { smokingStatus, smokeIndoors } = inputs
  if (!smokingStatus) return undefined
  const base = smokingStatus === "never" ? 100 : smokingStatus === "former" ? 50 : 0
  const livesWithSmoker = smokeIndoors === "occasional" || smokeIndoors === "regular"
  return base > 0 && livesWithSmoker ? base - SECONDHAND_SMOKE_PENALTY : base
}

function scoreSleep(hours: number | undefined): number | undefined {
  if (hours === undefined || !Number.isFinite(hours)) return undefined
  if (hours < 4) return 0
  if (hours < 5) return 20
  if (hours < 6) return 40
  if (hours < 7) return 70
  if (hours < 9) return 100
  if (hours < 10) return 90
  return 40
}

function scoreWeight(inputs: CardiovascularHealthInputs): number | undefined {
  const { compositeBmi, bmiCategory } = inputs
  if (compositeBmi !== undefined && Number.isFinite(compositeBmi)) return pointsFor(BMI_POINTS, compositeBmi, 100)
  if (!bmiCategory) return undefined
  // Without the composite BMI, class II and III obesity can't be told apart: class II is assumed
  const byCategory = { underweight: 100, normal: 100, overweight: 70, obese: 30, severely_obese: 15 }
  return byCategory[bmiCategory]
}

const HIGH_SCORE = 80
const MODERATE_SCORE = 50

/**
 * The overall score is an unweighted mean, so one very low metric (a daily smoker scores 0 for
 * nicotine) can hide behind four good ones: the summary always names the lowest metric.
 */
function getBand(
  score: number,
  lowest: CardiovascularMetric,
): Pick<CardiovascularHealthResult, "band" | "bandLabel" | "summary"> {
  const focus = lowest.score < HIGH_SCORE ? ` ${lowest.label} is your lowest metric: start there.` : ""
  if (score >= HIGH_SCORE) {
    return {
      band: "high",
      bandLabel: "High",
      summary: `Overall, your habits and weight are in the range the American Heart Association calls high cardiovascular health.${focus}`,
    }
  }
  if (score >= MODERATE_SCORE) {
    return {
      band: "moderate",
      bandLabel: "Moderate",
      summary: `Raising your lowest metrics moves you towards high cardiovascular health.${focus}`,
    }
  }
  return {
    band: "low",
    bandLabel: "Low",
    summary: `Several metrics are low.${focus} Have your blood pressure, cholesterol and glucose checked.`,
  }
}

export function calculateCardiovascularHealth(inputs: CardiovascularHealthInputs): CardiovascularHealthResult | null {
  const { metMinutesPerWeek, dietScore } = inputs
  const candidates: { id: CardiovascularMetricId; label: string; score: number | undefined }[] = [
    { id: "nicotine", label: "Nicotine", score: scoreNicotine(inputs) },
    {
      id: "activity",
      label: "Activity",
      score:
        metMinutesPerWeek !== undefined && Number.isFinite(metMinutesPerWeek)
          ? pointsFor(ACTIVITY_POINTS, metMinutesPerWeek / MODERATE_MET, 0)
          : undefined,
    },
    { id: "sleep", label: "Sleep", score: scoreSleep(inputs.sleepHours) },
    { id: "weight", label: "Weight", score: scoreWeight(inputs) },
    {
      id: "diet",
      label: "Diet",
      score: dietScore !== undefined && Number.isFinite(dietScore) ? pointsFor(DIET_POINTS, dietScore, 0) : undefined,
    },
  ]
  const metrics = candidates
    .filter((metric): metric is CardiovascularMetric => metric.score !== undefined)
    .sort((a, b) => a.score - b.score)
  if (metrics.length < MIN_METRICS_ASSESSED) return null

  const score = Math.round(metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length)

  return {
    ...getBand(score, metrics[0]),
    score,
    metrics,
    metricsAssessed: metrics.length,
    totalMetrics: TOTAL_METRICS,
    notAssessed: NOT_ASSESSED,
  }
}
