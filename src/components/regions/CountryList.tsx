import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Users, Package } from 'lucide-react'

interface Country {
  id: string
  name: string
  slug: string
  region: string
  capital?: string
  annual_visitors?: number
  package_count?: number
}

interface CountryListProps {
  region: string
  onCountrySelect: (countrySlug: string) => void
}

export const CountryList = ({ region, onCountrySelect }: CountryListProps) => {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    loadCountries()
  }, [region])

  const loadCountries = async () => {
    try {
      setLoading(true)
      
      // Get countries with package counts
      const { data: countriesData, error: countriesError } = await supabase
        .from('countries')
        .select('id, name, slug, region, capital, annual_visitors')
        .eq('region', region.charAt(0).toUpperCase() + region.slice(1))
        .order('name')

      if (countriesError) throw countriesError

      // Get package counts for each country
      const countriesWithCounts = await Promise.all(
        (countriesData || []).map(async (country) => {
          const { count } = await supabase
            .from('packages')
            .select('*', { count: 'exact', head: true })
            .eq('country_slug', country.slug)
          
          return {
            ...country,
            package_count: count || 0
          }
        })
      )

      setCountries(countriesWithCounts)
    } catch (error) {
      console.error('Error loading countries:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPackageCount = (count?: number) => {
    const num = count || 0;
    return num === 1 ? '1 package' : `${num} packages`;
  }

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">Browse Countries</h2>
          <p className="text-muted-foreground">Discover amazing destinations in {region}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  if (countries.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">Browse Countries</h2>
          <p className="text-muted-foreground">No countries found in {region}</p>
        </div>
      </section>
    )
  }

  const displayedCountries = showAll ? countries : countries.slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="mb-3">
        <h3 className="text-base font-medium text-foreground mb-1">Browse Countries</h3>
      </div>
      
      {/* Horizontal scrollable list for mobile */}
      <div className="md:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {displayedCountries.map((country, index) => (
            <div
              key={country.id}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-card/60 rounded-full border border-border/30 cursor-pointer hover:bg-card transition-colors text-sm group"
              onClick={() => onCountrySelect(country.slug)}
            >
              <span className="font-medium text-foreground whitespace-nowrap">{country.name}</span>
              <Badge variant="secondary" className="text-xs px-1.5 py-0 group-hover:hidden">
                {country.package_count || 0}
              </Badge>
              <span className="text-xs text-primary hidden group-hover:inline whitespace-nowrap">
                {formatPackageCount(country.package_count)}
              </span>
            </div>
          ))}
          {countries.length > 6 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="flex-shrink-0 px-3 py-2 text-xs text-primary border border-primary/30 rounded-full hover:bg-primary/10 transition-colors"
            >
              +{countries.length - 6} more
            </button>
          )}
        </div>
      </div>

      {/* Compact grid for larger screens */}
      <div className="hidden md:block">
        <div className="grid grid-cols-6 gap-2">
          {displayedCountries.map((country, index) => (
            <div
              key={country.id}
              className="p-2 bg-card/60 rounded-lg border border-border/30 cursor-pointer hover:bg-card transition-colors text-center group"
              onClick={() => onCountrySelect(country.slug)}
            >
              <div className="text-xs font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {country.name}
              </div>
              <div className="text-xs text-primary mt-1 group-hover:hidden">
                {country.package_count || 0}
              </div>
              <div className="text-xs text-primary mt-1 hidden group-hover:block">
                {formatPackageCount(country.package_count)}
              </div>
            </div>
          ))}
          {countries.length > 6 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="p-2 text-xs text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors"
            >
              +{countries.length - 6}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}