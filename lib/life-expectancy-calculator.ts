/**
 * Life Expectancy Estimator
 *
 * Baseline: expected total lifespan for someone of the user's age, sex and country,
 * age + e(age), from UN World Population Prospects 2024 period life tables
 * (lib/data/life-tables.ts). Survivors to older ages have a longer expected total
 * lifespan, and how much longer depends on the country's mortality pattern
 * (at 65: roughly +3 years over life expectancy at birth in Italy, +22 in Nigeria).
 *
 * Adjustments: life-expectancy differences for modifiable factors from the studies
 * cited per factor below. Most were estimated around age 40, so for older users they
 * are scaled by e(age) / e(40): fewer remaining years means fewer years at stake.
 */

import { LIFE_TABLE_AGES, LIFE_TABLES, type LifeTable } from "@/lib/data/life-tables"

export interface LifeExpectancyInputs {
  // From Body Composition
  age?: number
  sex?: "male" | "female"
  bmiCategory?: "underweight" | "normal" | "overweight" | "obese" | "severely_obese"
  
  // Module scores (0-100)
  bodyScore?: number
  airQualityScore?: number
  waterQualityScore?: number
  dietScore?: number
  exerciseScore?: number
  workScore?: number
  lifestyleScore?: number
  mentalHealthScore?: number
  lifeContextScore?: number
  personalityScore?: number
  homeEnvironmentScore?: number
  
  // Specific risk factors (from various modules)
  smokingStatus?: string
  alcoholFrequency?: string
  sleepHours?: number
  socialConnection?: string
  processedMeatFrequency?: number
  pm25Level?: number
  
  // Country for baseline life expectancy
  country?: string
}

export interface LifeExpectancyResult {
  baselineYears: number
  adjustedYears: number
  totalAdjustment: number
  /** Sum of factor effects at the reference age, before age scaling (drives biological age) */
  referenceAdjustment: number
  adjustments: {
    factor: string
    years: number
    direction: "positive" | "negative" | "neutral"
    source: string
  }[]
  percentile: number // Where they fall among population
  potentialGain: number // Years that could be gained with optimal lifestyle
  confidence: "low" | "medium" | "high"
}

type SexKey = "male" | "female" | "default"

const LIFE_TABLES_BY_KEY = new Map(
  Object.entries(LIFE_TABLES).map(([name, table]) => [name.toLowerCase(), table]),
)
const COUNTRY_ALIASES: Record<string, string> = {
  uk: "united kingdom",
  usa: "united states",
  us: "united states",
}

function findLifeTable(country: string | undefined): LifeTable {
  const key = country?.trim().toLowerCase() ?? ""
  return LIFE_TABLES_BY_KEY.get(COUNTRY_ALIASES[key] ?? key) ?? LIFE_TABLES.World
}

/** Remaining life expectancy e(age), linearly interpolated between life-table ages. */
function remainingLifeExpectancy(age: number, sex: SexKey, country: string | undefined): number {
  const table = findLifeTable(country)
  const series =
    sex === "default" ? table.male.map((male, i) => (male + table.female[i]) / 2) : table[sex]
  const upper = LIFE_TABLE_AGES.findIndex((tableAge) => tableAge > age)
  if (upper === -1) return series[series.length - 1]
  if (upper === 0) return series[0]
  const lower = upper - 1
  const fraction = (age - LIFE_TABLE_AGES[lower]) / (LIFE_TABLE_AGES[upper] - LIFE_TABLE_AGES[lower])
  return series[lower] + (series[upper] - series[lower]) * fraction
}

/** Expected total lifespan for someone who has already reached `age`. */
function getExpectedTotalLifespan(age: number, sex: SexKey, country: string | undefined): number {
  return age + remainingLifeExpectancy(age, sex, country)
}

// Age at which most of the life-year effects below were estimated
const EFFECT_REFERENCE_AGE = 40

