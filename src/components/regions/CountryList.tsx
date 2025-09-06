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

  const formatVisitors = (visitors?: number) => {
    if (!visitors) return ''
    if (visitors >= 1000000) {
      return `${(visitors / 1000000).toFixed(1)}M visitors/year`
    }
    return `${(visitors / 1000).toFixed(0)}K visitors/year`
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

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-1">Browse Countries</h2>
        <p className="text-sm text-muted-foreground">Discover destinations in {region}</p>
      </div>
      
      {/* Compact list layout for mobile, grid for larger screens */}
      <div className="md:hidden space-y-2">
        {countries.map((country, index) => (
          <div
            key={country.id}
            className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50 cursor-pointer hover:bg-card/80 transition-colors animate-fade-in"
            style={{animationDelay: `${index * 50}ms`}}
            onClick={() => onCountrySelect(country.slug)}
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{country.name}</span>
              {country.capital && (
                <span className="text-xs text-muted-foreground">• {country.capital}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {country.package_count || 0} tours
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Grid layout for larger screens */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {countries.map((country, index) => (
          <Card 
            key={country.id} 
            className="group cursor-pointer hover:shadow-card-soft transition-all duration-300 animate-fade-in border-muted hover:border-primary/20"
            style={{animationDelay: `${index * 50}ms`}}
            onClick={() => onCountrySelect(country.slug)}
          >
            <CardContent className="p-3">
              <div className="text-center space-y-1">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {country.name}
                </h3>
                {country.capital && (
                  <p className="text-xs text-muted-foreground line-clamp-1">{country.capital}</p>
                )}
                <div className="flex items-center justify-center gap-1">
                  <Package className="h-3 w-3 text-primary" />
                  <span className="text-xs text-primary font-medium">
                    {country.package_count || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}