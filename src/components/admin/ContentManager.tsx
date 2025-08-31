import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import type { Database, Tables } from "@/integrations/supabase/types"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const ContentManager = () => {
  const [content, setContent] = useState<DatabaseContent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPage, setSelectedPage] = useState<string>("home")
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
    { value: "countries", label: "Countries" },
    // Additional logical sections for new pages (optional; created on first save)
    { value: "group-tours", label: "Group Tours" },
    { value: "blog", label: "Blog" }
  ]

  const pageToSections: Record<string, string[]> = {
    home: [
      "hero",
      "search",
      "featured-packages",
      "why-choose-us",
      "top-values",
      "promo-banner",
      "about",
      "navigation",
      "footer"
    ],
    packages: ["packages", "regions"],
    group: ["group-tours"],
    blog: ["blog"],
    contact: ["contact", "navigation", "footer"],
  }

  const visibleSections = sections.filter(s => (pageToSections[selectedPage] || []).includes(s.value))

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      console.log('Loading content from database...')
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('section', { ascending: true })
        .returns<Tables<'content'>[]>()

      if (error) throw error
      
      console.log('Content loaded:', data)
      console.log('Content length:', data?.length)
      
      // If no content exists, insert some test data
      if (!data || data.length === 0) {
        console.log('No content found, inserting test data...')
        await insertTestData()
        // Reload content after inserting test data
        const { data: newData, error: newError } = await supabase
          .from('content')
          .select('*')
          .order('section', { ascending: true })
          .returns<Tables<'content'>[]>()
        
        if (newError) throw newError
        setContent((newData as any) || [])
      } else {
        setContent((data as any) || [])
      }
    } catch (error: any) {
      console.error('Error loading content:', error)
      toast({
        title: "Error",
        description: "Failed to load content: " + error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const insertTestData = async () => {
    try {
      const testData = [
        { section: 'hero', key: 'title', value: 'Discover Amazing Destinations' },
        { section: 'hero', key: 'subtitle', value: 'Your Gateway to Unforgettable Travel Experiences' },
        { section: 'why-choose-us', key: 'title', value: 'Why Choose Nymphette Tours' },
        { section: 'why-choose-us', key: 'features', value: { 
          expert_guides: { title: 'Expert Local Guides', description: 'Our experienced guides provide authentic insights' },
          customized_trips: { title: 'Customized Itineraries', description: 'Tailored travel plans for your preferences' }
        }},
        { section: 'top-values', key: 'title', value: 'Our Core Values' },
        { section: 'top-values', key: 'values', value: {
          authenticity: { title: 'Authentic Experiences', description: 'Genuine cultural immersion', icon: 'globe' },
          sustainability: { title: 'Sustainable Tourism', description: 'Responsible travel practices', icon: 'leaf' }
        }}
      ]

      for (const item of testData) {
        const { error } = await supabase
          .from('content')
          .insert([item] as any)
        
        if (error) {
          console.error(`Error inserting ${item.section}.${item.key}:`, error)
        } else {
          console.log(`Successfully inserted ${item.section}.${item.key}`)
        }
      }
    } catch (error) {
      console.error('Error inserting test data:', error)
    }
  }

  const saveContent = async (section: string, key: string, value: any) => {
    try {
      const existingContent = content.find(c => c.section === section && c.key === key)
      
      if (existingContent) {
        const { error } = await supabase
          .from('content')
          .update({ value, updated_at: new Date().toISOString() } as any)
          .eq('id', existingContent.id as any)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('content')
          .insert([{ section, key, value }] as any)

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
        .eq('id', id as any)

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
          <p className="text-muted-foreground">Edit website content organized by page</p>
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

      <Tabs value={selectedPage} onValueChange={(v) => {
        setSelectedPage(v)
        const defaultSection = (pageToSections[v] && pageToSections[v][0]) || selectedSection
        setSelectedSection(defaultSection)
      }}>
        <TabsList>
          <TabsTrigger value="home">Home Page</TabsTrigger>
          <TabsTrigger value="packages">Packages Page</TabsTrigger>
          <TabsTrigger value="group">Group Tours Page</TabsTrigger>
          <TabsTrigger value="blog">Blog Page</TabsTrigger>
          <TabsTrigger value="contact">Contact Us Page</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPage}>
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sections</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {visibleSections.map((section) => (
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
                    Edit content items for the selected section using user-friendly form fields.
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
        </TabsContent>
      </Tabs>
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

  // Special handling for regions section with raw package data
  if (section === 'regions') {
    return <RegionsEditor content={content} onDelete={onDelete} />
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
            <div className="space-y-4">
              <div className="grid gap-4">
                {Object.entries(item.value as Record<string, any>).map(([fieldKey, fieldValue]) => (
                  <div key={fieldKey} className="space-y-2">
                    <Label className="text-sm font-medium capitalize">{fieldKey.replace(/_/g, ' ')}</Label>
                    {Array.isArray(fieldValue) ? (
                      <div className="space-y-2">
                        {fieldValue.map((arrayItem, index) => (
                          typeof arrayItem === 'object' && arrayItem !== null ? (
                            <div key={index} className="space-y-2 rounded border p-3">
                              {Object.keys(arrayItem).map((k) => {
                                const nestedVal = (arrayItem as any)[k]
                                const label = k.replace(/_/g, ' ')
                                const onChangePrimitive = (val: any) => {
                                  const newArray = fieldValue.map((v, i) => i === index ? { ...(arrayItem as any), [k]: val } : v)
                                  const currentJson = { ...(item.value as Record<string, any>) }
                                  currentJson[fieldKey] = newArray
                                  setFormData(prev => ({ ...prev, [item.key]: currentJson }))
                                }
                                const onBlurPrimitive = (val: any) => {
                                  const newArray = fieldValue.map((v, i) => i === index ? { ...(arrayItem as any), [k]: val } : v)
                                  const currentJson = { ...(item.value as Record<string, any>) }
                                  currentJson[fieldKey] = newArray
                                  handleSave(item.key, currentJson)
                                }
                                return (
                                  <div key={k} className="space-y-1">
                                    <Label className="text-xs capitalize">{label}</Label>
                                    {Array.isArray(nestedVal) ? (
                                      <Textarea
                                        value={nestedVal.join(', ')}
                                        onChange={(e) => onChangePrimitive(e.target.value.split(',').map(s => s.trim()))}
                                        onBlur={(e) => onBlurPrimitive(e.target.value.split(',').map(s => s.trim()))}
                                        rows={2}
                                        className="text-sm"
                                      />
                                    ) : (typeof nestedVal === 'object' && nestedVal !== null) ? (
                                      <Textarea
                                        value={JSON.stringify(nestedVal, null, 2)}
                                        onChange={(e) => {
                                          try {
                                            const parsed = JSON.parse(e.target.value || '{}')
                                            onChangePrimitive(parsed)
                                          } catch {
                                            onChangePrimitive(e.target.value)
                                          }
                                        }}
                                        onBlur={(e) => {
                                          try {
                                            const parsed = JSON.parse(e.target.value || '{}')
                                            onBlurPrimitive(parsed)
                                          } catch {
                                            onBlurPrimitive(e.target.value)
                                          }
                                        }}
                                        rows={3}
                                        className="text-sm font-mono"
                                        placeholder={`JSON for ${label}`}
                                      />
                                    ) : (
                                      <Input
                                        value={String(nestedVal ?? '')}
                                        onChange={(e) => onChangePrimitive(e.target.value)}
                                        onBlur={(e) => onBlurPrimitive(e.target.value)}
                                        className="text-sm"
                                        placeholder={`${String(k)} of item ${index + 1}`}
                                      />
                                    )}
                                  </div>
                                )
                              })}
                              <div className="flex justify-end">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newArray = fieldValue.filter((_, i) => i !== index)
                                    const currentJson = { ...(item.value as Record<string, any>) }
                                    currentJson[fieldKey] = newArray
                                    setFormData(prev => ({ ...prev, [item.key]: currentJson }))
                                    handleSave(item.key, currentJson)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={String(arrayItem ?? '')}
                                onChange={(e) => {
                                  const newArray = [...fieldValue]
                                  newArray[index] = e.target.value
                                  const currentJson = { ...(item.value as Record<string, any>) }
                                  currentJson[fieldKey] = newArray
                                  setFormData(prev => ({ ...prev, [item.key]: currentJson }))
                                }}
                                onBlur={(e) => {
                                  const newArray = [...fieldValue]
                                  newArray[index] = e.target.value
                                  const currentJson = { ...(item.value as Record<string, any>) }
                                  currentJson[fieldKey] = newArray
                                  handleSave(item.key, currentJson)
                                }}
                                className="text-sm"
                                placeholder={`${fieldKey} ${index + 1}`}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newArray = fieldValue.filter((_, i) => i !== index)
                                  const currentJson = { ...(item.value as Record<string, any>) }
                                  currentJson[fieldKey] = newArray
                                  setFormData(prev => ({ ...prev, [item.key]: currentJson }))
                                  handleSave(item.key, currentJson)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const sample = fieldValue[0]
                            const emptyItem = typeof sample === 'object' && sample !== null
                              ? Object.keys(sample).reduce((acc, k) => ({ ...acc, [k]: '' }), {} as Record<string, any>)
                              : ''
                            const newArray = [...fieldValue, emptyItem]
                            const currentJson = { ...(item.value as Record<string, any>) }
                            currentJson[fieldKey] = newArray
                            setFormData(prev => ({ ...prev, [item.key]: currentJson }))
                            handleSave(item.key, currentJson)
                          }}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add {fieldKey.slice(0, -1)}
                        </Button>
                      </div>
                    ) : (typeof fieldValue === 'object' && fieldValue !== null) ? (
                      <div className="space-y-2 rounded border p-3">
                        {Object.entries(fieldValue as Record<string, any>).map(([nestedKey, nestedValue]) => (
                          <div key={nestedKey} className="space-y-1">
                            <Label className="text-xs capitalize">{nestedKey.replace(/_/g, ' ')}</Label>
                            {Array.isArray(nestedValue) ? (
                              <Textarea
                                value={nestedValue.join(', ')}
                                onChange={(e) => {
                                  const values = e.target.value.split(',').map(s => s.trim())
                                  const currentJson = { ...(item.value as Record<string, any>) }
                                  const cloneObj = { ...(fieldValue as Record<string, any>) }
                                  cloneObj[nestedKey] = values
                                  currentJson[fieldKey] = cloneObj
                                  setFormData(prev => ({ ...prev, [item.key]: currentJson }))
                                }}
                                onBlur={(e) => {
                                  const values = e.target.value.split(',').map(s => s.trim())
                                  const currentJson = { ...(item.value as Record<string, any>) }
                                  const cloneObj = { ...(fieldValue as Record<string, any>) }
                                  cloneObj[nestedKey] = values
                                  currentJson[fieldKey] = cloneObj
                                  handleSave(item.key, currentJson)
                                }}
                                rows={2}
                                className="text-sm"
                              />
                            ) : (
                              <Input
                                value={String(nestedValue ?? '')}
                                onChange={(e) => {
                                  const currentJson = { ...(item.value as Record<string, any>) }
                                  const cloneObj = { ...(fieldValue as Record<string, any>) }
                                  cloneObj[nestedKey] = e.target.value
                                  currentJson[fieldKey] = cloneObj
                                  setFormData(prev => ({ ...prev, [item.key]: currentJson }))
                                }}
                                onBlur={(e) => {
                                  const currentJson = { ...(item.value as Record<string, any>) }
                                  const cloneObj = { ...(fieldValue as Record<string, any>) }
                                  cloneObj[nestedKey] = e.target.value
                                  currentJson[fieldKey] = cloneObj
                                  handleSave(item.key, currentJson)
                                }}
                                className="text-sm"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : typeof fieldValue === 'string' && fieldValue.length > 50 ? (
                      <Textarea
                        value={fieldValue}
                        onChange={(e) => {
                          const currentJson = { ...(item.value as Record<string, any>) }
                          currentJson[fieldKey] = e.target.value
                          setFormData(prev => ({ ...prev, [item.key]: currentJson }))
                        }}
                        onBlur={(e) => {
                          const currentJson = { ...(item.value as Record<string, any>) }
                          currentJson[fieldKey] = e.target.value
                          handleSave(item.key, currentJson)
                        }}
                        rows={3}
                        className="text-sm"
                        placeholder={`Enter ${fieldKey}`}
                      />
                    ) : (
                      <Input
                        value={String(fieldValue || '')}
                        onChange={(e) => {
                          const currentJson = { ...(item.value as Record<string, any>) }
                          currentJson[fieldKey] = e.target.value
                          setFormData(prev => ({ ...prev, [item.key]: currentJson }))
                        }}
                        onBlur={(e) => {
                          const currentJson = { ...(item.value as Record<string, any>) }
                          currentJson[fieldKey] = e.target.value
                          handleSave(item.key, currentJson)
                        }}
                        className="text-sm"
                        placeholder={`Enter ${fieldKey}`}
                      />
                    )}
                  </div>
                ))}
              </div>
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

interface RegionsEditorProps {
  content: DatabaseContent[]
  onDelete: (id: string) => void
}

const RegionsEditor = ({ content, onDelete }: RegionsEditorProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">Region Package Data</h3>
            <p className="text-sm text-yellow-700 mt-1">
              The regions section contains complex package data that should be managed through the Package Manager. 
              This data is automatically generated and not meant for direct editing here.
            </p>
            <div className="mt-3">
              <Button variant="outline" size="sm" className="text-yellow-800 border-yellow-300">
                <Package className="h-4 w-4 mr-2" />
                Go to Package Manager
              </Button>
            </div>
          </div>
        </div>
      </div>

      {content.map(item => {
        const packages = Array.isArray(item.value) ? item.value : []
        const regionName = item.key.replace('_raw', '').replace(/([A-Z])/g, ' $1').trim()
        
        return (
          <Card key={item.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-sm font-medium capitalize">{regionName}</CardTitle>
                  <CardDescription className="text-xs">
                    Contains {packages.length} package(s)
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
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  This region contains package data for: {regionName}
                </p>
                {packages.slice(0, 3).map((pkg: any, index: number) => (
                  <div key={index} className="bg-muted/50 rounded p-3">
                    <div className="text-sm font-medium">{pkg.title || 'Untitled Package'}</div>
                    <div className="text-xs text-muted-foreground">
                      {pkg.country} • {pkg.duration} • {pkg.price}
                    </div>
                  </div>
                ))}
                {packages.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    ... and {packages.length - 3} more packages
                  </div>
                )}
                <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="text-xs text-blue-700">
                    <strong>To edit packages:</strong> Use the Package Manager where you can add, edit, and organize packages for each region with a user-friendly interface.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {content.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No region package data found.</p>
          <p className="text-sm">Package data is managed through the Package Manager.</p>
        </div>
      )}
    </div>
  )
}