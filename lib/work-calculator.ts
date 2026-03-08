/**
 * Work Assessment Calculator
 *
 * Separates work-related health factors from lifestyle, with employment
 * status-based screening to adapt the assessment.
 *
 * Employment categories and their health implications:
 * - Employed: Full work schedule and stress assessment
 * - Freelancer/Entrepreneur: Similar to employed but often more variable hours
 * - Unemployed: Different stressors (financial, purpose, routine)
 * - Retired: Generally lower work-related stress, but routine/purpose factors
 * - Student: Academic stress, different schedule patterns
 *
 * Based on:
 * 1. WHO/ILO Joint Estimates (2021): 55+ hours/week health risks
 * 2. IARC Monograph 124 (2019): Night shift work classification
 * 3. Copenhagen Burnout Inventory (Kristensen et al. 2005)
 * 4. Effort-Reward Imbalance model (Siegrist 1996)
 * 5. Job Demand-Control model (Karasek 1979)
 */

export type EmploymentStatus =
  | "employed"
  | "freelancer"
  | "entrepreneur"
  | "unemployed"
  | "retired"
  | "student"
  | "homemaker"
  | "unable-to-work"

export interface WorkAnswers {
  // Screening
  employmentStatus: EmploymentStatus

  // Work schedule (for employed/freelancer/entrepreneur)
  workingHoursPerDay: number
  daysPerWeek: number
  shiftType: "day" | "rotating" | "night" | "flexible"
  yearsOfShiftWork: number
  commuteMinutes: number

  // Work stress (CBI/ERI inspired)
  workExhaustion: "never" | "rarely" | "sometimes" | "often" | "always"
  workOverwhelm: "never" | "rarely" | "sometimes" | "often" | "always"
  effortRewardBalance: "well-rewarded" | "fairly-rewarded" | "neutral" | "under-rewarded" | "very-under-rewarded"
  jobControl: "high" | "moderate" | "low" | "very-low" // Karasek model
  jobSecurity: "very-secure" | "secure" | "uncertain" | "insecure" | "very-insecure"

  // For unemployed
  unemploymentDuration: "less-than-3-months" | "3-6-months" | "6-12-months" | "over-1-year" | "over-2-years"
  jobSearchStress: "none" | "mild" | "moderate" | "high" | "severe"
  financialStress: "none" | "mild" | "moderate" | "high" | "severe"

  // For retired
  retirementSatisfaction: "very-satisfied" | "satisfied" | "neutral" | "dissatisfied" | "very-dissatisfied"
  purposeInRetirement: "strong" | "moderate" | "some" | "little" | "none"

  // For students
  academicStress: "none" | "mild" | "moderate" | "high" | "severe"
  studyHoursPerDay: number
}

export interface WorkResult {
  overallScore: number
  category: string
  subScores: {
    schedule: number
    stress: number
    security: number
  }
  riskFactors: string[]
  recommendations: string[]
  employmentStatus: EmploymentStatus
  skipped: boolean
}

const FREQ_MAP: Record<string, number> = {
  never: 0,
  rarely: 1,
  sometimes: 2,
  often: 3,
  always: 4,
}

/**
 * Get base score adjustment for employment status
 * Retired individuals generally have lower work-related stress
 */
function getEmploymentBaseScore(status: EmploymentStatus): { base: number; skipFull: boolean } {
  switch (status) {
    case "retired":
      return { base: 85, skipFull: true } // High base, skip work stress questions
    case "unable-to-work":
      return { base: 70, skipFull: true } // Moderate base
    case "homemaker":
      return { base: 80, skipFull: true } // Different stress profile
    case "unemployed":
      return { base: 50, skipFull: false } // Assess unemployment-specific stress
    case "student":
      return { base: 65, skipFull: false } // Assess academic stress
    default:
      return { base: 50, skipFull: false } // Full assessment needed
  }
}

/**
 * Score work schedule (0-100)
 * For employed, freelancer, entrepreneur
 */
function scoreWorkSchedule(answers: WorkAnswers): { score: number; risks: string[] } {
  const risks: string[] = []
  const weeklyHours = answers.workingHoursPerDay * answers.daysPerWeek

  // Hours score
  let hoursScore = 100
  if (weeklyHours <= 40) {
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
    risks.push("Permanent night shift: IARC classifies as probably carcinogenic (Group 2A)")
  }

  // Commute penalty (long commutes associated with stress and reduced wellbeing)
  let commutePenalty = 0
  if (answers.commuteMinutes > 30) {
    commutePenalty = Math.min(15, ((answers.commuteMinutes - 30) / 60) * 15)
  }
  if (answers.commuteMinutes > 60) {
    risks.push("Long commute (60+ min) associated with increased stress and reduced life satisfaction")
  }

  if (answers.daysPerWeek >= 6) {
    risks.push("Working 6+ days/week with insufficient recovery time")
  }

  return {
    score: Math.max(0, Math.round(hoursScore - shiftPenalty - commutePenalty)),
    risks,
  }
}

