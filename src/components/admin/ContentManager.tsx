import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/integrations/supabase/types"

type DatabaseContent = Database['public']['Tables']['content']['Row']
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Save, FileText, Plus, Edit, Trash2, Package, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export const ContentManager = () => {
  const [content, setContent] = useState<DatabaseContent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSection, setSelectedSection] = useState<string>("homepage")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newContentKey, setNewContentKey] = useState("")
  const [newContentValue, setNewContentValue] = useState("")
  const { toast } = useToast()

  const sections = [
    { value: "homepage", label: "Homepage" },
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

  const deleteContent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content item?")) return

    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadContent()
      toast({
        title: "Success",
        description: "Content deleted"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const addNewContent = async () => {
    if (!newContentKey.trim() || !newContentValue.trim()) {
      toast({
        title: "Error",
        description: "Key and value are required",
        variant: "destructive"
      })
      return
    }

    await saveContent(selectedSection, newContentKey, newContentValue)
    setNewContentKey("")
    setNewContentValue("")
    setIsAddDialogOpen(false)
  }

  const initializeHomepageContent = async () => {
    const defaultHomepageContent = [
      { key: "hero_title", value: "Discover Amazing Destinations" },
      { key: "promo_description", value: "Discover luxury accommodations, exclusive tours, and unforgettable experiences" },
      { key: "journey_description", value: "Contact us today and let our expert travel consultants help you plan the perfect trip tailored to your preferences and budget." }
    ]

    try {
      for (const item of defaultHomepageContent) {
        const existing = content.find(c => c.section === 'homepage' && c.key === item.key)
        if (!existing) {
          await saveContent('homepage', item.key, item.value)
        }
      }
      toast({
        title: "Success",
        description: "Homepage content initialized successfully"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to initialize homepage content: " + error.message,
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Content Manager</h2>
          <p className="text-muted-foreground">Edit contact page and about us page content</p>
        </div>
        <div className="flex gap-2">
          {selectedSection === 'homepage' && getSectionContent('homepage').length === 0 && (
            <Button onClick={initializeHomepageContent} variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Initialize Homepage Content
            </Button>
          )}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Content Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="section">Section: {sections.find(s => s.value === selectedSection)?.label}</Label>
                  <p className="text-sm text-muted-foreground">Adding to section: {selectedSection}</p>
                </div>
                <div>
                  <Label htmlFor="key">Content Key</Label>
                  <Input
                    id="key"
                    value={newContentKey}
                    onChange={(e) => setNewContentKey(e.target.value)}
                    placeholder="e.g., title, description, subtitle"
                  />
                </div>
                <div>
                  <Label htmlFor="value">Content Value</Label>
                  <Textarea
                    id="value"
                    value={newContentValue}
                    onChange={(e) => setNewContentValue(e.target.value)}
                    placeholder="Enter the content value..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addNewContent}>
                    <Save className="h-4 w-4 mr-2" />
                    Add Content
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
                    <div className="flex justify-between items-center">
                      <span>{section.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {getSectionContent(section.value).length}
                      </Badge>
                    </div>
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
                Edit all content items for the selected section using user-friendly form fields.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SectionEditor
                section={selectedSection}
                content={getSectionContent(selectedSection)}
                getContentValue={getContentValue}
                onSave={saveContent}
                onDelete={deleteContent}
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
  onDelete: (id: string) => void
}

const SectionEditor = ({ section, content, getContentValue, onSave, onDelete }: SectionEditorProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    // Initialize form data with current content
    const data: Record<string, any> = {}
    content.forEach(item => {
      // Handle objects by converting to JSON string for editing
      data[item.key] = typeof item.value === 'object' && item.value !== null 
        ? JSON.stringify(item.value, null, 2) 
        : item.value
    })
    setFormData(data)
  }, [content])

  const handleSave = (key: string, value: any) => {
    // Try to parse JSON if it looks like JSON
    let processedValue = value
    if (typeof value === 'string' && (value.trim().startsWith('{') || value.trim().startsWith('['))) {
      try {
        processedValue = JSON.parse(value)
      } catch (e) {
        // If parsing fails, keep as string
        processedValue = value
      }
    }
    
    setFormData(prev => ({ ...prev, [key]: value }))
    onSave(section, key, processedValue)
  }

  // Handle homepage, about, and contact sections
  if (!['homepage', 'about', 'contact'].includes(section)) {
    return <div className="p-4 text-center text-muted-foreground">Section not available for editing</div>
  }

  if (content.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        <p>No content found for this section.</p>
        {section === 'homepage' && (
          <p className="text-sm mt-2">Click "Initialize Homepage Content" to add default content items.</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {content.map((item) => (
        <Card key={item.id} className="space-y-4">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-medium">{item.key}</CardTitle>
                <CardDescription className="text-xs">
                  Type: {typeof item.value}
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(item.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <Label className="text-sm font-medium capitalize">
                {item.key.replace(/_/g, ' ')}
                {typeof item.value === 'object' && (
                  <Badge variant="outline" className="ml-2 text-xs">JSON Object</Badge>
                )}
              </Label>
              
              {/* Handle objects or long strings with textarea */}
              {(typeof item.value === 'object' || String(formData[item.key] || item.value || '').length > 100) ? (
                <Textarea
                  value={formData[item.key] || ''}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, [item.key]: e.target.value }))
                  }}
                  onBlur={(e) => {
                    handleSave(item.key, e.target.value)
                  }}
                  className="text-sm font-mono"
                  placeholder={typeof item.value === 'object' 
                    ? `Enter JSON for ${item.key.replace(/_/g, ' ')}...` 
                    : `Enter ${item.key.replace(/_/g, ' ')}...`}
                  rows={typeof item.value === 'object' ? 8 : 4}
                />
              ) : (
                <Input
                  value={formData[item.key] || ''}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, [item.key]: e.target.value }))
                  }}
                  onBlur={(e) => {
                    handleSave(item.key, e.target.value)
                  }}
                  className="text-sm"
                  placeholder={`Enter ${item.key.replace(/_/g, ' ')}...`}
                />
              )}
              
              {/* Show validation message for JSON objects */}
              {typeof item.value === 'object' && (
                <p className="text-xs text-muted-foreground">
                  Edit as JSON. Changes are auto-saved when you click outside the field.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}