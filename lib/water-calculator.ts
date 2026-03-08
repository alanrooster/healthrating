/**
 * Water Quality Calculator
 *
 * Combines country-level baseline data with personal consumption factors.
 *
 * Scientific sources:
 * - WHO/UNICEF Joint Monitoring Programme (JMP) 2023: Country-level safely
 *   managed drinking water percentages
 * - Environmental Performance Index (EPI) 2024: Water quality indicators
 * - WHO (2022): Microplastics in drinking water review
 * - Mason et al. (2018): 93% of bottled water contains microplastics
 * - PNAS (2024): ~240,000 nanoplastic particles per liter in bottled water
 * - Rochester & Bolden (2015): BPA and phthalate health effects
 * - EU Drinking Water Directive 2020/2184: Quality standards
 */

export type WaterSource =
  | "municipal-tap"
  | "private-well"
  | "spring"
  | "rainwater"
  | "bottled-only"
  | "mixed"

export type FiltrationType =
  | "none"
  | "pitcher"
  | "faucet"
  | "under-sink"
  | "reverse-osmosis"
  | "whole-house"
  | "distillation"

export type BottleType = "plastic" | "glass" | "aluminum" | "reusable-plastic" | "reusable-metal" | "none"

export type StorageCondition = "cool-indoor" | "room-temp" | "sometimes-heat" | "often-heat"

export type BuildingAge = "new" | "10-30" | "30-50" | "50-plus" | "unknown"

export type WaterIssue = "none" | "taste" | "odor" | "color" | "hardness" | "multiple"

export interface WaterAnswers {
  // Location (reuse from air quality if available)
  country: string

  // Primary source
  primarySource: WaterSource

  // Home filtration
  filtration: FiltrationType
  filterMaintained: boolean // regularly replaced/maintained

  // Bottled water consumption
  bottledFrequency: "never" | "rarely" | "weekly" | "daily" | "primary"
  bottleType: BottleType
  plasticBottlesPerWeek: number
  bottleStorage: StorageCondition

  // Infrastructure
  buildingAge: BuildingAge
  knownPipeIssues: boolean
  recentRenovation: boolean // can disturb lead pipes

  // Observed quality
  observedIssues: WaterIssue

  // Hydration habits
  dailyWaterIntake: "less-than-1L" | "1-2L" | "2-3L" | "more-than-3L"
}

export interface WaterResult {
  score: number
  category: string
  riskLevel: "low" | "moderate" | "high" | "very-high"
  countryBaseline: number
  personalFactors: number
  microplasticRisk: "low" | "moderate" | "high"
  recommendations: string[]
  breakdown: {
    countryScore: number
    sourceScore: number
    filtrationScore: number
    plasticScore: number
    infrastructureScore: number
    hydrationScore: number
  }
}

/**
 * WHO/UNICEF JMP + EPI country water quality data
 * Score represents % population with safely managed drinking water
 * combined with EPI water quality indicators, normalized to 0-100
 */
