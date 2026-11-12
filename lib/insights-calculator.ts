/**
 * Insights Calculator
 *
 * Derives two dashboard insights from the completed module scores:
 * - Action Plan: the 3 modules with the most room to improve, weighted by each module's share of
 *   the overall score.
 * - Peer Comparison: a percentile band for the overall score. The bands are a modelling
 *   assumption (see calculatePeerComparison).
 *
 * Cardiovascular health is scored in lib/cardiovascular-health.ts (Life's Essential 8).
 */

import { MODULE_WEIGHTS, type HealthScores } from "./health-score"

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
  lifeContext: "Strengthen relationships, financial security, and community involvement: each is linked to differences of years in life expectancy.",
  personality: "Cultivate optimism, conscientiousness, and forgiveness: these traits are linked to longer life.",
  homeEnvironment: "Swap scratched nonstick & plastic for glass/steel, use low-VOC cleaners, and ventilate (radon test, range hood).",
}

/**
 * Action Plan - rank up to 3 modules with the largest improvement headroom,
 * weighted by their share of the overall health score.
 */
export function buildActionPlan(scores: HealthScores): ActionItem[] {
  const items: ActionItem[] = []

  for (const key of Object.keys(scores) as Array<keyof HealthScores>) {
    const m = scores[key]
    if (!m.completed) continue
    if (key === "familyHistory") continue // not actionable

    const headroom = Math.max(0, 100 - m.score)
    // Ranking value only (not shown as years): headroom x the module's weight x 0.05
    const potentialGain = headroom * MODULE_WEIGHTS[key] * 0.05

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
 * Peer comparison: places the overall score in a percentile band. The bands are a modelling
 * assumption. No population sample has taken this questionnaire, so how scores are spread among
 * peers is not measured, and the card says so.
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
    message = "An exceptional overall profile, in our estimated top 5%."
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
    message = "A below-average profile, with clear room to improve."
  } else {
    percentile = 15
    band = "Bottom 15%"
    message = "Several risk factors warrant attention. Consider professional guidance."
  }

  return { percentile, band, message }
}
