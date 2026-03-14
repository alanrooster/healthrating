/**
 * Carbon Footprint Calculator
 *
 * Calculates annual CO2 emissions based on transportation, home energy,
 * and consumption patterns. Uses IPCC, EPA, and Our World in Data emission factors.
 *
 * Sources:
 * - IPCC AR6 (2023) emission factors
 * - EPA Greenhouse Gas Equivalencies Calculator
 * - Our World in Data carbon database
 * - UK DEFRA conversion factors (2024)
 * - IEA World Energy Outlook (2024)
 */

// ============================================================================
// TYPES
// ============================================================================

export type CommuteMethod =
  | "car"
  | "public-transit"
  | "bike"
  | "walk"
  | "motorcycle"
  | "work-from-home"
  | "mixed"

export type CarType =
  | "petrol-small"
  | "petrol-medium"
  | "petrol-large"
  | "diesel-small"
  | "diesel-medium"
  | "diesel-large"
  | "hybrid"
  | "plug-in-hybrid"
  | "electric"
  | "none"

export type HeatingSource =
  | "natural-gas"
  | "oil"
  | "electric-standard"
  | "electric-heat-pump"
  | "wood"
  | "coal"
  | "district-heating"
  | "none"

export type ElectricitySource =
  | "standard-grid"
  | "green-tariff"
  | "solar-panels"
  | "mixed-renewable"

export type HousingType =
  | "apartment-small"
  | "apartment-large"
  | "house-small"
  | "house-medium"
  | "house-large"

export type FlightFrequency = "none" | "1-2" | "3-5" | "6-10" | "11-20" | "20+"

export type ShoppingHabit = "minimal" | "low" | "average" | "high" | "very-high"

export type RecyclingHabit = "none" | "some" | "most" | "all" | "zero-waste"

export interface CarbonInputs {
  // Transportation
  commuteMethod: CommuteMethod
  commuteDistanceKm: number // daily round-trip
  carType: CarType
  annualCarKm: number
  shortHaulFlights: FlightFrequency // <3 hours
  longHaulFlights: FlightFrequency // >6 hours
  publicTransitWeekly: number // hours per week

  // Home Energy
  housingType: HousingType
  heatingSource: HeatingSource
  hasCooling: boolean
  coolingMonths: number
  electricitySource: ElectricitySource
  householdMembers: number
  countryCode: string // for grid carbon intensity

  // Consumption (new, not asked elsewhere)
  clothingPurchases: ShoppingHabit
  electronicsPurchases: ShoppingHabit
  recyclingHabit: RecyclingHabit
  composting: boolean
}

export interface CarbonResult {
  totalKgCO2: number
  breakdown: {
    transport: number
    flights: number
    homeEnergy: number
    consumption: number
  }
  perCapita: number
  comparison: {
    globalAverage: number // 4.7 tonnes
    euAverage: number // 6.8 tonnes
    usAverage: number // 14.7 tonnes
    parisTarget: number // 2 tonnes by 2050
  }
  rating: "excellent" | "good" | "average" | "high" | "very-high"
  score: number // 0-100 for integration with health dashboard
  recommendations: string[]
  treesNeeded: number // trees needed to offset
}

// ============================================================================
// EMISSION FACTORS (kg CO2e per unit)
// Sources: DEFRA 2024, EPA, IPCC AR6
// ============================================================================

const CAR_EMISSIONS_PER_KM: Record<CarType, number> = {
  "petrol-small": 0.14,
  "petrol-medium": 0.18,
  "petrol-large": 0.26,
  "diesel-small": 0.12,
  "diesel-medium": 0.17,
  "diesel-large": 0.23,
  hybrid: 0.11,
  "plug-in-hybrid": 0.07,
  electric: 0.05, // varies by grid, this is EU average
  none: 0,
}

const PUBLIC_TRANSIT_PER_HOUR = 0.8 // kg CO2 per hour average (bus/train mix)
const MOTORCYCLE_PER_KM = 0.1

// Flight emissions (kg CO2e per flight, including radiative forcing multiplier)
const FLIGHT_EMISSIONS = {
  shortHaul: 250, // ~1000km average
  longHaul: 1800, // ~8000km average
}

const FLIGHT_FREQUENCY_MULTIPLIER: Record<FlightFrequency, number> = {
  none: 0,
  "1-2": 1.5,
  "3-5": 4,
  "6-10": 8,
  "11-20": 15,
  "20+": 25,
}

// Housing base energy (kg CO2 per year before heating/cooling adjustments)
const HOUSING_BASE_EMISSIONS: Record<HousingType, number> = {
  "apartment-small": 800,
  "apartment-large": 1200,
  "house-small": 1500,
  "house-medium": 2200,
  "house-large": 3500,
}

// Heating emissions (kg CO2 per year)
const HEATING_EMISSIONS: Record<HeatingSource, number> = {
  "natural-gas": 2000,
  oil: 2800,
  "electric-standard": 1800,
  "electric-heat-pump": 600,
  wood: 400, // considered carbon neutral in IPCC
  coal: 4000,
  "district-heating": 1000,
  none: 0,
}