const COUNTRY_WATER_SCORES: Record<string, number> = {
  // Europe - High income, excellent infrastructure
  "Austria": 98,
  "Belgium": 96,
  "Czech Republic": 95,
  "Denmark": 98,
  "Finland": 99,
  "France": 96,
  "Germany": 99,
  "Greece": 93,
  "Hungary": 92,
  "Iceland": 99,
  "Ireland": 96,
  "Italy": 94,
  "Luxembourg": 98,
  "Netherlands": 99,
  "Norway": 99,
  "Poland": 92,
  "Portugal": 95,
  "Romania": 85,
  "Slovakia": 93,
  "Slovenia": 96,
  "Spain": 96,
  "Sweden": 99,
  "Switzerland": 99,
  "United Kingdom": 97,
  "Bulgaria": 88,
  "Croatia": 91,
  "Estonia": 94,
  "Latvia": 91,
  "Lithuania": 92,
  "Malta": 94,
  "Cyprus": 93,

  // North America
  "United States": 94,
  "Canada": 98,
  "Mexico": 72,

  // Central America & Caribbean
  "Costa Rica": 82,
  "Panama": 78,
  "Guatemala": 62,
  "Honduras": 58,
  "El Salvador": 65,
  "Nicaragua": 55,
  "Cuba": 75,
  "Dominican Republic": 68,
  "Jamaica": 72,
  "Haiti": 42,
  "Trinidad and Tobago": 78,
  "Bahamas": 80,
  "Barbados": 82,

  // South America
  "Argentina": 85,
  "Brazil": 78,
  "Chile": 92,
  "Colombia": 75,
  "Ecuador": 70,
  "Peru": 72,
  "Venezuela": 68,
  "Uruguay": 88,
  "Paraguay": 70,
  "Bolivia": 62,

  // East Asia
  "Japan": 98,
  "South Korea": 96,
  "Taiwan": 94,
  "China": 75,
  "Mongolia": 62,
  "Hong Kong": 96,
  "Macau": 94,

  // Southeast Asia
  "Singapore": 99,
  "Malaysia": 85,
  "Thailand": 78,
  "Vietnam": 68,
  "Philippines": 65,
  "Indonesia": 62,
  "Myanmar": 52,
  "Cambodia": 55,
  "Laos": 52,
  "Brunei": 90,

  // South Asia
  "India": 58,
  "Pakistan": 52,
  "Bangladesh": 55,
  "Sri Lanka": 72,
  "Nepal": 48,
  "Bhutan": 65,
  "Maldives": 75,

  // Central Asia
  "Kazakhstan": 72,
  "Uzbekistan": 65,
  "Turkmenistan": 62,
  "Kyrgyzstan": 58,
  "Tajikistan": 55,

  // Middle East
  "Israel": 95,
  "United Arab Emirates": 92,
  "Saudi Arabia": 88,
  "Qatar": 90,
  "Kuwait": 88,
  "Bahrain": 86,
  "Oman": 84,
  "Jordan": 75,
  "Lebanon": 68,
  "Turkey": 82,
  "Iran": 72,
  "Iraq": 58,
  "Syria": 52,
  "Yemen": 45,

  // Africa - North
  "Morocco": 72,
  "Algeria": 75,
  "Tunisia": 78,
  "Libya": 68,
  "Egypt": 72,

  // Africa - Sub-Saharan
  "South Africa": 72,
  "Nigeria": 48,
  "Kenya": 52,
  "Ghana": 55,
  "Ethiopia": 42,
  "Tanzania": 45,
  "Uganda": 42,
  "Rwanda": 55,
  "Senegal": 58,
  "Ivory Coast": 52,
  "Cameroon": 48,
  "Democratic Republic of Congo": 38,
  "Angola": 42,
  "Mozambique": 40,
  "Zimbabwe": 52,
  "Zambia": 48,
  "Botswana": 65,
  "Namibia": 62,
  "Mauritius": 85,

  // Oceania
  "Australia": 98,
  "New Zealand": 98,
  "Fiji": 72,
  "Papua New Guinea": 45,

  // Eastern Europe & Russia
  "Russia": 78,
  "Ukraine": 72,
  "Belarus": 82,
  "Moldova": 68,
  "Georgia": 72,
  "Armenia": 75,
  "Azerbaijan": 70,
}

// Default for unknown countries
const DEFAULT_COUNTRY_SCORE = 70

/**
 * Calculate water quality score
 */
export function calculateWaterQuality(answers: WaterAnswers): WaterResult {
  const breakdown = {
    countryScore: 0,
    sourceScore: 0,
    filtrationScore: 0,
    plasticScore: 0,
    infrastructureScore: 0,
    hydrationScore: 0,
  }

  // 1. Country baseline (25% weight)
  const countryBaseline = COUNTRY_WATER_SCORES[answers.country] ?? DEFAULT_COUNTRY_SCORE
  breakdown.countryScore = countryBaseline

  // 2. Primary source score (20% weight)
  breakdown.sourceScore = calcSourceScore(answers.primarySource, countryBaseline)

  // 3. Filtration score (20% weight)
  breakdown.filtrationScore = calcFiltrationScore(
    answers.filtration,
    answers.filterMaintained,
    answers.primarySource
  )

  // 4. Plastic/microplastic exposure (20% weight)
  breakdown.plasticScore = calcPlasticScore(
    answers.bottledFrequency,
    answers.bottleType,
    answers.plasticBottlesPerWeek,
    answers.bottleStorage
  )

  // 5. Infrastructure score (10% weight)
  breakdown.infrastructureScore = calcInfrastructureScore(
    answers.buildingAge,
    answers.knownPipeIssues,
    answers.recentRenovation,
    answers.observedIssues
  )

  // 6. Hydration habits (5% weight)
  breakdown.hydrationScore = calcHydrationScore(answers.dailyWaterIntake)

  // Weighted final score
  const score = Math.round(
    breakdown.countryScore * 0.25 +
    breakdown.sourceScore * 0.20 +
    breakdown.filtrationScore * 0.20 +
    breakdown.plasticScore * 0.20 +
    breakdown.infrastructureScore * 0.10 +
    breakdown.hydrationScore * 0.05
  )

  const category = getCategory(score)
  const riskLevel = getRiskLevel(score)
  const microplasticRisk = getMicroplasticRisk(
    answers.bottledFrequency,
    answers.bottleType,
    answers.plasticBottlesPerWeek,
    answers.bottleStorage
  )

  const personalFactors = Math.round(
    (breakdown.sourceScore + breakdown.filtrationScore + breakdown.plasticScore +
     breakdown.infrastructureScore + breakdown.hydrationScore) / 5
  )

  const recommendations = generateRecommendations(answers, breakdown, microplasticRisk)

  return {
    score,
    category,
    riskLevel,
    countryBaseline,
    personalFactors,
    microplasticRisk,
    recommendations,
    breakdown,
  }
}

