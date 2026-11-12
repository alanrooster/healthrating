"use client"

import { useState, useMemo, useEffect } from "react"
import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { HealthDashboard } from "@/components/health-dashboard"
import { calculateBiologicalAge } from "@/lib/biological-age-calculator"
import { calculateCancerRisk } from "@/lib/cancer-risk-calculator"
import { calculateCardiovascularHealth } from "@/lib/cardiovascular-health"
import { calculateDiabetesRisk } from "@/lib/diabetes-risk-calculator"
import { calculateNeuroRisk } from "@/lib/neuro-risk-calculator"
import { HomeSection } from "@/components/home-section"
import { SiteFooter } from "@/components/site-footer"
import { AssessmentNextSteps } from "@/components/assessment-next-steps"
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
import { MethodologySection } from "@/components/methodology-section"
import {
  calculateOverallHealth,
  type HealthScores,
  type ModuleScore,
} from "@/lib/health-score"
import {
  calculateLifeExpectancy,
  substanceYearsLost,
  type LifeExpectancyInputs,
  type SubstanceUse,
} from "@/lib/life-expectancy-calculator"
import { reportsDrugUse, weeklyAlcoholGrams, type LifestyleExtras } from "@/lib/lifestyle-calculator"
import { SAVED_STATE_KEY, isRecord, readModuleScore } from "@/lib/saved-state"
import { getLocalUv } from "@/lib/uv-exposure"

const EMPTY_SCORE: ModuleScore = { score: 0, completed: false, label: "" }

interface BodyDemographics {
  age: number
  sex: "male" | "female"
  bmiCategory?: "underweight" | "normal" | "overweight" | "obese" | "severely_obese"
  /** Raw BMI, as the FINDRISC diabetes screen uses it */
  bmi?: number
  /** Composite BMI behind the category; absent in results saved before it was passed on */
  compositeBmi?: number
  waistCm?: number
}

interface DietExtras {
  processedMeatFrequency: number
}

interface AirExtras {
  country: string
  city?: string
  pm25Level?: number
}

function PageHeader({ title }: { title: string }) {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card px-4">
      <Button
        variant="default"
        size="sm"
        onClick={toggleSidebar}
        className="-ml-1 flex items-center gap-2 shadow-sm"
      >
        <Menu className="h-4 w-4" />
        <span>Menu</span>
      </Button>
      <Separator orientation="vertical" className="mr-2 h-4" />
      <span className="text-sm font-medium text-foreground">{title}</span>
    </header>
  )
}

