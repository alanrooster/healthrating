export interface CityAQData {
  city: string
  country: string
  continent: string
  pm25: number // annual average ug/m3
}

/**
 * 564 cities with approximate annual mean PM2.5 in µg/m³, entered by hand from the WHO Ambient
 * Air Quality Database and the IQAir World Air Quality Report (2023-2024 editions). They are not
 * generated from a source file, so individual cities can be a few µg/m³ off or out of date.
 */
export const CITY_DATA: CityAQData[] = [
  // ============ NORTH AMERICA ============
  // United States (25+ cities)
  { city: "New York", country: "United States", continent: "North America", pm25: 10.2 },
  { city: "Los Angeles", country: "United States", continent: "North America", pm25: 13.8 },
  { city: "Chicago", country: "United States", continent: "North America", pm25: 11.5 },
  { city: "Houston", country: "United States", continent: "North America", pm25: 11.0 },
  { city: "Phoenix", country: "United States", continent: "North America", pm25: 9.8 },
  { city: "Philadelphia", country: "United States", continent: "North America", pm25: 10.5 },
  { city: "San Antonio", country: "United States", continent: "North America", pm25: 9.2 },
  { city: "San Diego", country: "United States", continent: "North America", pm25: 10.8 },
  { city: "Dallas", country: "United States", continent: "North America", pm25: 10.2 },
  { city: "San Jose", country: "United States", continent: "North America", pm25: 9.5 },
  { city: "Austin", country: "United States", continent: "North America", pm25: 8.8 },
  { city: "Jacksonville", country: "United States", continent: "North America", pm25: 8.2 },
  { city: "San Francisco", country: "United States", continent: "North America", pm25: 8.5 },
  { city: "Seattle", country: "United States", continent: "North America", pm25: 7.8 },
  { city: "Denver", country: "United States", continent: "North America", pm25: 8.2 },
  { city: "Miami", country: "United States", continent: "North America", pm25: 7.5 },
  { city: "Boston", country: "United States", continent: "North America", pm25: 8.0 },
  { city: "Atlanta", country: "United States", continent: "North America", pm25: 10.8 },
  { city: "Washington D.C.", country: "United States", continent: "North America", pm25: 9.5 },
  { city: "Nashville", country: "United States", continent: "North America", pm25: 9.8 },
  { city: "Detroit", country: "United States", continent: "North America", pm25: 10.5 },
  { city: "Portland", country: "United States", continent: "North America", pm25: 7.5 },
  { city: "Las Vegas", country: "United States", continent: "North America", pm25: 10.0 },
  { city: "Minneapolis", country: "United States", continent: "North America", pm25: 8.5 },
  { city: "Cleveland", country: "United States", continent: "North America", pm25: 11.2 },
  { city: "Pittsburgh", country: "United States", continent: "North America", pm25: 11.8 },
  { city: "Salt Lake City", country: "United States", continent: "North America", pm25: 9.5 },
  { city: "Honolulu", country: "United States", continent: "North America", pm25: 5.2 },
  { city: "Anchorage", country: "United States", continent: "North America", pm25: 5.8 },
  { city: "Fresno", country: "United States", continent: "North America", pm25: 17.5 },
  { city: "Bakersfield", country: "United States", continent: "North America", pm25: 18.2 },

  // Canada (10+ cities)
  { city: "Toronto", country: "Canada", continent: "North America", pm25: 7.2 },
  { city: "Vancouver", country: "Canada", continent: "North America", pm25: 6.1 },
  { city: "Montreal", country: "Canada", continent: "North America", pm25: 7.5 },
  { city: "Calgary", country: "Canada", continent: "North America", pm25: 6.8 },
  { city: "Edmonton", country: "Canada", continent: "North America", pm25: 7.0 },
  { city: "Ottawa", country: "Canada", continent: "North America", pm25: 6.5 },
  { city: "Winnipeg", country: "Canada", continent: "North America", pm25: 6.2 },
  { city: "Quebec City", country: "Canada", continent: "North America", pm25: 6.8 },
  { city: "Hamilton", country: "Canada", continent: "North America", pm25: 7.8 },
  { city: "Halifax", country: "Canada", continent: "North America", pm25: 5.5 },
  { city: "Victoria", country: "Canada", continent: "North America", pm25: 5.8 },
  { city: "Saskatoon", country: "Canada", continent: "North America", pm25: 6.0 },

  // Mexico (8+ cities)
  { city: "Mexico City", country: "Mexico", continent: "North America", pm25: 22.0 },
  { city: "Guadalajara", country: "Mexico", continent: "North America", pm25: 18.5 },
  { city: "Monterrey", country: "Mexico", continent: "North America", pm25: 23.0 },
  { city: "Puebla", country: "Mexico", continent: "North America", pm25: 19.0 },
  { city: "Tijuana", country: "Mexico", continent: "North America", pm25: 15.5 },
  { city: "Leon", country: "Mexico", continent: "North America", pm25: 20.5 },
  { city: "Juarez", country: "Mexico", continent: "North America", pm25: 18.0 },
  { city: "Cancun", country: "Mexico", continent: "North America", pm25: 10.5 },
  { city: "Merida", country: "Mexico", continent: "North America", pm25: 12.0 },
  { city: "Queretaro", country: "Mexico", continent: "North America", pm25: 17.5 },

  // Central America & Caribbean
  { city: "Guatemala City", country: "Guatemala", continent: "North America", pm25: 28.0 },
  { city: "San Salvador", country: "El Salvador", continent: "North America", pm25: 24.0 },
  { city: "Tegucigalpa", country: "Honduras", continent: "North America", pm25: 22.0 },
  { city: "Managua", country: "Nicaragua", continent: "North America", pm25: 20.0 },
  { city: "San Jose", country: "Costa Rica", continent: "North America", pm25: 15.0 },
  { city: "Panama City", country: "Panama", continent: "North America", pm25: 14.0 },
  { city: "Havana", country: "Cuba", continent: "North America", pm25: 18.0 },
  { city: "Santo Domingo", country: "Dominican Republic", continent: "North America", pm25: 20.0 },
  { city: "Kingston", country: "Jamaica", continent: "North America", pm25: 16.0 },
  { city: "Port-au-Prince", country: "Haiti", continent: "North America", pm25: 25.0 },

  // ============ EUROPE ============
  // United Kingdom (10+ cities)
  { city: "London", country: "United Kingdom", continent: "Europe", pm25: 10.8 },
  { city: "Manchester", country: "United Kingdom", continent: "Europe", pm25: 9.5 },
  { city: "Birmingham", country: "United Kingdom", continent: "Europe", pm25: 10.2 },
  { city: "Edinburgh", country: "United Kingdom", continent: "Europe", pm25: 7.2 },
  { city: "Glasgow", country: "United Kingdom", continent: "Europe", pm25: 8.5 },
  { city: "Liverpool", country: "United Kingdom", continent: "Europe", pm25: 9.8 },
  { city: "Bristol", country: "United Kingdom", continent: "Europe", pm25: 9.0 },
  { city: "Leeds", country: "United Kingdom", continent: "Europe", pm25: 9.5 },
  { city: "Sheffield", country: "United Kingdom", continent: "Europe", pm25: 9.2 },
  { city: "Newcastle", country: "United Kingdom", continent: "Europe", pm25: 8.8 },
  { city: "Cardiff", country: "United Kingdom", continent: "Europe", pm25: 8.5 },
  { city: "Belfast", country: "United Kingdom", continent: "Europe", pm25: 7.8 },

  // France (10+ cities)
  { city: "Paris", country: "France", continent: "Europe", pm25: 13.3 },
  { city: "Lyon", country: "France", continent: "Europe", pm25: 12.5 },
  { city: "Marseille", country: "France", continent: "Europe", pm25: 14.2 },
  { city: "Toulouse", country: "France", continent: "Europe", pm25: 10.5 },
  { city: "Nice", country: "France", continent: "Europe", pm25: 12.8 },
  { city: "Nantes", country: "France", continent: "Europe", pm25: 9.8 },
  { city: "Strasbourg", country: "France", continent: "Europe", pm25: 12.0 },
  { city: "Montpellier", country: "France", continent: "Europe", pm25: 11.5 },
  { city: "Bordeaux", country: "France", continent: "Europe", pm25: 10.2 },
  { city: "Lille", country: "France", continent: "Europe", pm25: 13.0 },
  { city: "Rennes", country: "France", continent: "Europe", pm25: 9.5 },
  { city: "Grenoble", country: "France", continent: "Europe", pm25: 14.5 },

  // Germany (12+ cities)
  { city: "Berlin", country: "Germany", continent: "Europe", pm25: 12.5 },
  { city: "Munich", country: "Germany", continent: "Europe", pm25: 11.8 },
  { city: "Hamburg", country: "Germany", continent: "Europe", pm25: 10.5 },
  { city: "Frankfurt", country: "Germany", continent: "Europe", pm25: 12.0 },
  { city: "Cologne", country: "Germany", continent: "Europe", pm25: 12.8 },
  { city: "Stuttgart", country: "Germany", continent: "Europe", pm25: 13.5 },
  { city: "Dusseldorf", country: "Germany", continent: "Europe", pm25: 12.2 },
  { city: "Leipzig", country: "Germany", continent: "Europe", pm25: 11.5 },
  { city: "Dortmund", country: "Germany", continent: "Europe", pm25: 12.5 },
  { city: "Essen", country: "Germany", continent: "Europe", pm25: 13.0 },
  { city: "Bremen", country: "Germany", continent: "Europe", pm25: 10.8 },
  { city: "Dresden", country: "Germany", continent: "Europe", pm25: 11.2 },
  { city: "Hanover", country: "Germany", continent: "Europe", pm25: 11.0 },
  { city: "Nuremberg", country: "Germany", continent: "Europe", pm25: 11.8 },

  // Italy (10+ cities)
  { city: "Rome", country: "Italy", continent: "Europe", pm25: 16.5 },
  { city: "Milan", country: "Italy", continent: "Europe", pm25: 19.2 },
  { city: "Naples", country: "Italy", continent: "Europe", pm25: 15.0 },
  { city: "Turin", country: "Italy", continent: "Europe", pm25: 18.5 },
  { city: "Florence", country: "Italy", continent: "Europe", pm25: 14.8 },
  { city: "Bologna", country: "Italy", continent: "Europe", pm25: 17.0 },
  { city: "Venice", country: "Italy", continent: "Europe", pm25: 18.0 },
  { city: "Verona", country: "Italy", continent: "Europe", pm25: 17.5 },
  { city: "Genoa", country: "Italy", continent: "Europe", pm25: 14.5 },
  { city: "Palermo", country: "Italy", continent: "Europe", pm25: 13.5 },
  { city: "Bari", country: "Italy", continent: "Europe", pm25: 14.0 },
  { city: "Catania", country: "Italy", continent: "Europe", pm25: 13.0 },

  // Spain (10+ cities)
  { city: "Madrid", country: "Spain", continent: "Europe", pm25: 10.2 },
  { city: "Barcelona", country: "Spain", continent: "Europe", pm25: 12.0 },
  { city: "Valencia", country: "Spain", continent: "Europe", pm25: 11.5 },
  { city: "Seville", country: "Spain", continent: "Europe", pm25: 11.5 },
  { city: "Zaragoza", country: "Spain", continent: "Europe", pm25: 10.8 },
  { city: "Malaga", country: "Spain", continent: "Europe", pm25: 11.0 },
  { city: "Bilbao", country: "Spain", continent: "Europe", pm25: 9.5 },
  { city: "Alicante", country: "Spain", continent: "Europe", pm25: 10.5 },
  { city: "Granada", country: "Spain", continent: "Europe", pm25: 12.5 },
  { city: "Palma", country: "Spain", continent: "Europe", pm25: 9.0 },
  { city: "Las Palmas", country: "Spain", continent: "Europe", pm25: 14.0 },
  { city: "Murcia", country: "Spain", continent: "Europe", pm25: 11.2 },

  // Netherlands (6+ cities)
  { city: "Amsterdam", country: "Netherlands", continent: "Europe", pm25: 11.0 },
  { city: "Rotterdam", country: "Netherlands", continent: "Europe", pm25: 11.5 },
  { city: "The Hague", country: "Netherlands", continent: "Europe", pm25: 10.8 },
  { city: "Utrecht", country: "Netherlands", continent: "Europe", pm25: 10.5 },
  { city: "Eindhoven", country: "Netherlands", continent: "Europe", pm25: 11.2 },
  { city: "Groningen", country: "Netherlands", continent: "Europe", pm25: 9.8 },
  { city: "Tilburg", country: "Netherlands", continent: "Europe", pm25: 10.8 },

  // Belgium (5+ cities)
  { city: "Brussels", country: "Belgium", continent: "Europe", pm25: 12.2 },
  { city: "Antwerp", country: "Belgium", continent: "Europe", pm25: 12.8 },
  { city: "Ghent", country: "Belgium", continent: "Europe", pm25: 11.5 },
  { city: "Bruges", country: "Belgium", continent: "Europe", pm25: 10.8 },
  { city: "Liege", country: "Belgium", continent: "Europe", pm25: 13.5 },
  { city: "Charleroi", country: "Belgium", continent: "Europe", pm25: 14.0 },

  // Poland (8+ cities)
  { city: "Warsaw", country: "Poland", continent: "Europe", pm25: 20.5 },
  { city: "Krakow", country: "Poland", continent: "Europe", pm25: 25.2 },
  { city: "Lodz", country: "Poland", continent: "Europe", pm25: 22.0 },
  { city: "Wroclaw", country: "Poland", continent: "Europe", pm25: 21.5 },
  { city: "Poznan", country: "Poland", continent: "Europe", pm25: 19.0 },
  { city: "Gdansk", country: "Poland", continent: "Europe", pm25: 16.5 },
  { city: "Szczecin", country: "Poland", continent: "Europe", pm25: 17.0 },
  { city: "Katowice", country: "Poland", continent: "Europe", pm25: 28.0 },
  { city: "Lublin", country: "Poland", continent: "Europe", pm25: 23.0 },

  // Austria (5+ cities)
  { city: "Vienna", country: "Austria", continent: "Europe", pm25: 13.0 },
  { city: "Graz", country: "Austria", continent: "Europe", pm25: 15.5 },
  { city: "Linz", country: "Austria", continent: "Europe", pm25: 14.0 },
  { city: "Salzburg", country: "Austria", continent: "Europe", pm25: 12.5 },
  { city: "Innsbruck", country: "Austria", continent: "Europe", pm25: 13.5 },

  // Switzerland (6+ cities)
  { city: "Zurich", country: "Switzerland", continent: "Europe", pm25: 10.5 },
  { city: "Geneva", country: "Switzerland", continent: "Europe", pm25: 11.0 },
  { city: "Basel", country: "Switzerland", continent: "Europe", pm25: 11.5 },
  { city: "Bern", country: "Switzerland", continent: "Europe", pm25: 10.2 },
  { city: "Lausanne", country: "Switzerland", continent: "Europe", pm25: 10.8 },
  { city: "Lucerne", country: "Switzerland", continent: "Europe", pm25: 10.0 },

  // Nordic Countries
  { city: "Stockholm", country: "Sweden", continent: "Europe", pm25: 5.8 },
  { city: "Gothenburg", country: "Sweden", continent: "Europe", pm25: 6.2 },
  { city: "Malmo", country: "Sweden", continent: "Europe", pm25: 7.5 },
  { city: "Uppsala", country: "Sweden", continent: "Europe", pm25: 5.5 },
  { city: "Linkoping", country: "Sweden", continent: "Europe", pm25: 5.8 },
  { city: "Copenhagen", country: "Denmark", continent: "Europe", pm25: 9.5 },
  { city: "Aarhus", country: "Denmark", continent: "Europe", pm25: 9.0 },
  { city: "Odense", country: "Denmark", continent: "Europe", pm25: 8.8 },
  { city: "Aalborg", country: "Denmark", continent: "Europe", pm25: 8.5 },
  { city: "Oslo", country: "Norway", continent: "Europe", pm25: 7.2 },
  { city: "Bergen", country: "Norway", continent: "Europe", pm25: 6.8 },
  { city: "Trondheim", country: "Norway", continent: "Europe", pm25: 6.5 },
  { city: "Stavanger", country: "Norway", continent: "Europe", pm25: 6.2 },
  { city: "Helsinki", country: "Finland", continent: "Europe", pm25: 5.5 },
  { city: "Tampere", country: "Finland", continent: "Europe", pm25: 5.8 },
  { city: "Turku", country: "Finland", continent: "Europe", pm25: 5.5 },
  { city: "Oulu", country: "Finland", continent: "Europe", pm25: 5.2 },
  { city: "Reykjavik", country: "Iceland", continent: "Europe", pm25: 3.5 },

  // Other Western Europe
  { city: "Dublin", country: "Ireland", continent: "Europe", pm25: 8.2 },
  { city: "Cork", country: "Ireland", continent: "Europe", pm25: 7.8 },
  { city: "Galway", country: "Ireland", continent: "Europe", pm25: 6.5 },
  { city: "Limerick", country: "Ireland", continent: "Europe", pm25: 7.5 },
  { city: "Lisbon", country: "Portugal", continent: "Europe", pm25: 9.0 },
  { city: "Porto", country: "Portugal", continent: "Europe", pm25: 10.5 },
  { city: "Braga", country: "Portugal", continent: "Europe", pm25: 11.0 },
  { city: "Coimbra", country: "Portugal", continent: "Europe", pm25: 9.5 },
  { city: "Faro", country: "Portugal", continent: "Europe", pm25: 8.5 },
  { city: "Luxembourg", country: "Luxembourg", continent: "Europe", pm25: 10.0 },

  // Eastern Europe
  { city: "Athens", country: "Greece", continent: "Europe", pm25: 16.0 },
  { city: "Thessaloniki", country: "Greece", continent: "Europe", pm25: 18.5 },
  { city: "Patras", country: "Greece", continent: "Europe", pm25: 14.0 },
  { city: "Heraklion", country: "Greece", continent: "Europe", pm25: 13.0 },
  { city: "Prague", country: "Czech Republic", continent: "Europe", pm25: 15.5 },
  { city: "Brno", country: "Czech Republic", continent: "Europe", pm25: 16.0 },
  { city: "Ostrava", country: "Czech Republic", continent: "Europe", pm25: 22.0 },
  { city: "Plzen", country: "Czech Republic", continent: "Europe", pm25: 14.5 },
  { city: "Budapest", country: "Hungary", continent: "Europe", pm25: 17.2 },
  { city: "Debrecen", country: "Hungary", continent: "Europe", pm25: 18.0 },
  { city: "Szeged", country: "Hungary", continent: "Europe", pm25: 16.5 },
  { city: "Pecs", country: "Hungary", continent: "Europe", pm25: 16.0 },
  { city: "Bucharest", country: "Romania", continent: "Europe", pm25: 19.5 },
  { city: "Cluj-Napoca", country: "Romania", continent: "Europe", pm25: 16.0 },
  { city: "Timisoara", country: "Romania", continent: "Europe", pm25: 17.5 },
  { city: "Iasi", country: "Romania", continent: "Europe", pm25: 18.0 },
  { city: "Brasov", country: "Romania", continent: "Europe", pm25: 15.5 },
  { city: "Belgrade", country: "Serbia", continent: "Europe", pm25: 26.0 },
  { city: "Novi Sad", country: "Serbia", continent: "Europe", pm25: 22.0 },
  { city: "Nis", country: "Serbia", continent: "Europe", pm25: 28.0 },
  { city: "Zagreb", country: "Croatia", continent: "Europe", pm25: 16.0 },
  { city: "Split", country: "Croatia", continent: "Europe", pm25: 12.5 },
  { city: "Rijeka", country: "Croatia", continent: "Europe", pm25: 13.0 },
  { city: "Dubrovnik", country: "Croatia", continent: "Europe", pm25: 10.0 },
  { city: "Ljubljana", country: "Slovenia", continent: "Europe", pm25: 15.0 },
  { city: "Maribor", country: "Slovenia", continent: "Europe", pm25: 17.0 },
  { city: "Sofia", country: "Bulgaria", continent: "Europe", pm25: 22.5 },
  { city: "Plovdiv", country: "Bulgaria", continent: "Europe", pm25: 24.0 },
  { city: "Varna", country: "Bulgaria", continent: "Europe", pm25: 18.0 },
  { city: "Bratislava", country: "Slovakia", continent: "Europe", pm25: 16.5 },
  { city: "Kosice", country: "Slovakia", continent: "Europe", pm25: 18.0 },
  { city: "Tallinn", country: "Estonia", continent: "Europe", pm25: 6.5 },
  { city: "Tartu", country: "Estonia", continent: "Europe", pm25: 6.8 },
  { city: "Riga", country: "Latvia", continent: "Europe", pm25: 11.0 },
  { city: "Daugavpils", country: "Latvia", continent: "Europe", pm25: 10.5 },
  { city: "Vilnius", country: "Lithuania", continent: "Europe", pm25: 12.0 },
  { city: "Kaunas", country: "Lithuania", continent: "Europe", pm25: 11.5 },
  { city: "Sarajevo", country: "Bosnia", continent: "Europe", pm25: 35.0 },
  { city: "Banja Luka", country: "Bosnia", continent: "Europe", pm25: 28.0 },
  { city: "Skopje", country: "North Macedonia", continent: "Europe", pm25: 38.0 },
  { city: "Tirana", country: "Albania", continent: "Europe", pm25: 22.0 },
  { city: "Podgorica", country: "Montenegro", continent: "Europe", pm25: 24.0 },
  { city: "Pristina", country: "Kosovo", continent: "Europe", pm25: 32.0 },

  // Russia & Ukraine
  { city: "Moscow", country: "Russia", continent: "Europe", pm25: 15.0 },
  { city: "Saint Petersburg", country: "Russia", continent: "Europe", pm25: 13.5 },
  { city: "Novosibirsk", country: "Russia", continent: "Europe", pm25: 18.0 },
  { city: "Yekaterinburg", country: "Russia", continent: "Europe", pm25: 16.0 },
  { city: "Kazan", country: "Russia", continent: "Europe", pm25: 14.5 },
  { city: "Krasnoyarsk", country: "Russia", continent: "Europe", pm25: 22.0 },
  { city: "Kyiv", country: "Ukraine", continent: "Europe", pm25: 18.0 },
  { city: "Kharkiv", country: "Ukraine", continent: "Europe", pm25: 17.0 },
  { city: "Odesa", country: "Ukraine", continent: "Europe", pm25: 15.5 },
  { city: "Lviv", country: "Ukraine", continent: "Europe", pm25: 14.0 },

  // Turkey
  { city: "Istanbul", country: "Turkey", continent: "Europe", pm25: 20.5 },
  { city: "Ankara", country: "Turkey", continent: "Europe", pm25: 18.2 },
  { city: "Izmir", country: "Turkey", continent: "Europe", pm25: 16.5 },
  { city: "Bursa", country: "Turkey", continent: "Europe", pm25: 19.0 },
  { city: "Antalya", country: "Turkey", continent: "Europe", pm25: 14.0 },
  { city: "Adana", country: "Turkey", continent: "Europe", pm25: 17.5 },
  { city: "Gaziantep", country: "Turkey", continent: "Europe", pm25: 22.0 },

  // ============ ASIA ============
  // Japan (10+ cities)
  { city: "Tokyo", country: "Japan", continent: "Asia", pm25: 11.5 },
  { city: "Osaka", country: "Japan", continent: "Asia", pm25: 12.0 },
  { city: "Nagoya", country: "Japan", continent: "Asia", pm25: 11.8 },
  { city: "Yokohama", country: "Japan", continent: "Asia", pm25: 11.2 },
  { city: "Sapporo", country: "Japan", continent: "Asia", pm25: 9.0 },
  { city: "Fukuoka", country: "Japan", continent: "Asia", pm25: 12.5 },
  { city: "Kobe", country: "Japan", continent: "Asia", pm25: 12.0 },
  { city: "Kyoto", country: "Japan", continent: "Asia", pm25: 11.0 },
  { city: "Hiroshima", country: "Japan", continent: "Asia", pm25: 10.5 },
  { city: "Sendai", country: "Japan", continent: "Asia", pm25: 9.5 },

  // South Korea (8+ cities)
  { city: "Seoul", country: "South Korea", continent: "Asia", pm25: 23.0 },
  { city: "Busan", country: "South Korea", continent: "Asia", pm25: 19.5 },
  { city: "Incheon", country: "South Korea", continent: "Asia", pm25: 22.5 },
  { city: "Daegu", country: "South Korea", continent: "Asia", pm25: 21.0 },
  { city: "Daejeon", country: "South Korea", continent: "Asia", pm25: 20.5 },
  { city: "Gwangju", country: "South Korea", continent: "Asia", pm25: 19.0 },
  { city: "Ulsan", country: "South Korea", continent: "Asia", pm25: 20.0 },
  { city: "Suwon", country: "South Korea", continent: "Asia", pm25: 22.0 },

  // China (15+ cities)
  { city: "Beijing", country: "China", continent: "Asia", pm25: 42.0 },
  { city: "Shanghai", country: "China", continent: "Asia", pm25: 35.0 },
  { city: "Guangzhou", country: "China", continent: "Asia", pm25: 28.0 },
  { city: "Shenzhen", country: "China", continent: "Asia", pm25: 24.5 },
  { city: "Chengdu", country: "China", continent: "Asia", pm25: 38.0 },
  { city: "Hong Kong", country: "China", continent: "Asia", pm25: 18.5 },
  { city: "Chongqing", country: "China", continent: "Asia", pm25: 40.0 },
  { city: "Tianjin", country: "China", continent: "Asia", pm25: 52.0 },
  { city: "Wuhan", country: "China", continent: "Asia", pm25: 45.0 },
  { city: "Hangzhou", country: "China", continent: "Asia", pm25: 32.0 },
  { city: "Nanjing", country: "China", continent: "Asia", pm25: 38.0 },
  { city: "Xian", country: "China", continent: "Asia", pm25: 55.0 },
  { city: "Harbin", country: "China", continent: "Asia", pm25: 48.0 },
  { city: "Qingdao", country: "China", continent: "Asia", pm25: 35.0 },
  { city: "Dalian", country: "China", continent: "Asia", pm25: 32.0 },
  { city: "Shenyang", country: "China", continent: "Asia", pm25: 42.0 },
  { city: "Suzhou", country: "China", continent: "Asia", pm25: 34.0 },
  { city: "Kunming", country: "China", continent: "Asia", pm25: 22.0 },
  { city: "Xiamen", country: "China", continent: "Asia", pm25: 20.0 },
  { city: "Zhengzhou", country: "China", continent: "Asia", pm25: 50.0 },

  // Taiwan
  { city: "Taipei", country: "Taiwan", continent: "Asia", pm25: 15.8 },
  { city: "Kaohsiung", country: "Taiwan", continent: "Asia", pm25: 22.0 },
  { city: "Taichung", country: "Taiwan", continent: "Asia", pm25: 20.0 },
  { city: "Tainan", country: "Taiwan", continent: "Asia", pm25: 23.0 },
  { city: "Hsinchu", country: "Taiwan", continent: "Asia", pm25: 16.5 },

  // Southeast Asia
  { city: "Singapore", country: "Singapore", continent: "Asia", pm25: 14.0 },
  { city: "Bangkok", country: "Thailand", continent: "Asia", pm25: 26.5 },
  { city: "Chiang Mai", country: "Thailand", continent: "Asia", pm25: 35.0 },
  { city: "Phuket", country: "Thailand", continent: "Asia", pm25: 18.0 },
  { city: "Pattaya", country: "Thailand", continent: "Asia", pm25: 22.0 },
  { city: "Chiang Rai", country: "Thailand", continent: "Asia", pm25: 32.0 },
  { city: "Hanoi", country: "Vietnam", continent: "Asia", pm25: 36.0 },
  { city: "Ho Chi Minh City", country: "Vietnam", continent: "Asia", pm25: 28.5 },
  { city: "Da Nang", country: "Vietnam", continent: "Asia", pm25: 22.0 },
  { city: "Hai Phong", country: "Vietnam", continent: "Asia", pm25: 32.0 },
  { city: "Can Tho", country: "Vietnam", continent: "Asia", pm25: 25.0 },
  { city: "Jakarta", country: "Indonesia", continent: "Asia", pm25: 33.0 },
  { city: "Surabaya", country: "Indonesia", continent: "Asia", pm25: 28.0 },
  { city: "Bandung", country: "Indonesia", continent: "Asia", pm25: 32.0 },
  { city: "Medan", country: "Indonesia", continent: "Asia", pm25: 35.0 },
  { city: "Bali", country: "Indonesia", continent: "Asia", pm25: 18.0 },
  { city: "Semarang", country: "Indonesia", continent: "Asia", pm25: 30.0 },
  { city: "Manila", country: "Philippines", continent: "Asia", pm25: 23.5 },
  { city: "Cebu City", country: "Philippines", continent: "Asia", pm25: 20.0 },
  { city: "Davao", country: "Philippines", continent: "Asia", pm25: 18.0 },
  { city: "Quezon City", country: "Philippines", continent: "Asia", pm25: 24.0 },
  { city: "Kuala Lumpur", country: "Malaysia", continent: "Asia", pm25: 17.0 },
  { city: "Penang", country: "Malaysia", continent: "Asia", pm25: 18.5 },
  { city: "Johor Bahru", country: "Malaysia", continent: "Asia", pm25: 19.0 },
  { city: "Kuching", country: "Malaysia", continent: "Asia", pm25: 20.0 },
  { city: "Kota Kinabalu", country: "Malaysia", continent: "Asia", pm25: 16.0 },
  { city: "Phnom Penh", country: "Cambodia", continent: "Asia", pm25: 24.0 },
  { city: "Siem Reap", country: "Cambodia", continent: "Asia", pm25: 22.0 },
  { city: "Yangon", country: "Myanmar", continent: "Asia", pm25: 30.0 },
  { city: "Mandalay", country: "Myanmar", continent: "Asia", pm25: 35.0 },
  { city: "Vientiane", country: "Laos", continent: "Asia", pm25: 28.0 },

  // South Asia - India (15+ cities)
  { city: "New Delhi", country: "India", continent: "Asia", pm25: 110.0 },
  { city: "Mumbai", country: "India", continent: "Asia", pm25: 46.0 },
  { city: "Bangalore", country: "India", continent: "Asia", pm25: 32.5 },
  { city: "Kolkata", country: "India", continent: "Asia", pm25: 59.0 },
  { city: "Chennai", country: "India", continent: "Asia", pm25: 28.0 },
  { city: "Hyderabad", country: "India", continent: "Asia", pm25: 33.0 },
  { city: "Ahmedabad", country: "India", continent: "Asia", pm25: 55.0 },
  { city: "Pune", country: "India", continent: "Asia", pm25: 35.0 },
  { city: "Jaipur", country: "India", continent: "Asia", pm25: 65.0 },
  { city: "Lucknow", country: "India", continent: "Asia", pm25: 85.0 },
  { city: "Kanpur", country: "India", continent: "Asia", pm25: 90.0 },
  { city: "Nagpur", country: "India", continent: "Asia", pm25: 45.0 },
  { city: "Indore", country: "India", continent: "Asia", pm25: 48.0 },
  { city: "Surat", country: "India", continent: "Asia", pm25: 50.0 },
  { city: "Varanasi", country: "India", continent: "Asia", pm25: 75.0 },
  { city: "Patna", country: "India", continent: "Asia", pm25: 95.0 },
  { city: "Gurgaon", country: "India", continent: "Asia", pm25: 105.0 },
  { city: "Noida", country: "India", continent: "Asia", pm25: 100.0 },
  { city: "Chandigarh", country: "India", continent: "Asia", pm25: 52.0 },
  { city: "Kochi", country: "India", continent: "Asia", pm25: 22.0 },

  // Other South Asia
  { city: "Dhaka", country: "Bangladesh", continent: "Asia", pm25: 78.0 },
  { city: "Chittagong", country: "Bangladesh", continent: "Asia", pm25: 65.0 },
  { city: "Khulna", country: "Bangladesh", continent: "Asia", pm25: 55.0 },
  { city: "Sylhet", country: "Bangladesh", continent: "Asia", pm25: 50.0 },
  { city: "Karachi", country: "Pakistan", continent: "Asia", pm25: 68.0 },
  { city: "Lahore", country: "Pakistan", continent: "Asia", pm25: 97.0 },
  { city: "Islamabad", country: "Pakistan", continent: "Asia", pm25: 55.0 },
  { city: "Faisalabad", country: "Pakistan", continent: "Asia", pm25: 75.0 },
  { city: "Rawalpindi", country: "Pakistan", continent: "Asia", pm25: 58.0 },
  { city: "Multan", country: "Pakistan", continent: "Asia", pm25: 80.0 },
  { city: "Peshawar", country: "Pakistan", continent: "Asia", pm25: 70.0 },
  { city: "Kathmandu", country: "Nepal", continent: "Asia", pm25: 46.0 },
  { city: "Pokhara", country: "Nepal", continent: "Asia", pm25: 35.0 },
  { city: "Biratnagar", country: "Nepal", continent: "Asia", pm25: 55.0 },
  { city: "Colombo", country: "Sri Lanka", continent: "Asia", pm25: 22.0 },
  { city: "Kandy", country: "Sri Lanka", continent: "Asia", pm25: 18.0 },
  { city: "Galle", country: "Sri Lanka", continent: "Asia", pm25: 15.0 },
  { city: "Male", country: "Maldives", continent: "Asia", pm25: 12.0 },

  // Central Asia
  { city: "Ulaanbaatar", country: "Mongolia", continent: "Asia", pm25: 75.0 },
  { city: "Almaty", country: "Kazakhstan", continent: "Asia", pm25: 28.0 },
  { city: "Nur-Sultan", country: "Kazakhstan", continent: "Asia", pm25: 22.0 },
  { city: "Tashkent", country: "Uzbekistan", continent: "Asia", pm25: 32.0 },
  { city: "Bishkek", country: "Kyrgyzstan", continent: "Asia", pm25: 35.0 },
  { city: "Dushanbe", country: "Tajikistan", continent: "Asia", pm25: 38.0 },
  { city: "Ashgabat", country: "Turkmenistan", continent: "Asia", pm25: 40.0 },

  // ============ MIDDLE EAST ============
  // UAE (5+ cities)
  { city: "Dubai", country: "UAE", continent: "Middle East", pm25: 40.5 },
  { city: "Abu Dhabi", country: "UAE", continent: "Middle East", pm25: 42.0 },
  { city: "Sharjah", country: "UAE", continent: "Middle East", pm25: 44.0 },
  { city: "Al Ain", country: "UAE", continent: "Middle East", pm25: 38.0 },
  { city: "Ajman", country: "UAE", continent: "Middle East", pm25: 43.0 },

  // Saudi Arabia (6+ cities)
  { city: "Riyadh", country: "Saudi Arabia", continent: "Middle East", pm25: 60.0 },
  { city: "Jeddah", country: "Saudi Arabia", continent: "Middle East", pm25: 45.0 },
  { city: "Mecca", country: "Saudi Arabia", continent: "Middle East", pm25: 48.0 },
  { city: "Medina", country: "Saudi Arabia", continent: "Middle East", pm25: 42.0 },
  { city: "Dammam", country: "Saudi Arabia", continent: "Middle East", pm25: 55.0 },
  { city: "Khobar", country: "Saudi Arabia", continent: "Middle East", pm25: 52.0 },

  // Other Middle East
  { city: "Doha", country: "Qatar", continent: "Middle East", pm25: 48.0 },
  { city: "Kuwait City", country: "Kuwait", continent: "Middle East", pm25: 55.0 },
  { city: "Muscat", country: "Oman", continent: "Middle East", pm25: 42.0 },
  { city: "Salalah", country: "Oman", continent: "Middle East", pm25: 28.0 },
  { city: "Manama", country: "Bahrain", continent: "Middle East", pm25: 52.0 },
  { city: "Tehran", country: "Iran", continent: "Middle East", pm25: 32.0 },
  { city: "Isfahan", country: "Iran", continent: "Middle East", pm25: 35.0 },
  { city: "Shiraz", country: "Iran", continent: "Middle East", pm25: 28.0 },
  { city: "Tabriz", country: "Iran", continent: "Middle East", pm25: 30.0 },
  { city: "Mashhad", country: "Iran", continent: "Middle East", pm25: 38.0 },
  { city: "Baghdad", country: "Iraq", continent: "Middle East", pm25: 55.0 },
  { city: "Basra", country: "Iraq", continent: "Middle East", pm25: 48.0 },
  { city: "Erbil", country: "Iraq", continent: "Middle East", pm25: 42.0 },
  { city: "Amman", country: "Jordan", continent: "Middle East", pm25: 28.0 },
  { city: "Aqaba", country: "Jordan", continent: "Middle East", pm25: 22.0 },
  { city: "Beirut", country: "Lebanon", continent: "Middle East", pm25: 22.5 },
  { city: "Tripoli", country: "Lebanon", continent: "Middle East", pm25: 25.0 },
  { city: "Tel Aviv", country: "Israel", continent: "Middle East", pm25: 18.0 },
  { city: "Jerusalem", country: "Israel", continent: "Middle East", pm25: 20.0 },
  { city: "Haifa", country: "Israel", continent: "Middle East", pm25: 19.5 },
  { city: "Damascus", country: "Syria", continent: "Middle East", pm25: 35.0 },
  { city: "Aleppo", country: "Syria", continent: "Middle East", pm25: 38.0 },
  { city: "Sana'a", country: "Yemen", continent: "Middle East", pm25: 45.0 },

  // ============ AFRICA ============
  // Egypt (5+ cities)
  { city: "Cairo", country: "Egypt", continent: "Africa", pm25: 84.0 },
  { city: "Alexandria", country: "Egypt", continent: "Africa", pm25: 55.0 },
  { city: "Giza", country: "Egypt", continent: "Africa", pm25: 80.0 },
  { city: "Luxor", country: "Egypt", continent: "Africa", pm25: 45.0 },
  { city: "Aswan", country: "Egypt", continent: "Africa", pm25: 40.0 },
  { city: "Sharm El Sheikh", country: "Egypt", continent: "Africa", pm25: 25.0 },

  // Nigeria (6+ cities)
  { city: "Lagos", country: "Nigeria", continent: "Africa", pm25: 68.0 },
  { city: "Abuja", country: "Nigeria", continent: "Africa", pm25: 35.0 },
  { city: "Kano", country: "Nigeria", continent: "Africa", pm25: 55.0 },
  { city: "Ibadan", country: "Nigeria", continent: "Africa", pm25: 45.0 },
  { city: "Port Harcourt", country: "Nigeria", continent: "Africa", pm25: 50.0 },
  { city: "Benin City", country: "Nigeria", continent: "Africa", pm25: 42.0 },

  // South Africa (6+ cities)
  { city: "Johannesburg", country: "South Africa", continent: "Africa", pm25: 21.0 },
  { city: "Cape Town", country: "South Africa", continent: "Africa", pm25: 12.5 },
  { city: "Durban", country: "South Africa", continent: "Africa", pm25: 18.0 },
  { city: "Pretoria", country: "South Africa", continent: "Africa", pm25: 22.0 },
  { city: "Port Elizabeth", country: "South Africa", continent: "Africa", pm25: 14.0 },
  { city: "Bloemfontein", country: "South Africa", continent: "Africa", pm25: 16.0 },

  // East Africa
  { city: "Nairobi", country: "Kenya", continent: "Africa", pm25: 18.0 },
  { city: "Mombasa", country: "Kenya", continent: "Africa", pm25: 22.0 },
  { city: "Kisumu", country: "Kenya", continent: "Africa", pm25: 20.0 },
  { city: "Nakuru", country: "Kenya", continent: "Africa", pm25: 19.0 },
  { city: "Addis Ababa", country: "Ethiopia", continent: "Africa", pm25: 25.0 },
  { city: "Dire Dawa", country: "Ethiopia", continent: "Africa", pm25: 22.0 },
  { city: "Bahir Dar", country: "Ethiopia", continent: "Africa", pm25: 20.0 },
  { city: "Dar es Salaam", country: "Tanzania", continent: "Africa", pm25: 22.0 },
  { city: "Dodoma", country: "Tanzania", continent: "Africa", pm25: 18.0 },
  { city: "Zanzibar", country: "Tanzania", continent: "Africa", pm25: 15.0 },
  { city: "Arusha", country: "Tanzania", continent: "Africa", pm25: 16.0 },
  { city: "Kampala", country: "Uganda", continent: "Africa", pm25: 35.0 },
  { city: "Entebbe", country: "Uganda", continent: "Africa", pm25: 28.0 },
  { city: "Kigali", country: "Rwanda", continent: "Africa", pm25: 35.0 },
  { city: "Bujumbura", country: "Burundi", continent: "Africa", pm25: 32.0 },

  // West Africa
  { city: "Accra", country: "Ghana", continent: "Africa", pm25: 32.0 },
  { city: "Kumasi", country: "Ghana", continent: "Africa", pm25: 38.0 },
  { city: "Tamale", country: "Ghana", continent: "Africa", pm25: 45.0 },
  { city: "Dakar", country: "Senegal", continent: "Africa", pm25: 45.0 },
  { city: "Thies", country: "Senegal", continent: "Africa", pm25: 42.0 },
  { city: "Abidjan", country: "Ivory Coast", continent: "Africa", pm25: 40.0 },
  { city: "Yamoussoukro", country: "Ivory Coast", continent: "Africa", pm25: 35.0 },
  { city: "Bamako", country: "Mali", continent: "Africa", pm25: 50.0 },
  { city: "Ouagadougou", country: "Burkina Faso", continent: "Africa", pm25: 48.0 },
  { city: "Niamey", country: "Niger", continent: "Africa", pm25: 55.0 },
  { city: "Conakry", country: "Guinea", continent: "Africa", pm25: 42.0 },
  { city: "Freetown", country: "Sierra Leone", continent: "Africa", pm25: 38.0 },
  { city: "Monrovia", country: "Liberia", continent: "Africa", pm25: 35.0 },
  { city: "Lome", country: "Togo", continent: "Africa", pm25: 40.0 },
  { city: "Cotonou", country: "Benin", continent: "Africa", pm25: 42.0 },

  // North Africa
  { city: "Casablanca", country: "Morocco", continent: "Africa", pm25: 18.5 },
  { city: "Rabat", country: "Morocco", continent: "Africa", pm25: 16.0 },
  { city: "Marrakech", country: "Morocco", continent: "Africa", pm25: 20.0 },
  { city: "Fes", country: "Morocco", continent: "Africa", pm25: 22.0 },
  { city: "Tangier", country: "Morocco", continent: "Africa", pm25: 17.0 },
  { city: "Tunis", country: "Tunisia", continent: "Africa", pm25: 22.0 },
  { city: "Sfax", country: "Tunisia", continent: "Africa", pm25: 25.0 },
  { city: "Sousse", country: "Tunisia", continent: "Africa", pm25: 20.0 },
  { city: "Algiers", country: "Algeria", continent: "Africa", pm25: 25.0 },
  { city: "Oran", country: "Algeria", continent: "Africa", pm25: 22.0 },
  { city: "Constantine", country: "Algeria", continent: "Africa", pm25: 28.0 },
  { city: "Tripoli", country: "Libya", continent: "Africa", pm25: 45.0 },
  { city: "Benghazi", country: "Libya", continent: "Africa", pm25: 42.0 },

  // Central Africa
  { city: "Kinshasa", country: "DR Congo", continent: "Africa", pm25: 42.0 },
  { city: "Lubumbashi", country: "DR Congo", continent: "Africa", pm25: 38.0 },
  { city: "Brazzaville", country: "Congo", continent: "Africa", pm25: 35.0 },
  { city: "Douala", country: "Cameroon", continent: "Africa", pm25: 40.0 },
  { city: "Yaounde", country: "Cameroon", continent: "Africa", pm25: 35.0 },
  { city: "Libreville", country: "Gabon", continent: "Africa", pm25: 28.0 },
  { city: "Bangui", country: "CAR", continent: "Africa", pm25: 35.0 },
  { city: "N'Djamena", country: "Chad", continent: "Africa", pm25: 55.0 },

  // Southern Africa
  { city: "Lusaka", country: "Zambia", continent: "Africa", pm25: 18.0 },
  { city: "Livingstone", country: "Zambia", continent: "Africa", pm25: 14.0 },
  { city: "Harare", country: "Zimbabwe", continent: "Africa", pm25: 25.0 },
  { city: "Bulawayo", country: "Zimbabwe", continent: "Africa", pm25: 22.0 },
  { city: "Maputo", country: "Mozambique", continent: "Africa", pm25: 15.0 },
  { city: "Beira", country: "Mozambique", continent: "Africa", pm25: 18.0 },
  { city: "Windhoek", country: "Namibia", continent: "Africa", pm25: 10.0 },
  { city: "Swakopmund", country: "Namibia", continent: "Africa", pm25: 8.0 },
  { city: "Gaborone", country: "Botswana", continent: "Africa", pm25: 15.0 },
  { city: "Luanda", country: "Angola", continent: "Africa", pm25: 30.0 },
  { city: "Benguela", country: "Angola", continent: "Africa", pm25: 25.0 },
  { city: "Antananarivo", country: "Madagascar", continent: "Africa", pm25: 28.0 },
  { city: "Port Louis", country: "Mauritius", continent: "Africa", pm25: 12.0 },

  // ============ SOUTH AMERICA ============
  // Brazil (10+ cities)
  { city: "Sao Paulo", country: "Brazil", continent: "South America", pm25: 16.5 },
  { city: "Rio de Janeiro", country: "Brazil", continent: "South America", pm25: 14.0 },
  { city: "Brasilia", country: "Brazil", continent: "South America", pm25: 10.0 },
  { city: "Salvador", country: "Brazil", continent: "South America", pm25: 12.0 },
  { city: "Fortaleza", country: "Brazil", continent: "South America", pm25: 13.0 },
  { city: "Belo Horizonte", country: "Brazil", continent: "South America", pm25: 15.0 },
  { city: "Manaus", country: "Brazil", continent: "South America", pm25: 18.0 },
  { city: "Curitiba", country: "Brazil", continent: "South America", pm25: 11.0 },
  { city: "Recife", country: "Brazil", continent: "South America", pm25: 13.5 },
  { city: "Porto Alegre", country: "Brazil", continent: "South America", pm25: 12.5 },
  { city: "Belem", country: "Brazil", continent: "South America", pm25: 15.0 },
  { city: "Goiania", country: "Brazil", continent: "South America", pm25: 14.0 },

  // Argentina (6+ cities)
  { city: "Buenos Aires", country: "Argentina", continent: "South America", pm25: 14.5 },
  { city: "Cordoba", country: "Argentina", continent: "South America", pm25: 12.0 },
  { city: "Rosario", country: "Argentina", continent: "South America", pm25: 13.0 },
  { city: "Mendoza", country: "Argentina", continent: "South America", pm25: 11.0 },
  { city: "Tucuman", country: "Argentina", continent: "South America", pm25: 14.0 },
  { city: "Mar del Plata", country: "Argentina", continent: "South America", pm25: 9.0 },
  { city: "Salta", country: "Argentina", continent: "South America", pm25: 12.5 },

  // Chile (5+ cities)
  { city: "Santiago", country: "Chile", continent: "South America", pm25: 22.0 },
  { city: "Valparaiso", country: "Chile", continent: "South America", pm25: 15.0 },
  { city: "Concepcion", country: "Chile", continent: "South America", pm25: 18.0 },
  { city: "Temuco", country: "Chile", continent: "South America", pm25: 28.0 },
  { city: "Antofagasta", country: "Chile", continent: "South America", pm25: 14.0 },
  { city: "Vina del Mar", country: "Chile", continent: "South America", pm25: 14.5 },

  // Colombia (6+ cities)
  { city: "Bogota", country: "Colombia", continent: "South America", pm25: 15.0 },
  { city: "Medellin", country: "Colombia", continent: "South America", pm25: 18.5 },
  { city: "Cali", country: "Colombia", continent: "South America", pm25: 16.0 },
  { city: "Barranquilla", country: "Colombia", continent: "South America", pm25: 22.0 },
  { city: "Cartagena", country: "Colombia", continent: "South America", pm25: 18.0 },
  { city: "Bucaramanga", country: "Colombia", continent: "South America", pm25: 14.0 },

  // Peru (5+ cities)
  { city: "Lima", country: "Peru", continent: "South America", pm25: 26.0 },
  { city: "Arequipa", country: "Peru", continent: "South America", pm25: 20.0 },
  { city: "Trujillo", country: "Peru", continent: "South America", pm25: 22.0 },
  { city: "Cusco", country: "Peru", continent: "South America", pm25: 18.0 },
  { city: "Chiclayo", country: "Peru", continent: "South America", pm25: 24.0 },

  // Other South America
  { city: "Quito", country: "Ecuador", continent: "South America", pm25: 13.0 },
  { city: "Guayaquil", country: "Ecuador", continent: "South America", pm25: 16.0 },
  { city: "Cuenca", country: "Ecuador", continent: "South America", pm25: 12.0 },
  { city: "Caracas", country: "Venezuela", continent: "South America", pm25: 14.0 },
  { city: "Maracaibo", country: "Venezuela", continent: "South America", pm25: 18.0 },
  { city: "Valencia", country: "Venezuela", continent: "South America", pm25: 16.0 },
  { city: "Montevideo", country: "Uruguay", continent: "South America", pm25: 9.5 },
  { city: "Punta del Este", country: "Uruguay", continent: "South America", pm25: 7.0 },
  { city: "Asuncion", country: "Paraguay", continent: "South America", pm25: 14.0 },
  { city: "Ciudad del Este", country: "Paraguay", continent: "South America", pm25: 16.0 },
  { city: "La Paz", country: "Bolivia", continent: "South America", pm25: 22.0 },
  { city: "Santa Cruz", country: "Bolivia", continent: "South America", pm25: 20.0 },
  { city: "Cochabamba", country: "Bolivia", continent: "South America", pm25: 25.0 },
  { city: "Georgetown", country: "Guyana", continent: "South America", pm25: 18.0 },
  { city: "Paramaribo", country: "Suriname", continent: "South America", pm25: 16.0 },

  // ============ OCEANIA ============
  // Australia (10+ cities)
  { city: "Sydney", country: "Australia", continent: "Oceania", pm25: 7.5 },
  { city: "Melbourne", country: "Australia", continent: "Oceania", pm25: 7.0 },
  { city: "Brisbane", country: "Australia", continent: "Oceania", pm25: 7.2 },
  { city: "Perth", country: "Australia", continent: "Oceania", pm25: 6.5 },
  { city: "Adelaide", country: "Australia", continent: "Oceania", pm25: 6.8 },
  { city: "Gold Coast", country: "Australia", continent: "Oceania", pm25: 6.5 },
  { city: "Canberra", country: "Australia", continent: "Oceania", pm25: 6.0 },
  { city: "Newcastle", country: "Australia", continent: "Oceania", pm25: 7.0 },
  { city: "Hobart", country: "Australia", continent: "Oceania", pm25: 5.5 },
  { city: "Darwin", country: "Australia", continent: "Oceania", pm25: 8.0 },
  { city: "Cairns", country: "Australia", continent: "Oceania", pm25: 6.2 },
  { city: "Wollongong", country: "Australia", continent: "Oceania", pm25: 7.2 },

  // New Zealand (5+ cities)
  { city: "Auckland", country: "New Zealand", continent: "Oceania", pm25: 5.5 },
  { city: "Wellington", country: "New Zealand", continent: "Oceania", pm25: 4.8 },
  { city: "Christchurch", country: "New Zealand", continent: "Oceania", pm25: 6.0 },
  { city: "Hamilton", country: "New Zealand", continent: "Oceania", pm25: 5.2 },
  { city: "Dunedin", country: "New Zealand", continent: "Oceania", pm25: 5.0 },
  { city: "Queenstown", country: "New Zealand", continent: "Oceania", pm25: 4.5 },

  // Pacific Islands
  { city: "Suva", country: "Fiji", continent: "Oceania", pm25: 8.0 },
  { city: "Nadi", country: "Fiji", continent: "Oceania", pm25: 7.5 },
  { city: "Port Moresby", country: "Papua New Guinea", continent: "Oceania", pm25: 14.0 },
  { city: "Lae", country: "Papua New Guinea", continent: "Oceania", pm25: 15.0 },
  { city: "Noumea", country: "New Caledonia", continent: "Oceania", pm25: 8.0 },
  { city: "Papeete", country: "French Polynesia", continent: "Oceania", pm25: 6.0 },
  { city: "Apia", country: "Samoa", continent: "Oceania", pm25: 7.0 },
  { city: "Nuku'alofa", country: "Tonga", continent: "Oceania", pm25: 6.5 },
  { city: "Port Vila", country: "Vanuatu", continent: "Oceania", pm25: 8.5 },
  { city: "Honiara", country: "Solomon Islands", continent: "Oceania", pm25: 10.0 },
  { city: "Tarawa", country: "Kiribati", continent: "Oceania", pm25: 6.0 },
  { city: "Majuro", country: "Marshall Islands", continent: "Oceania", pm25: 5.5 },
  { city: "Koror", country: "Palau", continent: "Oceania", pm25: 6.0 },
  { city: "Hagåtña", country: "Guam", continent: "Oceania", pm25: 7.0 },
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
  score: number // 0-100 composite (air + noise)
  airScore: number // 0-100 PM2.5-only
  noiseScore: number // 0-100 self-reported noise
  noiseCategory: string
  noiseImpact: string
  category: string
  healthImpact: string
  whoGuideline: number // 5 ug/m3
  ratio: number // how many times above WHO guideline
}

