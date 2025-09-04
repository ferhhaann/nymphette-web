import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { ImageUpload } from './ImageUpload'
import { Trash2, Edit2, Plus } from 'lucide-react'

interface Attraction {
  id: string
  name: string
  description?: string
  image_url?: string
  type: string
  category: string
  order_index: number
}

interface CountryAttractionsManagerProps {
  countryId: string
  countryName: string
}

export const CountryAttractionsManager = ({ countryId, countryName }: CountryAttractionsManagerProps) => {
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAttraction, setEditingAttraction] = useState<Attraction | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    type: 'most_visited',
    category: 'attraction',
    order_index: 0
  })

  useEffect(() => {
    loadAttractions()
  }, [countryId])

  const loadAttractions = async () => {
    try {
      const { data, error } = await supabase
        .from('country_attractions')
        .select('*')
        .eq('country_id', countryId)
        .order('type')
        .order('order_index')

      if (error) throw error
      setAttractions(data || [])
    } catch (error) {
      console.error('Error loading attractions:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image_url: '',
      type: 'most_visited',
      category: 'attraction',
      order_index: 0
    })
    setEditingAttraction(null)
    setIsFormOpen(false)
  }

  const handleEdit = (attraction: Attraction) => {
    setFormData({
      name: attraction.name,
      description: attraction.description || '',
      image_url: attraction.image_url || '',
      type: attraction.type,
      category: attraction.category,
      order_index: attraction.order_index
    })
    setEditingAttraction(attraction)
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Attraction name is required",
        variant: "destructive"
      })
      return
    }

    try {
      if (editingAttraction) {
        const { error } = await supabase
          .from('country_attractions')
          .update({
            name: formData.name,
            description: formData.description,
            image_url: formData.image_url,
            type: formData.type,
            category: formData.category,
            order_index: formData.order_index
          })
          .eq('id', editingAttraction.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Attraction updated successfully"
        })
      } else {
        const { error } = await supabase
          .from('country_attractions')
          .insert({
            country_id: countryId,
            name: formData.name,
            description: formData.description,
            image_url: formData.image_url,
            type: formData.type,
            category: formData.category,
            order_index: formData.order_index
          })

        if (error) throw error

        toast({
          title: "Success",
          description: "Attraction created successfully"
        })
      }

      resetForm()
      loadAttractions()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this attraction?')) return

    try {
      const { error } = await supabase
        .from('country_attractions')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Attraction deleted successfully"
      })
      
      loadAttractions()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  // Filter attractions based on search, type, and category
  const filteredAttractions = attractions.filter(attraction => {
    const matchesSearch = attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (attraction.description && attraction.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedType === "all" || attraction.type === selectedType
    const matchesCategory = selectedCategory === "all" || attraction.category === selectedCategory
    return matchesSearch && matchesType && matchesCategory
  })

  // Group attractions by type
  const attractionsByType = ["most_visited", "most_attractive"].reduce((acc, type) => {
    acc[type] = filteredAttractions.filter(attraction => attraction.type === type)
    return acc
  }, {} as Record<string, Attraction[]>)

  if (loading) {
    return <div className="p-4">Loading attractions...</div>
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="bg-card p-6 rounded-lg border">
        <h4 className="text-lg font-semibold mb-4">🔍 Search & Filter Attractions</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="search-attractions">Search attractions</Label>
            <Input
              id="search-attractions"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="type-filter">Filter by Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="most_visited">Most Visited</SelectItem>
                <SelectItem value="most_attractive">Most Attractive</SelectItem>
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
                {Array.from(new Set(attractions.map(a => a.category))).map(category => (
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
                setSelectedType("all")
                setSelectedCategory("all")
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredAttractions.length} of {attractions.length} attractions
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">🏛️ Manage Attractions for {countryName}</h3>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Attraction
        </Button>
      </div>

      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{editingAttraction ? 'Edit' : 'Add'} Attraction</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="most_visited">Most Visited</SelectItem>
                      <SelectItem value="most_attractive">Most Attractive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <ImageUpload
                label="Attraction Image"
                folder="attractions"
                currentImageUrl={formData.image_url}
                onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
              />

              <div className="flex gap-2">
                <Button type="submit">
                  {editingAttraction ? 'Update' : 'Create'} Attraction
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Attractions organized by Type */}
      {selectedType === "all" ? (
        <div className="space-y-8">
          {["most_visited", "most_attractive"].map(type => {
            const typeAttractions = attractionsByType[type]
            if (typeAttractions.length === 0) return null
            
            return (
              <div key={type} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold">{type.replace('_', ' ').toUpperCase()}</h4>
                  <Badge variant="secondary">{typeAttractions.length} attractions</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {typeAttractions.map((attraction) => (
          <Card key={attraction.id}>
            <CardContent className="p-4">
              {attraction.image_url && (
                <img
                  src={attraction.image_url}
                  alt={attraction.name}
                  className="w-full h-32 object-cover rounded mb-3"
                />
              )}
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{attraction.name}</h4>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(attraction)}>
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(attraction.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {attraction.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {attraction.description}
                  </p>
                )}
                
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    {attraction.type.replace('_', ' ')}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {attraction.category}
                  </Badge>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAttractions.map((attraction) => (
            <Card key={attraction.id}>
              <CardContent className="p-4">
                {attraction.image_url && (
                  <img
                    src={attraction.image_url}
                    alt={attraction.name}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{attraction.name}</h4>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(attraction)}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(attraction.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {attraction.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {attraction.description}
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {attraction.type.replace('_', ' ')}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {attraction.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
                   ))}
        </div>
      )}

      {filteredAttractions.length === 0 && attractions.length > 0 && (
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground">No attractions match your current filters.</p>
            <Button className="mt-4" variant="outline" onClick={() => {
              setSearchTerm("")
              setSelectedType("all")
              setSelectedCategory("all")
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {attractions.length === 0 && (
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground">No attractions added yet.</p>
            <Button className="mt-4" onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Attraction
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}