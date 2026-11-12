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
 * - CDC adult immunization schedule (shingles and pneumococcal from 50; RSV from 75,
 *   or 50-74 at increased risk) and NHS programmes (shingles and pneumococcal from 65;
 *   RSV from 75, and 65-74 with immunosuppression or chronic respiratory disease)
 * - European Code Against Cancer, 5th edition (IARC/WHO 2025), "Cancer-causing infections":
 *   vaccinate against hepatitis B and HPV at the age recommended nationally, and take part in
 *   testing and treatment for hepatitis B and C, HIV and H. pylori as recommended nationally.
 *   The strictest national schedule sets the ages: HPV catch-up through 26 (CDC; ECAC5 asks for
 *   at least 18), hepatitis B vaccination for all adults 19-59 (ACIP 2022), and one test in
 *   adulthood for hepatitis C (CDC 2020), hepatitis B (CDC 2023) and HIV (CDC; USPSTF 2019).
 *   H. pylori is only tested where a country runs stomach cancer screening, so it isn't scored.
 * - 2025 ESC/EAS focused update on dyslipidaemias: measure Lp(a) at least once in every adult's
 *   lifetime; above 50 mg/dL (105 nmol/L) it is a risk-enhancing factor.
 * - ADA / WHO oral health guidelines
 * - Medical imaging, the largest man-made radiation dose for most people: CT scans done in the US
 *   in 2023 are projected to cause about 103,000 cancers, 91% of them in adults (Smith-Bindman et
 *   al., JAMA Intern Med 2025). Avoiding unneeded scans is "quaternary prevention", so lifetime
 *   CT, PET-CT and nuclear medicine scans subtract a few points; scans are usually needed, so the
 *   penalty stays small and people with none keep the same score.
 */

export type CarePeriod = "current" | "overdue" | "long-overdue" | "never" | "not-applicable"

/** Lifetime CT (incl. CT angiography and PET-CT), nuclear medicine scans and X-ray-guided procedures */
export type ImagingScans = "none" | "1-2" | "3-5" | "6-10" | "over-10" | "unsure"

export interface PreventiveCareAnswers {
  // Vaccines
  fluVaccine: CarePeriod        // annual
  tdapVaccine: CarePeriod       // every 10 yr
  covidUpToDate: CarePeriod     // current per latest guidance
  // Age-based vaccines (optional: answers saved before these were added don't have them)
  shinglesVaccine?: CarePeriod      // 2 doses of recombinant zoster vaccine
  pneumococcalVaccine?: CarePeriod  // one-off conjugate vaccine
  rsvVaccine?: CarePeriod           // single dose
  hpvVaccine?: CarePeriod           // full course; "overdue" = started, not finished
  hepBVaccine?: CarePeriod          // full course; "overdue" = started, not finished

  // Screenings (lpaTest and infectionTests are optional for the same reason)
  bloodPressureCheck: CarePeriod  // annual
  cholesterolCheck: CarePeriod    // every 4-6 yr
  lpaTest?: CarePeriod            // once in a lifetime: "current" = done, "never" = not yet
  diabetesScreening: CarePeriod   // every 3 yr after 35
  infectionTests?: CarePeriod     // hepatitis B, hepatitis C and HIV once: "overdue" = some of them
  cancerScreenings: CarePeriod    // age-appropriate (mammogram, colonoscopy, etc.)
  skinExam: CarePeriod            // annual recommended for higher-risk

  // General
  primaryCareVisit: CarePeriod    // annual checkup
  dentalVisit: CarePeriod         // every 6 mo
  eyeExam: CarePeriod             // every 1-2 yr

  // Medical radiation (optional for answers saved before it existed; missing = none)
  imagingScans?: ImagingScans
}

type CareItemKey = Exclude<keyof PreventiveCareAnswers, "imagingScans">

