/**
 * Neurodegenerative risk profile: dementia risk factors scored from answers already given in
 * other modules (no extra questions).
 *
 * One source per factor, in priority order:
 * 1. Lancet Commission 2024 (Livingston et al., Lancet 404:572-628): relative risks for its
 *    14 potentially modifiable factors, plus its diet-quality meta-analysis.
 * 2. LIBRA2 (Rosenau et al., J Alzheimers Dis 2024): sleep problems and cognitive activity.
 * 3. Single meta-analyses where neither applies: perceived stress (Franks et al., J Alzheimers
 *    Dis 2021) and family history (Cannon-Albright et al., Neurology 2019).
 *
 * Relative risks multiply (LIBRA sums 6 × ln RR, the same thing on a log scale). The result is a
 * profile versus someone with none of the assessed factors, not an absolute prediction: age and
 * APOE ε4 dominate absolute risk.
 *
 * Cut-offs follow the app rule "strictest threshold, reference standard cited". Blood pressure,
 * LDL cholesterol, diabetes and head injury (4 of the 14 Lancet factors) are not collected, so the
 * profile can only under-count.
 */

import { calculateExerciseScore, type ExerciseInputs } from "./exercise-calculator"
import type { DietAnswers } from "./diet-calculator"
import type { FamilyHistoryAnswers, FamilyRelation } from "./family-history-calculator"
import type { LifeContextAnswers } from "./life-context-calculator"
import type { LifestyleAnswers } from "./lifestyle-calculator"
import { calculateMentalHealth, type MentalHealthAnswers } from "./mental-health-calculator"
import type { SensesOralAnswers } from "./senses-oral-calculator"
import type { WorkAnswers } from "./work-calculator"

export type NeuroRiskBand = "low" | "moderate" | "elevated" | "high"

export type NeuroFactorId =
  | "education"
  | "hearing"
  | "vision"
  | "depression"
  | "stress"
  | "inactivity"
  | "smoking"
  | "obesity"
  | "alcohol"
  | "isolation"
  | "airPollution"
  | "diet"
  | "cognitive"
  | "sleep"
  | "familyHistory"

export interface NeuroRiskInputs {
  bmiCategory?: "underweight" | "normal" | "overweight" | "obese" | "severely_obese"
  /** Annual mean PM2.5 in µg/m³ */
  pm25?: number
  socialConnection?: "strong" | "moderate" | "weak" | "isolated"
  lifestyle?: LifestyleAnswers
  mental?: MentalHealthAnswers
  exercise?: ExerciseInputs
  diet?: DietAnswers
  senses?: SensesOralAnswers
  lifeContext?: LifeContextAnswers
  work?: WorkAnswers
  family?: FamilyHistoryAnswers
}

export interface NeuroRiskFactor {
  id: NeuroFactorId
  label: string
  relativeRisk: number
  modifiable: boolean
}

export interface NeuroRiskResult {
  band: NeuroRiskBand
  bandLabel: string
  summary: string
  /** Combined relative risk versus having none of the assessed factors */
  relativeRisk: number
  /** Strongest first */
  flagged: NeuroRiskFactor[]
  protective: string[]
  factorsAssessed: number
  totalFactors: number
  notAssessed: string[]
}

const RELATIVE_RISK = {
  education: 1.6, // Lancet 2024 Table 1: less education
  hearing: 1.37, // Lancet 2024 meta-analysis
  vision: 1.47, // Lancet 2024 meta-analysis
  depression: 2.25, // Lancet 2024 meta-analysis of studies with 10-14 years of follow-up
  inactivity: 1 / 0.8, // Lancet 2024: RR 0.80 for physically active vs inactive
  smoking: 1.3, // Lancet 2024: midlife smoking
  obesity: 1.31, // Lancet 2024: midlife obesity
  alcohol: 1.18, // Lancet 2020/2024: over 21 vs under 14 UK units a week
  isolation: 1.6, // Lancet 2024 Table 1: social isolation
  weakTies: 1.26, // Lancet 2024: loneliness
  pm25PerMicrogram: 1.03, // Lancet 2024: per 1 µg/m³ of PM2.5, 20 studies
  diet: 1 / 0.8, // Lancet 2024: RR 0.80 for high vs low diet quality
  cognitive: 1 / 0.61, // LIBRA2: RR 0.61 for high cognitive activity
  sleep: Math.exp(1.1 / 6), // LIBRA2 weight +1.1 (= 6 × ln RR), RR ≈ 1.2
  stress: 1.44, // Franks 2021: higher perceived stress
}

