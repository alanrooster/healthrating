/**
 * Lifestyle Assessment Calculator
 *
 * Focuses on non-work lifestyle factors that impact health.
 * Work-related factors are now in a separate Work Assessment module.
 *
 * Based on validated health instruments:
 *
 * 1. Sleep Quality:
 *    - Pittsburgh Sleep Quality Index (PSQI) simplified: validated instrument
 *      for measuring sleep quality; scores >5 indicate poor sleep quality.
 *    - Adults need 7-9 hours (National Sleep Foundation, Hirshkowitz 2015; 7-8 h from
 *      age 65); AASM/SRS consensus: at least 7 hours (Watson 2015).
 *    - Light at night (10% of the sleep score): wrist light sensors on 88,905 UK Biobank adults
 *      link brighter nights to higher all-cause mortality (Windred et al., PNAS 2024) and, for
 *      the brightest tenth vs the darkest half, to 28-56% more coronary disease, heart attack,
 *      heart failure, atrial fibrillation and stroke (Windred et al., JAMA Netw Open 2025).
 *
 * 2. Social Connection & Work-Life Balance:
 *    - Holt-Lunstad et al. (2010, 2015): social isolation increases mortality
 *      risk by ~29%, comparable to smoking 15 cigarettes/day.
 *    - WHO Commission on Social Connection (2025): loneliness is linked to an
 *      estimated 871,000 deaths a year.
 *    - WHO Guidelines on Mental Health at Work (2022): work-life balance is
 *      a key protective factor.
 *
 * 3. Substance Use:
 *    - WHO/CDC evidence on smoking and alcohol health impacts
 *    - No safe level of alcohol consumption (WHO)
 *    - Drug use is subtracted from the habits score, so people who never used drugs score as if
 *      the questions didn't exist. Any lifetime use counts: the strictest reading of WHO ASSIST,
 *      which asks about lifetime use first and injecting last.
 *    - Cannabis: RR 2.10 for cardiovascular death, 1.29 for acute coronary syndrome and 1.20 for
 *      stroke across 24 studies (Storck et al., Heart 2025); daily use: MI aOR 1.25 and stroke
 *      1.42, rising with days of use (Jeffers et al., JAHA 2024).
 *    - Other drugs: regular use multiplies mortality 6.1x for cocaine (Peacock et al., Addiction
 *      2021), 6.8x for amphetamines (Stockings et al., Addiction 2019) and 10x for opioids
 *      (Larney et al., JAMA Psychiatry 2020); heart-attack risk is 23.7x in the hour after cocaine
 *      (Mittleman et al., Circulation 1999). Having ever used cocaine was not linked to heart
 *      attacks but more than 10 uses was, in adults under 45 (Aslibekyan et al., Am J Cardiol
 *      2008), so a single past use costs only a few points.
 *    - Injecting: 38.8% of people who inject drugs have current hepatitis C and 15.2% live with
 *      HIV (Degenhardt et al., Lancet Glob Health 2023).
 *
 * Overall score: 0-100, weighted across sub-domains.
 */

export interface LifestyleAnswers {
  // Sleep (PSQI-aligned)
  sleepHoursPerNight: number // 0-12+
  sleepQuality: "very-good" | "good" | "fair" | "poor" | "very-poor"
  sleepDifficulty: "never" | "rarely" | "sometimes" | "often" | "always" // falling/staying asleep
  sleepScheduleConsistency: "very-consistent" | "consistent" | "somewhat" | "inconsistent" | "very-inconsistent"
  sleepLatencyMinutes: number // PSQI: time to fall asleep (mins)
  daytimeDysfunction: "never" | "rarely" | "sometimes" | "often" | "always" // PSQI: trouble staying awake/motivation
  // Optional: answers saved before it was added don't have it
  bedroomLight?: "dark" | "dim" | "some-light" | "bright"

  // Social & Balance
  socialFrequency: "daily" | "several-weekly" | "weekly" | "monthly" | "rarely"
  qualityRelationships: "excellent" | "good" | "fair" | "poor" | "very-poor"
  lonelinessFrequency: "never" | "rarely" | "sometimes" | "often" | "always"

