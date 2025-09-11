import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Globe, MapPin, Star, Search, FileText, BookOpen } from "lucide-react"
import { ContentSectionsManager } from "./ContentSectionsManager"
import { AttractionsContentManager } from "./AttractionsContentManager"
import { TravelPurposeManager } from "./TravelPurposeManager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Database } from "@/integrations/supabase/types"

type Country = Database['public']['Tables']['countries']['Row']

const createEmptyCountry = (): Partial<Country> => ({
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
  overview_description: '',
  about_content: '',
  best_time_content: '',
  food_shopping_content: '',
  art_culture_content: '',
  travel_tips: '',
  is_popular: false,
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
        const { error } = await supabase
          .from('countries')
          .update(country)
          .eq('id', country.id)
        
        if (error) throw error
      } else {
        const countryData = { ...country }
        delete countryData.id
        
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-foreground">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Countries Management</h1>
          <p className="text-muted-foreground">Manage all destination countries and their information</p>
        </div>
        <Button onClick={() => { setEditingCountry(createEmptyCountry()); setIsDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Country
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-[200px]">
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

      {/* Tabs Navigation */}
      <Tabs defaultValue="countries" className="w-full">
        <TabsList className="inline-flex w-full flex-wrap items-stretch bg-muted p-1 rounded-lg text-muted-foreground gap-1 [&>button]:flex-1 [&>button]:basis-full sm:[&>button]:basis-1/3 [&>button]:justify-center [&>button]:h-10">
          <TabsTrigger value="countries" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Countries
          </TabsTrigger>
          <TabsTrigger value="content-sections" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="attractions" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Attractions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="countries" className="space-y-6 mt-6">
          {/* Countries Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Countries</CardTitle>
              <CardDescription>Manage all destination countries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCountries.map((country) => (
                  <Card key={country.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base text-foreground">{country.name}</CardTitle>
                          <CardDescription>{country.capital} • {country.region}</CardDescription>
                        </div>
                        {country.is_popular && (
                          <Badge variant="secondary">Popular</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="text-sm text-muted-foreground">
                          Currency: {country.currency || 'N/A'}
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
        </TabsContent>

        <TabsContent value="content-sections" className="mt-6">
          <ContentSectionsManager />
        </TabsContent>

        <TabsContent value="attractions" className="mt-6">
          <AttractionsContentManager />
        </TabsContent>
      </Tabs>

      {/* Country Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCountry?.id ? 'Edit Country' : 'Add New Country'}
            </DialogTitle>
          </DialogHeader>
          
          {editingCountry && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Country Name *</Label>
                  <Input
                    id="name"
                    value={editingCountry.name || ''}
                    onChange={(e) => setEditingCountry({...editingCountry, name: e.target.value})}
                    placeholder="Enter country name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={editingCountry.slug || ''}
                    onChange={(e) => setEditingCountry({...editingCountry, slug: e.target.value})}
                    placeholder="country-name-slug"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region *</Label>
                  <Select value={editingCountry.region || ''} onValueChange={(value) => setEditingCountry({...editingCountry, region: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capital">Capital</Label>
                  <Input
                    id="capital"
                    value={editingCountry.capital || ''}
                    onChange={(e) => setEditingCountry({...editingCountry, capital: e.target.value})}
                    placeholder="Capital city"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={editingCountry.currency || ''}
                    onChange={(e) => setEditingCountry({...editingCountry, currency: e.target.value})}
                    placeholder="Currency code"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="climate">Climate</Label>
                  <Input
                    id="climate"
                    value={editingCountry.climate || ''}
                    onChange={(e) => setEditingCountry({...editingCountry, climate: e.target.value})}
                    placeholder="Climate type"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="best_season">Best Season</Label>
                  <Input
                    id="best_season"
                    value={editingCountry.best_season || ''}
                    onChange={(e) => setEditingCountry({...editingCountry, best_season: e.target.value})}
                    placeholder="Best time to visit"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="speciality">Speciality</Label>
                  <Input
                    id="speciality"
                    value={editingCountry.speciality || ''}
                    onChange={(e) => setEditingCountry({...editingCountry, speciality: e.target.value})}
                    placeholder="What the country is known for"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingCountry.description || ''}
                  onChange={(e) => setEditingCountry({...editingCountry, description: e.target.value})}
                  placeholder="Country description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero_image_url">Hero Image URL</Label>
                <Input
                  id="hero_image_url"
                  value={editingCountry.hero_image_url || ''}
                  onChange={(e) => setEditingCountry({...editingCountry, hero_image_url: e.target.value})}
                  placeholder="Image URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="overview_description">Overview Description</Label>
                <Textarea
                  id="overview_description"
                  value={editingCountry.overview_description || ''}
                  onChange={(e) => setEditingCountry({...editingCountry, overview_description: e.target.value})}
                  placeholder="Overview content"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about_content">About Content</Label>
                <Textarea
                  id="about_content"
                  value={editingCountry.about_content || ''}
                  onChange={(e) => setEditingCountry({...editingCountry, about_content: e.target.value})}
                  placeholder="About section content"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="travel_tips">Travel Tips</Label>
                <Textarea
                  id="travel_tips"
                  value={editingCountry.travel_tips || ''}
                  onChange={(e) => setEditingCountry({...editingCountry, travel_tips: e.target.value})}
                  placeholder="Travel tips and advice"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_popular"
                  checked={editingCountry.is_popular || false}
                  onCheckedChange={(checked) => setEditingCountry({...editingCountry, is_popular: checked as boolean})}
                />
                <Label htmlFor="is_popular">Mark as Popular Destination</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => saveCountry(editingCountry)}>
                  {editingCountry.id ? 'Update Country' : 'Create Country'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}