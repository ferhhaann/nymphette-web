import { useMemo, useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface RegionData {
  name: string
  path: string
  aliases: string[]
}

interface CountryData {
  name: string
  region: string
  aliases: string[]
  slug: string
}

export const useSearchData = () => {
  const [allCountries, setAllCountries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Static regions data (these are UI routes, not database-driven)
  const availableRegions: RegionData[] = useMemo(() => [
    { name: "asia", path: "/regions/asia", aliases: ["asian", "orient", "far east"] },
    { name: "europe", path: "/regions/europe", aliases: ["european", "eu"] },
    { name: "africa", path: "/regions/africa", aliases: ["african"] },
    { name: "americas", path: "/regions/americas", aliases: ["america", "north america", "south america"] },
    { name: "middle east", path: "/regions/middle-east", aliases: ["middle-east", "middleeast"] },
    { name: "pacific", path: "/regions/pacific", aliases: ["oceania", "australia"] }
  ], [])

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true)
        
        if (!supabase) {
          console.warn('Supabase client not available')
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('countries')
          .select('*')
          .order('name', { ascending: true })
        
        if (error) {
          console.error('Supabase error:', error)
          setAllCountries([])
        } else {
          console.log('Loaded countries from database:', data?.length || 0)
          setAllCountries(data || [])
        }
      } catch (error) {
        console.error('Error fetching countries:', error)
        setAllCountries([])
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  // Dynamic countries data from database
  const availableCountries: CountryData[] = useMemo(() => {
    if (!allCountries.length) return []

    return allCountries.map(country => {
      // Generate aliases based on country name
      const baseAliases = []
      
      // Add shortened versions and common alternatives
      if (country.name.toLowerCase() === 'thailand') {
        baseAliases.push('thai')
      } else if (country.name.toLowerCase() === 'japan') {
        baseAliases.push('japanese', 'nippon')
      } else if (country.name.toLowerCase() === 'indonesia') {
        baseAliases.push('indonesian')
      } else if (country.name.toLowerCase() === 'china') {
        baseAliases.push('chinese')
      } else if (country.name.toLowerCase() === 'kazakhstan') {
        baseAliases.push('kazakh')
      } else if (country.name.toLowerCase() === 'malaysia') {
        baseAliases.push('malaysian')
      } else if (country.name.toLowerCase() === 'philippines') {
        baseAliases.push('filipino', 'ph')
      } else if (country.name.toLowerCase() === 'south korea') {
        baseAliases.push('korea', 'korean', 'south-korea')
      } else if (country.name.toLowerCase() === 'vietnam') {
        baseAliases.push('vietnamese')
      } else if (country.name.toLowerCase() === 'singapore') {
        baseAliases.push('singaporean')
      } else if (country.name.toLowerCase() === 'cambodia') {
        baseAliases.push('cambodian')
      } else if (country.name.toLowerCase() === 'myanmar') {
        baseAliases.push('burma', 'burmese')
      } else if (country.name.toLowerCase() === 'laos') {
        baseAliases.push('lao', 'laotian')
      } else if (country.name.toLowerCase() === 'taiwan') {
        baseAliases.push('taiwanese')
      } else if (country.name.toLowerCase() === 'nepal') {
        baseAliases.push('nepalese')
      } else if (country.name.toLowerCase() === 'sri lanka') {
        baseAliases.push('sri-lanka', 'srilanka', 'ceylon')
      } else if (country.name.toLowerCase() === 'maldives') {
        baseAliases.push('maldivian')
      } else if (country.name.toLowerCase() === 'uae') {
        baseAliases.push('dubai', 'emirates', 'united arab emirates')
      } else if (country.name.toLowerCase() === 'usa') {
        baseAliases.push('america', 'united states', 'us')
      } else if (country.name.toLowerCase() === 'kenya') {
        baseAliases.push('kenyan')
      } else {
        // For other countries, add basic nationality suffix
        const countryName = country.name.toLowerCase()
        if (countryName.endsWith('a')) {
          baseAliases.push(countryName + 'n')
        } else if (countryName.endsWith('y')) {
          baseAliases.push(countryName.slice(0, -1) + 'ian')
        } else {
          baseAliases.push(countryName + 'an')
        }
      }

      // Map region to URL format
      const regionPath = country.region.toLowerCase().replace(/\s+/g, '-')

      return {
        name: country.name.toLowerCase(),
        region: regionPath,
        aliases: baseAliases,
        slug: country.slug
      }
    })
  }, [allCountries])

  const searchCountry = (query: string): CountryData | null => {
    const lowerQuery = query.toLowerCase().trim()
    
    return availableCountries.find(country => 
      country.name === lowerQuery || country.aliases.some(alias => alias === lowerQuery)
    ) || null
  }

  const searchRegion = (query: string): RegionData | null => {
    const lowerQuery = query.toLowerCase().trim()
    
    return availableRegions.find(region => 
      region.name === lowerQuery || region.aliases.some(alias => alias === lowerQuery)
    ) || null
  }

  return {
    availableRegions,
    availableCountries,
    searchCountry,
    searchRegion,
    loading
  }
}