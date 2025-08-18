import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/integrations/supabase/types"

type DatabasePackage = Database['public']['Tables']['packages']['Row']
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "./ImageUpload"

export const PackageManager = () => {
  const [packages, setPackages] = useState<DatabasePackage[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPackage, setEditingPackage] = useState<DatabasePackage | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const regions = ["Asia", "Europe", "Africa", "Americas", "Pacific Islands", "Middle East"]
  const categories = ["Adventure", "Luxury", "Family", "Honeymoon", "Wildlife", "Cultural", "Beach", "Mountain"]

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

  const savePackage = async (packageData: Partial<DatabasePackage> & {category: string, country: string, duration: string, image: string, title: string, region: string}) => {
    try {
      if (packageData.id) {
        // Update existing package
        const { error } = await supabase
          .from('packages')
          .update(packageData)
          .eq('id', packageData.id)

        if (error) throw error
      } else {
        // Create new package
        const { error } = await supabase
          .from('packages')
          .insert([packageData as any])

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

  const openEditDialog = (pkg?: DatabasePackage) => {
    setEditingPackage(pkg || createEmptyPackage())
    setIsDialogOpen(true)
  }

  const createEmptyPackage = (): DatabasePackage => ({
    id: '',
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
    overview_section_title: null,
    overview_description: null,
    overview_highlights_label: null,
    overview_badge_variant: null,
    overview_badge_style: null,
    itinerary: [],
    featured: false,
    created_at: null,
    updated_at: null
  })

  if (loading) {
    return <div className="flex justify-center p-8">Loading packages...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Travel Packages</h2>
          <p className="text-muted-foreground">Manage your travel packages</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openEditDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPackage?.id ? 'Edit Package' : 'Create New Package'}
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

      <div className="grid gap-4">
        {packages.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{pkg.title}</CardTitle>
                  <CardDescription>
                    {pkg.country} • {pkg.region} • {pkg.duration}
                  </CardDescription>
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
              <div className="flex gap-4 items-center">
                <Badge variant="secondary">{pkg.category}</Badge>
                {pkg.featured && <Badge variant="default">Featured</Badge>}
                <span className="text-sm text-muted-foreground">
                  ₹{pkg.price} • ⭐ {pkg.rating} ({pkg.reviews} reviews)
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

interface PackageFormProps {
  package: DatabasePackage
  onSave: (pkg: Partial<DatabasePackage>) => void
  regions: string[]
  categories: string[]
}

const PackageForm = ({ package: pkg, onSave, regions, categories }: PackageFormProps) => {
  const [formData, setFormData] = useState(pkg)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const updateField = (field: keyof DatabasePackage, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateArrayField = (field: keyof DatabasePackage, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean)
    updateField(field, items)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => updateField('country', e.target.value)}
            required
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
              {regions.map(region => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => updateField('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => updateField('duration', e.target.value)}
            placeholder="e.g., 7 Days / 6 Nights"
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            value={formData.price}
            onChange={(e) => updateField('price', e.target.value)}
            placeholder="e.g., ₹45,000"
            required
          />
        </div>
        <div>
          <Label htmlFor="group_size">Group Size</Label>
          <Input
            id="group_size"
            value={formData.group_size}
            onChange={(e) => updateField('group_size', e.target.value)}
            placeholder="e.g., 2-8 people"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="highlights">Highlights (comma-separated)</Label>
        <Textarea
          id="highlights"
          value={formData.highlights.join(', ')}
          onChange={(e) => updateArrayField('highlights', e.target.value)}
          placeholder="Beautiful beaches, Local cuisine, Cultural sites"
        />
      </div>

      <div>
        <Label htmlFor="inclusions">Inclusions (comma-separated)</Label>
        <Textarea
          id="inclusions"
          value={formData.inclusions.join(', ')}
          onChange={(e) => updateArrayField('inclusions', e.target.value)}
          placeholder="Flights, Hotels, Breakfast, Tour guide"
        />
      </div>

      <div>
        <Label htmlFor="exclusions">Exclusions (comma-separated)</Label>
        <Textarea
          id="exclusions"
          value={formData.exclusions.join(', ')}
          onChange={(e) => updateArrayField('exclusions', e.target.value)}
          placeholder="Lunch, Dinner, Personal expenses"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="best_time">Best Time to Visit</Label>
          <Input
            id="best_time"
            value={formData.best_time}
            onChange={(e) => updateField('best_time', e.target.value)}
            placeholder="e.g., Nov - Apr"
          />
        </div>
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

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Save Package
        </Button>
      </div>
    </form>
  )
}