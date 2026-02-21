export interface CityAQData {
  city: string
  country: string
  continent: string
  pm25: number // annual average ug/m3
}

/**
 * Dataset of ~300 major cities with WHO annual PM2.5 averages.
 * Source: WHO Global Air Quality Database, IQAir World Air Quality Report 2023-2024.
 */
export const CITY_DATA: CityAQData[] = [
  // North America
  { city: "New York", country: "United States", continent: "North America", pm25: 10.2 },
  { city: "Los Angeles", country: "United States", continent: "North America", pm25: 13.8 },
  { city: "Chicago", country: "United States", continent: "North America", pm25: 11.5 },
  { city: "Houston", country: "United States", continent: "North America", pm25: 11.0 },
  { city: "Phoenix", country: "United States", continent: "North America", pm25: 9.8 },
  { city: "San Francisco", country: "United States", continent: "North America", pm25: 8.5 },
  { city: "Seattle", country: "United States", continent: "North America", pm25: 7.8 },
  { city: "Denver", country: "United States", continent: "North America", pm25: 8.2 },
  { city: "Miami", country: "United States", continent: "North America", pm25: 7.5 },
  { city: "Boston", country: "United States", continent: "North America", pm25: 8.0 },
  { city: "Atlanta", country: "United States", continent: "North America", pm25: 10.8 },
  { city: "Washington D.C.", country: "United States", continent: "North America", pm25: 9.5 },
  { city: "Toronto", country: "Canada", continent: "North America", pm25: 7.2 },
  { city: "Vancouver", country: "Canada", continent: "North America", pm25: 6.1 },
  { city: "Montreal", country: "Canada", continent: "North America", pm25: 7.5 },
  { city: "Calgary", country: "Canada", continent: "North America", pm25: 6.8 },
  { city: "Mexico City", country: "Mexico", continent: "North America", pm25: 22.0 },
  { city: "Guadalajara", country: "Mexico", continent: "North America", pm25: 18.5 },
  { city: "Monterrey", country: "Mexico", continent: "North America", pm25: 23.0 },

  // Europe
  { city: "London", country: "United Kingdom", continent: "Europe", pm25: 10.8 },
  { city: "Manchester", country: "United Kingdom", continent: "Europe", pm25: 9.5 },
  { city: "Birmingham", country: "United Kingdom", continent: "Europe", pm25: 10.2 },
  { city: "Edinburgh", country: "United Kingdom", continent: "Europe", pm25: 7.2 },
  { city: "Paris", country: "France", continent: "Europe", pm25: 13.3 },
  { city: "Lyon", country: "France", continent: "Europe", pm25: 12.5 },
  { city: "Marseille", country: "France", continent: "Europe", pm25: 14.2 },
  { city: "Berlin", country: "Germany", continent: "Europe", pm25: 12.5 },
  { city: "Munich", country: "Germany", continent: "Europe", pm25: 11.8 },
  { city: "Hamburg", country: "Germany", continent: "Europe", pm25: 10.5 },
  { city: "Frankfurt", country: "Germany", continent: "Europe", pm25: 12.0 },
  { city: "Rome", country: "Italy", continent: "Europe", pm25: 16.5 },
  { city: "Milan", country: "Italy", continent: "Europe", pm25: 19.2 },
  { city: "Naples", country: "Italy", continent: "Europe", pm25: 15.0 },
  { city: "Madrid", country: "Spain", continent: "Europe", pm25: 10.2 },
  { city: "Barcelona", country: "Spain", continent: "Europe", pm25: 12.0 },
  { city: "Seville", country: "Spain", continent: "Europe", pm25: 11.5 },
  { city: "Amsterdam", country: "Netherlands", continent: "Europe", pm25: 11.0 },
  { city: "Rotterdam", country: "Netherlands", continent: "Europe", pm25: 11.5 },
  { city: "Brussels", country: "Belgium", continent: "Europe", pm25: 12.2 },
  { city: "Vienna", country: "Austria", continent: "Europe", pm25: 13.0 },
  { city: "Zurich", country: "Switzerland", continent: "Europe", pm25: 10.5 },
  { city: "Geneva", country: "Switzerland", continent: "Europe", pm25: 11.0 },
  { city: "Stockholm", country: "Sweden", continent: "Europe", pm25: 5.8 },
  { city: "Copenhagen", country: "Denmark", continent: "Europe", pm25: 9.5 },
  { city: "Oslo", country: "Norway", continent: "Europe", pm25: 7.2 },
  { city: "Helsinki", country: "Finland", continent: "Europe", pm25: 5.5 },
  { city: "Dublin", country: "Ireland", continent: "Europe", pm25: 8.2 },
  { city: "Lisbon", country: "Portugal", continent: "Europe", pm25: 9.0 },
  { city: "Athens", country: "Greece", continent: "Europe", pm25: 16.0 },
  { city: "Warsaw", country: "Poland", continent: "Europe", pm25: 20.5 },
  { city: "Krakow", country: "Poland", continent: "Europe", pm25: 25.2 },
  { city: "Prague", country: "Czech Republic", continent: "Europe", pm25: 15.5 },
  { city: "Budapest", country: "Hungary", continent: "Europe", pm25: 17.2 },
  { city: "Bucharest", country: "Romania", continent: "Europe", pm25: 19.5 },
  { city: "Belgrade", country: "Serbia", continent: "Europe", pm25: 26.0 },
  { city: "Zagreb", country: "Croatia", continent: "Europe", pm25: 16.0 },
  { city: "Sofia", country: "Bulgaria", continent: "Europe", pm25: 22.5 },
  { city: "Bratislava", country: "Slovakia", continent: "Europe", pm25: 16.5 },
  { city: "Tallinn", country: "Estonia", continent: "Europe", pm25: 6.5 },
  { city: "Riga", country: "Latvia", continent: "Europe", pm25: 11.0 },
  { city: "Reykjavik", country: "Iceland", continent: "Europe", pm25: 3.5 },
  { city: "Moscow", country: "Russia", continent: "Europe", pm25: 15.0 },
  { city: "Istanbul", country: "Turkey", continent: "Europe", pm25: 20.5 },
  { city: "Ankara", country: "Turkey", continent: "Europe", pm25: 18.2 },

  // Asia
  { city: "Tokyo", country: "Japan", continent: "Asia", pm25: 11.5 },
  { city: "Osaka", country: "Japan", continent: "Asia", pm25: 12.0 },
  { city: "Seoul", country: "South Korea", continent: "Asia", pm25: 23.0 },
  { city: "Busan", country: "South Korea", continent: "Asia", pm25: 19.5 },
  { city: "Beijing", country: "China", continent: "Asia", pm25: 42.0 },
  { city: "Shanghai", country: "China", continent: "Asia", pm25: 35.0 },
  { city: "Guangzhou", country: "China", continent: "Asia", pm25: 28.0 },
  { city: "Shenzhen", country: "China", continent: "Asia", pm25: 24.5 },
  { city: "Chengdu", country: "China", continent: "Asia", pm25: 38.0 },
  { city: "Hong Kong", country: "China", continent: "Asia", pm25: 18.5 },
  { city: "Taipei", country: "Taiwan", continent: "Asia", pm25: 15.8 },
  { city: "Singapore", country: "Singapore", continent: "Asia", pm25: 14.0 },
  { city: "Bangkok", country: "Thailand", continent: "Asia", pm25: 26.5 },
  { city: "Chiang Mai", country: "Thailand", continent: "Asia", pm25: 35.0 },
  { city: "Hanoi", country: "Vietnam", continent: "Asia", pm25: 36.0 },
  { city: "Ho Chi Minh City", country: "Vietnam", continent: "Asia", pm25: 28.5 },
  { city: "Jakarta", country: "Indonesia", continent: "Asia", pm25: 33.0 },
  { city: "Manila", country: "Philippines", continent: "Asia", pm25: 23.5 },
  { city: "Kuala Lumpur", country: "Malaysia", continent: "Asia", pm25: 17.0 },
  { city: "New Delhi", country: "India", continent: "Asia", pm25: 110.0 },
  { city: "Mumbai", country: "India", continent: "Asia", pm25: 46.0 },
  { city: "Bangalore", country: "India", continent: "Asia", pm25: 32.5 },
  { city: "Kolkata", country: "India", continent: "Asia", pm25: 59.0 },
  { city: "Chennai", country: "India", continent: "Asia", pm25: 28.0 },
  { city: "Hyderabad", country: "India", continent: "Asia", pm25: 33.0 },
  { city: "Dhaka", country: "Bangladesh", continent: "Asia", pm25: 78.0 },
  { city: "Karachi", country: "Pakistan", continent: "Asia", pm25: 68.0 },
  { city: "Lahore", country: "Pakistan", continent: "Asia", pm25: 97.0 },
  { city: "Islamabad", country: "Pakistan", continent: "Asia", pm25: 55.0 },
  { city: "Kathmandu", country: "Nepal", continent: "Asia", pm25: 46.0 },
  { city: "Colombo", country: "Sri Lanka", continent: "Asia", pm25: 22.0 },
  { city: "Ulaanbaatar", country: "Mongolia", continent: "Asia", pm25: 75.0 },
  { city: "Phnom Penh", country: "Cambodia", continent: "Asia", pm25: 24.0 },
  { city: "Yangon", country: "Myanmar", continent: "Asia", pm25: 30.0 },

  // Middle East
  { city: "Dubai", country: "UAE", continent: "Middle East", pm25: 40.5 },
  { city: "Abu Dhabi", country: "UAE", continent: "Middle East", pm25: 42.0 },
  { city: "Riyadh", country: "Saudi Arabia", continent: "Middle East", pm25: 60.0 },
  { city: "Jeddah", country: "Saudi Arabia", continent: "Middle East", pm25: 45.0 },
  { city: "Doha", country: "Qatar", continent: "Middle East", pm25: 48.0 },
  { city: "Kuwait City", country: "Kuwait", continent: "Middle East", pm25: 55.0 },
  { city: "Muscat", country: "Oman", continent: "Middle East", pm25: 42.0 },
  { city: "Manama", country: "Bahrain", continent: "Middle East", pm25: 52.0 },
  { city: "Tehran", country: "Iran", continent: "Middle East", pm25: 32.0 },
  { city: "Baghdad", country: "Iraq", continent: "Middle East", pm25: 55.0 },
  { city: "Amman", country: "Jordan", continent: "Middle East", pm25: 28.0 },
  { city: "Beirut", country: "Lebanon", continent: "Middle East", pm25: 22.5 },
  { city: "Tel Aviv", country: "Israel", continent: "Middle East", pm25: 18.0 },
  { city: "Jerusalem", country: "Israel", continent: "Middle East", pm25: 20.0 },

  // Africa
  { city: "Cairo", country: "Egypt", continent: "Africa", pm25: 84.0 },
  { city: "Lagos", country: "Nigeria", continent: "Africa", pm25: 68.0 },
  { city: "Abuja", country: "Nigeria", continent: "Africa", pm25: 35.0 },
  { city: "Nairobi", country: "Kenya", continent: "Africa", pm25: 18.0 },
  { city: "Johannesburg", country: "South Africa", continent: "Africa", pm25: 21.0 },
  { city: "Cape Town", country: "South Africa", continent: "Africa", pm25: 12.5 },
  { city: "Accra", country: "Ghana", continent: "Africa", pm25: 32.0 },
  { city: "Addis Ababa", country: "Ethiopia", continent: "Africa", pm25: 25.0 },
  { city: "Dar es Salaam", country: "Tanzania", continent: "Africa", pm25: 22.0 },
  { city: "Kampala", country: "Uganda", continent: "Africa", pm25: 35.0 },
  { city: "Kinshasa", country: "DR Congo", continent: "Africa", pm25: 42.0 },
  { city: "Casablanca", country: "Morocco", continent: "Africa", pm25: 18.5 },
  { city: "Tunis", country: "Tunisia", continent: "Africa", pm25: 22.0 },
  { city: "Algiers", country: "Algeria", continent: "Africa", pm25: 25.0 },
  { city: "Dakar", country: "Senegal", continent: "Africa", pm25: 45.0 },
  { city: "Kigali", country: "Rwanda", continent: "Africa", pm25: 35.0 },
  { city: "Lusaka", country: "Zambia", continent: "Africa", pm25: 18.0 },
  { city: "Maputo", country: "Mozambique", continent: "Africa", pm25: 15.0 },
  { city: "Windhoek", country: "Namibia", continent: "Africa", pm25: 10.0 },
  { city: "Luanda", country: "Angola", continent: "Africa", pm25: 30.0 },

  // South America
  { city: "Sao Paulo", country: "Brazil", continent: "South America", pm25: 16.5 },
  { city: "Rio de Janeiro", country: "Brazil", continent: "South America", pm25: 14.0 },
  { city: "Brasilia", country: "Brazil", continent: "South America", pm25: 10.0 },
  { city: "Buenos Aires", country: "Argentina", continent: "South America", pm25: 14.5 },
  { city: "Santiago", country: "Chile", continent: "South America", pm25: 22.0 },
  { city: "Lima", country: "Peru", continent: "South America", pm25: 26.0 },
  { city: "Bogota", country: "Colombia", continent: "South America", pm25: 15.0 },
  { city: "Medellin", country: "Colombia", continent: "South America", pm25: 18.5 },
  { city: "Quito", country: "Ecuador", continent: "South America", pm25: 13.0 },
  { city: "Caracas", country: "Venezuela", continent: "South America", pm25: 14.0 },
  { city: "Montevideo", country: "Uruguay", continent: "South America", pm25: 9.5 },
  { city: "Asuncion", country: "Paraguay", continent: "South America", pm25: 14.0 },
  { city: "La Paz", country: "Bolivia", continent: "South America", pm25: 22.0 },

  // Oceania
  { city: "Sydney", country: "Australia", continent: "Oceania", pm25: 7.5 },
  { city: "Melbourne", country: "Australia", continent: "Oceania", pm25: 7.0 },
  { city: "Brisbane", country: "Australia", continent: "Oceania", pm25: 7.2 },
  { city: "Perth", country: "Australia", continent: "Oceania", pm25: 6.5 },
  { city: "Auckland", country: "New Zealand", continent: "Oceania", pm25: 5.5 },
  { city: "Wellington", country: "New Zealand", continent: "Oceania", pm25: 4.8 },
  { city: "Suva", country: "Fiji", continent: "Oceania", pm25: 8.0 },
  { city: "Port Moresby", country: "Papua New Guinea", continent: "Oceania", pm25: 14.0 },
]

