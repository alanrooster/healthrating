/**
 * Cancer risk profile: lifestyle and environmental cancer risk factors scored from answers already
 * given in other modules (no extra questions).
 *
 * The factors follow the European Code Against Cancer, 5th edition (ECAC5, IARC/WHO 2025): 10 of
 * its 14 recommendations map onto collected answers. One source per factor, in priority order:
 * 1. WCRF/AICR 2018 Cancer Prevention Recommendations, operationalised with the standardised 0-7
 *    score (Shams-White et al., Nutrients 2019): weight, activity, plant foods, ultra-processed
 *    food, red and processed meat, sugary drinks and alcohol. Each point missed counts as 1 / 0.93,
 *    the HR per point for all cancers combined in UK Biobank (Malcomson et al., BMC Med 2023,
 *    adjusted for smoking).
 * 2. American Cancer Society cohorts (Patel et al., Cancer 2022): current and past smoking and a
 *    first-degree family history of cancer, as multivariable HRs for any invasive cancer.
 * 3. Single meta-analyses for carcinogens that act on one site, scaled to all cancers by that
 *    site's share of new cases in Europe (GLOBOCAN 2024): second-hand smoke (Hackshaw et al., BMJ
 *    1997), radon (Darby et al., BMJ 2005) and PM2.5 (Hamra et al., EHP 2014) for lung cancer, and
 *    sunburn for melanoma (Gandini et al., Eur J Cancer 2005).
 *
 * Relative risks multiply. The result is a profile versus someone with none of the assessed
 * factors, not an absolute prediction: age and inherited variants dominate absolute risk.
 * Infections and vaccines, workplace carcinogens, breastfeeding and HRT are not collected, so the
 * profile can only under-count. Screening mostly finds cancer earlier rather than preventing it, so
 * its status is reported alongside instead of being scored.
 *
 * Cut-offs follow the app rule "strictest threshold, reference standard cited".
 */

import { calculateExerciseScore, type ExerciseInputs } from "./exercise-calculator"
import type { DietAnswers } from "./diet-calculator"
import type { FamilyHistoryAnswers } from "./family-history-calculator"
import type { HomeEnvironmentAnswers } from "./home-environment-calculator"
import type { LifestyleAnswers } from "./lifestyle-calculator"
import type { PreventiveCareAnswers } from "./preventive-care-calculator"

type Sex = "male" | "female"

export type CancerRiskBand = "low" | "moderate" | "elevated" | "high"

export type CancerFactorId =
  | "smoking"
  | "secondhandSmoke"
  | "weight"
  | "activity"
  | "plantFoods"
  | "ultraProcessed"
  | "meat"
  | "sugaryDrinks"
  | "alcohol"
  | "sunburn"
  | "radon"
  | "airPollution"
  | "familyHistory"

export interface CancerRiskInputs {
  sex?: Sex
  bmiCategory?: "underweight" | "normal" | "overweight" | "obese" | "severely_obese"
  waistCm?: number
  /** Annual mean PM2.5 in µg/m³ */
  pm25?: number
  lifestyle?: LifestyleAnswers
  exercise?: ExerciseInputs
  diet?: DietAnswers
  home?: HomeEnvironmentAnswers
  family?: FamilyHistoryAnswers
  preventive?: PreventiveCareAnswers
}

export interface CancerRiskFactor {
  id: CancerFactorId
  label: string
  relativeRisk: number
  modifiable: boolean
}

export interface CancerRiskResult {
  band: CancerRiskBand
  bandLabel: string
  summary: string
  /** Combined relative risk versus having none of the assessed factors */
  relativeRisk: number
  /** Strongest first */
  flagged: CancerRiskFactor[]
  protective: string[]
  /** 2018 WCRF/AICR score over the components answered */
  preventionScore?: { points: number; maxPoints: number }
  screening?: "up-to-date" | "due"
  factorsAssessed: number
  totalFactors: number
  notAssessed: string[]
}

// Malcomson 2023: HR 0.93 (0.90-0.95) per 1-point increment in the score, all cancers combined
const RR_PER_WCRF_POINT_MISSED = 1 / 0.93

