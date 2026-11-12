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
 *
 * Combining factors:
 * - Gains level off. Each effect comes from a separate study that adjusted for only some of the
 *   other factors, and several of them share the same causes of death, so a plain sum of every
 *   gain over-counts (11 modules at their best would add 22.5 years). They are combined as
 *   MAX_COMBINED_GAIN x (1 - exp(-sum / MAX_COMBINED_GAIN)) with a ceiling of 10 years above the
 *   country average, more than the healthiest groups on record: California Adventists outlive
 *   other Californians by 7.3 years (men) and 4.4 (women), with about 10 years between their own
 *   low- and high-risk members (Fraser & Shavlik, Arch Intern Med 2001), and US adults with all 5
 *   low-risk lifestyle factors live 12-14 years longer from age 50 than those with none (Li et
 *   al., Circulation 2018).
 * - Losses add up. The excess risks of high BMI and smoking were roughly additive in 900,000
 *   adults (Prospective Studies Collaboration, Lancet 2009), and obese smokers lost 13.3-13.7
 *   years against normal-weight non-smokers (Peeters et al., Ann Intern Med 2003), where this
 *   model gives 14 (10 for smoking, 3 for obesity and the 1 a normal weight earns).
 */

import { COUNTRY_PM25 } from "@/lib/data/country-pm25"
import { LIFE_TABLE_AGES, LIFE_TABLES, type LifeTable } from "@/lib/data/life-tables"

export interface LifeExpectancyInputs {
  // From Body Composition
  age?: number
  sex?: "male" | "female"
  bmiCategory?: "underweight" | "normal" | "overweight" | "obese" | "severely_obese"
  /** Composite BMI from the Body module; tells obesity class II from class III */
  compositeBmi?: number

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
  otherDrugUse?: string
  injectedDrugs?: string
  /** Grams of pure alcohol a week (weeklyAlcoholGrams in the lifestyle calculator) */
  alcoholGramsPerWeek?: number
  sleepHours?: number
  socialConnection?: string
  processedMeatFrequency?: number
  pm25Level?: number

  // Country for baseline life expectancy and the national PM2.5 the city is compared with
  country?: string
}

export interface LifeExpectancyResult {
  baselineYears: number
  adjustedYears: number
  totalAdjustment: number
  /** Combined factor effects at the reference age, before age scaling (drives biological age) */
  referenceAdjustment: number
  adjustments: {
    factor: string
    years: number
    direction: "positive" | "negative" | "neutral"
    source: string
  }[]
  percentile: number // Share of peers the estimate outlives
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
// Years above the country average that the combined gains approach but never reach
const MAX_COMBINED_GAIN = 10
// Each sustained 10 µg/m³ of PM2.5 costs 0.98 years of life expectancy (AQLI 2025 Annual Update,
// EPIC University of Chicago)
const YEARS_PER_10_UG_PM25 = 0.98
const WHO_PM25_GUIDELINE = 5

// Spread of lifespans among peers at the reference age, for the percentile
const LIFESPAN_SD_YEARS = 10

function combineGains(sum: number): number {
  return MAX_COMBINED_GAIN * (1 - Math.exp(-sum / MAX_COMBINED_GAIN))
}

// Standard normal cumulative distribution (Abramowitz & Stegun 26.2.17, error below 1e-7)
function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const density = 0.3989422804 * Math.exp((-z * z) / 2)
  const upperTail =
    density * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))))
  return z > 0 ? 1 - upperTail : upperTail
}

// Smokers lose about 10 years (Doll et al., BMJ 2004; Jha et al., NEJM 2013). Lifelong non-daily
// smokers lose about 5 (Inoue-Choi et al., Am J Prev Med 2019). Quitting before 40 recovers about
// 9 of the 10 years (Jha 2013); the age at quitting isn't asked, so former smokers count 1 year.
const SMOKING_YEARS_LOST: Record<string, number> = {
  never: 0,
  former: 1,
  occasional: 5,
  daily: 10,
}

// Stopping smoking at 30, 40, 50 or 60 wins back about 10, 9, 6 or 3 of the 10 years (Doll et
// al., BMJ 2004): the share of the loss a current smoker can still recover, by age
const QUIT_RECOVERY_BY_AGE: [age: number, share: number][] = [
  [30, 1],
  [40, 0.9],
  [50, 0.6],
  [60, 0.3],
]

