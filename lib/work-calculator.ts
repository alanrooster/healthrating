/**
 * Work Assessment Calculator (Extended)
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
 * Scientific foundations:
 * 1. WHO/ILO Joint Estimates (2021): 55+ hours/week health risks
 * 2. IARC Monograph 124 (2019): Night shift work classification
 * 3. Copenhagen Psychosocial Questionnaire III (COPSOQ III, 2019-2025)
 *    - Validated in 18+ countries, ~46 dimensions covering psychosocial work environment
 *    - Domains: Demands, Work Organization, Interpersonal Relations, Values, Health Outcomes
 * 4. Copenhagen Burnout Inventory (Kristensen et al. 2005)
 * 5. Effort-Reward Imbalance model (Siegrist 1996, 2016)
 * 6. Job Demand-Control-Support model (Karasek 1979, Johnson 1988)
 * 7. WHO Guidelines on Mental Health at Work (2022)
 * 8. EU-OSHA Psychosocial Risks Framework (2022-2025)
 * 9. ILO Psychosocial Hazards at Work (2022)
 * 10. Maslach Burnout Inventory dimensions (Maslach & Jackson 1981)
 *     Effect sizes for job strain and effort-reward imbalance come from the IPD-Work pooled
 *     cohorts: coronary heart disease HR 1.23 with job strain (Kivimäki et al., Lancet 2012),
 *     1.16 with effort-reward imbalance and 1.41 with both (Dragano et al., Epidemiology 2017)
 * 11. Ionising radiation at work (Directive 2013/59/Euratom): aircrew doses must be assessed above
 *     1 mSv a year (Art. 35(3)); industries processing naturally-occurring radioactive material
 *     (NORM, Annex VI: phosphate fertiliser, oil and gas, coal-fired power plants, zircon, rare
 *     earths, metal smelting, groundwater filtration...) must assess workers' doses; workplace
 *     radon reference level at most 300 Bq/m³; the unborn child is protected like the public
 *     (Art. 10). Solid cancer mortality rises 52% per Gy even at low doses (INWORKS, Richardson et
 *     al., BMJ 2023). Points are subtracted, so people without exposure keep the same score.
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

  // === WORK SCHEDULE (for employed/freelancer/entrepreneur) ===
  workingHoursPerDay: number
  daysPerWeek: number
  shiftType: "day" | "rotating" | "night" | "flexible"
  yearsOfShiftWork: number
  commuteMinutes: number
  // Optional: answers saved before it existed don't have it (missing = none)
  radiationAtWork?: "none" | "monitored" | "aircrew" | "norm" | "underground" | "unsure"
  
  // === WORK STRESS - Core Burnout (CBI/MBI inspired) ===
  workExhaustion: FrequencyLevel       // Physical/emotional exhaustion
  workOverwhelm: FrequencyLevel        // Feeling overwhelmed by workload
  cynicism: FrequencyLevel             // MBI: depersonalization/cynicism toward work
  
  // === JOB DEMANDS (COPSOQ III) ===
  quantitativeDemands: FrequencyLevel  // Too much to do, time pressure
  emotionalDemands: FrequencyLevel     // Emotional situations, hiding feelings
  cognitiveDemands: FrequencyLevel     // Concentration, complex decisions
  
  // === JOB RESOURCES & CONTROL (Karasek, COPSOQ III) ===
  jobControl: ControlLevel             // Influence over own work
  roleClarity: ClarityLevel            // Clear expectations and responsibilities
  meaningOfWork: MeaningLevel          // Work feels meaningful and purposeful
  possibilitiesForDevelopment: OpportunityLevel // Learning and growth opportunities
  
  // === INTERPERSONAL & ORGANIZATIONAL (COPSOQ III, ILO, EU-OSHA) ===
  socialSupportColleagues: SupportLevel   // Support from coworkers
  socialSupportSupervisor: SupportLevel   // Support from manager/supervisor
  qualityOfLeadership: QualityLevel       // Manager's leadership quality
  organizationalJustice: JusticeLevel     // Fair treatment, transparent decisions
  recognition: RecognitionLevel           // Appreciation for work (ERI model)
  
  // === WORKPLACE RELATIONSHIPS (EU-OSHA, ILO) ===
  workplaceConflict: FrequencyLevel    // Conflicts with colleagues/supervisors
  bullyingExposure: ExposureLevel      // Exposure to bullying/harassment
  senseOfCommunity: CommunityLevel     // Belonging, team cohesion
  
  // === WORK-LIFE INTERFACE (COPSOQ III, EU-OSHA) ===
  workLifeConflict: FrequencyLevel     // Work interfering with personal life
  
  // === JOB SECURITY (COPSOQ III) ===
  jobSecurity: SecurityLevel
  jobInsecurityConditions: InsecurityLevel // Worried about working conditions changing
  
  // === EFFORT-REWARD (Siegrist model) ===
  effortRewardBalance: RewardLevel

  // === For unemployed ===
  unemploymentDuration: DurationLevel
  jobSearchStress: StressLevel
  financialStress: StressLevel
  socialIsolation: IsolationLevel      // Unemployment-specific

  // === For retired ===
  retirementSatisfaction: SatisfactionLevel
  purposeInRetirement: PurposeLevel
  volunteeringEngagement: EngagementLevel // Social engagement in retirement

  // === For students ===
  academicStress: StressLevel
  studyHoursPerDay: number
  academicSupport: SupportLevel        // Support from institution/peers
}

// Type definitions for answer scales
type FrequencyLevel = "never" | "rarely" | "sometimes" | "often" | "always"
type ControlLevel = "very-high" | "high" | "moderate" | "low" | "very-low"
type ClarityLevel = "very-clear" | "clear" | "somewhat-clear" | "unclear" | "very-unclear"
type MeaningLevel = "very-meaningful" | "meaningful" | "somewhat" | "little" | "none"
type OpportunityLevel = "excellent" | "good" | "moderate" | "limited" | "none"
type SupportLevel = "always" | "often" | "sometimes" | "rarely" | "never"
type QualityLevel = "excellent" | "good" | "adequate" | "poor" | "very-poor"
type JusticeLevel = "always-fair" | "usually-fair" | "sometimes-fair" | "rarely-fair" | "never-fair"
type RecognitionLevel = "well-recognized" | "fairly-recognized" | "somewhat" | "under-recognized" | "not-recognized"
type ExposureLevel = "never" | "rarely" | "occasionally" | "frequently" | "constantly"
type CommunityLevel = "very-strong" | "strong" | "moderate" | "weak" | "none"
type SecurityLevel = "very-secure" | "secure" | "uncertain" | "insecure" | "very-insecure"
type InsecurityLevel = "not-worried" | "slightly-worried" | "somewhat-worried" | "worried" | "very-worried"
type RewardLevel = "well-rewarded" | "fairly-rewarded" | "neutral" | "under-rewarded" | "very-under-rewarded"
type DurationLevel = "less-than-3-months" | "3-6-months" | "6-12-months" | "over-1-year" | "over-2-years"
type StressLevel = "none" | "mild" | "moderate" | "high" | "severe"
type IsolationLevel = "not-isolated" | "slightly" | "moderately" | "very" | "completely"
type SatisfactionLevel = "very-satisfied" | "satisfied" | "neutral" | "dissatisfied" | "very-dissatisfied"
type PurposeLevel = "strong" | "moderate" | "some" | "little" | "none"
type EngagementLevel = "very-active" | "active" | "occasional" | "rare" | "none"

export interface WorkResult {
  overallScore: number
  category: string
  subScores: {
    schedule: number
    burnout: number
    demands: number
    resources: number
    relationships: number
    security: number
  }
  riskFactors: string[]
  recommendations: string[]
  employmentStatus: EmploymentStatus
  skipped: boolean
}

// Frequency/level to score mappings (0-4, 0=best for negative items)
const FREQ_MAP: Record<string, number> = {
  never: 0, rarely: 1, sometimes: 2, often: 3, always: 4,
}
const FREQ_MAP_POSITIVE: Record<string, number> = {
  never: 4, rarely: 3, sometimes: 2, often: 1, always: 0,
}
const CONTROL_MAP: Record<string, number> = {
  "very-high": 100, high: 85, moderate: 60, low: 35, "very-low": 10,
}
const CLARITY_MAP: Record<string, number> = {
  "very-clear": 100, clear: 85, "somewhat-clear": 60, unclear: 35, "very-unclear": 10,
}
const MEANING_MAP: Record<string, number> = {
  "very-meaningful": 100, meaningful: 85, somewhat: 55, little: 30, none: 10,
}
const OPPORTUNITY_MAP: Record<string, number> = {
  excellent: 100, good: 80, moderate: 55, limited: 30, none: 10,
}
const SUPPORT_MAP: Record<string, number> = {
  always: 100, often: 80, sometimes: 55, rarely: 30, never: 10,
}
const QUALITY_MAP: Record<string, number> = {
  excellent: 100, good: 80, adequate: 55, poor: 30, "very-poor": 10,
}
const JUSTICE_MAP: Record<string, number> = {
  "always-fair": 100, "usually-fair": 80, "sometimes-fair": 55, "rarely-fair": 30, "never-fair": 10,
}
const RECOGNITION_MAP: Record<string, number> = {
  "well-recognized": 100, "fairly-recognized": 80, somewhat: 55, "under-recognized": 30, "not-recognized": 10,
}
const EXPOSURE_MAP: Record<string, number> = {
  never: 100, rarely: 80, occasionally: 55, frequently: 25, constantly: 5,
}
const COMMUNITY_MAP: Record<string, number> = {
  "very-strong": 100, strong: 80, moderate: 55, weak: 30, none: 10,
}
const SECURITY_MAP: Record<string, number> = {
  "very-secure": 100, secure: 85, uncertain: 55, insecure: 30, "very-insecure": 10,
}
const INSECURITY_MAP: Record<string, number> = {
  "not-worried": 100, "slightly-worried": 80, "somewhat-worried": 55, worried: 30, "very-worried": 10,
}
const REWARD_MAP: Record<string, number> = {
  "well-rewarded": 100, "fairly-rewarded": 80, neutral: 55, "under-rewarded": 30, "very-under-rewarded": 10,
}

/**
 * Get base score adjustment for employment status
 */
