/**
 * Life Expectancy Estimator
 * 
 * Calculates estimated life expectancy adjustments based on modifiable health factors.
 * Uses peer-reviewed research and meta-analyses for risk adjustments.
 * 
 * Sources:
 * - GBD 2019 (Global Burden of Disease)
 * - WHO Global Health Observatory
 * - Lancet meta-analyses on lifestyle factors
 * - Harvard T.H. Chan School of Public Health studies
 */

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
  
  // Specific risk factors (from various modules)
  smokingStatus?: string
  alcoholFrequency?: string
  exerciseFrequency?: string
  sleepHours?: number
  socialConnection?: string
  processedMeatFrequency?: number
  pm25Level?: number
}

export interface LifeExpectancyResult {
  baselineYears: number
  adjustedYears: number
  totalAdjustment: number
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

// Baseline life expectancy by sex (global average 2023, WHO)
const BASELINE_LIFE_EXPECTANCY = {
  male: 70.8,
  female: 75.9,
  default: 73.3,
}

// Age adjustment - remaining life expectancy decreases with age
function getRemainingLifeExpectancy(age: number, sex: "male" | "female" | "default"): number {
  // Simplified actuarial table approximation
  const baseline = BASELINE_LIFE_EXPECTANCY[sex]
  if (age >= baseline) {
    // For those who've exceeded average, use conditional expectancy
    return Math.max(5, (100 - age) * 0.5)
  }
  return baseline - age
}

export function calculateLifeExpectancy(inputs: LifeExpectancyInputs): LifeExpectancyResult {
  const sex = inputs.sex || "default"
  const age = inputs.age || 40 // Default assumption
  
  const baselineRemaining = getRemainingLifeExpectancy(age, sex)
  const baselineTotal = age + baselineRemaining
  
  const adjustments: LifeExpectancyResult["adjustments"] = []
  let totalAdjustment = 0
  
  // Count how many modules provided data for confidence calculation
  let dataPoints = 0
  
  // === SMOKING (Lifestyle) ===
  // Smokers lose ~10 years on average (Doll et al., BMJ 2004)
  if (inputs.smokingStatus) {
    dataPoints++
    const smokingImpact: Record<string, number> = {
      never: 0,
      former: -2, // Former smokers still have some residual risk
      occasional: -5,
      daily: -10,
    }
    const years = smokingImpact[inputs.smokingStatus] ?? 0
    if (years !== 0) {
      adjustments.push({
        factor: "Smoking",
        years,
        direction: years > 0 ? "positive" : "negative",
        source: "Doll et al., BMJ 2004",
      })
      totalAdjustment += years
    }
  }
  
  // === EXERCISE (Exercise Module) ===
  // 150 min/week moderate exercise adds 3-4 years (Moore et al., PLOS Medicine 2012)
  if (inputs.exerciseScore !== undefined) {
    dataPoints++
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
  // Mediterranean/healthy diet adds 2-4 years (Sofi et al., BMJ 2008)
  // Processed meat (IARC Group 1) reduces life expectancy
  if (inputs.dietScore !== undefined) {
    dataPoints++
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
        source: "Sofi et al., BMJ 2008; IARC 2015",
      })
      totalAdjustment += years
    }
  }
  
  // === ALCOHOL ===
  // Heavy drinking reduces life expectancy by 4-5 years (Wood et al., Lancet 2018)
  if (inputs.alcoholFrequency) {
    dataPoints++
    const alcoholImpact: Record<string, number> = {
      never: 0.5, // Slight advantage in some studies
      rarely: 0,
      monthly: 0,
      weekly: -1,
      daily: -4,
    }
    const years = alcoholImpact[inputs.alcoholFrequency] ?? 0
    if (years !== 0) {
      adjustments.push({
        factor: "Alcohol Consumption",
        years,
        direction: years > 0 ? "positive" : "negative",
        source: "Wood et al., Lancet 2018",
      })
      totalAdjustment += years
    }
  }
  
  // === AIR QUALITY ===
  // Each 10 μg/m³ PM2.5 reduces life expectancy by ~0.6-1 year
  if (inputs.airQualityScore !== undefined || inputs.pm25Level !== undefined) {
    dataPoints++
    let years = 0
    if (inputs.pm25Level !== undefined) {
      // Direct PM2.5 calculation
      const excessPM25 = Math.max(0, inputs.pm25Level - 5) // WHO guideline is 5
      years = -(excessPM25 / 10) * 0.8
    } else if (inputs.airQualityScore !== undefined) {
      // Use score as proxy
      if (inputs.airQualityScore >= 90) years = 0.5 // Clean air bonus
      else if (inputs.airQualityScore < 40) years = -2
      else if (inputs.airQualityScore < 60) years = -1
    }
    if (Math.abs(years) > 0.1) {
      adjustments.push({
        factor: "Air Quality",
        years: Math.round(years * 10) / 10,
        direction: years > 0 ? "positive" : "negative",
        source: "AQLI, Energy Policy Institute 2023",
      })
      totalAdjustment += years
    }
  }
  
  // === SLEEP ===
  // Optimal sleep (7-8h) vs poor sleep affects mortality (Cappuccio et al., Sleep 2010)
  if (inputs.sleepHours !== undefined) {
    dataPoints++
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
  // Depression/chronic stress reduces life expectancy by 2-7 years
  if (inputs.mentalHealthScore !== undefined) {
    dataPoints++
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
        source: "Walker et al., BMJ 2015",
      })
      totalAdjustment += years
    }
  }
  
  // === WORK STRESS ===
  // Chronic work stress reduces life expectancy by 1-3 years
  if (inputs.workScore !== undefined) {
    dataPoints++
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
  
  // Calculate final values
  const adjustedTotal = Math.max(age + 1, baselineTotal + totalAdjustment)
  const adjustedRemaining = adjustedTotal - age
  
  // Calculate percentile (rough approximation)
  // Assume normal distribution with SD of 10 years
  const deviationFromMean = totalAdjustment
  const percentile = Math.min(99, Math.max(1, 50 + (deviationFromMean / 10) * 34))
  
  // Calculate potential gain (difference between current and optimal)
  const optimalAdjustment = 15 // Maximum possible with perfect lifestyle
  const potentialGain = Math.max(0, optimalAdjustment - totalAdjustment)
  
  // Confidence based on data points
  let confidence: "low" | "medium" | "high" = "low"
  if (dataPoints >= 6) confidence = "high"
  else if (dataPoints >= 3) confidence = "medium"
  
  return {
    baselineYears: Math.round(baselineTotal * 10) / 10,
    adjustedYears: Math.round(adjustedTotal * 10) / 10,
    totalAdjustment: Math.round(totalAdjustment * 10) / 10,
    adjustments: adjustments.sort((a, b) => Math.abs(b.years) - Math.abs(a.years)),
    percentile: Math.round(percentile),
    potentialGain: Math.round(potentialGain * 10) / 10,
    confidence,
  }
}