  // Screen time & leisure
  screenTimeHours: number // 0-12+ (recreational, non-work)
  outdoorTimeMinutes: number // daily outdoor/nature time
  hobbiesEngagement: "daily" | "several-weekly" | "weekly" | "monthly" | "rarely"

  // Sedentary behavior (independent mortality predictor - Patel et al. 2018)
  sittingHoursPerDay: number // total sitting hours per day
  sedentaryBreaks: "frequently" | "sometimes" | "rarely" | "never" // breaks every 30-60 min

  // Sun exposure (Vitamin D + skin cancer balance)
  sunExposureMinutes: number // typical daily direct sun exposure (mins)
  sunscreenUse: "always" | "usually" | "sometimes" | "rarely" | "never"
  sunburnsPerYear: number // 0+ (skin cancer risk indicator)
  // Optional: answers saved before these questions existed don't have them (missing = never/none)
  sunbedUse?: "never" | "past" | "occasional" | "regular" // past = not in the last 12 months; regular = 10+ sessions a year
  sunbedFirstUse?: "before-35" | "35-plus" | "unsure" // "unsure" counts as before 35, the stricter reading
  flightHoursPerYear?: "none" | "under-50" | "50-100" | "100-200" | "200-plus" // as a passenger; aircrew answer in Work

  // Commute (Hansson et al. 2011 - long commutes raise depression/obesity risk)
  commuteMinutesOneWay: number // 0+ minutes one-way

  // Sauna (Laukkanen et al. 2015 JAMA - 4-7 sessions/week = -40% mortality vs 1/week)
  saunaSessionsPerWeek: number // 0-7+

  // Substance use
  smokingStatus: "never" | "former" | "occasional" | "daily"
  alcoholFrequency: "never" | "monthly" | "weekly" | "several-weekly" | "daily"
  alcoholUnitsPerSession: number // 0-10+
  caffeineConsumption: "none" | "moderate" | "high" | "excessive" // cups of coffee equivalent
  // Optional, same reason. "past" = tried once or a few times, "former" = used regularly; both
  // not in the last 12 months. Injecting only counts alongside reported drug use, as in WHO ASSIST
  cannabisUse?: "never" | "past" | "former" | "occasional" | "weekly" | "daily"
  otherDrugUse?: "never" | "past" | "former" | "occasional" | "monthly" | "weekly"
  injectedDrugs?: "never" | "past" | "recent"
}

export interface LifestyleResult {
  overallScore: number
  subScores: {
    sleep: number
    social: number
    leisure: number
    sedentary: number
    sun: number
    commute: number
    sauna: number
    habits: number
  }
  riskFactors: string[]
  recommendations: string[]
}

const FREQ_MAP: Record<string, number> = {
  never: 0,
  rarely: 1,
  sometimes: 2,
  often: 3,
  always: 4,
}

// The UK Biobank cohorts measured light with wrist sensors; these bands are a self-report stand-in
// for their dark-night reference (0-50th percentile) up to the brightest tenth
const BEDROOM_LIGHT_SCORE: Record<NonNullable<LifestyleAnswers["bedroomLight"]>, number> = {
  dark: 100,
  dim: 85,
  "some-light": 50,
  bright: 20,
}

/**
 * Sleep score (0-100)
 * Based on PSQI scoring principles and NSF/AASM sleep-duration recommendations (7-9h adults)
 */