const FAMILY_HISTORY_RR: Record<FamilyRelation, number> = {
  none: 1,
  // No published estimate for second-degree relatives alone; kept below the 1.43 that
  // Cannon-Albright 2019 found for three or more affected third-degree relatives
  "second-degree": 1.2,
  "first-degree": 1.73, // Cannon-Albright 2019: at least one affected first-degree relative
  "multiple-or-early": 3.98, // Cannon-Albright 2019: two or more affected first-degree relatives
}

const WHO_PM25_GUIDELINE = 5 // WHO AQG 2021 annual mean
// The linear dose-response isn't extrapolated beyond WHO interim target 2
const PM25_DOSE_RESPONSE_CAP = 25
const WHO_ACTIVITY_MET_MINUTES = 600 // 150 min/week of moderate activity
// UK CMO low-risk limit, stricter than the Lancet's 21 units
const ALCOHOL_UNITS_PER_WEEK_LIMIT = 14
const MIN_SLEEP_HOURS = 7 // AASM/SRS adult minimum
const MAX_SLEEP_HOURS = 9
const K10_DISTRESS_CUTOFF = 20 // Andrews & Slade 2001: 20+ is at least mild distress
const MIN_FACTORS_ASSESSED = 4
const TOTAL_FACTORS = 15
const NOT_ASSESSED = ["blood pressure", "LDL cholesterol", "diabetes", "head injury"]

const ALCOHOL_SESSIONS_PER_WEEK: Record<LifestyleAnswers["alcoholFrequency"], number> = {
  never: 0,
  monthly: 0.25,
  weekly: 1,
  "several-weekly": 3,
  daily: 7,
}

// MIND diet groups (Morris 2015) that map onto diet-module questions, each answered 0-4
const BRAIN_HEALTHY_FOODS = ["vegetables", "fruits", "wholegrains", "legumes", "fish_protein"]
const FOODS_TO_LIMIT = ["red_meat", "processed_meat", "saturated_fat", "ultra_processed", "high_temp_cooking"]

function brainDietQuality(diet: DietAnswers): number | undefined {
  const parts: number[] = []
  for (const id of BRAIN_HEALTHY_FOODS) {
    if (Number.isFinite(diet[id])) parts.push(diet[id] / 4)
  }
  for (const id of FOODS_TO_LIMIT) {
    if (Number.isFinite(diet[id])) parts.push(1 - diet[id] / 4)
  }
  if (parts.length < 6) return undefined
  return parts.reduce((sum, part) => sum + part, 0) / parts.length
}

function getBand(relativeRisk: number): Pick<NeuroRiskResult, "band" | "bandLabel" | "summary"> {
  if (relativeRisk < 1.5) {
    return {
      band: "low",
      bandLabel: "Low",
      summary: "Close to the lowest-risk profile. Keep protecting your brain health.",
    }
  }
  if (relativeRisk < 2.5) {
    return {
      band: "moderate",
      bandLabel: "Moderate",
      summary: "Addressing the flagged factors can lower your risk.",
    }
  }
  if (relativeRisk < 4) {
    return {
      band: "elevated",
      bandLabel: "Elevated",
      summary: "Several factors add up. Start with the strongest drivers.",
    }
  }
  return {
    band: "high",
    bandLabel: "High",
    summary: "Strong or multiple risk factors. Consider a brain-health check with a clinician.",
  }
}

