import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Globe, MapPin, Star } from "lucide-react"
import { ImageUpload } from "./ImageUpload"
import { CountryContentManager } from "./CountryContentManager"
import { ContentSectionsManager } from "./ContentSectionsManager"
import { AttractionsContentManager } from "./AttractionsContentManager"
import { CountrySectionManager } from "./CountrySectionManager"
import { TravelPurposeManager } from "./TravelPurposeManager"
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
  description: '',
  hero_image_url: '',
  annual_visitors: null,
  gender_male_percentage: null,
  gender_female_percentage: null,
  overview_description: '',
  about_content: '',
  best_time_content: '',
  food_shopping_content: '',
  art_culture_content: '',
  travel_tips: '',
  is_popular: false,
  visitor_statistics: {
    annual: null,
    gender: { male: null, female: null },
    purposes: [],
    topOrigins: []
  },
  hero_images: [],
  fun_facts: [],
  before_you_go_tips: [],
  reasons_to_visit: [],
  dos_donts: [],
  contact_info: {
    email: "hello@nymphettetours.com",
    phone: "+1 (555) 123-4567",
    address: "",
    whatsapp: ""
  },
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="border-b border-border pb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Countries Management</h1>
            <p className="text-muted-foreground max-w-2xl">
              Manage country profiles, visitor statistics, content sections, and attractions. 
              All country data is organized and easily accessible through dedicated sections.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" onClick={() => setEditingCountry(createEmptyCountry())} className="min-w-[150px]">
                <Plus className="h-4 w-4 mr-2" />
                Add New Country
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {editingCountry?.id ? 'Edit Country' : 'Add New Country'}
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

      {/* Management Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="bg-muted/30 p-1 rounded-lg">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1 bg-transparent">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-6 py-3"
            >
              <Globe className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Countries</span>
              <span className="sm:hidden">List</span>
            </TabsTrigger>
            <TabsTrigger 
              value="statistics" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-6 py-3"
            >
              <Star className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Statistics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger 
              value="content" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-6 py-3"
            >
              <Edit className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Content</span>
              <span className="sm:hidden">Content</span>
            </TabsTrigger>
            <TabsTrigger 
              value="attractions" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-6 py-3"
            >
              <MapPin className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Attractions</span>
              <span className="sm:hidden">Places</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{countries.length}</div>
                <p className="text-xs text-muted-foreground">Across all regions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Popular Destinations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{countries.filter(c => c.is_popular).length}</div>
                <p className="text-xs text-muted-foreground">Featured countries</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Regions Covered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Set(countries.map(c => c.region)).size}</div>
                <p className="text-xs text-muted-foreground">Geographic regions</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter Section */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter Countries</CardTitle>
              <CardDescription>Find and manage countries by name, capital, or region</CardDescription>
            </CardHeader>
            <CardContent>
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

          {/* Countries Grid */}
          {selectedRegion === "all" ? (
            <div className="space-y-8">
              {regions.map(region => {
                const regionCountries = countriesByRegion[region]
                if (regionCountries.length === 0) return null
                
                return (
                  <Card key={region}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          {region}
                        </CardTitle>
                        <Badge variant="outline" className="font-medium">
                          {regionCountries.length} {regionCountries.length === 1 ? 'country' : 'countries'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {regionCountries.map((country) => (
                          <Card key={country.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <CardTitle className="flex items-center gap-2 text-base">
                                    <Globe className="h-4 w-4" />
                                    {country.name}
                                    {country.is_popular && (
                                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                    )}
                                  </CardTitle>
                                  <CardDescription className="text-sm">
                                    <MapPin className="h-3 w-3 inline mr-1" />
                                    {country.capital}
                                  </CardDescription>
                                </div>
                                {country.is_popular && (
                                  <Badge variant="secondary" className="text-xs">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                  <div>Currency: {country.currency || 'N/A'}</div>
                                  <div>Best: {country.best_season || 'N/A'}</div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => {
                                      setEditingCountry(country)
                                      setIsDialogOpen(true)
                                    }}
                                  >
                                    <Edit className="h-3 w-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteCountry(country.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
           ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {selectedRegion} Countries
                </CardTitle>
                <CardDescription>
                  Showing {filteredCountries.length} countries in {selectedRegion}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCountries.map((country) => (
                    <Card key={country.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2 text-base">
                              <Globe className="h-4 w-4" />
                              {country.name}
                              {country.is_popular && (
                                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              )}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {country.capital}
                            </CardDescription>
                          </div>
                          {country.is_popular && (
                            <Badge variant="secondary" className="text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div>Currency: {country.currency || 'N/A'}</div>
                            <div>Best: {country.best_season || 'N/A'}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                setEditingCountry(country)
                                setIsDialogOpen(true)
                              }}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteCountry(country.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
           )}
        </TabsContent>
        
        <TabsContent value="statistics" className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Visitor Statistics & Travel Purposes</h3>
            <p className="text-muted-foreground">
              Manage visitor statistics, travel purposes, and demographic data for countries.
            </p>
          </div>
          <TravelPurposeManager />
        </TabsContent>
        
        <TabsContent value="content" className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Content Sections Management</h3>
            <p className="text-muted-foreground">
              Create and manage content sections for country pages including hero content, descriptions, and custom sections.
            </p>
          </div>
          <ContentSectionsManager />
        </TabsContent>
        
        <TabsContent value="attractions" className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Attractions & Places</h3>
            <p className="text-muted-foreground">
              Manage tourist attractions, famous places, must-visit locations, and other country-specific content.
            </p>
          </div>
          <AttractionsContentManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}

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
  const [funFacts, setFunFacts] = useState<string>(
    country?.fun_facts && Array.isArray(country.fun_facts) ? country.fun_facts.join('\n') : ''
  )
  const [beforeYouGoTips, setBeforeYouGoTips] = useState<string>(
    country?.before_you_go_tips && Array.isArray(country.before_you_go_tips) ? country.before_you_go_tips.join('\n') : ''
  )
  const [reasonsToVisit, setReasonsToVisit] = useState<string>(
    country?.reasons_to_visit && Array.isArray(country.reasons_to_visit) ? country.reasons_to_visit.join('\n') : ''
  )
  const [dosAndDonts, setDosAndDonts] = useState<string>(() => {
    if (country?.dos_donts && typeof country.dos_donts === 'object' && !Array.isArray(country.dos_donts)) {
      const dosData = country.dos_donts as any
      const dos = dosData.dos || []
      const donts = dosData.donts || []
      return `DOS:\n${dos.join('\n')}\n\nDON'TS:\n${donts.join('\n')}`
    }
    return ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const topOrigins = topOriginCities.split(',').map(city => city.trim()).filter(Boolean)
    
    // Parse dos and don'ts
    const dosAndDontsLines = dosAndDonts.split('\n')
    const dosIndex = dosAndDontsLines.findIndex(line => line.toUpperCase().includes('DOS:'))
    const dontsIndex = dosAndDontsLines.findIndex(line => line.toUpperCase().includes("DON'TS:"))
    
    let dos: string[] = []
    let donts: string[] = []
    
    if (dosIndex !== -1 && dontsIndex !== -1) {
      dos = dosAndDontsLines.slice(dosIndex + 1, dontsIndex).filter(line => line.trim())
      donts = dosAndDontsLines.slice(dontsIndex + 1).filter(line => line.trim())
    }
    
    const currentStats = formData.visitor_statistics && typeof formData.visitor_statistics === 'object' 
      ? formData.visitor_statistics as any 
      : {}
    
    const dataToSave = {
      ...formData,
      languages: languages.split(',').map(lang => lang.trim()).filter(Boolean),
      slug: formData.slug || formData.name?.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-'),
      visitor_statistics: {
        ...currentStats,
        annual: formData.annual_visitors,
        gender: {
          male: formData.gender_male_percentage,
          female: formData.gender_female_percentage
        },
        topOrigins
      },
      fun_facts: funFacts.split('\n').filter(fact => fact.trim()),
      before_you_go_tips: beforeYouGoTips.split('\n').filter(tip => tip.trim()),
      reasons_to_visit: reasonsToVisit.split('\n').filter(reason => reason.trim()),
      dos_donts: {
        dos,
        donts
      }
    }
    
    onSave(dataToSave)
  }

  const updateField = (field: keyof Country, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="tips">Tips & Facts</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Country Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                placeholder="Auto-generated from name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="region">Region</Label>
              <Select value={formData.region} onValueChange={(value) => updateField('region', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {["Asia", "Europe", "Africa", "Americas", "Pacific Islands", "Middle East"].map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="capital">Capital</Label>
              <Input
                id="capital"
                value={formData.capital || ''}
                onChange={(e) => updateField('capital', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={formData.currency || ''}
                onChange={(e) => updateField('currency', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="best_season">Best Season</Label>
              <Input
                id="best_season"
                value={formData.best_season || ''}
                onChange={(e) => updateField('best_season', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="climate">Climate</Label>
            <Input
              id="climate"
              value={formData.climate || ''}
              onChange={(e) => updateField('climate', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="languages">Languages (comma-separated)</Label>
            <Input
              id="languages"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="English, Hindi, etc."
            />
          </div>

          <div>
            <Label htmlFor="hero_image_url">Hero Image URL</Label>
            <Input
              id="hero_image_url"
              value={formData.hero_image_url || ''}
              onChange={(e) => updateField('hero_image_url', e.target.value)}
              placeholder="URL for the main hero image"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="is_popular"
              checked={formData.is_popular || false}
              onCheckedChange={(checked) => updateField('is_popular', checked)}
            />
            <Label htmlFor="is_popular" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Mark as Popular Destination (will appear on homepage)
            </Label>
          </div>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="annual_visitors">Annual Visitors</Label>
              <Input
                id="annual_visitors"
                type="number"
                value={formData.annual_visitors || ''}
                onChange={(e) => updateField('annual_visitors', parseInt(e.target.value) || null)}
                placeholder="e.g., 5000000"
              />
            </div>
            <div>
              <Label htmlFor="gender_male_percentage">Male Visitors %</Label>
              <Input
                id="gender_male_percentage"
                type="number"
                min="0"
                max="100"
                value={formData.gender_male_percentage || ''}
                onChange={(e) => updateField('gender_male_percentage', parseInt(e.target.value) || null)}
              />
            </div>
            <div>
              <Label htmlFor="gender_female_percentage">Female Visitors %</Label>
              <Input
                id="gender_female_percentage"
                type="number"
                min="0"
                max="100"
                value={formData.gender_female_percentage || ''}
                onChange={(e) => updateField('gender_female_percentage', parseInt(e.target.value) || null)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="top_origin_cities">Top Origin Cities (comma-separated)</Label>
            <Input
              id="top_origin_cities"
              value={topOriginCities}
              onChange={(e) => setTopOriginCities(e.target.value)}
              placeholder="Mumbai, Delhi, Bangalore, Chennai, Kolkata"
            />
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div>
            <Label htmlFor="description">Main Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Brief description of the country"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="speciality">Speciality</Label>
            <Textarea
              id="speciality"
              value={formData.speciality || ''}
              onChange={(e) => updateField('speciality', e.target.value)}
              placeholder="What makes this country special?"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="culture">Culture</Label>
            <Textarea
              id="culture"
              value={formData.culture || ''}
              onChange={(e) => updateField('culture', e.target.value)}
              placeholder="Cultural highlights and traditions"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="overview_description">Overview Description</Label>
            <Textarea
              id="overview_description"
              value={formData.overview_description || ''}
              onChange={(e) => updateField('overview_description', e.target.value)}
              placeholder="Detailed overview for the country page"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="about_content">About Content</Label>
            <Textarea
              id="about_content"
              value={formData.about_content || ''}
              onChange={(e) => updateField('about_content', e.target.value)}
              placeholder="About this destination content"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="best_time_content">Best Time to Visit Content</Label>
            <Textarea
              id="best_time_content"
              value={formData.best_time_content || ''}
              onChange={(e) => updateField('best_time_content', e.target.value)}
              placeholder="Detailed information about the best time to visit"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="food_shopping_content">Food & Shopping Content</Label>
            <Textarea
              id="food_shopping_content"
              value={formData.food_shopping_content || ''}
              onChange={(e) => updateField('food_shopping_content', e.target.value)}
              placeholder="Information about local food and shopping"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="art_culture_content">Art & Culture Content</Label>
            <Textarea
              id="art_culture_content"
              value={formData.art_culture_content || ''}
              onChange={(e) => updateField('art_culture_content', e.target.value)}
              placeholder="Information about art and culture"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="travel_tips">Travel Tips</Label>
            <Textarea
              id="travel_tips"
              value={formData.travel_tips || ''}
              onChange={(e) => updateField('travel_tips', e.target.value)}
              placeholder="General travel tips for this destination"
              rows={4}
            />
          </div>
        </TabsContent>

        <TabsContent value="tips" className="space-y-4">
          <div>
            <Label htmlFor="fun_facts">Fun Facts (one per line)</Label>
            <Textarea
              id="fun_facts"
              value={funFacts}
              onChange={(e) => setFunFacts(e.target.value)}
              placeholder="Enter fun facts, one per line"
              rows={6}
            />
          </div>

          <div>
            <Label htmlFor="before_you_go_tips">Before You Go Tips (one per line)</Label>
            <Textarea
              id="before_you_go_tips"
              value={beforeYouGoTips}
              onChange={(e) => setBeforeYouGoTips(e.target.value)}
              placeholder="Enter before you go tips, one per line"
              rows={6}
            />
          </div>

          <div>
            <Label htmlFor="reasons_to_visit">Reasons to Visit (one per line)</Label>
            <Textarea
              id="reasons_to_visit"
              value={reasonsToVisit}
              onChange={(e) => setReasonsToVisit(e.target.value)}
              placeholder="Enter reasons to visit, one per line"
              rows={6}
            />
          </div>

          <div>
            <Label htmlFor="dos_donts">Do's and Don'ts</Label>
            <Textarea
              id="dos_donts"
              value={dosAndDonts}
              onChange={(e) => setDosAndDonts(e.target.value)}
              placeholder={`DOS:\nRespect local customs\nTry local food\n\nDON'TS:\nDon't litter\nDon't be loud in temples`}
              rows={8}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Format: Start with "DOS:" followed by items, then "DON'TS:" followed by items, one per line
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {formData.id ? 'Update Country' : 'Create Country'}
        </Button>
      </div>
    </form>
  )
}