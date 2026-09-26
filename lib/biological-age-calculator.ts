/**
 * Biological Age Estimator
 *
 * Estimates "biological age" from lifestyle and environment data, following
 * the conceptual framework of clinical biological-age research:
 * - Levine et al. 2018 (Aging) - PhenoAge: biological age as the age at which
 *   your mortality risk matches the population average.
 * - Belsky et al. 2015 (PNAS) - Dunedin Study: pace of aging varies between
 *   0.4 and 2.4 "biological years" per chronological year across individuals,
 *   driven largely by modifiable factors.
 * - Rutledge, Oh & Wyss-Coray 2022 (Nature Reviews Genetics) - review of
 *   omics-based aging clocks and their link to mortality risk.
 *
 * Method: we map the life-expectancy adjustment (sum of evidence-based
 * longevity effects from completed modules, at the age-40 reference before
 * age scaling) onto an age shift:
 *
 *   bioAge = chronologicalAge - (totalAdjustment x DAMPING)
 *
 * The unscaled sum is used because a mortality hazard ratio corresponds to a
 * roughly constant age shift at any age (Gompertz), even though the life-years
 * at stake shrink with age.
 *
 * DAMPING = 0.5 is a modelling assumption, not a measured constant: life-
 * expectancy effects accrue over a lifetime, so at any point only part of the
 * differential has biologically "materialized".
 *
 * The shift is clamped to +/- min(0.35 x (age - 18), 15) years so young
 * adults cannot receive absurd estimates, and bioAge never goes below 18.
 *
 * IMPORTANT: without blood biomarkers (CRP, HbA1c, creatinine...) this is an
 * educational estimate, not a clinical PhenoAge measurement.
 */

export interface BiologicalAgeInputs {
  chronologicalAge: number
  /** Life-expectancy adjustment in years at the reference age (`referenceAdjustment`) */
  totalAdjustment: number
  /** Number of completed data modules (drives confidence) */
  dataPoints: number
}

export interface BiologicalAgeResult {
  biologicalAge: number
  chronologicalAge: number
  /** bioAge - chronoAge. Negative = biologically younger. */
  delta: number
  /** Estimated pace of aging: biological years per chronological year (Dunedin-style). */
  paceOfAging: number
  band: "younger" | "aligned" | "older"
  confidence: "low" | "medium" | "high"
  summary: string
}

const DAMPING = 0.5

export function calculateBiologicalAge(inputs: BiologicalAgeInputs): BiologicalAgeResult {
  const age = Math.max(18, Math.min(120, inputs.chronologicalAge))

  // Raw shift: positive adjustment (longer life expectancy) = younger bio age
  const rawShift = inputs.totalAdjustment * DAMPING

  // Clamp: shift cannot exceed 35% of adult years lived, capped at 15 years
  const maxShift = Math.min(0.35 * (age - 18), 15)
  const shift = Math.max(-maxShift, Math.min(maxShift, rawShift))

  const biologicalAge = Math.max(18, Math.round((age - shift) * 10) / 10)
  const delta = Math.round((biologicalAge - age) * 10) / 10

  // Pace of aging: how fast this person has been aging per calendar year
  // since adulthood. 1.0 = average; Dunedin range is roughly 0.4-2.4.
  const adultYears = Math.max(1, age - 18)
  const paceOfAging = Math.max(
    0.4,
    Math.min(2.4, Math.round(((biologicalAge - 18) / adultYears) * 100) / 100),
  )

  const band: BiologicalAgeResult["band"] =
    delta <= -1.5 ? "younger" : delta >= 1.5 ? "older" : "aligned"

  const confidence: BiologicalAgeResult["confidence"] =
    inputs.dataPoints >= 9 ? "high" : inputs.dataPoints >= 5 ? "medium" : "low"

  const summary =
    band === "younger"
      ? `Your lifestyle profile suggests your body is aging slower than average - roughly ${Math.abs(delta).toFixed(1)} years younger than your calendar age.`
      : band === "older"
        ? `Your current risk factors suggest accelerated aging - roughly ${delta.toFixed(1)} years older than your calendar age. Most drivers are modifiable.`
        : "Your biological age tracks closely with your calendar age."

  return {
    biologicalAge,
    chronologicalAge: age,
    delta,
    paceOfAging,
    band,
    confidence,
    summary,
  }
}