function calcSourceScore(source: WaterSource, countryBaseline: number): number {
  const baseScores: Record<WaterSource, number> = {
    "municipal-tap": 85,
    "private-well": 65, // varies greatly, needs testing
    "spring": 70,
    "rainwater": 60,
    "bottled-only": 80, // microplastics addressed separately
    "mixed": 75,
  }

  let score = baseScores[source]

  // Adjust based on country baseline for municipal tap
  if (source === "municipal-tap") {
    score = Math.round((score + countryBaseline) / 2)
  }

  // Private wells in low-baseline countries are higher risk
  if (source === "private-well" && countryBaseline < 70) {
    score -= 15
  }

  return Math.max(0, Math.min(100, score))
}

function calcFiltrationScore(
  filtration: FiltrationType,
  maintained: boolean,
  source: WaterSource
): number {
  const filterScores: Record<FiltrationType, number> = {
    "none": 50,
    "pitcher": 65,
    "faucet": 72,
    "under-sink": 82,
    "reverse-osmosis": 95,
    "whole-house": 88,
    "distillation": 92,
  }

  let score = filterScores[filtration]

  // Poor maintenance reduces effectiveness significantly
  if (filtration !== "none" && !maintained) {
    score -= 20 // unmaintained filters can grow bacteria
  }

  // Filtration is more important for risky sources
  if (source === "private-well" || source === "rainwater") {
    if (filtration === "none") {
      score -= 15
    } else if (filtration === "reverse-osmosis" || filtration === "distillation") {
      score += 5
    }
  }

  // If primary source is bottled, filtration matters less
  if (source === "bottled-only") {
    score = 80 // neutral
  }

  return Math.max(0, Math.min(100, score))
}

function calcPlasticScore(
  frequency: WaterAnswers["bottledFrequency"],
  bottleType: BottleType,
  bottlesPerWeek: number,
  storage: StorageCondition
): number {
  // Start at 100 (no plastic exposure)
  let score = 100

  // No bottled water = best score
  if (frequency === "never" || bottleType === "none") {
    return 100
  }

  // Glass and metal are safe
  if (bottleType === "glass" || bottleType === "reusable-metal" || bottleType === "aluminum") {
    return 95
  }

  // Frequency penalties for plastic
  const frequencyPenalties: Record<WaterAnswers["bottledFrequency"], number> = {
    "never": 0,
    "rarely": 5,
    "weekly": 15,
    "daily": 30,
    "primary": 45,
  }
  score -= frequencyPenalties[frequency]

  // Quantity penalty (per bottle per week)
  // Research shows significant microplastic exposure above 5-7 bottles/week
  if (bottleType === "plastic") {
    if (bottlesPerWeek <= 2) score -= 5
    else if (bottlesPerWeek <= 5) score -= 12
    else if (bottlesPerWeek <= 10) score -= 22
    else if (bottlesPerWeek <= 20) score -= 35
    else score -= 45
  } else if (bottleType === "reusable-plastic") {
    // Reusable plastic is better but still has some exposure
    score -= Math.min(15, bottlesPerWeek * 0.5)
  }

  // Heat exposure dramatically increases BPA/phthalate leaching
  // Rochester & Bolden (2015): heat increases leaching 55x
  const storagePenalties: Record<StorageCondition, number> = {
    "cool-indoor": 0,
    "room-temp": 5,
    "sometimes-heat": 15,
    "often-heat": 30,
  }
  if (bottleType === "plastic" || bottleType === "reusable-plastic") {
    score -= storagePenalties[storage]
  }

  return Math.max(0, Math.min(100, score))
}

function calcInfrastructureScore(
  buildingAge: BuildingAge,
  pipeIssues: boolean,
  recentRenovation: boolean,
  observedIssues: WaterIssue
): number {
  let score = 85

  // Building age (lead pipes concern pre-1986 in US, varies by country)
  const agePenalties: Record<BuildingAge, number> = {
    "new": 0,
    "10-30": 5,
    "30-50": 12,
    "50-plus": 22,
    "unknown": 10,
  }
  score -= agePenalties[buildingAge]

  // Known pipe issues
  if (pipeIssues) {
    score -= 20
  }

  // Recent renovation can disturb lead pipes
  if (recentRenovation && (buildingAge === "30-50" || buildingAge === "50-plus")) {
    score -= 10
  }

  // Observed quality issues
  const issuePenalties: Record<WaterIssue, number> = {
    "none": 0,
    "taste": 5,
    "odor": 10,
    "color": 15,
    "hardness": 3,
    "multiple": 20,
  }
  score -= issuePenalties[observedIssues]

  return Math.max(0, Math.min(100, score))
}

