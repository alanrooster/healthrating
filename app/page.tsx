"use client"

import { useState, useMemo } from "react"
import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { HealthDashboard } from "@/components/health-dashboard"
import { calculateBiologicalAge } from "@/lib/biological-age-calculator"
import { BodyCompositionSection } from "@/components/body-composition-section"
import { AirQualitySection } from "@/components/air-quality-section"
import { WaterSection } from "@/components/water-section"
import { DietSection } from "@/components/diet-section"
import { ExerciseSection } from "@/components/exercise-section"
import { WorkSection } from "@/components/work-section"
import { LifestyleSection } from "@/components/lifestyle-section"
import { MentalHealthSection } from "@/components/mental-health-section"
import { FamilyHistorySection } from "@/components/family-history-section"
import { PreventiveCareSection } from "@/components/preventive-care-section"
import { SensesOralSection } from "@/components/senses-oral-section"
import { LifeContextSection } from "@/components/life-context-section"
import { PersonalitySection } from "@/components/personality-section"
import { HomeEnvironmentSection } from "@/components/home-environment-section"
import { CarbonSection } from "@/components/carbon-section"
import { MethodologySection } from "@/components/methodology-section"
import {
  calculateOverallHealth,
  type HealthScores,
  type ModuleScore,
} from "@/lib/health-score"
import { calculateLifeExpectancy, type LifeExpectancyInputs } from "@/lib/life-expectancy-calculator"

const EMPTY_SCORE: ModuleScore = { score: 0, completed: false, label: "" }

function PageHeader({ title }: { title: string }) {
  const { toggleSidebar, isMobile } = useSidebar()

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card px-4">
      {isMobile ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="-ml-1 flex items-center gap-2"
        >
          <Menu className="h-4 w-4" />
          <span>Menu</span>
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="-ml-1 h-7 w-7"
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      )}
      <Separator orientation="vertical" className="mr-2 h-4" />
      <span className="text-sm font-medium text-foreground">{title}</span>
    </header>
  )
}

