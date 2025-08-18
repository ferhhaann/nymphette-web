import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface Country {
  id: string
  name: string
  slug: string
  region: string
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
      const { data, error } = await supabase
        .from('countries')
        .select('id, name, slug, region')
        .eq('region', region)
        .order('name')

      if (error) throw error
      setCountries(data || [])
    } catch (error) {
      console.error('Error loading countries:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="grid grid-cols-2 md:grid-cols-3 gap-4">Loading countries...</div>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {countries.map((country) => (
        <button
          key={country.id}
          onClick={() => onCountrySelect(country.slug)}
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left"
        >
          <h3 className="font-semibold">{country.name}</h3>
        </button>
      ))}
    </div>
  )
}