function getEmploymentBaseScore(status: EmploymentStatus): { base: number; skipFull: boolean } {
  switch (status) {
    case "retired": return { base: 85, skipFull: true }
    case "unable-to-work": return { base: 70, skipFull: true }
    case "homemaker": return { base: 80, skipFull: true }
    case "unemployed": return { base: 50, skipFull: false }
    case "student": return { base: 65, skipFull: false }
    default: return { base: 50, skipFull: false }
  }
}

/**
 * Score work schedule (0-100)
 */
function scoreWorkSchedule(answers: WorkAnswers): { score: number; risks: string[] } {
  const risks: string[] = []
  const weeklyHours = answers.workingHoursPerDay * answers.daysPerWeek

  // Hours score (WHO/ILO Joint Estimates 2021)
  let hoursScore = 100
  if (weeklyHours <= 40) {
    hoursScore = 100
  } else if (weeklyHours <= 48) {
    hoursScore = 90 - ((weeklyHours - 40) / 8) * 15
  } else if (weeklyHours <= 55) {
    hoursScore = 75 - ((weeklyHours - 48) / 7) * 25
    risks.push(`Working ${weeklyHours} hours/week exceeds the 48-hour weekly cap in the EU Working Time Directive and ILO conventions`)
  } else {
    hoursScore = Math.max(15, 50 - ((weeklyHours - 55) / 15) * 35)
    risks.push(`Working ${weeklyHours}h/week: WHO/ILO data shows 55+ hours increases stroke risk by 35% and ischaemic heart disease by 17%`)
  }

  // Shift work penalty (IARC Monograph 124)
  let shiftPenalty = 0
  if (answers.shiftType === "rotating") {
    shiftPenalty = 10 + Math.min(15, answers.yearsOfShiftWork * 0.8)
    risks.push("Rotating shift work disrupts circadian rhythm (IARC Group 2A carcinogen classification)")
  } else if (answers.shiftType === "night") {
    shiftPenalty = 15 + Math.min(20, answers.yearsOfShiftWork * 1.0)
    risks.push("Permanent night shift: IARC classifies as Group 2A (probably carcinogenic), linked to breast cancer and metabolic disorders")
  }

  // Commute penalty
  let commutePenalty = 0
  if (answers.commuteMinutes > 30) {
    commutePenalty = Math.min(15, ((answers.commuteMinutes - 30) / 60) * 15)
  }
  if (answers.commuteMinutes > 60) {
    risks.push("Long commute (60+ min): linked to lower life satisfaction (Stutzer & Frey 2008) and to higher blood pressure and weight (Hoehner et al. 2012)")
  }

  if (answers.daysPerWeek >= 6) {
    risks.push("Working 6+ days/week with insufficient recovery time increases burnout risk")
  }

  return {
    score: Math.max(0, Math.round(hoursScore - shiftPenalty - commutePenalty)),
    risks,
  }
}

