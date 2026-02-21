/**
 * Lifestyle Assessment Calculator
 *
 * Based on validated occupational health instruments:
 *
 * 1. Working Hours & Shift Work:
 *    - WHO/ILO Joint Estimates (2021): working 55+ hours/week associated with
 *      35% higher risk of stroke and 17% higher risk of ischemic heart disease.
 *    - IARC Monograph 124 (2019): night shift work classified as "probably
 *      carcinogenic to humans" (Group 2A) due to circadian disruption.
 *
 * 2. Work-Related Stress:
 *    - Copenhagen Burnout Inventory (CBI) - Kristensen et al. (2005): validated
 *      3-scale burnout measure (personal, work-related, client-related).
 *    - Effort-Reward Imbalance model - Siegrist (1996): imbalance between
 *      effort spent at work and rewards received predicts cardiovascular risk.
 *
 * 3. Sleep Quality:
 *    - Pittsburgh Sleep Quality Index (PSQI) simplified: validated instrument
 *      for measuring sleep quality; scores >5 indicate poor sleep quality.
 *    - WHO guidelines recommend 7-9 hours of sleep for adults.
 *
 * 4. Social Connection & Work-Life Balance:
 *    - Holt-Lunstad et al. (2010, 2015): social isolation increases mortality
 *      risk by ~29%, comparable to smoking 15 cigarettes/day.
 *    - WHO Guidelines on Mental Health at Work (2022): work-life balance is
 *      a key protective factor.
 *
 * Overall score: 0-100, weighted across sub-domains.
 */

export interface LifestyleAnswers {
  // Working hours & schedule
  workingHoursPerDay: number // 0-16+
  daysPerWeek: number // 1-7
  shiftType: "day" | "rotating" | "night" | "not-working"
  yearsOfShiftWork: number // 0-30+

  // Sleep
  sleepHoursPerNight: number // 0-12+
  sleepQuality: "very-good" | "good" | "fair" | "poor" | "very-poor"
  sleepDifficulty: "never" | "rarely" | "sometimes" | "often" | "always" // falling/staying asleep

  // Work stress (simplified CBI/ERI-inspired)
  workExhaustion: "never" | "rarely" | "sometimes" | "often" | "always"
  workOverwhelm: "never" | "rarely" | "sometimes" | "often" | "always"
  effortRewardBalance: "well-rewarded" | "fairly-rewarded" | "neutral" | "under-rewarded" | "very-under-rewarded"

  // Social & work-life balance
  socialFrequency: "daily" | "several-weekly" | "weekly" | "monthly" | "rarely"
  workLifeBalance: "excellent" | "good" | "fair" | "poor" | "very-poor"

  // Screen time outside work
  screenTimeHours: number // 0-12+

  // Substance use
  smokingStatus: "never" | "former" | "occasional" | "daily"
  alcoholFrequency: "never" | "monthly" | "weekly" | "several-weekly" | "daily"
}

