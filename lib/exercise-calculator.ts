/**
 * Exercise Assessment based on WHO Global Physical Activity Questionnaire (GPAQ).
 *
 * Scoring uses MET-minutes/week:
 * - Vigorous activity: 8.0 METs
 * - Moderate activity: 4.0 METs
 * - Walking/transport: 3.3 METs
 *
 * WHO Recommendation: At least 150-300 min moderate or 75-150 min vigorous per week
 * (equivalent to 600-1200 MET-minutes/week minimum)
 */

export interface ExerciseInputs {
  // Work-related activity
  workVigDays: number // days/week of vigorous work activity
  workVigMin: number // minutes per day of vigorous work activity
  workModDays: number // days/week of moderate work activity
  workModMin: number // minutes per day of moderate work activity

  // Active transport
  transportDays: number // days/week of walking/cycling for transport
  transportMin: number // minutes per day

  // Recreational activity
  recVigDays: number // days/week of vigorous recreational activity
  recVigMin: number // minutes per day
  recModDays: number // days/week of moderate recreational activity
  recModMin: number // minutes per day

  // Sedentary behavior
  sedentaryHours: number // hours per day sitting

  // Functional fitness (self-report proxies for clinical measures)
  // Studenski et al. 2011 (JAMA): walking speed predicts survival
  // Leong et al. 2015 (Lancet): grip strength predicts mortality (5kg = +16%)
  // Mandsager 2018 (JAMA): cardiorespiratory fitness reduces mortality up to 5x
  stairsCapacity: "easy-4plus" | "ok-4" | "ok-2" | "struggle-1" | "cannot" // 4 flights without stopping
  walkingPace: "very-fast" | "brisk" | "average" | "slow" | "very-slow" // self-reported usual pace
  gripStrength: "very-strong" | "strong" | "average" | "weak" | "very-weak" // jars/groceries proxy
  restingHeartRate: number // bpm at rest (typical: 60-100)
}

export interface ExerciseQuestion {
  id: keyof ExerciseInputs
  question: string
  description: string
  type: "days" | "minutes" | "hours"
  min: number
  max: number
  step: number
  group: string
}

export const EXERCISE_QUESTIONS: ExerciseQuestion[] = [
  // Work
  {
    id: "workVigDays",
    question: "How many days per week do you do vigorous-intensity work?",
    description: "Heavy lifting, digging, construction, carrying heavy loads",
    type: "days",
    min: 0,
    max: 7,
    step: 1,
    group: "Work Activity",
  },
  {
    id: "workVigMin",
    question: "On those days, how many minutes of vigorous work per day?",
    description: "Activities that make you breathe much harder than normal",
    type: "minutes",
    min: 0,
    max: 480,
    step: 10,
    group: "Work Activity",
  },
  {
    id: "workModDays",
    question: "How many days per week do you do moderate-intensity work?",
    description: "Brisk walking, carrying light loads, cleaning, gardening",
    type: "days",
    min: 0,
    max: 7,
    step: 1,
    group: "Work Activity",
  },
  {
    id: "workModMin",
    question: "On those days, how many minutes of moderate work per day?",
    description: "Activities that make you breathe somewhat harder than normal",
    type: "minutes",
    min: 0,
    max: 480,
    step: 10,
    group: "Work Activity",
  },

  // Transport
  {
    id: "transportDays",
    question: "How many days per week do you walk or cycle for transport?",
    description: "Walking or cycling to work, shops, or other places",
    type: "days",
    min: 0,
    max: 7,
    step: 1,
    group: "Active Transport",
  },
  {
    id: "transportMin",
    question: "On those days, how many minutes per day?",
    description: "Total time spent walking or cycling to get places",
    type: "minutes",
    min: 0,
    max: 480,
    step: 5,
    group: "Active Transport",
  },

  // Recreation
  {
    id: "recVigDays",
    question: "How many days per week do you do vigorous recreational activity?",
    description: "Running, swimming fast, competitive sports, heavy cycling",
    type: "days",
    min: 0,
    max: 7,
    step: 1,
    group: "Recreational Activity",
  },
  {
    id: "recVigMin",
    question: "On those days, how many minutes per session?",
    description: "Vigorous sports or fitness activities that make you breathe very hard",
    type: "minutes",
    min: 0,
    max: 300,
    step: 5,
    group: "Recreational Activity",
  },
  {
    id: "recModDays",
    question: "How many days per week do you do moderate recreational activity?",
    description: "Brisk walking, yoga, light cycling, dancing, swimming leisurely",
    type: "days",
    min: 0,
    max: 7,
    step: 1,
    group: "Recreational Activity",
  },
  {
    id: "recModMin",
    question: "On those days, how many minutes per session?",
    description: "Moderate activities that somewhat increase your heart rate",
    type: "minutes",
    min: 0,
    max: 300,
    step: 5,
    group: "Recreational Activity",
  },

  // Sedentary
  {
    id: "sedentaryHours",
    question: "How many hours per day do you spend sitting?",
    description: "Desk work, driving, watching TV, reading, using devices (excluding sleep)",
    type: "hours",
    min: 0,
    max: 18,
    step: 0.5,
    group: "Sedentary Behavior",
  },
]

