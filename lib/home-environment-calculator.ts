/**
 * Home Environment & Household Exposures assessment.
 *
 * Covers three research-backed clusters of modifiable household exposures:
 *
 * 1) Cookware & food-contact plastics
 *    - Scratched nonstick (PTFE/Teflon) cookware: a single surface crack can release
 *      ~9,100 microplastic particles and a badly broken coating up to ~2.3 million
 *      particles during cooking (Luo et al. 2022, Science of the Total Environment).
 *      PTFE manufacture is historically linked to PFOA/PFAS (C8 Science Panel; Steenland 2020).
 *    - Microwaving/heating food in plastic: 3 min of microwaving polypropylene containers
 *      can release >2 billion nanoplastics + ~4 million microplastics per cm²
 *      (Hussain et al. 2023, Environ. Sci. Technol.).
 *    - Plastic food storage leaches BPA/phthalates; switching to glass/steel lowers
 *      urinary BPA (Carwile et al. 2011; Muncke 2011).
 *
 * 2) Food safety (mold/mycotoxins) & household cleaning
 *    - Aflatoxin B1 from moldy grains/nuts is an IARC Group 1 human carcinogen (liver cancer);
 *      mycotoxins penetrate beyond visible mold, so soft moldy foods should be discarded
 *      whole, not cut around (USDA; IARC).
 *    - House dust is a major reservoir of PBDEs, phthalates, PFAS and lead — dozens of
 *      endocrine-disrupting chemicals (Mitro et al. 2016, Environ. Sci. Technol.);
 *      regular wet-dusting/HEPA vacuuming reduces ingestion/inhalation.
 *    - Regular use of cleaning sprays is associated with accelerated lung-function decline
 *      over 20 years, comparable to smoking 10-20 cigarettes/day (Svanes et al. 2018,
 *      Am. J. Respir. Crit. Care Med.). Fragrance-free / low-VOC ("eco/bio") products reduce this.
 *
 * 3) Indoor air quality
 *    - Gas stoves: ~12.7% of US childhood asthma is attributable to gas-stove NO2
 *      (Gruenwald et al. 2023). Vented range hoods sharply cut indoor NO2/PM2.5.
 *    - Indoor dampness/mould raises respiratory illness ~30-50% (WHO 2009; Fisk et al. 2007).
 *    - Radon is the 2nd leading cause of lung cancer (~21,000 US deaths/yr; US EPA) and is
 *      only detectable by testing.
 *    - Ventilation, HEPA filtration, and avoiding scented candles/incense (VOCs, benzene,
 *      formaldehyde, fine particulates) all improve indoor air.
 *
 * NOTE: Educational composite. Rewards present-day protective behaviors and flags
 * common, fixable household exposures without alarmism.
 */

export interface HomeEnvironmentAnswers {
  // --- 1) Cookware & food-contact plastics ---
  cookwareType:
    | "inert" // stainless steel, cast iron, glass, ceramic
    | "mixed" // some inert, some nonstick in good shape
    | "nonstick-good" // mostly nonstick, intact coating
    | "nonstick-scratched" // nonstick with visibly scratched/flaking coating
  foodStorage:
    | "glass-steel" // almost all glass/stainless
    | "mostly-glass"
    | "mixed"
    | "mostly-plastic"
  heatingInPlastic: "never" | "rarely" | "sometimes" | "often" // microwaving/serving hot food in plastic

  // --- 2) Food safety & cleaning ---
  expiryAttention: "always" | "usually" | "sometimes" | "rarely" // checking dates & freshness
  moldyFoodHandling:
    | "discard-whole" // throw away the whole item (correct for soft foods)
    | "depends" // discard soft, trim hard cheeses/firm produce
    | "cut-around" // routinely cut mold off and eat the rest
  dustingFrequency: "weekly" | "biweekly" | "monthly" | "rarely"
  cleaningProducts:
    | "eco-lowvoc" // fragrance-free / eco / "bio-line" / mostly natural
    | "mixed"
    | "conventional" // standard scented sprays/cleaners
    | "heavy-bleach" // frequent bleach/ammonia/strong sprays, poorly ventilated

