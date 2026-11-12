/**
 * Life Context & Relationships assessment.
 *
 * Evidence base:
 * - Marital status: Jia & Lubetkin 2020, SSM Popul Health (at 65, married men live 2.2 years
 *   longer and married women 1.5 than unmarried peers, part of it selection); Robles et al. 2014
 *   meta-analysis, Psychol Bull (better marital quality goes with lower mortality, r = .11)
 * - Parenthood: Modig et al. 2017, J Epidemiol Community Health (at 60, parents live 2 years
 *   longer (men) and 1.5 (women) than childless adults); Zeng et al. 2016, Sci Rep (no children:
 *   19% higher all-cause mortality; the lowest mortality at moderate family sizes)
 * - Education: Balaj et al. 2024, Lancet Public Health (each extra year of schooling ~1.9%
 *   lower adult mortality risk; tertiary vs no schooling ~34% lower)
 * - Income / SES: Chetty et al. 2016 JAMA (top 1% vs bottom 1% income = ~14.6y gap men, ~10.1y women)
 * - Financial stress: Carlsson et al. 2014, BMC Public Health (Swedish 60-year-olds without a
 *   cash margin: about twice the all-cause mortality, HR 1.97 in cohabiting women and 2.78 in
 *   single men)
 * - Religious attendance: Li et al. 2016, JAMA Intern Med (more than weekly = ~33% lower mortality,
 *   weekly = ~26% lower)
 * - Pet ownership: AHA 2013 statement; Mubanga et al. 2017 Sci Rep; Kramer et al. 2019 meta-analysis
 *   (dog owners ~24% lower all-cause mortality)
 * - Volunteering: Kim et al. 2020 (Harvard, 100+ hrs/yr = ~44% lower mortality)
 * - ACEs: Felitti 1998 + Brown et al. 2009 (6+ ACEs: death ~20 years earlier on average)
 *
 * NOTE: This is an educational composite. Many of these factors are non-modifiable
 * or culturally sensitive. Scoring rewards present-day protective factors and flags
 * adversity without judgment.
 */

export interface LifeContextAnswers {
  // Relationship status & quality
  relationshipStatus:
    | "married"
    | "partnered"
    | "single"
    | "dating"
    | "divorced"
    | "widowed"
    | "separated"
  relationshipQuality: "excellent" | "good" | "fair" | "poor" | "not-applicable"

  // Children
  hasChildren: "none" | "1" | "2-3" | "4+"
  closeConfidants: number // count of people with whom you can discuss important matters

  // Education
  educationLevel:
    | "none"
    | "primary"
    | "secondary"
    | "vocational"
    | "bachelor"
    | "master"
    | "doctorate"

  // Income / SES (relative bracket)
  incomeBracket: "very-low" | "low" | "middle" | "upper-middle" | "high"
  financialStress: "none" | "mild" | "moderate" | "high" | "severe"
  financialLiteracy: "low" | "basic" | "moderate" | "high" // Lusardi & Mitchell 3-question proxy

  // Spirituality / community
  religiousAttendance: "weekly" | "monthly" | "few-yearly" | "rarely" | "never"
  spiritualPractice: "daily" | "weekly" | "occasional" | "none"

  // Pet ownership
  petOwnership: "dog" | "cat" | "other" | "multiple" | "none"

  // Volunteering
  volunteerHoursPerYear: number // 0+

  // Adverse Childhood Experiences (count, 0-10)
  // Felitti 1998: physical/emotional/sexual abuse, neglect, household dysfunction
  acesCount: number
}

export interface LifeContextResult {
  overallScore: number
  subScores: {
    relationships: number
    family: number
    education: number
    socioeconomic: number
    spirituality: number
    community: number
    earlyLife: number
  }
  protectiveFactors: string[]
  riskFactors: string[]
  recommendations: string[]
}

