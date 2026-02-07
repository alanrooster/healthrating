export type Sex = "male" | "female"

export interface BodyMeasurements {
  age: number
  sex: Sex
  weightKg: number
  heightCm: number
  waistCm?: number
  hipCm?: number
  neckCm?: number
  wristCm?: number
}

export interface BMIResult {
  bmi: number
  category: string
  idealWeightMin: number
  idealWeightMax: number
  overweightBy: number
  underweightBy: number
  bodyFatPercentage: number | null
  waistToHipRatio: number | null
  waistToHeightRatio: number | null
  adjustedBMI: number
  riskLevel: "low" | "moderate" | "high" | "very-high"
  recommendations: string[]
}

/**
 * Standard BMI calculation
 */
function calcBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100
  return weightKg / (heightM * heightM)
}

/**
 * Age-adjusted BMI using the "New BMI" formula
 * Accounts for the fact that BMI norms shift with age
 */
function calcAgeAdjustedBMI(
  bmi: number,
  age: number,
  sex: Sex
): number {
  // BMI reference ranges shift slightly with age
  // For adults, after age 20, ~0.1 BMI unit per decade is considered acceptable
  let adjustment = 0
  if (age > 20) {
    const decadesOver20 = (age - 20) / 10
    adjustment = decadesOver20 * 0.12
  }
  // Women naturally have higher body fat, slight downward adjustment for comparison
  if (sex === "female") {
    adjustment -= 0.08
  }
  return bmi - adjustment
}

/**
 * US Navy Body Fat % formula
 * Uses waist, neck, (and hip for women) circumferences
 */
function calcBodyFatNavy(
  sex: Sex,
  heightCm: number,
  waistCm: number,
  neckCm: number,
  hipCm?: number
): number | null {
  if (sex === "male") {
    if (waistCm <= neckCm) return null
    const bf =
      495 /
        (1.0324 -
          0.19077 * Math.log10(waistCm - neckCm) +
          0.15456 * Math.log10(heightCm)) -
      450
    return Math.max(2, Math.min(bf, 60))
  }
  // Female
  if (!hipCm) return null
  if (waistCm + hipCm <= neckCm) return null
  const bf =
    495 /
      (1.29579 -
        0.35004 * Math.log10(waistCm + hipCm - neckCm) +
        0.221 * Math.log10(heightCm)) -
    450
  return Math.max(8, Math.min(bf, 60))
}

/**
 * Waist-to-hip ratio
 */
function calcWHR(waistCm: number, hipCm: number): number {
  return waistCm / hipCm
}

/**
 * Waist-to-height ratio - strong predictor of cardiometabolic risk
 */
function calcWHtR(waistCm: number, heightCm: number): number {
  return waistCm / heightCm
}

/**
 * Ideal weight range using multiple formulas averaged
 * (Hamwi, Devine, Robinson, Miller)
 */
function calcIdealWeightRange(
  heightCm: number,
  sex: Sex
): { min: number; max: number } {
  const heightIn = heightCm / 2.54
  const inchesOver60 = Math.max(0, heightIn - 60)

  let hamwi: number, devine: number, robinson: number, miller: number

  if (sex === "male") {
    hamwi = 48.0 + 2.7 * inchesOver60
    devine = 50.0 + 2.3 * inchesOver60
    robinson = 52.0 + 1.9 * inchesOver60
    miller = 56.2 + 1.41 * inchesOver60
  } else {
    hamwi = 45.5 + 2.2 * inchesOver60
    devine = 45.5 + 2.3 * inchesOver60
    robinson = 49.0 + 1.7 * inchesOver60
    miller = 53.1 + 1.36 * inchesOver60
  }

  const avg = (hamwi + devine + robinson + miller) / 4
  return {
    min: Math.round((avg * 0.9) * 10) / 10,
    max: Math.round((avg * 1.1) * 10) / 10,
  }
}

/**
 * BMI-based ideal weight range (BMI 18.5-24.9)
 */
function calcBMIIdealRange(heightCm: number): { min: number; max: number } {
  const heightM = heightCm / 100
  return {
    min: Math.round(18.5 * heightM * heightM * 10) / 10,
    max: Math.round(24.9 * heightM * heightM * 10) / 10,
  }
}

/**
 * Determine risk level based on all available metrics
 */
function determineRiskLevel(
  bmi: number,
  bodyFat: number | null,
  whr: number | null,
  whtr: number | null,
  sex: Sex
): "low" | "moderate" | "high" | "very-high" {
  let riskScore = 0

  // BMI scoring
  if (bmi < 18.5) riskScore += 1
  else if (bmi >= 25 && bmi < 30) riskScore += 1
  else if (bmi >= 30 && bmi < 35) riskScore += 2
  else if (bmi >= 35) riskScore += 3

  // Body fat scoring
  if (bodyFat !== null) {
    if (sex === "male") {
      if (bodyFat > 25) riskScore += 1
      if (bodyFat > 30) riskScore += 1
    } else {
      if (bodyFat > 32) riskScore += 1
      if (bodyFat > 38) riskScore += 1
    }
  }

  // Waist-to-hip ratio scoring
  if (whr !== null) {
    if (sex === "male" && whr > 0.9) riskScore += 1
    if (sex === "female" && whr > 0.85) riskScore += 1
  }

  // Waist-to-height ratio scoring (most predictive)
  if (whtr !== null) {
    if (whtr > 0.5) riskScore += 1
    if (whtr > 0.6) riskScore += 1
  }

  if (riskScore <= 1) return "low"
  if (riskScore <= 3) return "moderate"
  if (riskScore <= 5) return "high"
  return "very-high"
}