  // --- 3) Indoor air quality ---
  ventilation: "daily-airing" | "mechanical-hrv" | "occasional" | "rarely"
  cookingVentilation: "vented-hood" | "recirc-hood" | "open-window" | "none"
  cookingFuel: "induction" | "electric" | "gas"
  dampMold: "none" | "minor-past" | "occasional-condensation" | "visible-mold"
  airPurifier: "hepa-regular" | "sometimes" | "none"
  scentedProducts: "none" | "occasional" | "frequent" // candles / incense / plug-in air fresheners
  radonStatus: "tested-safe" | "mitigated" | "not-tested" | "high-untested"
  smokeIndoors: "never" | "occasional" | "regular" // tobacco/vape smoked inside the home
}

export interface HomeEnvironmentResult {
  overallScore: number
  subScores: {
    cookware: number
    foodAndCleaning: number
    indoorAir: number
  }
  protectiveFactors: string[]
  riskFactors: string[]
  recommendations: string[]
}

function scoreCookware(a: HomeEnvironmentAnswers): { score: number; protective: string[]; risks: string[] } {
  const protective: string[] = []
  const risks: string[] = []

  const cookwareMap: Record<HomeEnvironmentAnswers["cookwareType"], number> = {
    inert: 100,
    mixed: 75,
    "nonstick-good": 55,
    "nonstick-scratched": 20,
  }
  const cookwareScore = cookwareMap[a.cookwareType]
  if (a.cookwareType === "inert") {
    protective.push("Inert cookware (stainless steel / cast iron / glass) avoids PTFE & coating microplastics")
  } else if (a.cookwareType === "nonstick-scratched") {
    risks.push("Scratched nonstick pans can shed ~9,100+ microplastic particles per crack (Luo 2022) — replace them")
  } else if (a.cookwareType === "nonstick-good") {
    risks.push("Intact nonstick is lower-risk but degrades over time — use only non-abrasive utensils & low/medium heat")
  }

  const storageMap: Record<HomeEnvironmentAnswers["foodStorage"], number> = {
    "glass-steel": 100,
    "mostly-glass": 85,
    mixed: 60,
    "mostly-plastic": 35,
  }
  const storageScore = storageMap[a.foodStorage]
  if (a.foodStorage === "glass-steel" || a.foodStorage === "mostly-glass") {
    protective.push("Glass/steel food storage minimizes BPA & phthalate migration (Carwile 2011)")
  } else if (a.foodStorage === "mostly-plastic") {
    risks.push("Mostly plastic storage increases BPA/phthalate exposure, especially with fatty or acidic foods")
  }

  const heatMap: Record<HomeEnvironmentAnswers["heatingInPlastic"], number> = {
    never: 100,
    rarely: 80,
    sometimes: 50,
    often: 20,
  }
  const heatScore = heatMap[a.heatingInPlastic]
  if (a.heatingInPlastic === "often" || a.heatingInPlastic === "sometimes") {
    risks.push("Microwaving food in plastic can release billions of nanoplastics (Hussain 2023) — use glass/ceramic instead")
  } else if (a.heatingInPlastic === "never") {
    protective.push("Never heating food in plastic avoids heat-driven nano/microplastic release")
  }

  const score = Math.round(cookwareScore * 0.4 + storageScore * 0.3 + heatScore * 0.3)
  return { score, protective, risks }
}

