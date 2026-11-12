/**
 * Type 2 Diabetes Risk Screen, adapted from FINDRISC
 * (Finnish Diabetes Risk Score, Lindström & Tuomilehto 2003, Diabetes Care).
 *
 * FINDRISC is the most widely validated non-laboratory diabetes risk
 * questionnaire. This adaptation uses answers the user has ALREADY given in
 * other modules (zero additional questions):
 * - Age, BMI, waist circumference, sex       -> Body Composition module
 * - At least 30 minutes of activity a day    -> Exercise module (210 active minutes a week)
 * - Vegetables, fruit or berries every day   -> Diet module (1 serving or more of either a day)
 * - Family history of diabetes               -> Family History module
 *
 * Two original FINDRISC items are NOT collected by the app (blood pressure
 * medication, history of high blood glucose), so this is a PARTIAL screen
 * (max 19 of 26 points) and is labeled as such. Risk can only be
 * underestimated by the omission, never overestimated, so band language
 * stays conservative.
 *
 * Sources:
 * - Lindström J, Tuomilehto J. The Diabetes Risk Score. Diabetes Care 2003.
 * - WHO/IDF waist circumference action levels (male 94/102cm, female 80/88cm).
 */

export type FamilyDiabetesHistory = "none" | "second-degree" | "first-degree" | "multiple-or-early"

export interface DiabetesRiskInputs {
  age?: number
  sex?: "male" | "female"
  bmi?: number
  waistCm?: number
  /** Active minutes a week across work, travel and leisure (Exercise module) */
  activeMinutesPerWeek?: number
  /** Diet module answers for daily servings (0-4, where 2 is "1-2 servings") */
  fruitServings?: number
  vegetableServings?: number
  familyDiabetes?: FamilyDiabetesHistory
}

export interface DiabetesRiskResult {
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

// FINDRISC asks for at least 30 minutes of physical activity every day
const DAILY_ACTIVITY_MINUTES_PER_WEEK = 30 * 7
// Diet answer 2 is "1-2 servings" a day; the answers below it are less than one serving a day
const DAILY_SERVING_ANSWER = 2

export function calculateDiabetesRisk(inputs: DiabetesRiskInputs): DiabetesRiskResult | null {
  // Require at minimum age + one anthropometric measure to produce anything meaningful
  if (inputs.age === undefined || (inputs.bmi === undefined && inputs.waistCm === undefined)) {
    return null
  }

  let points = 0
  let used = 0
  const drivers: string[] = []

  // Age (FINDRISC: <45=0, 45-54=2, 55-64=3, >64=4)
  used++
  if (inputs.age > 64) {
    points += 4
    drivers.push("Age over 64")
  } else if (inputs.age >= 55) {
    points += 3
    drivers.push("Age 55-64")
  } else if (inputs.age >= 45) {
    points += 2
    drivers.push("Age 45-54")
  }

  // BMI (<25=0, 25-30=1, >30=3)
  if (inputs.bmi !== undefined) {
    used++
    if (inputs.bmi > 30) {
      points += 3
      drivers.push("BMI over 30")
    } else if (inputs.bmi >= 25) {
      points += 1
      drivers.push("BMI 25-30")
    }
  }

  // Waist circumference (WHO/IDF action levels)
  if (inputs.waistCm !== undefined && inputs.sex !== undefined) {
    used++
    const [t1, t2] = inputs.sex === "male" ? [94, 102] : [80, 88]
    if (inputs.waistCm > t2) {
      points += 4
      drivers.push("Waist circumference high")
    } else if (inputs.waistCm >= t1) {
      points += 3
      drivers.push("Waist circumference elevated")
    }
  }

  // Physical activity: at least 30 minutes a day (yes=0, no=2)
  if (inputs.activeMinutesPerWeek !== undefined && Number.isFinite(inputs.activeMinutesPerWeek)) {
    used++
    if (inputs.activeMinutesPerWeek < DAILY_ACTIVITY_MINUTES_PER_WEEK) {
      points += 2
      drivers.push("Under 30 minutes of activity a day")
    }
  }

  // Vegetables, fruit or berries every day (yes=0, no=1)
  const servingAnswers = [inputs.fruitServings, inputs.vegetableServings].filter(
    (answer): answer is number => answer !== undefined && Number.isFinite(answer),
  )
  if (servingAnswers.length > 0) {
    used++
    if (Math.max(...servingAnswers) < DAILY_SERVING_ANSWER) {
      points += 1
      drivers.push("Vegetables or fruit not eaten every day")
    }
  }

  // Family history (none=0, second-degree=3, first-degree or stronger=5)
  if (inputs.familyDiabetes !== undefined) {
    used++
    if (inputs.familyDiabetes === "first-degree" || inputs.familyDiabetes === "multiple-or-early") {
      points += 5
      drivers.push("First-degree family history of diabetes")
    } else if (inputs.familyDiabetes === "second-degree") {
      points += 3
      drivers.push("Second-degree family history of diabetes")
    }
  }

  // Bands follow FINDRISC thresholds. Because 2 items (max 7 pts) are not
  // collected, scores here can only under-count: bands remain valid as a floor.
  let band: DiabetesRiskResult["band"]
  let bandLabel: string
  let tenYearRisk: string
  if (points < 7) {
    band = "low"
    bandLabel = "Low"
    tenYearRisk = "~1 in 100"
  } else if (points < 12) {
    band = "slightly-elevated"
    bandLabel = "Slightly elevated"
    tenYearRisk = "~1 in 25"
  } else if (points < 15) {
    band = "moderate"
    bandLabel = "Moderate"
    tenYearRisk = "~1 in 6"
  } else {
    band = "high"
    bandLabel = "High"
    tenYearRisk = "~1 in 3"
  }

  return {
    points,
    maxPoints: 19,
    band,
    bandLabel,
    tenYearRisk,
    dataPointsUsed: used,
    totalDataPoints: 6,
    drivers: drivers.slice(0, 3),
    note:
      "Partial FINDRISC screen (blood pressure medication and glucose history not assessed). A screening estimate, not a diagnosis.",
  }
}
