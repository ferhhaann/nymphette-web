import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CountryAttractionsManager } from './CountryAttractionsManager'
import { GenericFilter } from './GenericFilter'

interface Country {
  id: string
  name: string
  region: string
}

export const AttractionsContentManager = () => {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<string>("all")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")

  useEffect(() => {
    loadCountries()
  }, [])

  const loadCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('id, name, region')
        .order('name', { ascending: true })

      if (error) throw error
      setCountries(data || [])
    } catch (error) {
      console.error('Error loading countries:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter countries based on search, country, and region
  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCountry = selectedCountry === "all" || country.id === selectedCountry
    const matchesRegion = selectedRegion === "all" || country.region === selectedRegion
    return matchesSearch && matchesCountry && matchesRegion
  })

  if (loading) {
    return <div className="text-center p-8">Loading countries...</div>
  }

  return (
    <div className="space-y-6">
      <GenericFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        totalItems={countries.length}
        filteredItems={filteredCountries.length}
        onClearFilters={() => {
          setSearchTerm("")
          setSelectedCountry("all")
          setSelectedRegion("all")
        }}
        searchPlaceholder="Search countries..."
        showCountryFilter={true}
        showRegionFilter={true}
      />

      {filteredCountries.length > 0 && (
        <div className="grid gap-6">
          {filteredCountries.map((country) => (
            <Card key={country.id}>
              <CardHeader>
                <CardTitle>{country.name} - Attractions Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CountryAttractionsManager 
                  countryId={country.id} 
                  countryName={country.name} 
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredCountries.length === 0 && countries.length > 0 && (
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground">No countries match your current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}