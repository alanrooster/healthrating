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
 *    - Adults need 7-9 hours (National Sleep Foundation, Hirshkowitz 2015; 7-8 h from
 *      age 65); AASM/SRS consensus: at least 7 hours (Watson 2015).
 *
 * 2. Social Connection & Work-Life Balance:
 *    - Holt-Lunstad et al. (2010, 2015): social isolation increases mortality
 *      risk by ~29%, comparable to smoking 15 cigarettes/day.
 *    - WHO Commission on Social Connection (2025): loneliness is linked to an
 *      estimated 871,000 deaths a year.
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
  // Sleep (PSQI-aligned)
  sleepHoursPerNight: number // 0-12+
  sleepQuality: "very-good" | "good" | "fair" | "poor" | "very-poor"
  sleepDifficulty: "never" | "rarely" | "sometimes" | "often" | "always" // falling/staying asleep
  sleepScheduleConsistency: "very-consistent" | "consistent" | "somewhat" | "inconsistent" | "very-inconsistent"
  sleepLatencyMinutes: number // PSQI: time to fall asleep (mins)
  daytimeDysfunction: "never" | "rarely" | "sometimes" | "often" | "always" // PSQI: trouble staying awake/motivation

  // Social & Balance
  socialFrequency: "daily" | "several-weekly" | "weekly" | "monthly" | "rarely"
  qualityRelationships: "excellent" | "good" | "fair" | "poor" | "very-poor"
  lonelinessFrequency: "never" | "rarely" | "sometimes" | "often" | "always"

  // Screen time & leisure
  screenTimeHours: number // 0-12+ (recreational, non-work)
  outdoorTimeMinutes: number // daily outdoor/nature time
  hobbiesEngagement: "daily" | "several-weekly" | "weekly" | "monthly" | "rarely"

  // Sedentary behavior (independent mortality predictor - Patel et al. 2018)
  sittingHoursPerDay: number // total sitting hours per day
  sedentaryBreaks: "frequently" | "sometimes" | "rarely" | "never" // breaks every 30-60 min

  // Sun exposure (Vitamin D + skin cancer balance)
  sunExposureMinutes: number // typical daily direct sun exposure (mins)
  sunscreenUse: "always" | "usually" | "sometimes" | "rarely" | "never"
  sunburnsPerYear: number // 0+ (skin cancer risk indicator)

  // Commute (Hansson et al. 2011 - long commutes raise depression/obesity risk)
  commuteMinutesOneWay: number // 0+ minutes one-way

  // Sauna (Laukkanen et al. 2015 JAMA - 4-7 sessions/week = -40% mortality vs 1/week)
  saunaSessionsPerWeek: number // 0-7+

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
    sedentary: number
    sun: number
    commute: number
    sauna: number
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
 * Based on PSQI scoring principles and NSF/AASM sleep-duration recommendations (7-9h adults)
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
    risks.push(`Sleeping only ${h} hours: significantly below the recommended 7-9 hours for adults`)
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

  // PSQI sleep latency - >30 mins = problematic
  let latencyScore = 100
  const lat = answers.sleepLatencyMinutes
  if (lat <= 15) latencyScore = 100
  else if (lat <= 30) latencyScore = 80
  else if (lat <= 60) latencyScore = 50
  else latencyScore = 20
  if (lat > 30) {
    risks.push(`Sleep latency of ${lat} minutes is elevated - PSQI considers >30 min problematic`)
  }

  // PSQI daytime dysfunction
  const dysfunctionPenalty = FREQ_MAP[answers.daytimeDysfunction] * 10
  const dysfunctionScore = Math.max(0, 100 - dysfunctionPenalty * 2)
  if (answers.daytimeDysfunction === "often" || answers.daytimeDysfunction === "always") {
    risks.push("Frequent daytime sleepiness suggests insufficient or poor-quality sleep")
  }

  const score = Math.max(
    0,
    Math.round(
      durationScore * 0.25 +
      qualityScore * 0.20 +
      (100 - difficultyPenalty * 2) * 0.15 +
      consistencyScore * 0.15 +
      latencyScore * 0.15 +
      dysfunctionScore * 0.10
    )
  )
  return { score, risks }
}