/**
 * Score work stress (0-100)
 * Based on CBI, ERI, and Karasek Job Demand-Control model
 */
function scoreWorkStress(answers: WorkAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  // Exhaustion: 0=never to 4=always -> higher = worse
  const exhaustionScore = 100 - FREQ_MAP[answers.workExhaustion] * 22

  // Overwhelm
  const overwhelmScore = 100 - FREQ_MAP[answers.workOverwhelm] * 22

  // Effort-reward balance (Siegrist model)
  const eriMap: Record<string, number> = {
    "well-rewarded": 100,
    "fairly-rewarded": 80,
    neutral: 60,
    "under-rewarded": 35,
    "very-under-rewarded": 10,
  }
  const eriScore = eriMap[answers.effortRewardBalance] ?? 60

  // Job control (Karasek model - high demands with low control = high strain)
  const controlMap: Record<string, number> = {
    high: 100,
    moderate: 75,
    low: 40,
    "very-low": 15,
  }
  const controlScore = controlMap[answers.jobControl] ?? 60

  // Job security
  const securityMap: Record<string, number> = {
    "very-secure": 100,
    secure: 85,
    uncertain: 55,
    insecure: 30,
    "very-insecure": 10,
  }
  const securityScore = securityMap[answers.jobSecurity] ?? 60

  if (FREQ_MAP[answers.workExhaustion] >= 3) {
    risks.push("Frequent work exhaustion: CBI links chronic burnout to cardiovascular disease and depression")
  }
  if (answers.effortRewardBalance === "under-rewarded" || answers.effortRewardBalance === "very-under-rewarded") {
    risks.push("Effort-reward imbalance: Siegrist model shows this doubles coronary heart disease risk")
  }
  if (answers.jobControl === "low" || answers.jobControl === "very-low") {
    risks.push("Low job control with high demands: Karasek model links this to increased stress-related illness")
  }
  if (answers.jobSecurity === "insecure" || answers.jobSecurity === "very-insecure") {
    risks.push("Job insecurity is associated with increased anxiety and adverse health outcomes")
  }

  const score = Math.round(
    exhaustionScore * 0.25 +
    overwhelmScore * 0.20 +
    eriScore * 0.20 +
    controlScore * 0.20 +
    securityScore * 0.15
  )

  return { score: Math.max(0, Math.min(100, score)), risks }
}

/**
 * Score unemployment-specific factors
 */
function scoreUnemployment(answers: WorkAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  // Duration impact
  const durationMap: Record<string, number> = {
    "less-than-3-months": 85,
    "3-6-months": 70,
    "6-12-months": 55,
    "over-1-year": 40,
    "over-2-years": 25,
  }
  const durationScore = durationMap[answers.unemploymentDuration] ?? 50

  // Job search stress
  const stressMap: Record<string, number> = {
    none: 100,
    mild: 80,
    moderate: 55,
    high: 30,
    severe: 10,
  }
  const searchStressScore = stressMap[answers.jobSearchStress] ?? 50
  const financialScore = stressMap[answers.financialStress] ?? 50

  if (answers.unemploymentDuration === "over-1-year" || answers.unemploymentDuration === "over-2-years") {
    risks.push("Long-term unemployment associated with increased depression and health decline")
  }
  if (answers.financialStress === "high" || answers.financialStress === "severe") {
    risks.push("High financial stress during unemployment compounds health risks")
  }

  const score = Math.round(durationScore * 0.4 + searchStressScore * 0.3 + financialScore * 0.3)
  return { score: Math.max(0, Math.min(100, score)), risks }
}

/**
 * Score retirement factors
 */
function scoreRetirement(answers: WorkAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  const satisfactionMap: Record<string, number> = {
    "very-satisfied": 100,
    satisfied: 85,
    neutral: 60,
    dissatisfied: 35,
    "very-dissatisfied": 15,
  }

  const purposeMap: Record<string, number> = {
    strong: 100,
    moderate: 80,
    some: 55,
    little: 30,
    none: 10,
  }

  const satScore = satisfactionMap[answers.retirementSatisfaction] ?? 60
  const purposeScore = purposeMap[answers.purposeInRetirement] ?? 50

  if (answers.purposeInRetirement === "little" || answers.purposeInRetirement === "none") {
    risks.push("Lack of purpose in retirement linked to cognitive decline and reduced wellbeing")
  }

  const score = Math.round(satScore * 0.5 + purposeScore * 0.5)
  return { score: Math.max(0, Math.min(100, score)), risks }
}

/**
 * Score student-specific factors
 */
