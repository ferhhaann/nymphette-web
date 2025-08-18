import { useState, useEffect } from "react"
import { supabase, type DatabaseContent } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export const ContentManager = () => {
  const [content, setContent] = useState<DatabaseContent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSection, setSelectedSection] = useState<string>("hero")
  const { toast } = useToast()

  const sections = [
    { value: "hero", label: "Hero Section" },
    { value: "featured-packages", label: "Featured Packages" },
    { value: "why-choose-us", label: "Why Choose Us" },
    { value: "top-values", label: "Top Values" },
    { value: "promo-banner", label: "Promo Banner" },
    { value: "footer", label: "Footer" },
    { value: "navigation", label: "Navigation" },
    { value: "about", label: "About Us" },
    { value: "contact", label: "Contact" }
  ]

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('section', { ascending: true })

      if (error) throw error
      setContent(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load content: " + error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async (section: string, key: string, value: any) => {
    try {
      const existingContent = content.find(c => c.section === section && c.key === key)
      
      if (existingContent) {
        const { error } = await supabase
          .from('content')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('id', existingContent.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('content')
          .insert([{ section, key, value }])

        if (error) throw error
      }

      await loadContent()
      toast({
        title: "Success",
        description: "Content saved successfully"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const getSectionContent = (section: string) => {
    return content.filter(c => c.section === section)
  }

  const getContentValue = (section: string, key: string, defaultValue: any = '') => {
    const item = content.find(c => c.section === section && c.key === key)
    return item?.value || defaultValue
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading content...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Content Manager</h2>
        <p className="text-muted-foreground">Edit website content sections</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sections</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.value}
                    onClick={() => setSelectedSection(section.value)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-muted ${
                      selectedSection === section.value 
                        ? 'bg-primary text-primary-foreground' 
                        : ''
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {sections.find(s => s.value === selectedSection)?.label} Content
              </CardTitle>
              <CardDescription>
                Edit content for the selected section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SectionEditor
                section={selectedSection}
                content={getSectionContent(selectedSection)}
                getContentValue={getContentValue}
                onSave={saveContent}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface SectionEditorProps {
  section: string
  content: DatabaseContent[]
  getContentValue: (section: string, key: string, defaultValue?: any) => any
  onSave: (section: string, key: string, value: any) => void
}

const SectionEditor = ({ section, content, getContentValue, onSave }: SectionEditorProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    // Initialize form data with current content
    const data: Record<string, any> = {}
    content.forEach(item => {
      data[item.key] = item.value
    })
    setFormData(data)
  }, [content])

  const handleSave = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
    onSave(section, key, value)
  }

  const renderSectionFields = () => {
    switch (section) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Hero Title</Label>
              <Input
                id="title"
                value={formData.title || getContentValue(section, 'title', 'Discover Your Next Adventure')}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                onBlur={(e) => handleSave('title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Hero Subtitle</Label>
              <Textarea
                id="subtitle"
                value={formData.subtitle || getContentValue(section, 'subtitle', 'Explore amazing destinations with our curated travel packages')}
                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                onBlur={(e) => handleSave('subtitle', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cta_text">Call to Action Text</Label>
              <Input
                id="cta_text"
                value={formData.cta_text || getContentValue(section, 'cta_text', 'Explore Packages')}
                onChange={(e) => setFormData(prev => ({ ...prev, cta_text: e.target.value }))}
                onBlur={(e) => handleSave('cta_text', e.target.value)}
              />
            </div>
          </div>
        )

      case 'why-choose-us':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Section Title</Label>
              <Input
                id="title"
                value={formData.title || getContentValue(section, 'title', 'Why Choose Us')}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                onBlur={(e) => handleSave('title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || getContentValue(section, 'description', 'We provide exceptional travel experiences')}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                onBlur={(e) => handleSave('description', e.target.value)}
              />
            </div>
          </div>
        )

      case 'promo-banner':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Banner Title</Label>
              <Input
                id="title"
                value={formData.title || getContentValue(section, 'title', 'Special Offer')}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                onBlur={(e) => handleSave('title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="discount">Discount Text</Label>
              <Input
                id="discount"
                value={formData.discount || getContentValue(section, 'discount', '20% OFF')}
                onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                onBlur={(e) => handleSave('discount', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || getContentValue(section, 'description', 'Book your dream vacation today')}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                onBlur={(e) => handleSave('description', e.target.value)}
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Content editor for {section} section. Add specific fields as needed.
            </p>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title || getContentValue(section, 'title', '')}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                onBlur={(e) => handleSave('title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || getContentValue(section, 'description', '')}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                onBlur={(e) => handleSave('description', e.target.value)}
              />
            </div>
          </div>
        )
    }
  }

  return (
    <div>
      {renderSectionFields()}
    </div>
  )
}