/**
 * Sedentary behavior score (0-100)
 * Patel et al. (2018, 2010): prolonged sitting increases all-cause mortality
 * INDEPENDENT of exercise. >8h/day sitting ~+40% mortality risk.
 * Breaking up sitting every 30-60 min reduces metabolic harm.
 */
function scoreSedentary(answers: LifestyleAnswers): { score: number; risks: string[] } {
  const risks: string[] = []
  const h = answers.sittingHoursPerDay

  let sittingScore: number
  if (h <= 4) sittingScore = 100
  else if (h <= 6) sittingScore = 80
  else if (h <= 8) sittingScore = 55
  else if (h <= 10) sittingScore = 30
  else sittingScore = 10

  if (h >= 8) {
    risks.push(`Sitting ${h}+ hours daily increases all-cause mortality risk independently of exercise (Patel et al. 2018)`)
  }

  const breaksMap: Record<string, number> = {
    frequently: 100,
    sometimes: 70,
    rarely: 35,
    never: 10,
  }
  const breaksScore = breaksMap[answers.sedentaryBreaks] ?? 50

  if (answers.sedentaryBreaks === "rarely" || answers.sedentaryBreaks === "never") {
    risks.push("Rarely breaking up sitting time amplifies metabolic and cardiovascular risk")
  }

  const score = Math.round(sittingScore * 0.7 + breaksScore * 0.3)
  return { score, risks }
}

/**
 * Sun exposure score (0-100)
 * Balance: enough for vitamin D synthesis, not so much that skin cancer risk rises.
 * Holick (2007): 10-30 min midday sun on arms/legs several times weekly is generally sufficient.
 * AAD: regular sunscreen + lifetime sunburns are key skin cancer predictors.
 */
