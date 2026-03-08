/**
 * Lifestyle Assessment Calculator
 *
 * Focuses on non-work lifestyle factors that impact health.
 * Work-related factors are now in a separate Work Assessment module.
 *
 * Based on validated health instruments:
 *
 * 1. Sleep Quality:
 *    - Pittsburgh Sleep Quality Index (PSQI) simplified: validated instrument
 *      for measuring sleep quality; scores >5 indicate poor sleep quality.
 *    - WHO guidelines recommend 7-9 hours of sleep for adults.
 *
 * 2. Social Connection & Work-Life Balance:
 *    - Holt-Lunstad et al. (2010, 2015): social isolation increases mortality
 *      risk by ~29%, comparable to smoking 15 cigarettes/day.
 *    - WHO Guidelines on Mental Health at Work (2022): work-life balance is
 *      a key protective factor.
 *
 * 3. Substance Use:
 *    - WHO/CDC evidence on smoking and alcohol health impacts
 *    - No safe level of alcohol consumption (WHO)
 *
 * Overall score: 0-100, weighted across sub-domains.
 */

export interface LifestyleAnswers {
  // Sleep
  sleepHoursPerNight: number // 0-12+
  sleepQuality: "very-good" | "good" | "fair" | "poor" | "very-poor"
  sleepDifficulty: "never" | "rarely" | "sometimes" | "often" | "always" // falling/staying asleep
  sleepScheduleConsistency: "very-consistent" | "consistent" | "somewhat" | "inconsistent" | "very-inconsistent"

  // Social & Balance
  socialFrequency: "daily" | "several-weekly" | "weekly" | "monthly" | "rarely"
  qualityRelationships: "excellent" | "good" | "fair" | "poor" | "very-poor"
  lonelinessFrequency: "never" | "rarely" | "sometimes" | "often" | "always"

  // Screen time & leisure
  screenTimeHours: number // 0-12+ (recreational, non-work)
  outdoorTimeMinutes: number // daily outdoor/nature time
  hobbiesEngagement: "daily" | "several-weekly" | "weekly" | "monthly" | "rarely"

  // Substance use
  smokingStatus: "never" | "former" | "occasional" | "daily"
  alcoholFrequency: "never" | "monthly" | "weekly" | "several-weekly" | "daily"
  alcoholUnitsPerSession: number // 0-10+
  caffeineConsumption: "none" | "moderate" | "high" | "excessive" // cups of coffee equivalent
}

export interface LifestyleResult {
  overallScore: number
  subScores: {
    sleep: number
    social: number
    leisure: number
    habits: number
  }
  riskFactors: string[]
  recommendations: string[]
}

const FREQ_MAP: Record<string, number> = {
  never: 0,
  rarely: 1,
  sometimes: 2,
  often: 3,
  always: 4,
}

/**
 * Sleep score (0-100)
 * Based on PSQI scoring principles and WHO sleep recommendations (7-9h adults)
 */
function scoreSleep(answers: LifestyleAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  // Duration score: 7-9h = 100, 6-7h = 70-85, <6h or >10h = lower
  let durationScore: number
  const h = answers.sleepHoursPerNight
  if (h >= 7 && h <= 9) {
    durationScore = 100
  } else if (h >= 6 && h < 7) {
    durationScore = 70 + (h - 6) * 15
  } else if (h > 9 && h <= 10) {
    durationScore = 85
  } else if (h >= 5 && h < 6) {
    durationScore = 45 + (h - 5) * 25
  } else if (h < 5) {
    durationScore = Math.max(10, 45 - ((5 - h) / 3) * 35)
    risks.push(`Sleeping only ${h} hours: significantly below WHO recommendation of 7-9 hours`)
  } else {
    durationScore = 70 // oversleeping
    risks.push("Excessive sleep (10+ hours) may indicate underlying health issues")
  }

  // Quality score
  const qualityMap: Record<string, number> = {
    "very-good": 100,
    good: 85,
    fair: 60,
    poor: 35,
    "very-poor": 10,
  }
  const qualityScore = qualityMap[answers.sleepQuality] ?? 60

  // Difficulty score
  const difficultyPenalty = FREQ_MAP[answers.sleepDifficulty] * 10

  // Consistency score
  const consistencyMap: Record<string, number> = {
    "very-consistent": 100,
    consistent: 85,
    somewhat: 60,
    inconsistent: 35,
    "very-inconsistent": 15,
  }
  const consistencyScore = consistencyMap[answers.sleepScheduleConsistency] ?? 60

  if (answers.sleepQuality === "poor" || answers.sleepQuality === "very-poor") {
    risks.push("Poor sleep quality: PSQI research links this to depression, fatigue, and impaired immunity")
  }
  if (answers.sleepDifficulty === "often" || answers.sleepDifficulty === "always") {
    risks.push("Frequent difficulty falling/staying asleep is an insomnia indicator")
  }
  if (answers.sleepScheduleConsistency === "inconsistent" || answers.sleepScheduleConsistency === "very-inconsistent") {
    risks.push("Irregular sleep schedule disrupts circadian rhythm and reduces sleep quality")
  }

  const score = Math.max(
    0,
    Math.round(
      durationScore * 0.30 +
      qualityScore * 0.30 +
      (100 - difficultyPenalty * 2) * 0.20 +
      consistencyScore * 0.20
    )
  )
  return { score, risks }
}

