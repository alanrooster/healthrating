#!/usr/bin/env node
/**
 * Builds the country-level reference data used by the calculators.
 *
 *   lib/data/life-tables.ts      UN World Population Prospects 2024 (medium variant),
 *                                abridged period life tables for LIFE_TABLE_YEAR:
 *                                remaining life expectancy e(x) by sex at LIFE_TABLE_AGES.
 *   lib/data/grid-intensity.ts   Ember electricity carbon intensity (lifecycle gCO2e/kWh)
 *                                via the Our World in Data energy dataset, latest year
 *                                available for each country.
 *
 * Countries are the ones offered in lib/air-quality-data.ts (the app's location picker).
 * The script fails loudly if a picker country has no ISO3 mapping, so new cities/countries
 * can't silently fall back to world averages.
 *
 * Run: node scripts/build-country-data.mjs
 */
import { createGunzip } from "node:zlib"
import { Readable } from "node:stream"
import { createInterface } from "node:readline"
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const LIFE_TABLE_YEAR = 2026
const LIFE_TABLE_AGES = [0, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]

const WPP_URL =
  "https://population.un.org/wpp/assets/Excel%20Files/1_Indicator%20(Standard)/CSV_FILES/WPP2024_Life_Table_Abridged_Medium_2024-2100.csv.gz"
const OWID_ENERGY_URL = "https://owid-public.owid.io/data/energy/owid-energy-data.csv"
const OWID_CO2_URL = "https://owid-public.owid.io/data/co2/owid-co2-data.csv"

// App country label (lib/air-quality-data.ts) -> ISO 3166-1 alpha-3 (WPP uses XKX for Kosovo)
const ISO3 = {
  Albania: "ALB", Algeria: "DZA", Angola: "AGO", Argentina: "ARG", Australia: "AUS",
  Austria: "AUT", Bahrain: "BHR", Bangladesh: "BGD", Belgium: "BEL", Benin: "BEN",
  Bolivia: "BOL", Bosnia: "BIH", Botswana: "BWA", Brazil: "BRA", Bulgaria: "BGR",
  "Burkina Faso": "BFA", Burundi: "BDI", CAR: "CAF", Cambodia: "KHM", Cameroon: "CMR",
  Canada: "CAN", Chad: "TCD", Chile: "CHL", China: "CHN", Colombia: "COL", Congo: "COG",
  "Costa Rica": "CRI", Croatia: "HRV", Cuba: "CUB", "Czech Republic": "CZE", "DR Congo": "COD",
  Denmark: "DNK", "Dominican Republic": "DOM", Ecuador: "ECU", Egypt: "EGY", "El Salvador": "SLV",
  Estonia: "EST", Ethiopia: "ETH", Fiji: "FJI", Finland: "FIN", France: "FRA",
  "French Polynesia": "PYF", Gabon: "GAB", Germany: "DEU", Ghana: "GHA", Greece: "GRC",
  Guam: "GUM", Guatemala: "GTM", Guinea: "GIN", Guyana: "GUY", Haiti: "HTI", Honduras: "HND",
  Hungary: "HUN", Iceland: "ISL", India: "IND", Indonesia: "IDN", Iran: "IRN", Iraq: "IRQ",
  Ireland: "IRL", Israel: "ISR", Italy: "ITA", "Ivory Coast": "CIV", Jamaica: "JAM", Japan: "JPN",
  Jordan: "JOR", Kazakhstan: "KAZ", Kenya: "KEN", Kiribati: "KIR", Kosovo: "XKX", Kuwait: "KWT",
  Kyrgyzstan: "KGZ", Laos: "LAO", Latvia: "LVA", Lebanon: "LBN", Liberia: "LBR", Libya: "LBY",
  Lithuania: "LTU", Luxembourg: "LUX", Madagascar: "MDG", Malaysia: "MYS", Maldives: "MDV",
  Mali: "MLI", "Marshall Islands": "MHL", Mauritius: "MUS", Mexico: "MEX", Mongolia: "MNG",
  Montenegro: "MNE", Morocco: "MAR", Mozambique: "MOZ", Myanmar: "MMR", Namibia: "NAM",
  Nepal: "NPL", Netherlands: "NLD", "New Caledonia": "NCL", "New Zealand": "NZL",
  Nicaragua: "NIC", Niger: "NER", Nigeria: "NGA", "North Macedonia": "MKD", Norway: "NOR",
  Oman: "OMN", Pakistan: "PAK", Palau: "PLW", Panama: "PAN", "Papua New Guinea": "PNG",
  Paraguay: "PRY", Peru: "PER", Philippines: "PHL", Poland: "POL", Portugal: "PRT", Qatar: "QAT",
  Romania: "ROU", Russia: "RUS", Rwanda: "RWA", Samoa: "WSM", "Saudi Arabia": "SAU",
  Senegal: "SEN", Serbia: "SRB", "Sierra Leone": "SLE", Singapore: "SGP", Slovakia: "SVK",
  Slovenia: "SVN", "Solomon Islands": "SLB", "South Africa": "ZAF", "South Korea": "KOR",
  Spain: "ESP", "Sri Lanka": "LKA", Suriname: "SUR", Sweden: "SWE", Switzerland: "CHE",
  Syria: "SYR", Taiwan: "TWN", Tajikistan: "TJK", Tanzania: "TZA", Thailand: "THA", Togo: "TGO",
  Tonga: "TON", Tunisia: "TUN", Turkey: "TUR", Turkmenistan: "TKM", UAE: "ARE", Uganda: "UGA",
  Ukraine: "UKR", "United Kingdom": "GBR", "United States": "USA", Uruguay: "URY",
  Uzbekistan: "UZB", Vanuatu: "VUT", Venezuela: "VEN", Vietnam: "VNM", Yemen: "YEM",
  Zambia: "ZMB", Zimbabwe: "ZWE",
}
// OWID uses its own code for Kosovo
const OWID_ISO_OVERRIDES = { XKX: "OWID_KOS" }