function scoreSun(answers: LifestyleAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  // Exposure: sweet spot is 10-30 min/day
  let exposureScore: number
  const m = answers.sunExposureMinutes
  if (m < 5) {
    exposureScore = 30
    risks.push("Very limited sun exposure increases vitamin D deficiency risk")
  } else if (m <= 30) {
    exposureScore = 100
  } else if (m <= 60) {
    exposureScore = 75
  } else if (m <= 120) {
    exposureScore = 50
  } else {
    exposureScore = 25
    risks.push("Extended unprotected sun exposure raises skin cancer and photoaging risk")
  }

  // Sunscreen
  const sunscreenMap: Record<string, number> = {
    always: 100,
    usually: 85,
    sometimes: 60,
    rarely: 30,
    never: 10,
  }
  const sunscreenScore = sunscreenMap[answers.sunscreenUse] ?? 50
  if (answers.sunscreenUse === "rarely" || answers.sunscreenUse === "never") {
    risks.push("Infrequent sunscreen use is a leading modifiable skin cancer risk factor (AAD)")
  }

  // Sunburns - each blistering sunburn meaningfully raises melanoma risk
  let burnScore: number
  const b = answers.sunburnsPerYear
  if (b === 0) burnScore = 100
  else if (b === 1) burnScore = 75
  else if (b === 2) burnScore = 50
  else if (b <= 4) burnScore = 25
  else burnScore = 5
  if (b >= 2) {
    risks.push(`${b} sunburns per year significantly increases melanoma risk`)
  }

  const score = Math.round(exposureScore * 0.4 + sunscreenScore * 0.3 + burnScore * 0.3)
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

  // Outdoor time bonus (White et al. 2019: >=120 min/week in nature linked to better health and wellbeing)
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
 * Commute time score (0-100)
 * Hansson et al. 2011 (Sweden): commutes >45 min one-way associated with
 * +33% depression, +21% obesity, lower wellbeing. Each 10-min increment
 * correlates with worse health outcomes.
 */
function scoreCommute(answers: LifestyleAnswers): { score: number; risks: string[] } {
  const risks: string[] = []
  const m = answers.commuteMinutesOneWay
  let score: number
  if (m <= 5) score = 100 // remote/very close
  else if (m <= 15) score = 95
  else if (m <= 30) score = 80
  else if (m <= 45) score = 60
  else if (m <= 60) score = 40
  else if (m <= 90) score = 20
  else score = 5

  if (m >= 45) {
    risks.push(`Commute of ${m}+ minutes one-way is associated with elevated depression and obesity risk (Hansson et al. 2011)`)
  }
  return { score, risks }
}

/**
 * Sauna use score (0-100)
 * Laukkanen et al. 2015 (JAMA): 4-7 sauna sessions/week associated with
 * 40% lower all-cause mortality and 50% lower cardiovascular mortality
 * vs 1 session/week. Robust Finnish cohort with dose-response.
 */
function scoreSauna(answers: LifestyleAnswers): { score: number; risks: string[] } {
  const risks: string[] = []
  const s = answers.saunaSessionsPerWeek
  // Default baseline 50 (most people don't sauna; not a deficit per se)
  let score: number
  if (s === 0) score = 50
  else if (s === 1) score = 65
  else if (s <= 3) score = 80
  else if (s <= 7) score = 100
  else score = 90 // diminishing/no extra benefit
  return { score, risks }
}

/**
 * Main lifestyle assessment function
 * Sub-domain weights: Sleep 22%, Social 16%, Sedentary 13%, Sun 8%,
 * Leisure 12%, Commute 8%, Sauna 5%, Habits 16%
 */
export function calculateLifestyle(answers: LifestyleAnswers): LifestyleResult {
  const sl = scoreSleep(answers)
  const so = scoreSocial(answers)
  const le = scoreLeisure(answers)
  const sd = scoreSedentary(answers)
  const su = scoreSun(answers)
  const cm = scoreCommute(answers)
  const sa = scoreSauna(answers)
  const hb = scoreHabits(answers)

  const allRisks = [...sl.risks, ...so.risks, ...le.risks, ...sd.risks, ...su.risks, ...cm.risks, ...sa.risks, ...hb.risks]

  const overallScore = Math.round(
    sl.score * 0.22 +
    so.score * 0.16 +
    le.score * 0.12 +
    sd.score * 0.13 +
    su.score * 0.08 +
    cm.score * 0.08 +
    sa.score * 0.05 +
    hb.score * 0.16
  )

  const recommendations: string[] = []

  if (sl.score < 60) recommendations.push("Prioritize sleep hygiene: consistent schedule, dark/cool room, limit screens before bed.")
  if (so.score < 60) recommendations.push("Strengthen social connections: schedule regular time with friends/family, join community groups.")
  if (le.score < 60) recommendations.push("Balance screen time with outdoor activities and hobbies you enjoy.")
  if (sd.score < 60) recommendations.push("Break up sitting time: stand or move every 30-60 minutes; aim for under 8 hours sitting per day.")
  if (su.score < 60) recommendations.push("Aim for 10-30 minutes of daily sun exposure; use sunscreen and avoid sunburns to balance vitamin D and skin cancer risk.")
  if (cm.score < 60) recommendations.push("Long commutes harm health: consider remote work, moving closer to work, or using commute time productively (audiobooks, podcasts, transit reading).")
  if (sa.score < 60) recommendations.push("Regular sauna use (4+ sessions/week) is associated with major cardiovascular benefits in long-term Finnish data.")
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
      sedentary: sd.score,
      sun: su.score,
      commute: cm.score,
      sauna: sa.score,
      habits: hb.score,
    },
    riskFactors: allRisks,
    recommendations,
  }
}
