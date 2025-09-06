import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'

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
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    loadCountries()
  }, [region])

  const loadCountries = async () => {
    try {
      setLoading(true)
      
      // Get countries without package counts for cleaner UI
      const { data: countriesData, error: countriesError } = await supabase
        .from('countries')
        .select('id, name, slug, region, capital')
        .eq('region', region.charAt(0).toUpperCase() + region.slice(1))
        .order('name')

      if (countriesError) throw countriesError

      setCountries(countriesData || [])
    } catch (error) {
      console.error('Error loading countries:', error)
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="bg-card/30 rounded-lg border border-border/20 p-3">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
          </div>
          <div className="flex flex-wrap gap-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-6 bg-muted rounded-full w-16 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (countries.length === 0) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="bg-card/30 rounded-lg border border-border/20 p-3">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto font-normal hover:bg-transparent"
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Browse Countries ({countries.length})
                </span>
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-3">
            <div className="flex flex-wrap gap-1">
              {countries.map((country) => (
                <button
                  key={country.id}
                  onClick={() => onCountrySelect(country.slug)}
                  className="px-2 py-1 text-xs bg-background/50 hover:bg-background border border-border/50 rounded-full transition-colors hover:text-primary"
                >
                  {country.name}
                </button>
              ))}
            </div>
          </CollapsibleContent>
          
          {!isOpen && (
            <div className="mt-2 flex flex-wrap gap-1">
              {countries.slice(0, 8).map((country) => (
                <button
                  key={country.id}
                  onClick={() => onCountrySelect(country.slug)}
                  className="px-2 py-1 text-xs bg-background/50 hover:bg-background border border-border/50 rounded-full transition-colors hover:text-primary"
                >
                  {country.name}
                </button>
              ))}
              {countries.length > 8 && (
                <button
                  onClick={() => setIsOpen(true)}
                  className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  +{countries.length - 8} more
                </button>
              )}
            </div>
          )}
        </div>
      </Collapsible>
    </div>
  )
}