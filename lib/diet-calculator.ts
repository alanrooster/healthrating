/**
 * Diet Assessment based on WHO Healthy Diet Monitoring Initiative (HDMI)
 * and IARC (International Agency for Research on Cancer) Classifications.
 *
 * IARC Cancer Classifications for Food & Diet:
 * ============================================
 * GROUP 1 - Carcinogenic to humans:
 *   - Processed meat (bacon, ham, sausages, hot dogs, salami, corned beef)
 *   - Alcoholic beverages
 *   - Salted fish (Chinese-style)
 *   - Aflatoxins (found in improperly stored grains, nuts, spices)
 *
 * GROUP 2A - Probably carcinogenic to humans:
 *   - Red meat (beef, pork, lamb, goat, horse)
 *   - Very hot beverages (>65°C)
 *   - High-temperature frying emissions
 *   - Acrylamide (formed in starchy foods at high temp: chips, fries, toast)
 *   - Nitrate/nitrite (under conditions of endogenous nitrosation)
 *
 * GROUP 2B - Possibly carcinogenic to humans:
 *   - Pickled vegetables (traditional Asian-style)
 *   - Caffeic acid (in coffee - but coffee overall is Group 3 / not classifiable)
 *   - Aspartame (artificial sweetener)
 *   - Aloe vera (whole leaf extract)
 *
 * WHO Key Recommendations:
 * - At least 400g (5 servings) of fruits & vegetables per day
 * - Whole grains, legumes, and nuts as staple foods
 * - Less than 10% of total energy from free sugars (~50g/day)
 * - Less than 30% of total energy from fats
 * - Less than 5g of salt per day
 * - Limit processed meat and red meat
 * - Prefer fish and plant-based proteins
 */

export interface DietQuestion {
  id: string
  question: string
  description: string
  options: DietOption[]
  isHealthy: boolean
  iarcGroup?: "1" | "2A" | "2B" | null
  iarcNote?: string
}

export interface DietOption {
  label: string
  value: number
  description?: string
}

export interface DietAnswers {
  [questionId: string]: number
}

export interface IARCRiskItem {
  substance: string
  group: "1" | "2A" | "2B"
  groupLabel: string
  frequency: string
  riskLevel: "high" | "moderate" | "low" | "minimal"
  recommendation: string
}

export interface DietResult {
  totalScore: number
  categoryScores: { question: string; score: number; maxScore: number; feedback: string; iarcGroup?: string }[]
  overallFeedback: string
  category: string
  iarcRisks: IARCRiskItem[]
  iarcSummary: string
}

