"use client"

import { useState, useMemo } from "react"
import { Cloud, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  getContinents,
  getCountries,
  getCities,
  scoreAirQuality,
  type CityAQData,
  type AirQualityResult,
} from "@/lib/air-quality-data"
import { getScoreColor } from "@/lib/health-score"

interface AirQualitySectionProps {
  onResult: (score: number, countryData?: { country: string }) => void
  storedResult?: AirQualityResult | null
  onStoreResult?: (result: AirQualityResult) => void
  onRetake?: () => void
}

export function AirQualitySection({ onResult, storedResult, onStoreResult, onRetake }: AirQualitySectionProps) {
  const [continent, setContinent] = useState("")
  const [country, setCountry] = useState("")
  const [cityName, setCityName] = useState("")
  const [result, setResult] = useState<AirQualityResult | null>(storedResult ?? null)

  const continents = useMemo(() => getContinents(), [])
  const countries = useMemo(() => (continent ? getCountries(continent) : []), [continent])
  const cities = useMemo(() => (country ? getCities(country) : []), [country])

  function handleContinentChange(val: string) {
    setContinent(val)
    setCountry("")
    setCityName("")
    setResult(null)
  }

  function handleCountryChange(val: string) {
    setCountry(val)
    setCityName("")
    setResult(null)
  }

  function handleCalculate() {
    const selectedCity = cities.find((c) => c.city === cityName)
    if (!selectedCity) return
    const aqResult = scoreAirQuality(selectedCity)
    setResult(aqResult)
    onStoreResult?.(aqResult)
    onResult(aqResult.score, { country })
  }

  function handleRetake() {
    setResult(null)
    setContinent("")
    setCountry("")
    setCityName("")
    onRetake?.()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Air Quality Assessment
        </h1>
        <p className="text-sm text-muted-foreground">
          Based on WHO annual PM2.5 guidelines (2021). Select your location to see the health impact.
        </p>
      </div>

      {/* Location Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-foreground">
            <Cloud className="h-5 w-5 text-primary" />
            Select Your Location
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Continent</Label>
              <Select value={continent} onValueChange={handleContinentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select continent" />
                </SelectTrigger>
                <SelectContent>
                  {continents.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Country</Label>
              <Select
                value={country}
                onValueChange={handleCountryChange}
                disabled={!continent}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-foreground">City</Label>
              <Select
                value={cityName}
                onValueChange={setCityName}
                disabled={!country}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c.city} value={c.city}>
                      {c.city} ({c.pm25} ug/m3)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleCalculate}
            disabled={!cityName}
            className="self-start"
          >
            Assess Air Quality
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && <AirQualityResults result={result} onRetake={handleRetake} />}
    </div>
  )
}

function AirQualityResults({ result, onRetake }: { result: AirQualityResult; onRetake?: () => void }) {
  const { city, score, category, healthImpact, whoGuideline, ratio } = result
  const isGood = score >= 70

  return (
    <div className="flex flex-col gap-4">
      {/* Score Banner */}
      <Card className="overflow-hidden">
        <div
          className="p-6"
          style={{
            backgroundColor: getScoreColor(score),
            color: "#fff",
          }}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-3">
              <span className="text-5xl font-bold">{score}</span>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium opacity-80">/ 100</span>
                <span className="text-lg font-semibold">{category}</span>
              </div>
            </div>
            <p className="text-sm font-medium opacity-90">
              {city.city}, {city.country}
            </p>
          </div>
        </div>

        <CardContent className="flex flex-col gap-4 pt-6">
          {/* PM2.5 Display */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Annual PM2.5</span>
              <span className="text-lg font-bold text-foreground">
                {city.pm25} ug/m3
              </span>
            </div>

            {/* WHO comparison bar */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>WHO Guideline: {whoGuideline} ug/m3</span>
                <span>{ratio}x the guideline</span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (whoGuideline / Math.max(city.pm25, whoGuideline)) * 100)}%`,
                    backgroundColor: "hsl(var(--success))",
                  }}
                />
                <div
                  className="absolute left-0 top-0 h-full rounded-full opacity-50 transition-all"
                  style={{
                    width: `${Math.min(100, (city.pm25 / (city.pm25 * 1.2)) * 100)}%`,
                    backgroundColor: getScoreColor(score),
                  }}
                />
              </div>
            </div>
          </div>

          {/* Health Impact */}
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-start gap-3">
              {isGood ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--success))]" />
              ) : (
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--accent))]" />
              )}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-foreground">
                  Health Impact
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {healthImpact}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {onRetake && (
        <Button variant="outline" onClick={onRetake} className="self-start">
          Retake Assessment
        </Button>
      )}

      <p className="text-xs text-muted-foreground leading-relaxed">
        Data based on WHO Global Air Quality Database and IQAir World Air
        Quality Report. PM2.5 values are annual averages. WHO guideline
        for annual PM2.5 is 5 ug/m3.
      </p>
    </div>
  )
}