export default function Page() {
  const [activeSection, setActiveSection] = useState("welcome")
  const [assessmentResetKey, setAssessmentResetKey] = useState(0)

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

  // Cross-module data for the life expectancy, biological age and risk screens
  const [dietData, setDietData] = useState<DietExtras | null>(null)
  const [lifestyleData, setLifestyleData] = useState<LifestyleExtras | null>(null)
  const [airData, setAirData] = useState<AirExtras | null>(null)
  const [bodyDemographics, setBodyDemographics] = useState<BodyDemographics | null>(null)

  // A module's data counts only while the module is completed, so a retake in progress doesn't
  // leak the previous answers into the estimates
  const completedBody = bodyScore.completed ? bodyDemographics : null
  const completedLifestyle = lifestyleScore.completed ? lifestyleData : null
  const completedAir = airScore.completed ? airData : null
  const completedDiet = dietScore.completed ? dietData : null

  // Store full results for each section to persist when navigating
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [storedResults, setStoredResults] = useState<Record<string, any>>({})
  // Store form inputs for each section so answers persist across navigation
  // and across "Retake assessment" (which clears results but keeps answers)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [storedInputs, setStoredInputs] = useState<Record<string, any>>({})

  // ---- localStorage persistence ----
  // All assessment data is saved to the browser so it survives page refreshes.
  // Must be state (not a ref): saving is only safe on the re-render AFTER the
  // restored values have been applied. A ref flips too early and the save
  // effect would overwrite storage with the initial empty state on mount.
  const [hydrated, setHydrated] = useState(false)

  // Hydrate once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_STATE_KEY)
      // Saved state is untrusted input: only well-formed parts are restored
      const s: unknown = raw ? JSON.parse(raw) : null
      if (isRecord(s)) {
        const restoreScore = (value: unknown, label: string, setScore: (score: ModuleScore) => void) => {
          const score = readModuleScore(value, label)
          if (score) setScore(score)
        }
        restoreScore(s.bodyScore, "Body Composition", setBodyScore)
        restoreScore(s.airScore, "Air Quality", setAirScore)
        restoreScore(s.waterScore, "Water Quality", setWaterScore)
        restoreScore(s.dietScore, "Diet", setDietScore)
        restoreScore(s.exerciseScore, "Exercise", setExerciseScore)
        restoreScore(s.workScore, "Work", setWorkScore)
        restoreScore(s.lifestyleScore, "Lifestyle", setLifestyleScore)
        restoreScore(s.mentalHealthScore, "Mental Health", setMentalHealthScore)
        restoreScore(s.familyHistoryScore, "Family History", setFamilyHistoryScore)
        restoreScore(s.preventiveCareScore, "Preventive Care", setPreventiveCareScore)
        restoreScore(s.sensesOralScore, "Senses & Oral Health", setSensesOralScore)
        restoreScore(s.lifeContextScore, "Life Context", setLifeContextScore)
        restoreScore(s.personalityScore, "Personality & Outlook", setPersonalityScore)
        restoreScore(s.homeEnvironmentScore, "Home Environment", setHomeEnvironmentScore)
        if (isRecord<DietExtras>(s.dietData)) setDietData(s.dietData)
        if (isRecord<LifestyleExtras>(s.lifestyleData)) setLifestyleData(s.lifestyleData)
        if (isRecord<AirExtras>(s.airData)) setAirData(s.airData)
        if (isRecord<BodyDemographics>(s.bodyDemographics)) setBodyDemographics(s.bodyDemographics)
        if (isRecord(s.storedResults)) {
          // Left behind by the Carbon Footprint module, which has been removed
          delete s.storedResults.carbon
          setStoredResults(s.storedResults)
        }
        if (isRecord(s.storedInputs)) setStoredInputs(s.storedInputs)
      }
    } catch {
      // Corrupt or inaccessible storage — start fresh
    }
    // Batched with the restore setters above, so the save effect only runs
    // once the restored state is actually in place.
    setHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save after every change (only once hydrated, to avoid wiping saved data
  // with the initial empty state)
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(
        SAVED_STATE_KEY,
        JSON.stringify({
          bodyScore, airScore, waterScore, dietScore, exerciseScore, workScore,
          lifestyleScore, mentalHealthScore, familyHistoryScore, preventiveCareScore,
          sensesOralScore, lifeContextScore, personalityScore, homeEnvironmentScore,
          dietData, lifestyleData, airData, bodyDemographics,
          storedResults, storedInputs,
        }),
      )
    } catch {
      // Storage full or unavailable — fail silently, app still works in-memory
    }
  }, [
    hydrated,
    bodyScore, airScore, waterScore, dietScore, exerciseScore, workScore,
    lifestyleScore, mentalHealthScore, familyHistoryScore, preventiveCareScore,
    sensesOralScore, lifeContextScore, personalityScore, homeEnvironmentScore,
    dietData, lifestyleData, airData, bodyDemographics,
    storedResults, storedInputs,
  ])

  function handleRetakeAssessment() {
    const scoreResetters: Record<string, () => void> = {
      body: () => setBodyScore({ ...EMPTY_SCORE, label: "Body Composition" }),
      air: () => setAirScore({ ...EMPTY_SCORE, label: "Air Quality" }),
      water: () => setWaterScore({ ...EMPTY_SCORE, label: "Water Quality" }),
      diet: () => setDietScore({ ...EMPTY_SCORE, label: "Diet" }),
      exercise: () => setExerciseScore({ ...EMPTY_SCORE, label: "Exercise" }),
      work: () => setWorkScore({ ...EMPTY_SCORE, label: "Work" }),
      lifestyle: () => setLifestyleScore({ ...EMPTY_SCORE, label: "Lifestyle" }),
      mental: () => setMentalHealthScore({ ...EMPTY_SCORE, label: "Mental Health" }),
      family: () => setFamilyHistoryScore({ ...EMPTY_SCORE, label: "Family History" }),
      preventive: () => setPreventiveCareScore({ ...EMPTY_SCORE, label: "Preventive Care" }),
      senses: () => setSensesOralScore({ ...EMPTY_SCORE, label: "Senses & Oral Health" }),
      lifecontext: () => setLifeContextScore({ ...EMPTY_SCORE, label: "Life Context" }),
      personality: () => setPersonalityScore({ ...EMPTY_SCORE, label: "Personality & Outlook" }),
      home: () => setHomeEnvironmentScore({ ...EMPTY_SCORE, label: "Home Environment" }),
    }
    const resultKeys: Record<string, string> = {
      body: "body",
      air: "air",
      water: "water",
      diet: "diet",
      exercise: "exercise",
      work: "work",
      lifestyle: "lifestyle",
      mental: "mental",
      family: "family",
      preventive: "preventive",
      senses: "senses",
      lifecontext: "lifecontext",
      personality: "personality",
      home: "home",
    }

    scoreResetters[activeSection]?.()
    const resultKey = resultKeys[activeSection]
    if (resultKey) clearResult(resultKey)
    setAssessmentResetKey((key) => key + 1)
  }

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
      airQuality: airScore,
      waterQuality: waterScore,
      diet: dietScore,
      exercise: exerciseScore,
      body: bodyScore,
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

  // Tobacco, alcohol and drug answers, once the Lifestyle module is completed
  const substanceUse = useMemo<SubstanceUse | undefined>(() => {
    if (!completedLifestyle) return undefined
    const answers = storedInputs.lifestyle
    return {
      sex: completedBody?.sex,
      smokingStatus: completedLifestyle.smokingStatus,
      alcoholGramsPerWeek: weeklyAlcoholGrams(completedLifestyle),
      otherDrugUse: answers?.otherDrugUse,
      injectedDrugs: answers && reportsDrugUse(answers) ? answers.injectedDrugs : undefined,
    }
  }, [completedLifestyle, completedBody, storedInputs.lifestyle])

  const overallResult = useMemo(
    () => calculateOverallHealth(scores, substanceUse && substanceYearsLost(substanceUse)),
    [scores, substanceUse],
  )

  // Calculate life expectancy based on all available data
  const lifeExpectancyData = useMemo(() => {
    // Only calculate if we have at least one completed assessment
    const hasData = Object.values(scores).some(s => s.completed)
    if (!hasData) return undefined

    const inputs: LifeExpectancyInputs = {
      age: completedBody?.age,
      sex: completedBody?.sex,
      bmiCategory: completedBody?.bmiCategory,
      compositeBmi: completedBody?.compositeBmi,
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
      smokingStatus: substanceUse?.smokingStatus,
      alcoholGramsPerWeek: substanceUse?.alcoholGramsPerWeek,
      otherDrugUse: substanceUse?.otherDrugUse,
      injectedDrugs: substanceUse?.injectedDrugs,
      sleepHours: completedLifestyle?.sleepHours,
      socialConnection: completedLifestyle?.socialConnection,
      processedMeatFrequency: completedDiet?.processedMeatFrequency,
      pm25Level: completedAir?.pm25Level,
      country: completedAir?.country,
    }

    const result = calculateLifeExpectancy(inputs)
    
    return {
      adjustedYears: result.adjustedYears,
      totalAdjustment: result.totalAdjustment,
      referenceAdjustment: result.referenceAdjustment,
      percentile: result.percentile,
      potentialGain: result.potentialGain,
      confidence: result.confidence,
      topFactors: result.adjustments.slice(0, 4).map(a => ({
        factor: a.factor,
        years: a.years,
        direction: a.direction as "positive" | "negative",
      })),
    }
  }, [scores, bodyScore, airScore, waterScore, dietScore, exerciseScore, workScore, lifestyleScore, mentalHealthScore, lifeContextScore, personalityScore, homeEnvironmentScore, substanceUse, completedBody, completedLifestyle, completedDiet, completedAir])

  // Biological age requires a known chronological age (from the Body module)
  const biologicalAgeData = useMemo(() => {
    if (!completedBody || !lifeExpectancyData) return undefined
    const completedCount = Object.values(scores).filter(s => s.completed).length
    return calculateBiologicalAge({
      chronologicalAge: completedBody.age,
      totalAdjustment: lifeExpectancyData.referenceAdjustment,
      dataPoints: completedCount,
    })
  }, [completedBody, lifeExpectancyData, scores])

  // Type 2 diabetes risk screen (FINDRISC-adapted), computed entirely from answers already
  // given in the Body, Exercise, Diet, and Family History modules
  const diabetesRiskData = useMemo(() => {
    const dietAnswers = dietScore.completed ? storedInputs.diet : undefined
    return (
      calculateDiabetesRisk({
        age: completedBody?.age,
        sex: completedBody?.sex,
        bmi: completedBody?.bmi,
        waistCm: completedBody?.waistCm,
        activeMinutesPerWeek: exerciseScore.completed
          ? storedResults.exercise?.breakdown?.totalMinutesPerWeek
          : undefined,
        fruitServings: dietAnswers?.fruits,
        vegetableServings: dietAnswers?.vegetables,
        familyDiabetes: familyHistoryScore.completed ? storedInputs.family?.diabetes : undefined,
      }) ?? undefined
    )
  }, [
    completedBody, exerciseScore, dietScore, familyHistoryScore,
    storedResults.exercise, storedInputs.diet, storedInputs.family,
  ])

  // Cardiovascular health on the Life's Essential 8 metrics the modules already cover
  const cardiovascularHealthData = useMemo(
    () =>
      calculateCardiovascularHealth({
        smokingStatus: completedLifestyle?.smokingStatus,
        smokeIndoors: homeEnvironmentScore.completed ? storedInputs.home?.smokeIndoors : undefined,
        sleepHours: completedLifestyle?.sleepHours,
        metMinutesPerWeek: exerciseScore.completed ? storedResults.exercise?.totalMETMinutes : undefined,
        bmiCategory: completedBody?.bmiCategory,
        compositeBmi: completedBody?.compositeBmi,
        dietScore: dietScore.completed ? dietScore.score : undefined,
      }) ?? undefined,
    [
      completedLifestyle, completedBody, homeEnvironmentScore, exerciseScore, dietScore,
      storedInputs.home, storedResults.exercise,
    ],
  )

  // Dementia risk profile, also built only from answers already collected. A module's answers
  // count once it's completed, so drafts and retakes don't leak into the profile.
  const neuroRiskData = useMemo(
    () =>
      calculateNeuroRisk({
        bmiCategory: completedBody?.bmiCategory,
        pm25: completedAir?.pm25Level,
        socialConnection: completedLifestyle?.socialConnection,
        lifestyle: lifestyleScore.completed ? storedInputs.lifestyle : undefined,
        mental: mentalHealthScore.completed ? storedInputs.mental : undefined,
        exercise: exerciseScore.completed ? storedInputs.exercise : undefined,
        diet: dietScore.completed ? storedInputs.diet : undefined,
        senses: sensesOralScore.completed ? storedInputs.senses : undefined,
        lifeContext: lifeContextScore.completed ? storedInputs.lifecontext : undefined,
        work: workScore.completed ? storedInputs.work : undefined,
        family: familyHistoryScore.completed ? storedInputs.family : undefined,
        preventive: preventiveCareScore.completed ? storedInputs.preventive : undefined,
        age: completedBody?.age,
      }) ?? undefined,
    [
      completedBody, completedAir, completedLifestyle, lifestyleScore,
      mentalHealthScore, exerciseScore, dietScore, sensesOralScore, lifeContextScore,
      workScore, familyHistoryScore, preventiveCareScore, storedInputs,
    ],
  )

  // Cancer risk profile, same rule: only completed modules' answers count
  const cancerRiskData = useMemo(
    () =>
      calculateCancerRisk({
        sex: completedBody?.sex,
        bmiCategory: completedBody?.bmiCategory,
        waistCm: completedBody?.waistCm,
        pm25: completedAir?.pm25Level,
        lifestyle: lifestyleScore.completed ? storedInputs.lifestyle : undefined,
        exercise: exerciseScore.completed ? storedInputs.exercise : undefined,
        diet: dietScore.completed ? storedInputs.diet : undefined,
        home: homeEnvironmentScore.completed ? storedInputs.home : undefined,
        family: familyHistoryScore.completed ? storedInputs.family : undefined,
        preventive: preventiveCareScore.completed ? storedInputs.preventive : undefined,
        age: completedBody?.age,
      }) ?? undefined,
    [
      completedBody, completedAir, lifestyleScore, exerciseScore, dietScore,
      homeEnvironmentScore, familyHistoryScore, preventiveCareScore, storedInputs,
    ],
  )

  function handleBodyResult(score: number, demographics?: BodyDemographics) {
    setBodyScore({ score, completed: true, label: "Body Composition" })
    if (demographics) {
      setBodyDemographics(demographics)
    }
  }

  const localUv = completedAir ? getLocalUv(completedAir.country, completedAir.city) : undefined

  function handleAirResult(score: number, countryData?: AirExtras) {
    setAirScore({ score, completed: true, label: "Air Quality" })
    if (countryData) {
      setAirData(countryData)
    }
  }

  function handleWaterResult(score: number) {
    setWaterScore({ score, completed: true, label: "Water Quality" })
  }

  function handleDietResult(score: number, meatData?: DietExtras) {
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

  function handleLifestyleResult(score: number, lifestyleExtras?: LifestyleExtras) {
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

  function renderSection() {
    switch (activeSection) {
      case "welcome":
        return (
          <HomeSection
            completedCount={Object.values(scores).filter((s) => s.completed).length}
            totalCount={Object.values(scores).length}
            onNavigate={setActiveSection}
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
        return <LifestyleSection uvLevel={localUv} onResult={handleLifestyleResult} storedResult={storedResults.lifestyle} onStoreResult={(r) => storeResult("lifestyle", r)} onRetake={() => clearResult("lifestyle")} storedInputs={storedInputs.lifestyle} onStoreInputs={(i) => storeInputs("lifestyle", i)} />
      case "mental":
        return <MentalHealthSection onResult={handleMentalHealthResult} storedResult={storedResults.mental} onStoreResult={(r) => storeResult("mental", r)} onRetake={() => clearResult("mental")} storedInputs={storedInputs.mental} onStoreInputs={(i) => storeInputs("mental", i)} />
      case "family":
        return <FamilyHistorySection onResult={handleFamilyHistoryResult} storedResult={storedResults.family} onStoreResult={(r) => storeResult("family", r)} onRetake={() => clearResult("family")} storedInputs={storedInputs.family} onStoreInputs={(i) => storeInputs("family", i)} />
      case "preventive":
        return <PreventiveCareSection onResult={handlePreventiveCareResult} age={bodyDemographics?.age} storedResult={storedResults.preventive} onStoreResult={(r) => storeResult("preventive", r)} onRetake={() => clearResult("preventive")} storedInputs={storedInputs.preventive} onStoreInputs={(i) => storeInputs("preventive", i)} />
      case "senses":
        return <SensesOralSection onResult={handleSensesOralResult} storedResult={storedResults.senses} onStoreResult={(r) => storeResult("senses", r)} onRetake={() => clearResult("senses")} storedInputs={storedInputs.senses} onStoreInputs={(i) => storeInputs("senses", i)} />
      case "lifecontext":
        return <LifeContextSection onResult={handleLifeContextResult} storedResult={storedResults.lifecontext} onStoreResult={(r) => storeResult("lifecontext", r)} onRetake={() => clearResult("lifecontext")} storedInputs={storedInputs.lifecontext} onStoreInputs={(i) => storeInputs("lifecontext", i)} />
      case "personality":
        return <PersonalitySection onResult={handlePersonalityResult} storedResult={storedResults.personality} onStoreResult={(r) => storeResult("personality", r)} onRetake={() => clearResult("personality")} storedInputs={storedInputs.personality} onStoreInputs={(i) => storeInputs("personality", i)} />
      case "home":
        return <HomeEnvironmentSection onResult={handleHomeEnvironmentResult} storedResult={storedResults.home} onStoreResult={(r) => storeResult("home", r)} onRetake={() => clearResult("home")} storedInputs={storedInputs.home} onStoreInputs={(i) => storeInputs("home", i)} />
      case "methodology":
        return <MethodologySection />
      // "dashboard", and any section name that no longer exists
      default:
        return (
          <HealthDashboard
            result={overallResult}
            onNavigate={setActiveSection}
            lifeExpectancyData={lifeExpectancyData}
            biologicalAgeData={biologicalAgeData}
            cardiovascularHealthData={cardiovascularHealthData}
            diabetesRiskData={diabetesRiskData}
            neuroRiskData={neuroRiskData}
            cancerRiskData={cancerRiskData}
          />
        )
    }
  }

  const sectionTitles: Record<string, string> = {
    welcome: "Home",
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
    methodology: "Methodology",
  }

  return (
    <SidebarProvider>
      <AppSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        scores={scores}
      />
      <SidebarInset>
        <PageHeader title={sectionTitles[activeSection] ?? "Dashboard"} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-4xl">
            <div key={`${activeSection}-${assessmentResetKey}`}>
              {renderSection()}
            </div>
            <AssessmentNextSteps
              activeSection={activeSection}
              scores={scores}
              onNavigate={setActiveSection}
              onRetake={handleRetakeAssessment}
            />
            <SiteFooter />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
