/**
 * Mental Health Assessment Calculator
 *
 * Based on three validated, widely-used screening instruments:
 *
 * 1. Kessler Psychological Distress Scale (K10)
 *    - Kessler et al. (2002, 2003): 10-item self-report measure of
 *      non-specific psychological distress over the past 30 days.
 *    - Scores 10-50: 10-19 = likely well, 20-24 = mild distress,
 *      25-29 = moderate distress, 30-50 = severe distress.
 *    - Used in WHO World Mental Health Surveys and Australian
 *      National Health Survey.
 *
 * 2. PHQ-2 (Patient Health Questionnaire - 2 item)
 *    - Kroenke et al. (2003): ultra-brief depression screener.
 *    - Score >= 3 suggests further evaluation for depression.
 *    - Cut-off >= 3: sensitivity 72%, specificity 85% for major depression
 *      (Levis et al. 2020, JAMA IPD meta-analysis; the original study reported 83%/92%).
 *
 * 3. GAD-2 (Generalized Anxiety Disorder - 2 item)
 *    - Kroenke et al. (2007): ultra-brief anxiety screener.
 *    - Score >= 3 suggests further evaluation for anxiety.
 *    - Cut-off >= 3: sensitivity 76%, specificity 81% for GAD
 *      (Plummer et al. 2016 meta-analysis; the original study reported 86%/83%).
 *
 * Additional items:
 * - Four wellbeing items adapted from the WHO-5 Well-Being Index (4 of its 5 items, on a 5-point
 *   scale over 30 days, so the WHO-5 cut-off is indicative only)
 * - Cognitive engagement: high cognitive activity carries RR 0.61 for dementia in LIBRA2
 *   (Rosenau et al., Alzheimers Dement 2024), and the 2024 Lancet Commission recommends
 *   cognitively stimulating activity in midlife
 * - Purpose in life (Hill & Turiano 2014; Alimujiang et al. 2019)
 *
 * IMPORTANT DISCLAIMER: This is a screening tool only and does NOT
 * constitute diagnosis. Users scoring in concerning ranges should
 * be directed to professional help.
 */

// All questions use the past-30-days timeframe for consistency with K10
export type FrequencyResponse = "none" | "a-little" | "some" | "most" | "all"
export type PhqFrequency = "not-at-all" | "several-days" | "more-than-half" | "nearly-every-day"

export interface MentalHealthAnswers {
  // K10 - Kessler Psychological Distress Scale (10 items)
  // "During the past 30 days, about how often did you feel..."
  k10_tired: FrequencyResponse          // "...tired out for no good reason?"
  k10_nervous: FrequencyResponse         // "...nervous?"
  k10_soNervous: FrequencyResponse       // "...so nervous that nothing could calm you down?"
  k10_hopeless: FrequencyResponse        // "...hopeless?"
  k10_restless: FrequencyResponse        // "...restless or fidgety?"
  k10_soRestless: FrequencyResponse      // "...so restless you could not sit still?"
  k10_depressed: FrequencyResponse       // "...depressed?"
  k10_soDepressed: FrequencyResponse     // "...so depressed that nothing could cheer you up?"
  k10_everything: FrequencyResponse      // "...that everything was an effort?"
  k10_worthless: FrequencyResponse       // "...worthless?"

  // PHQ-2 - Depression screener
  // "Over the last 2 weeks, how often have you been bothered by..."
  phq2_interest: PhqFrequency            // "...little interest or pleasure in doing things?"
  phq2_depressed: PhqFrequency           // "...feeling down, depressed, or hopeless?"

  // GAD-2 - Anxiety screener
  // "Over the last 2 weeks, how often have you been bothered by..."
  gad2_anxious: PhqFrequency             // "...feeling nervous, anxious, or on edge?"
  gad2_worry: PhqFrequency               // "...not being able to stop or control worrying?"

  // Resilience & well-being (WHO-5 inspired)
  wellbeing_cheerful: FrequencyResponse   // "...cheerful and in good spirits?"
  wellbeing_calm: FrequencyResponse       // "...calm and relaxed?"
  wellbeing_active: FrequencyResponse     // "...active and vigorous?"
  wellbeing_rested: FrequencyResponse     // "...waking up feeling fresh and rested?"

