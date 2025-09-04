import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from '@/integrations/supabase/client'

interface GenericFilterProps {
  searchValue: string
  onSearchChange: (value: string) => void
  selectedCountry: string
  onCountryChange: (value: string) => void
  selectedRegion: string
  onRegionChange: (value: string) => void
  totalItems: number
  filteredItems: number
  onClearFilters: () => void
  searchPlaceholder?: string
  showCountryFilter?: boolean
  showRegionFilter?: boolean
  className?: string
}

interface Country {
  id: string
  name: string
  region: string
}

export const GenericFilter = ({
  searchValue,
  onSearchChange,
  selectedCountry,
  onCountryChange,
  selectedRegion,
  onRegionChange,
  totalItems,
  filteredItems,
  onClearFilters,
  searchPlaceholder = "Search...",
  showCountryFilter = true,
  showRegionFilter = true,
  className = ""
}: GenericFilterProps) => {
  const [countries, setCountries] = useState<Country[]>([])

  const regions = ["Asia", "Europe", "Africa", "Americas", "Pacific Islands", "Middle East"]

  useEffect(() => {
    if (showCountryFilter) {
      loadCountries()
    }
  }, [showCountryFilter])

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
    }
  }

  // Filter countries by selected region
  const filteredCountries = selectedRegion === "all" 
    ? countries 
    : countries.filter(country => country.region === selectedRegion)

  return (
    <div className={`bg-card p-6 rounded-lg border ${className}`}>
      <h3 className="text-lg font-semibold mb-4">🔍 Search & Filter</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        {showRegionFilter && (
          <div>
            <Label htmlFor="region-filter">Filter by Region</Label>
            <Select value={selectedRegion} onValueChange={onRegionChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {showCountryFilter && (
          <div>
            <Label htmlFor="country-filter">Filter by Country</Label>
            <Select value={selectedCountry} onValueChange={onCountryChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {filteredCountries.map(country => (
                  <SelectItem key={country.id} value={country.id}>{country.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="w-full"
          >
            Clear Filters
          </Button>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredItems} of {totalItems} items
        </div>
        {filteredItems !== totalItems && (
          <Badge variant="secondary" className="text-xs">
            {totalItems - filteredItems} filtered out
          </Badge>
        )}
      </div>
    </div>
  )
}