export interface ExerciseResult {
  totalMETMinutes: number
  score: number // 0-100 composite (activity + functional)
  activityScore: number // 0-100 from MET-minutes
  functionalScore: number // 0-100 from functional fitness markers
  category: string
  feedback: string
  breakdown: {
    workVigorous: number
    workModerate: number
    transport: number
    recVigorous: number
    recModerate: number
    totalMinutesPerWeek: number
  }
  sedentaryPenalty: number
  sedentaryRisk: string
  meetsWHOGuideline: boolean
  functionalFlags: string[]
}

const STAIRS_MAP: Record<string, number> = {
  "easy-4plus": 100,
  "ok-4": 80,
  "ok-2": 55,
  "struggle-1": 25,
  cannot: 0,
}
const WALK_MAP: Record<string, number> = {
  "very-fast": 100,
  brisk: 85,
  average: 60,
  slow: 30,
  "very-slow": 10,
}
const GRIP_MAP: Record<string, number> = {
  "very-strong": 100,
  strong: 80,
  average: 60,
  weak: 30,
  "very-weak": 10,
}

function scoreRestingHeartRate(rhr: number): number {
  // Optimal: 50-65; above 80 raises mortality risk (CARDIA, Whitehall)
  if (rhr <= 0) return 50
  if (rhr < 50) return 90 // very low - athletic, but check for symptoms
  if (rhr <= 65) return 100
  if (rhr <= 75) return 80
  if (rhr <= 85) return 55
  if (rhr <= 95) return 30
  return 10
}

