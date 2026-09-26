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
  // Optional circumference measurements. When provided they unlock body-fat %
  // (Navy method for men, Relative Fat Mass for women) and waist-to-height ratio for a more precise score.
  waistCm?: number
  neckCm?: number
  wristCm?: number
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
 * 1. Circumference method
 *    - Male: U.S. Navy formula (Hodgdon & Beckett 1984) from waist, neck, height:
 *      495 / (1.0324 - 0.19077*log10(waist-neck) + 0.15456*log10(height)) - 450
 *    - Female: the Navy formula needs hip circumference, which isn't collected, so we
 *      use Relative Fat Mass (Woolcott & Bergman 2018, Sci Rep; DXA-validated in NHANES):
 *      RFM = 76 - 20*(height/waist)
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

  let circumference: number | null = null
  if (sex === "male") {
    if (waistCm > neckCm) {
      circumference =
        495 /
          (1.0324 -
            0.19077 * Math.log10(waistCm - neckCm) +
            0.15456 * Math.log10(heightCm)) -
        450
    }
  } else if (waistCm > 0) {
    circumference = 76 - 20 * (heightCm / waistCm)
  }

  if (circumference !== null) {
    circumference = Math.max(sex === "male" ? 2 : 8, Math.min(circumference, 60))
    // Average both methods
    const combined = (deurenberg + circumference) / 2
    return Math.max(2, Math.min(combined, 60))
  }

  return Math.max(2, Math.min(deurenberg, 60))
}

/**
 * Body Fat % using the Deurenberg formula only (no circumference measurements).
 * Used as a fallback when waist/neck are not provided.
 *   BF% = 1.2*BMI + 0.23*age - 10.8*sexFactor - 5.4
 */