export interface LifestyleResult {
  overallScore: number
  subScores: {
    workSchedule: number
    sleep: number
    workStress: number
    socialBalance: number
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
 * Working hours & schedule score (0-100)
 * WHO/ILO: 35-40 hrs/week is reference; 55+ hrs is high risk
 * IARC: night/rotating shift work adds risk proportional to years
 */
function scoreWorkSchedule(answers: LifestyleAnswers): { score: number; risks: string[] } {
  const risks: string[] = []
  const weeklyHours = answers.workingHoursPerDay * answers.daysPerWeek

  // Hours score: 35-40 = 100, 41-48 = 80-90, 49-54 = 50-75, 55+ = 15-50
  let hoursScore = 100
  if (answers.shiftType === "not-working") {
    hoursScore = 85 // neutral
  } else if (weeklyHours <= 40) {
    hoursScore = 100
  } else if (weeklyHours <= 48) {
    hoursScore = 90 - ((weeklyHours - 40) / 8) * 15
  } else if (weeklyHours <= 55) {
    hoursScore = 75 - ((weeklyHours - 48) / 7) * 25
  } else {
    hoursScore = Math.max(15, 50 - ((weeklyHours - 55) / 15) * 35)
    risks.push(`Working ${weeklyHours} hours/week: WHO/ILO data shows 55+ hours/week increases stroke risk by 35%`)
  }

  // Shift work penalty
  let shiftPenalty = 0
  if (answers.shiftType === "rotating") {
    shiftPenalty = 10 + Math.min(15, answers.yearsOfShiftWork * 0.8)
    risks.push("Rotating shift work disrupts circadian rhythm (IARC Group 2A risk factor)")
  } else if (answers.shiftType === "night") {
    shiftPenalty = 15 + Math.min(20, answers.yearsOfShiftWork * 1.0)
    risks.push("Permanent night shift: IARC classifies as probably carcinogenic (Group 2A) due to circadian disruption")
  }

  if (answers.daysPerWeek >= 6) {
    risks.push("Working 6+ days/week with insufficient recovery time")
  }

  return { score: Math.max(0, Math.round(hoursScore - shiftPenalty)), risks }
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

  if (answers.sleepQuality === "poor" || answers.sleepQuality === "very-poor") {
    risks.push("Poor sleep quality: PSQI research links this to depression, fatigue, and impaired immunity")
  }
  if (answers.sleepDifficulty === "often" || answers.sleepDifficulty === "always") {
    risks.push("Frequent difficulty falling/staying asleep is an insomnia indicator")
  }

  const score = Math.max(0, Math.round(durationScore * 0.4 + qualityScore * 0.4 + (100 - difficultyPenalty * 2.5) * 0.2))
  return { score, risks }
}

/**
 * Work stress score (0-100)
 * Inspired by CBI (Copenhagen Burnout Inventory) and ERI (Effort-Reward Imbalance)
 */
function scoreWorkStress(answers: LifestyleAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  if (answers.shiftType === "not-working") {
    return { score: 80, risks: [] } // neutral for non-workers
  }

  // Exhaustion: 0=never to 4=always -> higher = worse
  const exhaustionScore = 100 - FREQ_MAP[answers.workExhaustion] * 22

  // Overwhelm
  const overwhelmScore = 100 - FREQ_MAP[answers.workOverwhelm] * 22

  // Effort-reward balance
  const eriMap: Record<string, number> = {
    "well-rewarded": 100,
    "fairly-rewarded": 80,
    neutral: 60,
    "under-rewarded": 35,
    "very-under-rewarded": 10,
  }
  const eriScore = eriMap[answers.effortRewardBalance] ?? 60

  if (FREQ_MAP[answers.workExhaustion] >= 3) {
    risks.push("Frequent work exhaustion: CBI research links chronic burnout to cardiovascular disease and depression")
  }
  if (answers.effortRewardBalance === "under-rewarded" || answers.effortRewardBalance === "very-under-rewarded") {
    risks.push("Effort-reward imbalance: Siegrist model shows this doubles coronary heart disease risk")
  }

  const score = Math.round(exhaustionScore * 0.35 + overwhelmScore * 0.35 + eriScore * 0.3)
  return { score: Math.max(0, Math.min(100, score)), risks }
}

/**
 * Social connection & work-life balance score (0-100)
 * Based on Holt-Lunstad meta-analyses and WHO workplace guidelines
 */
function scoreSocialBalance(answers: LifestyleAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  const socialMap: Record<string, number> = {
    daily: 100,
    "several-weekly": 85,
    weekly: 65,
    monthly: 40,
    rarely: 15,
  }

  const wlbMap: Record<string, number> = {
    excellent: 100,
    good: 80,
    fair: 55,
    poor: 30,
    "very-poor": 10,
  }

  const socialScore = socialMap[answers.socialFrequency] ?? 50
  const wlbScore = wlbMap[answers.workLifeBalance] ?? 50

  // Screen time penalty (outside work): >4h has negative health association
  let screenPenalty = 0
  if (answers.screenTimeHours > 4) {
    screenPenalty = Math.min(20, (answers.screenTimeHours - 4) * 4)
  }

  if (answers.socialFrequency === "monthly" || answers.socialFrequency === "rarely") {
    risks.push("Low social connection: Holt-Lunstad meta-analysis shows social isolation increases mortality risk by 29%")
  }
  if (answers.workLifeBalance === "poor" || answers.workLifeBalance === "very-poor") {
    risks.push("Poor work-life balance: WHO recognizes this as a key occupational mental health risk")
  }
  if (answers.screenTimeHours >= 6) {
    risks.push("High recreational screen time (6+ hours) associated with increased sedentary behavior risks")
  }

  const score = Math.max(0, Math.round(socialScore * 0.4 + wlbScore * 0.4 + (100 - screenPenalty) * 0.2))
  return { score, risks }
}

/**
 * Habits score (smoking + alcohol) (0-100)
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

  const alcoholMap: Record<string, number> = {
    never: 100,
    monthly: 90,
    weekly: 70,
    "several-weekly": 45,
    daily: 15,
  }

  const smokingScore = smokingMap[answers.smokingStatus] ?? 60
  const alcoholScore = alcoholMap[answers.alcoholFrequency] ?? 60

  if (answers.smokingStatus === "daily") {
    risks.push("Daily smoking: WHO reports tobacco kills over 8 million people annually")
  }
  if (answers.alcoholFrequency === "daily" || answers.alcoholFrequency === "several-weekly") {
    risks.push("Frequent alcohol consumption: WHO states no level of alcohol is safe for health")
  }

  return { score: Math.round(smokingScore * 0.5 + alcoholScore * 0.5), risks }
}

/**
 * Main lifestyle assessment function
 * Sub-domain weights: Work Schedule 20%, Sleep 30%, Work Stress 20%,
 * Social/Balance 15%, Habits 15%
 */
export function calculateLifestyle(answers: LifestyleAnswers): LifestyleResult {
  const ws = scoreWorkSchedule(answers)
  const sl = scoreSleep(answers)
  const st = scoreWorkStress(answers)
  const sb = scoreSocialBalance(answers)
  const hb = scoreHabits(answers)

  const allRisks = [...ws.risks, ...sl.risks, ...st.risks, ...sb.risks, ...hb.risks]

  const overallScore = Math.round(
    ws.score * 0.20 +
    sl.score * 0.30 +
    st.score * 0.20 +
    sb.score * 0.15 +
    hb.score * 0.15
  )

  const recommendations: string[] = []

  if (ws.score < 60) recommendations.push("Consider reducing working hours or negotiating shift adjustments where possible.")
  if (sl.score < 60) recommendations.push("Prioritize sleep hygiene: consistent schedule, dark/cool room, limit screens before bed.")
  if (st.score < 60) recommendations.push("Explore stress management: WHO recommends workplace psychosocial interventions and regular breaks.")
  if (sb.score < 60) recommendations.push("Strengthen social connections and set clearer boundaries between work and personal time.")
  if (hb.score < 60) recommendations.push("Reducing smoking and alcohol intake are among the highest-impact changes for longevity.")

  if (overallScore >= 80) {
    recommendations.push("Your lifestyle profile is strong. Maintain these healthy habits.")
  }

  return {
    overallScore: Math.max(0, Math.min(100, overallScore)),
    subScores: {
      workSchedule: ws.score,
      sleep: sl.score,
      workStress: st.score,
      socialBalance: sb.score,
      habits: hb.score,
    },
    riskFactors: allRisks,
    recommendations,
  }
}
