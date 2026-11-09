#!/usr/bin/env node
/**
 * Builds lib/data/uv-levels.ts: the yearly average daily UV dose for every city in the location
 * picker (lib/air-quality-data.ts), plus Boston as the reference.
 *
 * UV: NASA POWER climatology API (power.larc.nasa.gov), parameter ALLSKY_SFC_UV_INDEX, the all-sky
 * surface UV index from CERES SYN1deg averaged over all 24 hours, 2001-2025 climatology. The UV
 * index is erythemally weighted irradiance x 40 (W/m²), so the daily erythemal dose in J/m² is
 * value / 40 x 86,400 s = value x 2,160.
 * Coordinates: Open-Meteo geocoding (GeoNames data), the most populous match inside the city's
 * country; ISO3 -> ISO2 from GeoNames countryInfo.txt.
 * Boston is the reference because the app's 10-30 minute sun advice comes from vitamin D research
 * there (Webb, Kline & Holick, J Clin Endocrinol Metab 1988).
 *
 * Cross-check only: country means are compared with WHO GHO indicator UV_1 (population-weighted
 * daily ambient UV, 2004). POWER is newer and city-level, so the WHO values aren't stored.
 *
 * Run: pnpm build:uv-data
 */
import { writeFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { ISO3, assertIso3, pickerCities, pickerCountries } from "./lib/countries.mjs"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const J_PER_M2_PER_UV_INDEX_DAY = 86400 / 40
const REFERENCE = { city: "Boston", country: "United States", lat: 42.3601, lon: -71.0589 }

// Picker names the geocoder doesn't resolve inside the right country: [latitude, longitude]
const COORDINATE_OVERRIDES = {}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchJson(url, attempts = 4) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url)
      if (res.ok) return await res.json()
      if (attempt >= attempts || (res.status < 500 && res.status !== 429)) throw new Error(`${res.status} ${url}`)
    } catch (error) {
      if (attempt >= attempts) throw error
    }
    await sleep(1000 * attempt)
  }
}

async function pool(items, concurrency, delayMs, task) {
  const results = new Array(items.length)
  let next = 0
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (next < items.length) {
        const index = next++
        results[index] = await task(items[index], index)
        await sleep(delayMs)
      }
    }),
  )
  return results
}

async function iso3ToIso2() {
  const res = await fetch("https://download.geonames.org/export/dump/countryInfo.txt")
  if (!res.ok) throw new Error(`${res.status} fetching GeoNames countryInfo.txt`)
  const map = new Map()
  for (const line of (await res.text()).split("\n")) {
    if (!line || line.startsWith("#")) continue
    const [iso2, iso3] = line.split("\t")
    map.set(iso3, iso2)
  }
  return map
}

async function geocode({ city, country }, iso2) {
  const override = COORDINATE_OVERRIDES[`${city}|${country}`]
  if (override) return { lat: override[0], lon: override[1], matched: "override" }
  const base = `https://geocoding-api.open-meteo.com/v1/search?count=10&language=en&format=json&name=${encodeURIComponent(city)}`
  for (const url of [`${base}&countryCode=${iso2}`, base]) {
    const data = await fetchJson(url)
    const inCountry = (data.results ?? []).filter((r) => r.country_code === iso2)
    if (inCountry.length) {
      const best = inCountry.reduce((a, b) => ((b.population ?? 0) > (a.population ?? 0) ? b : a))
      return { lat: best.latitude, lon: best.longitude, matched: `${best.name}, ${best.admin1 ?? ""}` }
    }
  }
  return null
}

async function uvDose({ lat, lon }) {
  const url =
    "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=ALLSKY_SFC_UV_INDEX" +
    `&community=RE&longitude=${lon.toFixed(4)}&latitude=${lat.toFixed(4)}&format=JSON`
  const data = await fetchJson(url)
  const annual = data?.properties?.parameter?.ALLSKY_SFC_UV_INDEX?.ANN
  if (!Number.isFinite(annual) || annual < 0) throw new Error(`No UV climatology at ${lat},${lon}`)
  return Math.round(annual * J_PER_M2_PER_UV_INDEX_DAY)
}

function pearson(xs, ys) {
  const n = xs.length
  const mx = xs.reduce((a, b) => a + b, 0) / n
  const my = ys.reduce((a, b) => a + b, 0) / n
  let sxy = 0, sxx = 0, syy = 0
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my)
    sxx += (xs[i] - mx) ** 2
    syy += (ys[i] - my) ** 2
  }
  return sxy / Math.sqrt(sxx * syy)
}