/**
 * Score burnout dimensions (0-100)
 * Based on CBI (Kristensen 2005) and MBI (Maslach & Jackson)
 * Three MBI dimensions: Exhaustion, Cynicism (depersonalization), Reduced efficacy
 */
function scoreBurnout(answers: WorkAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  // Exhaustion (higher frequency = worse)
  const exhaustionScore = 100 - FREQ_MAP[answers.workExhaustion] * 22
  // Overwhelm
  const overwhelmScore = 100 - FREQ_MAP[answers.workOverwhelm] * 22
  // Cynicism/depersonalization
  const cynicismScore = 100 - FREQ_MAP[answers.cynicism] * 22

  if (FREQ_MAP[answers.workExhaustion] >= 3) {
    risks.push("Frequent exhaustion: Key burnout indicator (CBI). Chronic exhaustion linked to cardiovascular disease and depression")
  }
  if (FREQ_MAP[answers.cynicism] >= 3) {
    risks.push("High cynicism/depersonalization: MBI indicates burnout progression toward professional inefficacy")
  }
  if (FREQ_MAP[answers.workOverwhelm] >= 3 && FREQ_MAP[answers.workExhaustion] >= 3) {
    risks.push("Combined exhaustion and overwhelm indicates high burnout risk requiring intervention")
  }

  const score = Math.round(exhaustionScore * 0.40 + overwhelmScore * 0.30 + cynicismScore * 0.30)
  return { score: Math.max(0, Math.min(100, score)), risks }
}

/**
 * Score job demands (0-100)
 * Based on COPSOQ III demands domains
 */
