import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CountryAttractionsManager } from './CountryAttractionsManager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Edit, Plus, Trash2 } from 'lucide-react'

interface Country {
  id: string
  name: string
  slug: string
}

interface ContentSection {
  id: string
  country_id: string
  section_type: string
  title?: string
  content: any
  order_index: number
}

export const CountryContentManager = () => {
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCountryId, setSelectedCountryId] = useState<string>('')
  const [contentSections, setContentSections] = useState<ContentSection[]>([])
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null)
  const [newSection, setNewSection] = useState({
    section_type: '',
    title: '',
    content: { text: '' },
    order_index: 0
  })

  const sectionTypes = [
    'introduction',
    'table_of_contents', 
    'about_destination',
    'interesting_tidbits',
    'seasonal_guide',
    'food_culture',
    'shopping',
    'dos_donts',
    'art_culture'
  ]

  useEffect(() => {
    loadCountries()
  }, [])

  useEffect(() => {
    if (selectedCountryId) {
      loadContentSections()
    }
  }, [selectedCountryId])

  const loadCountries = async () => {
    const { data } = await supabase
      .from('countries')
      .select('id, name, slug')
      .order('name')
    
    setCountries(data || [])
  }

  const loadContentSections = async () => {
    const { data } = await supabase
      .from('country_content')
      .select('*')
      .eq('country_id', selectedCountryId)
      .order('order_index')
    
    setContentSections(data || [])
  }

  const saveSection = async (section: Partial<ContentSection>) => {
    try {
      if (section.id) {
        await supabase
          .from('country_content')
          .update(section)
          .eq('id', section.id)
      } else {
        if (!section.section_type) {
          toast.error('Section type is required')
          return
        }
        
        await supabase
          .from('country_content')
          .insert({
            country_id: selectedCountryId,
            section_type: section.section_type,
            title: section.title || '',
            content: section.content || {},
            order_index: section.order_index || 0
          })
      }
      
      toast.success('Content section saved successfully')
      loadContentSections()
      setEditingSection(null)
      setNewSection({ section_type: '', title: '', content: { text: '' }, order_index: 0 })
    } catch (error) {
      toast.error('Failed to save content section')
    }
  }

  const deleteSection = async (id: string) => {
    try {
      await supabase
        .from('country_content')
        .delete()
        .eq('id', id)
      
      toast.success('Content section deleted')
      loadContentSections()
    } catch (error) {
      toast.error('Failed to delete content section')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Country Content Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Select Country</Label>
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
            </div>

            {selectedCountryId && (
              <Tabs defaultValue="attractions" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="attractions">Attractions & Places</TabsTrigger>
                  <TabsTrigger value="content">Page Content</TabsTrigger>
                </TabsList>
                
                <TabsContent value="attractions" className="space-y-6">
                  <CountryAttractionsManager 
                    countryId={selectedCountryId} 
                    countryName={countries.find(c => c.id === selectedCountryId)?.name || ''} 
                  />
                </TabsContent>
                
                 <TabsContent value="content" className="space-y-6">
                   <h3 className="text-lg font-semibold">Content Sections</h3>
                 
                 {/* Add New Section */}
                 <Card>
                   <CardHeader>
                     <CardTitle className="text-base">Add New Section</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <Select value={newSection.section_type} onValueChange={(value) => setNewSection({...newSection, section_type: value})}>
                       <SelectTrigger>
                         <SelectValue placeholder="Section Type" />
                       </SelectTrigger>
                       <SelectContent>
                         {sectionTypes.map(type => (
                           <SelectItem key={type} value={type}>
                             {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     
                     <Input
                       placeholder="Section Title"
                       value={newSection.title}
                       onChange={(e) => setNewSection({...newSection, title: e.target.value})}
                     />
                     
                     <Textarea
                       placeholder="Write your content here..."
                       value={typeof newSection.content === 'string' ? newSection.content : newSection.content.text || ''}
                       onChange={(e) => setNewSection({...newSection, content: { text: e.target.value }})}
                       rows={6}
                     />
                     
                     <Button onClick={() => saveSection(newSection)}>
                       <Plus className="h-4 w-4 mr-2" />
                       Add Section
                     </Button>
                   </CardContent>
                 </Card>

                 {/* Existing Sections */}
                 <div className="space-y-4">
                   {contentSections.map(section => (
                     <Card key={section.id}>
                       <CardHeader>
                         <div className="flex items-center justify-between">
                           <div>
                             <CardTitle className="text-base">{section.title || section.section_type}</CardTitle>
                             <Badge variant="outline">{section.section_type}</Badge>
                           </div>
                           <div className="flex gap-2">
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => setEditingSection(section)}
                             >
                               <Edit className="h-4 w-4" />
                             </Button>
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => deleteSection(section.id)}
                             >
                               <Trash2 className="h-4 w-4" />
                             </Button>
                           </div>
                         </div>
                       </CardHeader>
                       <CardContent>
                         <div className="prose prose-sm max-w-none">
                           <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                             {typeof section.content === 'string' ? section.content : section.content.text || 'No content'}
                           </p>
                         </div>
                       </CardContent>
                     </Card>
                   ))}
                   </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