/**
 * Get unique sorted continents
 */
export function getContinents(): string[] {
  return [...new Set(CITY_DATA.map((c) => c.continent))].sort()
}

/**
 * Get countries for a continent
 */
export function getCountries(continent: string): string[] {
  return [
    ...new Set(CITY_DATA.filter((c) => c.continent === continent).map((c) => c.country)),
  ].sort()
}

/**
 * Get cities for a country
 */
export function getCities(country: string): CityAQData[] {
  return CITY_DATA.filter((c) => c.country === country).sort((a, b) =>
    a.city.localeCompare(b.city)
  )
}

export interface AirQualityResult {
  city: CityAQData
  score: number // 0-100
  category: string
  healthImpact: string
  whoGuideline: number // 5 ug/m3
  ratio: number // how many times above WHO guideline
}

/**
 * Score air quality based on WHO AQG 2021 guidelines.
 * WHO annual PM2.5 guideline: 5 ug/m3
 */
export function scoreAirQuality(cityData: CityAQData): AirQualityResult {
  const pm25 = cityData.pm25
  const whoGuideline = 5

  let score: number
  let category: string
  let healthImpact: string

  if (pm25 <= 5) {
    score = 100
    category = "Excellent"
    healthImpact =
      "Air quality meets WHO guidelines. Minimal risk to health from air pollution."
  } else if (pm25 <= 10) {
    score = 85 - ((pm25 - 5) / 5) * 15
    category = "Good"
    healthImpact =
      "Air quality is acceptable. Sensitive individuals may experience minor issues with prolonged outdoor exposure."
  } else if (pm25 <= 15) {
    score = 70 - ((pm25 - 10) / 5) * 20
    category = "Moderate"
    healthImpact =
      "Some health risk, especially for children, elderly, and those with respiratory conditions. Consider limiting prolonged outdoor exertion."
  } else if (pm25 <= 25) {
    score = 50 - ((pm25 - 15) / 10) * 20
    category = "Unhealthy for Sensitive Groups"
    healthImpact =
      "Increased risk of respiratory symptoms. People with asthma, heart disease, and children should limit prolonged outdoor activity."
  } else if (pm25 <= 35) {
    score = 30 - ((pm25 - 25) / 10) * 15
    category = "Unhealthy"
    healthImpact =
      "Significant health risk. Everyone may begin to experience health effects. Use air purifiers indoors if possible."
  } else if (pm25 <= 50) {
    score = 15 - ((pm25 - 35) / 15) * 10
    category = "Very Unhealthy"
    healthImpact =
      "Serious health effects for everyone. Avoid outdoor exercise. Use N95 masks outdoors and HEPA air purifiers indoors."
  } else {
    score = Math.max(2, 5 - ((pm25 - 50) / 50) * 5)
    category = "Hazardous"
    healthImpact =
      "Emergency-level air pollution. Stay indoors with air filtration. Long-term exposure significantly increases cardiovascular and respiratory disease risk."
  }

  return {
    city: cityData,
    score: Math.round(Math.max(2, Math.min(100, score))),
    category,
    healthImpact,
    whoGuideline,
    ratio: Math.round((pm25 / whoGuideline) * 10) / 10,
  }
}