function scoreJobDemands(answers: WorkAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  // Higher demands = lower score (inverted)
  const quantitativeScore = 100 - FREQ_MAP[answers.quantitativeDemands] * 22
  const emotionalScore = 100 - FREQ_MAP[answers.emotionalDemands] * 22
  const cognitiveScore = 100 - FREQ_MAP[answers.cognitiveDemands] * 20 // Cognitive demands less harmful if matched with control

  if (FREQ_MAP[answers.quantitativeDemands] >= 3) {
    risks.push("High quantitative demands (COPSOQ III): Excessive workload linked to stress, fatigue, and sickness absence")
  }
  if (FREQ_MAP[answers.emotionalDemands] >= 3) {
    risks.push("High emotional demands: Emotional labor and hiding feelings associated with burnout and emotional exhaustion (COPSOQ III)")
  }

  // Weight: quantitative demands most impactful, emotional next, cognitive less so if resources exist
  const score = Math.round(quantitativeScore * 0.45 + emotionalScore * 0.35 + cognitiveScore * 0.20)
  return { score: Math.max(0, Math.min(100, score)), risks }
}

/**
 * Score job resources (0-100)
 * Based on COPSOQ III resources and Karasek JDC-S model
 * Resources buffer against demands
 */
function scoreJobResources(answers: WorkAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  const controlScore = CONTROL_MAP[answers.jobControl] ?? 60
  const clarityScore = CLARITY_MAP[answers.roleClarity] ?? 60
  const meaningScore = MEANING_MAP[answers.meaningOfWork] ?? 60
  const developmentScore = OPPORTUNITY_MAP[answers.possibilitiesForDevelopment] ?? 60

  if (controlScore <= 35) {
    risks.push("Low job control (Karasek model): combined with high demands it makes a 'high-strain' job, which carries 23% more coronary heart disease (Kivimäki et al., Lancet 2012)")
  }
  if (clarityScore <= 35) {
    risks.push("Low role clarity (COPSOQ III): Unclear expectations linked to stress, job dissatisfaction, and intention to leave")
  }
  if (meaningScore <= 30) {
    risks.push("Low meaning of work: Lack of purpose associated with disengagement and mental health decline")
  }
  if (developmentScore <= 30) {
    risks.push("Limited development opportunities: Career stagnation linked to reduced wellbeing and motivation")
  }

  const score = Math.round(
    controlScore * 0.30 + clarityScore * 0.25 + meaningScore * 0.25 + developmentScore * 0.20
  )
  return { score: Math.max(0, Math.min(100, score)), risks }
}

/**
 * Score interpersonal and organizational factors (0-100)
 * Based on COPSOQ III, EU-OSHA, ILO frameworks
 */
function scoreRelationships(answers: WorkAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  const colleagueSupport = SUPPORT_MAP[answers.socialSupportColleagues] ?? 60
  const supervisorSupport = SUPPORT_MAP[answers.socialSupportSupervisor] ?? 60
  const leadershipQuality = QUALITY_MAP[answers.qualityOfLeadership] ?? 60
  const justice = JUSTICE_MAP[answers.organizationalJustice] ?? 60
  const recognition = RECOGNITION_MAP[answers.recognition] ?? 60
  const conflictScore = 100 - FREQ_MAP[answers.workplaceConflict] * 22
  const bullyingScore = EXPOSURE_MAP[answers.bullyingExposure] ?? 80
  const communityScore = COMMUNITY_MAP[answers.senseOfCommunity] ?? 60
  const workLifeScore = 100 - FREQ_MAP[answers.workLifeConflict] * 22

  if (supervisorSupport <= 30) {
    risks.push("Low supervisor support (COPSOQ III/JDC-S): Lack of managerial support is a key psychosocial risk factor")
  }
  if (colleagueSupport <= 30) {
    risks.push("Low colleague support: Poor social support at work linked to increased stress and sickness absence")
  }
  if (justice <= 30) {
    risks.push("Low organizational justice (COPSOQ III): Perceived unfairness strongly predicts mental health problems and sickness absence")
  }
  if (recognition <= 30) {
    risks.push("Low recognition (Siegrist ERI model): effort-reward imbalance carries 16% more coronary heart disease, 41% together with job strain (Dragano et al. 2017)")
  }
  if (bullyingScore <= 55) {
    risks.push("Workplace bullying exposure (EU-OSHA): Associated with depression, anxiety, PTSD, and cardiovascular disease")
  }
  if (leadershipQuality <= 30) {
    risks.push("Poor leadership quality: Toxic leadership linked to employee stress, turnover intention, and reduced wellbeing")
  }
  if (workLifeScore <= 40) {
    risks.push("High work-life conflict (COPSOQ III): Work-family interference associated with burnout, depression, and relationship strain")
  }

  const score = Math.round(
    colleagueSupport * 0.12 +
    supervisorSupport * 0.15 +
    leadershipQuality * 0.13 +
    justice * 0.12 +
    recognition * 0.12 +
    conflictScore * 0.08 +
    bullyingScore * 0.10 +
    communityScore * 0.08 +
    workLifeScore * 0.10
  )
  return { score: Math.max(0, Math.min(100, score)), risks }
}

