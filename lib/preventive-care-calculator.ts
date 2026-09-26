/**
 * Preventive Care Calculator
 *
 * Captures whether the user is up-to-date on routine preventive care
 * (vaccinations, screenings, dental visits) appropriate for adults.
 *
 * Sources:
 * - USPSTF recommendations (incl. 2024 breast cancer screening from age 40)
 * - ADA Standards of Care (diabetes screening for all adults from age 35)
 * - EU Council Recommendation on cancer screening (2022)
 * - CDC adult immunization schedule
 * - ADA / WHO oral health guidelines
 *
 * Studies suggest adherence to recommended preventive care can reduce
 * mortality by 5-15% over a decade and add several years of life expectancy.
 */

export type CarePeriod = "current" | "overdue" | "long-overdue" | "never" | "not-applicable"

export interface PreventiveCareAnswers {
  // Vaccines
  fluVaccine: CarePeriod        // annual
  tdapVaccine: CarePeriod       // every 10 yr
  covidUpToDate: CarePeriod     // current per latest guidance

  // Screenings
  bloodPressureCheck: CarePeriod  // annual
  cholesterolCheck: CarePeriod    // every 4-6 yr
  diabetesScreening: CarePeriod   // every 3 yr after 35
  cancerScreenings: CarePeriod    // age-appropriate (mammogram, colonoscopy, etc.)
  skinExam: CarePeriod            // annual recommended for higher-risk

  // General
  primaryCareVisit: CarePeriod    // annual checkup
  dentalVisit: CarePeriod         // every 6 mo
  eyeExam: CarePeriod             // every 1-2 yr
}

export interface PreventiveCareResult {
  overallScore: number
  itemsBehind: { item: string; status: CarePeriod; recommendation: string }[]
  recommendations: string[]
}

const PERIOD_SCORE: Record<CarePeriod, number> = {
  current: 100,
  overdue: 60,
  "long-overdue": 25,
  never: 10,
  "not-applicable": 100, // doesn't penalize
}

const ITEMS: { key: keyof PreventiveCareAnswers; label: string; weight: number; recommendation: string }[] = [
  { key: "fluVaccine", label: "Annual flu vaccine", weight: 0.7, recommendation: "Get an annual flu vaccine, especially if over 50 or with chronic conditions." },
  { key: "tdapVaccine", label: "Tdap booster (every 10 years)", weight: 0.5, recommendation: "Update your Tdap booster - protects against tetanus, diphtheria, and pertussis." },
  { key: "covidUpToDate", label: "COVID-19 vaccination current", weight: 0.5, recommendation: "Stay current on COVID-19 vaccinations per latest guidance." },
  { key: "bloodPressureCheck", label: "Blood pressure check", weight: 1.2, recommendation: "Have your blood pressure checked annually - hypertension is often silent." },
  { key: "cholesterolCheck", label: "Cholesterol panel", weight: 1.0, recommendation: "Get a lipid panel every 4-6 years (more often if elevated or with risk factors)." },
  { key: "diabetesScreening", label: "Diabetes screening", weight: 0.9, recommendation: "Get screened for diabetes (HbA1c or fasting glucose) from age 35, or earlier with overweight plus another risk factor, and repeat at least every 3 years." },
  { key: "cancerScreenings", label: "Age-appropriate cancer screenings", weight: 1.5, recommendation: "Confirm you're current on age-appropriate cancer screenings: breast every 2 years from 40-50 depending on your country (USPSTF: from 40), colorectal from 45-50, cervical HPV testing, and low-dose lung CT if you have a heavy smoking history." },
  { key: "skinExam", label: "Skin examination", weight: 0.5, recommendation: "Schedule a skin check, especially with sun exposure history or family history of melanoma." },
  { key: "primaryCareVisit", label: "Annual primary care visit", weight: 1.0, recommendation: "An annual checkup catches early warning signs and keeps preventive care on track." },
  { key: "dentalVisit", label: "Dental cleaning (every 6 months)", weight: 0.8, recommendation: "Maintain twice-yearly dental cleanings; periodontal disease is linked to cardiovascular risk." },
  { key: "eyeExam", label: "Eye examination", weight: 0.5, recommendation: "Get an eye exam every 1-2 years; checks vision and detects glaucoma/diabetic retinopathy." },
]

export function calculatePreventiveCare(answers: PreventiveCareAnswers): PreventiveCareResult {
  let weightedSum = 0
  let totalWeight = 0
  const itemsBehind: { item: string; status: CarePeriod; recommendation: string }[] = []
  const recommendations: string[] = []

  for (const item of ITEMS) {
    const status = answers[item.key]
    const score = PERIOD_SCORE[status]
    if (status !== "not-applicable") {
      weightedSum += score * item.weight
      totalWeight += item.weight
    }
    if (status === "overdue" || status === "long-overdue" || status === "never") {
      itemsBehind.push({ item: item.label, status, recommendation: item.recommendation })
      if (item.weight >= 1.0 || status === "long-overdue" || status === "never") {
        recommendations.push(item.recommendation)
      }
    }
  }

  const overallScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 50

  if (overallScore >= 85 && recommendations.length === 0) {
    recommendations.push("Your preventive care is excellent - keep maintaining these visits.")
  } else if (overallScore < 50) {
    recommendations.push("Schedule a primary care visit soon to coordinate catching up on overdue items.")
  }

  return { overallScore, itemsBehind, recommendations }
}