function scoreRelationships(a: LifeContextAnswers): { score: number; protective: string[]; risks: string[] } {
  const protective: string[] = []
  const risks: string[] = []

  // Status base score
  const statusMap: Record<string, number> = {
    married: 90,
    partnered: 85,
    dating: 70,
    single: 65,
    separated: 45,
    divorced: 50,
    widowed: 55,
  }
  let base = statusMap[a.relationshipStatus] ?? 65

  // Quality multiplier (Robles 2014: quality > status)
  const qualityMap: Record<string, number> = {
    excellent: 1.15,
    good: 1.0,
    fair: 0.85,
    poor: 0.65,
    "not-applicable": 1.0,
  }
  base = base * (qualityMap[a.relationshipQuality] ?? 1.0)

  if (a.relationshipStatus === "married" || a.relationshipStatus === "partnered") {
    if (a.relationshipQuality === "excellent" || a.relationshipQuality === "good") {
      protective.push("Healthy partnership: married adults live 1.5-2.2 years longer from 65 (Jia & Lubetkin 2020), and relationship quality counts too (Robles 2014)")
    } else if (a.relationshipQuality === "poor") {
      risks.push("Distressed relationship can be more harmful than being single")
    }
  }

  // Confidants (Holt-Lunstad)
  let confidantScore: number
  if (a.closeConfidants >= 3) confidantScore = 100
  else if (a.closeConfidants === 2) confidantScore = 80
  else if (a.closeConfidants === 1) confidantScore = 55
  else {
    confidantScore = 25
    risks.push("Having no close confidants is associated with elevated mortality risk")
  }

  if (a.closeConfidants >= 3) protective.push("Strong inner social circle (3+ confidants)")

  const score = Math.round(Math.min(100, base) * 0.65 + confidantScore * 0.35)
  return { score, protective, risks }
}

function scoreFamily(a: LifeContextAnswers): { score: number; protective: string[]; risks: string[] } {
  const protective: string[] = []
  const risks: string[] = []
  // Zeng 2016: nonlinear, with the lowest mortality at moderate family sizes
  const map: Record<string, number> = { none: 65, "1": 75, "2-3": 90, "4+": 75 }
  const score = map[a.hasChildren] ?? 70
  if (a.hasChildren === "2-3") {
    protective.push("Children: parents live 1.5-2 years longer from 60 than childless adults (Modig 2017), with the lowest mortality at moderate family sizes (Zeng 2016)")
  }
  return { score, protective, risks }
}

function scoreEducation(a: LifeContextAnswers): { score: number; protective: string[]; risks: string[] } {
  const protective: string[] = []
  const risks: string[] = []
  const map: Record<string, number> = {
    none: 30,
    primary: 45,
    secondary: 65,
    vocational: 75,
    bachelor: 85,
    master: 92,
    doctorate: 95,
  }
  const score = map[a.educationLevel] ?? 65
  if (a.educationLevel === "bachelor" || a.educationLevel === "master" || a.educationLevel === "doctorate") {
    protective.push("Tertiary education (~34% lower adult mortality risk vs no schooling, Balaj et al. 2024)")
  } else if (a.educationLevel === "none" || a.educationLevel === "primary") {
    risks.push("Limited formal education is one of the strongest non-medical mortality predictors")
  }
  return { score, protective, risks }
}

function scoreSocioeconomic(a: LifeContextAnswers): { score: number; protective: string[]; risks: string[] } {
  const protective: string[] = []
  const risks: string[] = []

  const incomeMap: Record<string, number> = {
    "very-low": 30,
    low: 50,
    middle: 75,
    "upper-middle": 88,
    high: 95,
  }
  const incomeScore = incomeMap[a.incomeBracket] ?? 70

  const stressMap: Record<string, number> = {
    none: 100,
    mild: 80,
    moderate: 55,
    high: 30,
    severe: 10,
  }
  const stressScore = stressMap[a.financialStress] ?? 60
  if (a.financialStress === "high" || a.financialStress === "severe") {
    risks.push("High financial stress: having no cash margin went with about twice the mortality in a Swedish cohort of 60-year-olds (Carlsson 2014)")
  }

  const literacyMap: Record<string, number> = {
    low: 40,
    basic: 65,
    moderate: 80,
    high: 95,
  }
  const literacyScore = literacyMap[a.financialLiteracy] ?? 65
  if (a.financialLiteracy === "high") {
    protective.push("Strong financial literacy supports better long-term health decisions")
  }

  const score = Math.round(incomeScore * 0.40 + stressScore * 0.40 + literacyScore * 0.20)
  return { score, protective, risks }
}