export type NoiseLevel = "very-quiet" | "quiet" | "moderate" | "loud" | "very-loud"

/**
 * Score noise pollution based on WHO Environmental Noise Guidelines (2018).
 * WHO recommends < 53 dB Lden for road traffic noise to prevent
 * cardiovascular disease, sleep disturbance, and cognitive impairment.
 * Self-reported categories map to typical environmental noise ranges.
 */
function scoreNoise(level: NoiseLevel): { score: number; category: string; impact: string } {
  switch (level) {
    case "very-quiet":
      return {
        score: 100,
        category: "Very Quiet",
        impact: "Excellent acoustic environment. Below WHO thresholds for noise-related health effects.",
      }
    case "quiet":
      return {
        score: 85,
        category: "Quiet",
        impact: "Acceptable noise levels with minimal health impact.",
      }
    case "moderate":
      return {
        score: 60,
        category: "Moderate",
        impact: "Approaching WHO threshold (53 dB). Occasional sleep or focus disturbance possible.",
      }
    case "loud":
      return {
        score: 30,
        category: "Loud",
        impact: "Above WHO guideline. Chronic exposure linked to elevated cardiovascular disease risk and sleep disruption.",
      }
    case "very-loud":
      return {
        score: 10,
        category: "Very Loud",
        impact: "Well above WHO guideline. Significant risk for hypertension, sleep disorders, and cognitive impairment in children.",
      }
  }
}

