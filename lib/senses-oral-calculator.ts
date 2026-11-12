/**
 * Senses & Oral Health Calculator
 *
 * Combines hearing, vision, and oral health assessments. Often overlooked,
 * but each is independently associated with major outcomes:
 *
 * - Hearing loss: one of the largest modifiable dementia risk factors,
 *   ~7% population-attributable fraction (Lancet Commission 2024 update;
 *   originally identified as #1 in the 2020 Commission)
 * - Vision impairment: linked to cognitive decline, falls, depression
 * - Oral health: periodontal disease linked to CVD; tooth count is a
 *   surprisingly strong longevity predictor (Friedman & Lamster, 2016)
 */

export interface SensesOralAnswers {
  // Hearing
  hearingDifficulty: "none" | "mild" | "moderate" | "severe"
  hearingTested: "recently" | "1-3-yr" | "3+yr" | "never"
  hearingAids: "not-needed" | "wears" | "needs-but-no" // honest self-report
  noiseExposure: "low" | "moderate" | "high" // chronic loud environment exposure

  // Vision
  visionCorrection: "perfect" | "corrected" | "blurry-with-correction" | "uncorrected-impairment"
  eyeStrain: "never" | "rarely" | "frequently" | "constantly"
  lastEyeExam: "0-1-yr" | "1-2-yr" | "2-5-yr" | "5+yr" | "never"

  // Oral health
  brushingFrequency: "twice-daily" | "daily" | "less-than-daily"
  flossingFrequency: "daily" | "weekly" | "rarely" | "never"
  gumBleeding: "never" | "rarely" | "sometimes" | "often"
  toothCount: "all" | "missing-1-3" | "missing-4-10" | "missing-many" | "edentulous"
  toothPain: "never" | "rarely" | "sometimes" | "often"
}

export interface SensesOralResult {
  overallScore: number
  subScores: { hearing: number; vision: number; oral: number }
  flags: string[]
  recommendations: string[]
}

function scoreHearing(a: SensesOralAnswers): { score: number; flags: string[]; recs: string[] } {
  const flags: string[] = []
  const recs: string[] = []
  const dMap = { none: 100, mild: 70, moderate: 35, severe: 15 }
  const tMap = { recently: 100, "1-3-yr": 75, "3+yr": 40, never: 25 }
  const aMap = { "not-needed": 100, wears: 100, "needs-but-no": 20 }
  const nMap = { low: 100, moderate: 65, high: 30 }

  if (a.hearingDifficulty === "moderate" || a.hearingDifficulty === "severe") {
    flags.push("Self-reported hearing difficulty - untreated hearing loss is among the largest modifiable dementia risk factors (Lancet Commission 2024).")
    recs.push("Schedule a hearing evaluation; treatment (e.g., hearing aids) is associated with reduced cognitive decline.")
  }
  if (a.noiseExposure === "high") {
    recs.push("Use hearing protection (earplugs/muffs) in chronically loud environments to prevent further loss.")
  }
  if (a.hearingTested === "never" || a.hearingTested === "3+yr") {
    recs.push("Get a baseline hearing test - especially after age 50 or with noise exposure.")
  }
  if (a.hearingAids === "needs-but-no") {
    recs.push("If hearing aids were recommended, using them is linked to lower dementia risk in cohort studies (2024 Lancet Commission).")
  }

  const score = Math.round(
    dMap[a.hearingDifficulty] * 0.45 +
    tMap[a.hearingTested] * 0.15 +
    aMap[a.hearingAids] * 0.20 +
    nMap[a.noiseExposure] * 0.20
  )
  return { score, flags, recs }
}

function scoreVision(a: SensesOralAnswers): { score: number; flags: string[]; recs: string[] } {
  const flags: string[] = []
  const recs: string[] = []
  const cMap = { perfect: 100, corrected: 95, "blurry-with-correction": 50, "uncorrected-impairment": 25 }
  const sMap = { never: 100, rarely: 85, frequently: 50, constantly: 25 }
  const eMap = { "0-1-yr": 100, "1-2-yr": 85, "2-5-yr": 50, "5+yr": 25, never: 15 }

  if (a.visionCorrection === "blurry-with-correction" || a.visionCorrection === "uncorrected-impairment") {
    flags.push("Inadequate vision correction increases fall, accident, and cognitive decline risk.")
    recs.push("Update your prescription or get an eye exam to address blurry vision.")
  }
  if (a.eyeStrain === "frequently" || a.eyeStrain === "constantly") {
    recs.push("Frequent eye strain may indicate uncorrected vision or screen overuse - try the 20-20-20 rule.")
  }
  if (a.lastEyeExam === "5+yr" || a.lastEyeExam === "never") {
    recs.push("Schedule an eye exam - screens for glaucoma, macular degeneration, and diabetic retinopathy.")
  }

  const score = Math.round(cMap[a.visionCorrection] * 0.5 + sMap[a.eyeStrain] * 0.20 + eMap[a.lastEyeExam] * 0.30)
  return { score, flags, recs }
}

function scoreOral(a: SensesOralAnswers): { score: number; flags: string[]; recs: string[] } {
  const flags: string[] = []
  const recs: string[] = []
  const bMap = { "twice-daily": 100, daily: 70, "less-than-daily": 25 }
  const fMap = { daily: 100, weekly: 60, rarely: 30, never: 10 }
  const gMap = { never: 100, rarely: 80, sometimes: 50, often: 15 }
  const tcMap = { all: 100, "missing-1-3": 80, "missing-4-10": 50, "missing-many": 25, edentulous: 5 }
  const tpMap = { never: 100, rarely: 80, sometimes: 50, often: 15 }

  if (a.gumBleeding === "often") {
    flags.push("Frequent gum bleeding is a sign of periodontal disease, linked to cardiovascular risk.")
    recs.push("See a dentist for a periodontal evaluation - gum disease is treatable when caught early.")
  }
  if (a.toothCount === "missing-many" || a.toothCount === "edentulous") {
    flags.push("Significant tooth loss is associated with reduced longevity (Friedman & Lamster, 2016).")
  }
  if (a.toothPain === "often") {
    recs.push("Persistent tooth pain warrants a dental visit; untreated infections can become systemic.")
  }
  if (a.brushingFrequency !== "twice-daily") {
    recs.push("Brush at least twice daily with fluoride toothpaste.")
  }
  if (a.flossingFrequency === "rarely" || a.flossingFrequency === "never") {
    recs.push("Floss daily to prevent gum disease and reduce systemic inflammation.")
  }

  const score = Math.round(
    bMap[a.brushingFrequency] * 0.20 +
    fMap[a.flossingFrequency] * 0.15 +
    gMap[a.gumBleeding] * 0.20 +
    tcMap[a.toothCount] * 0.30 +
    tpMap[a.toothPain] * 0.15
  )
  return { score, flags, recs }
}

export function calculateSensesOral(a: SensesOralAnswers): SensesOralResult {
  const h = scoreHearing(a)
  const v = scoreVision(a)
  const o = scoreOral(a)

  // Weights: hearing 35% (dementia link), oral 35%, vision 30%
  const overallScore = Math.round(h.score * 0.35 + v.score * 0.30 + o.score * 0.35)

  return {
    overallScore: Math.max(0, Math.min(100, overallScore)),
    subScores: { hearing: h.score, vision: v.score, oral: o.score },
    flags: [...h.flags, ...v.flags, ...o.flags],
    recommendations: [...h.recs, ...v.recs, ...o.recs],
  }
}