export function calculateNeuroRisk(inputs: NeuroRiskInputs): NeuroRiskResult | null {
  const flagged: NeuroRiskFactor[] = []
  const protective: string[] = []
  let assessed = 0

  function flag(id: NeuroFactorId, label: string, relativeRisk: number, modifiable = true) {
    flagged.push({ id, label, relativeRisk, modifiable })
  }

  if (inputs.bmiCategory) {
    assessed++
    // The composite category already applies the strictest ethnicity-specific cut-offs (WHO: BMI 30)
    if (inputs.bmiCategory === "obese" || inputs.bmiCategory === "severely_obese") {
      flag("obesity", "Obesity", RELATIVE_RISK.obesity)
    }
  }

  if (inputs.pm25 !== undefined && Number.isFinite(inputs.pm25)) {
    assessed++
    if (inputs.pm25 > WHO_PM25_GUIDELINE) {
      const excess = Math.min(inputs.pm25, PM25_DOSE_RESPONSE_CAP) - WHO_PM25_GUIDELINE
      flag("airPollution", `PM2.5 ${Math.round(inputs.pm25)} µg/m³`, RELATIVE_RISK.pm25PerMicrogram ** excess)
    } else {
      protective.push("Clean air")
    }
  }

  const { senses } = inputs
  if (senses) {
    assessed += 2
    if (senses.hearingDifficulty && senses.hearingDifficulty !== "none") {
      // Hearing aids offset the excess (Lancet 2024: HR 0.73 vs untreated, and 1.37 × 0.73 ≈ 1)
      if (senses.hearingAids === "wears") protective.push("Hearing loss treated")
      else flag("hearing", "Untreated hearing loss", RELATIVE_RISK.hearing)
    }
    if (senses.visionCorrection === "blurry-with-correction" || senses.visionCorrection === "uncorrected-impairment") {
      flag("vision", "Vision impairment", RELATIVE_RISK.vision)
    }
  }

  let depression = false
  let stress = false
  let stressAssessed = false

  if (inputs.mental) {
    const { phq2Score, phq2Flag, k10Score, gad2Flag, cognitiveScore } = calculateMentalHealth(inputs.mental).subScores
    if (Number.isFinite(phq2Score)) {
      assessed++
      depression = phq2Flag
    }
    if (Number.isFinite(k10Score)) {
      stressAssessed = true
      stress = k10Score >= K10_DISTRESS_CUTOFF || gad2Flag
    }
    if (Number.isFinite(cognitiveScore)) {
      assessed++
      if (cognitiveScore < 50) flag("cognitive", "Low cognitive activity", RELATIVE_RISK.cognitive)
      else if (cognitiveScore >= 75) protective.push("Cognitively active")
    }
  }

  const { work } = inputs
  if (
    work &&
    (work.employmentStatus === "employed" ||
      work.employmentStatus === "freelancer" ||
      work.employmentStatus === "entrepreneur")
  ) {
    stressAssessed = true
    stress ||= work.workExhaustion === "often" || work.workExhaustion === "always"
  }

  const { lifeContext } = inputs
  if (lifeContext) {
    stressAssessed = true
    stress ||= lifeContext.financialStress === "high" || lifeContext.financialStress === "severe"
    assessed++
    if (lifeContext.educationLevel === "none" || lifeContext.educationLevel === "primary") {
      flag("education", "Less education", RELATIVE_RISK.education, false)
    }
  }

  if (depression) flag("depression", "Depressive symptoms", RELATIVE_RISK.depression)
  if (stressAssessed) {
    assessed++
    if (stress) flag("stress", "Chronic stress", RELATIVE_RISK.stress)
  }

  if (inputs.exercise) {
    const { totalMETMinutes } = calculateExerciseScore(inputs.exercise)
    if (Number.isFinite(totalMETMinutes)) {
      assessed++
      if (totalMETMinutes < WHO_ACTIVITY_MET_MINUTES) {
        flag("inactivity", "Physical inactivity", RELATIVE_RISK.inactivity)
      } else if (totalMETMinutes >= 2 * WHO_ACTIVITY_MET_MINUTES) {
        protective.push("Physically active")
      }
    }
  }

  const { lifestyle } = inputs
  if (lifestyle) {
    assessed += 2
    if (lifestyle.smokingStatus === "daily" || lifestyle.smokingStatus === "occasional") {
      flag("smoking", "Smoking", RELATIVE_RISK.smoking)
    }
    const offRangeSleep =
      lifestyle.sleepHoursPerNight < MIN_SLEEP_HOURS || lifestyle.sleepHoursPerNight > MAX_SLEEP_HOURS
    const poorSleep =
      lifestyle.sleepQuality === "poor" ||
      lifestyle.sleepQuality === "very-poor" ||
      lifestyle.sleepDifficulty === "often" ||
      lifestyle.sleepDifficulty === "always"
    if (offRangeSleep || poorSleep) flag("sleep", "Sleep problems", RELATIVE_RISK.sleep)
  }

  let heavyDrinking: boolean | undefined
  if (lifestyle) {
    const weeklyUnits =
      (ALCOHOL_SESSIONS_PER_WEEK[lifestyle.alcoholFrequency] ?? 0) * (lifestyle.alcoholUnitsPerSession ?? 0)
    heavyDrinking = weeklyUnits > ALCOHOL_UNITS_PER_WEEK_LIMIT
  } else if (inputs.diet && Number.isFinite(inputs.diet.alcohol)) {
    // Diet answer 3 = "1-2 drinks daily": 10-21 UK units a week at 12 g per drink, over the limit at its midpoint
    heavyDrinking = inputs.diet.alcohol >= 3
  }
  if (heavyDrinking !== undefined) {
    assessed++
    if (heavyDrinking) {
      flag("alcohol", `Alcohol over ${ALCOHOL_UNITS_PER_WEEK_LIMIT} units/week`, RELATIVE_RISK.alcohol)
    }
  }

  const { socialConnection } = inputs
  if (socialConnection || lifeContext) {
    assessed++
    if (socialConnection === "isolated" || lifeContext?.closeConfidants === 0) {
      flag("isolation", "Social isolation", RELATIVE_RISK.isolation)
    } else if (socialConnection === "weak") {
      flag("isolation", "Weak social ties", RELATIVE_RISK.weakTies)
    } else if (socialConnection === "strong") {
      protective.push("Strong social ties")
    }
  }

  const dietQuality = inputs.diet ? brainDietQuality(inputs.diet) : undefined
  if (dietQuality !== undefined) {
    assessed++
    if (dietQuality < 0.5) flag("diet", "Low diet quality", RELATIVE_RISK.diet)
    else if (dietQuality >= 0.75) protective.push("Brain-healthy diet")
  }

  const familyRelation = inputs.family?.alzheimers
  if (familyRelation) {
    assessed++
    const relativeRisk = FAMILY_HISTORY_RR[familyRelation] ?? 1
    if (relativeRisk > 1) flag("familyHistory", "Family history", relativeRisk, false)
  }

  if (assessed < MIN_FACTORS_ASSESSED) return null

  // Distress scales share items with depression screens, so the two count once, at the stronger RR
  const counted = depression ? flagged.filter((factor) => factor.id !== "stress") : flagged
  const relativeRisk =
    Math.round(counted.reduce((product, factor) => product * factor.relativeRisk, 1) * 10) / 10

  return {
    ...getBand(relativeRisk),
    relativeRisk,
    flagged: [...flagged].sort((a, b) => b.relativeRisk - a.relativeRisk),
    protective,
    factorsAssessed: assessed,
    totalFactors: TOTAL_FACTORS,
    notAssessed: NOT_ASSESSED,
  }
}
