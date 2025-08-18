import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured, type DatabasePackage } from '@/lib/supabase'
import { packagesData, type TravelPackage } from '@/data/packagesData'

export const useFeaturedPackages = () => {
  const [packages, setPackages] = useState<TravelPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadFeaturedPackages()
  }, [])

  const loadFeaturedPackages = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // If Supabase is not configured, use local JSON data (first 3)
      if (!isSupabaseConfigured || !supabase) {
        const allRegions = Object.values(packagesData).flat()
        const featuredPackages = allRegions.slice(0, 3)
        setPackages(featuredPackages)
        setLoading(false)
        return
      }
      
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('featured', true)
        .order('rating', { ascending: false })
        .limit(3)
      
      if (error) throw error
      
      // Transform database packages to TravelPackage format
      const transformedPackages: TravelPackage[] = (data || []).map(transformDatabasePackage)
      setPackages(transformedPackages)
      
    } catch (err: any) {
      setError(err.message)
      console.error('Error loading featured packages:', err)
    } finally {
      setLoading(false)
    }
  }

  return { packages, loading, error, refetch: loadFeaturedPackages }
}

// Transform database package to TravelPackage format
const transformDatabasePackage = (dbPackage: DatabasePackage): TravelPackage => {
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
    itinerary: dbPackage.itinerary
  }
}