  // Cognitive engagement (LIBRA2 dementia risk factor; recommended by the 2024 Lancet Commission)
  cognitive_learning: "daily" | "weekly" | "monthly" | "rarely" | "never" // active learning, courses, languages
  cognitive_reading: "daily" | "weekly" | "monthly" | "rarely" | "never"  // reading books, articles
  cognitive_challenges: "daily" | "weekly" | "monthly" | "rarely" | "never" // puzzles, problem-solving

  // Purpose & Meaning (Boyle et al. 2009; Hill & Turiano 2014)
  // Lowest vs highest purpose: ~2.4x all-cause mortality in US adults over 50 (Alimujiang et al. 2019)
  purpose_meaning: "strongly-agree" | "agree" | "neutral" | "disagree" | "strongly-disagree" // "I feel my life has meaning"
  purpose_goals: "strongly-agree" | "agree" | "neutral" | "disagree" | "strongly-disagree" // "I have clear goals"
  purpose_value: "strongly-agree" | "agree" | "neutral" | "disagree" | "strongly-disagree" // "I feel valued by others"
}

export interface MentalHealthResult {
  overallScore: number
  subScores: {
    k10Score: number         // Raw K10: 10-50
    k10Category: string      // "Likely well" / "Mild" / "Moderate" / "Severe"
    phq2Score: number        // 0-6
    phq2Flag: boolean        // true if >= 3 (depression screen positive)
    gad2Score: number        // 0-6
    gad2Flag: boolean        // true if >= 3 (anxiety screen positive)
    wellbeingScore: number   // 0-100
    cognitiveScore: number   // 0-100
    purposeScore: number     // 0-100
  }
  distressLevel: "low" | "mild" | "moderate" | "severe"
  flags: string[]            // Clinical flags for user awareness
  recommendations: string[]
}

// K10 frequency scoring: 1-5 (none=1, all=5)
const K10_MAP: Record<FrequencyResponse, number> = {
  none: 1,
  "a-little": 2,
  some: 3,
  most: 4,
  all: 5,
}

// PHQ/GAD frequency scoring: 0-3
const PHQ_MAP: Record<PhqFrequency, number> = {
  "not-at-all": 0,
  "several-days": 1,
  "more-than-half": 2,
  "nearly-every-day": 3,
}

// Wellbeing: reversed (more = better)
const WELLBEING_MAP: Record<FrequencyResponse, number> = {
  none: 0,
  "a-little": 1,
  some: 2,
  most: 3,
  all: 4,
}

/**
 * Score K10 (range 10-50)
 * Cut-offs per Andrews & Slade (2001) / Australian Bureau of Statistics:
 * 10-19: Likely well, 20-24: Mild distress, 25-29: Moderate, 30-50: Severe
 */
function scoreK10(answers: MentalHealthAnswers): { raw: number; category: string; healthScore: number } {
  const raw =
    K10_MAP[answers.k10_tired] +
    K10_MAP[answers.k10_nervous] +
    K10_MAP[answers.k10_soNervous] +
    K10_MAP[answers.k10_hopeless] +
    K10_MAP[answers.k10_restless] +
    K10_MAP[answers.k10_soRestless] +
    K10_MAP[answers.k10_depressed] +
    K10_MAP[answers.k10_soDepressed] +
    K10_MAP[answers.k10_everything] +
    K10_MAP[answers.k10_worthless]

  let category: string
  let healthScore: number

  if (raw <= 19) {
    category = "Likely well"
    // 10 = 100, 19 = 75
    healthScore = 100 - ((raw - 10) / 9) * 25
  } else if (raw <= 24) {
    category = "Mild distress"
    // 20 = 70, 24 = 55
    healthScore = 70 - ((raw - 20) / 4) * 15
  } else if (raw <= 29) {
    category = "Moderate distress"
    // 25 = 50, 29 = 30
    healthScore = 50 - ((raw - 25) / 4) * 20
  } else {
    category = "Severe distress"
    // 30 = 25, 50 = 5
    healthScore = Math.max(5, 25 - ((raw - 30) / 20) * 20)
  }

  return { raw, category, healthScore: Math.round(healthScore) }
}