function scoreSleep(answers: LifestyleAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  // Duration score: 7-9h = 100, 6-7h = 70-85, <6h or >10h = lower
  let durationScore: number
  const h = answers.sleepHoursPerNight
  if (h >= 7 && h <= 9) {
    durationScore = 100
  } else if (h >= 6 && h < 7) {
    durationScore = 70 + (h - 6) * 15
  } else if (h > 9 && h <= 10) {
    durationScore = 85
  } else if (h >= 5 && h < 6) {
    durationScore = 45 + (h - 5) * 25
  } else if (h < 5) {
    durationScore = Math.max(10, 45 - ((5 - h) / 3) * 35)
    risks.push(`Sleeping only ${h} hours: significantly below the recommended 7-9 hours for adults`)
  } else {
    durationScore = 70 // oversleeping
    risks.push("Excessive sleep (10+ hours) may indicate underlying health issues")
  }

  // Quality score
  const qualityMap: Record<string, number> = {
    "very-good": 100,
    good: 85,
    fair: 60,
    poor: 35,
    "very-poor": 10,
  }
  const qualityScore = qualityMap[answers.sleepQuality] ?? 60

  // Difficulty score
  const difficultyPenalty = FREQ_MAP[answers.sleepDifficulty] * 10

  // Consistency score
  const consistencyMap: Record<string, number> = {
    "very-consistent": 100,
    consistent: 85,
    somewhat: 60,
    inconsistent: 35,
    "very-inconsistent": 15,
  }
  const consistencyScore = consistencyMap[answers.sleepScheduleConsistency] ?? 60

  if (answers.sleepQuality === "poor" || answers.sleepQuality === "very-poor") {
    risks.push("Poor sleep quality: PSQI research links this to depression, fatigue, and impaired immunity")
  }
  if (answers.sleepDifficulty === "often" || answers.sleepDifficulty === "always") {
    risks.push("Frequent difficulty falling/staying asleep is an insomnia indicator")
  }
  if (answers.sleepScheduleConsistency === "inconsistent" || answers.sleepScheduleConsistency === "very-inconsistent") {
    risks.push("Irregular sleep schedule disrupts circadian rhythm and reduces sleep quality")
  }

  // PSQI sleep latency - >30 mins = problematic
  let latencyScore = 100
  const lat = answers.sleepLatencyMinutes
  if (lat <= 15) latencyScore = 100
  else if (lat <= 30) latencyScore = 80
  else if (lat <= 60) latencyScore = 50
  else latencyScore = 20
  if (lat > 30) {
    risks.push(`Sleep latency of ${lat} minutes is elevated - PSQI considers >30 min problematic`)
  }

  // PSQI daytime dysfunction
  const dysfunctionPenalty = FREQ_MAP[answers.daytimeDysfunction] * 10
  const dysfunctionScore = Math.max(0, 100 - dysfunctionPenalty * 2)
  if (answers.daytimeDysfunction === "often" || answers.daytimeDysfunction === "always") {
    risks.push("Frequent daytime sleepiness suggests insufficient or poor-quality sleep")
  }

  const psqiScore =
    durationScore * 0.25 +
    qualityScore * 0.20 +
    (100 - difficultyPenalty * 2) * 0.15 +
    consistencyScore * 0.15 +
    latencyScore * 0.15 +
    dysfunctionScore * 0.10

  const light = answers.bedroomLight
  if (light === "some-light" || light === "bright") {
    risks.push(
      "Light in the bedroom at night disrupts the body clock: among 88,905 UK Biobank adults wearing light sensors, those with the brightest nights had 47% more heart attacks and 56% more heart failure than those with dark nights (Windred et al. 2025)"
    )
  }
  // Bedroom light takes 10% when answered; answers saved before it existed keep the PSQI weights
  const score = light ? psqiScore * 0.9 + BEDROOM_LIGHT_SCORE[light] * 0.1 : psqiScore

  return { score: Math.max(0, Math.round(score)), risks }
}

/**
 * Sedentary behavior score (0-100)
 * Patel et al. (2018, 2010): prolonged sitting increases all-cause mortality
 * INDEPENDENT of exercise. >8h/day sitting ~+40% mortality risk.
 * Breaking up sitting every 30-60 min reduces metabolic harm.
 */
function scoreSedentary(answers: LifestyleAnswers): { score: number; risks: string[] } {
  const risks: string[] = []
  const h = answers.sittingHoursPerDay

  let sittingScore: number
  if (h <= 4) sittingScore = 100
  else if (h <= 6) sittingScore = 80
  else if (h <= 8) sittingScore = 55
  else if (h <= 10) sittingScore = 30
  else sittingScore = 10

  if (h >= 8) {
    risks.push(`Sitting ${h}+ hours daily increases all-cause mortality risk independently of exercise (Patel et al. 2018)`)
  }

  const breaksMap: Record<string, number> = {
    frequently: 100,
    sometimes: 70,
    rarely: 35,
    never: 10,
  }
  const breaksScore = breaksMap[answers.sedentaryBreaks] ?? 50

  if (answers.sedentaryBreaks === "rarely" || answers.sedentaryBreaks === "never") {
    risks.push("Rarely breaking up sitting time amplifies metabolic and cardiovascular risk")
  }

  const score = Math.round(sittingScore * 0.7 + breaksScore * 0.3)
  return { score, risks }
}