/**
 * Social connection score (0-100)
 * Based on Holt-Lunstad meta-analyses
 */
function scoreSocial(answers: LifestyleAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  const frequencyMap: Record<string, number> = {
    daily: 100,
    "several-weekly": 85,
    weekly: 65,
    monthly: 40,
    rarely: 15,
  }

  const qualityMap: Record<string, number> = {
    excellent: 100,
    good: 80,
    fair: 55,
    poor: 30,
    "very-poor": 10,
  }

  const frequencyScore = frequencyMap[answers.socialFrequency] ?? 50
  const qualityScore = qualityMap[answers.qualityRelationships] ?? 50
  const lonelinessScore = 100 - FREQ_MAP[answers.lonelinessFrequency] * 22

  if (answers.socialFrequency === "monthly" || answers.socialFrequency === "rarely") {
    risks.push("Low social connection: Holt-Lunstad meta-analysis shows social isolation increases mortality risk by 29%")
  }
  if (answers.lonelinessFrequency === "often" || answers.lonelinessFrequency === "always") {
    risks.push("Frequent loneliness is associated with depression, cognitive decline, and cardiovascular risk")
  }
  if (answers.qualityRelationships === "poor" || answers.qualityRelationships === "very-poor") {
    risks.push("Poor quality relationships can be as harmful as social isolation")
  }

  const score = Math.round(frequencyScore * 0.35 + qualityScore * 0.35 + lonelinessScore * 0.30)
  return { score: Math.max(0, Math.min(100, score)), risks }
}

/**
 * Leisure & lifestyle balance score (0-100)
 */
function scoreLeisure(answers: LifestyleAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  // Screen time penalty (recreational): >4h has negative health association
  let screenScore = 100
  if (answers.screenTimeHours > 2) {
    screenScore = Math.max(20, 100 - ((answers.screenTimeHours - 2) / 6) * 60)
  }
  if (answers.screenTimeHours >= 6) {
    risks.push("High recreational screen time (6+ hours) associated with sedentary behavior risks and poor sleep")
  }

  // Outdoor time bonus (WHO recommends regular outdoor activity)
  let outdoorScore = 50 // baseline
  if (answers.outdoorTimeMinutes >= 60) {
    outdoorScore = 100
  } else if (answers.outdoorTimeMinutes >= 30) {
    outdoorScore = 75 + ((answers.outdoorTimeMinutes - 30) / 30) * 25
  } else if (answers.outdoorTimeMinutes >= 15) {
    outdoorScore = 50 + ((answers.outdoorTimeMinutes - 15) / 15) * 25
  } else {
    outdoorScore = Math.max(20, (answers.outdoorTimeMinutes / 15) * 30)
    risks.push("Limited outdoor time: regular exposure to nature benefits mental health and vitamin D levels")
  }

  // Hobbies engagement
  const hobbiesMap: Record<string, number> = {
    daily: 100,
    "several-weekly": 85,
    weekly: 65,
    monthly: 40,
    rarely: 20,
  }
  const hobbiesScore = hobbiesMap[answers.hobbiesEngagement] ?? 50

  if (answers.hobbiesEngagement === "rarely" || answers.hobbiesEngagement === "monthly") {
    risks.push("Limited engagement in hobbies/leisure activities reduces stress relief and life satisfaction")
  }

  const score = Math.round(screenScore * 0.35 + outdoorScore * 0.35 + hobbiesScore * 0.30)
  return { score: Math.max(0, Math.min(100, score)), risks }
}