/**
 * Score PHQ-2 (range 0-6)
 * Cut-off >= 3: positive screen for major depression
 */
function scorePHQ2(answers: MentalHealthAnswers): { raw: number; flag: boolean; healthScore: number } {
  const raw = PHQ_MAP[answers.phq2_interest] + PHQ_MAP[answers.phq2_depressed]
  const flag = raw >= 3

  // 0 = 100, 6 = 10
  const healthScore = Math.round(100 - (raw / 6) * 90)
  return { raw, flag, healthScore }
}

/**
 * Score GAD-2 (range 0-6)
 * Cut-off >= 3: positive screen for generalized anxiety
 */
function scoreGAD2(answers: MentalHealthAnswers): { raw: number; flag: boolean; healthScore: number } {
  const raw = PHQ_MAP[answers.gad2_anxious] + PHQ_MAP[answers.gad2_worry]
  const flag = raw >= 3

  const healthScore = Math.round(100 - (raw / 6) * 90)
  return { raw, flag, healthScore }
}

/**
 * Score WHO-5 inspired wellbeing items (0-100)
 * Higher = better
 */
function scoreWellbeing(answers: MentalHealthAnswers): number {
  const total =
    WELLBEING_MAP[answers.wellbeing_cheerful] +
    WELLBEING_MAP[answers.wellbeing_calm] +
    WELLBEING_MAP[answers.wellbeing_active] +
    WELLBEING_MAP[answers.wellbeing_rested]

  // Max = 16, convert to 0-100
  return Math.round((total / 16) * 100)
}

/**
 * Score cognitive engagement (0-100)
 * LIBRA2 (Rosenau et al. 2024): high cognitive activity carries RR 0.61 for dementia. It is not
 * one of the 14 risk factors the 2024 Lancet Commission quantifies, but the Commission
 * recommends cognitively stimulating activity in midlife.
 */
const ENGAGEMENT_MAP: Record<string, number> = {
  daily: 100,
  weekly: 75,
  monthly: 45,
  rarely: 20,
  never: 0,
}

function scoreCognitive(answers: MentalHealthAnswers): number {
  const learning = ENGAGEMENT_MAP[answers.cognitive_learning] ?? 50
  const reading = ENGAGEMENT_MAP[answers.cognitive_reading] ?? 50
  const challenges = ENGAGEMENT_MAP[answers.cognitive_challenges] ?? 50
  return Math.round(learning * 0.35 + reading * 0.35 + challenges * 0.30)
}

/**
 * Score purpose & meaning (0-100)
 * Hill & Turiano (2014): higher purpose in life predicted lower all-cause
 * mortality across adulthood; Alimujiang et al. (2019, JAMA Netw Open): lowest
 * vs highest purpose ~2.4x mortality risk in adults over 50.
 */
const AGREEMENT_MAP: Record<string, number> = {
  "strongly-agree": 100,
  agree: 80,
  neutral: 50,
  disagree: 25,
  "strongly-disagree": 0,
}

function scorePurpose(answers: MentalHealthAnswers): number {
  const meaning = AGREEMENT_MAP[answers.purpose_meaning] ?? 50
  const goals = AGREEMENT_MAP[answers.purpose_goals] ?? 50
  const value = AGREEMENT_MAP[answers.purpose_value] ?? 50
  return Math.round(meaning * 0.40 + goals * 0.30 + value * 0.30)
}

/**
 * Main mental health assessment function
 *
 * Composite score weights:
 * - K10 (general distress): 30%
 * - PHQ-2 (depression): 12%
 * - GAD-2 (anxiety): 12%
 * - Wellbeing (WHO-5): 22%
 * - Cognitive engagement: 12%
 * - Purpose & meaning: 12%
 */
