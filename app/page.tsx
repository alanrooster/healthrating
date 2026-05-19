"use client"

import { useState, useMemo } from "react"
import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { HealthDashboard } from "@/components/health-dashboard"
import { BodyCompositionSection } from "@/components/body-composition-section"
import { AirQualitySection } from "@/components/air-quality-section"
import { WaterSection } from "@/components/water-section"
import { DietSection } from "@/components/diet-section"
import { ExerciseSection } from "@/components/exercise-section"
import { WorkSection } from "@/components/work-section"
import { LifestyleSection } from "@/components/lifestyle-section"
import { MentalHealthSection } from "@/components/mental-health-section"
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
  } | null>(null)
  const [airData, setAirData] = useState<{
    country: string
  } | null>(null)

  // Store full results for each section to persist when navigating
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [storedResults, setStoredResults] = useState<Record<string, any>>({})

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
    }),
    [bodyScore, airScore, waterScore, dietScore, exerciseScore, workScore, lifestyleScore, mentalHealthScore]
  )

  const overallResult = useMemo(() => calculateOverallHealth(scores), [scores])

  // Calculate life expectancy based on all available data
  const lifeExpectancyData = useMemo(() => {
    // Only calculate if we have at least one completed assessment
    const hasData = Object.values(scores).some(s => s.completed)
    if (!hasData) return undefined

    const inputs: LifeExpectancyInputs = {
      bodyScore: bodyScore.completed ? bodyScore.score : undefined,
      airQualityScore: airScore.completed ? airScore.score : undefined,
      waterQualityScore: waterScore.completed ? waterScore.score : undefined,
      dietScore: dietScore.completed ? dietScore.score : undefined,
      exerciseScore: exerciseScore.completed ? exerciseScore.score : undefined,
      workScore: workScore.completed ? workScore.score : undefined,
      lifestyleScore: lifestyleScore.completed ? lifestyleScore.score : undefined,
      mentalHealthScore: mentalHealthScore.completed ? mentalHealthScore.score : undefined,
      smokingStatus: lifestyleData?.smokingStatus,
      alcoholFrequency: lifestyleData?.alcoholFrequency,
      processedMeatFrequency: dietData?.processedMeatFrequency,
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
  }, [scores, bodyScore, airScore, waterScore, dietScore, exerciseScore, workScore, lifestyleScore, mentalHealthScore, lifestyleData, dietData])

  function handleBodyResult(score: number) {
    setBodyScore({ score, completed: true, label: "Body Composition" })
  }

  function handleAirResult(score: number, countryData?: { country: string }) {
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

  function handleLifestyleResult(score: number, lifestyleExtras?: { smokingStatus: string; alcoholFrequency: string; alcoholUnitsPerSession: number }) {
    setLifestyleScore({ score, completed: true, label: "Lifestyle" })
    if (lifestyleExtras) {
      setLifestyleData(lifestyleExtras)
    }
  }

  function handleMentalHealthResult(score: number) {
    setMentalHealthScore({ score, completed: true, label: "Mental Health" })
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
          />
        )
      case "body":
        return <BodyCompositionSection onResult={handleBodyResult} storedResult={storedResults.body} onStoreResult={(r) => storeResult("body", r)} onRetake={() => clearResult("body")} />
      case "air":
        return <AirQualitySection onResult={handleAirResult} storedResult={storedResults.air} onStoreResult={(r) => storeResult("air", r)} onRetake={() => clearResult("air")} />
      case "water":
        return <WaterSection onResult={handleWaterResult} storedResult={storedResults.water} onStoreResult={(r) => storeResult("water", r)} onRetake={() => clearResult("water")} />
      case "diet":
        return <DietSection onResult={handleDietResult} storedResult={storedResults.diet} onStoreResult={(r) => storeResult("diet", r)} onRetake={() => clearResult("diet")} />
      case "exercise":
        return <ExerciseSection onResult={handleExerciseResult} storedResult={storedResults.exercise} onStoreResult={(r) => storeResult("exercise", r)} onRetake={() => clearResult("exercise")} />
      case "work":
        return <WorkSection onResult={handleWorkResult} storedResult={storedResults.work} onStoreResult={(r) => storeResult("work", r)} onRetake={() => clearResult("work")} />
      case "lifestyle":
        return <LifestyleSection onResult={handleLifestyleResult} storedResult={storedResults.lifestyle} onStoreResult={(r) => storeResult("lifestyle", r)} onRetake={() => clearResult("lifestyle")} />
      case "mental":
        return <MentalHealthSection onResult={handleMentalHealthResult} storedResult={storedResults.mental} onStoreResult={(r) => storeResult("mental", r)} onRetake={() => clearResult("mental")} />
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