// Patel 2022, Table 2: multivariable HRs for any invasive cancer within 5 years
const CURRENT_SMOKING_RR: Record<Sex, number> = { male: 1.63, female: 1.55 }
// Years since quitting aren't collected, so the 10 to <20 years category stands in: the middle of
// the published range, from 1.04-1.05 after 30+ years to 1.37-1.38 within 10 years
const PAST_SMOKING_RR: Record<Sex, number> = { male: 1.23, female: 1.14 }
const FAMILY_HISTORY_RR: Record<Sex, number> = { male: 1.15, female: 1.08 }

// Share of new cancer cases in Europe, GLOBOCAN 2024 (IARC Global Cancer Observatory). Men's
// melanoma share = (150,781 both sexes - 75,157 women) / 2,279,135 new cases in men.
const LUNG_SHARE = { male: 0.137, female: 0.082, any: 0.111 }
const MELANOMA_SHARE = { male: 0.033, female: 0.037, any: 0.035 }

const SECONDHAND_SMOKE_LUNG_RR = 1.24 // Hackshaw 1997: never-smokers living with a smoker
const RADON_LUNG_ERR_PER_100_BQ = 0.16 // Darby 2005, corrected for measurement uncertainty
// "Known or likely high" is taken at the EU reference level (Directive 2013/59/Euratom); WHO
// recommends 100 Bq/m³
const HIGH_RADON_BQ = 300
const SUNBURN_MELANOMA_RR = 2.03 // Gandini 2005: history of sunburn
const PM25_LUNG_RR_PER_10 = 1.09 // Hamra 2014, the meta-analysis behind IARC Monograph 109
const WHO_PM25_GUIDELINE = 5 // WHO AQG 2021 annual mean
// The linear dose-response isn't extrapolated beyond WHO interim target 2
const PM25_DOSE_RESPONSE_CAP = 25

// Standardised 2018 WCRF/AICR score cut-offs (Shams-White 2019)
const WAIST_CM: Record<Sex, { full: number; partial: number }> = {
  male: { full: 94, partial: 102 },
  female: { full: 80, partial: 88 },
}
const MVPA_MET_MINUTES = { full: 600, partial: 300 } // 150 and 75 min/week of moderate activity
const FRUIT_VEG_G_PER_DAY = { full: 400, partial: 200 }
const FRUIT_VEG_SERVING_G = 80 // WHO portion
// Midpoints of the diet module's servings-a-day bands: none, under 1, 1-2, 2-3, 3+ (lower bound)
const DAILY_SERVINGS = [0, 0.5, 1.5, 2.5, 3]

const GRAMS_PER_DRINK = 12 // 1 beer, glass of wine or shot, as in the diet module
// Strictest of the standardised score (14 g/day for women, 28 for men) and UK CMO guidance
// (14 units = 112 g a week), the cut-off UK Biobank used
const ALCOHOL_LIMIT_G_PER_WEEK: Record<Sex, number> = { female: 98, male: 112 }
const ALCOHOL_SESSIONS_PER_WEEK: Record<LifestyleAnswers["alcoholFrequency"], number> = {
  never: 0,
  monthly: 0.25,
  weekly: 1,
  "several-weekly": 3,
  daily: 7,
}
// Diet module alcohol bands at their midpoints: never or rarely, 1-2 a week, 3-6 a week, 1-2 a day, 3+ a day
const DIET_DRINKS_PER_WEEK = [0, 1.5, 4.5, 10.5, 21]

const MIN_FACTORS_ASSESSED = 4
const TOTAL_FACTORS = 13
const NOT_ASSESSED = ["infections and vaccines", "workplace carcinogens"]
const NOT_ASSESSED_WOMEN_ONLY = ["breastfeeding", "HRT"]

interface WcrfComponent {
  id: CancerFactorId
  /** 0-1 */
  points: number
  label: string
  protectiveLabel?: string
}

function forSex(values: Record<Sex, number>, sex: Sex | undefined) {
  return sex ? values[sex] : (values.male + values.female) / 2
}