const cities = pickerCities(ROOT)
const countries = pickerCountries(ROOT)
assertIso3(countries)
const iso2Of = await iso3ToIso2()
const missingIso2 = countries.filter((c) => !iso2Of.get(ISO3[c]))
if (missingIso2.length) throw new Error(`No ISO2 code in GeoNames for: ${missingIso2.join(", ")}`)

console.log(`Geocoding ${cities.length} cities...`)
const coordinates = await pool(cities, 2, 150, (c) => geocode(c, iso2Of.get(ISO3[c.country])))
const unresolved = cities.filter((_, i) => !coordinates[i])
if (unresolved.length) {
  throw new Error(`Add COORDINATE_OVERRIDES for: ${unresolved.map((c) => `${c.city}|${c.country}`).join(", ")}`)
}

console.log("Fetching NASA POWER UV climatology...")
const doses = await pool(cities, 4, 50, (_, i) => uvDose(coordinates[i]))
const referenceDose = await uvDose(REFERENCE)

const byCountry = {}
cities.forEach(({ city, country }, i) => {
  byCountry[country] ??= {}
  byCountry[country][city] = doses[i]
})

const lines = countries.map((country) => {
  const entries = Object.entries(byCountry[country]).map(([city, dose]) => `${JSON.stringify(city)}: ${dose}`)
  return `  ${JSON.stringify(country)}: { ${entries.join(", ")} },`
})

const target = join(ROOT, "lib/data/uv-levels.ts")
mkdirSync(dirname(target), { recursive: true })
writeFileSync(
  target,
  `// Generated by scripts/build-uv-data.mjs. Do not edit by hand; re-run the script to refresh.
// Source: NASA POWER climatology (power.larc.nasa.gov), ALLSKY_SFC_UV_INDEX, CERES SYN1deg,
// January 2001 - December 2025. Values are the yearly average daily erythemal (sunburn-weighted)
// UV dose in J/m²; 100 J/m² is one standard erythema dose (SED).

export const UV_SOURCE = "NASA POWER climatology 2001-2025 (CERES SYN1deg), all-sky surface UV index"

/** Boston, where the 10-30 minute sun advice was researched (Webb, Kline & Holick 1988) */
export const UV_REFERENCE = { city: "${REFERENCE.city}", country: "${REFERENCE.country}", dose: ${referenceDose} } as const

export const CITY_UV_DOSE: Record<string, Record<string, number>> = {
${lines.join("\n")}
}
`,
)
console.log(`wrote lib/data/uv-levels.ts (${cities.length} cities, ${countries.length} countries)`)

const sorted = cities.map((c, i) => ({ ...c, dose: doses[i] })).sort((a, b) => a.dose - b.dose)
const show = (c) => `${c.city} (${c.country}) ${c.dose} = ${(c.dose / referenceDose).toFixed(2)}x`
console.log(`\nReference ${REFERENCE.city}: ${referenceDose} J/m² per day`)
console.log(`Lowest: ${sorted.slice(0, 3).map(show).join("; ")}`)
console.log(`Highest: ${sorted.slice(-3).map(show).join("; ")}`)
for (const name of ["Rome", "London", "Oslo", "Sydney", "Mumbai", "Lagos", "La Paz"]) {
  const hit = sorted.find((c) => c.city === name)
  if (hit) console.log(`  ${show(hit)}`)
}

try {
  const who = await fetchJson("https://ghoapi.azureedge.net/api/UV_1")
  const whoByIso3 = new Map(who.value.filter((r) => r.SpatialDimType === "COUNTRY").map((r) => [r.SpatialDim, r.NumericValue]))
  const pairs = countries
    .map((country) => {
      const values = Object.values(byCountry[country])
      return [values.reduce((a, b) => a + b, 0) / values.length, whoByIso3.get(ISO3[country])]
    })
    .filter(([, whoValue]) => Number.isFinite(whoValue))
  const ratio = pairs.reduce((sum, [power, whoValue]) => sum + power / whoValue, 0) / pairs.length
  console.log(
    `\nCross-check vs WHO GHO UV_1 (2004): ${pairs.length} countries, r = ${pearson(pairs.map((p) => p[0]), pairs.map((p) => p[1])).toFixed(3)}, mean POWER/WHO ratio ${ratio.toFixed(2)}`,
  )
} catch (error) {
  console.log(`\nWHO cross-check skipped: ${error.message}`)
}
