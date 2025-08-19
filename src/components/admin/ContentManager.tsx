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
import { Save, FileText, Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export const ContentManager = () => {
  const [content, setContent] = useState<DatabaseContent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSection, setSelectedSection] = useState<string>("hero")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newContentKey, setNewContentKey] = useState("")
  const [newContentValue, setNewContentValue] = useState("")
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
    { value: "contact", label: "Contact" },
    { value: "search", label: "Search Section" },
    { value: "packages", label: "Packages Page" },
    { value: "regions", label: "Regions" },
    { value: "countries", label: "Countries" }
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
          <p className="text-muted-foreground">Edit all website content sections and JSON data</p>
        </div>
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
                Edit all content items for the selected section. All JSON values are editable.
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
      data[item.key] = item.value
    })
    setFormData(data)
  }, [content])

  const handleSave = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
    onSave(section, key, value)
  }

  const renderContentItem = (item: DatabaseContent) => {
    const isJson = typeof item.value === 'object' && item.value !== null
    
    return (
      <Card key={item.id} className="space-y-4">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-sm font-medium">{item.key}</CardTitle>
              <CardDescription className="text-xs">
                Type: {isJson ? 'Object/Array' : typeof item.value}
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
          {isJson ? (
            <div className="space-y-3">
              {Object.entries(item.value as Record<string, any>).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label className="text-sm font-medium">{key}</Label>
                  <Input
                    value={formData[`${item.key}.${key}`] !== undefined ? 
                      formData[`${item.key}.${key}`] : 
                      Array.isArray(value) ? value.join(', ') : String(value || '')
                    }
                    onChange={(e) => {
                      const newValue = e.target.value
                      setFormData(prev => ({ ...prev, [`${item.key}.${key}`]: newValue }))
                    }}
                    onBlur={(e) => {
                      const newValue = e.target.value
                      const currentJson = { ...(item.value as Record<string, any>) }
                      
                      // Handle arrays (comma-separated values)
                      if (Array.isArray(currentJson[key])) {
                        currentJson[key] = newValue.split(',').map(v => v.trim()).filter(Boolean)
                      } else {
                        currentJson[key] = newValue
                      }
                      
                      handleSave(item.key, currentJson)
                    }}
                    placeholder={Array.isArray(value) ? "Enter values separated by commas" : "Enter value"}
                    className="text-sm"
                  />
                  {Array.isArray(value) && (
                    <p className="text-xs text-muted-foreground">
                      Separate multiple values with commas
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-sm">{item.key}</Label>
              {typeof item.value === 'string' && item.value.length > 100 ? (
                <Textarea
                  value={formData[item.key] !== undefined ? formData[item.key] : item.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, [item.key]: e.target.value }))}
                  onBlur={(e) => handleSave(item.key, e.target.value)}
                  rows={4}
                  className="text-sm"
                />
              ) : (
                <Input
                  value={formData[item.key] !== undefined ? formData[item.key] : item.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, [item.key]: e.target.value }))}
                  onBlur={(e) => handleSave(item.key, e.target.value)}
                  className="text-sm"
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {content.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No content items found for this section.</p>
          <p className="text-sm">Click "Add Content" to create the first item.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {content.map(renderContentItem)}
        </div>
      )}
    </div>
  )
}