/** Scales a relative risk for one cancer site to all cancers combined */
function allCancerRisk(siteRelativeRisk: number, share: { male: number; female: number; any: number }, sex?: Sex) {
  return 1 + (sex ? share[sex] : share.any) * (siteRelativeRisk - 1)
}

function answerBand(values: number[], answer: number) {
  return values[Math.min(Math.max(Math.round(answer), 0), values.length - 1)]
}

// Each half of a split component is worth 0.5; when only one is answered it counts double
function combineHalves(first?: number, second?: number) {
  if (first === undefined) return second === undefined ? undefined : second * 2
  return second === undefined ? first * 2 : first + second
}

function scoreWeight(inputs: CancerRiskInputs): WcrfComponent | undefined {
  const { bmiCategory, waistCm, sex } = inputs
  // The composite category already applies the strictest ethnicity-specific BMI cut-offs
  const bmiPoints =
    bmiCategory === undefined ? undefined : bmiCategory === "normal" ? 0.5 : bmiCategory === "overweight" ? 0.25 : 0
  const waistCut = sex ? WAIST_CM[sex] : undefined
  const waistPoints =
    waistCut && waistCm !== undefined && Number.isFinite(waistCm) && waistCm > 0
      ? waistCm < waistCut.full
        ? 0.5
        : waistCm < waistCut.partial
          ? 0.25
          : 0
      : undefined
  const points = combineHalves(bmiPoints, waistPoints)
  if (points === undefined) return undefined
  const label =
    bmiCategory === "underweight"
      ? "Underweight"
      : bmiPoints === undefined || bmiPoints === 0.5
        ? "Large waist"
        : "Excess weight"
  return { id: "weight", points, label, protectiveLabel: "Healthy weight" }
}

function scoreActivity(exercise: ExerciseInputs): WcrfComponent | undefined {
  const { totalMETMinutes } = calculateExerciseScore(exercise)
  if (!Number.isFinite(totalMETMinutes)) return undefined
  const points =
    totalMETMinutes >= MVPA_MET_MINUTES.full ? 1 : totalMETMinutes >= MVPA_MET_MINUTES.partial ? 0.5 : 0
  return { id: "activity", points, label: "Low physical activity", protectiveLabel: "Physically active" }
}

function scoreDiet(diet: DietAnswers): WcrfComponent[] {
  const answered = (id: string) => Number.isFinite(diet[id])
  const components: WcrfComponent[] = []

  const fruitVegGrams =
    answered("fruits") && answered("vegetables")
      ? (answerBand(DAILY_SERVINGS, diet.fruits) + answerBand(DAILY_SERVINGS, diet.vegetables)) * FRUIT_VEG_SERVING_G
      : undefined
  const fruitVegPoints =
    fruitVegGrams === undefined
      ? undefined
      : fruitVegGrams >= FRUIT_VEG_G_PER_DAY.full
        ? 0.5
        : fruitVegGrams >= FRUIT_VEG_G_PER_DAY.partial
          ? 0.25
          : 0
  // Fibre grams aren't collected, so its main sources stand in for the 30 g/day goal: wholegrains
  // daily and pulses or nuts at least 3-4 times a week each earn half of the sub-component
  const fibrePoints =
    answered("wholegrains") && answered("legumes")
      ? (diet.wholegrains >= 3 ? 0.25 : 0) + (diet.legumes >= 2 ? 0.25 : 0)
      : undefined
  const plantPoints = combineHalves(fruitVegPoints, fibrePoints)
  if (plantPoints !== undefined) {
    components.push({ id: "plantFoods", points: plantPoints, label: "Few plant foods", protectiveLabel: "Plant-rich diet" })
  }

  if (answered("ultra_processed")) {
    // The score ranks energy from ultra-processed food in population tertiles; frequency stands in:
    // up to twice a week, up to once a day, several times a day
    const frequency = diet.ultra_processed
    components.push({
      id: "ultraProcessed",
      points: frequency <= 1 ? 1 : frequency <= 3 ? 0.5 : 0,
      label: "Ultra-processed food",
    })
  }

  if (answered("processed_meat") || answered("red_meat")) {
    // Portions: red meat about 140 g cooked (WCRF: three portions = 350-500 g), processed meat 50 g.
    // Red meat passes 500 g/week from 5-6 times a week; processed meat reaches 21 g/week from once
    // or twice a week and 100 g from 3-4 times.
    const redOverLimit = answered("red_meat") && diet.red_meat >= 3
    const processed = answered("processed_meat") ? diet.processed_meat : 0
    components.push({
      id: "meat",
      points: redOverLimit || processed >= 2 ? 0 : processed >= 1 ? 0.5 : 1,
      label: redOverLimit && processed >= 1 ? "Red & processed meat" : redOverLimit ? "Red meat" : "Processed meat",
    })
  }

  if (answered("sugary_drinks")) {
    // Any regular sugary drink loses the full point; more than one 250 ml serving a day loses both
    const frequency = diet.sugary_drinks
    components.push({
      id: "sugaryDrinks",
      points: frequency === 0 ? 1 : frequency <= 3 ? 0.5 : 0,
      label: "Sugary drinks",
    })
  }

  return components
}

