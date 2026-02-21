/**
 * Diet Assessment based on WHO Healthy Diet Monitoring Initiative (HDMI).
 *
 * 10 questions covering key dietary indicators. Each scored 0-10
 * based on alignment with WHO recommendations.
 *
 * WHO Key Recommendations:
 * - At least 400g (5 servings) of fruits & vegetables per day
 * - Whole grains, legumes, and nuts as staple foods
 * - Less than 10% of total energy from free sugars (~50g/day)
 * - Less than 30% of total energy from fats
 * - Less than 5g of salt per day
 * - Limit processed meat and ultra-processed foods
 * - Prefer fish and plant-based proteins
 */

export interface DietQuestion {
  id: string
  question: string
  description: string
  options: DietOption[]
  isHealthy: boolean // if true, higher frequency = better score
}

export interface DietOption {
  label: string
  value: number // 0-4 (index)
  description?: string
}

export interface DietAnswers {
  [questionId: string]: number // selected option value
}

export interface DietResult {
  totalScore: number // 0-100
  categoryScores: { question: string; score: number; maxScore: number; feedback: string }[]
  overallFeedback: string
  category: string
}

export const DIET_QUESTIONS: DietQuestion[] = [
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
    id: "processed_meat",
    question: "How often do you eat processed or red meat?",
    description: "Bacon, sausages, ham, hot dogs, burgers, steak",
    isHealthy: false,
    options: [
      { label: "Never or rarely", value: 0 },
      { label: "1-2 times per week", value: 1 },
      { label: "3-4 times per week", value: 2 },
      { label: "5-6 times per week", value: 3 },
      { label: "Daily or more", value: 4 },
    ],
  },
  {
    id: "ultra_processed",
    question: "How often do you eat ultra-processed foods?",
    description: "Fast food, packaged snacks, instant noodles, frozen meals, sweets",
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

const FEEDBACK: Record<
  string,
  { good: string; moderate: string; poor: string }
> = {
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
    poor: "Legumes are nutrient-dense and inexpensive. Try adding them to meals 3+ times/week.",
  },
  sugary_drinks: {
    good: "Great job avoiding sugary beverages!",
    moderate: "Try to reduce sugary drinks. Replace with water, tea, or unsweetened alternatives.",
    poor: "Very high sugar intake from beverages. This significantly increases diabetes and obesity risk.",
  },
  processed_meat: {
    good: "Great job limiting processed and red meat intake.",
    moderate: "Consider reducing processed meat to 1-2 times per week or less.",
    poor: "High processed meat intake is linked to cancer and heart disease. Try plant-based alternatives.",
  },
  ultra_processed: {
    good: "Excellent! Low ultra-processed food consumption.",
    moderate: "Try to reduce packaged and fast food. Cook more meals from whole ingredients.",
    poor: "Very high ultra-processed food intake. This is linked to obesity, diabetes, and heart disease.",
  },
  salt: {
    good: "Great salt management! This protects your cardiovascular health.",
    moderate: "Consider reducing salt. Use herbs and spices for flavor instead.",
    poor: "Very high salt intake. WHO recommends less than 5g/day. High salt causes hypertension.",
  },
  fish_protein: {
    good: "Excellent fish and plant protein intake!",
    moderate: "Try to include fish or plant-based protein 3+ times per week.",
    poor: "Consider adding more fish or plant proteins. They are healthier than red meat.",
  },
  saturated_fat: {
    good: "Great job limiting saturated fat intake.",
    moderate: "Try to reduce fried foods, butter, and high-fat dairy consumption.",
    poor: "Very high saturated fat intake increases heart disease risk. Choose healthier fats like olive oil.",
  },
}

export function calculateDietScore(answers: DietAnswers): DietResult {
  const categoryScores: DietResult["categoryScores"] = []
  let totalPoints = 0
  const maxPoints = DIET_QUESTIONS.length * 10

  for (const q of DIET_QUESTIONS) {
    const answer = answers[q.id]
    if (answer === undefined) continue

    let score: number
    if (q.isHealthy) {
      // Higher frequency = better: 0->0, 1->2.5, 2->5, 3->7.5, 4->10
      score = answer * 2.5
    } else {
      // Lower frequency = better: 0->10, 1->7.5, 2->5, 3->2.5, 4->0
      score = (4 - answer) * 2.5
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
    })

    totalPoints += score
  }

  const answeredCount = categoryScores.length
  const adjustedMax = answeredCount * 10
  const totalScore =
    adjustedMax > 0 ? Math.round((totalPoints / adjustedMax) * 100) : 0

  let category: string
  let overallFeedback: string

  if (totalScore >= 85) {
    category = "Excellent"
    overallFeedback =
      "Your diet closely aligns with WHO recommendations. Keep up these healthy eating habits."
  } else if (totalScore >= 70) {
    category = "Good"
    overallFeedback =
      "Your diet is generally healthy with some room for improvement. Focus on the areas with lower scores."
  } else if (totalScore >= 50) {
    category = "Fair"
    overallFeedback =
      "Your diet needs improvement in several areas. Consider gradual changes towards whole foods, more fruits and vegetables."
  } else if (totalScore >= 30) {
    category = "Poor"
    overallFeedback =
      "Your diet has significant room for improvement. High intake of processed foods and low intake of healthy foods increase disease risk."
  } else {
    category = "Very Poor"
    overallFeedback =
      "Your diet poses serious health risks. Consider consulting a nutritionist for guidance on improving your eating habits."
  }

  return { totalScore, categoryScores, overallFeedback, category }
}
