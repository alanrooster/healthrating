/**
 * Home Environment & Household Exposures assessment.
 *
 * Covers five research-backed clusters of modifiable household exposures:
 *
 * 1) Cookware & food-contact plastics
 *    - Scratched nonstick (PTFE/Teflon) cookware: a single surface crack can release
 *      ~9,100 microplastic particles and a badly broken coating up to ~2.3 million
 *      particles during cooking (Luo et al. 2022, Science of the Total Environment).
 *      PTFE manufacture is historically linked to PFOA/PFAS (C8 Science Panel; Steenland 2020).
 *    - Microwaving/heating food in plastic: 3 min of microwaving polypropylene containers
 *      can release >2 billion nanoplastics + ~4 million microplastics per cm²
 *      (Hussain et al. 2023, Environ. Sci. Technol.).
 *    - Plastic and canned food packaging leaches BPA/phthalates: three days of fresh food with
 *      little packaging cut urinary BPA by 66% and DEHP metabolites by 53-56% (Rudel et al.
 *      2011, Environ. Health Perspect.). EFSA (2023) cut the BPA tolerable
 *      daily intake 20,000-fold and the EU banned BPA in food-contact materials
 *      (Regulation (EU) 2024/3190).
 *
 * 2) Food safety (mold/mycotoxins) & household cleaning
 *    - Aflatoxin B1 from moldy grains/nuts is an IARC Group 1 human carcinogen (liver cancer);
 *      mycotoxins penetrate beyond visible mold, so soft moldy foods should be discarded
 *      whole, not cut around (USDA; IARC).
 *    - House dust is a major reservoir of PBDEs, phthalates, PFAS and lead — dozens of
 *      endocrine-disrupting chemicals (Mitro et al. 2016, Environ. Sci. Technol.);
 *      regular wet-dusting/HEPA vacuuming reduces ingestion/inhalation.
 *    - In women, cleaning at home went with faster lung-function decline over 20 years (FEV1
 *      -22.1 vs -18.5 ml a year), with both sprays and other cleaning agents; no effect was seen
 *      in men (Svanes et al. 2018, Am. J. Respir. Crit. Care Med.). Fragrance-free / low-VOC
 *      ("eco/bio") products and ventilation limit the exposure.
 *
 * 3) Indoor air quality
 *    - Gas stoves: ~12.7% of US childhood asthma is attributable to gas-stove NO2
 *      (Gruenwald et al. 2023). Vented range hoods sharply cut indoor NO2/PM2.5.
 *    - Indoor dampness/mould raises respiratory illness ~30-50% (WHO 2009; Fisk et al. 2007).
 *    - Ventilation, HEPA filtration, and avoiding scented candles/incense (VOCs, benzene,
 *      formaldehyde, fine particulates) all improve indoor air.
 *
 * 4) PFAS in textiles & personal care
 *    - Water-, stain- and oil-repellent finishes are a common PFAS use: all 57 stain-resistant
 *      children's items tested contained PFAS, school uniforms on a par with outdoor wear
 *      (Xia et al. 2022, Environ. Sci. Technol.).
 *    - PFAS pass into human skin: 3D skin models absorbed up to 59% of short-chain doses and
 *      retained long-chain PFAS in the tissue (Ragnarsdóttir et al. 2024, Environ. Int.); sweat
 *      multiplied modelled uptake from treated textiles (Li et al. 2025, Sci. Total Environ.).
 *    - High fluorine in 82% of waterproof mascaras (Whitehead et al. 2021, ES&T Letters); Oral-B
 *      Glide floss and stain-resistant carpets/furniture linked to higher serum PFAS (Boronow et
 *      al. 2019, JESEE); PFHxA in fluoroelastomer watch bands (Wicks et al. 2025, ES&T Letters).
 *    - PFAS-free furniture and carpet cut PFAS in dust by 78% (Young et al. 2021, Environ. Int.).
 *    - Skin contact is usually a small share of total PFAS intake next to other routes, mainly
 *      food and drinking water (Heywood et al. 2026, Risk Analysis, 37 studies).
 *
 * 5) Radiation & fields
 *    - Radon is the 2nd leading cause of lung cancer (~21,000 US deaths/yr; US EPA) and is
 *      only detectable by testing.
 *    - Building materials: tuff, pozzolana, lava, granites and other igneous stone and alum-shale
 *      are on the EU list of materials of concern for gamma radiation, with a reference level of
 *      1 mSv a year indoors (Directive 2013/59/Euratom, Art. 75 and Annex XIII). Stone and bare
 *      earthen walls or floors also give off thoron (radon-220): with a 55.6-second half-life it
 *      stays close to the surface (Tokonami 2020, IJERPH), reaches high levels in earthen houses
 *      (Front Public Health 2019) and isn't measured reliably by ordinary radon tests (thoron
 *      interference, IJERPH 2020). Plaster or paint holds thoron back but not gamma rays.
 *    - Power lines: magnetic fields are IARC Group 2B. Children living under 50 m from 200 kV+
 *      lines had OR 1.33 (0.92-1.93) for leukaemia in an international pooled analysis (Amoon et
 *      al., Br J Cancer 2018), with no consistent link in adults, so the item only counts with
 *      children at home. 50-200 m scores 90, the stricter reading of a null result there.
 *    - Not scored: home altitude (Colorado or New Mexico residents get about 1.5 mSv a year more
 *      than at sea level, RadiologyInfo 2025, but cohort studies find less heart disease and stroke
 *      higher up: -22% and -12% per 1,000 m, Faeh et al., Circulation 2009) and
 *      radiofrequency from phones, Wi-Fi or base stations (no raised cancer risk in the WHO
 *      review, Karipidis et al., Environ Int 2024; Elliott et al., BMJ 2010 for base stations).
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

  // --- 4) PFAS in textiles & personal care ---
  // Optional because answers saved before these questions existed lack them; missing = "unsure"
  repellentClothing?: "pfas-free" | "outer-layer" | "next-to-skin" | "unsure" // water/stain/oil-repellent finishes
  pfasPersonalCare?: "none" | "one" | "two-plus" | "unsure" // daily waterproof make-up, PTFE floss, FKM watch band
  stainTreatedFurnishings?: "none" | "some" | "most" | "unsure" // stain-resistant carpets, rugs, sofas

  // --- 5) Radiation & fields (radonStatus above scores here too) ---
  // Optional for the same reason: missing walls = "unsure"; a missing power line counts as none
  wallMaterial?:
    | "brick-concrete"
    | "wood" // timber frame, plasterboard
    | "stone-covered" // tuff, granite, lava or other natural stone, plastered or painted inside
    | "stone-bare"
    | "earth-covered" // adobe, rammed earth, cob, clay plaster, painted or plastered
    | "earth-bare"
    | "unsure"
  powerLineDistance?: "none" | "50-200" | "under-50" | "unsure" // high-voltage overhead lines (large pylons)
  childrenAtHome?: "yes" | "no" // under 15; asked when a line may be within 200 m
}

export interface HomeEnvironmentResult {
  overallScore: number
  subScores: {
    cookware: number
    foodAndCleaning: number
    indoorAir: number
    pfasProducts?: number // absent in results saved before PFAS products were scored
    radiation?: number // absent in results saved before the radiation cluster existed
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
    protective.push("Glass/steel food storage keeps BPA & phthalates out of food: cutting plastic and canned packaging lowered urinary BPA by 66% (Rudel 2011)")
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
    protective.push("Fragrance-free / low-VOC ('bio') cleaners keep irritant sprays and VOCs out of the air you breathe")
  } else if (a.cleaningProducts === "heavy-bleach" || a.cleaningProducts === "conventional") {
    risks.push("In women, regular cleaning with sprays and other agents was linked to faster lung-function decline over 20 years (Svanes 2018)")
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

  // The old weights without radon (13%, now in the radiation cluster), rescaled to 100%
  const score = Math.round(
    ventScore * 0.16 +
    cookVentScore * 0.14 +
    fuelScore * 0.11 +
    dampScore * 0.21 +
    purifierScore * 0.09 +
    scentScore * 0.11 +
    smokeScore * 0.18
  )
  return { score, protective, risks }
}

type WallMaterial = NonNullable<HomeEnvironmentAnswers["wallMaterial"]>
type PowerLineDistance = NonNullable<HomeEnvironmentAnswers["powerLineDistance"]>

// Plaster or paint holds thoron back but not gamma rays, so covered stone stays below covered
// earth. "unsure" scores 85, not the PFAS 70: most homes are brick, concrete or wood.
const WALL_SCORE: Record<WallMaterial, number> = {
  "brick-concrete": 100,
  wood: 100,
  "stone-covered": 70,
  "stone-bare": 50,
  "earth-covered": 85,
  "earth-bare": 60,
  unsure: 85,
}
// Only scored with children at home (Amoon 2018); 50-200 m and "unsure" take the stricter reading
const POWER_LINE_SCORE_WITH_CHILDREN: Record<PowerLineDistance, number> = {
  none: 100,
  "50-200": 90,
  "under-50": 50,
  unsure: 90,
}

export function childrenNearPowerLine(a: Pick<HomeEnvironmentAnswers, "powerLineDistance" | "childrenAtHome">): boolean {
  return a.childrenAtHome === "yes" && (a.powerLineDistance ?? "none") !== "none"
}

function scoreRadiation(a: HomeEnvironmentAnswers): { score: number; protective: string[]; risks: string[] } {
  const protective: string[] = []
  const risks: string[] = []

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

  const walls = a.wallMaterial ?? "unsure"
  if (walls === "stone-covered" || walls === "stone-bare") {
    risks.push(
      "Tuff, granite, lava and other volcanic or igneous stone are on the EU list of building materials of concern for gamma radiation, and also release radon and thoron",
    )
  }
  if (walls === "stone-bare" || walls === "earth-bare") {
    risks.push("Bare stone or earthen walls and floors give off thoron (radon-220), which ordinary radon tests don't measure reliably")
  }

  const line = a.powerLineDistance ?? "none"
  const lineScore = childrenNearPowerLine(a) ? POWER_LINE_SCORE_WITH_CHILDREN[line] : 100
  if (a.childrenAtHome === "yes" && line === "under-50") {
    risks.push(
      "Children living within 50 m of a high-voltage line had a weak, uncertain link with leukaemia (OR 1.33, 95% CI 0.92-1.93; Amoon 2018): power-line magnetic fields are possibly carcinogenic (IARC 2B)",
    )
  }

  const score = Math.round(radonScore * 0.6 + WALL_SCORE[walls] * 0.25 + lineScore * 0.15)
  return { score, protective, risks }
}

type RepellentClothing = NonNullable<HomeEnvironmentAnswers["repellentClothing"]>
type PfasPersonalCare = NonNullable<HomeEnvironmentAnswers["pfasPersonalCare"]>
type StainTreatedFurnishings = NonNullable<HomeEnvironmentAnswers["stainTreatedFurnishings"]>

// "unsure" scores 70, like an unchecked supply in the Water PFAS score: most homes hold some
// treated items
function scorePfasProducts(a: HomeEnvironmentAnswers): { score: number; protective: string[]; risks: string[] } {
  const protective: string[] = []
  const risks: string[] = []

  const clothing = a.repellentClothing ?? "unsure"
  const clothingMap: Record<RepellentClothing, number> = {
    "pfas-free": 100,
    "outer-layer": 80,
    "next-to-skin": 40,
    unsure: 70,
  }
  if (clothing === "pfas-free") {
    protective.push("No PFAS-finished clothing: PFAS can pass into the skin, more so with sweat (Ragnarsdóttir 2024; Li 2025)")
  } else if (clothing === "next-to-skin") {
    risks.push("Stain- or water-repellent clothing worn against the skin is direct PFAS contact, and sweat raises uptake (Li 2025)")
  }

  const care = a.pfasPersonalCare ?? "unsure"
  const careMap: Record<PfasPersonalCare, number> = {
    none: 100,
    one: 65,
    "two-plus": 40,
    unsure: 70,
  }
  if (care === "none") {
    protective.push("No daily waterproof make-up, PTFE floss or fluoroelastomer watch band")
  } else if (care === "one" || care === "two-plus") {
    risks.push("Waterproof make-up, PTFE floss and fluoroelastomer watch bands are daily PFAS contacts (Whitehead 2021; Boronow 2019; Wicks 2025)")
  }

  const furnishings = a.stainTreatedFurnishings ?? "unsure"
  const furnishingsMap: Record<StainTreatedFurnishings, number> = {
    none: 100,
    some: 65,
    most: 35,
    unsure: 70,
  }
  if (furnishings === "none") {
    protective.push("Untreated furnishings keep PFAS out of house dust (78% less in Young 2021)")
  } else if (furnishings === "some" || furnishings === "most") {
    risks.push("Stain-resistant carpets and sofas shed PFAS into dust and were linked to higher blood PFAS (Boronow 2019)")
  }

  const score = Math.round(clothingMap[clothing] * 0.4 + careMap[care] * 0.3 + furnishingsMap[furnishings] * 0.3)
  return { score, protective, risks }
}

export function calculateHomeEnvironment(a: HomeEnvironmentAnswers): HomeEnvironmentResult {
  const c = scoreCookware(a)
  const fc = scoreFoodAndCleaning(a)
  const ia = scoreIndoorAir(a)
  const p = scorePfasProducts(a)
  const r = scoreRadiation(a)

  // PFAS products weigh about 10%, as PFAS does in the Water score: skin contact is a smaller
  // route than food and drinking water (Heywood 2026). Radiation takes 8%, which keeps radon's
  // share of the total close to its old 13% of indoor air; the others shrink in proportion.
  const overallScore = Math.round(c.score * 0.25 + fc.score * 0.28 + ia.score * 0.3 + p.score * 0.09 + r.score * 0.08)

  const protectiveFactors = [...c.protective, ...fc.protective, ...ia.protective, ...p.protective, ...r.protective]
  const riskFactors = [...c.risks, ...fc.risks, ...ia.risks, ...p.risks, ...r.risks]

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
  if (a.wallMaterial === "stone-covered" || a.wallMaterial === "stone-bare" || a.wallMaterial === "earth-covered" || a.wallMaterial === "earth-bare") {
    recommendations.push("With stone or earthen walls, ask for a test that reports thoron separately from radon (most radon tests don't), seal bare walls and floors with plaster, paint or tiles, and air rooms daily.")
  }
  if (a.childrenAtHome === "yes" && a.powerLineDistance === "under-50") {
    recommendations.push("Near a high-voltage line, there's no need to move: the link is weak and unproven. Where it's easy, give children the bedrooms farthest from the line, as the field drops quickly with distance.")
  }
  if (a.ventilation === "rarely" || a.ventilation === "occasional") {
    recommendations.push("Air out your home daily, even briefly, to flush indoor pollutants.")
  }
  if (a.repellentClothing === "next-to-skin") {
    recommendations.push("As stain- or water-repellent clothing you wear against the skin wears out, replace it with PFAS-free items (OEKO-TEX STANDARD 100 has excluded intentional PFAS since 2023).")
  }
  if (a.pfasPersonalCare === "one" || a.pfasPersonalCare === "two-plus") {
    recommendations.push("Choose make-up without PTFE or 'perfluoro-' ingredients, non-PTFE floss, and a silicone or fabric watch band instead of fluoroelastomer (FKM).")
  }
  if (a.stainTreatedFurnishings === "some" || a.stainTreatedFurnishings === "most") {
    recommendations.push("Skip stain-protection treatments on new carpets and sofas; until you replace treated ones, HEPA-vacuum weekly to keep PFAS in dust down.")
  }
  const pfasUnsure = [a.repellentClothing, a.pfasPersonalCare, a.stainTreatedFurnishings].some(
    (v) => v === undefined || v === "unsure"
  )
  if (pfasUnsure) {
    recommendations.push("Check labels: 'water-repellent', 'stain-resistant' or 'DWR' finishes are often PFAS-based unless marked PFAS-free, and PTFE or 'perfluoro-' make-up ingredients and fluoroelastomer (FKM) watch bands are PFAS.")
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
      pfasProducts: p.score,
      radiation: r.score,
    },
    protectiveFactors,
    riskFactors,
    recommendations,
  }
}