function scoreSpirituality(a: LifeContextAnswers): { score: number; protective: string[]; risks: string[] } {
  const protective: string[] = []
  const risks: string[] = []
  const attMap: Record<string, number> = {
    weekly: 100,
    monthly: 80,
    "few-yearly": 60,
    rarely: 50,
    never: 50,
  }
  const practiceMap: Record<string, number> = {
    daily: 100,
    weekly: 80,
    occasional: 60,
    none: 50,
  }
  const score = Math.round(attMap[a.religiousAttendance] * 0.6 + practiceMap[a.spiritualPractice] * 0.4)
  if (a.religiousAttendance === "weekly") {
    protective.push("Weekly religious attendance (~26-33% lower mortality, Li et al. 2016)")
  }
  return { score, protective, risks }
}

function scoreCommunity(a: LifeContextAnswers): { score: number; protective: string[]; risks: string[] } {
  const protective: string[] = []
  const risks: string[] = []

  const petMap: Record<string, number> = {
    dog: 90,
    multiple: 90,
    cat: 75,
    other: 70,
    none: 60,
  }
  const petScore = petMap[a.petOwnership] ?? 60
  if (a.petOwnership === "dog" || a.petOwnership === "multiple") {
    protective.push("Dog ownership (~24% lower mortality, Kramer 2019)")
  }

  // Volunteering: Kim 2020 100+ hrs/yr threshold
  let volScore: number
  const v = a.volunteerHoursPerYear
  if (v >= 100) volScore = 100
  else if (v >= 50) volScore = 80
  else if (v >= 10) volScore = 65
  else if (v >= 1) volScore = 55
  else volScore = 45
  if (v >= 100) protective.push("100+ volunteer hours/year (~44% lower mortality, Kim 2020)")

  const score = Math.round(petScore * 0.4 + volScore * 0.6)
  return { score, protective, risks }
}

function scoreEarlyLife(a: LifeContextAnswers): { score: number; protective: string[]; risks: string[] } {
  const protective: string[] = []
  const risks: string[] = []
  const aces = Math.max(0, Math.min(10, a.acesCount))
  let score: number
  if (aces === 0) {
    score = 100
    protective.push("No reported adverse childhood experiences")
  } else if (aces === 1) score = 85
  else if (aces === 2) score = 70
  else if (aces === 3) score = 55
  else if (aces <= 5) score = 35
  else score = 15

  if (aces >= 4) {
    risks.push(`${aces} ACEs reported - associated with significantly elevated lifetime health risk (Felitti 1998)`)
  }
  return { score, protective, risks }
}

export function calculateLifeContext(a: LifeContextAnswers): LifeContextResult {
  const r = scoreRelationships(a)
  const f = scoreFamily(a)
  const e = scoreEducation(a)
  const s = scoreSocioeconomic(a)
  const sp = scoreSpirituality(a)
  const c = scoreCommunity(a)
  const el = scoreEarlyLife(a)

  // Weights chosen to reflect approximate effect-size magnitudes in literature
  const overallScore = Math.round(
    r.score * 0.22 +
    f.score * 0.08 +
    e.score * 0.16 +
    s.score * 0.22 +
    sp.score * 0.08 +
    c.score * 0.10 +
    el.score * 0.14
  )

  const protective = [
    ...r.protective,
    ...f.protective,
    ...e.protective,
    ...s.protective,
    ...sp.protective,
    ...c.protective,
    ...el.protective,
  ]
  const risks = [
    ...r.risks,
    ...f.risks,
    ...e.risks,
    ...s.risks,
    ...sp.risks,
    ...c.risks,
    ...el.risks,
  ]

  const recommendations: string[] = []
  if (r.score < 60) recommendations.push("Invest in close relationships - identify at least one person you can discuss anything with.")
  if (s.score < 60) recommendations.push("Address financial stress: build an emergency fund, learn budgeting basics, or consult a non-profit financial counselor.")
  if (e.score < 60) recommendations.push("Continued learning (online courses, certifications) supports both income and cognitive longevity.")
  if (c.score < 60) recommendations.push("Volunteering even a few hours per month measurably improves wellbeing and longevity.")
  if (el.score < 50) recommendations.push("Trauma-informed therapy can buffer the long-term health impact of childhood adversity.")
  if (overallScore >= 80) recommendations.push("Your life-context profile shows multiple strong protective factors - maintain these connections.")

  return {
    overallScore: Math.max(0, Math.min(100, overallScore)),
    subScores: {
      relationships: r.score,
      family: f.score,
      education: e.score,
      socioeconomic: s.score,
      spirituality: sp.score,
      community: c.score,
      earlyLife: el.score,
    },
    protectiveFactors: protective,
    riskFactors: risks,
    recommendations,
  }
}
