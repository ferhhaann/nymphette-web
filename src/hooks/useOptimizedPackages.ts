import { useMemo } from 'react'
import { supabase, isSupabaseConfigured, type DatabasePackage } from '@/lib/supabase'
import { packagesData, type TravelPackage } from '@/data/packagesData'
import type { TravelPackage as TravelPackageType } from '@/data/packagesData'
import { useOptimizedQuery } from './useOptimizedQuery'

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
    featured: dbPackage.featured || false,
    overview: dbPackage.overview_section_title ? {
      sectionTitle: dbPackage.overview_section_title,
      description: dbPackage.overview_description || '',
      highlightsLabel: dbPackage.overview_highlights_label || 'Package Highlights',
      highlightsBadgeVariant: dbPackage.overview_badge_variant || 'outline',
      highlightsBadgeStyle: dbPackage.overview_badge_style || 'border-primary text-primary'
    } : undefined,
    itinerary: Array.isArray(dbPackage.itinerary) 
      ? dbPackage.itinerary 
      : (typeof dbPackage.itinerary === 'string' 
          ? JSON.parse(dbPackage.itinerary) 
          : dbPackage.itinerary || [])
  }
}

export const useOptimizedPackages = (region?: string) => {
  const queryKey = useMemo(() => ['packages', region].filter(Boolean), [region])
  
  const queryFn = async (): Promise<TravelPackageType[]> => {
    // If Supabase is not configured, use local JSON data
    if (!isSupabaseConfigured || !supabase) {
      const allRegions = Object.values(packagesData).flat()
      return region 
        ? allRegions.filter(pkg => pkg.region === region)
        : allRegions
    }
    
    let query = supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (region) {
      query = query.eq('region', region)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    return (data || []).map(transformDatabasePackage)
  }

  return useOptimizedQuery(queryKey, queryFn, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
  })
}

export const useOptimizedPackageById = (packageId: string) => {
  const queryKey = useMemo(() => ['package', packageId], [packageId])
  
  const queryFn = async (): Promise<TravelPackageType | null> => {
    // If Supabase is not configured, use local JSON data
    if (!isSupabaseConfigured || !supabase) {
      const allRegions = Object.values(packagesData).flat()
      return allRegions.find(pkg => pkg.id === packageId) || null
    }
    
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', packageId)
      .maybeSingle()
    
    if (error) throw error
    
    return data ? transformDatabasePackage(data) : null
  }

  return useOptimizedQuery(queryKey, queryFn, {
    enabled: !!packageId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  })
}

export const useOptimizedFeaturedPackages = () => {
  const queryKey = ['packages', 'featured']
  
  const queryFn = async (): Promise<TravelPackageType[]> => {
    // If Supabase is not configured, use local JSON data (first 3)
    if (!isSupabaseConfigured || !supabase) {
      const allRegions = Object.values(packagesData).flat()
      return allRegions.slice(0, 3)
    }
    
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('featured', true)
      .order('rating', { ascending: false })
      .limit(3)
    
    if (error) throw error
    
    return (data || []).map(transformDatabasePackage)
  }

  return useOptimizedQuery(queryKey, queryFn, {
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  })
}