function scoreFoodAndCleaning(a: HomeEnvironmentAnswers): { score: number; protective: string[]; risks: string[] } {
  const protective: string[] = []
  const risks: string[] = []

  const expiryMap: Record<HomeEnvironmentAnswers["expiryAttention"], number> = {
    always: 100,
    usually: 80,
    sometimes: 55,
    rarely: 30,
  }
  const expiryScore = expiryMap[a.expiryAttention]
  if (a.expiryAttention === "rarely") {
    risks.push("Not tracking freshness raises risk of mold & mycotoxin (aflatoxin, IARC Group 1) exposure")
  }

  const moldMap: Record<HomeEnvironmentAnswers["moldyFoodHandling"], number> = {
    "discard-whole": 100,
    depends: 80,
    "cut-around": 35,
  }
  const moldScore = moldMap[a.moldyFoodHandling]
  if (a.moldyFoodHandling === "discard-whole" || a.moldyFoodHandling === "depends") {
    protective.push("Discarding moldy soft foods whole avoids mycotoxins that spread beyond visible mold (USDA)")
  } else if (a.moldyFoodHandling === "cut-around") {
    risks.push("Cutting mold off soft foods leaves mycotoxins behind — discard soft moldy items entirely")
  }

  const dustMap: Record<HomeEnvironmentAnswers["dustingFrequency"], number> = {
    weekly: 100,
    biweekly: 80,
    monthly: 55,
    rarely: 30,
  }
  const dustScore = dustMap[a.dustingFrequency]
  if (a.dustingFrequency === "weekly") {
    protective.push("Frequent dusting lowers exposure to dust-bound PBDEs, phthalates, PFAS & lead (Mitro 2016)")
  } else if (a.dustingFrequency === "rarely") {
    risks.push("Infrequent dusting lets endocrine-disrupting chemicals accumulate in house dust")
  }

  const cleanMap: Record<HomeEnvironmentAnswers["cleaningProducts"], number> = {
    "eco-lowvoc": 100,
    mixed: 70,
    conventional: 50,
    "heavy-bleach": 25,
  }
  const cleanScore = cleanMap[a.cleaningProducts]
  if (a.cleaningProducts === "eco-lowvoc") {
    protective.push("Fragrance-free / low-VOC ('bio') cleaners reduce airway irritation (Svanes 2018)")
  } else if (a.cleaningProducts === "heavy-bleach" || a.cleaningProducts === "conventional") {
    risks.push("Regular cleaning sprays are linked to lung-function decline akin to smoking 10-20 cigs/day (Svanes 2018)")
  }

  const score = Math.round(
    expiryScore * 0.25 + moldScore * 0.25 + dustScore * 0.2 + cleanScore * 0.3
  )
  return { score, protective, risks }
}

function scoreIndoorAir(a: HomeEnvironmentAnswers): { score: number; protective: string[]; risks: string[] } {
  const protective: string[] = []
  const risks: string[] = []

  const ventMap: Record<HomeEnvironmentAnswers["ventilation"], number> = {
    "mechanical-hrv": 100,
    "daily-airing": 90,
    occasional: 55,
    rarely: 25,
  }
  const ventScore = ventMap[a.ventilation]
  if (a.ventilation === "rarely") {
    risks.push("Poor ventilation traps CO2, VOCs and moisture indoors")
  } else if (a.ventilation === "mechanical-hrv" || a.ventilation === "daily-airing") {
    protective.push("Good ventilation flushes out indoor pollutants and excess humidity")
  }

  const cookVentMap: Record<HomeEnvironmentAnswers["cookingVentilation"], number> = {
    "vented-hood": 100,
    "open-window": 70,
    "recirc-hood": 50,
    none: 25,
  }
  const cookVentScore = cookVentMap[a.cookingVentilation]

  const fuelMap: Record<HomeEnvironmentAnswers["cookingFuel"], number> = {
    induction: 100,
    electric: 95,
    gas: 50,
  }
  const fuelScore = fuelMap[a.cookingFuel]
  if (a.cookingFuel === "gas") {
    if (a.cookingVentilation === "vented-hood") {
      protective.push("Gas stove vented externally — keep using the hood to limit NO2 buildup")
    } else {
      risks.push("Gas cooking without external venting raises indoor NO2 (~12.7% of childhood asthma, Gruenwald 2023)")
    }
  }

  const dampMap: Record<HomeEnvironmentAnswers["dampMold"], number> = {
    none: 100,
    "minor-past": 80,
    "occasional-condensation": 55,
    "visible-mold": 20,
  }
  const dampScore = dampMap[a.dampMold]
  if (a.dampMold === "visible-mold") {
    risks.push("Visible indoor mould/damp raises respiratory illness ~30-50% (WHO 2009) — address the moisture source")
  } else if (a.dampMold === "none") {
    protective.push("A dry, mould-free home protects respiratory health")
  }

  const purifierMap: Record<HomeEnvironmentAnswers["airPurifier"], number> = {
    "hepa-regular": 100,
    sometimes: 75,
    none: 60,
  }
  const purifierScore = purifierMap[a.airPurifier]
  if (a.airPurifier === "hepa-regular") {
    protective.push("Regular HEPA filtration lowers indoor fine-particulate (PM2.5) exposure")
  }

  const scentMap: Record<HomeEnvironmentAnswers["scentedProducts"], number> = {
    none: 100,
    occasional: 70,
    frequent: 35,
  }
  const scentScore = scentMap[a.scentedProducts]
  if (a.scentedProducts === "frequent") {
    risks.push("Frequent candles/incense/air fresheners emit VOCs (benzene, formaldehyde) and fine particulates")
  }

  const radonMap: Record<HomeEnvironmentAnswers["radonStatus"], number> = {
    "tested-safe": 100,
    mitigated: 90,
    "not-tested": 60,
    "high-untested": 10,
  }
  const radonScore = radonMap[a.radonStatus]
  if (a.radonStatus === "tested-safe" || a.radonStatus === "mitigated") {
    protective.push("Radon addressed — radon is the 2nd leading cause of lung cancer (US EPA)")
  } else if (a.radonStatus === "high-untested") {
    risks.push("Known/likely high radon left unmitigated is a major lung-cancer risk — install mitigation")
  } else if (a.radonStatus === "not-tested") {
    risks.push("Home never tested for radon — inexpensive test kits are widely available")
  }

  const smokeMap: Record<HomeEnvironmentAnswers["smokeIndoors"], number> = {
    never: 100,
    occasional: 45,
    regular: 10,
  }
  const smokeScore = smokeMap[a.smokeIndoors]
  if (a.smokeIndoors === "regular") {
    risks.push("Indoor tobacco/vape smoke is a primary source of harmful indoor particulates")
  } else if (a.smokeIndoors === "never") {
    protective.push("Smoke-free home eliminates a major indoor air pollutant")
  }

  const score = Math.round(
    ventScore * 0.14 +
    cookVentScore * 0.12 +
    fuelScore * 0.1 +
    dampScore * 0.18 +
    purifierScore * 0.08 +
    scentScore * 0.1 +
    radonScore * 0.13 +
    smokeScore * 0.15
  )
  return { score, protective, risks }
}