export function calculateLifeExpectancy(inputs: LifeExpectancyInputs): LifeExpectancyResult {
  const sex = inputs.sex || "default"
  const age = inputs.age || 40 // Default assumption
  
  const baselineTotal = getExpectedTotalLifespan(age, sex, inputs.country)
  const ageScale = Math.min(
    1,
    remainingLifeExpectancy(age, sex, inputs.country) /
      remainingLifeExpectancy(EFFECT_REFERENCE_AGE, sex, inputs.country),
  )

  const adjustments: LifeExpectancyResult["adjustments"] = []
  let totalAdjustment = 0

  // Tracks the best-case (maximum positive) adjustment achievable from ONLY
  // the modules the user has actually completed. This makes `potentialGain`
  // accurate: it reflects how much better the user could realistically do on
  // what they've assessed, rather than comparing against a fixed ceiling that
  // assumes every module is filled in.
  let maxPossibleAdjustment = 0
  
  // Count how many modules provided data for confidence calculation
  let dataPoints = 0
  
  // === SMOKING (Lifestyle) ===
  // Smokers lose ~10 years on average (Doll et al., BMJ 2004).
  // Former smokers recover most of those years if they quit before 40-50
  // (Jha et al., NEJM 2013). We use a conservative average of -1 year.
  if (inputs.smokingStatus) {
    dataPoints++
    const smokingImpact: Record<string, number> = {
      never: 0,
      former: -1, // Most loss recovered if quit before middle age
      occasional: -5,
      daily: -10,
    }
    const years = smokingImpact[inputs.smokingStatus] ?? 0
    if (years !== 0) {
      adjustments.push({
        factor: "Smoking",
        years,
        direction: years > 0 ? "positive" : "negative",
        source: "Doll et al., BMJ 2004; Jha et al., NEJM 2013",
      })
      totalAdjustment += years
    }
  }
  
  // === EXERCISE (Exercise Module) ===
  // 150 min/week moderate exercise adds 3-4 years (Moore et al., PLOS Medicine 2012)
  if (inputs.exerciseScore !== undefined) {
    dataPoints++
    maxPossibleAdjustment += 4 // best case: highly active
    let years = 0
    if (inputs.exerciseScore >= 80) {
      years = 4 // Highly active
    } else if (inputs.exerciseScore >= 60) {
      years = 2.5 // Moderately active
    } else if (inputs.exerciseScore >= 40) {
      years = 1 // Somewhat active
    } else if (inputs.exerciseScore < 20) {
      years = -3 // Sedentary
    }
    if (years !== 0) {
      adjustments.push({
        factor: "Physical Activity",
        years,
        direction: years > 0 ? "positive" : "negative",
        source: "Moore et al., PLOS Medicine 2012",
      })
      totalAdjustment += years
    }
  }
  
  // === BMI / BODY COMPOSITION ===
  // Obesity reduces life expectancy by 3-10 years (Lancet 2016 meta-analysis)
  if (inputs.bmiCategory || inputs.bodyScore !== undefined) {
    dataPoints++
    maxPossibleAdjustment += 1 // best case: normal BMI
    let years = 0
    if (inputs.bmiCategory === "severely_obese") {
      years = -8
    } else if (inputs.bmiCategory === "obese") {
      years = -3
    } else if (inputs.bmiCategory === "normal") {
      years = 1 // Slight advantage
    } else if (inputs.bmiCategory === "underweight") {
      years = -2
    } else if (inputs.bodyScore !== undefined) {
      // Use score as proxy
      if (inputs.bodyScore >= 80) years = 1
      else if (inputs.bodyScore < 40) years = -3
    }
    if (years !== 0) {
      adjustments.push({
        factor: "Body Composition",
        years,
        direction: years > 0 ? "positive" : "negative",
        source: "Global BMI Mortality Collaboration, Lancet 2016",
      })
      totalAdjustment += years
    }
  }
  
  // === DIET ===
  // Mediterranean/healthy diet adds 2-4 years (Sofi et al., BMJ 2008). Conservative next to
  // Fadnes et al. (PLOS Med 2022): a sustained switch from a typical Western to an optimal diet
  // adds ~10.7 (women) / 13.0 (men) years from age 20 and ~8.0 / 8.8 years from age 60.
  // Processed meat (IARC Group 1) reduces life expectancy
  if (inputs.dietScore !== undefined) {
    dataPoints++
    maxPossibleAdjustment += 3 // best case: excellent diet, no processed-meat penalty
    let years = 0
    if (inputs.dietScore >= 80) {
      years = 3
    } else if (inputs.dietScore >= 60) {
      years = 1.5
    } else if (inputs.dietScore < 30) {
      years = -2
    }
    
    // Additional penalty for high processed meat consumption
    if (inputs.processedMeatFrequency !== undefined && inputs.processedMeatFrequency >= 3) {
      years -= 1.5 // Daily processed meat
    }
    
    if (years !== 0) {
      adjustments.push({
        factor: "Diet Quality",
        years,
        direction: years > 0 ? "positive" : "negative",
        source: "Sofi et al., BMJ 2008; Fadnes et al., PLOS Med 2022; IARC 2015",
      })
      totalAdjustment += years
    }
  }
  
  // === ALCOHOL ===
  // Heavy drinking (>350 g/week) at 40 reduces life expectancy by 4-5 years (Wood et al., Lancet 2018)
  // No level of alcohol is protective: low-volume drinkers show no mortality benefit over
  // lifetime abstainers once study biases are corrected (Zhao et al., JAMA Netw Open 2023;
  // WHO, Lancet Public Health 2023). We treat "never" as neutral (0).
  if (inputs.alcoholFrequency) {
    dataPoints++
    const alcoholImpact: Record<string, number> = {
      never: 0, // No protective effect (Lancet 2018)
      rarely: 0,
      monthly: 0,
      weekly: -0.5,
      "several-weekly": -2,
      daily: -4,
    }
    const years = alcoholImpact[inputs.alcoholFrequency] ?? 0
    if (years !== 0) {
      adjustments.push({
        factor: "Alcohol Consumption",
        years,
        direction: years > 0 ? "positive" : "negative",
        source: "Wood et al., Lancet 2018; Zhao et al., JAMA Netw Open 2023",
      })
      totalAdjustment += years
    }
  }
  
  // === AIR QUALITY ===
  // Each sustained 10 μg/m³ of PM2.5 above the WHO guideline costs 0.98 years of life
  // expectancy (AQLI 2025 Annual Update, EPIC University of Chicago)
  if (inputs.airQualityScore !== undefined || inputs.pm25Level !== undefined) {
    dataPoints++
    let years = 0
    if (inputs.pm25Level !== undefined) {
      // Direct PM2.5 calculation
      const excessPM25 = Math.max(0, inputs.pm25Level - 5) // WHO guideline is 5
      years = -(excessPM25 / 10) * 0.98
      // Best achievable via measured PM2.5 is 0 (clean air = no penalty, no bonus)
    } else if (inputs.airQualityScore !== undefined) {
      // Use score as proxy
      if (inputs.airQualityScore >= 90) years = 0.5 // Clean air bonus
      else if (inputs.airQualityScore < 40) years = -2
      else if (inputs.airQualityScore < 60) years = -1
      maxPossibleAdjustment += 0.5 // best case: clean-air bonus
    }
    if (Math.abs(years) > 0.1) {
      adjustments.push({
        factor: "Air Quality",
        years: Math.round(years * 10) / 10,
        direction: years > 0 ? "positive" : "negative",
        source: "AQLI 2025 Annual Update, University of Chicago",
      })
      totalAdjustment += years
    }
  }
  
  // === SLEEP ===
  // Optimal sleep (7-8h) vs poor sleep affects mortality (Cappuccio et al., Sleep 2010)
  if (inputs.sleepHours !== undefined) {
    dataPoints++
    maxPossibleAdjustment += 1 // best case: optimal 7-8h sleep
    let years = 0
    if (inputs.sleepHours >= 7 && inputs.sleepHours <= 8) {
      years = 1 // Optimal
    } else if (inputs.sleepHours < 6) {
      years = -2 // Short sleep
    } else if (inputs.sleepHours > 9) {
      years = -1 // Long sleep also associated with mortality
    }
    if (years !== 0) {
      adjustments.push({
        factor: "Sleep Duration",
        years,
        direction: years > 0 ? "positive" : "negative",
        source: "Cappuccio et al., Sleep 2010",
      })
      totalAdjustment += years
    }
  } else if (inputs.lifestyleScore !== undefined) {
    // Use lifestyle score as partial proxy for sleep
    dataPoints++
    maxPossibleAdjustment += 0.5 // best case: healthy lifestyle proxy
    let years = 0
    if (inputs.lifestyleScore >= 80) years = 0.5
    else if (inputs.lifestyleScore < 40) years = -1
    if (years !== 0) {
      adjustments.push({
        factor: "Lifestyle Habits",
        years,
        direction: years > 0 ? "positive" : "negative",
        source: "Lifestyle factors meta-analysis",
      })
      totalAdjustment += years
    }
  }
  
  // === SOCIAL CONNECTION ===
  // Strong social ties add 2-5 years (Holt-Lunstad et al., PLOS Medicine 2010)
  if (inputs.socialConnection) {
    dataPoints++
    maxPossibleAdjustment += 3 // best case: strong social ties
    const socialImpact: Record<string, number> = {
      strong: 3,
      moderate: 1,
      weak: -1,
      isolated: -3,
    }
    const years = socialImpact[inputs.socialConnection] ?? 0
    if (years !== 0) {
      adjustments.push({
        factor: "Social Connection",
        years,
        direction: years > 0 ? "positive" : "negative",
        source: "Holt-Lunstad et al., PLOS Medicine 2010",
      })
      totalAdjustment += years
    }
  }
  
  // === MENTAL HEALTH ===
  // Mental disorders carry a median 10 years of potential life lost (Walker et al. 2015). The
  // input is a screening score, not a diagnosis, so the adjustments stay conservative.
  if (inputs.mentalHealthScore !== undefined) {
    dataPoints++
    maxPossibleAdjustment += 1.5 // best case: good mental health
    let years = 0
    if (inputs.mentalHealthScore >= 80) {
      years = 1.5 // Good mental health is protective
    } else if (inputs.mentalHealthScore < 30) {
      years = -4 // Severe mental health issues
    } else if (inputs.mentalHealthScore < 50) {
      years = -2
    }
    if (years !== 0) {
      adjustments.push({
        factor: "Mental Health",
        years,
        direction: years > 0 ? "positive" : "negative",
        source: "Walker et al., JAMA Psychiatry 2015",
      })
      totalAdjustment += years
    }
  }
  
  // === WORK STRESS ===
  // Chronic work stress reduces life expectancy by 1-3 years
  if (inputs.workScore !== undefined) {
    dataPoints++
    maxPossibleAdjustment += 0.5 // best case: low-stress work
    let years = 0
    if (inputs.workScore >= 80) {
      years = 0.5 // Low stress work environment
    } else if (inputs.workScore < 30) {
      years = -2.5 // High burnout/stress
    } else if (inputs.workScore < 50) {
      years = -1
    }
    if (years !== 0) {
      adjustments.push({
        factor: "Work Environment",
        years,
        direction: years > 0 ? "positive" : "negative",
        source: "Kivimäki et al., Lancet 2015",
      })
      totalAdjustment += years
    }
  }

  // === WATER QUALITY ===
  // Poor water quality and microplastic exposure affect health outcomes
  // Contaminated water linked to various diseases (WHO 2022)
  if (inputs.waterQualityScore !== undefined) {
    dataPoints++
    maxPossibleAdjustment += 0.5 // best case: clean, well-filtered water
    let years = 0
    if (inputs.waterQualityScore >= 80) {
      years = 0.5 // Clean water, good filtration
    } else if (inputs.waterQualityScore < 30) {
      years = -2 // Poor water quality, high contaminant exposure
    } else if (inputs.waterQualityScore < 50) {
      years = -1 // Moderate water quality issues
    }
    if (years !== 0) {
      adjustments.push({
        factor: "Water Quality",
        years,
        direction: years > 0 ? "positive" : "negative",
        source: "WHO Drinking Water Guidelines 2022",
      })
      totalAdjustment += years
    }
  }
  
  // === LIFE CONTEXT (relationships, education, income, religion, pets, volunteering) ===
  // High impact - marriage, education, income individually contribute multi-year effects
  // Robles 2014, Balaj 2024 Lancet Public Health (education), Chetty 2016 JAMA (income),
  // Li 2016 JAMA Intern Med (religion)
  if (inputs.lifeContextScore !== undefined) {
    dataPoints++
    maxPossibleAdjustment += 4 // best case: strong relationships, education, income
    let years = 0
    if (inputs.lifeContextScore >= 85) {
      years = 4 // Marriage + education + income + religion + pets stack up
    } else if (inputs.lifeContextScore >= 70) {
      years = 2.5
    } else if (inputs.lifeContextScore >= 55) {
      years = 1
    } else if (inputs.lifeContextScore < 30) {
      years = -3.5 // Divorce/widowed + low education + low income + ACEs
    } else if (inputs.lifeContextScore < 50) {
      years = -1.5
    }
    if (years !== 0) {
      adjustments.push({
        factor: "Life Context & Relationships",
        years,
        direction: years > 0 ? "positive" : "negative",
        source: "Robles 2014; Chetty 2016 JAMA; Balaj 2024 Lancet Public Health; Brown 2009 (ACEs)",
      })
      totalAdjustment += years
    }
  }

  // === PERSONALITY & OUTLOOK ===
  // Lee 2019 PNAS: top-quartile optimists live 11-15% longer
  // Friedman & Kern 2014: high conscientiousness = +4 years
  if (inputs.personalityScore !== undefined) {
    dataPoints++
    maxPossibleAdjustment += 3 // best case: optimism + conscientiousness
    let years = 0
    if (inputs.personalityScore >= 85) {
      years = 3
    } else if (inputs.personalityScore >= 70) {
      years = 1.5
    } else if (inputs.personalityScore < 30) {
      years = -2
    } else if (inputs.personalityScore < 50) {
      years = -0.5
    }
    if (years !== 0) {
      adjustments.push({
        factor: "Personality & Outlook",
        years,
        direction: years > 0 ? "positive" : "negative",
        source: "Lee et al. 2019 PNAS, Friedman & Kern 2014",
      })
      totalAdjustment += years
    }
  }

  // === HOME ENVIRONMENT & HOUSEHOLD EXPOSURES ===
  // Cumulative low-level exposures (PFAS/microplastics from cookware, BPA/phthalates,
  // cleaning-spray VOCs, indoor NO2, damp/mould, radon, secondhand smoke).
  // Individually modest but additive; radon & indoor air carry the largest signal.
  // Svanes 2018 (cleaning sprays), Gruenwald 2023 (gas-stove asthma), WHO 2009 (damp/mould),
  // US EPA (radon = 2nd leading lung-cancer cause), Luo 2022 / Hussain 2023 (micro/nanoplastics).
  if (inputs.homeEnvironmentScore !== undefined) {
    dataPoints++
    maxPossibleAdjustment += 1 // best case: clean cookware, low-VOC, well-ventilated
    let years = 0
    if (inputs.homeEnvironmentScore >= 85) {
      years = 1
    } else if (inputs.homeEnvironmentScore >= 70) {
      years = 0.5
    } else if (inputs.homeEnvironmentScore < 30) {
      years = -2
    } else if (inputs.homeEnvironmentScore < 50) {
      years = -1
    }
    if (years !== 0) {
      adjustments.push({
        factor: "Home Environment",
        years,
        direction: years > 0 ? "positive" : "negative",
        source: "Svanes 2018; Gruenwald 2023; WHO 2009 (damp); US EPA (radon)",
      })
      totalAdjustment += years
    }
  }

  // Calculate final values (factor effects are at the reference age; scale to the user's age)
  const scaledAdjustment = totalAdjustment * ageScale
  const adjustedTotal = Math.max(age + 1, baselineTotal + scaledAdjustment)

  // Calculate percentile (rough approximation)
  // Assume normal distribution with SD of 10 years at the reference age; the spread of
  // remaining lifespans narrows with age in the same proportion as the scaled effects.
  const percentile = Math.min(99, Math.max(1, 50 + (totalAdjustment / 10) * 34))

  // Calculate potential gain: how many more years the user could realistically
  // add by improving to the best-case outcome on the modules they've completed.
  // Comparing against `maxPossibleAdjustment` (not a fixed constant) keeps this
  // accurate regardless of how many modules have been filled in.
  const potentialGain = Math.max(0, (maxPossibleAdjustment - totalAdjustment) * ageScale)
  
  // Confidence based on data points
  let confidence: "low" | "medium" | "high" = "low"
  if (dataPoints >= 6) confidence = "high"
  else if (dataPoints >= 3) confidence = "medium"
  
  const scaledFactors = adjustments
    .map((adjustment) => ({ ...adjustment, years: Math.round(adjustment.years * ageScale * 10) / 10 }))
    .filter((adjustment) => adjustment.years !== 0)
    .sort((a, b) => Math.abs(b.years) - Math.abs(a.years))

  return {
    baselineYears: Math.round(baselineTotal * 10) / 10,
    adjustedYears: Math.round(adjustedTotal * 10) / 10,
    totalAdjustment: Math.round(scaledAdjustment * 10) / 10,
    referenceAdjustment: Math.round(totalAdjustment * 10) / 10,
    adjustments: scaledFactors,
    percentile: Math.round(percentile),
    potentialGain: Math.round(potentialGain * 10) / 10,
    confidence,
  }
}
