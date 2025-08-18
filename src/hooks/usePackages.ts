import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured, type DatabasePackage } from '@/lib/supabase'
import { packagesData, type TravelPackage } from '@/data/packagesData'
import type { TravelPackage as TravelPackageType } from '@/data/packagesData'

export const usePackages = (region?: string) => {
  const [packages, setPackages] = useState<TravelPackageType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPackages()
  }, [region])

  const loadPackages = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // If Supabase is not configured, use local JSON data
      if (!isSupabaseConfigured || !supabase) {
        const allRegions = Object.values(packagesData).flat()
        const filteredPackages = region 
          ? allRegions.filter(pkg => pkg.region === region)
          : allRegions
        setPackages(filteredPackages)
        setLoading(false)
        return
      }
      
      let query = supabase.from('packages').select('*')
      
      if (region) {
        query = query.eq('region', region)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw error
      
      // Transform database packages to TravelPackage format
      const transformedPackages: TravelPackageType[] = (data || []).map(transformDatabasePackage)
      setPackages(transformedPackages)
      
    } catch (err: any) {
      setError(err.message)
      console.error('Error loading packages:', err)
    } finally {
      setLoading(false)
    }
  }

  return { packages, loading, error, refetch: loadPackages }
}

export const usePackageById = (packageId: string) => {
  const [packageData, setPackageData] = useState<TravelPackageType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPackage()
  }, [packageId])

  const loadPackage = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // If Supabase is not configured, use local JSON data
      if (!isSupabaseConfigured || !supabase) {
        const allRegions = Object.values(packagesData).flat()
        const foundPackage = allRegions.find(pkg => pkg.id === packageId)
        setPackageData(foundPackage || null)
        setLoading(false)
        return
      }
      
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('id', packageId)
        .single()
      
      if (error) throw error
      
      if (data) {
        setPackageData(transformDatabasePackage(data))
      } else {
        setPackageData(null)
      }
      
    } catch (err: any) {
      setError(err.message)
      console.error('Error loading package:', err)
    } finally {
      setLoading(false)
    }
  }

  return { packageData, loading, error, refetch: loadPackage }
}

// Transform database package to TravelPackage format
const transformDatabasePackage = (dbPackage: DatabasePackage): TravelPackageType => {
  return {
    id: dbPackage.id,
    title: dbPackage.title,
    country: dbPackage.country,
    countrySlug: dbPackage.country_slug,
    region: dbPackage.region,
    duration: dbPackage.duration,
    price: dbPackage.price,
    originalPrice: dbPackage.original_price,
    rating: dbPackage.rating,
    reviews: dbPackage.reviews,
    image: dbPackage.image,
    highlights: dbPackage.highlights,
    inclusions: dbPackage.inclusions,
    exclusions: dbPackage.exclusions,
    category: dbPackage.category,
    bestTime: dbPackage.best_time,
    groupSize: dbPackage.group_size,
    overview: dbPackage.overview_section_title ? {
      sectionTitle: dbPackage.overview_section_title,
      description: dbPackage.overview_description || '',
      highlightsLabel: dbPackage.overview_highlights_label || 'Package Highlights',
      highlightsBadgeVariant: dbPackage.overview_badge_variant || 'outline',
      highlightsBadgeStyle: dbPackage.overview_badge_style || 'border-primary text-primary'
    } : undefined,
    itinerary: dbPackage.itinerary
  }
}