/**
 * Score job security factors (0-100)
 * Based on COPSOQ III job security dimensions
 */
function scoreJobSecurity(answers: WorkAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  const securityScore = SECURITY_MAP[answers.jobSecurity] ?? 60
  const conditionsScore = INSECURITY_MAP[answers.jobInsecurityConditions] ?? 60
  const rewardScore = REWARD_MAP[answers.effortRewardBalance] ?? 60

  if (securityScore <= 30) {
    risks.push("Job insecurity (COPSOQ III): Associated with increased anxiety, depression, and adverse health outcomes")
  }
  if (conditionsScore <= 30) {
    risks.push("Insecurity over working conditions: Uncertainty about future changes increases chronic stress")
  }
  if (rewardScore <= 30) {
    risks.push("Effort-reward imbalance (Siegrist 1996): high effort for low reward carries 16% more coronary heart disease, 41% together with job strain (Dragano et al. 2017)")
  }

  const score = Math.round(securityScore * 0.40 + conditionsScore * 0.25 + rewardScore * 0.35)
  return { score: Math.max(0, Math.min(100, score)), risks }
}

/**
 * Score unemployment-specific factors
 */
function scoreUnemployment(answers: WorkAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  const durationMap: Record<string, number> = {
    "less-than-3-months": 85, "3-6-months": 70, "6-12-months": 55,
    "over-1-year": 40, "over-2-years": 25,
  }
  const stressMap: Record<string, number> = {
    none: 100, mild: 80, moderate: 55, high: 30, severe: 10,
  }
  const isolationMap: Record<string, number> = {
    "not-isolated": 100, slightly: 80, moderately: 55, very: 30, completely: 10,
  }

  const durationScore = durationMap[answers.unemploymentDuration] ?? 50
  const searchStressScore = stressMap[answers.jobSearchStress] ?? 50
  const financialScore = stressMap[answers.financialStress] ?? 50
  const isolationScore = isolationMap[answers.socialIsolation] ?? 60

  if (answers.unemploymentDuration === "over-1-year" || answers.unemploymentDuration === "over-2-years") {
    risks.push("Long-term unemployment: Strongly associated with depression, anxiety, and physical health decline (WHO)")
  }
  if (answers.financialStress === "high" || answers.financialStress === "severe") {
    risks.push("High financial stress during unemployment compounds mental and physical health risks")
  }
  if (answers.socialIsolation === "very" || answers.socialIsolation === "completely") {
    risks.push("Social isolation during unemployment: Lack of social contact accelerates mental health decline")
  }

  const score = Math.round(durationScore * 0.30 + searchStressScore * 0.25 + financialScore * 0.25 + isolationScore * 0.20)
  return { score: Math.max(0, Math.min(100, score)), risks }
}

/**
 * Score retirement factors
 */
function scoreRetirement(answers: WorkAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  const satisfactionMap: Record<string, number> = {
    "very-satisfied": 100, satisfied: 85, neutral: 60, dissatisfied: 35, "very-dissatisfied": 15,
  }
  const purposeMap: Record<string, number> = {
    strong: 100, moderate: 80, some: 55, little: 30, none: 10,
  }
  const engagementMap: Record<string, number> = {
    "very-active": 100, active: 80, occasional: 55, rare: 30, none: 10,
  }

  const satScore = satisfactionMap[answers.retirementSatisfaction] ?? 60
  const purposeScore = purposeMap[answers.purposeInRetirement] ?? 50
  const engagementScore = engagementMap[answers.volunteeringEngagement] ?? 50

  if (purposeScore <= 30) {
    risks.push("Lack of purpose in retirement linked to cognitive decline, depression, and reduced longevity")
  }
  if (engagementScore <= 30) {
    risks.push("Low social engagement in retirement: Social isolation increases mortality risk by 29% (Holt-Lunstad)")
  }

  const score = Math.round(satScore * 0.35 + purposeScore * 0.40 + engagementScore * 0.25)
  return { score: Math.max(0, Math.min(100, score)), risks }
}

/**
 * Score student-specific factors
 */
function scoreStudent(answers: WorkAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  const stressMap: Record<string, number> = {
    none: 100, mild: 80, moderate: 55, high: 30, severe: 10,
  }
  const supportMap: Record<string, number> = {
    always: 100, often: 80, sometimes: 55, rarely: 30, never: 10,
  }

  const academicScore = stressMap[answers.academicStress] ?? 50
  const supportScore = supportMap[answers.academicSupport] ?? 60

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
    risks.push("High academic stress: Linked to anxiety, depression, sleep disorders, and academic burnout")
  }
  if (supportScore <= 30) {
    risks.push("Low academic support: Lack of institutional/peer support increases dropout risk and mental health issues")
  }

  const score = Math.round(academicScore * 0.45 + hoursScore * 0.30 + supportScore * 0.25)
  return { score: Math.max(0, Math.min(100, score)), risks }
}

/**
 * Main work assessment function
 */
type RadiationAtWork = NonNullable<WorkAnswers["radiationAtWork"]>