function parseCsvLine(line) {
  const out = []
  let field = ""
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        field += '"'
        i++
      } else if (ch === '"') quoted = false
      else field += ch
    } else if (ch === '"') quoted = true
    else if (ch === ",") {
      out.push(field)
      field = ""
    } else field += ch
  }
  out.push(field)
  return out
}

async function* lines(url, { gzip = false } = {}) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} fetching ${url}`)
  let stream = Readable.fromWeb(res.body)
  if (gzip) stream = stream.pipe(createGunzip())
  yield* createInterface({ input: stream, crlfDelay: Infinity })
}

function pickerCountries() {
  const src = readFileSync(join(ROOT, "lib/air-quality-data.ts"), "utf8")
  return [...new Set([...src.matchAll(/country: "([^"]+)"/g)].map((m) => m[1]))].sort()
}

async function buildLifeTables(isoToName) {
  const ageIndex = new Map(LIFE_TABLE_AGES.map((a, i) => [String(a), i]))
  const tables = {}
  let header
  for await (const line of lines(WPP_URL, { gzip: true })) {
    if (!header) {
      header = parseCsvLine(line)
      continue
    }
    if (!line.includes(`,${LIFE_TABLE_YEAR},`)) continue
    const row = parseCsvLine(line)
    const get = (name) => row[header.indexOf(name)]
    if (get("Time") !== String(LIFE_TABLE_YEAR) || get("Variant") !== "Medium") continue
    const sex = get("Sex")
    if (sex !== "Male" && sex !== "Female") continue
    const idx = ageIndex.get(get("AgeGrpStart"))
    if (idx === undefined) continue
    const name = get("LocID") === "900" ? "World" : isoToName.get(get("ISO3_code"))
    if (!name) continue
    tables[name] ??= { male: [], female: [] }
    tables[name][sex === "Male" ? "male" : "female"][idx] = Math.round(Number(get("ex")) * 10) / 10
  }
  return tables
}

async function latestByCountry(url, column, isoToName, extraNames = []) {
  const latest = {}
  let header
  for await (const line of lines(url)) {
    if (!header) {
      header = parseCsvLine(line)
      continue
    }
    const row = parseCsvLine(line)
    const country = row[header.indexOf("country")]
    const iso = row[header.indexOf("iso_code")]
    const year = Number(row[header.indexOf("year")])
    const raw = row[header.indexOf(column)]
    if (raw === "" || raw === undefined) continue
    const name = extraNames.includes(country) ? country : isoToName.get(iso)
    if (!name) continue
    if (!latest[name] || year > latest[name].year) latest[name] = { value: Number(raw), year }
  }
  return latest
}

function writeTs(relPath, contents) {
  const full = join(ROOT, relPath)
  mkdirSync(dirname(full), { recursive: true })
  writeFileSync(full, contents)
  console.log(`wrote ${relPath}`)
}

const countries = pickerCountries()
const unmapped = countries.filter((c) => !ISO3[c])
if (unmapped.length) throw new Error(`Add ISO3 codes for: ${unmapped.join(", ")}`)

const wppIso = new Map(countries.map((c) => [ISO3[c], c]))
const owidIso = new Map(countries.map((c) => [OWID_ISO_OVERRIDES[ISO3[c]] ?? ISO3[c], c]))

const [lifeTables, grid, co2] = await Promise.all([
  buildLifeTables(wppIso),
  latestByCountry(OWID_ENERGY_URL, "carbon_intensity_elec", owidIso, ["World"]),
  Promise.all(
    ["co2_per_capita", "consumption_co2_per_capita", "ghg_per_capita"].map((col) =>
      latestByCountry(OWID_CO2_URL, col, new Map(), ["World", "European Union (27)", "United States"]).then(
        (r) => [col, r],
      ),
    ),
  ),
])

const incomplete = Object.entries(lifeTables).filter(
  ([, t]) => t.male.filter(Number.isFinite).length !== LIFE_TABLE_AGES.length ||
    t.female.filter(Number.isFinite).length !== LIFE_TABLE_AGES.length,
)
if (incomplete.length) throw new Error(`Incomplete life tables: ${incomplete.map(([n]) => n).join(", ")}`)
const missingLife = countries.filter((c) => !lifeTables[c])
const missingGrid = countries.filter((c) => !grid[c])

const lifeLines = ["World", ...countries.filter((c) => lifeTables[c])].map(
  (name) =>
    `  ${JSON.stringify(name)}: { male: [${lifeTables[name].male.join(", ")}], female: [${lifeTables[name].female.join(", ")}] },`,
)
writeTs(
  "lib/data/life-tables.ts",
  `// Generated by scripts/build-country-data.mjs. Do not edit by hand; re-run the script to refresh.
