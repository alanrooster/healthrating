/**
 * Personality & Outlook assessment.
 *
 * Evidence base:
 * - Optimism (LOT-R): Lee et al. 2019 PNAS (top-quartile optimists 11-15% longer lifespan;
 *   ~50-70% higher chance of reaching age 85)
 * - Conscientiousness: Jokela et al. 2013, Am J Epidemiol (76,150 adults in 7 cohorts: the
 *   lowest third of conscientiousness carries 37% higher mortality, HR 1.37); reviewed in
 *   Friedman & Kern 2014
 * - Internal locus of control: Roddenberry & Renk 2010; Lefcourt - associated with better
 *   health behaviors
 * - Forgiveness: Toussaint et al. 2012, J Behav Med (US adults aged 66+: forgiving others only
 *   on conditions predicted higher mortality)
 * - Humor: Romundstad et al. 2016, Psychosom Med (HUNT study, n = 53,556: a high cognitive
 *   sense of humour went with 48% lower mortality in women, HR 0.52, and fewer infection deaths
 *   in both sexes, HR 0.17 in women and 0.26 in men; no all-cause difference in men)
 *
 * Self-report approach uses validated short-form items (LOT-R subset, mini-IPIP-C, etc.).
 * This is an educational, non-diagnostic instrument.
 */

export interface PersonalityAnswers {
  // Optimism (LOT-R short, 1-5 agreement)
  // "In uncertain times, I usually expect the best."
  optimism_expectBest: 1 | 2 | 3 | 4 | 5
  // "If something can go wrong for me, it will." (REVERSED)
  optimism_expectWorst: 1 | 2 | 3 | 4 | 5
  // "I'm always optimistic about my future."
  optimism_future: 1 | 2 | 3 | 4 | 5
  // "I rarely count on good things happening to me." (REVERSED)
  optimism_rareGood: 1 | 2 | 3 | 4 | 5

  // Conscientiousness (mini-IPIP-C, 1-5)
  // "I get chores done right away."
  consc_chores: 1 | 2 | 3 | 4 | 5
  // "I often forget to put things back in their proper place." (REVERSED)
  consc_disorganized: 1 | 2 | 3 | 4 | 5
  // "I like order."
  consc_order: 1 | 2 | 3 | 4 | 5
  // "I make a mess of things." (REVERSED)
  consc_mess: 1 | 2 | 3 | 4 | 5

  // Locus of control (Rotter-style, 1-5)
  // "What happens to me is mostly the result of my own actions."
  control_internal: 1 | 2 | 3 | 4 | 5
  // "Many things in my life are beyond my control." (REVERSED)
  control_external: 1 | 2 | 3 | 4 | 5

  // Forgiveness
  // "How easily do you forgive others who have wronged you?"
  forgiveness_others: "very-easily" | "easily" | "moderate" | "difficult" | "very-difficult"
  // "How often do you hold grudges?"
  forgiveness_grudges: "never" | "rarely" | "sometimes" | "often" | "always"

  // Humor / laughter
  // "How often do you laugh out loud?"
  humor_laughFrequency: "many-daily" | "daily" | "weekly" | "monthly" | "rarely"
  // "How often do you find humor in difficult situations?"
  humor_inDifficulty: "always" | "often" | "sometimes" | "rarely" | "never"
}

export interface PersonalityResult {
  overallScore: number
  subScores: {
    optimism: number
    conscientiousness: number
    locusOfControl: number
    forgiveness: number
    humor: number
  }
  strengths: string[]
  growthAreas: string[]
  recommendations: string[]
}

function avgLikert(values: number[]): number {
  const sum = values.reduce((a, b) => a + b, 0)
  // Convert 1-5 average to 0-100
  return ((sum / values.length - 1) / 4) * 100
}

function reverseLikert(v: number): number {
  return 6 - v
}