// Points off the work score: monitored workers wear a dosimeter and stay well under the 20 mSv
// limit; aircrew fly at 4-5 µSv an hour on long-haul routes (Bagshaw 2008), several mSv a year
// on a full roster; NORM sites and underground radon are often unmonitored.
const WORK_RADIATION_PENALTY: Record<RadiationAtWork, number> = {
  none: 0,
  monitored: 2,
  aircrew: 5,
  norm: 5,
  underground: 6,
  unsure: 2,
}

const WORK_RADIATION_ADVICE: Partial<Record<RadiationAtWork, { risk?: string; rec: string }>> = {
  monitored: {
    risk: "Radiation work: cancer risk rises with dose even at low levels (INWORKS 2023), so your dose record matters",
    rec: "Wear your dosimeter every shift and check your yearly dose record. If you become pregnant, tell your employer early: the EU protects the unborn child like a member of the public.",
  },
  aircrew: {
    risk: "Aircrew get cosmic radiation at 4-5 µSv an hour on long-haul flights (Bagshaw 2008), several mSv a year on a full roster",
    rec: "Ask your airline for your yearly dose record: in the EU it must assess crew doses above 1 mSv a year and use them to plan rosters. If you're pregnant, tell the airline early so the baby's dose stays under 1 mSv.",
  },
  norm: {
    risk: "Industries handling naturally radioactive material (phosphate fertiliser, oil and gas, coal ash, zircon and mineral sands, rare earths, smelting) are on the EU list of sectors that must assess workers' radiation doses",
    rec: "Ask your employer for the radiation dose assessment the EU requires for NORM industries, and use dust control, masks and good hygiene where scale, sludge or dust is handled.",
  },
  underground: {
    risk: "Radon builds up in mines, tunnels, caves and spas; the EU reference level for workplaces is 300 Bq/m³",
    rec: "Ask whether radon has been measured where you work: in the EU, workplaces above 300 Bq/m³ must act to bring it down.",
  },
  unsure: {
    rec: "Not sure about radiation at work? Ask your employer or safety officer: aircrew, medical imaging, nuclear work, NORM industries and underground sites are the usual exposures.",
  },
}