// Source: UN DESA Population Division, World Population Prospects 2024, medium variant,
// abridged period life tables for ${LIFE_TABLE_YEAR} (population.un.org/wpp).
// Values are remaining life expectancy e(x) in years at each age in LIFE_TABLE_AGES.

export const LIFE_TABLE_SOURCE = "UN World Population Prospects 2024 (medium variant), ${LIFE_TABLE_YEAR} period life tables"

export const LIFE_TABLE_AGES = [${LIFE_TABLE_AGES.join(", ")}] as const

export interface LifeTable {
  male: readonly number[]
  female: readonly number[]
}

export const LIFE_TABLES: Record<string, LifeTable> = {
${lifeLines.join("\n")}
}
`,
)

const gridYears = Object.values(grid).map((g) => g.year)
const gridLines = ["World", ...countries.filter((c) => grid[c])].map(
  (name) => `  ${JSON.stringify(name)}: [${Math.round(grid[name].value)}, ${grid[name].year}],`,
)
writeTs(
  "lib/data/grid-intensity.ts",
  `// Generated by scripts/build-country-data.mjs. Do not edit by hand; re-run the script to refresh.
// Source: Ember (2025) and Energy Institute Statistical Review, via Our World in Data energy
// dataset (carbon_intensity_elec): lifecycle gCO2e per kWh of electricity generated.
// Each entry is [gCO2e/kWh, data year]; years range ${Math.min(...gridYears)}-${Math.max(...gridYears)}.

export const GRID_INTENSITY_SOURCE = "Ember via Our World in Data (lifecycle gCO2e/kWh)"

export const GRID_INTENSITY: Record<string, readonly [gramsPerKwh: number, year: number]> = {
${gridLines.join("\n")}
}
`,
)

console.log(`\nLife tables: ${Object.keys(lifeTables).length - 1} countries + World (missing: ${missingLife.join(", ") || "none"})`)
console.log(`Grid intensity: ${Object.keys(grid).length - 1} countries + World (missing: ${missingGrid.join(", ") || "none"})`)
console.log("\ne0 / T(45) / T(65) / T(80) by sex (total lifespan = age + e(age)):")
for (const name of ["World", "Italy", "United States", "Japan", "Portugal", "Nigeria", "India", "United Kingdom"]) {
  const t = lifeTables[name]
  if (!t) continue
  const at = (arr, age) => (age + arr[LIFE_TABLE_AGES.indexOf(age)]).toFixed(1)
  console.log(
    `  ${name.padEnd(15)} M e0 ${t.male[0]}  T45 ${at(t.male, 45)}  T65 ${at(t.male, 65)}  T80 ${at(t.male, 80)} | F e0 ${t.female[0]}  T45 ${at(t.female, 45)}  T65 ${at(t.female, 65)}  T80 ${at(t.female, 80)}`,
  )
}
console.log("\nGrid intensity sample:", ["World", "Sweden", "France", "Germany", "Poland", "United Kingdom", "Italy", "United States", "China", "India"].map((n) => `${n} ${grid[n]?.value?.toFixed(0)} (${grid[n]?.year})`).join(" | "))
console.log("\nPer-capita emissions (tonnes, latest year):")
for (const [col, r] of co2) {
  console.log(`  ${col}: ${Object.entries(r).map(([n, v]) => `${n} ${v.value.toFixed(2)} (${v.year})`).join(" | ")}`)
}