export function calculateExerciseScore(inputs: ExerciseInputs): ExerciseResult {
  const VIGOROUS_MET = 8.0
  const MODERATE_MET = 4.0
  const TRANSPORT_MET = 3.3

  // MET-minutes per week for each domain
  const workVigorous = inputs.workVigDays * inputs.workVigMin * VIGOROUS_MET
  const workModerate = inputs.workModDays * inputs.workModMin * MODERATE_MET
  const transport = inputs.transportDays * inputs.transportMin * TRANSPORT_MET
  const recVigorous = inputs.recVigDays * inputs.recVigMin * VIGOROUS_MET
  const recModerate = inputs.recModDays * inputs.recModMin * MODERATE_MET

  const totalMETMinutes = Math.round(
    workVigorous + workModerate + transport + recVigorous + recModerate
  )

  // Total active minutes per week
  const totalMinutesPerWeek = Math.round(
    inputs.workVigDays * inputs.workVigMin +
      inputs.workModDays * inputs.workModMin +
      inputs.transportDays * inputs.transportMin +
      inputs.recVigDays * inputs.recVigMin +
      inputs.recModDays * inputs.recModMin
  )

  // Base score from MET-minutes
  let baseScore: number
  let category: string

  if (totalMETMinutes < 600) {
    // Insufficient activity
    baseScore = Math.round((totalMETMinutes / 600) * 30)
    category = "Insufficient"
  } else if (totalMETMinutes < 1200) {
    // Meets minimum WHO recommendation
    baseScore = 30 + Math.round(((totalMETMinutes - 600) / 600) * 30)
    category = "Sufficient"
  } else if (totalMETMinutes < 3000) {
    // Active (exceeds minimum recommendation)
    baseScore = 60 + Math.round(((totalMETMinutes - 1200) / 1800) * 25)
    category = "Active"
  } else {
    // Highly active
    baseScore = Math.min(100, 85 + Math.round(((totalMETMinutes - 3000) / 3000) * 15))
    category = "Highly Active"
  }

  // Sedentary behavior penalty
  let sedentaryPenalty = 0
  let sedentaryRisk: string

  if (inputs.sedentaryHours <= 4) {
    sedentaryPenalty = 0
    sedentaryRisk = "Low sedentary time"
  } else if (inputs.sedentaryHours <= 6) {
    sedentaryPenalty = 3
    sedentaryRisk = "Moderate sedentary time"
  } else if (inputs.sedentaryHours <= 8) {
    sedentaryPenalty = 7
    sedentaryRisk = "High sedentary time - try to take movement breaks"
  } else if (inputs.sedentaryHours <= 11) {
    sedentaryPenalty = 12
    sedentaryRisk = "Very high sedentary time - significantly increases health risk"
  } else {
    sedentaryPenalty = 15
    sedentaryRisk = "Extreme sedentary behavior - major health risk regardless of exercise"
  }

  const score = Math.max(0, Math.min(100, baseScore - sedentaryPenalty))
  const activityScore = score
  const meetsWHOGuideline = totalMETMinutes >= 600

  // Functional fitness composite
  const stairs = STAIRS_MAP[inputs.stairsCapacity] ?? 60
  const walk = WALK_MAP[inputs.walkingPace] ?? 60
  const grip = GRIP_MAP[inputs.gripStrength] ?? 60
  const rhr = scoreRestingHeartRate(inputs.restingHeartRate)
  // Weights: stairs 30% (CRF proxy), walk 30% (Studenski), grip 25% (Leong), RHR 15%
  const functionalScore = Math.round(stairs * 0.3 + walk * 0.3 + grip * 0.25 + rhr * 0.15)

  const functionalFlags: string[] = []
  if (inputs.stairsCapacity === "struggle-1" || inputs.stairsCapacity === "cannot") {
    functionalFlags.push(
      "Difficulty climbing stairs suggests low cardiorespiratory fitness - a stronger mortality predictor than smoking (Mandsager 2018)"
    )
  }
  if (inputs.walkingPace === "slow" || inputs.walkingPace === "very-slow") {
    functionalFlags.push(
      "Slow gait speed predicts mortality as strongly as age + sex + chronic conditions combined (Studenski 2011)"
    )
  }
  if (inputs.gripStrength === "weak" || inputs.gripStrength === "very-weak") {
    functionalFlags.push(
      "Low grip strength is a stronger mortality predictor than systolic blood pressure (Leong 2015, Lancet)"
    )
  }
  if (inputs.restingHeartRate >= 80) {
    functionalFlags.push(
      `Resting heart rate of ${inputs.restingHeartRate} bpm is elevated; lower RHR (50-65) is associated with longer life`
    )
  }

  // Composite final score: 70% activity, 30% functional
  const composite = Math.round(activityScore * 0.7 + functionalScore * 0.3)

  let feedback: string
  if (composite >= 85) {
    feedback =
      "Excellent overall fitness! High activity levels combined with strong functional capacity provide major protection against chronic disease."
  } else if (composite >= 60) {
    feedback =
      "Good fitness profile. Consider strengthening any low functional markers (gait, grip, stairs) - these are stronger mortality predictors than activity volume alone."
  } else if (composite >= 30) {
    feedback =
      "Moderate fitness. Both activity and functional capacity matter. Resistance training improves grip, and high-intensity intervals improve cardiorespiratory fitness."
  } else {
    feedback =
      "Low fitness profile. Even small increases in walking pace, stair climbing, and grip strength meaningfully reduce mortality risk."
  }

  return {
    totalMETMinutes,
    score: composite,
    activityScore,
    functionalScore,
    category,
    feedback,
    breakdown: {
      workVigorous: Math.round(workVigorous),
      workModerate: Math.round(workModerate),
      transport: Math.round(transport),
      recVigorous: Math.round(recVigorous),
      recModerate: Math.round(recModerate),
      totalMinutesPerWeek,
    },
    sedentaryPenalty,
    sedentaryRisk,
    meetsWHOGuideline,
    functionalFlags,
  }
}
