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
  score: number // 0-100
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
  const meetsWHOGuideline = totalMETMinutes >= 600

  let feedback: string
  if (score >= 85) {
    feedback =
      "Excellent physical activity level! You significantly exceed WHO recommendations. Your active lifestyle provides strong protection against chronic diseases."
  } else if (score >= 60) {
    feedback =
      "Good activity level that meets WHO recommendations. Consider adding more vigorous activity or increasing duration for even greater health benefits."
  } else if (score >= 30) {
    feedback =
      "You are doing some physical activity but not enough to meet WHO recommendations of 150-300 minutes of moderate activity per week. Try to gradually increase your activity."
  } else {
    feedback =
      "Your physical activity level is very low. WHO recommends at least 150 minutes of moderate activity per week. Start with short walks and gradually build up."
  }

  return {
    totalMETMinutes,
    score,
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
  }
}
