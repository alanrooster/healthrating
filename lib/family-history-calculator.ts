/**
 * Family History Risk Calculator
 *
 * Family history is one of the strongest non-modifiable risk factors for
 * many chronic diseases. This module captures first-degree relative
 * (parents, siblings, children) and second-degree relative history for
 * the most common heritable conditions.
 *
 * Sources:
 * - American Heart Association: family history of premature CVD
 * - NCI/CDC: family history and cancer risk
 * - ADA: type 2 diabetes family risk multipliers
 * - Lancet Commission 2024: family history of dementia
 *
 * Score interpretation: 100 = no notable family history, lower = more risk.
 * NOTE: Family history identifies risk but does NOT determine outcomes;
 * many cancers and CVD events occur in people without a family history.
 */

export type FamilyRelation = "none" | "second-degree" | "first-degree" | "multiple-or-early"

export interface FamilyHistoryAnswers {
  heartDisease: FamilyRelation       // CVD, heart attack, stroke
  hypertension: FamilyRelation
  diabetes: FamilyRelation             // type 2
  cancerBreast: FamilyRelation
  cancerColon: FamilyRelation
  cancerOther: FamilyRelation          // any other cancer
  alzheimers: FamilyRelation
  mentalHealth: FamilyRelation         // depression, bipolar, schizophrenia
  autoimmune: FamilyRelation           // RA, lupus, MS, IBD, etc.
}

export interface FamilyHistoryResult {
  overallScore: number
  riskFactors: { condition: string; relation: FamilyRelation; impact: string }[]
  recommendations: string[]
}

const RELATION_PENALTY: Record<FamilyRelation, number> = {
  none: 0,
  "second-degree": 4,
  "first-degree": 10,
  "multiple-or-early": 18, // multiple affected relatives or onset < age 55
}

const CONDITIONS: { key: keyof FamilyHistoryAnswers; label: string; weight: number; recommendation: string }[] = [
  {
    key: "heartDisease",
    label: "Heart disease, heart attack, or stroke",
    weight: 1.2,
    recommendation: "Discuss earlier and more frequent cardiovascular screening with your doctor.",
  },
  {
    key: "hypertension",
    label: "High blood pressure",
    weight: 0.8,
    recommendation: "Monitor blood pressure regularly; lifestyle factors (diet, exercise, sleep) have outsized impact.",
  },
  {
    key: "diabetes",
    label: "Type 2 diabetes",
    weight: 1.0,
    recommendation: "Get periodic HbA1c testing; weight management and exercise dramatically lower risk.",
  },
  {
    key: "cancerBreast",
    label: "Breast or ovarian cancer",
    weight: 1.0,
    recommendation: "Consider genetic counseling (BRCA testing) if multiple affected relatives or early onset.",
  },
  {
    key: "cancerColon",
    label: "Colorectal cancer",
    weight: 1.0,
    recommendation: "Begin colon cancer screening earlier than age 45 if a first-degree relative was affected.",
  },
  {
    key: "cancerOther",
    label: "Other cancers",
    weight: 0.7,
    recommendation: "Note pattern and ages; share with primary care for tailored screening.",
  },
  {
    key: "alzheimers",
    label: "Alzheimer's or dementia",
    weight: 0.8,
    recommendation: "Lifestyle factors (exercise, sleep, social/cognitive engagement) significantly modify risk.",
  },
  {
    key: "mentalHealth",
    label: "Depression, bipolar, or schizophrenia",
    weight: 0.6,
    recommendation: "Family history raises risk; early awareness and proactive mental health care help most.",
  },
  {
    key: "autoimmune",
    label: "Autoimmune conditions",
    weight: 0.5,
    recommendation: "Be alert to early symptoms; some autoimmune conditions cluster in families.",
  },
]

export function calculateFamilyHistory(answers: FamilyHistoryAnswers): FamilyHistoryResult {
  let totalPenalty = 0
  const riskFactors: { condition: string; relation: FamilyRelation; impact: string }[] = []
  const recommendations: string[] = []

  for (const c of CONDITIONS) {
    const relation = answers[c.key]
    const penalty = RELATION_PENALTY[relation] * c.weight
    totalPenalty += penalty
    if (relation !== "none") {
      const impactLabel =
        relation === "second-degree"
          ? "Second-degree relative (grandparent, aunt/uncle, etc.)"
          : relation === "first-degree"
            ? "First-degree relative (parent, sibling, child)"
            : "Multiple relatives or early onset"
      riskFactors.push({ condition: c.label, relation, impact: impactLabel })
      recommendations.push(c.recommendation)
    }
  }

  const overallScore = Math.max(0, Math.min(100, Math.round(100 - totalPenalty)))

  if (riskFactors.length === 0) {
    recommendations.push("No significant family history reported. Continue routine preventive care appropriate for your age.")
  } else {
    recommendations.push("Share your family history with your primary care provider; it may inform earlier or more frequent screening.")
  }

  return { overallScore, riskFactors, recommendations }
}