/**
 * Daily sun-minute bands at the local UV level. `uvFactor` = the city's yearly UV dose / Boston's,
 * where the 10-30 minute advice was researched (Webb, Kline & Holick 1988). Each band moves only
 * towards its stricter side: more UV shortens the safe window, less UV raises the vitamin D
 * minimum, and neither loosens the other.
 */
export function sunExposureBands(uvFactor = 1) {
  const factor = Number.isFinite(uvFactor) && uvFactor > 0 ? uvFactor : 1
  const brighter = Math.max(factor, 1)
  const dimmer = Math.min(factor, 1)
  const minimum = Math.round(5 / dimmer)
  const ideal = Math.max(minimum, Math.round(30 / brighter))
  return {
    minimum,
    ideal,
    long: Math.round(60 / brighter),
    extended: Math.round(120 / brighter),
    /** The "10-30 minutes" advice at this UV dose, for display; the low end never drops below `minimum` */
    window: [Math.min(ideal, Math.max(minimum, Math.round(10 / factor))), ideal] as const,
  }
}

// Points off the sun & radiation score, so people who use neither keep the same score
const SUNBED_PENALTY: Record<NonNullable<LifestyleAnswers["sunbedUse"]>, number> = {
  never: 0,
  past: 5,
  occasional: 15,
  regular: 30,
}
// Nothing below 100 hours a year (under 0.5 mSv)
const FLIGHT_PENALTY: Record<NonNullable<LifestyleAnswers["flightHoursPerYear"]>, number> = {
  none: 0,
  "under-50": 0,
  "50-100": 0,
  "100-200": 2,
  "200-plus": 5,
}

/**
 * Sun & radiation score (0-100)
 * Balance: enough for vitamin D synthesis, not so much that skin cancer risk rises.
 * Holick (2007): 10-30 min midday sun on arms/legs several times weekly is generally sufficient;
 * the minute bands follow the local UV level (`sunExposureBands`, NASA POWER climatology).
 * AAD: regular sunscreen + lifetime sunburns are key skin cancer predictors.
 * Sunbeds are IARC Group 1 and the European Code Against Cancer (2025) advises against any use:
 * ever use RR 1.20 for melanoma, 1.87 when first used before 35, +1.8% per yearly session
 * (Boniol et al., BMJ 2012).
 * Flights: cosmic radiation runs at 4-5 µSv an hour on long-haul routes (Bagshaw, Travel Med
 * Infect Dis 2008), so 200 hours a year reach 1 mSv, the EU dose limit for the public and the
 * level from which airlines must assess crew doses (Directive 2013/59/Euratom, Art. 35(3)).
 */
