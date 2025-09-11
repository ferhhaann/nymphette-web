import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Image, GripVertical } from "lucide-react"
import { ImageUpload } from "./ImageUpload"
import type { Database } from "@/integrations/supabase/types"

type Country = Database['public']['Tables']['countries']['Row']
type CountrySection = Database['public']['Tables']['country_sections']['Row']
type CountryHeroImage = Database['public']['Tables']['country_hero_images']['Row']

const SECTION_TYPES = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'overview', label: 'Overview' },
  { value: 'about', label: 'About' },
  { value: 'fun_facts', label: 'Fun Facts' },
  { value: 'before_you_go', label: 'Before You Go' },
  { value: 'best_time', label: 'Best Time to Visit' },
  { value: 'reasons_to_visit', label: 'Reasons to Visit' },
  { value: 'food_shopping', label: 'Food & Shopping' },
  { value: 'dos_donts', label: 'Dos and Don\'ts' },
  { value: 'art_culture', label: 'Art & Culture' }
]

interface CountrySectionManagerProps {
  countryId: string
  countryName: string
}

export const CountrySectionManager = ({ countryId, countryName }: CountrySectionManagerProps) => {
  const [sections, setSections] = useState<CountrySection[]>([])
  const [heroImages, setHeroImages] = useState<CountryHeroImage[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState<Partial<CountrySection> | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isHeroImageDialogOpen, setIsHeroImageDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSectionType, setSelectedSectionType] = useState<string>("all")
  const [showEnabledOnly, setShowEnabledOnly] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [countryId])

  const loadData = async () => {
    try {
      setLoading(true)
      
      const [sectionsResult, heroImagesResult] = await Promise.all([
        supabase
          .from('country_sections')
          .select('*')
          .eq('country_id', countryId)
          .order('order_index'),
        supabase
          .from('country_hero_images')
          .select('*')
          .eq('country_id', countryId)
          .order('order_index')
      ])

      if (sectionsResult.error) throw sectionsResult.error
      if (heroImagesResult.error) throw heroImagesResult.error

      setSections(sectionsResult.data || [])
      setHeroImages(heroImagesResult.data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load sections: " + error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const saveSection = async (sectionData: Partial<CountrySection>) => {
    try {
      if (sectionData.id) {
        const { error } = await supabase
          .from('country_sections')
          .update(sectionData)
          .eq('id', sectionData.id)

        if (error) throw error
      } else {
        const insertData = {
          ...sectionData,
          country_id: countryId,
          order_index: sections.length + 1,
          section_name: sectionData.section_name || ''
        }
        delete insertData.id

        const { error } = await supabase
          .from('country_sections')
          .insert([insertData])

        if (error) throw error
      }

      await loadData()
      setIsDialogOpen(false)
      setEditingSection(null)
      toast({
        title: "Success",
        description: sectionData.id ? "Section updated" : "Section created"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const deleteSection = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return

    try {
      const { error } = await supabase
        .from('country_sections')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadData()
      toast({
        title: "Success",
        description: "Section deleted"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const addHeroImage = async (imageUrl: string) => {
    try {
      const { error } = await supabase
        .from('country_hero_images')
        .insert([{
          country_id: countryId,
          image_url: imageUrl,
          order_index: heroImages.length + 1
        }])

      if (error) throw error
      await loadData()
      toast({
        title: "Success",
        description: "Hero image added"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const deleteHeroImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero image?")) return

    try {
      const { error } = await supabase
        .from('country_hero_images')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadData()
      toast({
        title: "Success",
        description: "Hero image deleted"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  // Filter sections based on search, type, and enabled status
  const filteredSections = sections.filter(section => {
    const matchesSearch = section.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.section_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedSectionType === "all" || section.section_name === selectedSectionType
    const matchesEnabled = !showEnabledOnly || section.is_enabled
    return matchesSearch && matchesType && matchesEnabled
  })

  if (loading) {
    return <div className="text-center">Loading sections...</div>
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="bg-card p-6 rounded-lg border">
        <h4 className="text-lg font-semibold mb-4">🔍 Search & Filter Content Sections</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="search-sections">Search sections</Label>
            <Input
              id="search-sections"
              placeholder="Search by title or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="section-type-filter">Filter by Section Type</Label>
            <Select value={selectedSectionType} onValueChange={setSelectedSectionType}>
              <SelectTrigger>
                <SelectValue placeholder="All Section Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Section Types</SelectItem>
                {SECTION_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 pt-6">
            <Switch
              id="enabled-only"
              checked={showEnabledOnly}
              onCheckedChange={setShowEnabledOnly}
            />
            <Label htmlFor="enabled-only">Show enabled only</Label>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedSectionType("all")
                setShowEnabledOnly(false)
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredSections.length} of {sections.length} sections
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">📝 {countryName} - Content Sections</h3>
          <p className="text-muted-foreground">Manage all content sections for this country</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isHeroImageDialogOpen} onOpenChange={setIsHeroImageDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Image className="h-4 w-4 mr-2" />
                Add Hero Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Hero Image</DialogTitle>
              </DialogHeader>
              <ImageUpload
                onImageUploaded={(url) => {
                  addHeroImage(url)
                  setIsHeroImageDialogOpen(false)
                }}
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingSection({ 
                country_id: countryId,
                section_name: '',
                title: '',
                content: {},
                order_index: sections.length + 1,
                is_enabled: true
              })}>
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSection?.id ? 'Edit Section' : 'Add New Section'}
                </DialogTitle>
              </DialogHeader>
              <SectionForm 
                section={editingSection!} 
                onSave={saveSection}
                onCancel={() => {
                  setIsDialogOpen(false)
                  setEditingSection(null)
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Hero Images */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {heroImages.map((image) => (
              <div key={image.id} className="relative group">
                <img 
                  src={image.image_url} 
                  alt={image.alt_text || "Hero image"}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteHeroImage(image.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  Order: {image.order_index}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Sections */}
      <div className="grid gap-4">
        {filteredSections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {SECTION_TYPES.find(t => t.value === section.section_name)?.label} • Order: {section.order_index}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={section.is_enabled}
                    onCheckedChange={async (checked) => {
                      await saveSection({ ...section, is_enabled: checked })
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingSection(section)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteSection(section.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground line-clamp-3">
                {section.content && typeof section.content === 'object' 
                  ? Object.entries(section.content).map(([key, value]) => 
                      `${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`
                    ).join(' • ')
                  : String(section.content || 'No content')
                }
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

interface SectionFormProps {
  section: Partial<CountrySection>
  onSave: (section: Partial<CountrySection>) => void
  onCancel: () => void
}

const extractContentFields = (content: any) => {
  if (!content || typeof content !== 'object') {
    return {
      description: '',
      subtitle: '',
      points: [''],
      highlight: ''
    }
  }
  
  return {
    description: content.description || '',
    subtitle: content.subtitle || '',
    points: content.points || [''],
    highlight: content.highlight || ''
  }
}

const SectionForm = ({ section, onSave, onCancel }: SectionFormProps) => {
  const [formData, setFormData] = useState<Partial<CountrySection>>(section || {})
  const [contentFields, setContentFields] = useState(() => {
    const defaultFields = {
      description: '',
      subtitle: '',
      points: [''],
      highlight: ''
    }
    
    if (!section || !section.content) {
      return defaultFields
    }
    
    return {
      ...defaultFields,
      ...extractContentFields(section.content)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const content = {
      description: contentFields.description,
      subtitle: contentFields.subtitle,
      points: contentFields.points.filter(point => point.trim() !== ''),
      highlight: contentFields.highlight
    }
    
    const dataToSave = {
      ...formData,
      content
    }
    
    onSave(dataToSave)
  }

  const updateField = (field: keyof CountrySection, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateContentField = (field: string, value: any) => {
    setContentFields(prev => ({ ...prev, [field]: value }))
  }

  const addPoint = () => {
    setContentFields(prev => ({
      ...prev,
      points: [...prev.points, '']
    }))
  }

  const removePoint = (index: number) => {
    setContentFields(prev => ({
      ...prev,
      points: prev.points.filter((_, i) => i !== index)
    }))
  }

  const updatePoint = (index: number, value: string) => {
    setContentFields(prev => ({
      ...prev,
      points: prev.points.map((point, i) => i === index ? value : point)
    }))
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Section Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="section_name">Section Type</Label>
                <Select 
                  value={formData.section_name} 
                  onValueChange={(value) => updateField('section_name', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTION_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title">Section Title</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Enter section title"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="order_index">Display Order</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index || 0}
                  onChange={(e) => updateField('order_index', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  id="is_enabled"
                  checked={formData.is_enabled}
                  onCheckedChange={(checked) => updateField('is_enabled', checked)}
                />
                <Label htmlFor="is_enabled">Section Enabled</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Fields */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description">Main Description</Label>
              <Textarea
                id="description"
                value={contentFields.description}
                onChange={(e) => updateContentField('description', e.target.value)}
                rows={4}
                placeholder="Enter main content description"
              />
            </div>

            <div>
              <Label htmlFor="subtitle">Subtitle (Optional)</Label>
              <Input
                id="subtitle"
                value={contentFields.subtitle}
                onChange={(e) => updateContentField('subtitle', e.target.value)}
                placeholder="Enter subtitle"
              />
            </div>

            <div>
              <Label htmlFor="highlight">Highlight Text (Optional)</Label>
              <Input
                id="highlight"
                value={contentFields.highlight}
                onChange={(e) => updateContentField('highlight', e.target.value)}
                placeholder="Enter highlight or callout text"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Key Points</Label>
                <Button type="button" variant="outline" size="sm" onClick={addPoint}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Point
                </Button>
              </div>
              <div className="space-y-2">
                {contentFields.points.map((point, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={point}
                      onChange={(e) => updatePoint(index, e.target.value)}
                      placeholder={`Point ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePoint(index)}
                      disabled={contentFields.points.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {formData.id ? 'Update Section' : 'Create Section'}
          </Button>
        </div>
      </form>
    </div>
  )
}