function recoverableSmokingShare(age: number): number {
  const [firstAge, firstShare] = QUIT_RECOVERY_BY_AGE[0]
  if (age <= firstAge) return firstShare
  for (let i = 1; i < QUIT_RECOVERY_BY_AGE.length; i++) {
    const [upperAge, upperShare] = QUIT_RECOVERY_BY_AGE[i]
    if (age <= upperAge) {
      const [lowerAge, lowerShare] = QUIT_RECOVERY_BY_AGE[i - 1]
      return lowerShare + ((upperShare - lowerShare) * (age - lowerAge)) / (upperAge - lowerAge)
    }
  }
  return QUIT_RECOVERY_BY_AGE[QUIT_RECOVERY_BY_AGE.length - 1][1]
}

export interface SubstanceUse {
  sex?: "male" | "female"
  smokingStatus?: string
  alcoholGramsPerWeek?: number
  otherDrugUse?: string
  injectedDrugs?: string
}

/**
 * Years of life expectancy lost to tobacco, alcohol and drugs at the reference age, as positive
 * numbers. Shared with the overall health score, which subtracts one point per year.
 * - Alcohol: against up to 100 g a week, drinking 100-200 g costs about 6 months at age 40,
 *   200-350 g 1-2 years and over 350 g 4-5 years (Wood et al., Lancet 2018, 599,912 drinkers).
 *   No level is protective once study biases are corrected (Zhao et al., JAMA Netw Open 2023).
 * - Drugs: opioid dependence cuts life expectancy at 18 by 14.7 years for men and 15.8 for women
 *   (SMR 6.06; Lewer et al., J Psychiatr Res 2020). Regular cocaine and amphetamine use carry
 *   similar SMRs (6.1, 6.8), so weekly use of any drug other than cannabis counts the same. People
 *   who inject drugs have an SMR of 14.7 (Mathers et al., Bull WHO 2013), so injecting in the past
 *   year gets at least the same. Less frequent or past use has no measured effect on life
 *   expectancy and lowers the habits score only.
 */
export function substanceYearsLost(use: SubstanceUse): { smoking: number; alcohol: number; drugs: number } {
  const grams = use.alcoholGramsPerWeek
  const alcohol =
    grams === undefined || !Number.isFinite(grams) ? 0 : grams > 350 ? 4.5 : grams > 200 ? 1.5 : grams > 100 ? 0.5 : 0
  const drugs =
    use.otherDrugUse === "weekly" || use.injectedDrugs === "recent"
      ? use.sex === "female"
        ? 15.8
        : use.sex === "male"
          ? 14.7
          : 15
      : 0
  return { smoking: SMOKING_YEARS_LOST[use.smokingStatus ?? ""] ?? 0, alcohol, drugs }
}

