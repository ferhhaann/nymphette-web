import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, BarChart3 } from "lucide-react"
import type { Database } from "@/integrations/supabase/types"

type CountryBasic = { id: string; name: string; slug: string }
type TravelPurpose = Database['public']['Tables']['travel_purposes']['Row']

interface TravelPurposeForm {
  id?: string
  country_id: string
  name: string
  display_name?: string
  percentage: number
  color?: string
}

export const TravelPurposeManager = () => {
  const [countries, setCountries] = useState<CountryBasic[]>([])
  const [travelPurposes, setTravelPurposes] = useState<TravelPurpose[]>([])
  const [selectedCountryId, setSelectedCountryId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [editingPurpose, setEditingPurpose] = useState<TravelPurposeForm | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadCountries()
  }, [])

  useEffect(() => {
    if (selectedCountryId) {
      loadTravelPurposes()
    }
  }, [selectedCountryId])

  const loadCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('id, name, slug')
        .order('name')

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

  const loadTravelPurposes = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_purposes')
        .select('*')
        .eq('country_id', selectedCountryId)
        .order('percentage', { ascending: false })

      if (error) throw error
      setTravelPurposes(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load travel purposes: " + error.message,
        variant: "destructive"
      })
    }
  }

  const saveTravelPurpose = async (purposeData: TravelPurposeForm) => {
    try {
      if (purposeData.id) {
        // Update existing
        const { error } = await supabase
          .from('travel_purposes')
          .update({
            name: purposeData.name,
            display_name: purposeData.display_name,
            percentage: purposeData.percentage,
            color: purposeData.color
          })
          .eq('id', purposeData.id)

        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase
          .from('travel_purposes')
          .insert([{
            country_id: purposeData.country_id,
            name: purposeData.name,
            display_name: purposeData.display_name,
            percentage: purposeData.percentage,
            color: purposeData.color || '#8B5CF6'
          }])

        if (error) throw error
      }

      await loadTravelPurposes()
      setIsDialogOpen(false)
      setEditingPurpose(null)
      toast({
        title: "Success",
        description: purposeData.id ? "Travel purpose updated" : "Travel purpose created"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const deleteTravelPurpose = async (id: string) => {
    if (!confirm("Are you sure you want to delete this travel purpose?")) return

    try {
      const { error } = await supabase
        .from('travel_purposes')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadTravelPurposes()
      toast({
        title: "Success",
        description: "Travel purpose deleted"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const createNewPurpose = () => {
    setEditingPurpose({
      country_id: selectedCountryId,
      name: '',
      display_name: '',
      percentage: 0,
      color: '#8B5CF6'
    })
    setIsDialogOpen(true)
  }

  const editPurpose = (purpose: TravelPurpose) => {
    setEditingPurpose({
      id: purpose.id,
      country_id: purpose.country_id || selectedCountryId,
      name: purpose.name,
      display_name: purpose.display_name || '',
      percentage: purpose.percentage,
      color: purpose.color || '#8B5CF6'
    })
    setIsDialogOpen(true)
  }

  if (loading) {
    return <div className="text-center">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">📊 Travel Purposes Management</h2>
          <p className="text-muted-foreground">Manage travel purposes and visitor statistics for countries</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Country</CardTitle>
          <CardDescription>Choose a country to manage its travel purposes</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedCountryId} onValueChange={setSelectedCountryId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map(country => (
                <SelectItem key={country.id} value={country.id}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedCountryId && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Travel Purposes for {countries.find(c => c.id === selectedCountryId)?.name}
                </CardTitle>
                <CardDescription>
                  Manage visitor travel purposes and their percentages
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={createNewPurpose}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Purpose
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingPurpose?.id ? 'Edit Travel Purpose' : 'Add New Travel Purpose'}
                    </DialogTitle>
                  </DialogHeader>
                  {editingPurpose && (
                    <TravelPurposeForm 
                      purpose={editingPurpose}
                      onSave={saveTravelPurpose}
                      onCancel={() => {
                        setIsDialogOpen(false)
                        setEditingPurpose(null)
                      }}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {travelPurposes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No travel purposes defined yet. Add some to show visitor statistics.
              </div>
            ) : (
              <div className="space-y-4">
                {travelPurposes.map((purpose) => (
                  <div key={purpose.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: purpose.color || '#8B5CF6' }}
                      />
                      <div>
                        <h4 className="font-medium">{purpose.display_name || purpose.name}</h4>
                        <p className="text-sm text-muted-foreground">{purpose.percentage}% of visitors</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editPurpose(purpose)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteTravelPurpose(purpose.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface TravelPurposeFormProps {
  purpose: TravelPurposeForm
  onSave: (purpose: TravelPurposeForm) => void
  onCancel: () => void
}

const TravelPurposeForm = ({ purpose, onSave, onCancel }: TravelPurposeFormProps) => {
  const [formData, setFormData] = useState<TravelPurposeForm>(purpose)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const updateField = (field: keyof TravelPurposeForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Purpose Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="e.g., leisure, business, education"
          required
        />
      </div>

      <div>
        <Label htmlFor="display_name">Display Name (optional)</Label>
        <Input
          id="display_name"
          value={formData.display_name || ''}
          onChange={(e) => updateField('display_name', e.target.value)}
          placeholder="e.g., Leisure Travel, Business Travel"
        />
      </div>

      <div>
        <Label htmlFor="percentage">Percentage</Label>
        <Input
          id="percentage"
          type="number"
          min="0"
          max="100"
          value={formData.percentage}
          onChange={(e) => updateField('percentage', parseInt(e.target.value) || 0)}
          required
        />
      </div>

      <div>
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          type="color"
          value={formData.color || '#8B5CF6'}
          onChange={(e) => updateField('color', e.target.value)}
        />
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