function scoreSun(answers: LifestyleAnswers, uvFactor = 1): { score: number; risks: string[] } {
  const risks: string[] = []
  const bands = sunExposureBands(uvFactor)

  let exposureScore: number
  const m = answers.sunExposureMinutes
  if (m < bands.minimum) {
    exposureScore = 30
    risks.push("Very limited sun exposure increases vitamin D deficiency risk")
  } else if (m <= bands.ideal) {
    exposureScore = 100
  } else if (m <= bands.long) {
    exposureScore = 75
  } else if (m <= bands.extended) {
    exposureScore = 50
  } else {
    exposureScore = 25
    risks.push("Extended unprotected sun exposure raises skin cancer and photoaging risk")
  }
  if (uvFactor > 1 && m > bands.ideal) {
    risks.push(
      `Strong UV where you live (${uvFactor.toFixed(1)}x Boston's, where the 10-30 minute advice comes from): ${bands.ideal} minutes here give the UV dose of 30 there`,
    )
  }

  // Sunscreen
  const sunscreenMap: Record<string, number> = {
    always: 100,
    usually: 85,
    sometimes: 60,
    rarely: 30,
    never: 10,
  }
  const sunscreenScore = sunscreenMap[answers.sunscreenUse] ?? 50
  if (answers.sunscreenUse === "rarely" || answers.sunscreenUse === "never") {
    risks.push("Infrequent sunscreen use is a leading modifiable skin cancer risk factor (AAD)")
  }

  // Sunburns - each blistering sunburn meaningfully raises melanoma risk
  let burnScore: number
  const b = answers.sunburnsPerYear
  if (b === 0) burnScore = 100
  else if (b === 1) burnScore = 75
  else if (b === 2) burnScore = 50
  else if (b <= 4) burnScore = 25
  else burnScore = 5
  if (b >= 2) {
    risks.push(`${b} sunburns per year significantly increases melanoma risk`)
  }

  const sunbeds = answers.sunbedUse ?? "never"
  if (sunbeds === "occasional" || sunbeds === "regular") {
    risks.push(
      "Sunbeds are a proven cause of skin cancer (IARC Group 1): any use raises melanoma risk by 20%, and starting before 35 by 87% (Boniol et al. 2012)",
    )
  } else if (sunbeds === "past") {
    risks.push("Past sunbed use still counts: melanoma risk stays about 20% higher, or 87% higher if you started before 35 (Boniol et al. 2012)")
  }

  const flights = answers.flightHoursPerYear ?? "none"
  if (flights === "200-plus") {
    risks.push(
      "Flying over 200 hours a year adds more than 1 mSv of cosmic radiation: the EU dose limit for the public, and the level at which airlines must track their crews' doses",
    )
  } else if (flights === "100-200") {
    risks.push("Flying 100-200 hours a year adds 0.5-1 mSv of cosmic radiation, up to a third of a year's natural background")
  }

  const baseScore = exposureScore * 0.4 + sunscreenScore * 0.3 + burnScore * 0.3
  const score = Math.max(0, Math.round(baseScore - (SUNBED_PENALTY[sunbeds] ?? 0) - (FLIGHT_PENALTY[flights] ?? 0)))
  return { score, risks }
}

/**
 * Social connection score (0-100)
 * Based on Holt-Lunstad meta-analyses
 */
function scoreSocial(answers: LifestyleAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  const frequencyMap: Record<string, number> = {
    daily: 100,
    "several-weekly": 85,
    weekly: 65,
    monthly: 40,
    rarely: 15,
  }

  const qualityMap: Record<string, number> = {
    excellent: 100,
    good: 80,
    fair: 55,
    poor: 30,
    "very-poor": 10,
  }

  const frequencyScore = frequencyMap[answers.socialFrequency] ?? 50
  const qualityScore = qualityMap[answers.qualityRelationships] ?? 50
  const lonelinessScore = 100 - FREQ_MAP[answers.lonelinessFrequency] * 22

  if (answers.socialFrequency === "monthly" || answers.socialFrequency === "rarely") {
    risks.push("Low social connection: Holt-Lunstad meta-analysis shows social isolation increases mortality risk by 29%")
  }
  if (answers.lonelinessFrequency === "often" || answers.lonelinessFrequency === "always") {
    risks.push("Frequent loneliness is associated with depression, cognitive decline, and cardiovascular risk")
  }
  if (answers.qualityRelationships === "poor" || answers.qualityRelationships === "very-poor") {
    risks.push("Poor quality relationships can be as harmful as social isolation")
  }

  const score = Math.round(frequencyScore * 0.35 + qualityScore * 0.35 + lonelinessScore * 0.30)
  return { score: Math.max(0, Math.min(100, score)), risks }
}

/**
 * Leisure & lifestyle balance score (0-100)
 */
function scoreLeisure(answers: LifestyleAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  // Screen time penalty (recreational): >4h has negative health association
  let screenScore = 100
  if (answers.screenTimeHours > 2) {
    screenScore = Math.max(20, 100 - ((answers.screenTimeHours - 2) / 6) * 60)
  }
  if (answers.screenTimeHours >= 6) {
    risks.push("High recreational screen time (6+ hours) associated with sedentary behavior risks and poor sleep")
  }

  // Outdoor time bonus (White et al. 2019: >=120 min/week in nature linked to better health and wellbeing)
  let outdoorScore = 50 // baseline
  if (answers.outdoorTimeMinutes >= 60) {
    outdoorScore = 100
  } else if (answers.outdoorTimeMinutes >= 30) {
    outdoorScore = 75 + ((answers.outdoorTimeMinutes - 30) / 30) * 25
  } else if (answers.outdoorTimeMinutes >= 15) {
    outdoorScore = 50 + ((answers.outdoorTimeMinutes - 15) / 15) * 25
  } else {
    outdoorScore = Math.max(20, (answers.outdoorTimeMinutes / 15) * 30)
    risks.push("Limited outdoor time: regular exposure to nature benefits mental health and vitamin D levels")
  }

  // Hobbies engagement
  const hobbiesMap: Record<string, number> = {
    daily: 100,
    "several-weekly": 85,
    weekly: 65,
    monthly: 40,
    rarely: 20,
  }
  const hobbiesScore = hobbiesMap[answers.hobbiesEngagement] ?? 50

  if (answers.hobbiesEngagement === "rarely" || answers.hobbiesEngagement === "monthly") {
    risks.push("Limited engagement in hobbies/leisure activities reduces stress relief and life satisfaction")
  }

  const score = Math.round(screenScore * 0.35 + outdoorScore * 0.35 + hobbiesScore * 0.30)
  return { score: Math.max(0, Math.min(100, score)), risks }
}

