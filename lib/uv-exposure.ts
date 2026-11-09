import { CITY_UV_DOSE, UV_REFERENCE } from "./data/uv-levels"

export interface LocalUv {
  /** City name, or the country when the saved location has no city */
  place: string
  /** Yearly average daily erythemal UV dose, J/m² */
  dose: number
  /** dose / Boston's, the reference for the 10-30 minute sun advice */
  factor: number
}

/**
 * UV level for the Air Quality location. Locations saved before the city was stored fall back
 * to the mean of the country's cities.
 */
export function getLocalUv(country?: string, city?: string): LocalUv | undefined {
  const cities = country ? CITY_UV_DOSE[country] : undefined
  if (!country || !cities) return undefined
  const cityDose = city ? cities[city] : undefined
  const doses = Object.values(cities)
  const dose = cityDose ?? Math.round(doses.reduce((sum, value) => sum + value, 0) / doses.length)
  return {
    place: cityDose !== undefined && city ? city : country,
    dose,
    factor: Math.round((dose / UV_REFERENCE.dose) * 100) / 100,
  }
}
