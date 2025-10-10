import asiaData from './asia.json'
import middleEastData from './middleEast.json'
import pacificIslandsData from './pacificIslands.json'

export interface CountrySection {
  section_name: string
  title: string
  content: any
  images?: any[]
  order_index: number
  is_enabled: boolean
}

export interface CountryHeroImage {
  image_url: string
  alt_text: string
  caption: string
  order_index: number
}

export interface EssentialTip {
  icon: string
  title: string
  note: string
}

export interface TravelPurpose {
  name: string
  display_name: string
  percentage: number
  color: string
}

export interface Attraction {
  name: string
  description: string
  category: string
  type: string
  image_url?: string
  order_index: number
}

export interface FAQ {
  question: string
  answer: string
}

export interface ContactInfo {
  email: string
  phone: string
  whatsapp?: string
  address?: string
}

export interface CountryData {
  id: string
  name: string
  slug: string
  region: string
  capital?: string
  currency?: string
  climate?: string
  best_season?: string
  languages?: string[]
  description?: string
  is_popular?: boolean
  annual_visitors?: number
  gender_male_percentage?: number
  gender_female_percentage?: number
  speciality?: string
  culture?: string
  fallback_image?: string
  hero_images?: CountryHeroImage[]
  sections?: CountrySection[]
  essential_tips?: EssentialTip[]
  travel_purposes?: TravelPurpose[]
  attractions?: Attraction[]
  faqs?: FAQ[]
  contact_info?: ContactInfo
}

export interface RegionData {
  region: string
  countries: CountryData[]
}

// All region data
const allRegionsData: RegionData[] = [
  asiaData as RegionData,
  middleEastData as RegionData,
  pacificIslandsData as RegionData
]

// All countries combined
export const allCountries: CountryData[] = allRegionsData.flatMap(regionData => regionData.countries)

// Get countries by region
export const getCountriesByRegion = (region: string): CountryData[] => {
  const regionData = allRegionsData.find(r => r.region === region)
  return regionData?.countries || []
}

// Get country by slug
export const getCountryBySlug = (slug: string): CountryData | undefined => {
  return allCountries.find(country => country.slug === slug)
}

// Get popular countries
export const getPopularCountries = (): CountryData[] => {
  return allCountries.filter(country => country.is_popular)
}

// Get basic country info (without extended data)
export const getBasicCountryInfo = (slug: string) => {
  const country = getCountryBySlug(slug)
  if (!country) return null
  
  return {
    id: country.id,
    name: country.name,
    slug: country.slug,
    region: country.region,
    capital: country.capital,
    currency: country.currency,
    climate: country.climate,
    best_season: country.best_season,
    languages: country.languages,
    description: country.description,
    is_popular: country.is_popular
  }
}