function scoreStudent(answers: WorkAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  const stressMap: Record<string, number> = {
    none: 100,
    mild: 80,
    moderate: 55,
    high: 30,
    severe: 10,
  }
  const academicScore = stressMap[answers.academicStress] ?? 50

  // Study hours (reasonable: 4-8 hrs/day)
  let hoursScore = 100
  const h = answers.studyHoursPerDay
  if (h <= 8) {
    hoursScore = 100
  } else if (h <= 12) {
    hoursScore = 80 - ((h - 8) / 4) * 30
  } else {
    hoursScore = Math.max(20, 50 - ((h - 12) / 4) * 30)
    risks.push("Excessive study hours (12+) can lead to burnout and reduced academic performance")
  }

  if (answers.academicStress === "high" || answers.academicStress === "severe") {
    risks.push("High academic stress linked to anxiety, depression, and sleep disorders")
  }

  const score = Math.round(academicScore * 0.6 + hoursScore * 0.4)
  return { score: Math.max(0, Math.min(100, score)), risks }
}

/**
 * Main work assessment function
 */
export function calculateWork(answers: WorkAnswers): WorkResult {
  const { base, skipFull } = getEmploymentBaseScore(answers.employmentStatus)
  const allRisks: string[] = []
  const recommendations: string[] = []

  let scheduleScore = 80
  let stressScore = 80
  let securityScore = 80
  let finalScore = base

  // Full assessment for employed/freelancer/entrepreneur
  if (answers.employmentStatus === "employed" ||
      answers.employmentStatus === "freelancer" ||
      answers.employmentStatus === "entrepreneur") {
    const ws = scoreWorkSchedule(answers)
    const st = scoreWorkStress(answers)

    scheduleScore = ws.score
    stressScore = st.score
    securityScore = st.score // Included in stress assessment

    allRisks.push(...ws.risks, ...st.risks)

    finalScore = Math.round(scheduleScore * 0.4 + stressScore * 0.6)

    if (scheduleScore < 60) {
      recommendations.push("Consider negotiating reduced hours or flexible scheduling where possible.")
    }
    if (stressScore < 60) {
      recommendations.push("Explore stress management techniques and workplace psychosocial support.")
    }
  }
  // Unemployment assessment
  else if (answers.employmentStatus === "unemployed") {
    const un = scoreUnemployment(answers)
    stressScore = un.score
    allRisks.push(...un.risks)
    finalScore = un.score

    recommendations.push("Maintain routine and social connections during job search.")
    if (un.score < 50) {
      recommendations.push("Consider seeking support services for job seekers and mental health resources.")
    }
  }
  // Retirement assessment
  else if (answers.employmentStatus === "retired") {
    const ret = scoreRetirement(answers)
    stressScore = ret.score
    allRisks.push(...ret.risks)
    finalScore = ret.score

    if (ret.score < 70) {
      recommendations.push("Explore hobbies, volunteering, or part-time activities to maintain purpose.")
    }
  }
  // Student assessment
  else if (answers.employmentStatus === "student") {
    const stu = scoreStudent(answers)
    stressScore = stu.score
    allRisks.push(...stu.risks)
    finalScore = stu.score

    if (stu.score < 60) {
      recommendations.push("Balance study with breaks, exercise, and social activities.")
    }
  }
  // Homemaker or unable to work - simplified assessment
  else if (skipFull) {
    finalScore = base
    recommendations.push("Your work-related health factors are within typical ranges for your situation.")
  }

  const category =
    finalScore >= 85 ? "Excellent" :
    finalScore >= 70 ? "Good" :
    finalScore >= 55 ? "Moderate" :
    finalScore >= 35 ? "Concerning" : "Critical"

  if (finalScore >= 80) {
    recommendations.push("Your work-life profile is healthy. Continue maintaining this balance.")
  }

  return {
    overallScore: Math.max(0, Math.min(100, finalScore)),
    category,
    subScores: {
      schedule: scheduleScore,
      stress: stressScore,
      security: securityScore,
    },
    riskFactors: allRisks,
    recommendations,
    employmentStatus: answers.employmentStatus,
    skipped: skipFull && answers.employmentStatus !== "retired" && answers.employmentStatus !== "unemployed",
  }
}

export const EMPLOYMENT_OPTIONS = [
  { value: "employed", label: "Employed", description: "Working for an employer" },
  { value: "freelancer", label: "Freelancer", description: "Self-employed, project-based work" },
  { value: "entrepreneur", label: "Entrepreneur", description: "Running your own business" },
  { value: "unemployed", label: "Unemployed", description: "Currently seeking work" },
  { value: "retired", label: "Retired", description: "No longer in the workforce" },
  { value: "student", label: "Student", description: "Full-time or part-time student" },
  { value: "homemaker", label: "Homemaker", description: "Managing household full-time" },
  { value: "unable-to-work", label: "Unable to Work", description: "Due to disability or health" },
] as const
