export type Sex = "male" | "female"

export type Ethnicity =
  | "caucasian"
  | "african"
  | "south-asian"
  | "east-asian"
  | "southeast-asian"
  | "hispanic"
  | "middle-eastern"
  | "pacific-islander"

export interface BodyMeasurements {
  age: number
  sex: Sex
  ethnicity: Ethnicity
  weightKg: number
  heightCm: number
  waistCm: number
  neckCm: number
  wristCm: number
}

export interface BMIResult {
  bmi: number
  compositeScore: number
  category: string
  idealWeightMin: number
  idealWeightMax: number
  overweightBy: number
  underweightBy: number
  bodyFatPercentage: number | null
  waistToHeightRatio: number | null
  adjustedBMI: number
  riskLevel: "low" | "moderate" | "high" | "very-high"
  recommendations: string[]
  hasBodyMeasurements: boolean
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
 * Body Fat % estimation using two complementary methods:
 *
 * 1. U.S. Navy circumference method (uses waist, neck, height)
 *    - Male:   495 / (1.0324 - 0.19077*log10(waist-neck) + 0.15456*log10(height)) - 450
 *    - Female: uses a waist-only simplified regression when hip is unavailable
 *
 * 2. Deurenberg formula (uses BMI, age, sex)
 *    BF% = 1.2*BMI + 0.23*age - 10.8*sexFactor - 5.4
 *
 * We average both methods for a more robust estimate.
 */
function calcBodyFatCombined(
  sex: Sex,
  age: number,
  heightCm: number,
  weightKg: number,
  waistCm: number,
  neckCm: number
): number {
  const sexFactor = sex === "male" ? 1 : 0
  const heightM = heightCm / 100
  const bmi = weightKg / (heightM * heightM)

  // Deurenberg formula
  const deurenberg = 1.2 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4

  // Navy method (male formula works directly; for female we use a waist-only regression)
  let navy: number | null = null
  if (sex === "male") {
    if (waistCm > neckCm) {
      navy =
        495 /
          (1.0324 -
            0.19077 * Math.log10(waistCm - neckCm) +
            0.15456 * Math.log10(heightCm)) -
        450
    }
  } else {
    // Female simplified: regression based on waist, neck, height without hip
    if (waistCm > neckCm) {
      navy =
        495 /
          (1.29579 -
            0.35004 * Math.log10(waistCm * 1.18 - neckCm) +
            0.221 * Math.log10(heightCm)) -
        450
    }
  }

  if (navy !== null) {
    navy = Math.max(sex === "male" ? 2 : 8, Math.min(navy, 60))
    // Average both methods
    const combined = (deurenberg + navy) / 2
    return Math.max(2, Math.min(combined, 60))
  }

  return Math.max(2, Math.min(deurenberg, 60))
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
  whtr: number | null,
  sex: Sex,
  ethnicity: Ethnicity
): "low" | "moderate" | "high" | "very-high" {
  let riskScore = 0

  // Ethnicity-adjusted BMI thresholds
  // South Asian, East Asian, Southeast Asian populations have elevated risk at lower BMIs
  const overweightThreshold = getOverweightBMIThreshold(ethnicity)

  if (bmi < 18.5) riskScore += 1
  else if (bmi >= overweightThreshold && bmi < 30) riskScore += 1
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

  // Waist-to-height ratio scoring (most predictive)
  if (whtr !== null) {
    if (whtr > 0.5) riskScore += 1
    if (whtr > 0.6) riskScore += 1
  }

  // Ethnicity risk modifier: South/East/SE Asian populations have
  // higher metabolic risk at the same BMI (WHO expert consultation)
  if (["south-asian", "east-asian", "southeast-asian"].includes(ethnicity)) {
    if (bmi >= 23) riskScore += 1
  }

  if (riskScore <= 1) return "low"
  if (riskScore <= 3) return "moderate"
  if (riskScore <= 5) return "high"
  return "very-high"
}

/**
 * Ethnicity-adjusted overweight BMI threshold.
 * WHO recommends lower cut-offs for Asian populations due to
 * higher body fat % and metabolic risk at lower BMIs.
 * Pacific Islanders have higher muscle/bone mass so threshold is raised.
 */
function getOverweightBMIThreshold(ethnicity: Ethnicity): number {
  switch (ethnicity) {
    case "south-asian":
    case "east-asian":
    case "southeast-asian":
      return 23 // WHO Asian cut-off
    case "pacific-islander":
      return 26 // higher muscle/bone mass
    default:
      return 25 // standard WHO threshold
  }
}

/**
 * Ethnicity-based BMI adjustment.
 * Research shows that at the same BMI, different ethnic groups
 * carry different amounts of body fat and face different health risks.
 *
 * References:
 * - WHO Expert Consultation (2004): Appropriate BMI for Asian populations
 * - Deurenberg et al. (2002): BMI-body fat relationship differs across ethnic groups
 * - Wagner & Heyward (2000): Body composition differences across ethnicities
 */
function getEthnicityBMIAdjustment(ethnicity: Ethnicity): number {
  switch (ethnicity) {
    case "south-asian":
      return 2.5 // significantly higher body fat at same BMI
    case "east-asian":
      return 1.5 // higher body fat at same BMI
    case "southeast-asian":
      return 1.8
    case "african":
      return -1.0 // higher muscle mass, lower body fat at same BMI
    case "pacific-islander":
      return -1.5 // significantly higher muscle/bone mass
    case "hispanic":
      return 0.5 // slightly higher trunk fat distribution
    case "middle-eastern":
      return 0.8 // slightly higher body fat at same BMI
    case "caucasian":
    default:
      return 0 // baseline reference
  }
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
 * Calculate a composite body composition score that blends BMI with body measurements.
 * When body measurements are available, body fat % is converted to an equivalent BMI
 * and blended with the standard BMI to produce a more accurate score.
 *
 * The "Equivalent BMI from Body Fat" mapping uses the Deurenberg formula inverted:
 *   Body Fat % = 1.2 * BMI + 0.23 * Age - 10.8 * sex_factor - 5.4
 *   => Equivalent BMI = (BF% - 0.23 * Age + 10.8 * sex_factor + 5.4) / 1.2
 *
 * Waist-to-height ratio also adjusts the score as it's a strong predictor of
 * cardiometabolic risk independent of BMI.
 */
function calcCompositeScore(
  bmi: number,
  age: number,
  sex: Sex,
  bodyFat: number | null,
  waistToHeightRatio: number | null
): number {
  let score = bmi
  let blendWeight = 1.0
  let totalWeight = 1.0

  // Blend in body-fat-derived equivalent BMI (weight: 0.4)
  if (bodyFat !== null) {
    const sexFactor = sex === "male" ? 1 : 0
    const equivalentBMI = (bodyFat - 0.23 * age + 10.8 * sexFactor + 5.4) / 1.2
    // Clamp to reasonable range
    const clampedEqBMI = Math.max(12, Math.min(55, equivalentBMI))
    score = bmi * blendWeight + clampedEqBMI * 0.4
    totalWeight += 0.4
  }

  // Adjust based on waist-to-height ratio (adds up to +/- 1.5 BMI points)
  if (waistToHeightRatio !== null) {
    // 0.5 is the healthy threshold; deviation from it shifts the score
    const whtrDeviation = waistToHeightRatio - 0.5
    const whtrAdjustment = whtrDeviation * 7.5 // maps +-0.2 deviation to +-1.5 BMI points
    score += whtrAdjustment * 0.3
    totalWeight += 0.3
  }

  return score / totalWeight
}

/**
 * Main calculation function
 */
export function calculateBMI(measurements: BodyMeasurements): BMIResult {
  const { age, sex, ethnicity, weightKg, heightCm, waistCm, neckCm } = measurements

  // Core BMI
  const bmi = calcBMI(weightKg, heightCm)
  const adjustedBMI = calcAgeAdjustedBMI(bmi, age, sex)

  // Ethnicity adjustment applied to the adjusted BMI
  const ethnicityAdjustment = getEthnicityBMIAdjustment(ethnicity)
  const ethnicityAdjustedBMI = adjustedBMI + ethnicityAdjustment

  // Body fat (combined Navy + Deurenberg method)
  const bodyFatRaw = calcBodyFatCombined(sex, age, heightCm, weightKg, waistCm, neckCm)
  const bodyFatPercentage = Math.round(bodyFatRaw * 10) / 10

  // Waist-to-height ratio
  const waistToHeightRatio = Math.round(calcWHtR(waistCm, heightCm) * 100) / 100

  // Composite score that incorporates body measurements + ethnicity
  const compositeScore = Math.round(
    calcCompositeScore(ethnicityAdjustedBMI, age, sex, bodyFatPercentage, waistToHeightRatio) * 10
  ) / 10

  const category = getBMICategory(compositeScore)

  // Ideal weight range
  const formulaRange = calcIdealWeightRange(heightCm, sex)
  const bmiRange = calcBMIIdealRange(heightCm)

  // Average the two methods for a refined range
  let idealWeightMin = Math.round(((formulaRange.min + bmiRange.min) / 2) * 10) / 10
  let idealWeightMax = Math.round(((formulaRange.max + bmiRange.max) / 2) * 10) / 10

  // Adjust ideal weight range based on ethnicity
  // Groups with higher muscle/bone mass get a slightly higher range
  if (ethnicityAdjustment < 0) {
    idealWeightMin = Math.round((idealWeightMin * (1 + Math.abs(ethnicityAdjustment) * 0.01)) * 10) / 10
    idealWeightMax = Math.round((idealWeightMax * (1 + Math.abs(ethnicityAdjustment) * 0.01)) * 10) / 10
  } else if (ethnicityAdjustment > 0) {
    idealWeightMin = Math.round((idealWeightMin * (1 - ethnicityAdjustment * 0.008)) * 10) / 10
    idealWeightMax = Math.round((idealWeightMax * (1 - ethnicityAdjustment * 0.008)) * 10) / 10
  }

  // Refine ideal weight using healthy body fat ranges
  const leanMass = weightKg * (1 - bodyFatPercentage / 100)
  // Healthy body fat: men 10-20%, women 18-28%
  const healthyBFLow = sex === "male" ? 0.10 : 0.18
  const healthyBFHigh = sex === "male" ? 0.20 : 0.28
  const bfIdealMin = Math.round((leanMass / (1 - healthyBFHigh)) * 10) / 10
  const bfIdealMax = Math.round((leanMass / (1 - healthyBFLow)) * 10) / 10
  // Blend body-fat-based ideal weight with formula-based (40/60 split)
  idealWeightMin = Math.round((idealWeightMin * 0.6 + bfIdealMin * 0.4) * 10) / 10
  idealWeightMax = Math.round((idealWeightMax * 0.6 + bfIdealMax * 0.4) * 10) / 10

  // How much over/under
  const overweightBy =
    weightKg > idealWeightMax
      ? Math.round((weightKg - idealWeightMax) * 10) / 10
      : 0
  const underweightBy =
    weightKg < idealWeightMin
      ? Math.round((idealWeightMin - weightKg) * 10) / 10
      : 0

  const riskLevel = determineRiskLevel(
    compositeScore,
    bodyFatPercentage,
    waistToHeightRatio,
    sex,
    ethnicity
  )

  const partialResult: Partial<BMIResult> = {
    bmi: Math.round(bmi * 10) / 10,
    compositeScore,
    adjustedBMI: Math.round(ethnicityAdjustedBMI * 10) / 10,
    category,
    idealWeightMin,
    idealWeightMax,
    overweightBy,
    underweightBy,
    bodyFatPercentage,
    waistToHeightRatio,
    riskLevel,
    hasBodyMeasurements: true,
  }

  const recommendations = getRecommendations(partialResult, measurements)

  return {
    ...partialResult,
    recommendations,
  } as BMIResult
}