function calcBodyFatDeurenberg(
  sex: Sex,
  age: number,
  heightCm: number,
  weightKg: number
): number {
  const sexFactor = sex === "male" ? 1 : 0
  const heightM = heightCm / 100
  const bmi = weightKg / (heightM * heightM)
  const deurenberg = 1.2 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4
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
 * BMI-based ideal weight range: from 18.5 to just below the overweight cut-off, which is
 * lower for the NICE NG246 groups (see ETHNICITY_BMI_OFFSETS)
 */
function calcBMIIdealRange(heightCm: number, overweightCutoff: number): { min: number; max: number } {
  const heightM = heightCm / 100
  return {
    min: Math.round(UNDERWEIGHT_CUTOFF * heightM * heightM * 10) / 10,
    max: Math.round((overweightCutoff - 0.1) * heightM * heightM * 10) / 10,
  }
}

/**
 * Determine risk level based on all available metrics
 */
function determineRiskLevel(
  bmi: number,
  bodyFat: number | null,
  whtr: number | null,
  sex: Sex
): "low" | "moderate" | "high" | "very-high" {
  let riskScore = 0

  // `bmi` is the composite score, which already carries the ethnicity adjustment, so the
  // standard WHO cut-offs apply here (lowering them again would double-count ethnicity)
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

  // Waist-to-height ratio (most predictive). NICE NG246 bands: 0.5-0.59 increased, 0.6+ high risk
  if (whtr !== null) {
    if (whtr >= 0.5) riskScore += 1
    if (whtr >= 0.6) riskScore += 1
  }

  if (riskScore <= 1) return "low"
  if (riskScore <= 3) return "moderate"
  if (riskScore <= 5) return "high"
  return "very-high"
}

/**
 * Ethnicity-based BMI adjustment, added to the composite score before the standard WHO
 * cut-offs apply.
 * At the same BMI, cardiometabolic risk differs by ancestry. NICE NG246 (2025) and the
 * WHO Expert Consultation (2004) use lower cut-offs (overweight from 23, obesity from
 * 27.5) for South Asian, Chinese and other Asian, Middle Eastern, Black African and
 * African-Caribbean backgrounds. In UK Biobank-scale data (n = 1.5M), the type 2
 * diabetes risk of a White adult at BMI 30 is reached at 23.9 (South Asian), 26.6 (Arab),
 * 26.9 (Chinese) and 28.1 (Black) (Caleyachetty et al. 2021, Lancet Diabetes Endocrinol).
 *
 * Each group has one offset at the overweight cut-off and one at the obesity cut-off, and
 * the offset moves linearly between them, so both cut-offs land exactly on WHO 25 and 30.
 * Below the overweight cut-off the offset tapers to zero at 18.5, since underweight starts
 * at the same BMI for everyone. Where guidelines differ, the strictest cut-off is used:
 * obesity from 27.5 for every NICE group, overweight from 22.5 for South Asian backgrounds
 * (the highest risk at a given BMI), and the standard WHO cut-offs for Pacific Islander
 * backgrounds, who carry more lean mass at the same BMI but have no raised cut-off in any
 * current guideline.
 *
 * References:
 * - NICE NG246: Overweight and obesity management (2025)
 * - WHO Expert Consultation (2004): Appropriate BMI for Asian populations
 * - Caleyachetty et al. (2021): Ethnicity-specific BMI cut-offs for obesity
 * - Swinburn et al. (1999): Polynesians carry more lean mass at the same BMI
 */
const UNDERWEIGHT_CUTOFF = 18.5

const ETHNICITY_BMI_OFFSETS: Record<Ethnicity, { overweight: number; obesity: number }> = {
  "south-asian": { overweight: 2.5, obesity: 2.5 },
  "east-asian": { overweight: 2.0, obesity: 2.5 },
  "southeast-asian": { overweight: 2.0, obesity: 2.5 },
  "middle-eastern": { overweight: 2.0, obesity: 2.5 },
  african: { overweight: 2.0, obesity: 2.5 },
  hispanic: { overweight: 0.5, obesity: 0.5 }, // slightly higher trunk fat distribution
  "pacific-islander": { overweight: 0, obesity: 0 },
  caucasian: { overweight: 0, obesity: 0 }, // baseline reference
}

function getEthnicityOffsets(ethnicity: Ethnicity): { overweight: number; obesity: number } {
  return ETHNICITY_BMI_OFFSETS[ethnicity] ?? ETHNICITY_BMI_OFFSETS.caucasian
}

function getEthnicityBMIAdjustment(ethnicity: Ethnicity, bmi: number): number {
  const { overweight, obesity } = getEthnicityOffsets(ethnicity)
  const overweightCutoff = 25 - overweight
  const obesityCutoff = 30 - obesity
  if (bmi <= UNDERWEIGHT_CUTOFF) return 0
  if (bmi < overweightCutoff) {
    return (overweight * (bmi - UNDERWEIGHT_CUTOFF)) / (overweightCutoff - UNDERWEIGHT_CUTOFF)
  }
  if (bmi >= obesityCutoff) return obesity
  const t = (bmi - overweightCutoff) / (obesityCutoff - overweightCutoff)
  return overweight + (obesity - overweight) * t
}

/**
 * WHO international BMI classification
 */
export function getBMICategory(bmi: number): string {
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
    waistToHeightRatio >= 0.5
  ) {
    recs.push(
      "Your waist-to-height ratio indicates increased abdominal fat. Reducing waist circumference is particularly beneficial for heart health."
    )
  }

  // Lancet Diabetes & Endocrinology Commission on clinical obesity (Rubino et al. 2025):
  // below BMI 40, excess adiposity should be confirmed with a waist-based or body-fat measure
  const compositeBMI = result.compositeScore
  if (compositeBMI !== undefined && compositeBMI >= 30 && compositeBMI < 40) {
    if (waistToHeightRatio === null || waistToHeightRatio === undefined) {
      recs.push(
        "Your BMI is in the obesity range, but BMI alone can't confirm excess body fat (Lancet Commission on clinical obesity, 2025). Add your waist measurement to check your waist-to-height ratio."
      )
    } else if (waistToHeightRatio < 0.5) {
      recs.push(
        "Your BMI is in the obesity range but your waist-to-height ratio is under 0.5, so BMI may be overstating body fat (for example with a muscular build)."
      )
    }
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
  // Weighted average of available metrics, all expressed on the BMI scale
  let weightedSum = bmi * 1.0
  let totalWeight = 1.0

  // Blend in body-fat-derived equivalent BMI (weight: 0.4)
  if (bodyFat !== null) {
    const sexFactor = sex === "male" ? 1 : 0
    const equivalentBMI = (bodyFat - 0.23 * age + 10.8 * sexFactor + 5.4) / 1.2
    const clampedEqBMI = Math.max(12, Math.min(55, equivalentBMI))
    weightedSum += clampedEqBMI * 0.4
    totalWeight += 0.4
  }

  let blendedScore = weightedSum / totalWeight

  // WHtR adjustment: applied as a small additive offset (not a separate weighted blend)
  // 0.5 is the healthy threshold; deviation shifts the score slightly
  if (waistToHeightRatio !== null) {
    const whtrDeviation = waistToHeightRatio - 0.5
    const whtrAdjustment = whtrDeviation * 7.5 // maps +/-0.2 deviation to +/-1.5 BMI points
    blendedScore += whtrAdjustment * 0.3
  }

  return blendedScore
}

type BodyFatRange = [low: number, high: number]

// Healthy body fat (fraction) matching BMI 18.5-25 at ages 20-39, 40-59 and 60+
// (Gallagher et al. 2000, Am J Clin Nutr)
const HEALTHY_BODY_FAT: Record<Sex, [BodyFatRange, BodyFatRange, BodyFatRange]> = {
  male: [[0.08, 0.2], [0.11, 0.22], [0.13, 0.25]],
  female: [[0.21, 0.33], [0.23, 0.34], [0.24, 0.36]],
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
  const ethnicityAdjustedBMI = adjustedBMI + getEthnicityBMIAdjustment(ethnicity, adjustedBMI)

  // Body measurements are optional. Waist + neck unlock the circumference body-fat
  // method (Navy for men, RFM for women) and waist-to-height ratio. Without them we
  // fall back to a BMI-only estimate.
  const hasBodyMeasurements =
    typeof waistCm === "number" && typeof neckCm === "number"

  // Body fat: circumference method averaged with Deurenberg; without measurements,
  // Deurenberg (BMI/age/sex) only.
  const bodyFatRaw = hasBodyMeasurements
    ? calcBodyFatCombined(sex, age, heightCm, weightKg, waistCm!, neckCm!)
    : calcBodyFatDeurenberg(sex, age, heightCm, weightKg)
  const bodyFatPercentage = Math.round(bodyFatRaw * 10) / 10

  // Waist-to-height ratio (only when waist is provided)
  const waistToHeightRatio =
    typeof waistCm === "number"
      ? Math.round(calcWHtR(waistCm, heightCm) * 100) / 100
      : null

  // Composite score that incorporates body measurements. The ethnicity offset is added after
  // blending: the body-fat term is ethnicity-neutral, so blending it in would dilute the
  // offset and push the NICE NG246 cut-offs back up.
  const blendedScore = calcCompositeScore(adjustedBMI, age, sex, bodyFatPercentage, waistToHeightRatio)
  const compositeScore = Math.round(
    (blendedScore + getEthnicityBMIAdjustment(ethnicity, blendedScore)) * 10
  ) / 10

  const category = getBMICategory(compositeScore)

  // Ideal weight range. The BMI method stops below the ethnicity-specific overweight cut-off.
  const formulaRange = calcIdealWeightRange(heightCm, sex)
  const bmiRange = calcBMIIdealRange(heightCm, 25 - getEthnicityOffsets(ethnicity).overweight)

  // Average the two methods for a refined range
  let idealWeightMin = Math.round(((formulaRange.min + bmiRange.min) / 2) * 10) / 10
  let idealWeightMax = Math.round(((formulaRange.max + bmiRange.max) / 2) * 10) / 10

  // Refine ideal weight using healthy body fat ranges
  const leanMass = weightKg * (1 - bodyFatPercentage / 100)
  const [healthyBFLow, healthyBFHigh] = HEALTHY_BODY_FAT[sex][age < 40 ? 0 : age < 60 ? 1 : 2]
  // The lowest healthy weight keeps current lean mass at the low end of healthy body fat
  const bfIdealMin = Math.round((leanMass / (1 - healthyBFLow)) * 10) / 10
  const bfIdealMax = Math.round((leanMass / (1 - healthyBFHigh)) * 10) / 10
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
    sex
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
    hasBodyMeasurements,
  }

  const recommendations = getRecommendations(partialResult, measurements)

  return {
    ...partialResult,
    recommendations,
  } as BMIResult
}
