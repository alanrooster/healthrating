export interface ModuleScore {
  score: number // 0-100
  completed: boolean
  label: string
}

export interface HealthScores {
  body: ModuleScore
  airQuality: ModuleScore
  waterQuality: ModuleScore
  diet: ModuleScore
  exercise: ModuleScore
  work: ModuleScore
  lifestyle: ModuleScore
  mentalHealth: ModuleScore
  familyHistory: ModuleScore
  preventiveCare: ModuleScore
  sensesOral: ModuleScore
  lifeContext: ModuleScore
  personality: ModuleScore
}

export interface OverallHealthResult {
  overallScore: number
  letterGrade: string
  completedCount: number
  totalModules: number
  scores: HealthScores
  summary: string
}

const WEIGHTS = {
  body: 0.12,
  airQuality: 0.05,
  waterQuality: 0.04,
  diet: 0.12,
  exercise: 0.10,
  work: 0.07,
  lifestyle: 0.11,
  mentalHealth: 0.13,
  familyHistory: 0.05,
  preventiveCare: 0.06,
  sensesOral: 0.04,
  lifeContext: 0.06,
  personality: 0.05,
}

/**
 * Convert a composite BMI score into a 0-100 health score.
 * 18.5-24.9 maps to 100, scaling down for deviation.
 */
export function bmiToHealthScore(compositeScore: number): number {
  const idealMid = 21.7
  const idealRange = 3.2 // half-width of healthy range

  if (compositeScore >= 18.5 && compositeScore <= 24.9) {
    // Within healthy range: 85-100
    const distFromCenter = Math.abs(compositeScore - idealMid)
    return Math.round(100 - (distFromCenter / idealRange) * 15)
  }

  if (compositeScore < 18.5) {
    // Underweight: scale from 80 down to 30
    const severity = (18.5 - compositeScore) / 5
    return Math.round(Math.max(30, 80 - severity * 50))
  }

  // Overweight/obese: scale from 80 down to 10
  if (compositeScore <= 29.9) {
    // Overweight (25-29.9): 60-80
    const t = (compositeScore - 25) / 5
    return Math.round(80 - t * 20)
  }
  if (compositeScore <= 34.9) {
    // Obese I (30-34.9): 35-60
    const t = (compositeScore - 30) / 5
    return Math.round(60 - t * 25)
  }
  if (compositeScore <= 39.9) {
    // Obese II (35-39.9): 15-35
    const t = (compositeScore - 35) / 5
    return Math.round(35 - t * 20)
  }
  // Obese III (40+)
  return Math.max(5, Math.round(15 - ((compositeScore - 40) / 10) * 10))
}

export function getLetterGrade(score: number): string {
  if (score >= 90) return "A"
  if (score >= 75) return "B"
  if (score >= 60) return "C"
  if (score >= 40) return "D"
  return "F"
}

function getGradeColor(grade: string): string {
  switch (grade) {
    case "A":
      return "text-[hsl(var(--success))]"
    case "B":
      return "text-[hsl(var(--primary))]"
    case "C":
      return "text-[hsl(var(--warning))]"
    case "D":
      return "text-[hsl(var(--accent))]"
    default:
      return "text-[hsl(var(--destructive))]"
  }
}

export { getGradeColor }

export function calculateOverallHealth(scores: HealthScores): OverallHealthResult {
  const modules = Object.entries(scores) as [keyof HealthScores, ModuleScore][]
  const completed = modules.filter(([, m]) => m.completed)
  const completedCount = completed.length

  if (completedCount === 0) {
    return {
      overallScore: 0,
      letterGrade: "-",
      completedCount: 0,
      totalModules: 13,
      scores,
      summary: "Complete at least one assessment to see your health score.",
    }
  }

  // Re-normalize weights among completed modules only
  const totalWeight = completed.reduce((sum, [key]) => sum + WEIGHTS[key], 0)
  const overallScore = Math.round(
    completed.reduce((sum, [key, m]) => sum + (WEIGHTS[key] / totalWeight) * m.score, 0)
  )

  const letterGrade = getLetterGrade(overallScore)

  const summaries: Record<string, string> = {
    A: "Excellent overall health profile. Keep up your healthy lifestyle.",
    B: "Good health profile with some areas for improvement.",
    C: "Average health profile. Focus on the areas with lower scores.",
    D: "Below average. Significant improvements needed in multiple areas.",
    F: "Poor health profile. Consider consulting a healthcare professional.",
  }

  return {
    overallScore,
    letterGrade,
    completedCount,
    totalModules: 11,
    scores,
    summary: summaries[letterGrade] || "",
  }
}

export function getScoreColor(score: number): string {
  if (score >= 85) return "hsl(var(--success))"
  if (score >= 70) return "hsl(var(--primary))"
  if (score >= 50) return "hsl(var(--warning))"
  if (score >= 30) return "hsl(var(--accent))"
  return "hsl(var(--destructive))"
}
