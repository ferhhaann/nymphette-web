import { useMemo, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { type DatabasePackage, isSupabaseConfigured } from '@/lib/supabase'
import { packagesData, type TravelPackage } from '@/data/packagesData'
import type { TravelPackage as TravelPackageType } from '@/data/packagesData'
import { useOptimizedQuery, queryCache } from './useOptimizedQuery'

const transformDatabasePackage = (dbPackage: DatabasePackage): TravelPackageType => {
  return {
    id: dbPackage.id,
    title: dbPackage.title,
    country: dbPackage.country,
    countrySlug: dbPackage.country_slug || '',
    region: dbPackage.region,
    duration: dbPackage.duration,
    price: dbPackage.price,
    originalPrice: dbPackage.original_price || '',
    rating: dbPackage.rating || 0,
    reviews: dbPackage.reviews || 0,
    image: dbPackage.image,
    highlights: dbPackage.highlights || [],
    inclusions: dbPackage.inclusions || [],
    exclusions: dbPackage.exclusions || [],
    category: dbPackage.category,
    bestTime: dbPackage.best_time || '',
    groupSize: dbPackage.group_size || '',
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
    if (!supabase) {
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

  const result = useOptimizedQuery(queryKey, queryFn, {
    staleTime: 0, // Always fresh for admin changes
    cacheTime: 1000, // Very short cache time for instant updates
  })

  // Set up real-time subscription for packages
  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel('packages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'packages',
        },
        (payload) => {
          console.log('Real-time packages change detected:', payload)
          queryCache.invalidate('packages')
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [region])

  return result
}

export const useOptimizedPackageById = (packageId: string) => {
  const queryKey = useMemo(() => ['package', packageId], [packageId])
  
  const queryFn = async (): Promise<TravelPackageType | null> => {
    // If Supabase is not configured, use local JSON data
    if (!supabase) {
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

  const result = useOptimizedQuery(queryKey, queryFn, {
    enabled: !!packageId,
    staleTime: 0, // Always fresh for admin changes
    cacheTime: 1000, // Very short cache time for instant updates
  })

  // Set up real-time subscription for this specific package
  useEffect(() => {
    if (!supabase || !packageId) return

    const channel = supabase
      .channel(`package-${packageId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'packages',
        },
        (payload) => {
          console.log('Real-time package change detected:', payload)
          queryCache.invalidate('packages')
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [packageId])

  return result
}

export const useOptimizedFeaturedPackages = () => {
  const queryKey = ['packages', 'featured']
  
  const queryFn = async (): Promise<TravelPackageType[]> => {
    // If Supabase is not configured, use local JSON data (first 3)
    if (!supabase) {
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

  const result = useOptimizedQuery(queryKey, queryFn, {
    staleTime: 0, // Always fresh for admin changes
    cacheTime: 1000, // Very short cache time for instant updates
  })

  // Set up real-time subscription for featured packages
  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel('featured-packages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'packages',
        },
        (payload) => {
          console.log('Real-time featured packages change detected:', payload)
          queryCache.invalidate('packages')
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return result
}