function scoreAlcohol(inputs: CancerRiskInputs): WcrfComponent | undefined {
  const { lifestyle, diet, sex } = inputs
  let weeklyGrams: number | undefined
  if (lifestyle) {
    weeklyGrams =
      (ALCOHOL_SESSIONS_PER_WEEK[lifestyle.alcoholFrequency] ?? 0) *
      (lifestyle.alcoholUnitsPerSession ?? 0) *
      GRAMS_PER_DRINK
  } else if (diet && Number.isFinite(diet.alcohol)) {
    weeklyGrams = answerBand(DIET_DRINKS_PER_WEEK, diet.alcohol) * GRAMS_PER_DRINK
  }
  if (weeklyGrams === undefined) return undefined
  // WCRF and ECAC5 both advise not drinking at all, so only no alcohol earns the full point
  const limit = sex ? ALCOHOL_LIMIT_G_PER_WEEK[sex] : ALCOHOL_LIMIT_G_PER_WEEK.female
  const points = weeklyGrams === 0 ? 1 : weeklyGrams <= limit ? 0.5 : 0
  return {
    id: "alcohol",
    points,
    label: points === 0 ? "Alcohol above limits" : "Alcohol",
    protectiveLabel: "Alcohol-free",
  }
}

function getBand(relativeRisk: number): Pick<CancerRiskResult, "band" | "bandLabel" | "summary"> {
  if (relativeRisk < 1.2) {
    return {
      band: "low",
      bandLabel: "Low",
      summary: "Close to the lowest-risk profile. Keep up your cancer-protective habits.",
    }
  }
  if (relativeRisk < 1.5) {
    return {
      band: "moderate",
      bandLabel: "Moderate",
      summary: "Addressing the flagged factors can lower your risk.",
    }
  }
  if (relativeRisk < 2) {
    return {
      band: "elevated",
      bandLabel: "Elevated",
      summary: "Several factors add up. Start with the strongest drivers.",
    }
  }
  return {
    band: "high",
    bandLabel: "High",
    summary: "Strong or multiple risk factors. Talk to a clinician about prevention and screening.",
  }
}

