import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Globe, MapPin } from "lucide-react"
import { ImageUpload } from "./ImageUpload"
import type { Database } from "@/integrations/supabase/types"

type Country = Database['public']['Tables']['countries']['Row']
type FamousPlace = Database['public']['Tables']['famous_places']['Row']
type EssentialTip = Database['public']['Tables']['essential_tips']['Row']
type TravelPurpose = Database['public']['Tables']['travel_purposes']['Row']
type CountryFAQ = Database['public']['Tables']['country_faqs']['Row']

export const CountryManager = () => {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCountry, setEditingCountry] = useState<Country | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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
        // Create new country
        const { error } = await supabase
          .from('countries')
          .insert([countryData as any])

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

  const createEmptyCountry = (): Country => ({
    id: '',
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
    created_at: null,
    updated_at: null
  })

  if (loading) {
    return <div className="text-center">Loading countries...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Countries Management</h2>
          <p className="text-muted-foreground">Manage country details, places, and information</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCountry(createEmptyCountry())}>
              <Plus className="h-4 w-4 mr-2" />
              Add Country
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {countries.map((country) => (
          <Card key={country.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {country.name}
              </CardTitle>
              <CardDescription>
                <MapPin className="h-4 w-4 inline mr-1" />
                {country.region} • {country.capital}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  <p>Currency: {country.currency}</p>
                  <p>Best Season: {country.best_season}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingCountry(country)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCountry(country.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

interface CountryFormProps {
  country: Country
  onSave: (country: Partial<Country>) => void
  onCancel: () => void
}

const CountryForm = ({ country, onSave, onCancel }: CountryFormProps) => {
  const [formData, setFormData] = useState<Country>(country)
  const [languages, setLanguages] = useState<string>(country.languages?.join(', ') || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const dataToSave = {
      ...formData,
      languages: languages.split(',').map(lang => lang.trim()).filter(Boolean),
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
    }
    
    onSave(dataToSave)
  }

  const updateField = (field: keyof Country, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Label htmlFor="speciality">Speciality</Label>
        <Textarea
          id="speciality"
          value={formData.speciality || ''}
          onChange={(e) => updateField('speciality', e.target.value)}
          placeholder="What makes this country special?"
        />
      </div>

      <div>
        <Label htmlFor="culture">Culture</Label>
        <Textarea
          id="culture"
          value={formData.culture || ''}
          onChange={(e) => updateField('culture', e.target.value)}
          placeholder="Cultural highlights and traditions"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="annual_visitors">Annual Visitors</Label>
          <Input
            id="annual_visitors"
            type="number"
            value={formData.annual_visitors || ''}
            onChange={(e) => updateField('annual_visitors', parseInt(e.target.value) || null)}
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

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {formData.id ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}