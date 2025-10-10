import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Globe, MapPin, Star } from "lucide-react"
import { ImageUpload } from "./ImageUpload"
import { CountryImageManager } from "./CountryImageManager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GenericFilter } from "./GenericFilter"
import type { Database } from "@/integrations/supabase/types"

type Country = Database['public']['Tables']['countries']['Row']
type FamousPlace = Database['public']['Tables']['famous_places']['Row']
type EssentialTip = Database['public']['Tables']['essential_tips']['Row']
type TravelPurpose = Database['public']['Tables']['travel_purposes']['Row']
type CountryFAQ = Database['public']['Tables']['country_faqs']['Row']

const createEmptyCountry = (): Partial<Country> => ({
  // leave id undefined so DB will generate UUID
  id: undefined,
  name: '',
  slug: '',
  region: '',
  capital: '',
  currency: '',
  climate: '',
  best_season: '',
  languages: [],
  speciality: '',
  culture: '',
  annual_visitors: null,
  gender_male_percentage: null,
  gender_female_percentage: null,
  is_popular: false,
  created_at: null,
  updated_at: null
})

export const CountryManager = () => {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCountry, setEditingCountry] = useState<Partial<Country> | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const regions = ["Asia", "Europe", "Africa", "Americas", "Pacific Islands", "Middle East"]

  useEffect(() => {
    loadCountries()
  }, [])

  const loadCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setCountries(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load countries: " + error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const saveCountry = async (countryData: Partial<Country>) => {
    try {
      if (countryData.id) {
        // Update existing country
        const { error } = await supabase
          .from('countries')
          .update(countryData)
          .eq('id', countryData.id)

        if (error) throw error
      } else {
        // Create new country — ensure we don't send id (DB will generate UUID)
        const insertData = { ...countryData } as any
        delete insertData.id

        const { error } = await supabase
          .from('countries')
          .insert([insertData])

        if (error) throw error
      }

      await loadCountries()
      setIsDialogOpen(false)
      setEditingCountry(null)
      toast({
        title: "Success",
        description: countryData.id ? "Country updated" : "Country created"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const deleteCountry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this country? This will also delete all associated data.")) return

    try {
      const { error } = await supabase
        .from('countries')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadCountries()
      toast({
        title: "Success",
        description: "Country deleted"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }


  // Filter countries based on search and region
  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (country.capital && country.capital.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesRegion = selectedRegion === "all" || country.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  // Group countries by region
  const countriesByRegion = regions.reduce((acc, region) => {
    acc[region] = filteredCountries.filter(country => country.region === region)
    return acc
  }, {} as Record<string, Country[]>)

  if (loading) {
    return <div className="text-center">Loading countries...</div>
  }

  return (
    <div className="space-y-8">
      {/* Header Section with Better Visual Hierarchy */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-6 border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Countries Management</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {countries.length} countries across {regions.length} regions
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Organize destinations, manage content, and update travel information
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => setEditingCountry(createEmptyCountry())} 
                size="lg"
                className="h-12 px-6 font-medium"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Country
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editingCountry?.id ? 'Edit Country Details' : 'Add New Country'}
                </DialogTitle>
              </DialogHeader>
              <CountryForm 
                country={editingCountry!} 
                onSave={saveCountry}
                onCancel={() => {
                  setIsDialogOpen(false)
                  setEditingCountry(null)
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Navigation Tabs with Better Design */}
      <Tabs defaultValue="info" className="space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg border p-1">
          <TabsList className="grid w-full grid-cols-2 bg-transparent gap-1 h-auto">
            <TabsTrigger 
              value="info" 
              className="flex items-center gap-2 py-3 px-4 text-sm font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-300"
            >
              <Globe className="h-4 w-4" />
              Country Information
            </TabsTrigger>
            <TabsTrigger 
              value="images" 
              className="flex items-center gap-2 py-3 px-4 text-sm font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-300"
            >
              <Edit className="h-4 w-4" />
              Images & Media
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="info" className="space-y-6">
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h3 className="font-semibold">📝 Note: Country Data in JSON Files</h3>
                <p className="text-sm text-muted-foreground">
                  Country information (name, region, descriptions, etc.) is managed in JSON files located at <code className="bg-background px-1 py-0.5 rounded">src/data/countries/</code>.
                </p>
                <p className="text-sm text-muted-foreground">
                  Use the <strong>Images & Media</strong> tab to upload and manage hero images for countries.
                </p>
              </div>
            </CardContent>
          </Card>
          {/* Enhanced Filter Section */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">Filter & Search</h3>
                  <Badge variant="outline" className="text-xs">
                    {filteredCountries.length} of {countries.length} countries
                  </Badge>
                </div>
                {(searchTerm || selectedRegion !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedRegion("all")
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <GenericFilter
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCountry=""
                onCountryChange={() => {}}
                selectedRegion={selectedRegion}
                onRegionChange={setSelectedRegion}
                totalItems={countries.length}
                filteredItems={filteredCountries.length}
                onClearFilters={() => {
                  setSearchTerm("")
                  setSelectedRegion("all")
                }}
                searchPlaceholder="Search by country name or capital city..."
                showCountryFilter={false}
                showRegionFilter={true}
              />
            </CardContent>
          </Card>

          {/* Countries organized by Region */}
          {selectedRegion === "all" ? (
            <div className="space-y-8">
              {regions.map(region => {
                const regionCountries = countriesByRegion[region]
                if (regionCountries.length === 0) return null
                
                return (
                  <div key={region} className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                            {region.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{region}</h3>
                            <p className="text-sm text-muted-foreground">Explore destinations in this region</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="font-medium">
                          {regionCountries.length} {regionCountries.length === 1 ? 'country' : 'countries'}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {regionCountries.map((country) => (
                        <Card key={country.id} className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-blue-400">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2 text-lg group-hover:text-blue-600 transition-colors">
                                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                    <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  {country.name}
                                  {country.is_popular && (
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                  )}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1 text-sm">
                                  <MapPin className="h-3 w-3" />
                                  {country.capital ? `${country.capital}, ${country.region}` : country.region}
                                </CardDescription>
                              </div>
                              {country.is_popular && (
                                <Badge variant="secondary" className="text-xs font-medium">
                                  ⭐ Popular
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="space-y-1">
                                <p className="text-muted-foreground text-xs uppercase tracking-wide">Currency</p>
                                <p className="font-medium">{country.currency || 'Not set'}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-muted-foreground text-xs uppercase tracking-wide">Best Season</p>
                                <p className="font-medium">{country.best_season || 'Not set'}</p>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingCountry(country)
                                  setIsDialogOpen(true)
                                }}
                                className="flex items-center gap-1.5"
                              >
                                <Edit className="h-3 w-3" />
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteCountry(country.id)}
                                className="flex items-center gap-1.5"
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCountries.map((country) => (
                <Card key={country.id} className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-blue-400">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-lg group-hover:text-blue-600 transition-colors">
                          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          {country.name}
                          {country.is_popular && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {country.capital ? `${country.capital}, ${country.region}` : country.region}
                        </CardDescription>
                      </div>
                      {country.is_popular && (
                        <Badge variant="secondary" className="text-xs font-medium">
                          ⭐ Popular
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs uppercase tracking-wide">Currency</p>
                        <p className="font-medium">{country.currency || 'Not set'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs uppercase tracking-wide">Best Season</p>
                        <p className="font-medium">{country.best_season || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCountry(country)
                          setIsDialogOpen(true)
                        }}
                        className="flex items-center gap-1.5"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteCountry(country.id)}
                        className="flex items-center gap-1.5"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
      </Tabs>
    </div>
  )
}

// DEPRECATED: Country management has been moved to static JSON files in src/data/countriesData.ts
// This component is kept for managing extended country content (sections, attractions, etc.)
// Basic country information (name, slug, region, etc.) should be edited in countriesData.ts

interface CountryFormProps {
  country: Partial<Country>
  onSave: (country: Partial<Country>) => void
  onCancel: () => void
}

const CountryForm = ({ country, onSave, onCancel }: CountryFormProps) => {
  const [formData, setFormData] = useState<Partial<Country>>(country || createEmptyCountry())
  const [languages, setLanguages] = useState<string>(
    country?.languages ? country.languages.join(', ') : ''
  )
  const [topOriginCities, setTopOriginCities] = useState<string>(() => {
    if (country?.visitor_statistics && typeof country.visitor_statistics === 'object' && country.visitor_statistics !== null) {
      const stats = country.visitor_statistics as any
      return stats.topOrigins ? stats.topOrigins.join(', ') : ''
    }
    return ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const topOrigins = topOriginCities.split(',').map(city => city.trim()).filter(Boolean)
    
    const currentStats = formData.visitor_statistics && typeof formData.visitor_statistics === 'object' 
      ? formData.visitor_statistics as any 
      : {}
    
    const dataToSave = {
      ...formData,
      languages: languages.split(',').map(lang => lang.trim()).filter(Boolean),
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-'),
      visitor_statistics: {
        ...currentStats,
        topOrigins
      }
    }
    
    onSave(dataToSave)
  }

  const updateField = (field: keyof Country, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Globe className="h-4 w-4 text-blue-600" />
          <h3 className="font-semibold text-lg">Basic Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Country Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g., Japan, France, India"
              required
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-sm font-medium">URL Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => updateField('slug', e.target.value)}
              placeholder="Auto-generated from name"
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">Used in website URLs (will be auto-generated if empty)</p>
          </div>
        </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="region" className="text-sm font-medium">Region *</Label>
            <SearchableSelect
              options={["Asia", "Europe", "Africa", "Americas", "Pacific Islands", "Middle East"].map(region => ({
                value: region,
                label: region
              }))}
              value={formData.region}
              onValueChange={(value) => updateField('region', value)}
              placeholder="Select region"
              searchPlaceholder="Search regions..."
              emptyText="No regions found"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capital" className="text-sm font-medium">Capital City</Label>
            <Input
              id="capital"
              value={formData.capital || ''}
              onChange={(e) => updateField('capital', e.target.value)}
              placeholder="e.g., Tokyo, Paris, New Delhi"
              className="h-10"
            />
          </div>
        </div>

      {/* Travel Details Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <MapPin className="h-4 w-4 text-green-600" />
          <h3 className="font-semibold text-lg">Travel Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currency" className="text-sm font-medium">Currency</Label>
            <Input
              id="currency"
              value={formData.currency || ''}
              onChange={(e) => updateField('currency', e.target.value)}
              placeholder="e.g., USD, EUR, INR, JPY"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="best_season" className="text-sm font-medium">Best Travel Season</Label>
            <Input
              id="best_season"
              value={formData.best_season || ''}
              onChange={(e) => updateField('best_season', e.target.value)}
              placeholder="e.g., Spring (March-May)"
              className="h-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="climate" className="text-sm font-medium">Climate</Label>
          <Input
            id="climate"
            value={formData.climate || ''}
            onChange={(e) => updateField('climate', e.target.value)}
            placeholder="e.g., Tropical, Temperate, Mediterranean"
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="languages" className="text-sm font-medium">Languages</Label>
          <Input
            id="languages"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            placeholder="English, Hindi, Japanese (comma-separated)"
            className="h-10"
          />
          <p className="text-xs text-muted-foreground">Separate multiple languages with commas</p>
        </div>
      </div>

      {/* Cultural Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Star className="h-4 w-4 text-purple-600" />
          <h3 className="font-semibold text-lg">Cultural Information</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="speciality" className="text-sm font-medium">Speciality & Highlights</Label>
            <Textarea
              id="speciality"
              value={formData.speciality || ''}
              onChange={(e) => updateField('speciality', e.target.value)}
              placeholder="What makes this country special? Famous for food, architecture, nature, etc."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="culture" className="text-sm font-medium">Culture & Traditions</Label>
            <Textarea
              id="culture"
              value={formData.culture || ''}
              onChange={(e) => updateField('culture', e.target.value)}
              placeholder="Cultural highlights, traditions, customs, and local practices"
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>

      {/* Statistics & Preferences Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <div className="h-4 w-4 bg-orange-500 rounded"></div>
          <h3 className="font-semibold text-lg">Statistics & Analytics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="annual_visitors" className="text-sm font-medium">Annual Visitors</Label>
            <Input
              id="annual_visitors"
              type="number"
              value={formData.annual_visitors || ''}
              onChange={(e) => updateField('annual_visitors', parseInt(e.target.value) || null)}
              placeholder="e.g., 1500000"
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">Total visitors per year</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender_male_percentage" className="text-sm font-medium">Male Visitors (%)</Label>
            <Input
              id="gender_male_percentage"
              type="number"
              min="0"
              max="100"
              value={formData.gender_male_percentage || ''}
              onChange={(e) => updateField('gender_male_percentage', parseInt(e.target.value) || null)}
              placeholder="e.g., 45"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender_female_percentage" className="text-sm font-medium">Female Visitors (%)</Label>
            <Input
              id="gender_female_percentage"
              type="number"
              min="0"
              max="100"
              value={formData.gender_female_percentage || ''}
              onChange={(e) => updateField('gender_female_percentage', parseInt(e.target.value) || null)}
              placeholder="e.g., 55"
              className="h-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="top_origin_cities" className="text-sm font-medium">Top Origin Cities</Label>
          <Input
            id="top_origin_cities"
            value={topOriginCities}
            onChange={(e) => setTopOriginCities(e.target.value)}
            placeholder="Mumbai, Delhi, Bangalore, Chennai, Kolkata"
            className="h-10"
          />
          <p className="text-xs text-muted-foreground">Cities where most visitors come from (comma-separated)</p>
        </div>
      </div>

      {/* Visibility Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <div className="h-4 w-4 bg-red-500 rounded"></div>
          <h3 className="font-semibold text-lg">Visibility Settings</h3>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="is_popular"
              checked={formData.is_popular || false}
              onCheckedChange={(checked) => updateField('is_popular', checked)}
              className="mt-1"
            />
            <div className="space-y-1">
              <Label htmlFor="is_popular" className="text-sm font-medium cursor-pointer">
                ⭐ Mark as Popular Destination
              </Label>
              <p className="text-xs text-muted-foreground">
                Popular destinations will be featured prominently on the homepage and in search results
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="h-11 px-6">
          Cancel
        </Button>
        <Button type="submit" className="h-11 px-6 font-medium">
          {formData.id ? '✓ Update Country' : '+ Create Country'}
        </Button>
      </div>
    </form>
  )
}