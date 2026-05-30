/**
 * Insights Calculator
 *
 * Derives high-level insights from completed module scores:
 * - Cardiovascular Risk Score (10-year qualitative band) inspired by
 *   ASCVD / Framingham principles, adapted to use modifiable lifestyle
 *   factors already collected in this app.
 * - Action Plan: top 3 highest-impact improvements ranked by
 *   estimated life-expectancy gain and module weight.
 * - Peer Comparison: rough age-matched percentile based on overall score.
 *
 * Notes:
 * - These are educational estimates, not clinical risk scores. They do
 *   not replace validated tools like ASCVD, QRISK3, or Framingham, which
 *   require lab values (cholesterol, HbA1c, BP).
 */

import type { HealthScores } from "./health-score"

export type RiskBand = "low" | "borderline" | "intermediate" | "high"

export interface CardiovascularRisk {
  band: RiskBand
  label: string
  estimate: string
  drivers: string[]
}

export interface ActionItem {
  module: keyof HealthScores
  label: string
  currentScore: number
  potentialGain: number
  recommendation: string
}

export interface PeerComparison {
  percentile: number
  band: string
  message: string
}

const MODULE_LABELS: Record<keyof HealthScores, string> = {
  body: "Body Composition",
  airQuality: "Air Quality",
  waterQuality: "Water Quality",
  diet: "Diet",
  exercise: "Exercise",
  work: "Work Environment",
  lifestyle: "Lifestyle",
  mentalHealth: "Mental Health",
  familyHistory: "Family History",
  preventiveCare: "Preventive Care",
  sensesOral: "Senses & Oral Health",
  lifeContext: "Life Context",
  personality: "Personality & Outlook",
  homeEnvironment: "Home Environment",
}

const ACTION_RECOMMENDATIONS: Record<keyof HealthScores, string> = {
  body: "Aim for a healthy waist-to-height ratio (<0.5) through balanced nutrition and consistent activity.",
  airQuality: "Use HEPA filtration indoors and limit outdoor exertion on high-pollution days.",
  waterQuality: "Use a certified filter (NSF 53/58) and stay properly hydrated.",
  diet: "Emphasize vegetables, whole grains, legumes, and minimize ultra-processed foods.",
  exercise: "Target 150+ minutes/week moderate activity plus 2 strength sessions.",
  work: "Optimize ergonomics, take movement breaks, and protect work-life boundaries.",
  lifestyle: "Prioritize sleep, social connection, and reduce sedentary time and harmful habits.",
  mentalHealth: "Practice stress management, cultivate purpose, and seek support when distressed.",
  familyHistory: "Share family history with your doctor to personalize screening intervals.",
  preventiveCare: "Catch up on screenings, vaccinations, dental and eye exams.",
  sensesOral: "Treat hearing/vision issues early and maintain daily oral hygiene.",
  lifeContext: "Strengthen relationships, financial security, and community involvement - these have multi-year longevity effects.",
  personality: "Cultivate optimism, conscientiousness, and forgiveness - these traits add measurable years.",
  homeEnvironment: "Swap scratched nonstick & plastic for glass/steel, use low-VOC cleaners, and ventilate (radon test, range hood).",
}

/**
 * Cardiovascular risk - simplified qualitative band.
 * Based on which protective factors are present/absent.
 * NOT a substitute for lab-based ASCVD/QRISK3.
 */