/**
 * Habits score (smoking + alcohol + caffeine) (0-100)
 * WHO/CDC evidence on smoking and alcohol health impacts
 */
function scoreHabits(answers: LifestyleAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  const smokingMap: Record<string, number> = {
    never: 100,
    former: 75,
    occasional: 40,
    daily: 10,
  }

  const alcoholFreqMap: Record<string, number> = {
    never: 100,
    monthly: 90,
    weekly: 70,
    "several-weekly": 45,
    daily: 15,
  }

  const smokingScore = smokingMap[answers.smokingStatus] ?? 60
  let alcoholScore = alcoholFreqMap[answers.alcoholFrequency] ?? 60

  // Adjust for units per session (heavy drinking episodes are particularly harmful)
  if (answers.alcoholUnitsPerSession > 4) {
    alcoholScore = Math.max(10, alcoholScore - (answers.alcoholUnitsPerSession - 4) * 8)
    risks.push("Heavy drinking episodes (4+ units) significantly increase health risks")
  }

  // Caffeine (moderate is fine, excessive can disrupt sleep)
  const caffeineMap: Record<string, number> = {
    none: 100,
    moderate: 95, // 1-3 cups is fine
    high: 70, // 4-6 cups
    excessive: 40, // 7+ cups
  }
  const caffeineScore = caffeineMap[answers.caffeineConsumption] ?? 80

  if (answers.smokingStatus === "daily") {
    risks.push("Daily smoking: WHO reports tobacco kills over 8 million people annually")
  }
  if (answers.smokingStatus === "occasional") {
    risks.push("Even occasional smoking carries significant health risks")
  }
  if (answers.alcoholFrequency === "daily" || answers.alcoholFrequency === "several-weekly") {
    risks.push("Frequent alcohol consumption: WHO states no level of alcohol is safe for health")
  }
  if (answers.caffeineConsumption === "excessive") {
    risks.push("Excessive caffeine can disrupt sleep, increase anxiety, and affect heart rhythm")
  }

  return { score: Math.round(smokingScore * 0.45 + alcoholScore * 0.40 + caffeineScore * 0.15), risks }
}

/**
 * Main lifestyle assessment function
 * Sub-domain weights: Sleep 35%, Social 25%, Leisure 20%, Habits 20%
 */
export function calculateLifestyle(answers: LifestyleAnswers): LifestyleResult {
  const sl = scoreSleep(answers)
  const so = scoreSocial(answers)
  const le = scoreLeisure(answers)
  const hb = scoreHabits(answers)

  const allRisks = [...sl.risks, ...so.risks, ...le.risks, ...hb.risks]

  const overallScore = Math.round(
    sl.score * 0.35 +
    so.score * 0.25 +
    le.score * 0.20 +
    hb.score * 0.20
  )

  const recommendations: string[] = []

  if (sl.score < 60) recommendations.push("Prioritize sleep hygiene: consistent schedule, dark/cool room, limit screens before bed.")
  if (so.score < 60) recommendations.push("Strengthen social connections: schedule regular time with friends/family, join community groups.")
  if (le.score < 60) recommendations.push("Balance screen time with outdoor activities and hobbies you enjoy.")
  if (hb.score < 60) recommendations.push("Reducing smoking and alcohol intake are among the highest-impact changes for longevity.")

  if (overallScore >= 80) {
    recommendations.push("Your lifestyle profile is strong. Maintain these healthy habits.")
  }

  return {
    overallScore: Math.max(0, Math.min(100, overallScore)),
    subScores: {
      sleep: sl.score,
      social: so.score,
      leisure: le.score,
      habits: hb.score,
    },
    riskFactors: allRisks,
    recommendations,
  }
}