// Electricity source multiplier
const ELECTRICITY_MULTIPLIER: Record<ElectricitySource, number> = {
  "standard-grid": 1.0,
  "green-tariff": 0.3,
  "solar-panels": 0.1,
  "mixed-renewable": 0.4,
}

// Cooling per month (kg CO2)
const COOLING_PER_MONTH = 150

// Consumption emissions (kg CO2 per year)
const CLOTHING_EMISSIONS: Record<ShoppingHabit, number> = {
  minimal: 100,
  low: 250,
  average: 500,
  high: 900,
  "very-high": 1500,
}

const ELECTRONICS_EMISSIONS: Record<ShoppingHabit, number> = {
  minimal: 50,
  low: 150,
  average: 350,
  high: 700,
  "very-high": 1200,
}

// Recycling offset (negative = reduction)
const RECYCLING_OFFSET: Record<RecyclingHabit, number> = {
  none: 200, // penalty for landfill
  some: 50,
  most: -100,
  all: -200,
  "zero-waste": -400,
}

const COMPOSTING_OFFSET = -150

// Grid carbon intensity by region (gCO2/kWh) - simplified
const GRID_INTENSITY: Record<string, number> = {
  SE: 20, // Sweden (hydro/nuclear)
  FR: 60, // France (nuclear)
  NO: 25, // Norway (hydro)
  DE: 350, // Germany
  PL: 650, // Poland (coal)
  UK: 200,
  US: 400,
  CN: 550,
  IN: 700,
  AU: 600,
  default: 400,
}

// ============================================================================
// CALCULATION
// ============================================================================

