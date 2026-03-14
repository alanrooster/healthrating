"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Car,
  Plane,
  Home,
  ShoppingBag,
  Leaf,
  TreePine,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react"
import {
  type CarbonInputs,
  type CarbonResult,
  type CommuteMethod,
  type CarType,
  type HeatingSource,
  type ElectricitySource,
  type HousingType,
  type FlightFrequency,
  type ShoppingHabit,
  type RecyclingHabit,
  calculateCarbonFootprint,
  getCarbonRatingLabel,
  getCarbonRatingColor,
} from "@/lib/carbon-calculator"

interface CarbonSectionProps {
  onResult: (score: number, totalKgCO2: number) => void
  dietData?: {
    redMeatFrequency: number
    processedMeatFrequency: number
    fishFrequency: number
    alcoholFrequency: number
  } | null
  waterData?: {
    plasticBottlesPerWeek: number
    primarySourceBottled: boolean
  } | null
  lifestyleData?: {
    smokingStatus: string
    alcoholFrequency: string
    alcoholUnitsPerSession: number
  } | null
  airData?: {
    country: string
  } | null
  storedResult?: CarbonResult | null
  onStoreResult?: (result: CarbonResult) => void
  onRetake?: () => void
}

const STEPS = [
  { id: 1, title: "Daily Commute", icon: Car },
  { id: 2, title: "Car & Travel", icon: Car },
  { id: 3, title: "Flights", icon: Plane },
  { id: 4, title: "Home Energy", icon: Home },
  { id: 5, title: "Consumption", icon: ShoppingBag },
]

const COUNTRIES = [
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "FR", name: "France" },
  { code: "UK", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "PL", name: "Poland" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "JP", name: "Japan" },
  { code: "BR", name: "Brazil" },
  { code: "default", name: "Other" },
]