// A body CT (abdomen and pelvis) is about 7.7 mSv, 2.6 years of the ~3 mSv a year of natural
// background (RadiologyInfo, ACR/RSNA, reviewed 2025). Counts use the middle of each band.
export const IMAGING_MSV_PER_SCAN = 7.7
export const BACKGROUND_MSV_PER_YEAR = 3
export const IMAGING_SCAN_COUNT: Record<ImagingScans, number> = {
  none: 0,
  "1-2": 1.5,
  "3-5": 4,
  "6-10": 8,
  "over-10": 12,
  unsure: 0,
}
// Each scan adds about 0.4% to cancer risk (52% per Gy, INWORKS), so the points stay small
const IMAGING_PENALTY: Record<ImagingScans, number> = {
  none: 0,
  "1-2": 1,
  "3-5": 3,
  "6-10": 6,
  "over-10": 10,
  unsure: 1,
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

// Below this age these vaccines are only recommended for specific risk groups, so they're
// skipped when the user's age is known. From 50, eligibility depends on country and health
// conditions, and the user answers "not-applicable" when a vaccine isn't offered to them.
export const VACCINE_MIN_AGE: Partial<Record<keyof PreventiveCareAnswers, number>> = {
  shinglesVaccine: 50,
  pneumococcalVaccine: 50,
  rsvVaccine: 50,
}

// Above this age routine vaccination stops: HPV catch-up runs through 26 (CDC; from 27 to 45 only
// after shared decision-making) and universal hepatitis B vaccination through 59 (ACIP 2022; from
// 60 only with risk factors).
export const VACCINE_MAX_AGE: Partial<Record<keyof PreventiveCareAnswers, number>> = {
  hpvVaccine: 26,
  hepBVaccine: 59,
}

/** Whether an item applies at this age. Everything is asked when the age is unknown. */
export function isAskedAtAge(key: keyof PreventiveCareAnswers, age?: number): boolean {
  if (age === undefined) return true
  const minAge = VACCINE_MIN_AGE[key]
  const maxAge = VACCINE_MAX_AGE[key]
  return (minAge === undefined || age >= minAge) && (maxAge === undefined || age <= maxAge)
}

const ITEMS: { key: CareItemKey; label: string; weight: number; recommendation: string }[] = [
  { key: "fluVaccine", label: "Annual flu vaccine", weight: 0.7, recommendation: "Get an annual flu vaccine, especially if over 50 or with chronic conditions." },
  { key: "tdapVaccine", label: "Tdap booster (every 10 years)", weight: 0.5, recommendation: "Update your Tdap booster - protects against tetanus, diphtheria, and pertussis." },
  { key: "covidUpToDate", label: "COVID-19 vaccination current", weight: 0.5, recommendation: "Stay current on COVID-19 vaccinations per latest guidance." },
  { key: "shinglesVaccine", label: "Shingles vaccine (2 doses)", weight: 0.6, recommendation: "Get both doses of the recombinant shingles vaccine, 2-6 months apart. The CDC recommends it for all adults from 50; the NHS offers it from 65." },
  { key: "pneumococcalVaccine", label: "Pneumococcal vaccine", weight: 0.7, recommendation: "Get a one-off pneumococcal vaccine: recommended for all adults from 50 in the US and from 65 on the NHS, and earlier with some chronic conditions." },
  { key: "rsvVaccine", label: "RSV vaccine", weight: 0.6, recommendation: "Get a single RSV vaccine dose, ideally in late summer or early autumn. It's recommended for everyone from 75, and earlier with certain chronic conditions (from 50 in the US, 65 in the UK)." },
  { key: "hpvVaccine", label: "HPV vaccine", weight: 0.5, recommendation: "Complete the HPV vaccine course while you're 26 or under: it prevents most cervical, anal and throat cancers caused by HPV (European Code Against Cancer 2025; CDC catch-up through 26). From 27 to 45, ask your doctor whether it's worth it for you." },
  { key: "hepBVaccine", label: "Hepatitis B vaccine", weight: 0.5, recommendation: "Complete the hepatitis B vaccine course: chronic hepatitis B is a leading cause of liver cancer, and the CDC recommends the vaccine for all adults up to 59. Not sure? A blood test shows whether you're already immune." },
  { key: "bloodPressureCheck", label: "Blood pressure check", weight: 1.2, recommendation: "Have your blood pressure checked annually - hypertension is often silent." },
  { key: "cholesterolCheck", label: "Cholesterol panel", weight: 1.0, recommendation: "Get a lipid panel every 4-6 years (more often if elevated or with risk factors)." },
  { key: "lpaTest", label: "Lp(a) blood test (once)", weight: 0.6, recommendation: "Ask for a one-off Lp(a) blood test: the 2025 ESC/EAS guideline advises it once in every adult's lifetime. Lp(a) is mostly inherited and isn't part of a standard cholesterol panel; above 50 mg/dL (105 nmol/L) it raises heart attack and stroke risk, so LDL and blood pressure need tighter control." },
  { key: "diabetesScreening", label: "Diabetes screening", weight: 0.9, recommendation: "Get screened for diabetes (HbA1c or fasting glucose) from age 35, or earlier with overweight plus another risk factor, and repeat at least every 3 years." },
  { key: "infectionTests", label: "Hepatitis B, hepatitis C and HIV tests (once)", weight: 0.7, recommendation: "Get tested once for hepatitis B, hepatitis C and HIV, even without symptoms: the European Code Against Cancer (2025) advises it and the CDC recommends it for every adult. Treatment prevents liver cancer and AIDS-related cancers, and hepatitis C is curable in 8-12 weeks." },
  { key: "cancerScreenings", label: "Age-appropriate cancer screenings", weight: 1.5, recommendation: "Confirm you're current on age-appropriate cancer screenings: breast every 2 years from 40-50 depending on your country (USPSTF: from 40), colorectal from 45-50, cervical HPV testing, and low-dose lung CT if you have a heavy smoking history." },
  { key: "skinExam", label: "Skin examination", weight: 0.5, recommendation: "Schedule a skin check, especially with sun exposure history or family history of melanoma." },
  { key: "primaryCareVisit", label: "Annual primary care visit", weight: 1.0, recommendation: "An annual checkup catches early warning signs and keeps preventive care on track." },
  { key: "dentalVisit", label: "Dental cleaning (every 6 months)", weight: 0.8, recommendation: "Maintain twice-yearly dental cleanings; periodontal disease is linked to cardiovascular risk." },
  { key: "eyeExam", label: "Eye examination", weight: 0.5, recommendation: "Get an eye exam every 1-2 years; checks vision and detects glaucoma/diabetic retinopathy." },
]

export function calculatePreventiveCare(answers: PreventiveCareAnswers, age?: number): PreventiveCareResult {
  let weightedSum = 0
  let totalWeight = 0
  const itemsBehind: { item: string; status: CarePeriod; recommendation: string }[] = []
  const recommendations: string[] = []

  for (const item of ITEMS) {
    if (!isAskedAtAge(item.key, age)) continue
    const status = answers[item.key] ?? "not-applicable"
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

  const scheduleScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 50
  const imaging = answers.imagingScans ?? "none"
  const overallScore = Math.max(0, scheduleScore - (IMAGING_PENALTY[imaging] ?? 0))

  const scans = IMAGING_SCAN_COUNT[imaging] ?? 0
  if (scans >= 4) {
    const dose = Math.round(scans * IMAGING_MSV_PER_SCAN)
    recommendations.push(
      `Your scans add up to roughly ${dose} mSv, about ${Math.round(dose / BACKGROUND_MSV_PER_YEAR)} years of natural background radiation. Before a new CT, ask whether the result will change your treatment and whether ultrasound or MRI, which use no ionising radiation, could answer the same question, and bring earlier images so nothing is repeated. Never refuse a scan your doctor says you need.`,
    )
  } else if (imaging === "unsure") {
    recommendations.push(
      "Keep a list of your CT and nuclear medicine scans with their dates: it helps doctors avoid repeating them, and a body CT is about 7.7 mSv, 2.6 years of natural background radiation.",
    )
  }

  if (overallScore >= 85 && recommendations.length === 0) {
    recommendations.push("Your preventive care is excellent - keep maintaining these visits.")
  } else if (overallScore < 50) {
    recommendations.push("Schedule a primary care visit soon to coordinate catching up on overdue items.")
  }

  return { overallScore, itemsBehind, recommendations }
}
