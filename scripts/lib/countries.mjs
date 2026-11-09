import { readFileSync } from "node:fs"
import { join } from "node:path"

// App country label (lib/air-quality-data.ts) -> ISO 3166-1 alpha-3 (WPP uses XKX for Kosovo)
export const ISO3 = {
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

/** Every city in the app's location picker (lib/air-quality-data.ts), in file order */
export function pickerCities(root) {
  const src = readFileSync(join(root, "lib/air-quality-data.ts"), "utf8")
  return [...src.matchAll(/\{\s*city: "([^"]+)",\s*country: "([^"]+)"/g)].map((m) => ({ city: m[1], country: m[2] }))
}

/** Countries offered by the picker, sorted */
export function pickerCountries(root) {
  return [...new Set(pickerCities(root).map((c) => c.country))].sort()
}

/** Fails loudly so a new picker country can't silently fall back to world averages */
export function assertIso3(countries) {
  const unmapped = countries.filter((c) => !ISO3[c])
  if (unmapped.length) throw new Error(`Add ISO3 codes for: ${unmapped.join(", ")}`)
}
