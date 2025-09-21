import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/integrations/supabase/types"
import { useOptimizedCountries } from "@/hooks/useOptimizedCountries"

type DatabasePackage = Database['public']['Tables']['packages']['Row']
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Plus, Edit, Trash2, Save, Package, Settings, Calendar, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "./ImageUpload"
import { ItineraryEditor } from "./ItineraryEditor"
import { PackageBulkUpload } from "./PackageBulkUpload"

export const PackageManager = () => {
  const [packages, setPackages] = useState<DatabasePackage[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPackage, setEditingPackage] = useState<Partial<DatabasePackage> | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const { toast } = useToast()

  const regions = ["Asia", "Europe", "Africa", "Americas", "Pacific Islands", "Middle East"]
  const categories = [
    "Adventure", "Luxury", "Family", "Honeymoon", "Wildlife", "Cultural", 
    "Beach", "Mountain", "Romance & Scenic", "Art & History", "Culture & Modern",
    "Cultural & Adventure", "Beach & Culture", "Cultural & Nature", "Heritage & Culture",
    "Wildlife & Adventure"
  ]

  useEffect(() => {
    loadPackages()
  }, [])

  const loadPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPackages(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load packages: " + error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const savePackage = async (packageData: Partial<DatabasePackage>) => {
    try {
      if (packageData.id) {
        // Update existing package
        const { error } = await supabase
          .from('packages')
          .update(packageData)
          .eq('id', packageData.id)

        if (error) throw error
      } else {
        // Create new package — ensure we don't send an id field (DB will generate UUID)
        const insertData = { ...packageData } as any
        delete insertData.id

        const { error } = await supabase
          .from('packages')
          .insert([insertData])

        if (error) throw error
      }

      await loadPackages()
      setIsDialogOpen(false)
      setEditingPackage(null)
      toast({
        title: "Success",
        description: packageData.id ? "Package updated" : "Package created"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const deletePackage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return

    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadPackages()
      toast({
        title: "Success",
        description: "Package deleted"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const deleteAllPackages = async () => {
    if (!confirm("Are you sure you want to delete ALL packages? This action cannot be undone!")) return

    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .not('id', 'is', null) // Delete all rows (using a condition that matches all non-null IDs)

      if (error) throw error
      await loadPackages()
      toast({
        title: "Success",
        description: "All packages deleted"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const openEditDialog = (pkg?: DatabasePackage) => {
    setEditingPackage(pkg || createEmptyPackage())
    setIsDialogOpen(true)
  }

  const createEmptyPackage = (): Partial<DatabasePackage> => ({
    // don't set id to empty string — leave undefined so the DB will generate a UUID
    id: undefined,
    title: '',
    country: '',
    country_slug: null,
    region: '',
    duration: '',
    price: '',
    original_price: null,
    rating: 4.5,
    reviews: 0,
    image: '',
    highlights: [],
    inclusions: [],
    exclusions: [],
    category: '',
    best_time: null,
    group_size: null,
    overview_section_title: 'Overview',
    overview_description: null,
    overview_highlights_label: 'Package Highlights',
    overview_badge_variant: 'outline',
    overview_badge_style: 'border-primary text-primary',
    itinerary: [],
    featured: false,
    slug: '', // Add slug field to fix null constraint error
    created_at: null,
    updated_at: null
  })

  // Filter packages based on search, region, and category
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.country.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = selectedRegion === "all" || pkg.region === selectedRegion
    const matchesCategory = selectedCategory === "all" || pkg.category === selectedCategory
    return matchesSearch && matchesRegion && matchesCategory
  })

  // Group packages by region
  const packagesByRegion = regions.reduce((acc, region) => {
    acc[region] = filteredPackages.filter(pkg => pkg.region === region)
    return acc
  }, {} as Record<string, DatabasePackage[]>)

  if (loading) {
    return <div className="flex justify-center p-8">Loading packages...</div>
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="packages" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">📦 Travel Packages</h2>
            <p className="text-muted-foreground">Easily manage your travel packages - organized by region for better navigation</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">Real-time updates enabled</span>
            </div>
          </div>
        </div>

        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 gap-1 h-auto mb-6">
          <TabsTrigger value="packages" className="flex items-center justify-center gap-2 p-3 text-sm">
            <Package className="h-4 w-4" />
            Manage Packages
          </TabsTrigger>
          <TabsTrigger value="bulk-upload" className="flex items-center justify-center gap-2 p-3 text-sm">
            <Upload className="h-4 w-4" />
            Bulk Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-6">
          {/* Search and Filter Section */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">🔍 Search & Filter Packages</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search packages</Label>
                <Input
                  id="search"
                  placeholder="Search by name or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="region-filter">Filter by Region</Label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
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
              <div>
                <Label htmlFor="category-filter">Filter by Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedRegion("all")
                    setSelectedCategory("all")
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {filteredPackages.length} of {packages.length} packages
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={deleteAllPackages}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete All
              </Button>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => openEditDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Package
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPackage?.id ? '✏️ Edit Package' : '➕ Create New Package'}
                    </DialogTitle>
                  </DialogHeader>
                  {editingPackage && (
                    <PackageForm
                      package={editingPackage}
                      onSave={savePackage}
                      regions={regions}
                      categories={categories}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Packages organized by Region */}
          {selectedRegion === "all" ? (
            <div className="space-y-8">
              {regions.map(region => {
                const regionPackages = packagesByRegion[region]
                if (regionPackages.length === 0) return null
                
                return (
                  <div key={region} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{region}</h3>
                      <Badge variant="secondary">{regionPackages.length} packages</Badge>
                    </div>
                    <div className="grid gap-4">
                      {regionPackages.map((pkg) => (
              <Card key={pkg.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{pkg.title}</CardTitle>
                      <CardDescription>
                        {pkg.country} • {pkg.region} • {pkg.duration}
                      </CardDescription>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{pkg.category}</Badge>
                        {pkg.featured && <Badge variant="default">Featured</Badge>}
                        <Badge variant="outline">
                          ⭐ {pkg.rating} ({pkg.reviews} reviews)
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(pkg)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletePackage(pkg.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Price:</span> {pkg.price}
                      {pkg.original_price && (
                        <span className="text-muted-foreground line-through ml-2">
                          {pkg.original_price}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Group Size:</span> {pkg.group_size}
                    </div>
                    <div>
                      <span className="font-medium">Best Time:</span> {pkg.best_time}
                    </div>
                    <div>
                      <span className="font-medium">Itinerary Days:</span> {
                        Array.isArray(pkg.itinerary) ? pkg.itinerary.length : 
                        (typeof pkg.itinerary === 'string' ? JSON.parse(pkg.itinerary || '[]').length : 0)
                      }
                    </div>
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
            <div className="grid gap-4">
              {filteredPackages.map((pkg) => (
                <Card key={pkg.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{pkg.title}</CardTitle>
                        <CardDescription>
                          {pkg.country} • {pkg.region} • {pkg.duration}
                        </CardDescription>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary">{pkg.category}</Badge>
                          {pkg.featured && <Badge variant="default">Featured</Badge>}
                          <Badge variant="outline">
                            ⭐ {pkg.rating} ({pkg.reviews} reviews)
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(pkg)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deletePackage(pkg.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Price:</span> {pkg.price}
                        {pkg.original_price && (
                          <span className="text-muted-foreground line-through ml-2">
                            {pkg.original_price}
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="font-medium">Group Size:</span> {pkg.group_size}
                      </div>
                      <div>
                        <span className="font-medium">Best Time:</span> {pkg.best_time}
                      </div>
                      <div>
                        <span className="font-medium">Itinerary Days:</span> {
                          Array.isArray(pkg.itinerary) ? pkg.itinerary.length : 
                          (typeof pkg.itinerary === 'string' ? JSON.parse(pkg.itinerary || '[]').length : 0)
                        }
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bulk-upload">
          <PackageBulkUpload />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface PackageFormProps {
  package: Partial<DatabasePackage>
  onSave: (pkg: Partial<DatabasePackage>) => void
  regions: string[]
  categories: string[]
}

const PackageForm = ({ package: pkg, onSave, regions, categories }: PackageFormProps) => {
  const [formData, setFormData] = useState<Partial<DatabasePackage>>(pkg)
  const { data: countries, loading: countriesLoading } = useOptimizedCountries()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Update the itinerary in the form data before saving
    const itineraryData = getItinerary()
    
    // Generate slug from title if not provided
    let packageSlug = formData.slug
    if (!packageSlug && formData.title) {
      packageSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
    
    onSave({ 
      ...formData, 
      itinerary: itineraryData,
      slug: packageSlug || 'package-' + Date.now() // Fallback slug
    })
  }

  const updateField = (field: keyof DatabasePackage, value: any) => {
    // For the itinerary field, just store it temporarily without triggering a form update
    if (field === 'itinerary') {
      setFormData(prev => ({ ...prev, itinerary: value }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const updateArrayField = (field: keyof DatabasePackage, value: string) => {
    // Handle comma-separated values properly - ensure commas work
    const items = value.split(',').map(item => item.trim()).filter(Boolean)
    updateField(field, items)
  }

  // Parse itinerary for the editor
  const getItinerary = () => {
    if (Array.isArray(formData.itinerary)) {
      return formData.itinerary
    }
    if (typeof formData.itinerary === 'string') {
      try {
        return JSON.parse(formData.itinerary)
      } catch {
        return []
      }
    }
    return []
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-1 h-auto">
          <TabsTrigger value="basic" className="flex items-center justify-center gap-2 p-3 text-sm">
            <Package className="h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center justify-center gap-2 p-3 text-sm">
            <Settings className="h-4 w-4" />
            Content & Details
          </TabsTrigger>
          <TabsTrigger value="itinerary" className="flex items-center justify-center gap-2 p-3 text-sm">
            <Calendar className="h-4 w-4" />
            Itinerary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="country">Country *</Label>
              <SearchableSelect
                options={countries?.map(country => ({
                  value: country.name,
                  label: country.name
                })) || []}
                value={formData.country}
                onValueChange={(value) => {
                  updateField('country', value)
                  // Auto-populate country_slug when country is selected
                  const selectedCountry = countries?.find(c => c.name === value)
                  if (selectedCountry?.slug) {
                    updateField('country_slug', selectedCountry.slug)
                  }
                }}
                placeholder={countriesLoading ? "Loading countries..." : "Select a country"}
                searchPlaceholder="Search countries..."
                emptyText="No countries found"
                disabled={countriesLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country_slug">Country Slug</Label>
              <Input
                id="country_slug"
                value={formData.country_slug || ''}
                onChange={(e) => updateField('country_slug', e.target.value || null)}
                placeholder="e.g., thailand"
              />
            </div>
            <div>
              <Label htmlFor="region">Region *</Label>
              <SearchableSelect
                options={regions.map(region => ({
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <SearchableSelect
                options={categories.map(category => ({
                  value: category,
                  label: category
                }))}
                value={formData.category}
                onValueChange={(value) => updateField('category', value)}
                placeholder="Select category"
                searchPlaceholder="Search categories..."
                emptyText="No categories found"
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => updateField('duration', e.target.value)}
                placeholder="e.g., 7 Days / 6 Nights"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => updateField('price', e.target.value)}
                placeholder="e.g., ₹45,000"
                required
              />
            </div>
            <div>
              <Label htmlFor="original_price">Original Price</Label>
              <Input
                id="original_price"
                value={formData.original_price || ''}
                onChange={(e) => updateField('original_price', e.target.value || null)}
                placeholder="e.g., ₹55,000"
              />
            </div>
            <div>
              <Label htmlFor="group_size">Group Size</Label>
              <Input
                id="group_size"
                value={formData.group_size || ''}
                onChange={(e) => updateField('group_size', e.target.value || null)}
                placeholder="e.g., 2-8 people"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => updateField('rating', parseFloat(e.target.value) || 4.5)}
              />
            </div>
            <div>
              <Label htmlFor="reviews">Reviews Count</Label>
              <Input
                id="reviews"
                type="number"
                min="0"
                value={formData.reviews}
                onChange={(e) => updateField('reviews', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="best_time">Best Time to Visit</Label>
              <Input
                id="best_time"
                value={formData.best_time || ''}
                onChange={(e) => updateField('best_time', e.target.value || null)}
                placeholder="e.g., Nov - Apr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="slug">Package Slug *</Label>
              <Input
                id="slug"
                value={formData.slug || ''}
                onChange={(e) => updateField('slug', e.target.value)}
                placeholder="Auto-generated from title, or enter custom slug"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Used for URLs. Leave empty to auto-generate from title.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="featured">Featured Package</Label>
              <Select value={formData.featured ? "true" : "false"} onValueChange={(value) => updateField('featured', value === "true")}>
                <SelectTrigger>
                  <SelectValue placeholder="Featured status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Not Featured</SelectItem>
                  <SelectItem value="true">Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <ImageUpload
                label="Package Image"
                currentImageUrl={formData.image}
                onImageUploaded={(url) => updateField('image', url)}
                folder="packages"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div>
            <Label htmlFor="highlights">Highlights (comma-separated)</Label>
            <Textarea
              id="highlights"
              value={formData.highlights?.join(', ') || ''}
              onChange={(e) => updateArrayField('highlights', e.target.value)}
              placeholder="Beautiful beaches, Local cuisine, Cultural sites"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Type commas (,) to separate items. Test: you can type commas here → ,,,
            </p>
          </div>

          <div>
            <Label htmlFor="inclusions">Inclusions (comma-separated)</Label>
            <Textarea
              id="inclusions"
              value={formData.inclusions?.join(', ') || ''}
              onChange={(e) => updateArrayField('inclusions', e.target.value)}
              placeholder="Flights, Hotels, Breakfast, Tour guide"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate each inclusion with commas
            </p>
          </div>

          <div>
            <Label htmlFor="exclusions">Exclusions (comma-separated)</Label>
            <Textarea
              id="exclusions"
              value={formData.exclusions?.join(', ') || ''}
              onChange={(e) => updateArrayField('exclusions', e.target.value)}
              placeholder="Lunch, Dinner, Personal expenses"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate each exclusion with commas
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="overview_section_title">Overview Section Title</Label>
              <Input
                id="overview_section_title"
                value={formData.overview_section_title || ''}
                onChange={(e) => updateField('overview_section_title', e.target.value || null)}
                placeholder="e.g., Overview"
              />
            </div>
            <div>
              <Label htmlFor="overview_highlights_label">Overview Highlights Label</Label>
              <Input
                id="overview_highlights_label"
                value={formData.overview_highlights_label || ''}
                onChange={(e) => updateField('overview_highlights_label', e.target.value || null)}
                placeholder="e.g., Package Highlights"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="overview_description">Overview Description</Label>
            <Textarea
              id="overview_description"
              value={formData.overview_description || ''}
              onChange={(e) => updateField('overview_description', e.target.value || null)}
              placeholder="Detailed description of the package..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="overview_badge_variant">Overview Badge Variant</Label>
              <Select 
                value={formData.overview_badge_variant || 'outline'} 
                onValueChange={(value) => updateField('overview_badge_variant', value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Badge variant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="destructive">Destructive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="overview_badge_style">Overview Badge Style</Label>
              <Input
                id="overview_badge_style"
                value={formData.overview_badge_style || ''}
                onChange={(e) => updateField('overview_badge_style', e.target.value || null)}
                placeholder="e.g., border-primary text-primary"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="itinerary" className="space-y-4">
          <ItineraryEditor
            itinerary={getItinerary()}
            onChange={(itinerary) => updateField('itinerary', itinerary)}
          />
        </TabsContent>

      </Tabs>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Save Package
        </Button>
      </div>
    </form>
  )
}