export function calculateCarbonFootprint(
  inputs: CarbonInputs,
  // Optional: pass in diet data to add meat consumption impact
  dietData?: {
    redMeatFrequency: number // 0-4 scale
    processedMeatFrequency: number
  },
  // Optional: pass in water data for plastic consumption impact
  waterData?: {
    plasticBottlesPerWeek: number
  }
): CarbonResult {
  const {
    commuteMethod,
    commuteDistanceKm,
    carType,
    annualCarKm,
    shortHaulFlights,
    longHaulFlights,
    publicTransitWeekly,
    housingType,
    heatingSource,
    hasCooling,
    coolingMonths,
    electricitySource,
    householdMembers,
    countryCode,
    clothingPurchases,
    electronicsPurchases,
    recyclingHabit,
    composting,
  } = inputs

  // --- TRANSPORT ---
  let transportEmissions = 0

  // Car commute and personal use
  if (commuteMethod === "car" || commuteMethod === "mixed") {
    const commuteDays = 230 // working days per year
    const commuteKm = commuteDistanceKm * commuteDays
    transportEmissions += commuteKm * CAR_EMISSIONS_PER_KM[carType]
  }

  if (commuteMethod === "motorcycle") {
    const commuteDays = 230
    transportEmissions += commuteDistanceKm * commuteDays * MOTORCYCLE_PER_KM
  }

  // Additional car use beyond commute
  if (carType !== "none") {
    const nonCommuteKm = Math.max(0, annualCarKm - (commuteMethod === "car" ? commuteDistanceKm * 230 : 0))
    transportEmissions += nonCommuteKm * CAR_EMISSIONS_PER_KM[carType]
  }

  // Public transit
  if (commuteMethod === "public-transit" || commuteMethod === "mixed") {
    transportEmissions += publicTransitWeekly * 52 * PUBLIC_TRANSIT_PER_HOUR
  }

  // --- FLIGHTS ---
  const flightEmissions =
    FLIGHT_FREQUENCY_MULTIPLIER[shortHaulFlights] * FLIGHT_EMISSIONS.shortHaul +
    FLIGHT_FREQUENCY_MULTIPLIER[longHaulFlights] * FLIGHT_EMISSIONS.longHaul

  // --- HOME ENERGY ---
  let homeEmissions = HOUSING_BASE_EMISSIONS[housingType]

  // Adjust for grid carbon intensity
  const gridIntensity = GRID_INTENSITY[countryCode.toUpperCase()] ?? GRID_INTENSITY.default
  const gridMultiplier = gridIntensity / 400 // normalize to default

  homeEmissions *= gridMultiplier * ELECTRICITY_MULTIPLIER[electricitySource]

  // Add heating
  homeEmissions += HEATING_EMISSIONS[heatingSource] * gridMultiplier

  // Add cooling
  if (hasCooling && coolingMonths > 0) {
    homeEmissions += COOLING_PER_MONTH * coolingMonths * ELECTRICITY_MULTIPLIER[electricitySource]
  }

  // Divide by household members for per-capita
  homeEmissions = homeEmissions / Math.max(1, householdMembers)

  // --- CONSUMPTION ---
  let consumptionEmissions =
    CLOTHING_EMISSIONS[clothingPurchases] +
    ELECTRONICS_EMISSIONS[electronicsPurchases] +
    RECYCLING_OFFSET[recyclingHabit]

  if (composting) {
    consumptionEmissions += COMPOSTING_OFFSET
  }

  // Add diet impact if available (from diet assessment)
  if (dietData) {
    // Red meat: ~27kg CO2 per kg, average 150g per serving
    // Scale: 0=never, 1=rarely, 2=weekly, 3=several/week, 4=daily
    const meatServingsPerYear = [0, 12, 52, 156, 365][dietData.redMeatFrequency] ?? 0
    consumptionEmissions += meatServingsPerYear * 0.15 * 27

    // Processed meat: ~12kg CO2 per kg
    const processedServings = [0, 12, 52, 156, 365][dietData.processedMeatFrequency] ?? 0
    consumptionEmissions += processedServings * 0.1 * 12
  }

  // Add plastic bottle impact if available (from water assessment)
  // Each plastic bottle ~82g CO2 (production + transport) per EPA/lifecycle analysis
  if (waterData && waterData.plasticBottlesPerWeek > 0) {
    const bottlesPerYear = waterData.plasticBottlesPerWeek * 52
    consumptionEmissions += bottlesPerYear * 0.082 // 82g = 0.082kg per bottle
  }

  consumptionEmissions = Math.max(0, consumptionEmissions)

  // --- TOTALS ---
  const totalKgCO2 = Math.round(transportEmissions + flightEmissions + homeEmissions + consumptionEmissions)

  const breakdown = {
    transport: Math.round(transportEmissions),
    flights: Math.round(flightEmissions),
    homeEnergy: Math.round(homeEmissions),
    consumption: Math.round(consumptionEmissions),
  }

  const perCapita = totalKgCO2 / 1000 // tonnes

  // Comparisons (tonnes CO2)
  const comparison = {
    globalAverage: 4.7,
    euAverage: 6.8,
    usAverage: 14.7,
    parisTarget: 2.0,
  }

  // Rating based on per-capita emissions
  let rating: CarbonResult["rating"]
  let score: number

  if (perCapita <= 2) {
    rating = "excellent"
    score = 95
  } else if (perCapita <= 4) {
    rating = "good"
    score = 80
  } else if (perCapita <= 7) {
    rating = "average"
    score = 60
  } else if (perCapita <= 12) {
    rating = "high"
    score = 35
  } else {
    rating = "very-high"
    score = 15
  }

  // Trees needed to offset (one tree absorbs ~22kg CO2/year)
  const treesNeeded = Math.ceil(totalKgCO2 / 22)

  // Generate recommendations
  const recommendations: string[] = []

  if (breakdown.flights > 2000) {
    recommendations.push(
      "Aviation is your largest emission source. Consider trains for shorter trips or offsetting flights."
    )
  }
  if (breakdown.transport > 3000 && carType.includes("petrol") || carType.includes("diesel")) {
    recommendations.push(
      "Switching to an electric or hybrid vehicle could reduce your transport emissions by 60-80%."
    )
  }
  if (heatingSource === "oil" || heatingSource === "coal") {
    recommendations.push(
      "Your heating source is carbon-intensive. Heat pumps can reduce heating emissions by 70%."
    )
  }
  if (electricitySource === "standard-grid") {
    recommendations.push(
      "Switching to a green electricity tariff or solar panels can cut home emissions significantly."
    )
  }
  if (clothingPurchases === "high" || clothingPurchases === "very-high") {
    recommendations.push(
      "Fast fashion has a high carbon footprint. Consider second-hand, quality over quantity."
    )
  }
  if (recyclingHabit === "none" || recyclingHabit === "some") {
    recommendations.push(
      "Improving recycling habits can reduce your consumption footprint by 200-400 kg CO2/year."
    )
  }
  if (waterData && waterData.plasticBottlesPerWeek >= 7) {
    recommendations.push(
      "Switching from plastic bottles to a reusable bottle could save 200+ kg CO2/year and reduce microplastic exposure."
    )
  }
  if (dietData && dietData.redMeatFrequency >= 3) {
    recommendations.push(
      "Reducing red meat consumption to 1-2 times per week could save 500+ kg CO2/year."
    )
  }
  if (perCapita <= comparison.parisTarget) {
    recommendations.push(
      "Your footprint aligns with the Paris Agreement 2050 target. Keep it up!"
    )
  }

  return {
    totalKgCO2,
    breakdown,
    perCapita,
    comparison,
    rating,
    score,
    recommendations,
    treesNeeded,
  }
}

// ============================================================================
// HELPER: Get label for rating
// ============================================================================

export function getCarbonRatingLabel(rating: CarbonResult["rating"]): string {
  const labels: Record<CarbonResult["rating"], string> = {
    excellent: "Excellent - Paris-aligned",
    good: "Good - Below global average",
    average: "Average",
    high: "High - Above EU average",
    "very-high": "Very High - Significant reduction needed",
  }
  return labels[rating]
}

export function getCarbonRatingColor(rating: CarbonResult["rating"]): string {
  const colors: Record<CarbonResult["rating"], string> = {
    excellent: "text-green-600",
    good: "text-emerald-600",
    average: "text-yellow-600",
    high: "text-orange-600",
    "very-high": "text-red-600",
  }
  return colors[rating]
}