// Points off the habits score. Daily smoking costs about 40 points, so daily cannabis sits below
// it (Storck 2025, Jeffers 2024) and weekly use of other drugs above it (6-10x mortality)
const CANNABIS_PENALTY: Record<NonNullable<LifestyleAnswers["cannabisUse"]>, number> = {
  never: 0,
  past: 2,
  former: 5,
  occasional: 8,
  weekly: 15,
  daily: 25,
}

const OTHER_DRUG_PENALTY: Record<NonNullable<LifestyleAnswers["otherDrugUse"]>, number> = {
  never: 0,
  past: 5,
  former: 15,
  occasional: 25,
  monthly: 45,
  weekly: 65,
}

const INJECTION_PENALTY: Record<NonNullable<LifestyleAnswers["injectedDrugs"]>, number> = {
  never: 0,
  past: 15,
  recent: 35,
}

type DrugAnswers = Pick<LifestyleAnswers, "cannabisUse" | "otherDrugUse" | "injectedDrugs">

export function reportsDrugUse(answers: DrugAnswers): boolean {
  return (answers.cannabisUse ?? "never") !== "never" || (answers.otherDrugUse ?? "never") !== "never"
}

function hasInjectedDrugs(answers: DrugAnswers): boolean {
  return reportsDrugUse(answers) && (answers.injectedDrugs === "past" || answers.injectedDrugs === "recent")
}

function drugUsePenalty(answers: DrugAnswers): number {
  const cannabis = CANNABIS_PENALTY[answers.cannabisUse ?? "never"] ?? 0
  const otherDrugs = OTHER_DRUG_PENALTY[answers.otherDrugUse ?? "never"] ?? 0
  const injection = reportsDrugUse(answers) ? (INJECTION_PENALTY[answers.injectedDrugs ?? "never"] ?? 0) : 0
  return cannabis + otherDrugs + injection
}

/**
 * Habits score (smoking + alcohol + caffeine, minus drug use) (0-100)
 * WHO/CDC evidence on smoking and alcohol health impacts
 */