export default function Page() {
  const [activeSection, setActiveSection] = useState("dashboard")

  // Module scores
  const [bodyScore, setBodyScore] = useState<ModuleScore>({
    ...EMPTY_SCORE,
    label: "Body Composition",
  })
  const [airScore, setAirScore] = useState<ModuleScore>({
    ...EMPTY_SCORE,
    label: "Air Quality",
  })
  const [waterScore, setWaterScore] = useState<ModuleScore>({
    ...EMPTY_SCORE,
    label: "Water Quality",
  })
  const [dietScore, setDietScore] = useState<ModuleScore>({
    ...EMPTY_SCORE,
    label: "Diet",
  })
  const [exerciseScore, setExerciseScore] = useState<ModuleScore>({
    ...EMPTY_SCORE,
    label: "Exercise",
  })
  const [workScore, setWorkScore] = useState<ModuleScore>({
    ...EMPTY_SCORE,
    label: "Work",
  })
  const [lifestyleScore, setLifestyleScore] = useState<ModuleScore>({
    ...EMPTY_SCORE,
    label: "Lifestyle",
  })
  const [mentalHealthScore, setMentalHealthScore] = useState<ModuleScore>({
    ...EMPTY_SCORE,
    label: "Mental Health",
  })
  const [familyHistoryScore, setFamilyHistoryScore] = useState<ModuleScore>({
    ...EMPTY_SCORE,
    label: "Family History",
  })
  const [preventiveCareScore, setPreventiveCareScore] = useState<ModuleScore>({
    ...EMPTY_SCORE,
    label: "Preventive Care",
  })
  const [sensesOralScore, setSensesOralScore] = useState<ModuleScore>({
    ...EMPTY_SCORE,
    label: "Senses & Oral Health",
  })
  const [lifeContextScore, setLifeContextScore] = useState<ModuleScore>({
    ...EMPTY_SCORE,
    label: "Life Context",
  })
  const [personalityScore, setPersonalityScore] = useState<ModuleScore>({
    ...EMPTY_SCORE,
    label: "Personality & Outlook",
  })
  const [homeEnvironmentScore, setHomeEnvironmentScore] = useState<ModuleScore>({
    ...EMPTY_SCORE,
    label: "Home Environment",
  })

  // Carbon footprint (separate from health scores)
  const [carbonCompleted, setCarbonCompleted] = useState(false)
  const [carbonScore, setCarbonScore] = useState(0)
  const [totalCO2, setTotalCO2] = useState(0)

  // Cross-module data for carbon calculation
  const [dietData, setDietData] = useState<{
    redMeatFrequency: number
    processedMeatFrequency: number
    fishFrequency: number
    alcoholFrequency: number
  } | null>(null)
  const [waterData, setWaterData] = useState<{
    plasticBottlesPerWeek: number
    primarySourceBottled: boolean
  } | null>(null)
  const [lifestyleData, setLifestyleData] = useState<{
    smokingStatus: string
    alcoholFrequency: string
    alcoholUnitsPerSession: number
    sleepHours?: number
    socialConnection?: "strong" | "moderate" | "weak" | "isolated"
  } | null>(null)
  const [airData, setAirData] = useState<{
    country: string
    pm25Level?: number
  } | null>(null)
  const [bodyDemographics, setBodyDemographics] = useState<{
    age: number
    sex: "male" | "female"
    bmiCategory?: "underweight" | "normal" | "overweight" | "obese" | "severely_obese"
  } | null>(null)

  // Store full results for each section to persist when navigating
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [storedResults, setStoredResults] = useState<Record<string, any>>({})
  // Store form inputs for each section so answers persist across navigation
  // and across "Retake assessment" (which clears results but keeps answers)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [storedInputs, setStoredInputs] = useState<Record<string, any>>({})

  function storeResult(key: string, result: unknown) {
    setStoredResults(prev => ({ ...prev, [key]: result }))
  }

  function clearResult(key: string) {
    setStoredResults(prev => {
      const newResults = { ...prev }
      delete newResults[key]
      return newResults
    })
  }

  function storeInputs(key: string, inputs: unknown) {
    setStoredInputs(prev => ({ ...prev, [key]: inputs }))
  }

  const scores: HealthScores = useMemo(
    () => ({
      body: bodyScore,
      airQuality: airScore,
      waterQuality: waterScore,
      diet: dietScore,
      exercise: exerciseScore,
      work: workScore,
      lifestyle: lifestyleScore,
      mentalHealth: mentalHealthScore,
      familyHistory: familyHistoryScore,
      preventiveCare: preventiveCareScore,
      sensesOral: sensesOralScore,
      lifeContext: lifeContextScore,
      personality: personalityScore,
      homeEnvironment: homeEnvironmentScore,
    }),
    [bodyScore, airScore, waterScore, dietScore, exerciseScore, workScore, lifestyleScore, mentalHealthScore, familyHistoryScore, preventiveCareScore, sensesOralScore, lifeContextScore, personalityScore, homeEnvironmentScore]
  )

  const overallResult = useMemo(() => calculateOverallHealth(scores), [scores])

  // Calculate life expectancy based on all available data
  const lifeExpectancyData = useMemo(() => {
    // Only calculate if we have at least one completed assessment
    const hasData = Object.values(scores).some(s => s.completed)
    if (!hasData) return undefined

    const inputs: LifeExpectancyInputs = {
      age: bodyDemographics?.age,
      sex: bodyDemographics?.sex,
      bodyScore: bodyScore.completed ? bodyScore.score : undefined,
      airQualityScore: airScore.completed ? airScore.score : undefined,
      waterQualityScore: waterScore.completed ? waterScore.score : undefined,
      dietScore: dietScore.completed ? dietScore.score : undefined,
      exerciseScore: exerciseScore.completed ? exerciseScore.score : undefined,
      workScore: workScore.completed ? workScore.score : undefined,
      lifestyleScore: lifestyleScore.completed ? lifestyleScore.score : undefined,
      mentalHealthScore: mentalHealthScore.completed ? mentalHealthScore.score : undefined,
      lifeContextScore: lifeContextScore.completed ? lifeContextScore.score : undefined,
      personalityScore: personalityScore.completed ? personalityScore.score : undefined,
      homeEnvironmentScore: homeEnvironmentScore.completed ? homeEnvironmentScore.score : undefined,
      smokingStatus: lifestyleData?.smokingStatus,
      alcoholFrequency: lifestyleData?.alcoholFrequency,
      sleepHours: lifestyleData?.sleepHours,
      socialConnection: lifestyleData?.socialConnection,
      bmiCategory: bodyDemographics?.bmiCategory,
      processedMeatFrequency: dietData?.processedMeatFrequency,
      pm25Level: airData?.pm25Level,
      country: airData?.country,
    }

    const result = calculateLifeExpectancy(inputs)
    
    return {
      adjustedYears: result.adjustedYears,
      totalAdjustment: result.totalAdjustment,
      percentile: result.percentile,
      potentialGain: result.potentialGain,
      confidence: result.confidence,
      topFactors: result.adjustments.slice(0, 4).map(a => ({
        factor: a.factor,
        years: a.years,
        direction: a.direction as "positive" | "negative",
      })),
    }
  }, [scores, bodyScore, airScore, waterScore, dietScore, exerciseScore, workScore, lifestyleScore, mentalHealthScore, lifeContextScore, personalityScore, homeEnvironmentScore, lifestyleData, dietData, airData, bodyDemographics])

  // Biological age requires a known chronological age (from the Body module)
  const biologicalAgeData = useMemo(() => {
    if (!bodyDemographics || !lifeExpectancyData) return undefined
    const completedCount = Object.values(scores).filter(s => s.completed).length
    return calculateBiologicalAge({
      chronologicalAge: bodyDemographics.age,
      totalAdjustment: lifeExpectancyData.totalAdjustment,
      dataPoints: completedCount,
    })
  }, [bodyDemographics, lifeExpectancyData, scores])

  function handleBodyResult(
    score: number,
    demographics?: {
      age: number
      sex: "male" | "female"
      bmiCategory?: "underweight" | "normal" | "overweight" | "obese" | "severely_obese"
    },
  ) {
    setBodyScore({ score, completed: true, label: "Body Composition" })
    if (demographics) {
      setBodyDemographics(demographics)
    }
  }

  function handleAirResult(score: number, countryData?: { country: string; pm25Level?: number }) {
    setAirScore({ score, completed: true, label: "Air Quality" })
    if (countryData) {
      setAirData(countryData)
    }
  }

  function handleWaterResult(score: number, plasticData?: { plasticBottlesPerWeek: number; primarySourceBottled: boolean }) {
    setWaterScore({ score, completed: true, label: "Water Quality" })
    if (plasticData) {
      setWaterData(plasticData)
    }
  }

  function handleDietResult(score: number, meatData?: { redMeatFrequency: number; processedMeatFrequency: number; fishFrequency: number; alcoholFrequency: number }) {
    setDietScore({ score, completed: true, label: "Diet" })
    if (meatData) {
      setDietData(meatData)
    }
  }

  function handleExerciseResult(score: number) {
    setExerciseScore({ score, completed: true, label: "Exercise" })
  }

  function handleWorkResult(score: number) {
    setWorkScore({ score, completed: true, label: "Work" })
  }

  function handleLifestyleResult(
    score: number,
    lifestyleExtras?: {
      smokingStatus: string
      alcoholFrequency: string
      alcoholUnitsPerSession: number
      sleepHours?: number
      socialConnection?: "strong" | "moderate" | "weak" | "isolated"
    },
  ) {
    setLifestyleScore({ score, completed: true, label: "Lifestyle" })
    if (lifestyleExtras) {
      setLifestyleData(lifestyleExtras)
    }
  }

  function handleMentalHealthResult(score: number) {
    setMentalHealthScore({ score, completed: true, label: "Mental Health" })
  }

  function handleFamilyHistoryResult(score: number) {
    setFamilyHistoryScore({ score, completed: true, label: "Family History" })
  }

  function handlePreventiveCareResult(score: number) {
    setPreventiveCareScore({ score, completed: true, label: "Preventive Care" })
  }

  function handleSensesOralResult(score: number) {
    setSensesOralScore({ score, completed: true, label: "Senses & Oral Health" })
  }

  function handleLifeContextResult(score: number) {
    setLifeContextScore({ score, completed: true, label: "Life Context" })
  }

  function handlePersonalityResult(score: number) {
    setPersonalityScore({ score, completed: true, label: "Personality & Outlook" })
  }

  function handleHomeEnvironmentResult(score: number) {
    setHomeEnvironmentScore({ score, completed: true, label: "Home Environment" })
  }

  function handleCarbonResult(score: number, kgCO2: number) {
    setCarbonScore(score)
    setCarbonCompleted(true)
    setTotalCO2(kgCO2)
  }

  function renderSection() {
    switch (activeSection) {
      case "dashboard":
        return (
          <HealthDashboard
            result={overallResult}
            onNavigate={setActiveSection}
            carbonData={carbonCompleted ? { score: carbonScore, totalKgCO2: totalCO2 } : undefined}
            lifeExpectancyData={lifeExpectancyData}
            biologicalAgeData={biologicalAgeData}
          />
        )
      case "body":
        return <BodyCompositionSection onResult={handleBodyResult} storedResult={storedResults.body} onStoreResult={(r) => storeResult("body", r)} onRetake={() => clearResult("body")} storedInputs={storedInputs.body} onStoreInputs={(i) => storeInputs("body", i)} />
      case "air":
        return <AirQualitySection onResult={handleAirResult} storedResult={storedResults.air} onStoreResult={(r) => storeResult("air", r)} onRetake={() => clearResult("air")} storedInputs={storedInputs.air} onStoreInputs={(i) => storeInputs("air", i)} />
      case "water":
        return <WaterSection onResult={handleWaterResult} storedResult={storedResults.water} onStoreResult={(r) => storeResult("water", r)} onRetake={() => clearResult("water")} storedInputs={storedInputs.water} onStoreInputs={(i) => storeInputs("water", i)} />
      case "diet":
        return <DietSection onResult={handleDietResult} storedResult={storedResults.diet} onStoreResult={(r) => storeResult("diet", r)} onRetake={() => clearResult("diet")} storedInputs={storedInputs.diet} onStoreInputs={(i) => storeInputs("diet", i)} />
      case "exercise":
        return <ExerciseSection onResult={handleExerciseResult} storedResult={storedResults.exercise} onStoreResult={(r) => storeResult("exercise", r)} onRetake={() => clearResult("exercise")} storedInputs={storedInputs.exercise} onStoreInputs={(i) => storeInputs("exercise", i)} />
      case "work":
        return <WorkSection onResult={handleWorkResult} storedResult={storedResults.work} onStoreResult={(r) => storeResult("work", r)} onRetake={() => clearResult("work")} storedInputs={storedInputs.work} onStoreInputs={(i) => storeInputs("work", i)} />
      case "lifestyle":
        return <LifestyleSection onResult={handleLifestyleResult} storedResult={storedResults.lifestyle} onStoreResult={(r) => storeResult("lifestyle", r)} onRetake={() => clearResult("lifestyle")} storedInputs={storedInputs.lifestyle} onStoreInputs={(i) => storeInputs("lifestyle", i)} />
      case "mental":
        return <MentalHealthSection onResult={handleMentalHealthResult} storedResult={storedResults.mental} onStoreResult={(r) => storeResult("mental", r)} onRetake={() => clearResult("mental")} storedInputs={storedInputs.mental} onStoreInputs={(i) => storeInputs("mental", i)} />
      case "family":
        return <FamilyHistorySection onResult={handleFamilyHistoryResult} storedResult={storedResults.family} onStoreResult={(r) => storeResult("family", r)} onRetake={() => clearResult("family")} storedInputs={storedInputs.family} onStoreInputs={(i) => storeInputs("family", i)} />
      case "preventive":
        return <PreventiveCareSection onResult={handlePreventiveCareResult} storedResult={storedResults.preventive} onStoreResult={(r) => storeResult("preventive", r)} onRetake={() => clearResult("preventive")} storedInputs={storedInputs.preventive} onStoreInputs={(i) => storeInputs("preventive", i)} />
      case "senses":
        return <SensesOralSection onResult={handleSensesOralResult} storedResult={storedResults.senses} onStoreResult={(r) => storeResult("senses", r)} onRetake={() => clearResult("senses")} storedInputs={storedInputs.senses} onStoreInputs={(i) => storeInputs("senses", i)} />
      case "lifecontext":
        return <LifeContextSection onResult={handleLifeContextResult} storedResult={storedResults.lifecontext} onStoreResult={(r) => storeResult("lifecontext", r)} onRetake={() => clearResult("lifecontext")} storedInputs={storedInputs.lifecontext} onStoreInputs={(i) => storeInputs("lifecontext", i)} />
      case "personality":
        return <PersonalitySection onResult={handlePersonalityResult} storedResult={storedResults.personality} onStoreResult={(r) => storeResult("personality", r)} onRetake={() => clearResult("personality")} storedInputs={storedInputs.personality} onStoreInputs={(i) => storeInputs("personality", i)} />
      case "home":
        return <HomeEnvironmentSection onResult={handleHomeEnvironmentResult} storedResult={storedResults.home} onStoreResult={(r) => storeResult("home", r)} onRetake={() => clearResult("home")} storedInputs={storedInputs.home} onStoreInputs={(i) => storeInputs("home", i)} />
      case "carbon":
        return (
          <CarbonSection
            onResult={handleCarbonResult}
            dietData={dietData}
            waterData={waterData}
            lifestyleData={lifestyleData}
            airData={airData}
            storedResult={storedResults.carbon}
            onStoreResult={(r) => storeResult("carbon", r)}
            onRetake={() => clearResult("carbon")}
          />
        )
      case "methodology":
        return <MethodologySection />
      default:
        return (
          <HealthDashboard
            result={overallResult}
            onNavigate={setActiveSection}
            carbonData={carbonCompleted ? { score: carbonScore, totalKgCO2: totalCO2 } : undefined}
            lifeExpectancyData={lifeExpectancyData}
            biologicalAgeData={biologicalAgeData}
          />
        )
    }
  }

  const sectionTitles: Record<string, string> = {
    dashboard: "Dashboard",
    body: "Body Composition",
    air: "Air Quality",
    water: "Water Quality",
    diet: "Diet Assessment",
    exercise: "Exercise Assessment",
    work: "Work Assessment",
    lifestyle: "Lifestyle Assessment",
    mental: "Mental Health Screening",
    family: "Family Medical History",
    preventive: "Preventive Care",
    senses: "Senses & Oral Health",
    lifecontext: "Life Context",
    personality: "Personality & Outlook",
    home: "Home Environment",
    carbon: "Carbon Footprint",
    methodology: "Methodology",
  }

  return (
    <SidebarProvider>
      <AppSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        scores={scores}
        carbonCompleted={carbonCompleted}
        carbonScore={carbonScore}
      />
      <SidebarInset>
        <PageHeader title={sectionTitles[activeSection] ?? "Dashboard"} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-4xl">{renderSection()}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