export function calculateCancerRisk(inputs: CancerRiskInputs): CancerRiskResult | null {
  const { sex, lifestyle, home } = inputs
  const flagged: CancerRiskFactor[] = []
  const protective: string[] = []
  let assessed = 0

  function flag(id: CancerFactorId, label: string, relativeRisk: number, modifiable = true) {
    flagged.push({ id, label, relativeRisk, modifiable })
  }

  const currentSmoker = lifestyle?.smokingStatus === "daily" || lifestyle?.smokingStatus === "occasional"
  if (lifestyle) {
    assessed++
    if (currentSmoker) flag("smoking", "Smoking", forSex(CURRENT_SMOKING_RR, sex))
    else if (lifestyle.smokingStatus === "former") flag("smoking", "Past smoking", forSex(PAST_SMOKING_RR, sex), false)
    else protective.push("Never smoked")
  }

  const wcrfComponents = [
    scoreWeight(inputs),
    inputs.exercise ? scoreActivity(inputs.exercise) : undefined,
    ...(inputs.diet ? scoreDiet(inputs.diet) : []),
    scoreAlcohol(inputs),
  ].filter((component): component is WcrfComponent => component !== undefined)

  for (const component of wcrfComponents) {
    assessed++
    const pointsMissed = 1 - component.points
    if (pointsMissed > 0) flag(component.id, component.label, RR_PER_WCRF_POINT_MISSED ** pointsMissed)
    else if (component.protectiveLabel) protective.push(component.protectiveLabel)
  }

  if (home?.smokeIndoors) {
    assessed++
    // Active smoking already dominates a smoker's own exposure
    if (!currentSmoker && home.smokeIndoors !== "never") {
      flag("secondhandSmoke", "Second-hand smoke", allCancerRisk(SECONDHAND_SMOKE_LUNG_RR, LUNG_SHARE, sex))
    }
  }

  if (lifestyle && Number.isFinite(lifestyle.sunburnsPerYear)) {
    assessed++
    if (lifestyle.sunburnsPerYear >= 1) {
      flag("sunburn", "Sunburns", allCancerRisk(SUNBURN_MELANOMA_RR, MELANOMA_SHARE, sex))
    } else if (lifestyle.sunscreenUse === "always" || lifestyle.sunscreenUse === "usually") {
      protective.push("Sun-safe")
    }
  }

  // An untested home is unknown exposure, so it isn't counted either way
  if (home?.radonStatus && home.radonStatus !== "not-tested") {
    assessed++
    if (home.radonStatus === "high-untested") {
      const radonRelativeRisk = 1 + (RADON_LUNG_ERR_PER_100_BQ * HIGH_RADON_BQ) / 100
      flag("radon", "High radon at home", allCancerRisk(radonRelativeRisk, LUNG_SHARE, sex))
    } else {
      protective.push("Radon checked")
    }
  }

  if (inputs.pm25 !== undefined && Number.isFinite(inputs.pm25)) {
    assessed++
    if (inputs.pm25 > WHO_PM25_GUIDELINE) {
      const excess = Math.min(inputs.pm25, PM25_DOSE_RESPONSE_CAP) - WHO_PM25_GUIDELINE
      flag(
        "airPollution",
        `PM2.5 ${Math.round(inputs.pm25)} µg/m³`,
        allCancerRisk(PM25_LUNG_RR_PER_10 ** (excess / 10), LUNG_SHARE, sex),
      )
    } else {
      protective.push("Clean air")
    }
  }

  const { family } = inputs
  if (family && (family.cancerBreast || family.cancerColon || family.cancerOther)) {
    assessed++
    // Patel 2022 only covers first-degree relatives
    const firstDegree = [family.cancerBreast, family.cancerColon, family.cancerOther].some(
      (relation) => relation === "first-degree" || relation === "multiple-or-early",
    )
    if (firstDegree) flag("familyHistory", "Family history", forSex(FAMILY_HISTORY_RR, sex), false)
  }

  if (assessed < MIN_FACTORS_ASSESSED) return null

  // Two decimals: most single factors sit below 1.1, so one decimal would hide them
  const relativeRisk = Math.round(flagged.reduce((product, factor) => product * factor.relativeRisk, 1) * 100) / 100
  const screeningStatus = inputs.preventive?.cancerScreenings

  return {
    ...getBand(relativeRisk),
    relativeRisk,
    flagged: [...flagged].sort((a, b) => b.relativeRisk - a.relativeRisk),
    protective,
    preventionScore:
      wcrfComponents.length > 0
        ? {
            points: wcrfComponents.reduce((sum, component) => sum + component.points, 0),
            maxPoints: wcrfComponents.length,
          }
        : undefined,
    screening:
      screeningStatus === "current"
        ? "up-to-date"
        : screeningStatus && screeningStatus !== "not-applicable"
          ? "due"
          : undefined,
    factorsAssessed: assessed,
    totalFactors: TOTAL_FACTORS,
    notAssessed: sex === "male" ? NOT_ASSESSED : [...NOT_ASSESSED, ...NOT_ASSESSED_WOMEN_ONLY],
  }
}