function scoreHabits(answers: LifestyleAnswers): { score: number; risks: string[] } {
  const risks: string[] = []

  const smokingMap: Record<string, number> = {
    never: 100,
    former: 75,
    occasional: 40,
    daily: 10,
  }

  const alcoholFreqMap: Record<string, number> = {
    never: 100,
    monthly: 90,
    weekly: 70,
    "several-weekly": 45,
    daily: 15,
  }

  const smokingScore = smokingMap[answers.smokingStatus] ?? 60
  let alcoholScore = alcoholFreqMap[answers.alcoholFrequency] ?? 60

  // Adjust for units per session (heavy drinking episodes are particularly harmful)
  if (answers.alcoholUnitsPerSession > 4) {
    alcoholScore = Math.max(10, alcoholScore - (answers.alcoholUnitsPerSession - 4) * 8)
    risks.push("Heavy drinking episodes (4+ units) significantly increase health risks")
  }

  // Caffeine (moderate is fine, excessive can disrupt sleep)
  const caffeineMap: Record<string, number> = {
    none: 100,
    moderate: 95, // 1-3 cups is fine
    high: 70, // 4-6 cups
    excessive: 40, // 7+ cups
  }
  const caffeineScore = caffeineMap[answers.caffeineConsumption] ?? 80

  if (answers.smokingStatus === "daily") {
    risks.push("Daily smoking: WHO reports tobacco kills over 8 million people annually")
  }
  if (answers.smokingStatus === "occasional") {
    risks.push("Even occasional smoking carries significant health risks")
  }
  if (answers.alcoholFrequency === "daily" || answers.alcoholFrequency === "several-weekly") {
    risks.push("Frequent alcohol consumption: WHO states no level of alcohol is safe for health")
  }
  if (answers.caffeineConsumption === "excessive") {
    risks.push("Excessive caffeine can disrupt sleep, increase anxiety, and affect heart rhythm")
  }

  const cannabis = answers.cannabisUse
  if (cannabis === "weekly" || cannabis === "daily") {
    risks.push(
      "Regular cannabis use: across 24 studies it was linked to twice the risk of cardiovascular death and 29% more acute coronary syndromes (Storck et al. 2025)"
    )
  }

  const otherDrugs = answers.otherDrugUse
  if (otherDrugs === "weekly") {
    risks.push(
      "Weekly drug use: people who regularly use cocaine, amphetamines or opioids die at 6 to 10 times the usual rate, and opioid dependence shortens life by about 15 years (Lewer et al. 2020)"
    )
  } else if (otherDrugs === "occasional" || otherDrugs === "monthly") {
    risks.push(
      "Even occasional drug use carries acute risks: in the hour after taking cocaine, the risk of a heart attack is 24 times higher (Mittleman et al. 1999)"
    )
  }
  if (hasInjectedDrugs(answers)) {
    risks.push(
      "Injecting drugs, even once, can pass on hepatitis C, hepatitis B and HIV: worldwide, 39% of people who inject drugs have hepatitis C and 15% live with HIV (Degenhardt et al. 2023)"
    )
  }

  const substanceScore = smokingScore * 0.45 + alcoholScore * 0.40 + caffeineScore * 0.15
  const score = Math.max(0, substanceScore - drugUsePenalty(answers))

  return { score: Math.round(score), risks }
}

/**
 * Commute time score (0-100)
 * Hansson et al. 2011 (Sweden): commutes >45 min one-way associated with
 * +33% depression, +21% obesity, lower wellbeing. Each 10-min increment
 * correlates with worse health outcomes.
 */
function scoreCommute(answers: LifestyleAnswers): { score: number; risks: string[] } {
  const risks: string[] = []
  const m = answers.commuteMinutesOneWay
  let score: number
  if (m <= 5) score = 100 // remote/very close
  else if (m <= 15) score = 95
  else if (m <= 30) score = 80
  else if (m <= 45) score = 60
  else if (m <= 60) score = 40
  else if (m <= 90) score = 20
  else score = 5

  if (m >= 45) {
    risks.push(`Commute of ${m}+ minutes one-way is associated with elevated depression and obesity risk (Hansson et al. 2011)`)
  }
  return { score, risks }
}

/**
 * Sauna use score (0-100)
 * Laukkanen et al. 2015 (JAMA): 4-7 sauna sessions/week associated with
 * 40% lower all-cause mortality and 50% lower cardiovascular mortality
 * vs 1 session/week. Robust Finnish cohort with dose-response.
 */
function scoreSauna(answers: LifestyleAnswers): { score: number; risks: string[] } {
  const risks: string[] = []
  const s = answers.saunaSessionsPerWeek
  // Default baseline 50 (most people don't sauna; not a deficit per se)
  let score: number
  if (s === 0) score = 50
  else if (s === 1) score = 65
  else if (s <= 3) score = 80
  else if (s <= 7) score = 100
  else score = 90 // diminishing/no extra benefit
  return { score, risks }
}

/**
 * Main lifestyle assessment function
 * Sub-domain weights: Sleep 22%, Social 16%, Sedentary 13%, Sun & radiation 8%,
 * Leisure 12%, Commute 8%, Sauna 5%, Habits 16%
 */
