import { useMemo } from 'react'
import { 
  getCountriesByRegion, 
  getCountryBySlug, 
  allCountries, 
  getBasicCountryInfo,
  type CountryData 
} from '@/data/countries'

export const useOptimizedCountries = (region?: string) => {
  const data = useMemo(() => {
    if (region) {
      return getCountriesByRegion(region)
    }
    return allCountries
  }, [region])

  return {
    data,
    loading: false,
    error: null
  }
}

export const useOptimizedCountryBySlug = (slug: string) => {
  const data = useMemo(() => {
    return getCountryBySlug(slug)
  }, [slug])

  return {
    data,
    loading: false,
    error: null
  }
}