export function calculatePersonality(a: PersonalityAnswers): PersonalityResult {
  // Optimism (reverse 2 items)
  const optimism = avgLikert([
    a.optimism_expectBest,
    reverseLikert(a.optimism_expectWorst),
    a.optimism_future,
    reverseLikert(a.optimism_rareGood),
  ])

  // Conscientiousness (reverse 2 items)
  const conscientiousness = avgLikert([
    a.consc_chores,
    reverseLikert(a.consc_disorganized),
    a.consc_order,
    reverseLikert(a.consc_mess),
  ])

  // Locus of control (reverse 1 item)
  const locusOfControl = avgLikert([
    a.control_internal,
    reverseLikert(a.control_external),
  ])

  // Forgiveness
  const forgivenessMap: Record<string, number> = {
    "very-easily": 100,
    easily: 85,
    moderate: 60,
    difficult: 35,
    "very-difficult": 15,
  }
  const grudgeMap: Record<string, number> = {
    never: 100,
    rarely: 85,
    sometimes: 60,
    often: 30,
    always: 10,
  }
  const forgiveness = (forgivenessMap[a.forgiveness_others] + grudgeMap[a.forgiveness_grudges]) / 2

  // Humor
  const laughMap: Record<string, number> = {
    "many-daily": 100,
    daily: 85,
    weekly: 60,
    monthly: 35,
    rarely: 15,
  }
  const humorMap: Record<string, number> = {
    always: 100,
    often: 85,
    sometimes: 60,
    rarely: 35,
    never: 15,
  }
  const humor = (laughMap[a.humor_laughFrequency] + humorMap[a.humor_inDifficulty]) / 2

  // Composite weights aligned with effect-size magnitudes
  const overallScore = Math.round(
    optimism * 0.30 +
    conscientiousness * 0.25 +
    locusOfControl * 0.18 +
    forgiveness * 0.14 +
    humor * 0.13
  )

  const strengths: string[] = []
  const growthAreas: string[] = []

  if (optimism >= 75) strengths.push("High optimism (top-quartile optimists live 11-15% longer, Lee 2019)")
  else if (optimism < 50) growthAreas.push("Lower optimism - associated with worse cardiovascular outcomes")

  if (conscientiousness >= 75) strengths.push("High conscientiousness (low conscientiousness carries 37% higher mortality, Jokela 2013)")
  else if (conscientiousness < 50) growthAreas.push("Lower conscientiousness can predict less consistent health behaviors")

  if (locusOfControl >= 75) strengths.push("Internal locus of control supports proactive health behaviors")
  else if (locusOfControl < 50) growthAreas.push("External locus of control associated with lower self-care engagement")

  if (forgiveness >= 75) strengths.push("Strong forgiveness disposition (linked to lower mortality in adults over 65, Toussaint 2012)")
  else if (forgiveness < 50) growthAreas.push("Holding grudges sustains stress responses harmful to cardiovascular health")

  if (humor >= 75) strengths.push("Strong sense of humour (48% lower mortality in women and fewer infection deaths in both sexes, Romundstad 2016)")

  const recommendations: string[] = []
  if (optimism < 60) recommendations.push("Cognitive-behavioral practices (e.g. 'Best Possible Self' exercise) reliably increase optimism.")
  if (conscientiousness < 60) recommendations.push("Implementation intentions ('When X, I will do Y') help build conscientious habits.")
  if (locusOfControl < 60) recommendations.push("Identify one health domain you can fully control this month - small wins build internal locus.")
  if (forgiveness < 60) recommendations.push("REACH Forgiveness model (Worthington) is a validated intervention for letting go of grudges.")
  if (humor < 60) recommendations.push("Schedule regular doses of comedy, play, and time with people who make you laugh.")

  recommendations.push("Personality traits are partially modifiable; small consistent changes compound over decades.")

  return {
    overallScore: Math.max(0, Math.min(100, overallScore)),
    subScores: {
      optimism: Math.round(optimism),
      conscientiousness: Math.round(conscientiousness),
      locusOfControl: Math.round(locusOfControl),
      forgiveness: Math.round(forgiveness),
      humor: Math.round(humor),
    },
    strengths,
    growthAreas,
    recommendations,
  }
}