export function calculateLifestyle(answers: LifestyleAnswers, options: { uvFactor?: number } = {}): LifestyleResult {
  const sl = scoreSleep(answers)
  const so = scoreSocial(answers)
  const le = scoreLeisure(answers)
  const sd = scoreSedentary(answers)
  const su = scoreSun(answers, options.uvFactor)
  const cm = scoreCommute(answers)
  const sa = scoreSauna(answers)
  const hb = scoreHabits(answers)

  const allRisks = [...sl.risks, ...so.risks, ...le.risks, ...sd.risks, ...su.risks, ...cm.risks, ...sa.risks, ...hb.risks]

  const overallScore = Math.round(
    sl.score * 0.22 +
    so.score * 0.16 +
    le.score * 0.12 +
    sd.score * 0.13 +
    su.score * 0.08 +
    cm.score * 0.08 +
    sa.score * 0.05 +
    hb.score * 0.16
  )

  const recommendations: string[] = []

  if (sl.score < 60) recommendations.push("Prioritize sleep hygiene: consistent schedule, dark/cool room, limit screens before bed.")
  if (so.score < 60) recommendations.push("Strengthen social connections: schedule regular time with friends/family, join community groups.")
  if (le.score < 60) recommendations.push("Balance screen time with outdoor activities and hobbies you enjoy.")
  if (sd.score < 60) recommendations.push("Break up sitting time: stand or move every 30-60 minutes; aim for under 8 hours sitting per day.")
  const [sunLow, sunHigh] = sunExposureBands(options.uvFactor).window
  if (su.score < 60) recommendations.push(`Aim for ${sunLow}-${sunHigh} minutes of daily sun at your local UV level; use sunscreen and avoid sunburns to balance vitamin D and skin cancer risk.`)
  if (answers.sunbedUse === "occasional" || answers.sunbedUse === "regular") {
    recommendations.push("Stop using sunbeds: the European Code Against Cancer (2025) advises against any use. Use self-tanning lotion for colour, and have your skin checked, as sunbed users develop more melanomas.")
  } else if (answers.sunbedUse === "past") {
    recommendations.push("After past sunbed use, check your skin for new or changing moles and ask your doctor about a skin exam.")
  }
  if (answers.flightHoursPerYear === "200-plus") {
    recommendations.push("Long-haul and polar routes give the highest cosmic doses. If you're pregnant, count your flights: the EU protects pregnant aircrew at the public level, 1 mSv for the rest of the pregnancy.")
  }
  if (cm.score < 60) recommendations.push("Long commutes harm health: consider remote work, moving closer to work, or using commute time productively (audiobooks, podcasts, transit reading).")
  if (sa.score < 60) recommendations.push("Regular sauna use (4+ sessions/week) is associated with major cardiovascular benefits in long-term Finnish data.")
  if (hb.score < 60) recommendations.push("Cutting down on smoking, alcohol and drugs is among the highest-impact changes for longevity.")
  if (answers.bedroomLight === "some-light" || answers.bedroomLight === "bright") {
    recommendations.push("Make your bedroom dark: blackout curtains or an eye mask, cover standby lights, and switch off the TV and screens before you fall asleep.")
  }
  if (answers.cannabisUse === "weekly" || answers.cannabisUse === "daily") {
    recommendations.push("Cut down on cannabis, especially smoked: regular use is linked to more heart attacks, strokes and cardiovascular deaths, and mixing it with tobacco adds the harms of smoking.")
  }
  if (answers.otherDrugUse === "occasional" || answers.otherDrugUse === "monthly" || answers.otherDrugUse === "weekly") {
    recommendations.push("Consider stopping drug use; your doctor or a local drug service can help in confidence. If you do use, don't use alone, don't mix drugs with alcohol or sleeping pills, and use a drug-checking service where one exists.")
  }
  if (hasInjectedDrugs(answers)) {
    recommendations.push("Get tested for hepatitis C, hepatitis B and HIV: the US CDC asks anyone who has ever injected drugs, even once or years ago, to test, and to retest every year while injecting. Ask about the hepatitis B vaccine too.")
  }

  if (overallScore >= 80) {
    recommendations.push("Your lifestyle profile is strong. Maintain these healthy habits.")
  }

  return {
    overallScore: Math.max(0, Math.min(100, overallScore)),
    subScores: {
      sleep: sl.score,
      social: so.score,
      leisure: le.score,
      sedentary: sd.score,
      sun: su.score,
      commute: cm.score,
      sauna: sa.score,
      habits: hb.score,
    },
    riskFactors: allRisks,
    recommendations,
  }
}
