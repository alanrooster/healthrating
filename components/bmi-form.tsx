"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BodyMeasurements, Sex } from "@/lib/bmi-calculator"

interface BMIFormProps {
  onCalculate: (measurements: BodyMeasurements) => void
}

export function BMIForm({ onCalculate }: BMIFormProps) {
  const [sex, setSex] = useState<Sex>("male")
  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [waist, setWaist] = useState("")
  const [hip, setHip] = useState("")
  const [neck, setNeck] = useState("")
  const [wrist, setWrist] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    const ageNum = Number(age)
    const weightNum = Number(weight)
    const heightNum = Number(height)

    if (!age || ageNum < 2 || ageNum > 120) {
      newErrors.age = "Enter a valid age (2-120)"
    }
    if (!weight || weightNum < 10 || weightNum > 500) {
      newErrors.weight = "Enter a valid weight (10-500 kg)"
    }
    if (!height || heightNum < 50 || heightNum > 280) {
      newErrors.height = "Enter a valid height (50-280 cm)"
    }
    if (waist && (Number(waist) < 30 || Number(waist) > 200)) {
      newErrors.waist = "Enter a valid waist (30-200 cm)"
    }
    if (hip && (Number(hip) < 40 || Number(hip) > 200)) {
      newErrors.hip = "Enter a valid hip (40-200 cm)"
    }
    if (neck && (Number(neck) < 20 || Number(neck) > 80)) {
      newErrors.neck = "Enter a valid neck (20-80 cm)"
    }
    if (wrist && (Number(wrist) < 10 || Number(wrist) > 30)) {
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
      weightKg: Number(weight),
      heightCm: Number(height),
      waistCm: waist ? Number(waist) : undefined,
      hipCm: hip ? Number(hip) : undefined,
      neckCm: neck ? Number(neck) : undefined,
      wristCm: wrist ? Number(wrist) : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Sex Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Biological Sex
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="age" className="text-sm font-medium text-muted-foreground">
                Age
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
                Weight (kg)
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
                Height (cm)
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
          <CardTitle className="text-lg font-semibold text-foreground">
            Body Measurements
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              (optional, improves accuracy)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Adding waist and neck measurements enables body fat estimation using the
            U.S. Navy method. Hip measurement is required for women.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="waist"
                className="text-sm font-medium text-muted-foreground"
              >
                Waist (cm)
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
                htmlFor="hip"
                className="text-sm font-medium text-muted-foreground"
              >
                Hip (cm)
              </Label>
              <Input
                id="hip"
                type="number"
                step="0.1"
                placeholder="widest point"
                value={hip}
                onChange={(e) => setHip(e.target.value)}
                className={errors.hip ? "border-destructive" : ""}
              />
              {errors.hip && (
                <span className="text-xs text-destructive">{errors.hip}</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="neck"
                className="text-sm font-medium text-muted-foreground"
              >
                Neck (cm)
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
                Wrist (cm)
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

      <Button
        type="submit"
        size="lg"
        className="w-full text-base font-semibold"
      >
        Calculate Body Composition
      </Button>
    </form>
  )
}