export function calculateWork(answers: WorkAnswers): WorkResult {
  const { base, skipFull } = getEmploymentBaseScore(answers.employmentStatus)
  const allRisks: string[] = []
  const recommendations: string[] = []

  let scheduleScore = 80
  let burnoutScore = 80
  let demandsScore = 80
  let resourcesScore = 80
  let relationshipsScore = 80
  let securityScore = 80
  let finalScore = base

  // Full assessment for employed/freelancer/entrepreneur
  if (
    answers.employmentStatus === "employed" ||
    answers.employmentStatus === "freelancer" ||
    answers.employmentStatus === "entrepreneur"
  ) {
    const ws = scoreWorkSchedule(answers)
    const bu = scoreBurnout(answers)
    const de = scoreJobDemands(answers)
    const re = scoreJobResources(answers)
    const rl = scoreRelationships(answers)
    const se = scoreJobSecurity(answers)

    scheduleScore = ws.score
    burnoutScore = bu.score
    demandsScore = de.score
    resourcesScore = re.score
    relationshipsScore = rl.score
    securityScore = se.score

    allRisks.push(...ws.risks, ...bu.risks, ...de.risks, ...re.risks, ...rl.risks, ...se.risks)

    // Weighted composite (based on COPSOQ III factor weights and health impact research)
    finalScore = Math.round(
      scheduleScore * 0.12 +
      burnoutScore * 0.22 +
      demandsScore * 0.15 +
      resourcesScore * 0.18 +
      relationshipsScore * 0.20 +
      securityScore * 0.13
    )

    const radiation = answers.radiationAtWork ?? "none"
    finalScore = Math.max(0, finalScore - (WORK_RADIATION_PENALTY[radiation] ?? 0))
    const radiationAdvice = WORK_RADIATION_ADVICE[radiation]
    if (radiationAdvice?.risk) allRisks.push(radiationAdvice.risk)
    if (radiationAdvice) recommendations.push(radiationAdvice.rec)

    // Generate recommendations based on lowest scores
    const scores = [
      { name: "schedule", score: scheduleScore, rec: "Consider negotiating reduced hours, flexible scheduling, or remote work options where possible." },
      { name: "burnout", score: burnoutScore, rec: "Prioritize recovery time, set boundaries, and consider speaking with a professional about stress management." },
      { name: "demands", score: demandsScore, rec: "Discuss workload distribution with your supervisor. Identify tasks that can be delegated or deprioritized." },
      { name: "resources", score: resourcesScore, rec: "Seek clarity on role expectations and pursue development opportunities. Request more autonomy where feasible." },
      { name: "relationships", score: relationshipsScore, rec: "Build supportive relationships with colleagues. If facing harassment, document incidents and use reporting channels." },
      { name: "security", score: securityScore, rec: "If job security is a concern, explore skills development and networking to improve employability." },
    ].sort((a, b) => a.score - b.score)

    // Add recommendations for lowest 2 areas if below threshold
    for (let i = 0; i < 2; i++) {
      if (scores[i].score < 60) {
        recommendations.push(scores[i].rec)
      }
    }
  }
  // Unemployment assessment
  else if (answers.employmentStatus === "unemployed") {
    const un = scoreUnemployment(answers)
    burnoutScore = un.score
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
    burnoutScore = ret.score
    allRisks.push(...ret.risks)
    finalScore = ret.score

    if (ret.score < 70) {
      recommendations.push("Explore hobbies, volunteering, or part-time activities to maintain purpose and social engagement.")
    }
  }
  // Student assessment
  else if (answers.employmentStatus === "student") {
    const stu = scoreStudent(answers)
    burnoutScore = stu.score
    allRisks.push(...stu.risks)
    finalScore = stu.score

    if (stu.score < 60) {
      recommendations.push("Balance study with breaks, exercise, and social activities. Use campus mental health resources if needed.")
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

  if (finalScore >= 80 && recommendations.length === 0) {
    recommendations.push("Your work-life profile is healthy. Continue maintaining this balance.")
  }

  return {
    overallScore: Math.max(0, Math.min(100, finalScore)),
    category,
    subScores: {
      schedule: scheduleScore,
      burnout: burnoutScore,
      demands: demandsScore,
      resources: resourcesScore,
      relationships: relationshipsScore,
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

// Question metadata for UI rendering
export const WORK_STRESS_QUESTIONS = {
  // Burnout (CBI/MBI)
  workExhaustion: {
    label: "How often do you feel physically or emotionally exhausted from work?",
    source: "Copenhagen Burnout Inventory",
    domain: "Burnout",
  },
  workOverwhelm: {
    label: "How often do you feel overwhelmed by your workload?",
    source: "Copenhagen Burnout Inventory",
    domain: "Burnout",
  },
  cynicism: {
    label: "How often do you feel cynical or detached about your work?",
    source: "Maslach Burnout Inventory",
    domain: "Burnout",
  },
  
  // Job Demands (COPSOQ III)
  quantitativeDemands: {
    label: "How often do you have too much to do or work under time pressure?",
    source: "COPSOQ III",
    domain: "Job Demands",
  },
  emotionalDemands: {
    label: "How often does your work involve emotionally demanding situations or require hiding your feelings?",
    source: "COPSOQ III",
    domain: "Job Demands",
  },
  cognitiveDemands: {
    label: "How often does your work require intense concentration or making complex decisions?",
    source: "COPSOQ III",
    domain: "Job Demands",
  },
  
  // Job Resources (COPSOQ III, Karasek)
  jobControl: {
    label: "How much influence do you have over your work tasks, methods, and pace?",
    source: "COPSOQ III / Karasek JDC",
    domain: "Job Resources",
    options: [
      { value: "very-high", label: "Very high - I have significant autonomy" },
      { value: "high", label: "High - I have good control over my work" },
      { value: "moderate", label: "Moderate - Some flexibility" },
      { value: "low", label: "Low - Limited control over tasks" },
      { value: "very-low", label: "Very low - No say in how I do my work" },
    ],
  },
  roleClarity: {
    label: "How clear are your work responsibilities and what is expected of you?",
    source: "COPSOQ III",
    domain: "Job Resources",
    options: [
      { value: "very-clear", label: "Very clear - I know exactly what's expected" },
      { value: "clear", label: "Clear - Well-defined responsibilities" },
      { value: "somewhat-clear", label: "Somewhat clear - Mostly defined" },
      { value: "unclear", label: "Unclear - Often unsure of expectations" },
      { value: "very-unclear", label: "Very unclear - Constantly confused" },
    ],
  },
  meaningOfWork: {
    label: "How meaningful and purposeful does your work feel?",
    source: "COPSOQ III",
    domain: "Job Resources",
    options: [
      { value: "very-meaningful", label: "Very meaningful - My work matters" },
      { value: "meaningful", label: "Meaningful - Generally purposeful" },
      { value: "somewhat", label: "Somewhat meaningful" },
      { value: "little", label: "Little meaning - Just a job" },
      { value: "none", label: "No meaning - Feels pointless" },
    ],
  },
  possibilitiesForDevelopment: {
    label: "What opportunities do you have for learning and professional development?",
    source: "COPSOQ III",
    domain: "Job Resources",
    options: [
      { value: "excellent", label: "Excellent - Many growth opportunities" },
      { value: "good", label: "Good - Regular development available" },
      { value: "moderate", label: "Moderate - Some opportunities" },
      { value: "limited", label: "Limited - Few chances to learn" },
      { value: "none", label: "None - No development offered" },
    ],
  },
  
  // Interpersonal (COPSOQ III, EU-OSHA, ILO)
  socialSupportColleagues: {
    label: "How often can you count on support and help from your colleagues?",
    source: "COPSOQ III",
    domain: "Workplace Relationships",
  },
  socialSupportSupervisor: {
    label: "How often can you count on support and help from your supervisor/manager?",
    source: "COPSOQ III / JDC-S",
    domain: "Workplace Relationships",
  },
  qualityOfLeadership: {
    label: "How would you rate the quality of leadership and management in your workplace?",
    source: "COPSOQ III",
    domain: "Workplace Relationships",
    options: [
      { value: "excellent", label: "Excellent - Inspiring, supportive leadership" },
      { value: "good", label: "Good - Generally effective management" },
      { value: "adequate", label: "Adequate - Acceptable leadership" },
      { value: "poor", label: "Poor - Ineffective or unhelpful" },
      { value: "very-poor", label: "Very poor - Toxic or harmful" },
    ],
  },
  organizationalJustice: {
    label: "Are decisions at your workplace made in a fair and transparent way?",
    source: "COPSOQ III",
    domain: "Workplace Relationships",
    options: [
      { value: "always-fair", label: "Always fair - Transparent and equitable" },
      { value: "usually-fair", label: "Usually fair - Most decisions are just" },
      { value: "sometimes-fair", label: "Sometimes fair - Inconsistent" },
      { value: "rarely-fair", label: "Rarely fair - Often unjust" },
      { value: "never-fair", label: "Never fair - Completely opaque/unfair" },
    ],
  },
  recognition: {
    label: "Do you feel appropriately recognized and appreciated for your work efforts?",
    source: "COPSOQ III / Siegrist ERI",
    domain: "Workplace Relationships",
    options: [
      { value: "well-recognized", label: "Well recognized - Appreciated and valued" },
      { value: "fairly-recognized", label: "Fairly recognized - Usually acknowledged" },
      { value: "somewhat", label: "Somewhat - Occasional recognition" },
      { value: "under-recognized", label: "Under-recognized - Rarely appreciated" },
      { value: "not-recognized", label: "Not recognized - Efforts ignored" },
    ],
  },
  workplaceConflict: {
    label: "How often do you experience conflicts with colleagues or supervisors?",
    source: "EU-OSHA / ILO",
    domain: "Workplace Relationships",
  },
  bullyingExposure: {
    label: "Have you been exposed to bullying, harassment, or hostile behavior at work?",
    source: "EU-OSHA / COPSOQ III",
    domain: "Workplace Relationships",
    options: [
      { value: "never", label: "Never - No exposure" },
      { value: "rarely", label: "Rarely - Once or twice, not serious" },
      { value: "occasionally", label: "Occasionally - A few times" },
      { value: "frequently", label: "Frequently - Regular occurrences" },
      { value: "constantly", label: "Constantly - Ongoing serious issue" },
    ],
  },
  senseOfCommunity: {
    label: "How strong is the sense of community and team cohesion at your workplace?",
    source: "COPSOQ III",
    domain: "Workplace Relationships",
    options: [
      { value: "very-strong", label: "Very strong - Great team spirit" },
      { value: "strong", label: "Strong - Good camaraderie" },
      { value: "moderate", label: "Moderate - Some cohesion" },
      { value: "weak", label: "Weak - Little team feeling" },
      { value: "none", label: "None - Isolated, no community" },
    ],
  },
  workLifeConflict: {
    label: "How often does your work interfere with your personal or family life?",
    source: "COPSOQ III",
    domain: "Work-Life Interface",
  },
  
  // Job Security (COPSOQ III, Siegrist)
  jobSecurity: {
    label: "How secure do you feel about keeping your current job?",
    source: "COPSOQ III",
    domain: "Job Security",
    options: [
      { value: "very-secure", label: "Very secure - No concerns" },
      { value: "secure", label: "Secure - Relatively stable" },
      { value: "uncertain", label: "Uncertain - Some doubt" },
      { value: "insecure", label: "Insecure - Worried about losing it" },
      { value: "very-insecure", label: "Very insecure - Expect to lose it" },
    ],
  },
  jobInsecurityConditions: {
    label: "How worried are you about unwanted changes to your working conditions?",
    source: "COPSOQ III",
    domain: "Job Security",
    options: [
      { value: "not-worried", label: "Not worried - Stable conditions" },
      { value: "slightly-worried", label: "Slightly worried - Minor concerns" },
      { value: "somewhat-worried", label: "Somewhat worried - Moderate concerns" },
      { value: "worried", label: "Worried - Significant concerns" },
      { value: "very-worried", label: "Very worried - Major changes expected" },
    ],
  },
  effortRewardBalance: {
    label: "Considering your efforts at work, do you feel fairly rewarded (salary, recognition, security, promotion)?",
    source: "Siegrist ERI Model",
    domain: "Job Security",
    options: [
      { value: "well-rewarded", label: "Well rewarded - More than fair" },
      { value: "fairly-rewarded", label: "Fairly rewarded - Balanced" },
      { value: "neutral", label: "Neutral - About right" },
      { value: "under-rewarded", label: "Under-rewarded - Deserve more" },
      { value: "very-under-rewarded", label: "Very under-rewarded - Significant imbalance" },
    ],
  },
} as const