export function calculateHomeEnvironment(a: HomeEnvironmentAnswers): HomeEnvironmentResult {
  const c = scoreCookware(a)
  const fc = scoreFoodAndCleaning(a)
  const ia = scoreIndoorAir(a)

  const overallScore = Math.round(c.score * 0.3 + fc.score * 0.33 + ia.score * 0.37)

  const protectiveFactors = [...c.protective, ...fc.protective, ...ia.protective]
  const riskFactors = [...c.risks, ...fc.risks, ...ia.risks]

  const recommendations: string[] = []
  if (a.cookwareType === "nonstick-scratched") {
    recommendations.push("Replace scratched nonstick pans with stainless steel, cast iron, or glass.")
  }
  if (a.foodStorage === "mostly-plastic" || a.heatingInPlastic === "often" || a.heatingInPlastic === "sometimes") {
    recommendations.push("Store and reheat food in glass or ceramic rather than plastic, especially hot or fatty foods.")
  }
  if (a.moldyFoodHandling === "cut-around") {
    recommendations.push("Discard soft moldy foods entirely — mycotoxins spread beyond the visible mold.")
  }
  if (a.cleaningProducts === "heavy-bleach" || a.cleaningProducts === "conventional") {
    recommendations.push("Switch to fragrance-free / low-VOC ('bio') cleaners and ventilate while cleaning.")
  }
  if (a.dustingFrequency === "rarely" || a.dustingFrequency === "monthly") {
    recommendations.push("Wet-dust and HEPA-vacuum weekly to reduce dust-bound chemical exposure.")
  }
  if (a.cookingFuel === "gas" && a.cookingVentilation !== "vented-hood") {
    recommendations.push("Use an externally-vented range hood (or open a window) every time you cook on gas.")
  }
  if (a.dampMold === "visible-mold" || a.dampMold === "occasional-condensation") {
    recommendations.push("Fix the moisture source and remediate mould; keep indoor humidity below ~50%.")
  }
  if (a.radonStatus === "not-tested" || a.radonStatus === "high-untested") {
    recommendations.push("Test your home for radon with an inexpensive kit; mitigate if levels are elevated.")
  }
  if (a.ventilation === "rarely" || a.ventilation === "occasional") {
    recommendations.push("Air out your home daily, even briefly, to flush indoor pollutants.")
  }
  if (overallScore >= 80) {
    recommendations.push("Your home environment shows strong protective habits — maintain them.")
  }

  return {
    overallScore: Math.max(0, Math.min(100, overallScore)),
    subScores: {
      cookware: c.score,
      foodAndCleaning: fc.score,
      indoorAir: ia.score,
    },
    protectiveFactors,
    riskFactors,
    recommendations,
  }
}