function calcHydrationScore(intake: WaterAnswers["dailyWaterIntake"]): number {
  // WHO recommends 2-3L for adults
  const scores: Record<WaterAnswers["dailyWaterIntake"], number> = {
    "less-than-1L": 40,
    "1-2L": 70,
    "2-3L": 100,
    "more-than-3L": 95, // slightly less as over-hydration has minor risks
  }
  return scores[intake]
}

function getCategory(score: number): string {
  if (score >= 90) return "Excellent"
  if (score >= 75) return "Good"
  if (score >= 60) return "Moderate"
  if (score >= 40) return "Poor"
  return "Very Poor"
}

function getRiskLevel(score: number): "low" | "moderate" | "high" | "very-high" {
  if (score >= 80) return "low"
  if (score >= 60) return "moderate"
  if (score >= 40) return "high"
  return "very-high"
}

function getMicroplasticRisk(
  frequency: WaterAnswers["bottledFrequency"],
  bottleType: BottleType,
  bottlesPerWeek: number,
  storage: StorageCondition
): "low" | "moderate" | "high" {
  if (frequency === "never" || bottleType === "none") return "low"
  if (bottleType === "glass" || bottleType === "reusable-metal" || bottleType === "aluminum") return "low"

  let riskScore = 0

  // Frequency
  if (frequency === "daily" || frequency === "primary") riskScore += 2
  else if (frequency === "weekly") riskScore += 1

  // Quantity
  if (bottlesPerWeek > 10) riskScore += 2
  else if (bottlesPerWeek > 5) riskScore += 1

  // Heat exposure
  if (storage === "often-heat") riskScore += 2
  else if (storage === "sometimes-heat") riskScore += 1

  if (riskScore >= 4) return "high"
  if (riskScore >= 2) return "moderate"
  return "low"
}

function generateRecommendations(
  answers: WaterAnswers,
  breakdown: WaterResult["breakdown"],
  microplasticRisk: "low" | "moderate" | "high"
): string[] {
  const recs: string[] = []

  // Filtration recommendations
  if (breakdown.filtrationScore < 70) {
    if (answers.filtration === "none") {
      recs.push("Consider installing a water filter. Reverse osmosis or under-sink carbon filters remove most contaminants including microplastics.")
    } else if (!answers.filterMaintained) {
      recs.push("Maintain your water filter regularly. Unmaintained filters can harbor bacteria and become less effective.")
    }
  }

  // Plastic/microplastic recommendations
  if (microplasticRisk === "high") {
    recs.push("Your plastic bottle consumption is high. Consider switching to glass or stainless steel bottles to reduce microplastic exposure.")
    if (answers.bottleStorage === "often-heat" || answers.bottleStorage === "sometimes-heat") {
      recs.push("Avoid leaving plastic bottles in heat (car, sunlight). Heat dramatically increases chemical leaching from plastic.")
    }
  } else if (microplasticRisk === "moderate") {
    recs.push("Consider reducing plastic bottle use. Glass or metal alternatives eliminate microplastic exposure from containers.")
  }

  // Source recommendations
  if (answers.primarySource === "private-well" && breakdown.sourceScore < 65) {
    recs.push("Have your well water tested annually for contaminants, bacteria, and heavy metals.")
  }

  // Infrastructure recommendations
  if (breakdown.infrastructureScore < 70) {
    if (answers.buildingAge === "50-plus" || answers.buildingAge === "30-50") {
      recs.push("Older buildings may have lead pipes. Consider having your water tested for lead, especially if you have young children.")
    }
    if (answers.observedIssues !== "none") {
      recs.push("The water quality issues you've observed warrant investigation. Contact your water utility or have water tested.")
    }
  }

  // Hydration recommendations
  if (breakdown.hydrationScore < 70) {
    recs.push("Aim for 2-3 liters of water daily. Proper hydration supports kidney function and overall health.")
  }

  // Country-specific
  if (breakdown.countryScore < 70) {
    recs.push("Water infrastructure in your region may be less reliable. Using filtered or bottled water from trusted sources is advisable.")
  }

  if (recs.length === 0) {
    recs.push("Your water quality profile looks good. Continue your current practices and stay hydrated.")
  }

  return recs.slice(0, 5) // Max 5 recommendations
}

/**
 * Get list of countries for the selector
 */
export function getWaterCountries(): string[] {
  return Object.keys(COUNTRY_WATER_SCORES).sort()
}
