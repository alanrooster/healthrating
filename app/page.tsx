"use client"

import { useState, useMemo } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
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

const EMPTY_SCORE: ModuleScore = { score: 0, completed: false, label: "" }

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
  } | null>(null)
  const [waterData, setWaterData] = useState<{
    plasticBottlesPerWeek: number
  } | null>(null)

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

  function handleBodyResult(score: number) {
    setBodyScore({ score, completed: true, label: "Body Composition" })
  }

  function handleAirResult(score: number) {
    setAirScore({ score, completed: true, label: "Air Quality" })
  }

  function handleWaterResult(score: number, plasticData?: { plasticBottlesPerWeek: number }) {
    setWaterScore({ score, completed: true, label: "Water Quality" })
    if (plasticData) {
      setWaterData(plasticData)
    }
  }

  function handleDietResult(score: number, meatData?: { redMeatFrequency: number; processedMeatFrequency: number; fishFrequency: number }) {
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

  function handleLifestyleResult(score: number) {
    setLifestyleScore({ score, completed: true, label: "Lifestyle" })
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
          />
        )
      case "body":
        return <BodyCompositionSection onResult={handleBodyResult} />
      case "air":
        return <AirQualitySection onResult={handleAirResult} />
      case "water":
        return <WaterSection onResult={handleWaterResult} />
      case "diet":
        return <DietSection onResult={handleDietResult} />
      case "exercise":
        return <ExerciseSection onResult={handleExerciseResult} />
      case "work":
        return <WorkSection onResult={handleWorkResult} />
      case "lifestyle":
        return <LifestyleSection onResult={handleLifestyleResult} />
      case "mental":
        return <MentalHealthSection onResult={handleMentalHealthResult} />
      case "carbon":
        return <CarbonSection onResult={handleCarbonResult} dietData={dietData} waterData={waterData} />
      case "methodology":
        return <MethodologySection />
      default:
        return (
          <HealthDashboard
            result={overallResult}
            onNavigate={setActiveSection}
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
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium text-foreground">
            {sectionTitles[activeSection] ?? "Dashboard"}
          </span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-4xl">{renderSection()}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