export function calculateCardiovascularRisk(scores: HealthScores): CardiovascularRisk {
  const drivers: string[] = []

  // Weighted CV-relevant factors (each 0-100, undefined if not completed)
  const factors: Array<{ key: keyof HealthScores; weight: number }> = [
    { key: "body", weight: 0.20 },           // BMI / waist
    { key: "exercise", weight: 0.18 },       // physical activity
    { key: "diet", weight: 0.16 },           // diet quality
    { key: "lifestyle", weight: 0.18 },      // smoking/alcohol/sleep
    { key: "mentalHealth", weight: 0.10 },   // chronic stress
    { key: "airQuality", weight: 0.08 },     // PM2.5 exposure
    { key: "familyHistory", weight: 0.06 },  // genetic predisposition
    { key: "preventiveCare", weight: 0.04 }, // BP/cholesterol screening
  ]

  let weightedSum = 0
  let totalWeight = 0
  for (const f of factors) {
    const m = scores[f.key]
    if (m.completed) {
      weightedSum += m.score * f.weight
      totalWeight += f.weight
      if (m.score < 50) drivers.push(MODULE_LABELS[f.key])
    }
  }

  if (totalWeight === 0) {
    return {
      band: "intermediate",
      label: "Insufficient Data",
      estimate: "Complete more assessments for an estimated risk band.",
      drivers: [],
    }
  }

  const composite = weightedSum / totalWeight

  let band: RiskBand
  let label: string
  let estimate: string

  if (composite >= 80) {
    band = "low"
    label = "Low Risk"
    estimate = "Your modifiable risk factors suggest below-average 10-year cardiovascular risk."
  } else if (composite >= 65) {
    band = "borderline"
    label = "Borderline"
    estimate = "Risk factors are mostly favorable but a few areas could improve."
  } else if (composite >= 50) {
    band = "intermediate"
    label = "Intermediate"
    estimate = "Several risk factors warrant attention; consider discussing with a clinician."
  } else {
    band = "high"
    label = "Elevated"
    estimate = "Multiple cardiovascular risk factors elevated; clinical evaluation recommended."
  }

  return { band, label, estimate, drivers: drivers.slice(0, 4) }
}

/**
 * Action Plan - rank up to 3 modules with the largest improvement headroom,
 * weighted by their impact on overall health and life expectancy.
 */
const IMPACT_WEIGHTS: Record<keyof HealthScores, number> = {
  body: 0.13,
  airQuality: 0.06,
  waterQuality: 0.05,
  diet: 0.13,
  exercise: 0.10,
  work: 0.08,
  lifestyle: 0.12,
  mentalHealth: 0.15,
  familyHistory: 0.06,
  preventiveCare: 0.06,
  sensesOral: 0.04,
  lifeContext: 0.06,
  personality: 0.05,
  homeEnvironment: 0.04,
}

export function buildActionPlan(scores: HealthScores): ActionItem[] {
  const items: ActionItem[] = []

  for (const key of Object.keys(scores) as Array<keyof HealthScores>) {
    const m = scores[key]
    if (!m.completed) continue
    if (key === "familyHistory") continue // not actionable

    const headroom = Math.max(0, 100 - m.score)
    // Estimated life-expectancy gain proxy: headroom * weight * 0.05 (years)
    const potentialGain = headroom * IMPACT_WEIGHTS[key] * 0.05

    if (m.score < 90) {
      items.push({
        module: key,
        label: MODULE_LABELS[key],
        currentScore: m.score,
        potentialGain: Math.round(potentialGain * 10) / 10,
        recommendation: ACTION_RECOMMENDATIONS[key],
      })
    }
  }

  items.sort((a, b) => b.potentialGain - a.potentialGain)
  return items.slice(0, 3)
}

/**
 * Peer comparison - approximate percentile relative to general population
 * using overall composite score. Rough mapping based on observed score
 * distributions in self-reported health surveys.
 */
export function calculatePeerComparison(overallScore: number, completedCount: number): PeerComparison {
  if (completedCount < 3) {
    return {
      percentile: 0,
      band: "Pending",
      message: "Complete at least 3 assessments to see how you compare.",
    }
  }

  let percentile: number
  let band: string
  let message: string

  if (overallScore >= 85) {
    percentile = 95
    band = "Top 5%"
    message = "Your overall health profile is in the top 5% — exceptional."
  } else if (overallScore >= 75) {
    percentile = 85
    band = "Top 15%"
    message = "Above-average health profile compared to peers."
  } else if (overallScore >= 65) {
    percentile = 65
    band = "Top 35%"
    message = "Slightly above the average health profile."
  } else if (overallScore >= 55) {
    percentile = 50
    band = "Average"
    message = "Around the average for self-assessed health metrics."
  } else if (overallScore >= 45) {
    percentile = 30
    band = "Below Average"
    message = "Below-average profile — meaningful improvement opportunities exist."
  } else {
    percentile = 15
    band = "Bottom 15%"
    message = "Several risk factors warrant attention. Consider professional guidance."
  }

  return { percentile, band, message }
}