/**
 * Get BMI category
 */
function getBMICategory(bmi: number): string {
  if (bmi < 16) return "Severely Underweight"
  if (bmi < 18.5) return "Underweight"
  if (bmi < 25) return "Normal Weight"
  if (bmi < 30) return "Overweight"
  if (bmi < 35) return "Obese (Class I)"
  if (bmi < 40) return "Obese (Class II)"
  return "Obese (Class III)"
}

/**
 * Generate personalized recommendations
 */
function getRecommendations(
  result: Partial<BMIResult>,
  measurements: BodyMeasurements
): string[] {
  const recs: string[] = []
  const { bmi, bodyFatPercentage, waistToHeightRatio, overweightBy, underweightBy } = result

  if (overweightBy && overweightBy > 0) {
    if (overweightBy > 20) {
      recs.push(
        "Consider consulting a healthcare provider for a personalized weight management plan."
      )
    }
    recs.push(
      `A safe rate of weight loss is 0.5-1 kg per week. Reaching your ideal range could take ${Math.ceil(
        overweightBy / 0.75
      )}-${Math.ceil(overweightBy / 0.5)} weeks.`
    )
  }

  if (underweightBy && underweightBy > 0) {
    recs.push(
      "Being underweight can be a health concern. Consider speaking with a nutritionist."
    )
  }

  if (bodyFatPercentage !== null && bodyFatPercentage !== undefined) {
    const highBF =
      measurements.sex === "male" ? bodyFatPercentage > 25 : bodyFatPercentage > 32
    if (highBF) {
      recs.push(
        "Your body fat percentage is above the healthy range. Strength training can help improve body composition."
      )
    }
  }

  if (
    waistToHeightRatio !== null &&
    waistToHeightRatio !== undefined &&
    waistToHeightRatio > 0.5
  ) {
    recs.push(
      "Your waist-to-height ratio indicates increased abdominal fat. Reducing waist circumference is particularly beneficial for heart health."
    )
  }

  if (bmi && bmi >= 18.5 && bmi < 25 && (!overweightBy || overweightBy <= 0)) {
    recs.push(
      "You are within a healthy BMI range. Maintain your current lifestyle with regular exercise and balanced nutrition."
    )
  }

  if (measurements.age > 50) {
    recs.push(
      "At your age, maintaining muscle mass through resistance training is especially important."
    )
  }

  return recs
}

/**
 * Main calculation function
 */
export function calculateBMI(measurements: BodyMeasurements): BMIResult {
  const { age, sex, weightKg, heightCm, waistCm, hipCm, neckCm } = measurements

  // Core BMI
  const bmi = calcBMI(weightKg, heightCm)
  const adjustedBMI = calcAgeAdjustedBMI(bmi, age, sex)
  const category = getBMICategory(adjustedBMI)

  // Ideal weight
  const formulaRange = calcIdealWeightRange(heightCm, sex)
  const bmiRange = calcBMIIdealRange(heightCm)

  // Average the two methods for a refined range
  const idealWeightMin = Math.round(((formulaRange.min + bmiRange.min) / 2) * 10) / 10
  const idealWeightMax = Math.round(((formulaRange.max + bmiRange.max) / 2) * 10) / 10

  // How much over/under
  const overweightBy =
    weightKg > idealWeightMax
      ? Math.round((weightKg - idealWeightMax) * 10) / 10
      : 0
  const underweightBy =
    weightKg < idealWeightMin
      ? Math.round((idealWeightMin - weightKg) * 10) / 10
      : 0

  // Body fat (Navy method)
  let bodyFatPercentage: number | null = null
  if (waistCm && neckCm) {
    bodyFatPercentage = calcBodyFatNavy(sex, heightCm, waistCm, neckCm, hipCm)
    if (bodyFatPercentage !== null) {
      bodyFatPercentage = Math.round(bodyFatPercentage * 10) / 10
    }
  }

  // Waist ratios
  let waistToHipRatio: number | null = null
  if (waistCm && hipCm) {
    waistToHipRatio = Math.round(calcWHR(waistCm, hipCm) * 100) / 100
  }

  let waistToHeightRatio: number | null = null
  if (waistCm) {
    waistToHeightRatio = Math.round(calcWHtR(waistCm, heightCm) * 100) / 100
  }

  const riskLevel = determineRiskLevel(
    adjustedBMI,
    bodyFatPercentage,
    waistToHipRatio,
    waistToHeightRatio,
    sex
  )

  const partialResult: Partial<BMIResult> = {
    bmi: Math.round(bmi * 10) / 10,
    adjustedBMI: Math.round(adjustedBMI * 10) / 10,
    category,
    idealWeightMin,
    idealWeightMax,
    overweightBy,
    underweightBy,
    bodyFatPercentage,
    waistToHipRatio,
    waistToHeightRatio,
    riskLevel,
  }

  const recommendations = getRecommendations(partialResult, measurements)

  return {
    ...partialResult,
    recommendations,
  } as BMIResult
}
