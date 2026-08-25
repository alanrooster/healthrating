"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BodyMeasurements, Sex, Ethnicity } from "@/lib/bmi-calculator"

export interface BMIFormInputs {
  sex: Sex
  ethnicity: Ethnicity
  age: string
  weight: string
  height: string
  waist: string
  neck: string
  wrist: string
}

interface BMIFormProps {
  onCalculate: (measurements: BodyMeasurements) => void
  initialInputs?: BMIFormInputs | null
  onInputsChange?: (inputs: BMIFormInputs) => void
}

const ETHNICITY_OPTIONS: { value: Ethnicity; label: string }[] = [
  { value: "caucasian", label: "Caucasian / European" },
  { value: "african", label: "African / Afro-Caribbean" },
  { value: "south-asian", label: "South Asian" },
  { value: "east-asian", label: "East Asian" },
  { value: "southeast-asian", label: "Southeast Asian" },
  { value: "hispanic", label: "Hispanic / Latino" },
  { value: "middle-eastern", label: "Middle Eastern" },
  { value: "pacific-islander", label: "Pacific Islander" },
]

export function BMIForm({ onCalculate, initialInputs, onInputsChange }: BMIFormProps) {
  const [sex, setSex] = useState<Sex>(initialInputs?.sex ?? "male")
  const [ethnicity, setEthnicity] = useState<Ethnicity>(initialInputs?.ethnicity ?? "caucasian")
  const [age, setAge] = useState(initialInputs?.age ?? "")
  const [weight, setWeight] = useState(initialInputs?.weight ?? "")
  const [height, setHeight] = useState(initialInputs?.height ?? "")
  const [waist, setWaist] = useState(initialInputs?.waist ?? "")
  const [neck, setNeck] = useState(initialInputs?.neck ?? "")
  const [wrist, setWrist] = useState(initialInputs?.wrist ?? "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    onInputsChange?.({ sex, ethnicity, age, weight, height, waist, neck, wrist })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sex, ethnicity, age, weight, height, waist, neck, wrist])

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    const ageNum = Number(age)
    const weightNum = Number(weight)
    const heightNum = Number(height)
    const waistNum = Number(waist)
    const neckNum = Number(neck)
    const wristNum = Number(wrist)

    if (!age || ageNum < 2 || ageNum > 120) {
      newErrors.age = "Enter a valid age (2-120)"
    }
    if (!weight || weightNum < 10 || weightNum > 500) {
      newErrors.weight = "Enter a valid weight (10-500 kg)"
    }
    if (!height || heightNum < 50 || heightNum > 280) {
      newErrors.height = "Enter a valid height (50-280 cm)"
    }
    // Body measurements are optional — only validate the range if a value is entered.
    if (waist && (waistNum < 30 || waistNum > 200)) {
      newErrors.waist = "Enter a valid waist (30-200 cm)"
    }
    if (neck && (neckNum < 20 || neckNum > 80)) {
      newErrors.neck = "Enter a valid neck (20-80 cm)"
    }
    if (wrist && (wristNum < 10 || wristNum > 30)) {
      newErrors.wrist = "Enter a valid wrist (10-30 cm)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    onCalculate({
      age: Number(age),
      sex,
      ethnicity,
      weightKg: Number(weight),
      heightCm: Number(height),
      waistCm: waist ? Number(waist) : undefined,
      neckCm: neck ? Number(neck) : undefined,
      wristCm: wrist ? Number(wrist) : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Basic Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Sex Selection */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Biological Sex <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSex("male")}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                  sex === "male"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <circle cx="10" cy="14" r="5" />
                  <path d="M19 5l-5.4 5.4" />
                  <path d="M15 5h4v4" />
                </svg>
                Male
              </button>
              <button
                type="button"
                onClick={() => setSex("female")}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                  sex === "female"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="9" r="5" />
                  <path d="M12 14v7" />
                  <path d="M9 18h6" />
                </svg>
                Female
              </button>
            </div>
          </div>

          {/* Ethnicity Selection */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="ethnicity"
              className="text-sm font-medium text-muted-foreground"
            >
              Ethnicity <span className="text-destructive">*</span>
            </Label>
            <p className="text-xs text-muted-foreground">
              Different ethnic groups have different body fat distributions and
              metabolic risk profiles at the same BMI (WHO guidelines).
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ETHNICITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setEthnicity(opt.value)}
                  className={`rounded-lg border-2 px-3 py-2.5 text-xs font-medium transition-all ${
                    ethnicity === opt.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Age, Weight, Height */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="age"
                className="text-sm font-medium text-muted-foreground"
              >
                Age <span className="text-destructive">*</span>
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="years"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={errors.age ? "border-destructive" : ""}
              />
              {errors.age && (
                <span className="text-xs text-destructive">{errors.age}</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="weight"
                className="text-sm font-medium text-muted-foreground"
              >
                Weight (kg) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className={errors.weight ? "border-destructive" : ""}
              />
              {errors.weight && (
                <span className="text-xs text-destructive">{errors.weight}</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="height"
                className="text-sm font-medium text-muted-foreground"
              >
                Height (cm) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                placeholder="cm"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className={errors.height ? "border-destructive" : ""}
              />
              {errors.height && (
                <span className="text-xs text-destructive">{errors.height}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Body Measurements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex flex-wrap items-center gap-2 text-lg font-semibold text-foreground">
            Body Measurements
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              Optional
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            These fields are optional — you can calculate your score without them.
            However, for a more precise result we recommend filling them in: waist
            and neck unlock body-fat % estimation (U.S. Navy + Deurenberg methods)
            and your waist-to-height ratio, while wrist helps determine your body
            frame size.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="waist"
                className="text-sm font-medium text-muted-foreground"
              >
                Waist (cm){" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (recommended)
                </span>
              </Label>
              <Input
                id="waist"
                type="number"
                step="0.1"
                placeholder="at navel"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                className={errors.waist ? "border-destructive" : ""}
              />
              {errors.waist && (
                <span className="text-xs text-destructive">{errors.waist}</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="neck"
                className="text-sm font-medium text-muted-foreground"
              >
                Neck (cm){" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (recommended)
                </span>
              </Label>
              <Input
                id="neck"
                type="number"
                step="0.1"
                placeholder="below larynx"
                value={neck}
                onChange={(e) => setNeck(e.target.value)}
                className={errors.neck ? "border-destructive" : ""}
              />
              {errors.neck && (
                <span className="text-xs text-destructive">{errors.neck}</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="wrist"
                className="text-sm font-medium text-muted-foreground"
              >
                Wrist (cm){" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (recommended)
                </span>
              </Label>
              <Input
                id="wrist"
                type="number"
                step="0.1"
                placeholder="at bone"
                value={wrist}
                onChange={(e) => setWrist(e.target.value)}
                className={errors.wrist ? "border-destructive" : ""}
              />
              {errors.wrist && (
                <span className="text-xs text-destructive">{errors.wrist}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full text-base font-semibold">
        Calculate Body Composition
      </Button>
    </form>
  )
}