export function CarbonSection({ onResult, dietData, waterData, lifestyleData, airData, storedResult, onStoreResult, onRetake }: CarbonSectionProps) {
  const [step, setStep] = useState(1)
  const [result, setResult] = useState<CarbonResult | null>(storedResult ?? null)

  // Form state
  const [commuteMethod, setCommuteMethod] = useState<CommuteMethod>("car")
  const [commuteDistanceKm, setCommuteDistanceKm] = useState(20)
  const [carType, setCarType] = useState<CarType>("petrol-medium")
  const [annualCarKm, setAnnualCarKm] = useState(12000)
  const [publicTransitWeekly, setPublicTransitWeekly] = useState(0)
  const [shortHaulFlights, setShortHaulFlights] = useState<FlightFrequency>("1-2")
  const [longHaulFlights, setLongHaulFlights] = useState<FlightFrequency>("none")
  const [housingType, setHousingType] = useState<HousingType>("apartment-large")
  const [heatingSource, setHeatingSource] = useState<HeatingSource>("natural-gas")
  const [hasCooling, setHasCooling] = useState(false)
  const [coolingMonths, setCoolingMonths] = useState(3)
  const [electricitySource, setElectricitySource] = useState<ElectricitySource>("standard-grid")
  const [householdMembers, setHouseholdMembers] = useState(2)
  const [countryCode, setCountryCode] = useState("default")
  const [clothingPurchases, setClothingPurchases] = useState<ShoppingHabit>("average")
  const [electronicsPurchases, setElectronicsPurchases] = useState<ShoppingHabit>("average")
  const [recyclingHabit, setRecyclingHabit] = useState<RecyclingHabit>("most")
  const [composting, setComposting] = useState(false)

  function handleCalculate() {
    const inputs: CarbonInputs = {
      commuteMethod,
      commuteDistanceKm,
      carType,
      annualCarKm,
      publicTransitWeekly,
      shortHaulFlights,
      longHaulFlights,
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
    }

    // Pass diet data from diet assessment if available
    const externalDietData = dietData ? {
      redMeatFrequency: dietData.redMeatFrequency,
      processedMeatFrequency: dietData.processedMeatFrequency,
      fishFrequency: dietData.fishFrequency,
      alcoholFrequency: dietData.alcoholFrequency,
    } : undefined

    // Pass water/plastic data from water assessment if available
    const externalWaterData = waterData ? {
      plasticBottlesPerWeek: waterData.plasticBottlesPerWeek,
      primarySourceBottled: waterData.primarySourceBottled,
    } : undefined

    // Pass lifestyle data (smoking) if available
    const externalLifestyleData = lifestyleData ? {
      smokingStatus: lifestyleData.smokingStatus,
    } : undefined

    // Pass country from air quality for grid carbon intensity
    const externalAirData = airData ? {
      country: airData.country,
    } : undefined

    const calcResult = calculateCarbonFootprint(inputs, externalDietData, externalWaterData, externalLifestyleData, externalAirData)
    setResult(calcResult)
    onStoreResult?.(calcResult)
    onResult(calcResult.score, calcResult.totalKgCO2)
  }

  function handleNext() {
    if (step < STEPS.length) {
      setStep(step + 1)
    } else {
      handleCalculate()
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  function handleReset() {
    setResult(null)
    setStep(1)
    onRetake?.()
  }

  // Render results
  if (result) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Leaf className="h-5 w-5 text-primary" />
              Your Carbon Footprint
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
{/* Data integration notice */}
  {(dietData || waterData || lifestyleData || airData) && (
  <div className="flex items-start gap-2 rounded-lg bg-primary/10 p-3 text-sm">
  <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
  <div className="text-muted-foreground">
  <span className="font-medium text-foreground">Integrated data: </span>
  {[
  dietData && "Diet (meat, fish, alcohol)",
  waterData?.plasticBottlesPerWeek ? "Water (plastic bottles)" : null,
  waterData?.primarySourceBottled ? "Water (bottled source)" : null,
  lifestyleData?.smokingStatus && lifestyleData.smokingStatus !== "never" ? "Lifestyle (smoking)" : null,
  airData?.country ? `Air (${airData.country} grid)` : null,
  ].filter(Boolean).join(", ")}
  {" - automatically included from your other assessments."}
  </div>
  </div>
  )}

            {/* Main result */}
            <div className="flex flex-col items-center gap-2 rounded-lg bg-secondary p-6 text-center">
              <span className="text-5xl font-bold text-foreground">
                {result.perCapita.toFixed(1)}
              </span>
              <span className="text-lg text-muted-foreground">tonnes CO2e / year</span>
              <span className={`text-sm font-medium ${getCarbonRatingColor(result.rating)}`}>
                {getCarbonRatingLabel(result.rating)}
              </span>
            </div>

            {/* Breakdown */}
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-foreground">Breakdown</h4>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="flex flex-col items-center rounded-lg border p-3">
                  <Car className="mb-1 h-5 w-5 text-muted-foreground" />
                  <span className="text-lg font-bold text-foreground">
                    {(result.breakdown.transport / 1000).toFixed(1)}t
                  </span>
                  <span className="text-xs text-muted-foreground">Transport</span>
                </div>
                <div className="flex flex-col items-center rounded-lg border p-3">
                  <Plane className="mb-1 h-5 w-5 text-muted-foreground" />
                  <span className="text-lg font-bold text-foreground">
                    {(result.breakdown.flights / 1000).toFixed(1)}t
                  </span>
                  <span className="text-xs text-muted-foreground">Flights</span>
                </div>
                <div className="flex flex-col items-center rounded-lg border p-3">
                  <Home className="mb-1 h-5 w-5 text-muted-foreground" />
                  <span className="text-lg font-bold text-foreground">
                    {(result.breakdown.homeEnergy / 1000).toFixed(1)}t
                  </span>
                  <span className="text-xs text-muted-foreground">Home</span>
                </div>
                <div className="flex flex-col items-center rounded-lg border p-3">
                  <ShoppingBag className="mb-1 h-5 w-5 text-muted-foreground" />
                  <span className="text-lg font-bold text-foreground">
                    {(result.breakdown.consumption / 1000).toFixed(1)}t
                  </span>
                  <span className="text-xs text-muted-foreground">Consumption</span>
                </div>
              </div>
            </div>

            {/* Comparison */}
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-foreground">How you compare</h4>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Paris 2050 Target</span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={Math.min(100, (result.perCapita / result.comparison.parisTarget) * 100)}
                      className="h-2 w-24"
                    />
                    <span className="w-12 text-right font-medium text-foreground">
                      {result.comparison.parisTarget}t
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Global Average</span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={Math.min(100, (result.perCapita / result.comparison.globalAverage) * 100)}
                      className="h-2 w-24"
                    />
                    <span className="w-12 text-right font-medium text-foreground">
                      {result.comparison.globalAverage}t
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">EU Average</span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={Math.min(100, (result.perCapita / result.comparison.euAverage) * 100)}
                      className="h-2 w-24"
                    />
                    <span className="w-12 text-right font-medium text-foreground">
                      {result.comparison.euAverage}t
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">US Average</span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={Math.min(100, (result.perCapita / result.comparison.usAverage) * 100)}
                      className="h-2 w-24"
                    />
                    <span className="w-12 text-right font-medium text-foreground">
                      {result.comparison.usAverage}t
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trees to offset */}
            <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-4">
              <TreePine className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium text-foreground">
                  {result.treesNeeded} trees needed
                </p>
                <p className="text-sm text-muted-foreground">
                  to offset your annual footprint
                </p>
              </div>
            </div>

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-semibold text-foreground">Recommendations</h4>
                <div className="flex flex-col gap-2">
                  {result.recommendations.map((rec, i) => (
                    <Alert key={i} className="py-2">
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-sm">{rec}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={handleReset} className="w-full">
              Recalculate
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Render wizard steps
  const StepIcon = STEPS[step - 1].icon

  return (
    <div className="flex flex-col gap-4">
      {/* Progress */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Step {step} of {STEPS.length}
        </span>
        <Progress value={(step / STEPS.length) * 100} className="h-2 flex-1" />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg text-foreground">
            <StepIcon className="h-5 w-5 text-primary" />
            {STEPS[step - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {step === 1 && (
            <>
              <div className="flex flex-col gap-3">
                <Label className="text-foreground">
                  How do you usually commute to work/school?
                </Label>
                <RadioGroup
                  value={commuteMethod}
                  onValueChange={(v) => setCommuteMethod(v as CommuteMethod)}
                  className="grid grid-cols-2 gap-2"
                >
                  {[
                    { value: "car", label: "Car" },
                    { value: "public-transit", label: "Public Transit" },
                    { value: "bike", label: "Bicycle" },
                    { value: "walk", label: "Walk" },
                    { value: "motorcycle", label: "Motorcycle" },
                    { value: "work-from-home", label: "Work from Home" },
                    { value: "mixed", label: "Mixed" },
                  ].map((opt) => (
                    <div key={opt.value} className="flex items-center gap-2">
                      <RadioGroupItem value={opt.value} id={`commute-${opt.value}`} />
                      <Label htmlFor={`commute-${opt.value}`} className="cursor-pointer">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {(commuteMethod === "car" || commuteMethod === "mixed" || commuteMethod === "motorcycle") && (
                <div className="flex flex-col gap-3">
                  <Label className="text-foreground">
                    Daily round-trip commute distance: {commuteDistanceKm} km
                  </Label>
                  <Slider
                    value={[commuteDistanceKm]}
                    onValueChange={([v]) => setCommuteDistanceKm(v)}
                    min={0}
                    max={150}
                    step={5}
                  />
                </div>
              )}

              {(commuteMethod === "public-transit" || commuteMethod === "mixed") && (
                <div className="flex flex-col gap-3">
                  <Label className="text-foreground">
                    Hours per week on public transit: {publicTransitWeekly}
                  </Label>
                  <Slider
                    value={[publicTransitWeekly]}
                    onValueChange={([v]) => setPublicTransitWeekly(v)}
                    min={0}
                    max={30}
                    step={1}
                  />
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex flex-col gap-3">
                <Label className="text-foreground">What type of car do you drive?</Label>
                <Select value={carType} onValueChange={(v) => setCarType(v as CarType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No car</SelectItem>
                    <SelectItem value="petrol-small">Petrol - Small</SelectItem>
                    <SelectItem value="petrol-medium">Petrol - Medium</SelectItem>
                    <SelectItem value="petrol-large">Petrol - Large/SUV</SelectItem>
                    <SelectItem value="diesel-small">Diesel - Small</SelectItem>
                    <SelectItem value="diesel-medium">Diesel - Medium</SelectItem>
                    <SelectItem value="diesel-large">Diesel - Large/SUV</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="plug-in-hybrid">Plug-in Hybrid</SelectItem>
                    <SelectItem value="electric">Full Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {carType !== "none" && (
                <div className="flex flex-col gap-3">
                  <Label className="text-foreground">
                    Estimated annual driving: {annualCarKm.toLocaleString()} km
                  </Label>
                  <Slider
                    value={[annualCarKm]}
                    onValueChange={([v]) => setAnnualCarKm(v)}
                    min={0}
                    max={50000}
                    step={1000}
                  />
                  <p className="text-xs text-muted-foreground">
                    EU average: ~12,000 km/year. US average: ~20,000 km/year.
                  </p>
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex flex-col gap-3">
                <Label className="text-foreground">
                  Short-haul flights per year (under 3 hours)
                </Label>
                <RadioGroup
                  value={shortHaulFlights}
                  onValueChange={(v) => setShortHaulFlights(v as FlightFrequency)}
                  className="grid grid-cols-3 gap-2"
                >
                  {[
                    { value: "none", label: "None" },
                    { value: "1-2", label: "1-2" },
                    { value: "3-5", label: "3-5" },
                    { value: "6-10", label: "6-10" },
                    { value: "11-20", label: "11-20" },
                    { value: "20+", label: "20+" },
                  ].map((opt) => (
                    <div key={opt.value} className="flex items-center gap-2">
                      <RadioGroupItem value={opt.value} id={`short-${opt.value}`} />
                      <Label htmlFor={`short-${opt.value}`} className="cursor-pointer">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex flex-col gap-3">
                <Label className="text-foreground">
                  Long-haul flights per year (over 6 hours)
                </Label>
                <RadioGroup
                  value={longHaulFlights}
                  onValueChange={(v) => setLongHaulFlights(v as FlightFrequency)}
                  className="grid grid-cols-3 gap-2"
                >
                  {[
                    { value: "none", label: "None" },
                    { value: "1-2", label: "1-2" },
                    { value: "3-5", label: "3-5" },
                    { value: "6-10", label: "6-10" },
                    { value: "11-20", label: "11-20" },
                    { value: "20+", label: "20+" },
                  ].map((opt) => (
                    <div key={opt.value} className="flex items-center gap-2">
                      <RadioGroupItem value={opt.value} id={`long-${opt.value}`} />
                      <Label htmlFor={`long-${opt.value}`} className="cursor-pointer">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                  One long-haul return flight = ~3.6 tonnes CO2e (almost a year's Paris target)
                </p>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="flex flex-col gap-3">
                <Label className="text-foreground">Country (for grid carbon intensity)</Label>
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-3">
                <Label className="text-foreground">Housing type</Label>
                <Select value={housingType} onValueChange={(v) => setHousingType(v as HousingType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment-small">Small Apartment</SelectItem>
                    <SelectItem value="apartment-large">Large Apartment</SelectItem>
                    <SelectItem value="house-small">Small House</SelectItem>
                    <SelectItem value="house-medium">Medium House</SelectItem>
                    <SelectItem value="house-large">Large House</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-3">
                <Label className="text-foreground">Primary heating source</Label>
                <Select value={heatingSource} onValueChange={(v) => setHeatingSource(v as HeatingSource)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="natural-gas">Natural Gas</SelectItem>
                    <SelectItem value="oil">Oil/Kerosene</SelectItem>
                    <SelectItem value="electric-standard">Electric (Standard)</SelectItem>
                    <SelectItem value="electric-heat-pump">Electric Heat Pump</SelectItem>
                    <SelectItem value="wood">Wood/Biomass</SelectItem>
                    <SelectItem value="coal">Coal</SelectItem>
                    <SelectItem value="district-heating">District Heating</SelectItem>
                    <SelectItem value="none">No heating needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-3">
                <Label className="text-foreground">Electricity source</Label>
                <Select
                  value={electricitySource}
                  onValueChange={(v) => setElectricitySource(v as ElectricitySource)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard-grid">Standard Grid</SelectItem>
                    <SelectItem value="green-tariff">Green Energy Tariff</SelectItem>
                    <SelectItem value="solar-panels">Solar Panels</SelectItem>
                    <SelectItem value="mixed-renewable">Mixed Renewable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-foreground">Air conditioning / Cooling</Label>
                <Switch checked={hasCooling} onCheckedChange={setHasCooling} />
              </div>

              {hasCooling && (
                <div className="flex flex-col gap-3">
                  <Label className="text-foreground">
                    Months of AC usage per year: {coolingMonths}
                  </Label>
                  <Slider
                    value={[coolingMonths]}
                    onValueChange={([v]) => setCoolingMonths(v)}
                    min={1}
                    max={12}
                    step={1}
                  />
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Label className="text-foreground">
                  Number of people in household: {householdMembers}
                </Label>
                <Slider
                  value={[householdMembers]}
                  onValueChange={([v]) => setHouseholdMembers(v)}
                  min={1}
                  max={8}
                  step={1}
                />
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <div className="flex flex-col gap-3">
                <Label className="text-foreground">Clothing purchases</Label>
                <RadioGroup
                  value={clothingPurchases}
                  onValueChange={(v) => setClothingPurchases(v as ShoppingHabit)}
                  className="flex flex-col gap-2"
                >
                  {[
                    { value: "minimal", label: "Minimal (mostly second-hand, buy rarely)" },
                    { value: "low", label: "Low (few items per year)" },
                    { value: "average", label: "Average (seasonal shopping)" },
                    { value: "high", label: "High (frequent purchases)" },
                    { value: "very-high", label: "Very High (fast fashion regular buyer)" },
                  ].map((opt) => (
                    <div key={opt.value} className="flex items-center gap-2">
                      <RadioGroupItem value={opt.value} id={`cloth-${opt.value}`} />
                      <Label htmlFor={`cloth-${opt.value}`} className="cursor-pointer">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex flex-col gap-3">
                <Label className="text-foreground">Electronics purchases (phones, laptops, etc.)</Label>
                <RadioGroup
                  value={electronicsPurchases}
                  onValueChange={(v) => setElectronicsPurchases(v as ShoppingHabit)}
                  className="flex flex-col gap-2"
                >
                  {[
                    { value: "minimal", label: "Minimal (use until broken, rarely upgrade)" },
                    { value: "low", label: "Low (replace every 4-5 years)" },
                    { value: "average", label: "Average (replace every 2-3 years)" },
                    { value: "high", label: "High (upgrade frequently)" },
                    { value: "very-high", label: "Very High (always latest models)" },
                  ].map((opt) => (
                    <div key={opt.value} className="flex items-center gap-2">
                      <RadioGroupItem value={opt.value} id={`elec-${opt.value}`} />
                      <Label htmlFor={`elec-${opt.value}`} className="cursor-pointer">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex flex-col gap-3">
                <Label className="text-foreground">Recycling habits</Label>
                <RadioGroup
                  value={recyclingHabit}
                  onValueChange={(v) => setRecyclingHabit(v as RecyclingHabit)}
                  className="flex flex-col gap-2"
                >
                  {[
                    { value: "none", label: "None (everything to landfill)" },
                    { value: "some", label: "Some (recycle occasionally)" },
                    { value: "most", label: "Most (recycle paper, plastic, glass)" },
                    { value: "all", label: "All (recycle everything possible)" },
                    { value: "zero-waste", label: "Zero-waste lifestyle" },
                  ].map((opt) => (
                    <div key={opt.value} className="flex items-center gap-2">
                      <RadioGroupItem value={opt.value} id={`rec-${opt.value}`} />
                      <Label htmlFor={`rec-${opt.value}`} className="cursor-pointer">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-foreground">Do you compost food waste?</Label>
                <Switch checked={composting} onCheckedChange={setComposting} />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext}>
            {step === STEPS.length ? "Calculate" : "Next"}
            {step < STEPS.length && <ChevronRight className="ml-1 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