export function calculateMentalHealth(answers: MentalHealthAnswers): MentalHealthResult {
  const k10 = scoreK10(answers)
  const phq2 = scorePHQ2(answers)
  const gad2 = scoreGAD2(answers)
  const wellbeing = scoreWellbeing(answers)
  const cognitive = scoreCognitive(answers)
  const purpose = scorePurpose(answers)

  const overallScore = Math.round(
    k10.healthScore * 0.30 +
    phq2.healthScore * 0.12 +
    gad2.healthScore * 0.12 +
    wellbeing * 0.22 +
    cognitive * 0.12 +
    purpose * 0.12
  )

  // Determine distress level from composite
  let distressLevel: "low" | "mild" | "moderate" | "severe"
  if (overallScore >= 75) distressLevel = "low"
  else if (overallScore >= 55) distressLevel = "mild"
  else if (overallScore >= 35) distressLevel = "moderate"
  else distressLevel = "severe"

  // Clinical flags
  const flags: string[] = []
  if (phq2.flag) {
    flags.push("PHQ-2 screen positive (score >= 3): Suggests possible depression. Consider completing full PHQ-9 with a healthcare provider.")
  }
  if (gad2.flag) {
    flags.push("GAD-2 screen positive (score >= 3): Suggests possible anxiety disorder. Consider completing full GAD-7 with a healthcare provider.")
  }
  if (k10.raw >= 25) {
    flags.push(`K10 score of ${k10.raw} indicates ${k10.category.toLowerCase()}. Professional mental health support is recommended.`)
  }
  if (wellbeing <= 50) {
    flags.push("Low wellbeing score: on the WHO-5, which these items are adapted from, 50% or less calls for a depression assessment.")
  }
  if (cognitive < 40) {
    flags.push("Low cognitive engagement: high cognitive activity goes with 39% lower dementia risk (LIBRA2, Rosenau et al. 2024), and the 2024 Lancet Commission recommends cognitively stimulating activity in midlife.")
  }
  if (purpose < 40) {
    flags.push("Low sense of purpose: lower purpose-in-life is associated with greater all-cause mortality risk (Hill & Turiano, 2014).")
  }

  // Recommendations
  const recommendations: string[] = []

  if (distressLevel === "severe") {
    recommendations.push("Your responses suggest significant distress. Please consider reaching out to a mental health professional or crisis helpline.")
  } else if (distressLevel === "moderate") {
    recommendations.push("Your results suggest moderate psychological distress. Consider speaking with a healthcare provider or counselor.")
  }

  if (phq2.flag || gad2.flag) {
    recommendations.push("Positive screening results are not a diagnosis -- they indicate that a full clinical evaluation would be beneficial.")
  }

  if (wellbeing <= 50) {
    recommendations.push("Focus on activities that boost wellbeing: regular physical activity, social connection, mindfulness, and adequate sleep.")
  }

  if (k10.raw >= 20 && k10.raw < 25) {
    recommendations.push("Mild distress is common but worth monitoring. Practice stress management techniques and maintain social support.")
  }

  if (overallScore >= 75) {
    recommendations.push("Your mental health screening looks positive. Continue maintaining your wellbeing practices.")
  }

  if (cognitive < 60) {
    recommendations.push("Engage your mind regularly: read books, learn new skills, solve puzzles, or take on cognitive challenges to support brain health.")
  }
  if (purpose < 60) {
    recommendations.push("Cultivate a sense of purpose: clarify your values, set meaningful goals, and contribute to something larger than yourself.")
  }

  recommendations.push("This screening does not replace professional evaluation. If you are in crisis, contact your local emergency services or a crisis helpline.")

  return {
    overallScore: Math.max(0, Math.min(100, overallScore)),
    subScores: {
      k10Score: k10.raw,
      k10Category: k10.category,
      phq2Score: phq2.raw,
      phq2Flag: phq2.flag,
      gad2Score: gad2.raw,
      gad2Flag: gad2.flag,
      wellbeingScore: wellbeing,
      cognitiveScore: cognitive,
      purposeScore: purpose,
    },
    distressLevel,
    flags,
    recommendations,
  }
}
