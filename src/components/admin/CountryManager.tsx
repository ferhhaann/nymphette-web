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
import { Plus, Edit, Trash2, Globe, MapPin, Star, Search, Users, FileText, Settings, BookOpen } from "lucide-react"
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

  const saveCountry = async (country: Partial<Country>) => {
    try {
      if (country.id) {
        // Update existing country
        const { error } = await supabase
          .from('countries')
          .update(country)
          .eq('id', country.id)
        
        if (error) throw error
      } else {
        // Insert new country - let DB generate UUID
        const countryData = { ...country }
        delete countryData.id // Remove id to let DB auto-generate
        
        const { error } = await supabase
          .from('countries')
          .insert(countryData as any)
        
        if (error) throw error
      }

      toast({
        title: "Success",
        description: country.id ? "Country updated successfully" : "Country created successfully"
      })
      
      setIsDialogOpen(false)
      setEditingCountry(null)
      loadCountries()
    } catch (error: any) {
      toast({
        title: "Error", 
        description: "Failed to save country: " + error.message,
        variant: "destructive"
      })
    }
  }

  const deleteCountry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this country?')) return

    try {
      const { error } = await supabase
        .from('countries')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Country deleted successfully"
      })
      
      loadCountries()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete country: " + error.message,
        variant: "destructive"
      })
    }
  }

  const filteredCountries = countries.filter(country => {
    const matchesSearch = searchTerm === "" || 
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.capital?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.region.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRegion = selectedRegion === "all" || country.region === selectedRegion
    
    return matchesSearch && matchesRegion
  })

  const countryGroups = regions.reduce((acc, region) => {
    const regionCountries = filteredCountries.filter(c => c.region === region)
    if (regionCountries.length > 0) {
      acc[region] = regionCountries
    }
    return acc
  }, {} as Record<string, Country[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Countries Management
            </h2>
            <p className="text-muted-foreground">
              Manage destination information, attractions, and travel content for all countries.
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Countries</p>
                <p className="text-xl font-bold text-foreground">{countries.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-lg">
                <Star className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Popular Destinations</p>
                <p className="text-xl font-bold text-foreground">{countries.filter(c => c.is_popular).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="bg-secondary p-2 rounded-lg">
                <MapPin className="h-4 w-4 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Regions Covered</p>
                <p className="text-xl font-bold text-foreground">{regions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="bg-muted p-2 rounded-lg">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Filters</p>
                <p className="text-xl font-bold text-foreground">{selectedRegion !== "all" ? 1 : 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="countries" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full h-auto p-1 bg-muted rounded-lg">
          <TabsTrigger 
            value="countries" 
            className="flex items-center gap-2 px-4 py-3 rounded-md font-medium text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Countries</span>
          </TabsTrigger>
          <TabsTrigger 
            value="statistics" 
            className="flex items-center gap-2 px-4 py-3 rounded-md font-medium text-sm data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Statistics</span>
          </TabsTrigger>
          <TabsTrigger 
            value="content-sections" 
            className="flex items-center gap-2 px-4 py-3 rounded-md font-medium text-sm data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground transition-all"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Content</span>
          </TabsTrigger>
          <TabsTrigger 
            value="attractions" 
            className="flex items-center gap-2 px-4 py-3 rounded-md font-medium text-sm data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground transition-all"
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Attractions</span>
          </TabsTrigger>
          <TabsTrigger 
            value="purposes" 
            className="flex items-center gap-2 px-4 py-3 rounded-md font-medium text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Purposes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="countries" className="space-y-6 mt-6">
          {/* Helper Card */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Countries Management</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Manage all destination countries. Add new countries, edit information, and organize by regions.
            </p>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-card p-4 rounded-lg border border-border">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => {
                setEditingCountry(createEmptyCountry())
                setIsDialogOpen(true)
              }}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add Country
            </Button>
          </div>

          {/* Countries Grid */}
          {filteredCountries.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No countries found</h3>
                <p className="text-sm">Try adjusting your search or filter criteria.</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCountries.map((country) => (
                <Card key={country.id} className="hover:shadow-md transition-all duration-200 border border-border hover:border-primary/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Globe className="h-4 w-4 text-primary" />
                          {country.name}
                          {country.is_popular && (
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          )}
                        </CardTitle>
                        <CardDescription className="text-sm flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {country.capital} • {country.region}
                        </CardDescription>
                      </div>
                      {country.is_popular && (
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
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
                      {country.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {country.description}
                        </p>
                      )}
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
          )}
        </TabsContent>

        <TabsContent value="statistics" className="mt-6">
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="text-center space-y-4">
              <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium text-foreground">Visitor Statistics</h3>
              <p className="text-muted-foreground">
                Select a specific country from the Countries tab to view and manage detailed visitor statistics, 
                demographics, and travel purpose data.
              </p>
              <Button 
                onClick={() => {}} // This would switch to countries tab
                variant="outline"
                className="mt-4"
              >
                Go to Countries Management
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="content-sections" className="mt-6">
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="text-center space-y-4 mb-6">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium text-foreground">Content Sections</h3>
              <p className="text-muted-foreground">
                Manage page sections, content blocks, and structured information for your website.
                This includes homepage content, about sections, and other static content areas.
              </p>
            </div>
            <ContentSectionsManager />
          </div>
        </TabsContent>

        <TabsContent value="attractions" className="mt-6">
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="text-center space-y-4 mb-6">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium text-foreground">Attractions Management</h3>
              <p className="text-muted-foreground">
                Manage tourist attractions, famous places, and points of interest for all countries.
                Add descriptions, images, and categorize attractions by type and popularity.
              </p>
            </div>
            <AttractionsContentManager />
          </div>
        </TabsContent>

        <TabsContent value="purposes" className="mt-6">
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="text-center space-y-4 mb-6">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium text-foreground">Travel Purposes</h3>
              <p className="text-muted-foreground">
                Manage travel purpose categories and statistics. Define why people visit different countries
                and track visitor motivations for data analysis and marketing insights.
              </p>
            </div>
            <TravelPurposeManager />
          </div>
        </TabsContent>
      </Tabs>

      {/* Country Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCountry?.id ? "Edit Country" : "Add New Country"}
            </DialogTitle>
          </DialogHeader>
          
          {editingCountry && (
            <CountryForm 
              country={editingCountry}
              onSave={saveCountry}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingCountry(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface CountryFormProps {
  country: Partial<Country>
  onSave: (country: Partial<Country>) => void
  onCancel: () => void
}

const CountryForm = ({ country, onSave, onCancel }: CountryFormProps) => {
  const [formData, setFormData] = useState(country)
  const [activeTab, setActiveTab] = useState("basic")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const updateField = (field: keyof Country, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media & Contact</TabsTrigger>
          <TabsTrigger value="lists">Lists & Facts</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Country Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Enter country name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capital">Capital City</Label>
              <Input
                id="capital"
                value={formData.capital || ''}
                onChange={(e) => updateField('capital', e.target.value)}
                placeholder="Enter capital city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region *</Label>
              <Select 
                value={formData.region || ''} 
                onValueChange={(value) => updateField('region', value)}
              >
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
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={formData.currency || ''}
                onChange={(e) => updateField('currency', e.target.value)}
                placeholder="Enter currency"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_popular"
              checked={formData.is_popular || false}
              onCheckedChange={(checked) => updateField('is_popular', checked)}
            />
            <Label htmlFor="is_popular">Mark as popular destination</Label>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="climate">Climate</Label>
              <Input
                id="climate"
                value={formData.climate || ''}
                onChange={(e) => updateField('climate', e.target.value)}
                placeholder="Enter climate description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="best_season">Best Season</Label>
              <Input
                id="best_season"
                value={formData.best_season || ''}
                onChange={(e) => updateField('best_season', e.target.value)}
                placeholder="Enter best season to visit"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="annual_visitors">Annual Visitors</Label>
              <Input
                id="annual_visitors"
                type="number"
                value={formData.annual_visitors || ''}
                onChange={(e) => updateField('annual_visitors', parseInt(e.target.value) || null)}
                placeholder="Number of annual visitors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="languages">Languages</Label>
              <Input
                id="languages"
                value={Array.isArray(formData.languages) ? formData.languages.join(', ') : ''}
                onChange={(e) => updateField('languages', e.target.value.split(',').map(lang => lang.trim()))}
                placeholder="Languages spoken (comma separated)"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="speciality">Speciality</Label>
            <Input
              id="speciality"
              value={formData.speciality || ''}
              onChange={(e) => updateField('speciality', e.target.value)}
              placeholder="What makes this country special?"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="culture">Culture</Label>
            <Textarea
              id="culture"
              value={formData.culture || ''}
              onChange={(e) => updateField('culture', e.target.value)}
              placeholder="Describe the culture"
              rows={3}
            />
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">General Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Enter country description"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="overview_description">Overview Description</Label>
            <Textarea
              id="overview_description"
              value={formData.overview_description || ''}
              onChange={(e) => updateField('overview_description', e.target.value)}
              placeholder="Enter overview description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="about_content">About Content</Label>
            <Textarea
              id="about_content"
              value={formData.about_content || ''}
              onChange={(e) => updateField('about_content', e.target.value)}
              placeholder="Enter about content"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="best_time_content">Best Time to Visit</Label>
            <Textarea
              id="best_time_content"
              value={formData.best_time_content || ''}
              onChange={(e) => updateField('best_time_content', e.target.value)}
              placeholder="Enter best time to visit information"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="food_shopping_content">Food & Shopping</Label>
            <Textarea
              id="food_shopping_content"
              value={formData.food_shopping_content || ''}
              onChange={(e) => updateField('food_shopping_content', e.target.value)}
              placeholder="Enter food and shopping information"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="art_culture_content">Art & Culture</Label>
            <Textarea
              id="art_culture_content"
              value={formData.art_culture_content || ''}
              onChange={(e) => updateField('art_culture_content', e.target.value)}
              placeholder="Enter art and culture information"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="travel_tips">Travel Tips</Label>
            <Textarea
              id="travel_tips"
              value={formData.travel_tips || ''}
              onChange={(e) => updateField('travel_tips', e.target.value)}
              placeholder="Enter travel tips"
              rows={4}
            />
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hero_image_url">Hero Image URL</Label>
              <Input
                id="hero_image_url"
                value={formData.hero_image_url || ''}
                onChange={(e) => updateField('hero_image_url', e.target.value)}
                placeholder="Enter hero image URL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="map_outline_url">Map Outline URL</Label>
              <Input
                id="map_outline_url"
                value={formData.map_outline_url || ''}
                onChange={(e) => updateField('map_outline_url', e.target.value)}
                placeholder="Enter map outline URL"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Contact Information</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email</Label>
                <Input
                  id="contact_email"
                  value={formData.contact_email || ''}
                  onChange={(e) => updateField('contact_email', e.target.value)}
                  placeholder="Contact email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Phone</Label>
                <Input
                  id="contact_phone"
                  value={formData.contact_phone || ''}
                  onChange={(e) => updateField('contact_phone', e.target.value)}
                  placeholder="Contact phone"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Visitor Demographics</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="gender_male_percentage">Male Visitors (%)</Label>
                <Input
                  id="gender_male_percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.gender_male_percentage || ''}
                  onChange={(e) => updateField('gender_male_percentage', parseInt(e.target.value) || null)}
                  placeholder="Male percentage"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender_female_percentage">Female Visitors (%)</Label>
                <Input
                  id="gender_female_percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.gender_female_percentage || ''}
                  onChange={(e) => updateField('gender_female_percentage', parseInt(e.target.value) || null)}
                  placeholder="Female percentage"
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="lists" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Fun Facts</Label>
              <div className="space-y-2 p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Add interesting facts about the country (JSON array format)</p>
                <Textarea
                  value={JSON.stringify(formData.fun_facts || [], null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      updateField('fun_facts', parsed)
                    } catch (error) {
                      // Handle JSON parsing error
                    }
                  }}
                  placeholder='["Fact 1", "Fact 2", "Fact 3"]'
                  rows={4}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Before You Go Tips</Label>
              <div className="space-y-2 p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Important tips for travelers (JSON array format)</p>
                <Textarea
                  value={JSON.stringify(formData.before_you_go_tips || [], null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      updateField('before_you_go_tips', parsed)
                    } catch (error) {
                      // Handle JSON parsing error
                    }
                  }}
                  placeholder='["Tip 1", "Tip 2", "Tip 3"]'
                  rows={4}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Reasons to Visit</Label>
              <div className="space-y-2 p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Top reasons to visit this country (JSON array format)</p>
                <Textarea
                  value={JSON.stringify(formData.reasons_to_visit || [], null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      updateField('reasons_to_visit', parsed)
                    } catch (error) {
                      // Handle JSON parsing error
                    }
                  }}
                  placeholder='["Reason 1", "Reason 2", "Reason 3"]'
                  rows={4}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug || ''}
                onChange={(e) => updateField('slug', e.target.value)}
                placeholder="country-url-slug"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Dos and Don'ts</Label>
              <div className="space-y-2 p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Cultural dos and don'ts (JSON object format)</p>
                <Textarea
                  value={JSON.stringify(formData.dos_donts || {}, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      updateField('dos_donts', parsed)
                    } catch (error) {
                      // Handle JSON parsing error
                    }
                  }}
                  placeholder='{"dos": ["Do this", "Do that"], "donts": ["Dont do this", "Dont do that"]}'
                  rows={6}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Hero Images</Label>
              <div className="space-y-2 p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Multiple hero images (JSON array format)</p>
                <Textarea
                  value={JSON.stringify(formData.hero_images || [], null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      updateField('hero_images', parsed)
                    } catch (error) {
                      // Handle JSON parsing error
                    }
                  }}
                  placeholder='[{"url": "image1.jpg", "alt": "Description"}, {"url": "image2.jpg", "alt": "Description"}]'
                  rows={4}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Visitor Statistics</Label>
              <div className="space-y-2 p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Complete visitor statistics (JSON object format)</p>
                <Textarea
                  value={JSON.stringify(formData.visitor_statistics || {}, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      updateField('visitor_statistics', parsed)
                    } catch (error) {
                      // Handle JSON parsing error
                    }
                  }}
                  placeholder='{"annual": 1000000, "gender": {"male": 45, "female": 55}, "purposes": [], "topOrigins": []}'
                  rows={6}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {country.id ? "Update Country" : "Create Country"}
        </Button>
      </div>
    </form>
  )
}