export function calculateLifeExpectancy(inputs: LifeExpectancyInputs): LifeExpectancyResult {
  const sex = inputs.sex || "default"
  const age = inputs.age || 40 // Default assumption

  const baselineTotal = getExpectedTotalLifespan(age, sex, inputs.country)
  const ageScale = Math.min(
    1,
    remainingLifeExpectancy(age, sex, inputs.country) /
      remainingLifeExpectancy(EFFECT_REFERENCE_AGE, sex, inputs.country),
  )

  // Factor effects at the reference age, before they are combined
  const factors: { factor: string; years: number; source: string }[] = []
  function add(factor: string, years: number, source: string) {
    if (years !== 0) factors.push({ factor, years, source })
  }

  // Best-case sum of gains from ONLY the modules the user has completed, so `potentialGain`
  // reflects what they could realistically reach on what they've assessed
  let maxPossibleGain = 0

  // Count how many modules provided data for confidence calculation
  let dataPoints = 0

  const substances = substanceYearsLost(inputs)

  // === SMOKING (Lifestyle) ===
  if (inputs.smokingStatus) {
    dataPoints++
    add("Smoking", -substances.smoking, "Doll et al., BMJ 2004; Jha et al., NEJM 2013; Inoue-Choi et al., Am J Prev Med 2019")
  }

  // === EXERCISE (Exercise Module) ===
  // 150 min/week moderate exercise adds 3-4 years (Moore et al., PLOS Medicine 2012)
  if (inputs.exerciseScore !== undefined) {
    dataPoints++
    maxPossibleGain += 4 // best case: highly active
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
    add("Physical Activity", years, "Moore et al., PLOS Medicine 2012")
  }

  // === BMI / BODY COMPOSITION ===
  // Median survival is 2-4 years shorter at BMI 30-35 and 8-10 years shorter at 40-45
  // (Prospective Studies Collaboration, Lancet 2009); class II (35-40) sits between the two.
  // Overweight counts 0: it is the average weight in most countries, so the baseline includes it.
  if (inputs.bmiCategory || inputs.bodyScore !== undefined) {
    dataPoints++
    maxPossibleGain += 1 // best case: normal BMI
    let years = 0
    if (inputs.bmiCategory === "severely_obese") {
      // Results saved before the composite BMI was passed on don't tell class II from class III
      years = inputs.compositeBmi === undefined ? -8 : inputs.compositeBmi >= 40 ? -9 : -6
    } else if (inputs.bmiCategory === "obese") {
      years = -3
    } else if (inputs.bmiCategory === "normal") {
      years = 1 // Slight advantage
    } else if (inputs.bmiCategory === "underweight") {
      years = -2
    } else if (!inputs.bmiCategory && inputs.bodyScore !== undefined) {
      // Use score as proxy
      if (inputs.bodyScore >= 80) years = 1
      else if (inputs.bodyScore < 40) years = -3
    }
    add("Body Composition", years, "Prospective Studies Collaboration, Lancet 2009")
  }

  // === DIET ===
  // Mediterranean/healthy diet adds 2-4 years (Sofi et al., BMJ 2008). Conservative next to
  // Fadnes et al. (PLOS Med 2022): a sustained switch from a typical Western to an optimal diet
  // adds ~10.7 (women) / 13.0 (men) years from age 20 and ~8.0 / 8.8 years from age 60.
  // Processed meat (IARC Group 1) reduces life expectancy
  if (inputs.dietScore !== undefined) {
    dataPoints++
    maxPossibleGain += 3 // best case: excellent diet, no processed-meat penalty
    let years = 0
    if (inputs.dietScore >= 80) {
      years = 3
    } else if (inputs.dietScore >= 60) {
      years = 1.5
    } else if (inputs.dietScore < 30) {
      years = -2
    }

    // Additional penalty for processed meat 5 or more times a week
    if (inputs.processedMeatFrequency !== undefined && inputs.processedMeatFrequency >= 3) {
      years -= 1.5
    }

    add("Diet Quality", years, "Sofi et al., BMJ 2008; Fadnes et al., PLOS Med 2022; IARC 2015")
  }

  // === ALCOHOL ===
  if (inputs.alcoholGramsPerWeek !== undefined) {
    dataPoints++
    add("Alcohol Consumption", -substances.alcohol, "Wood et al., Lancet 2018; Zhao et al., JAMA Netw Open 2023")
  }

  // === DRUG USE ===
  if (inputs.otherDrugUse || inputs.injectedDrugs) {
    dataPoints++
    add("Drug Use", -substances.drugs, "Lewer et al., J Psychiatr Res 2020; Mathers et al., Bull WHO 2013")
  }

  // === AIR QUALITY ===
  // The national life table already includes the country's average exposure, so the city counts
  // against the national mean (WHO, SDG indicator 11.6.2), not against the WHO guideline: cleaner
  // air than the national average gains years, dirtier air loses them.
  if (inputs.airQualityScore !== undefined || inputs.pm25Level !== undefined) {
    dataPoints++
    let years = 0
    if (inputs.pm25Level !== undefined) {
      const nationalMean = inputs.country ? COUNTRY_PM25[inputs.country] : undefined
      // An unknown national mean leaves nothing to compare the city with
      const reference = nationalMean ?? inputs.pm25Level
      years = -((inputs.pm25Level - reference) / 10) * YEARS_PER_10_UG_PM25
      // Best case: air at the WHO guideline
      maxPossibleGain += Math.max(0, ((reference - WHO_PM25_GUIDELINE) / 10) * YEARS_PER_10_UG_PM25)
    } else if (inputs.airQualityScore !== undefined) {
      // Use score as proxy
      if (inputs.airQualityScore >= 90) years = 0.5 // Clean air bonus
      else if (inputs.airQualityScore < 40) years = -2
      else if (inputs.airQualityScore < 60) years = -1
      maxPossibleGain += 0.5 // best case: clean-air bonus
    }
    if (Math.abs(years) > 0.1) {
      add("Air Quality", years, "AQLI 2025 Annual Update, University of Chicago; WHO SDG 11.6.2")
    }
  }

  // === SLEEP ===
  // Short sleep carries 12% higher mortality and long sleep 30% (Cappuccio et al., Sleep 2010)
  if (inputs.sleepHours !== undefined) {
    dataPoints++
    maxPossibleGain += 1 // best case: optimal 7-8h sleep
    let years = 0
    if (inputs.sleepHours >= 7 && inputs.sleepHours <= 8) {
      years = 1 // Optimal
    } else if (inputs.sleepHours < 6) {
      years = -2 // Short sleep
    } else if (inputs.sleepHours > 9) {
      years = -1 // Long sleep also associated with mortality
    }
    add("Sleep Duration", years, "Cappuccio et al., Sleep 2010")
  } else if (inputs.lifestyleScore !== undefined) {
    // Use lifestyle score as partial proxy for sleep
    dataPoints++
    maxPossibleGain += 0.5 // best case: healthy lifestyle proxy
    let years = 0
    if (inputs.lifestyleScore >= 80) years = 0.5
    else if (inputs.lifestyleScore < 40) years = -1
    add("Lifestyle Habits", years, "Lifestyle factors meta-analysis")
  }

  // === SOCIAL CONNECTION ===
  // Stronger social relationships: 50% higher odds of survival (Holt-Lunstad et al., PLOS Medicine 2010)
  if (inputs.socialConnection) {
    dataPoints++
    maxPossibleGain += 3 // best case: strong social ties
    const socialImpact: Record<string, number> = {
      strong: 3,
      moderate: 1,
      weak: -1,
      isolated: -3,
    }
    add("Social Connection", socialImpact[inputs.socialConnection] ?? 0, "Holt-Lunstad et al., PLOS Medicine 2010")
  }

  // === MENTAL HEALTH ===
  // Mental disorders carry a median 10 years of potential life lost (Walker et al. 2015). The
  // input is a screening score, not a diagnosis, so the adjustments stay conservative.
  if (inputs.mentalHealthScore !== undefined) {
    dataPoints++
    maxPossibleGain += 1.5 // best case: good mental health
    let years = 0
    if (inputs.mentalHealthScore >= 80) {
      years = 1.5 // Good mental health is protective
    } else if (inputs.mentalHealthScore < 30) {
      years = -4 // Severe mental health issues
    } else if (inputs.mentalHealthScore < 50) {
      years = -2
    }
    add("Mental Health", years, "Walker et al., JAMA Psychiatry 2015")
  }

  // === WORK ===
  // Working 55+ hours a week: 33% more strokes and 13% more coronary disease (Kivimäki et al.,
  // Lancet 2015); job strain: 23% more coronary disease (Kivimäki et al., Lancet 2012). No study
  // gives years of life for the work score, so these small values are a modelling assumption.
  if (inputs.workScore !== undefined) {
    dataPoints++
    maxPossibleGain += 0.5 // best case: low-stress work
    let years = 0
    if (inputs.workScore >= 80) {
      years = 0.5 // Low stress work environment
    } else if (inputs.workScore < 30) {
      years = -2.5 // High burnout/stress
    } else if (inputs.workScore < 50) {
      years = -1
    }
    add("Work Environment", years, "Kivimäki et al., Lancet 2015 and 2012")
  }

  // === WATER QUALITY ===
  // Unsafe drinking water is a recognised cause of death (WHO Guidelines for Drinking-water
  // Quality, 2022), but no study gives years of life for filtration or bottled-water habits, so
  // these small values are a modelling assumption.
  if (inputs.waterQualityScore !== undefined) {
    dataPoints++
    maxPossibleGain += 0.5 // best case: clean, well-filtered water
    let years = 0
    if (inputs.waterQualityScore >= 80) {
      years = 0.5 // Clean water, good filtration
    } else if (inputs.waterQualityScore < 30) {
      years = -2 // Poor water quality, high contaminant exposure
    } else if (inputs.waterQualityScore < 50) {
      years = -1 // Moderate water quality issues
    }
    add("Water Quality", years, "WHO Guidelines for Drinking-water Quality 2022")
  }

  // === LIFE CONTEXT (relationships, education, income, religion, pets, volunteering) ===
  // Marriage, education and income each carry multi-year differences: Jia & Lubetkin 2020
  // (marriage), Balaj 2024 Lancet Public Health (education), Chetty 2016 JAMA (income),
  // Li 2016 JAMA Intern Med (religion), Brown 2009 (ACEs)
  if (inputs.lifeContextScore !== undefined) {
    dataPoints++
    maxPossibleGain += 4 // best case: strong relationships, education, income
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
    add(
      "Life Context & Relationships",
      years,
      "Jia & Lubetkin 2020; Chetty 2016 JAMA; Balaj 2024 Lancet Public Health; Brown 2009 (ACEs)",
    )
  }

  // === PERSONALITY & OUTLOOK ===
  // Lee 2019 PNAS: top-quartile optimists live 11-15% longer
  // Jokela 2013 Am J Epidemiol: low conscientiousness carries 37% higher mortality
  if (inputs.personalityScore !== undefined) {
    dataPoints++
    maxPossibleGain += 3 // best case: optimism + conscientiousness
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
    add("Personality & Outlook", years, "Lee et al. 2019 PNAS; Jokela et al. 2013 Am J Epidemiol")
  }

  // === HOME ENVIRONMENT & HOUSEHOLD EXPOSURES ===
  // Cumulative low-level exposures (PFAS/microplastics from cookware, BPA/phthalates,
  // cleaning-spray VOCs, indoor NO2, damp/mould, radon, secondhand smoke).
  // Individually modest but additive; radon & indoor air carry the largest signal.
  // Svanes 2018 (cleaning sprays), Gruenwald 2023 (gas-stove asthma), WHO 2009 (damp/mould),
  // US EPA (radon = 2nd leading lung-cancer cause), Luo 2022 / Hussain 2023 (micro/nanoplastics).
  if (inputs.homeEnvironmentScore !== undefined) {
    dataPoints++
    maxPossibleGain += 1 // best case: clean cookware, low-VOC, well-ventilated
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
    add("Home Environment", years, "Svanes 2018; Gruenwald 2023; WHO 2009 (damp); US EPA (radon)")
  }

  // Combine: gains level off, losses add up (see the header)
  const gains = factors.reduce((sum, f) => (f.years > 0 ? sum + f.years : sum), 0)
  const losses = factors.reduce((sum, f) => (f.years < 0 ? sum - f.years : sum), 0)
  const combinedGain = combineGains(gains)
  const gainScale = gains > 0 ? combinedGain / gains : 1
  const totalAdjustment = combinedGain - losses

  // Factor effects are at the reference age; scale to the user's age
  const scaledAdjustment = totalAdjustment * ageScale
  const adjustedTotal = Math.max(age + 1, baselineTotal + scaledAdjustment)

  // Share of peers the estimate outlives (rough approximation): lifespans at the reference age
  // are taken as normally distributed with an SD of 10 years; the spread of remaining lifespans
  // narrows with age in the same proportion as the scaled effects.
  const percentile = Math.min(99, Math.max(1, 100 * normalCdf(totalAdjustment / LIFESPAN_SD_YEARS)))

  // Years still to gain by reaching the best case on the completed modules (an upper bound):
  // every gain at its maximum and every loss removed, except the part of the smoking loss that
  // stopping at this age no longer wins back. Past smokers have already taken their gain.
  const smokingLossKept =
    inputs.smokingStatus === "former"
      ? substances.smoking
      : substances.smoking * (1 - recoverableSmokingShare(age))
  const potentialGain = Math.max(
    0,
    (combineGains(maxPossibleGain) - totalAdjustment - smokingLossKept) * ageScale,
  )

  // Confidence based on data points
  let confidence: "low" | "medium" | "high" = "low"
  if (dataPoints >= 6) confidence = "high"
  else if (dataPoints >= 3) confidence = "medium"

  // Each gain is shown at its share of the combined gain, so the factors add up to the total
  const adjustments = factors
    .map(({ factor, years, source }) => ({
      factor,
      years: Math.round(years * (years > 0 ? gainScale : 1) * ageScale * 10) / 10,
      direction: (years > 0 ? "positive" : "negative") as "positive" | "negative",
      source,
    }))
    .filter((adjustment) => adjustment.years !== 0)
    .sort((a, b) => Math.abs(b.years) - Math.abs(a.years))

  return {
    baselineYears: Math.round(baselineTotal * 10) / 10,
    adjustedYears: Math.round(adjustedTotal * 10) / 10,
    totalAdjustment: Math.round(scaledAdjustment * 10) / 10,
    referenceAdjustment: Math.round(totalAdjustment * 10) / 10,
    adjustments,
    percentile: Math.round(percentile),
    potentialGain: Math.round(potentialGain * 10) / 10,
    confidence,
  }
}