/**
 * Score air quality based on WHO AQG 2021 guidelines.
 * WHO annual PM2.5 guideline: 5 ug/m3
 */
export function scoreAirQuality(cityData: CityAQData, noiseLevel: NoiseLevel = "moderate"): AirQualityResult {
  const pm25 = cityData.pm25
  const whoGuideline = 5

  let airScore: number
  let category: string
  let healthImpact: string

  if (pm25 <= 5) {
    airScore = 100
    category = "Excellent"
    healthImpact =
      "Air quality meets WHO guidelines. Minimal risk to health from air pollution."
  } else if (pm25 <= 10) {
    // Falls from 100 at the WHO guideline to 70 at interim target 4, with no cliff just above 5
    airScore = 100 - ((pm25 - 5) / 5) * 30
    category = "Good"
    healthImpact =
      "Air quality is acceptable. Sensitive individuals may experience minor issues with prolonged outdoor exposure."
  } else if (pm25 <= 15) {
    airScore = 70 - ((pm25 - 10) / 5) * 20
    category = "Moderate"
    healthImpact =
      "Some health risk, especially for children, elderly, and those with respiratory conditions. Consider limiting prolonged outdoor exertion."
  } else if (pm25 <= 25) {
    airScore = 50 - ((pm25 - 15) / 10) * 20
    category = "Unhealthy for Sensitive Groups"
    healthImpact =
      "Increased risk of respiratory symptoms. People with asthma, heart disease, and children should limit prolonged outdoor activity."
  } else if (pm25 <= 35) {
    airScore = 30 - ((pm25 - 25) / 10) * 15
    category = "Unhealthy"
    healthImpact =
      "Significant health risk. Everyone may begin to experience health effects. Use air purifiers indoors if possible."
  } else if (pm25 <= 50) {
    airScore = 15 - ((pm25 - 35) / 15) * 10
    category = "Very Unhealthy"
    healthImpact =
      "Serious health effects for everyone. Avoid outdoor exercise. Use N95 masks outdoors and HEPA air purifiers indoors."
  } else {
    airScore = Math.max(2, 5 - ((pm25 - 50) / 50) * 5)
    category = "Hazardous"
    healthImpact =
      "Emergency-level air pollution. Stay indoors with air filtration. Long-term exposure significantly increases cardiovascular and respiratory disease risk."
  }

  airScore = Math.round(Math.max(2, Math.min(100, airScore)))
  const noise = scoreNoise(noiseLevel)
  // Composite: air 70%, noise 30%
  const score = Math.round(airScore * 0.7 + noise.score * 0.3)

  return {
    city: cityData,
    score,
    airScore,
    noiseScore: noise.score,
    noiseCategory: noise.category,
    noiseImpact: noise.impact,
    category,
    healthImpact,
    whoGuideline,
    ratio: Math.round((pm25 / whoGuideline) * 10) / 10,
  }
}