export const DIET_QUESTIONS: DietQuestion[] = [
  // Healthy foods (higher = better)
  {
    id: "fruits",
    question: "How many servings of fruit do you eat per day?",
    description: "1 serving = 1 medium fruit, 1/2 cup chopped, or 1/4 cup dried fruit",
    isHealthy: true,
    options: [
      { label: "None or rarely", value: 0 },
      { label: "Less than 1 serving", value: 1 },
      { label: "1-2 servings", value: 2 },
      { label: "2-3 servings", value: 3 },
      { label: "3+ servings", value: 4 },
    ],
  },
  {
    id: "vegetables",
    question: "How many servings of vegetables do you eat per day?",
    description: "1 serving = 1 cup raw leafy greens or 1/2 cup cooked vegetables",
    isHealthy: true,
    options: [
      { label: "None or rarely", value: 0 },
      { label: "Less than 1 serving", value: 1 },
      { label: "1-2 servings", value: 2 },
      { label: "2-3 servings", value: 3 },
      { label: "3+ servings", value: 4 },
    ],
  },
  {
    id: "wholegrains",
    question: "How often do you consume whole grains?",
    description: "Whole wheat bread, brown rice, oats, quinoa, whole grain pasta",
    isHealthy: true,
    options: [
      { label: "Rarely or never", value: 0 },
      { label: "1-2 times per week", value: 1 },
      { label: "3-4 times per week", value: 2 },
      { label: "Once daily", value: 3 },
      { label: "Multiple times daily", value: 4 },
    ],
  },
  {
    id: "legumes",
    question: "How often do you eat legumes, beans, or nuts?",
    description: "Lentils, chickpeas, kidney beans, almonds, walnuts, peanuts",
    isHealthy: true,
    options: [
      { label: "Rarely or never", value: 0 },
      { label: "1-2 times per week", value: 1 },
      { label: "3-4 times per week", value: 2 },
      { label: "5-6 times per week", value: 3 },
      { label: "Daily or more", value: 4 },
    ],
  },
  {
    id: "fish_protein",
    question: "How often do you eat fish or plant-based protein?",
    description: "Fish, tofu, tempeh, seitan, edamame, or other plant proteins",
    isHealthy: true,
    options: [
      { label: "Rarely or never", value: 0 },
      { label: "1-2 times per week", value: 1 },
      { label: "3-4 times per week", value: 2 },
      { label: "5-6 times per week", value: 3 },
      { label: "Daily or more", value: 4 },
    ],
  },
  {
    id: "fermented_foods",
    question: "How often do you eat fermented foods?",
    description: "Yogurt, kefir, kimchi, sauerkraut, miso, kombucha, tempeh (gut microbiome support)",
    isHealthy: true,
    options: [
      { label: "Rarely or never", value: 0 },
      { label: "1-2 times per week", value: 1 },
      { label: "3-4 times per week", value: 2 },
      { label: "5-6 times per week", value: 3 },
      { label: "Daily or more", value: 4 },
    ],
  },
  {
    id: "hydration",
    question: "How much water do you drink per day?",
    description: "Plain water, unsweetened tea/coffee count; sugary drinks do not",
    isHealthy: true,
    options: [
      { label: "Less than 2 glasses", value: 0 },
      { label: "2-4 glasses", value: 1 },
      { label: "4-6 glasses", value: 2 },
      { label: "6-8 glasses", value: 3 },
      { label: "8+ glasses (~2L or more)", value: 4 },
    ],
  },

  // IARC Group 1: Carcinogenic to humans
  {
    id: "processed_meat",
    question: "How often do you eat processed meat?",
    description: "Bacon, ham, sausages, hot dogs, salami, corned beef, deli meats, canned meat",
    isHealthy: false,
    iarcGroup: "1",
    iarcNote: "IARC Group 1 - Carcinogenic to humans. Each 50g/day increases colorectal cancer risk by 18%.",
    options: [
      { label: "Never or rarely", value: 0 },
      { label: "1-2 times per week", value: 1 },
      { label: "3-4 times per week", value: 2 },
      { label: "5-6 times per week", value: 3 },
      { label: "Daily or more", value: 4 },
    ],
  },
  {
    id: "alcohol",
    question: "How often do you consume alcoholic beverages?",
    description: "Beer, wine, spirits, cocktails - any amount",
    isHealthy: false,
    iarcGroup: "1",
    iarcNote: "IARC Group 1 - Carcinogenic to humans. Linked to cancers of mouth, throat, esophagus, liver, breast, colon.",
    options: [
      { label: "Never or rarely", value: 0 },
      { label: "1-2 drinks per week", value: 1 },
      { label: "3-6 drinks per week", value: 2 },
      { label: "1-2 drinks daily", value: 3 },
      { label: "3+ drinks daily", value: 4 },
    ],
  },
  {
    id: "salted_fish",
    question: "How often do you eat salted or preserved fish?",
    description: "Chinese-style salted fish, dried fish, fermented fish products",
    isHealthy: false,
    iarcGroup: "1",
    iarcNote: "IARC Group 1 - Carcinogenic to humans. Linked to nasopharyngeal cancer.",
    options: [
      { label: "Never or rarely", value: 0 },
      { label: "1-2 times per month", value: 1 },
      { label: "1-2 times per week", value: 2 },
      { label: "3-4 times per week", value: 3 },
      { label: "Daily or more", value: 4 },
    ],
  },

  // IARC Group 2A: Probably carcinogenic
  {
    id: "red_meat",
    question: "How often do you eat red meat?",
    description: "Beef, pork, lamb, goat - fresh, minced, or as steaks/chops",
    isHealthy: false,
    iarcGroup: "2A",
    iarcNote: "IARC Group 2A - Probably carcinogenic to humans. Linked to colorectal, pancreatic, and prostate cancer.",
    options: [
      { label: "Never or rarely", value: 0 },
      { label: "1-2 times per week", value: 1 },
      { label: "3-4 times per week", value: 2 },
      { label: "5-6 times per week", value: 3 },
      { label: "Daily or more", value: 4 },
    ],
  },
  {
    id: "very_hot_beverages",
    question: "How often do you drink very hot beverages (above 65°C)?",
    description: "Tea, coffee, or other drinks consumed very hot - hot enough to burn your mouth",
    isHealthy: false,
    iarcGroup: "2A",
    iarcNote: "IARC Group 2A - Probably carcinogenic. Very hot beverages can cause esophageal cancer regardless of type.",
    options: [
      { label: "Never - I wait for drinks to cool", value: 0 },
      { label: "Occasionally", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Always - I drink beverages very hot", value: 4 },
    ],
  },
  {
    id: "high_temp_cooking",
    question: "How often do you eat food cooked at very high temperatures?",
    description: "Deep-fried foods, charred/burnt meat, heavily browned toast, chips/fries (acrylamide formation)",
    isHealthy: false,
    iarcGroup: "2A",
    iarcNote: "IARC Group 2A - High-temperature frying and acrylamide are probably carcinogenic. Formed when starchy foods are cooked at high temp.",
    options: [
      { label: "Rarely or never", value: 0 },
      { label: "1-2 times per week", value: 1 },
      { label: "3-4 times per week", value: 2 },
      { label: "Once daily", value: 3 },
      { label: "Multiple times daily", value: 4 },
    ],
  },

  // Other WHO dietary concerns
  {
    id: "sugary_drinks",
    question: "How often do you drink sugary beverages?",
    description: "Soda, sweetened juice, energy drinks, sweetened coffee/tea",
    isHealthy: false,
    options: [
      { label: "Never or rarely", value: 0 },
      { label: "1-2 times per week", value: 1 },
      { label: "3-4 times per week", value: 2 },
      { label: "Once daily", value: 3 },
      { label: "Multiple times daily", value: 4 },
    ],
  },
  {
    id: "ultra_processed",
    question: "How often do you eat ultra-processed foods?",
    description: "Fast food, packaged snacks, instant noodles, frozen meals, sweets, soft drinks",
    isHealthy: false,
    options: [
      { label: "Never or rarely", value: 0 },
      { label: "1-2 times per week", value: 1 },
      { label: "3-4 times per week", value: 2 },
      { label: "Once daily", value: 3 },
      { label: "Multiple times daily", value: 4 },
    ],
  },
  {
    id: "salt",
    question: "How would you describe your salt intake?",
    description: "WHO recommends less than 5g of salt per day (about 1 teaspoon)",
    isHealthy: false,
    options: [
      { label: "I actively limit salt", value: 0 },
      { label: "I use a little salt", value: 1 },
      { label: "Moderate salt use", value: 2 },
      { label: "I like salty food", value: 3 },
      { label: "I eat very salty food often", value: 4 },
    ],
  },
  {
    id: "saturated_fat",
    question: "How often do you consume high saturated fat foods?",
    description: "Butter, cream, cheese, pastries, fried foods, fatty cuts of meat",
    isHealthy: false,
    options: [
      { label: "Rarely or never", value: 0 },
      { label: "1-2 times per week", value: 1 },
      { label: "3-4 times per week", value: 2 },
      { label: "Once daily", value: 3 },
      { label: "Multiple times daily", value: 4 },
    ],
  },
]

const FEEDBACK: Record<string, { good: string; moderate: string; poor: string }> = {
  fruits: {
    good: "Great fruit intake! You are meeting WHO recommendations.",
    moderate: "Try to increase fruit consumption to at least 2 servings/day.",
    poor: "Very low fruit intake. Aim for at least 2 servings of fruit per day.",
  },
  vegetables: {
    good: "Excellent vegetable consumption!",
    moderate: "Try to increase to at least 3 servings of vegetables per day.",
    poor: "Very low vegetable intake. WHO recommends at least 3 servings/day.",
  },
  wholegrains: {
    good: "Great whole grain intake! This supports heart and digestive health.",
    moderate: "Consider replacing refined grains with whole grain alternatives more often.",
    poor: "Whole grains are essential. Try switching to brown rice, oats, or whole wheat bread.",
  },
  legumes: {
    good: "Excellent legume and nut consumption for fiber and plant protein.",
    moderate: "Adding more beans, lentils, or nuts would improve your diet quality.",
    poor: "Legumes are nutrient-dense. Try adding them to meals 3+ times/week.",
  },
  fish_protein: {
    good: "Excellent fish and plant protein intake!",
    moderate: "Try to include fish or plant-based protein 3+ times per week.",
    poor: "Consider adding more fish or plant proteins. They are healthier than red meat.",
  },
  fermented_foods: {
    good: "Excellent! Fermented foods increase gut microbiome diversity and lower inflammatory markers (Wastyk 2021, Cell).",
    moderate: "Adding fermented foods more often (yogurt, kefir, kimchi) supports gut microbiome diversity and lowers inflammation.",
    poor: "Consider adding fermented foods: a Stanford study (Wastyk 2021, Cell) found they boost microbiome diversity and reduce 19 inflammatory markers.",
  },
  hydration: {
    good: "Great hydration! Adequate fluid intake supports kidney function and is linked to slower biological aging.",
    moderate: "Try to increase daily water intake toward ~2 liters (8 glasses).",
    poor: "Low hydration: poor hydration is associated with faster biological aging and higher chronic disease risk (Dmitrieva 2023, eBioMedicine/NIH).",
  },
  processed_meat: {
    good: "Excellent! You are avoiding processed meat, a Group 1 carcinogen.",
    moderate: "Consider reducing processed meat. IARC classifies it as carcinogenic (Group 1).",
    poor: "HIGH CANCER RISK: Processed meat is a Group 1 carcinogen (same category as tobacco). Each 50g/day increases colorectal cancer risk by 18%.",
  },
  alcohol: {
    good: "Excellent! Avoiding alcohol eliminates this cancer risk factor.",
    moderate: "Consider reducing alcohol intake. IARC classifies it as carcinogenic (Group 1).",
    poor: "HIGH CANCER RISK: Alcohol is a Group 1 carcinogen linked to 7 types of cancer including mouth, throat, liver, and breast cancer.",
  },
  salted_fish: {
    good: "Excellent! You are avoiding salted fish, a Group 1 carcinogen.",
    moderate: "Consider reducing salted/preserved fish consumption.",
    poor: "HIGH CANCER RISK: Chinese-style salted fish is a Group 1 carcinogen linked to nasopharyngeal cancer.",
  },
  red_meat: {
    good: "Great job limiting red meat intake.",
    moderate: "Consider reducing red meat. IARC classifies it as probably carcinogenic (Group 2A).",
    poor: "ELEVATED CANCER RISK: Red meat is Group 2A (probably carcinogenic). Linked to colorectal and pancreatic cancer.",
  },
  very_hot_beverages: {
    good: "Good practice! Letting beverages cool reduces esophageal cancer risk.",
    moderate: "Try to let your beverages cool before drinking.",
    poor: "ELEVATED CANCER RISK: Very hot beverages (>65°C) are Group 2A carcinogenic and increase esophageal cancer risk.",
  },
  high_temp_cooking: {
    good: "Great! You are limiting high-temperature cooking which produces carcinogens.",
    moderate: "Try to reduce deep-fried and charred foods. Use lower-temperature cooking methods.",
    poor: "ELEVATED CANCER RISK: High-temperature frying produces acrylamide (Group 2A). Avoid charred/burnt foods.",
  },
  sugary_drinks: {
    good: "Great job avoiding sugary beverages!",
    moderate: "Try to reduce sugary drinks. Replace with water or unsweetened alternatives.",
    poor: "Very high sugar intake from beverages increases diabetes and obesity risk.",
  },
  ultra_processed: {
    good: "Excellent! Low ultra-processed food consumption.",
    moderate: "Try to reduce packaged and fast food. Cook more meals from whole ingredients.",
    poor: "Very high ultra-processed food intake is linked to obesity, diabetes, and heart disease.",
  },
  salt: {
    good: "Great salt management! This protects your cardiovascular health.",
    moderate: "Consider reducing salt. Use herbs and spices for flavor instead.",
    poor: "Very high salt intake. WHO recommends less than 5g/day. High salt causes hypertension.",
  },
  saturated_fat: {
    good: "Great job limiting saturated fat intake.",
    moderate: "Try to reduce fried foods, butter, and high-fat dairy consumption.",
    poor: "Very high saturated fat intake increases heart disease risk.",
  },
}

function getIARCRiskLevel(group: "1" | "2A" | "2B", frequency: number): "high" | "moderate" | "low" | "minimal" {
  if (group === "1") {
    if (frequency >= 3) return "high"
    if (frequency >= 2) return "moderate"
    if (frequency >= 1) return "low"
    return "minimal"
  }
  if (group === "2A") {
    if (frequency >= 4) return "high"
    if (frequency >= 2) return "moderate"
    if (frequency >= 1) return "low"
    return "minimal"
  }
  // Group 2B
  if (frequency >= 4) return "moderate"
  if (frequency >= 2) return "low"
  return "minimal"
}

function getIARCRecommendation(id: string, frequency: number): string {
  if (frequency === 0) return "Keep avoiding this carcinogen."

  switch (id) {
    case "processed_meat":
      return frequency >= 2
        ? "Strongly consider eliminating or drastically reducing processed meat. Replace with fish, poultry, or plant proteins."
        : "Try to reduce further. Any amount increases cancer risk."
    case "alcohol":
      return frequency >= 2
        ? "Consider reducing or eliminating alcohol. There is no safe level for cancer risk."
        : "Even moderate drinking increases cancer risk. Consider reducing further."
    case "salted_fish":
      return frequency >= 2
        ? "Strongly consider eliminating preserved/salted fish. Choose fresh fish instead."
        : "Try to avoid preserved fish when possible."
    case "red_meat":
      return frequency >= 3
        ? "WHO recommends limiting red meat to 350-500g per week maximum. Consider plant-based alternatives."
        : "Moderate your intake and choose leaner cuts. Avoid charring when cooking."
    case "very_hot_beverages":
      return "Let beverages cool to a comfortable temperature (below 65°C) before drinking."
    case "high_temp_cooking":
      return frequency >= 2
        ? "Use gentler cooking methods: steaming, boiling, baking at moderate temperatures. Avoid deep-frying."
        : "Continue limiting high-temperature cooking methods."
    default:
      return "Consider reducing consumption of this item."
  }
}

export function calculateDietScore(answers: DietAnswers): DietResult {
  const categoryScores: DietResult["categoryScores"] = []
  const iarcRisks: IARCRiskItem[] = []
  let totalPoints = 0

  for (const q of DIET_QUESTIONS) {
    const answer = answers[q.id]
    if (answer === undefined) continue

    let score: number
    if (q.isHealthy) {
      score = answer * 2.5
    } else {
      score = (4 - answer) * 2.5
      
      // Extra penalty for IARC Group 1 carcinogens
      if (q.iarcGroup === "1" && answer >= 2) {
        score = Math.max(0, score - 2)
      }
    }

    const feedbackSet = FEEDBACK[q.id]
    let feedback = ""
    if (feedbackSet) {
      if (score >= 7) feedback = feedbackSet.good
      else if (score >= 4) feedback = feedbackSet.moderate
      else feedback = feedbackSet.poor
    }

    categoryScores.push({
      question: q.question,
      score: Math.round(score * 10) / 10,
      maxScore: 10,
      feedback,
      iarcGroup: q.iarcGroup ? `Group ${q.iarcGroup}` : undefined,
    })

    totalPoints += score

    // Track IARC risks
    if (q.iarcGroup && answer > 0) {
      const frequencyLabels = ["Rarely", "1-2x/week", "3-4x/week", "5-6x/week", "Daily+"]
      iarcRisks.push({
        substance: q.description?.split(",")[0] || q.question,
        group: q.iarcGroup,
        groupLabel:
          q.iarcGroup === "1"
            ? "Carcinogenic to humans"
            : q.iarcGroup === "2A"
              ? "Probably carcinogenic"
              : "Possibly carcinogenic",
        frequency: frequencyLabels[answer] || "Unknown",
        riskLevel: getIARCRiskLevel(q.iarcGroup, answer),
        recommendation: getIARCRecommendation(q.id, answer),
      })
    }
  }

  const answeredCount = categoryScores.length
  const adjustedMax = answeredCount * 10
  const totalScore = adjustedMax > 0 ? Math.round((totalPoints / adjustedMax) * 100) : 0

  // Generate IARC summary
  const group1Risks = iarcRisks.filter((r) => r.group === "1")
  const group2ARisks = iarcRisks.filter((r) => r.group === "2A")
  const highRisks = iarcRisks.filter((r) => r.riskLevel === "high")

  let iarcSummary = ""
  if (group1Risks.length === 0 && group2ARisks.length === 0) {
    iarcSummary = "Excellent! You are avoiding known and probable carcinogens in your diet."
  } else if (highRisks.length > 0) {
    iarcSummary = `WARNING: You have ${highRisks.length} high-risk exposure(s) to IARC carcinogens. ${group1Risks.length > 0 ? `${group1Risks.length} Group 1 (confirmed carcinogen) exposure(s).` : ""} Strongly consider reducing these foods.`
  } else if (group1Risks.length > 0) {
    iarcSummary = `You have ${group1Risks.length} exposure(s) to Group 1 carcinogens. While frequency is moderate, any exposure increases cancer risk.`
  } else {
    iarcSummary = `You have ${group2ARisks.length} exposure(s) to Group 2A probable carcinogens. Consider reducing these foods.`
  }

  let category: string
  let overallFeedback: string

  if (totalScore >= 85) {
    category = "Excellent"
    overallFeedback = "Your diet closely aligns with WHO recommendations and minimizes cancer risk factors."
  } else if (totalScore >= 70) {
    category = "Good"
    overallFeedback = "Your diet is generally healthy with some room for improvement. Pay attention to IARC-classified foods."
  } else if (totalScore >= 50) {
    category = "Fair"
    overallFeedback = "Your diet needs improvement. Consider reducing processed meat, alcohol, and high-temperature cooked foods."
  } else if (totalScore >= 30) {
    category = "Poor"
    overallFeedback = "Your diet has significant health risks. High exposure to carcinogenic foods requires attention."
  } else {
    category = "Very Poor"
    overallFeedback = "Your diet poses serious health risks including high exposure to carcinogens. Consider consulting a nutritionist."
  }

  return { totalScore, categoryScores, overallFeedback, category, iarcRisks, iarcSummary }
}
